import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const BASE_URL = 'http://localhost:3000/';
const CWD = process.cwd();

function remapCoverage(coverage) {
  return coverage.map(entry => {
    const url = entry.url ?? '';
    if (url.startsWith(BASE_URL)) {
      const rel = url.slice(BASE_URL.length);
      const abs = path.join(CWD, rel);
      return { ...entry, url: pathToFileURL(abs).href };
    }
    return entry;
  });
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.coverage.startJSCoverage({ resetOnNavigation: false });
    await use(page);
    const coverage = await page.coverage.stopJSCoverage();
    const remapped = remapCoverage(coverage);
    const dir = path.join(CWD, '.nyc_output');
    fs.mkdirSync(dir, { recursive: true });
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    fs.writeFileSync(
      path.join(dir, `${id}.json`),
      JSON.stringify({ result: remapped })
    );
  },
});

export { expect } from '@playwright/test';
