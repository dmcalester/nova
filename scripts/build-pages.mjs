import { build } from "esbuild";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const DIST = "dist";
const TMP = "scripts/.tmp";

const JS_ENTRIES = [
   "js/nova-temporal/nova-datetime.js",
   "js/nova-temporal/nova-date.js",
   "js/nova-temporal/nova-time.js",
   "js/nova-temporal/nova-duration.js",
   "js/nova-temporal/nova-temporal-group.js",
];

const CSS_ENTRIES = [
   "css/nova-tokens.css",
   "css/nova-colors.css",
   "css/nova.css",
   "css/nova-form-patterns.css",
   "css/nova-form-controls.css",
   "css/components/nova-card.css",
];

await rm(DIST, { recursive: true, force: true });
await rm(TMP, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await mkdir(TMP, { recursive: true });

await writeFile(
   `${TMP}/entry.js`,
   JS_ENTRIES.map((p) => `import "../../${p}";`).join("\n"),
);
await writeFile(
   `${TMP}/entry.css`,
   CSS_ENTRIES.map((p) => `@import "../../${p}";`).join("\n"),
);

await build({
   entryPoints: [`${TMP}/entry.js`],
   bundle: true,
   minify: true,
   format: "esm",
   target: "es2022",
   outfile: `${DIST}/nova.min.js`,
});

await build({
   entryPoints: [`${TMP}/entry.css`],
   bundle: true,
   minify: true,
   outfile: `${DIST}/nova.min.css`,
});

await cp("docs", DIST, {
   recursive: true,
   filter: (src) => !src.endsWith(".DS_Store"),
});

async function* walkHtml(dir) {
   for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) yield* walkHtml(path);
      else if (entry.name.endsWith(".html")) yield path;
   }
}

const LINK_RE = /\s*<link rel="stylesheet" href="\/css\/[^"]+"\s*\/?>\n?/g;
const SCRIPT_RE = /\s*<script type="module" src="\/js\/nova-temporal\/[^"]+"><\/script>\n?/g;

for await (const file of walkHtml(DIST)) {
   let html = await readFile(file, "utf8");
   const rel = relative(DIST, file);
   const depth = rel.split("/").length - 1;
   const prefix = depth === 0 ? "" : "../".repeat(depth);

   html = html.replace(LINK_RE, "");
   html = html.replace(SCRIPT_RE, "");

   const inject =
      `    <link rel="stylesheet" href="${prefix}nova.min.css" />\n` +
      `    <script type="module" src="${prefix}nova.min.js"></script>\n  `;
   html = html.replace(/(\s*)<\/head>/, `\n${inject}$1</head>`);

   await writeFile(file, html);
}

await rm(TMP, { recursive: true, force: true });
console.log(`Built ${DIST}/`);
