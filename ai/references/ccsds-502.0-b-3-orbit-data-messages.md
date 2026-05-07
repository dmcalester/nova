---
bundle: nova-temporal :: bundled reference
document-id: CCSDS 502.0-B-3
document-title: Orbit Data Messages
source-url: https://ccsds.org/Pubs/502x0b3e1.pdf
fetched: 2026-04-28
source-sha256: 97d1687b4a461ffdf965b9b65923820cc6aa9d1d1c4d4df77a598a53d4a49d81
source-bytes: 2346017
converter: pdftotext -layout (poppler) + markdown post-processing
attribution: Derived from a CCSDS publication. Per the CCSDS Reproduction
  Permission Statement (https://ccsds.org/publications/): "In general,
  reasonable reuse of materials published in CCSDS documents is permitted
  with attribution." For organizations that require formal written
  permission, contact secretariat@mailman.ccsds.org.
notice: This file is a derivative work. The original document at the
  source URL above is authoritative; the agent must use this extract
  only as a verbatim quote source, never as a substitute for the
  original.
---



        ORBIT DATA
        MESSAGES

        ORBIT DATA
        MESSAGES

                                    AUTHORITY

                    Issue:        Recommended Standard, Issue 3
                    Date:         April 2023
                    Location:     Washington, DC, USA

This document has been approved for publication by the Management Council of the
Consultative Committee for Space Data Systems (CCSDS) and represents the consensus
technical agreement of the participating CCSDS Member Agencies. The procedure for
review and authorization of CCSDS documents is detailed in Organization and Processes for
the Consultative Committee for Space Data Systems (CCSDS A02.1-Y-4), and the record of
Agency participation in the authorization of this document can be obtained from the CCSDS
Secretariat at the email address below.

This document is published and maintained by:

       National Aeronautics and Space Administration
       Washington, DC, USA
       Email: secretariat@mailman.ccsds.org

                            STATEMENT OF INTENT
The Consultative Committee for Space Data Systems (CCSDS) is an organization officially
established by the management of its members. The Committee meets periodically to address
data systems problems that are common to all participants, and to formulate sound technical
solutions to these problems. Inasmuch as participation in the CCSDS is completely
voluntary, the results of Committee actions are termed Recommended Standards and are
not considered binding on any Agency.

This Recommended Standard is issued by, and represents the consensus of, the CCSDS
members. Endorsement of this Recommendation is entirely voluntary. Endorsement,
however, indicates the following understandings:
   o   Whenever a member establishes a CCSDS-related standard, this standard will be in
       accord with the relevant Recommended Standard. Establishing such a standard
       does not preclude other provisions which a member may develop.
   o   Whenever a member establishes a CCSDS-related standard, that member will
       provide other CCSDS members with the following information:
          -- The standard itself.
          -- The anticipated date of initial operational capability.
          -- The anticipated duration of operational service.
   o   Specific service arrangements shall be made via memoranda of agreement. Neither
       this Recommended Standard nor any ensuing standard is a substitute for a
       memorandum of agreement.

No later than five years from its date of issuance, this Recommended Standard will be
reviewed by the CCSDS to determine whether it should: (1) remain in effect without change;
(2) be changed to reflect the impact of new technologies, new requirements, or new
directions; or (3) be retired or canceled.

In those instances when a new version of a Recommended Standard is issued, existing
CCSDS-related member standards and implementations are not negated or deemed to be non-
CCSDS compatible. It is the responsibility of each member to determine when such
standards or implementations are to be modified. Each member is, however, strongly
encouraged to direct planning for its new standards and implementations towards the later
version of the Recommended Standard.

                                     FOREWORD
This document is a Recommended Standard for Orbit Data Messages and has been prepared
by the CCSDS. The set of orbit data messages described in this Recommended Standard is
the baseline concept for trajectory representation in data interchange applications that are
cross-supported between Agencies of the CCSDS.

This Recommended Standard establishes a common framework and provides a common
basis for the interchange of orbit and orbit-relevant data. It allows implementing
organizations within each Agency to proceed coherently with the development of compatible
derived standards for the flight and ground systems that are within their cognizance. Derived
Agency standards may implement only a subset of the optional features allowed by the
Recommended Standard and may incorporate features not addressed by this Recommended
Standard.

Attention is drawn to the possibility that some of the elements of this document may be the
subject of patent rights. CCSDS has processes for identifying patent issues and for securing
from the patent holder agreement that all licensing policies are reasonable and non-
discriminatory. However, CCSDS does not have a patent law staff, and CCSDS shall not be
held responsible for identifying any or all such patent rights.

Through the process of normal evolution, it is expected that expansion, deletion, or
modification of this document may occur. This Recommended Standard is therefore subject
to CCSDS document management and change control procedures, which are defined in
Organization and Processes for the Consultative Committee for Space Data Systems
(CCSDS A02.1-Y-4). Current versions of CCSDS documents are maintained at the CCSDS
Web site:

                                   http://www.ccsds.org/

Questions relating to the contents or status of this document should be sent to the CCSDS
Secretariat at the email address indicated on page i.

At time of publication, the active Member and Observer Agencies of the CCSDS were:
Member Agencies
  – Agenzia Spaziale Italiana (ASI)/Italy.
  – Canadian Space Agency (CSA)/Canada.
  – Centre National d’Etudes Spatiales (CNES)/France.
  – China National Space Administration (CNSA)/People’s Republic of China.
  – Deutsches Zentrum für Luft- und Raumfahrt (DLR)/Germany.
  – European Space Agency (ESA)/Europe.
  – Federal Space Agency (FSA)/Russian Federation.
  – Instituto Nacional de Pesquisas Espaciais (INPE)/Brazil.
  – Japan Aerospace Exploration Agency (JAXA)/Japan.
  – National Aeronautics and Space Administration (NASA)/USA.
  – UK Space Agency/United Kingdom.
Observer Agencies
   –   Austrian Space Agency (ASA)/Austria.
   –   Belgian Science Policy Office (BELSPO)/Belgium.
   –   Central Research Institute of Machine Building (TsNIIMash)/Russian Federation.
   –   China Satellite Launch and Tracking Control General, Beijing Institute of Tracking and
       Telecommunications Technology (CLTC/BITTT)/China.
   –   Chinese Academy of Sciences (CAS)/China.
   –   China Academy of Space Technology (CAST)/China.
   –   Commonwealth Scientific and Industrial Research Organization (CSIRO)/Australia.
   –   Danish National Space Center (DNSC)/Denmark.
   –   Departamento de Ciência e Tecnologia Aeroespacial (DCTA)/Brazil.
   –   Electronics and Telecommunications Research Institute (ETRI)/Korea.
   –   European Organization for the Exploitation of Meteorological Satellites (EUMETSAT)/Europe.
   –   European Telecommunications Satellite Organization (EUTELSAT)/Europe.
   –   Geo-Informatics and Space Technology Development Agency (GISTDA)/Thailand.
   –   Hellenic National Space Committee (HNSC)/Greece.
   –   Hellenic Space Agency (HSA)/Greece.
   –   Indian Space Research Organization (ISRO)/India.
   –   Institute of Space Research (IKI)/Russian Federation.
   –   Korea Aerospace Research Institute (KARI)/Korea.
   –   Ministry of Communications (MOC)/Israel.
   –   Mohammed Bin Rashid Space Centre (MBRSC)/United Arab Emirates.
   –   National Institute of Information and Communications Technology (NICT)/Japan.
   –   National Oceanic and Atmospheric Administration (NOAA)/USA.
   –   National Space Agency of the Republic of Kazakhstan (NSARK)/Kazakhstan.
   –   National Space Organization (NSPO)/Chinese Taipei.
   –   Naval Center for Space Technology (NCST)/USA.
   –   Netherlands Space Office (NSO)/The Netherlands.
   –   Research Institute for Particle & Nuclear Physics (KFKI)/Hungary.
   –   Scientific and Technological Research Council of Turkey (TUBITAK)/Turkey.
   –   South African National Space Agency (SANSA)/Republic of South Africa.
   –   Space and Upper Atmosphere Research Commission (SUPARCO)/Pakistan.
   –   Swedish Space Corporation (SSC)/Sweden.
   –   Swiss Space Office (SSO)/Switzerland.
   –   United States Geological Survey (USGS)/USA.

                             DOCUMENT CONTROL

Document      Title                            Date         Status

CCSDS         Orbit Data Messages,             September    Original issue,
502.0-B-1     Issue 1                          2004         superseded

CCSDS         Orbit Data Messages, Recommended November     Issue 2, superseded
502.0-B-2     Standard, Issue 2                2009

CCSDS         Orbit Data Messages, Recommended April 2023   Current issue:
502.0-B-3     Standard, Issue 3                              changes from the
                                                             previous issue are
                                                             documented in annex J
                                                             (note).

CCSDS         Editorial change 1               May 2023     Corrects errant cross-
502.0-B-3                                                   refence links, adjusts
EC 1                                                        some minor format and
                                                            page-layout elements.

NOTE – Changes from the previous issue are too numerous to permit meaningful
       application of change bars.

                                                      CONTENTS
Section                                                                                                                       Page

# 1 INTRODUCTION .......................................................................................................... 1-1

    1.1     PURPOSE AND SCOPE ........................................................................................ 1-1
    1.2     APPLICABILITY ................................................................................................... 1-2
    1.3     RATIONALE .......................................................................................................... 1-2
    1.4     DOCUMENT STRUCTURE .................................................................................. 1-2
    1.5     CONVENTIONS AND DEFINITIONS ................................................................. 1-3
    1.6     REFERENCES ........................................................................................................ 1-5

# 2 OVERVIEW ................................................................................................................... 2-1

    2.1     ORBIT PARAMETER MESSAGE ........................................................................ 2-1
    2.2     ORBIT MEAN-ELEMENTS MESSAGE .............................................................. 2-1
    2.3     ORBIT EPHEMERIS MESSAGE .......................................................................... 2-2
    2.4     ORBIT COMPREHENSIVE MESSAGE ............................................................... 2-2
    2.5     EXCHANGE OF MULTIPLE MESSAGES .......................................................... 2-3
    2.6     DEFINITIONS ........................................................................................................ 2-3

# 3 ORBIT PARAMETER MESSAGE .............................................................................. 3-1

    3.1     GENERAL .............................................................................................................. 3-1
    3.2     OPM CONTENT/STRUCTURE ............................................................................ 3-2

# 4 ORBIT MEAN-ELEMENTS MESSAGE .................................................................... 4-1

    4.1     GENERAL .............................................................................................................. 4-1
    4.2     OMM CONTENT/STRUCTURE ........................................................................... 4-2

# 5 ORBIT EPHEMERIS MESSAGE................................................................................ 5-1

    5.1     GENERAL .............................................................................................................. 5-1
    5.2     OEM CONTENT/STRUCTURE ............................................................................ 5-1

# 6 ORBIT COMPREHENSIVE MESSAGE .................................................................... 6-1

    6.1     GENERAL .............................................................................................................. 6-1
    6.2     OCM STRUCTURE AND OVERARCHING REQUIREMENTS ........................ 6-2

# 7 ORBIT DATA MESSAGE SYNTAX ........................................................................... 7-1

    7.1     OVERVIEW............................................................................................................ 7-1
    7.2     GENERAL .............................................................................................................. 7-1

                                           CONTENTS (continued)
Section                                                                                                                      Page

    7.3  ODM LINES ........................................................................................................... 7-1
    7.4  ORBIT DATA MESSAGES IN ‘KEYWORD = VALUE NOTATION’
         (I.E., NON-XML) AND ORDER OF ASSIGNMENT STATEMENTS ............... 7-2
    7.5 VALUES ................................................................................................................. 7-3
    7.6 OCM VECTOR DATA TYPE................................................................................ 7-4
    7.7 UNITS IN THE ORBIT DATA MESSAGES ........................................................ 7-5
    7.8 COMMENTS IN THE ORBIT DATA MESSAGES ............................................. 7-6
    7.9 ORBIT DATA MESSAGE KEYWORDS ............................................................. 7-8
    7.10 VALIDATION AND INGEST OF KVN CONTENT VIA REGULAR
         EXPRESSIONS (OR ‘REGEX’) ............................................................................ 7-9

# 8 CONSTRUCTING AN ODM/XML INSTANCE ........................................................ 8-1

    8.1 OVERVIEW ........................................................................................................... 8-1
    8.2 XML VERSION...................................................................................................... 8-2
    8.3 BEGINNING THE INSTANTIATION: ROOT ELEMENT TAG ....................... 8-2
    8.4 THE STANDARD ODM/XML HEADER SECTION ........................................... 8-3
    8.5 THE ODM/XML BODY SECTION....................................................................... 8-4
    8.6 THE ODM/XML METADATA SECTION ........................................................... 8-4
    8.7 THE ODM/XML DATA SECTION ....................................................................... 8-4
    8.8 CREATING AN OPM INSTANTIATION ............................................................ 8-5
    8.9 CREATING AN OMM INSTANTIATION ........................................................... 8-6
    8.10 CREATING AN OEM INSTANTIATION ............................................................ 8-8
    8.11 CREATING AN OCM INSTANTIATION .......................................................... 8-10
    8.12 CREATING A COMBINED INSTANTIATION................................................. 8-13
    8.13 SPECIAL SYNTAX RULES FOR ODM/XML ................................................... 8-16

ANNEX A IMPLEMENTATION CONFORMANCE STATEMENT
        PROFORMA (NORMATIVE) .................................................................... A-1
ANNEX B VALUES FOR SELECTED KEYWORDS (NORMATIVE) .................... B-1
ANNEX C SECURITY, SANA, AND PATENT CONSIDERATIONS
        (INFORMATIVE) .......................................................................................... C-1
ANNEX D ABBREVIATIONS AND ACRONYMS (INFORMATIVE) ..................... D-1
ANNEX E RATIONALE FOR THIS STANDARD (INFORMATIVE) ..................... E-1
ANNEX F TECHNICAL MATERIAL AND CONVENTIONS FOR
        ODM DATA (INFORMATIVE) ................................................................... F-1
ANNEX G ODM EXAMPLES (INFORMATIVE) ........................................................ G-1
ANNEX H INFORMATIVE REFERENCES (INFORMATIVE) ................................ H-1
ANNEX I ITEMS FOR AN INTERFACE CONTROL DOCUMENT
        (INFORMATIVE) ........................................................................................... I-1
ANNEX J CHANGES VERSUS PREVIOUS VERSION (INFORMATIVE) ............ J-1

                                         CONTENTS (continued)
Figure                                                                                                               Page

6-1  LTM Covariance Element Ordering following Time Tag .......................................... 6-29
6-2  UTM Covariance Element Ordering following Time Tag .......................................... 6-29
6-3  Full Covariance Element Ordering following Time Tag ............................................ 6-29
6-4  LTM Covariance/Correlation Element Ordering following Time Tag ....................... 6-30
6-5  UTM Covariance/Correlation Element Ordering following Time Tag ...................... 6-30
8-1  ODM/XML Basic Structure .......................................................................................... 8-1
8-2  Comparison of Single Message OPM with NDM Combined Instantiation ................ 8-14
8-3  NDM Combined Instantiation Showing Mix of ODMs and Use of Attributes .......... 8-15
F-1  Depiction of Optimally Enclosing Box and Definitions of MAX, INT,
     and MIN Orientation Vectors Relative to OEB Parent Frame......................................F-2
F-2 Depiction of Optical Viewing CATS Angle Geometry ................................................F-5
F-3 Diagram of Time-based Duty Cycle (DC_TYPE = ‘TIME’) .......................................F-6
F-4 Diagram of a Rotating Spacecraft Body’s Progression through an Inertial
     Clock Angle-based Duty Cycle (DC_TYPE = ‘TIME_AND_ANGLE’).....................F-7
F-5 Regex Pattern for CCSDS Timecode ..........................................................................F-10
F-6 Regex Pattern Matching Sequence for CCSDS Timecode .........................................F-11
F-7 Regex for a Non-Decimal String.................................................................................F-12
F-8 Regex for Free-Text String .........................................................................................F-12
F-9 Regex for String Containing Numerical Value with Optional Units ..........................F-12
F-10 Regex for String Containing Numerical Value with Optional Units ..........................F-13
G-1 Simple OPM File Example .......................................................................................... G-1
G-2 OPM File Example with Optional Keplerian Elements and Two Maneuvers ............. G-2
G-3 File Example with Covariance Matrix ......................................................................... G-3
G-4 OPM File Example with Optional Keplerian Elements, Covariance Matrix,
     and a User-defined Parameter ...................................................................................... G-4
G-5 OPM File Example in XML Format ............................................................................ G-5
G-6 Example Two Line Element Set .................................................................................. G-6
G-7 OMM File Example without Covariance Matrix ......................................................... G-6
G-8 OMM File Example with Covariance Matrix .............................................................. G-7
G-9 OMM with Units and a User-defined Parameter ......................................................... G-8
G-10 OMM File Example in XML Format ........................................................................... G-9
G-11 OEM Example with No Acceleration, No Covariance .............................................. G-10
G-12 OEM Example with Optional Accelerations.............................................................. G-11
G-13 OEM Example with Optional Covariance Matrices .................................................. G-12
G-14 OEM File Example in XML Format .......................................................................... G-13
G-15 Simple/Succinct OCM Example with Only Cartesian PVA Ephemeris .................... G-15
G-16 OCM Example with Space Object Characteristics and Perturbations ....................... G-16
G-17 OCM Example with Deployed Objects and Low-level Thrusting Maneuver
     during Deployment to Make ‘String-of-Pearls’ Deployment .................................... G-17
G-18 OCM Example with Multiple Orbit Time Histories, a Maneuver, OD,
     Cartesian, and Keplerian Ephemeris .......................................................................... G-19
G-19 OCM Example with Covariance Matrix Time Histories in Two Element Set Types .... G-20

                                             CONTENTS (continued)
Figure                                                                                                                         Page

G-20 OCM Example in XML Format ................................................................................. G-21
G-21 Aggregating Multiple ODMs into a Single NDM File .............................................. G-22
G-22 Aggregating OPM, OMM, OEM, and OCM in a Single Navigation Data
     Message XML ............................................................................................................ G-25

Table

3-1  OPM Header.................................................................................................................. 3-3
3-2  OPM Metadata .............................................................................................................. 3-4
3-3  OPM Data...................................................................................................................... 3-6
4-1  OMM Header ................................................................................................................ 4-3
4-2  OMM Metadata ............................................................................................................. 4-4
4-3  OMM Data .................................................................................................................... 4-6
5-1  OEM File Layout Specifications................................................................................... 5-2
5-2  OEM Header ................................................................................................................. 5-3
5-3  OEM Metadata .............................................................................................................. 5-4
5-4  OEM Covariance Keywords ......................................................................................... 5-8
6-1  OCM File Layout and Ordering Specification .............................................................. 6-3
6-2  OCM Header ................................................................................................................. 6-5
6-3  OCM Metadata .............................................................................................................. 6-6
6-4  OCM Data: Trajectory State Time History ................................................................. 6-15
6-5  OCM Data: Space Object Physical Characteristics .................................................... 6-22
6-6  OCM Data: Covariance Time History ........................................................................ 6-32
6-7  OCM Data: Maneuver Specification........................................................................... 6-38
6-8  OCM Data: Selectable Propulsive (i.e., Non-Deployment) Maneuver Fields
     in the Maneuver Time History Data ........................................................................... 6-46
6-9 OCM Data: Selectable Deployment Fields in the Maneuver Time History Data ....... 6-47
6-10 OCM Data: Perturbations Specification ..................................................................... 6-49
6-11 OCM Data: Orbit Determination Data ........................................................................ 6-54
6-12 OCM Data: User-Defined Parameters ........................................................................ 6-58
8-1 ODM/XML Root Element Tags.................................................................................... 8-2
8-2 Examples of Units in OPM/XML ................................................................................. 8-5
8-3 OPM/XML Tag Delimiters ........................................................................................... 8-6
8-4 Examples of Units in OMM/XML ................................................................................ 8-7
8-5 OMM/XML Tag Delimiters .......................................................................................... 8-8
8-6 Examples of Units in OEM/XML ................................................................................. 8-9
8-7 OEM/XML Tag Delimiters ......................................................................................... 8-10
8-8 Examples of Units in OCM/XML ............................................................................... 8-11
8-9 OCM/XML Tag Delimiters......................................................................................... 8-12
E-1 Services Available with Orbit Data Messages ............................................................. E-5
F-1 Space Surveillance Observation Product Description ................................................F-16

# 1 INTRODUCTION
## 1.1 PURPOSE AND SCOPE

This Orbit Data Messages (ODM) Recommended Standard specifies four standard message
formats for use in transferring spacecraft orbit information between space agencies and
commercial or governmental spacecraft operators: The Orbit Parameter Message (OPM), the
Orbit Mean-Elements Message (OMM), the Orbit Ephemeris Message (OEM), and the Orbit
Comprehensive Message (OCM). Such exchanges are used for:
      a) pre-flight planning for tracking or navigation support;
      b) scheduling tracking support;
      c) carrying out tracking operations (sometimes called metric predicts);
      d) performing orbit comparisons;
      e) carrying out navigation operations such as orbit propagation and orbit reconstruction;
      f) assessing mutual physical and electromagnetic interference among satellites orbiting
         the same celestial body (primarily Earth, Moon, and Mars at present);
      g) performing orbit conjunction (collision avoidance) studies; and
      h) developing and executing collaborative maneuvers to mitigate interference or
         enhance mutual operations.

This Recommended Standard includes sets of requirements and criteria that the message
formats have been designed to meet. For exchanges in which these requirements do not
capture the needs of the participating agencies and satellite operators, another mechanism
may be selected.

The ODM Recommended Standard is an international standard published under the auspices
of CCSDS and International Standards Organization (ISO) Technical Committee 20,
Subcommittee 13, developed jointly and in concert with the ISO TC20/SC14. As such, this
CCSDS standard is also properly labeled as ISO 26900.

The recommended Orbit Data Message format is ASCII (reference [4]).

This ODM document describes both ‘Keyword = Value Notation’ (KVN) as well as
Extensible Markup Language (XML) (reference [5]) formatted messages. Selection of KVN
or XML format should be mutually agreed between message exchange partners.

NOTE – As currently specified, an OPM, OMM, or OEM file is to represent orbit data for
       a single spacecraft, and the OCM is to represent orbit data for either a single
       spacecraft or single parent spacecraft of a parent/child spacecraft deployment
       scenario. It is possible that the architecture may support multiple spacecraft per
       file; this could be considered in the future.

## 1.2 APPLICABILITY

The Orbit Data Message family of standardized orbit messages is applicable to all phases of
the spacecraft and launch vehicle life cycle. The rationale behind the design of each orbit
data message is described in annex E and may help the application engineer to select a
suitable message. Definition of the orbit accuracy underlying a particular orbit message is
outside of the scope of this Recommended Standard and should be mutually agreed upon
between message exchange partners (or specified via COMMENT sections in the message
itself). Applicability information specific to each orbit data message format appears in
sections 3, 4, 5, and 6, as well as in annex subsections E2.4 and E2.5.

This Recommended Standard is applicable only to the message format and content, but not to
its transmission. The transmission of the message between agencies and operators is outside
the scope of this document and should be mutually agreed between message exchange
partners.

Description of the message formats based on the use of XML is detailed in section 8.

## 1.3 RATIONALE

This update to version 2 of the Orbit Data Messages adds a fourth message type, the OCM,
based on collaboration of the CCSDS Navigation Working Group and the ISO Technical
Committee 20, Subcommittee 14, Working Group 3 (ISO TC20/SC14/WG3). A full list of
the changes in this document is in annex J.

## 1.4 DOCUMENT STRUCTURE

Section 2 provides a brief overview of the CCSDS-recommended Orbit Data Message types,
the OPM, OMM, OEM, and OCM.

Section 3 provides details about the structure and content of the OPM.

Section 4 provides details about the structure and content of the OMM.

Section 5 provides details about the structure and content of the OEM.

Section 6 provides details about the structure and content of the OCM.

Section 7 discusses the syntax considerations of the set of Orbit Data Messages (OPM,
OMM, OEM, and OCM).

Section 8 provides details on the XML instantiations of the OPM, OMM, OEM, and OCM.

Following the principal content of the document, there are several annexes, both normative
and informative, to guide the ODM user.

## 1.5 CONVENTIONS AND DEFINITIONS

### 1.5.1 NOTATION

1.5.1.1     Unit Notations

The following conventions for unit notations apply throughout this Recommended Standard,
with message-specific guidance provided in 7.7. Units are drawn from the International
System of Units (SI); units are either SI base units, SI derived units, or units outside the SI
that are accepted for use with the SI (reference [1]). Except as noted, the units used within
this document are as follows:
      –   d: days, 86400 SI seconds;
      –   kg: kilograms;
      –   km: kilometers;
      –   m: meters;
      –   n/a: (units are not applicable);
      –   %: percent;
      –   s: SI seconds;
      –   SFU: Solar Flux Units, equivalent to 10-22 W/(m**2*Hz);
      –   W: watts.

1.5.1.2     General

The following notational conventions are used in this document:
      a) multiplication of units is denoted with a single asterisk ‘*’ (e.g., ‘kg*s’);
      b) exponents of units are denoted with a double asterisk ‘**’ (e.g., m2 = m**2);
      c) square roots of units are denoted by the same exponent notation of a double asterisk
         ‘**’ (e.g., √𝑘𝑘 = km**0.5);
      d) division of units is denoted with a single forward slash ‘/’ (e.g., m/s);
      e) the usual order of operations ordering applies (e.g., exponents before multiplication).

### 1.5.2 NOMENCLATURE

1.5.2.1    Normative Text

The following conventions apply for the normative specifications in this Recommended
Standard:
   a) the words ‘shall’ and ‘must’ imply a binding and verifiable specification;
   b) the word ‘should’ implies an optional, but desirable, specification;
   c) the word ‘may’ implies an optional specification;
   d) the words ‘is’, ‘are’, and ‘will’ imply statements of fact.

NOTE – These conventions do not imply constraints on diction in text that is clearly
       informative in nature.

1.5.2.2    Informative Text

In the normative sections of this document, informative text is set off from the normative
specifications either in notes or under one of the following subsection headings:
   –      Overview;
   –      Background;
   –      Rationale;
   –      Discussion.

### 1.5.3 DEFINITIONS

For the purposes of this document, the following definitions apply:
   a) the word ‘agencies’ may also be construed as meaning ‘satellite operators’ or
      ‘satellite service providers’;
   b) the word ‘participant’ denotes an entity that can acquire or broadcast navigation
      messages and/or radio frequencies, for example, a spacecraft, a tracking station, a
      tracking instrument, or an agency/operator;
   c) the notation ‘n/a’ signifies ‘not applicable’;
   d) depending on context, the term ‘ODM’ may be used to refer to this document or may
      be used to refer collectively to the OPM, OMM, OEM, and OCM messages;
   e) an ‘observation’ is a unique measurement set of a satellite’s state from a single sensor
      configuration at a single time (e.g., azimuth from a single sensor at a single time);

      f) a ‘sensor track’ is a set of observations within a specified number of minutes for the
         same object, observed by the same sensor configuration, where each observation is
         within a specified number of minutes (which is dependent on the orbit regime of the
         object) of the other observations in the track (e.g., a set of 10 two-way transponder
         range measurements from the same sensor using the same transponder on the
         satellite), and where the number of minutes could alternately be defined as the time
         between start and stop of the measurement ‘session’ or signal modulation that enables
         metric tracking.

## 1.6 REFERENCES

The following publications contain provisions which, through reference in this text,
constitute provisions of this document. At the time of publication, the editions indicated
were valid. All publications are subject to revision, and users of this document are
encouraged to investigate the possibility of applying the most recent editions of the
publications indicated below. The CCSDS Secretariat maintains a register of currently valid

[1]    The International System of Units (SI). 8th ed., 2006; updated in 2014. Sèvres, France:
       BIPM, 2006.

[2]    Time Code Formats. Issue 4. Recommendation for Space Data System Standards (Blue
       Book), CCSDS 301.0-B-4. Washington, D.C.: CCSDS, November 2010.

[3]    “Online Index of Objects Launched into Outer Space.” United Nations Office for Outer
       Space Affairs (UNOOSA). https://www.unoosa.org/oosa/osoindex/.

[4]    Information Technology—8-Bit Single-Byte Coded Graphic Character Sets—Part 1:
       Latin Alphabet No. 1. International Standard, ISO/IEC 8859-1:1998. Geneva: ISO,
       1998.

[5]    XML Specification for Navigation Data Messages. Issue 3. Recommendation for Space
       Data System Standards (Blue Book), CCSDS 505.0-B-3. Washington, D.C.: CCSDS,
       May 2023.

[6]    Paul V. Biron and Ashok Malhotra, eds. XML Schema Part 2: Datatypes. 2nd ed. W3C
       Recommendation.

[7]    IEEE Standard for Floating-Point Arithmetic. 3rd ed. IEEE Std 754-2019. New York:
       IEEE, 2019.

[8]    Henry S. Thompson, et al., eds. XML Schema Part 1: Structures. 2nd ed. W3C
       Recommendation.

[9]    Tracking Data Message. Issue 2. Recommendation for Space Data System Standards
       (Blue Book), CCSDS 503.0-B-2. Washington, D.C.: CCSDS, June 2020.

[10] Attitude Data Messages. Issue 1. Recommendation for Space Data System Standards
     (Blue Book), CCSDS 504.0-B-1. Washington, D.C.: CCSDS, May 2008.

[11] “CCSDS Navigation Standards Normative Annexes.” Space Assigned Numbers
     Authority. https://sanaregistry.org/r/navigation_standard_normative_annexes.

[12] Re-entry Data Message. Issue 1. Recommendation for (Blue Book), CCSDS 508.1-B-1.
     Washington, D.C.: CCSDS, November 2019.

[13] Pointing Request Message. Issue 1. Recommendation for (Blue Book), CCSDS 509.0-
     B-1. Washington, D.C.: CCSDS, February 2018.

[14] Conjunction Data Message. Issue 1. Recommendation for Space Data System
     Standards (Blue Book), CCSDS 508.0-B-1. Washington, D.C.: CCSDS, June 2013.

# 2 OVERVIEW
## 2.1 ORBIT PARAMETER MESSAGE

An OPM specifies the position and velocity of a single object at a specified epoch.
Optionally, osculating Keplerian elements may be provided. It should be noted that a
sequence of OPMs for either a single object or for multiple objects can be aggregated into a
single Navigation Data Message (NDM) XML file as described in 8.12 and shown in
annex G. This message is suited to exchanges that (1) involve automated interaction and/or
human interaction, and (2) do not require high-fidelity dynamic modeling.

The OPM requires the use of a propagation technique to determine the position and velocity
at times different from the specified epoch, leading to a higher level of effort for software
implementation than for the OEM.

The OPM also contains an optional 6x6 position/velocity covariance matrix that reflects the
uncertainty of the orbit state and may be used in the propagation process to estimate future
uncertainties.

The OPM allows for modeling of any number of maneuvers (as both finite and instantaneous
events) and simple modeling of solar radiation pressure and atmospheric drag.

Though primarily intended for use by computers, the attributes of the OPM also make it
suitable for applications such as exchanges by email, FAX, or voice, or applications in which
the message is to be frequently interpreted by humans.

## 2.2 ORBIT MEAN-ELEMENTS MESSAGE

The OMM contains the orbital characteristics of a single object at a specified epoch,
expressed in mean Keplerian elements: mean motion, eccentricity, inclination, right
ascension of ascending node, argument of perigee, and mean anomaly. These are adequate
for providing the initial mean state of analytical and semi-analytical orbit models. In
addition, the OMM contains values for parameters that facilitate the modeling of non-
conservative forces for various mean element theories.

It may be noted that a sequence of OMMs for either a single object or for multiple objects
can be aggregated into a single NDM XML file as described in 8.12 and shown in annex G.
The OMM is suited to exchanges that (1) involve automated interaction and/or human
interaction, and (2) do not require high-fidelity dynamic modeling. Such exchanges may be
inter-agency exchanges, or ad hoc exchanges among satellite operators when interface
control documents have not been negotiated. Ad hoc interactions usually involve more than
one satellite, each satellite controlled and operated by a different operating authority.

The OMM includes keywords and values that may be used to generate canonical NORAD Two
Line Element (TLE) sets to accommodate the needs of heritage users (see annex H,
reference [H3]).

The OMM also contains an optional covariance matrix that reflects the uncertainty of the
mean Keplerian elements. This information may be used to determine contact parameters
that encompass uncertainties in predicted future states of orbiting objects of interest.

This message is suited for directing antennas and planning contacts with satellites. It is not
recommended for assessing mutual physical or electromagnetic interference among Earth-
orbiting spacecraft, developing collaborative maneuvers, or propagating precisely the orbits
of active satellites, inactive man-made objects, and near-Earth debris fragments. It is not
suitable for numerical integration of the governing equations.

Though primarily intended for use by computers, the attributes of the OMM also make it
suitable for applications such as exchanges by email, FAX, or voice, or applications in which
the message is to be frequently interpreted by humans.

## 2.3 ORBIT EPHEMERIS MESSAGE

An OEM specifies the position and velocity of a single object at multiple epochs contained
within a specified time range. It should be noted that a sequence of OEMs for either a single
object or for multiple objects can be aggregated into a single NDM XML file as described
in 8.12 and shown in annex G. The OEM is suited to exchanges that (1) involve automated
interaction (e.g., computer-to-computer communication when frequent, fast automated time
interpretation and processing is required), and (2) require higher fidelity or higher precision
dynamic modeling than is possible with the OPM.

The OEM allows for dynamic modeling of any number of gravitational and non-gravitational
accelerations. The OEM requires the use of an interpolation technique to interpret the
position and velocity at times different from the tabular epochs.

The OEM also contains an optional covariance matrix that reflects the uncertainty of the orbit
solution used to generate states in the ephemeris.

## 2.4 ORBIT COMPREHENSIVE MESSAGE

An OCM specifies position and velocity of either a single object or an en masse parent/child
deployment scenario stemming from a single object. It should be noted that a sequence of
OCMs for either a single object or for multiple objects can be aggregated into a single NDM
XML file as described in 8.12 and shown in annex G.

The OCM aggregates and extends OPM, OEM, and OMM content in a single comprehensive
hybrid message (file) and includes the following additional capabilities:
      –   Optional Earth Orientation (UT1 and UTC) at a nearby (relevant) reference epoch;
      –   Optional Leap second specification;

      –   Optional area cross-sections for drag, Solar Radiation Pressure (SRP) perturbations
          modeling;
      –   Optional spacecraft dimensions and orientation information for collision probability
          estimation;
      –   Optional orbit states (specified using one or more of Cartesian and orbit elements and
          reference frames) for a single or parent object at either a single epoch or as a time
          history (ephemeris);
      –   Optional covariance matrix of selectable/arbitrary order for a single or parent object
          at either a single epoch or as a time history (ephemeris) that reflects the uncertainty of
          the orbit solution or simulation used to obtain the nominal states in the orbit state(s);
      – Optional covariance content options (e.g., Cartesian 3x3, 6x6, 7x7, or any
        combination of order, reference frame, and orbit elements);
      –   Optional maneuver specification (impulsive or finite burn);
      –   Optional perturbations model specification;
      –   Optional orbit determination data and metrics.

The OCM simultaneously emphasizes flexibility and message conciseness by offering
extensive optional content while minimizing mandatory content. The OCM is well-suited for
exchanges that (1) involve automated interaction (e.g., computer-to-computer communication
when frequent, fast automated time interpretation and processing is required), and (2) involve
regular orbit data transfer for numerous objects (e.g., 200,000) using minimal network
bandwidth, disk storage, and quantity of files. The OCM allows the user, in a single
message/file, to either embed high-fidelity orbit propagation into an ephemeris time history
(akin to the OEM ephemeris) or specify orbital states that can be propagated with supplied
perturbations model parameters (akin to OPM content), or both.

## 2.5 EXCHANGE OF MULTIPLE MESSAGES

For a given object, multiple OPM, OMM, or OEM messages may be provided in a message
exchange session to achieve ephemeris fidelity requirements, whereas a single, self-contained
OCM may be sufficient. If ephemeris information for multiple objects is to be exchanged,
then multiple OPM, OMM, OEM, or OCM files must be used, with the exception that the
OCM supports parent/child deployment scenario specifications in a single message.

## 2.6 DEFINITIONS

Definitions of time systems, reference frames, planetary models, maneuvers, and other
fundamental topics related to the interpretation and processing of state vectors and spacecraft
ephemerides are provided in reference [H1].

# 3 ORBIT PARAMETER MESSAGE
## 3.1 GENERAL

3.1.1 Orbit information may be exchanged between two participants by sending a state
vector (see reference [H1]) for a specified epoch using an OPM. The message recipient must
have an orbit propagator available that is able to propagate the OPM state vector to compute
the orbit at other desired epochs. For this propagation, additional ancillary information
(spacecraft properties such as mass, area, and maneuver planning data, if applicable) may be
included with the message.

3.1.2 Osculating Keplerian elements and the Gravitational Coefficient may be included in
the OPM in addition to the Cartesian state to aid the message recipient in performing
consistency checks. If any Keplerian element is included, the entire set of elements must be
provided.

3.1.3 If participants wish to exchange mean element information, then the OMM or OCM
should be the selected message type (see sections 4 and 6.)

3.1.4    The use of the OPM is best applicable under the following conditions:
      a) an orbit propagator consistent with the models used to develop the orbit data should
         be available at the receiver’s site.
      b) the receiver’s modeling of gravitational forces, solar radiation pressure, atmospheric
         drag, and thrust phases (see reference [H1]) should fulfill accuracy requirements
         established between the exchange partners.

3.1.5    The OPM shall be a plain text file consisting of orbit data for a single object.

NOTE – A sequence of OPMs for either a single object or for multiple objects can be
       aggregated into a single NDM XML file as described in 8.12 and shown in annex G.

3.1.6 The OPM file-naming scheme should be mutually agreed between message exchange
partners.

3.1.7 The method of exchanging OPMs should be mutually agreed between message
exchange partners.

NOTES

1        Detailed syntax rules for the OPM are specified in section 7.

2        Example OPMs and associated supplementary (non-normative) information are
         provided in annex G.

## 3.2 OPM CONTENT/STRUCTURE

### 3.2.1 GENERAL

The OPM shall be represented as a combination of the following:
      a) a header;
      b) metadata (data about data);
      c) data; and
      d) optional comments (explanatory information).

### 3.2.2 OPM HEADER

3.2.2.1    Table 3-1 specifies for each header item:
      a) the keyword to be used;
      b) a short description of the item;
      c) examples of allowed values; and
      d) whether the item is Mandatory (M), Optional (O), or Conditional (C). Conditional
         indicates that the item is mandatory if specified conditions are met (e.g., providing all
         covariance matrix elements if any are provided).

3.2.2.2    Only those keywords shown in table 3-1 shall be used in an OPM header.

                                   Table 3-1: OPM Header

        Keyword                  Description                    Examples of Values          M/O/C
 CCSDS_OPM_VERS     Format version in the form of ‘x.y’, where      3.0                       M
                    ‘y’ is incremented for corrections and minor
                    changes, and ‘x’ is incremented for major
                    changes.
 COMMENT            Comments (allowed in the OPM Header                                        O
                                                                    This is a comment
                    only immediately after the OPM version
                    number). (See 7.8 for formatting rules.)
 CLASSIFICATION     User-defined free-text message                  SBU                        O
                    classification/caveats of this OPM. It is       'Operator-proprietary
                    recommended that selected values be pre-        data; secondary
                                                                    distribution not
                    coordinated between exchanging entities by permitted'
                    mutual agreement.
 CREATION_DATE      File creation date/time in UTC. (For format 2001-11-06T11:17:33           M
                    specification, see 7.5.10.)                     2002-204T15:56:23Z
 ORIGINATOR         Creating agency or operator. Select from the CNES, ESOC, GSFC, GSOC,      M
                    accepted set of values indicated in annex B, JPL, JAXA, INTELSAT,
                    subsection B1 from the ‘Abbreviation’           USAF, INMARSAT
                    column (when present), or the ‘Name’ column
                    when an Abbreviation column is not
                    populated. If desired organization is not
                    listed there, follow procedures to request that
                    originator be added to SANA registry.
 MESSAGE_ID         ID that uniquely identifies a message from a OPM 201113719185              O
                    given originator. The format and content of ABC-12_34
                    the message identifier value are at the
                    discretion of the originator.

### 3.2.3 OPM METADATA

Table 3-2 specifies for each metadata item:
   a) the keyword to be used;
   b) a short description of the item;
   c) examples of allowed values; and
   d) whether the item is Mandatory (M), Optional (O), or Conditional (C). Conditional
      indicates that the item is mandatory if specified conditions are met (e.g., providing all
      covariance matrix elements if any are provided).

3.2.3.1    Only those keywords shown in table 3-2 shall be used in OPM metadata.

NOTE – For some keywords (OBJECT_NAME, OBJECT_ID) there are no definitive lists
       of authorized values maintained by a control authority; references [3] and [11]
       and the organizations provided on the SANA Registry (annex B, subsection B1)
       are the best known sources for authorized values to date.             (For the
       TIME_SYSTEM keyword, see annex B, subsection B3, for guidance and a link
       to the approved set of values.)

                                   Table 3-2: OPM Metadata

     Keyword                           Description                        Examples of Values     M/O/C
COMMENT            Comments (allowed at the beginning of the        This is a comment              O
                   OPM Metadata). (See 7.8 for formatting
                   rules.)
OBJECT_NAME        Spacecraft name for which orbit state data is    EUTELSAT W1                    M
                   provided. While there is no CCSDS-based          MARS PATHFINDER
                   restriction on the value for this keyword, it is STS 106
                                                                    NEAR
                   recommended to use names from the UN Office
                                                                    UNKNOWN
                   of Outer Space Affairs designator index
                   (reference [3], which include Object name and
                   international designator of the participant). If
                   OBJECT_NAME is not listed in reference [3] or
                   the content is either unknown or cannot be
                   disclosed, the value should be set to
                   UNKNOWN.
OBJECT_ID          Object identifier of the object for which orbit 2000-052A                       M
                   state data is provided. While there is no        1996-068A
                   CCSDS-based restriction on the value for this 2000-053A
                   keyword, it is recommended to use the            1996-008A
                                                                    UNKNOWN
                   international spacecraft designator as
                   published in the UN Office of Outer Space
                   Affairs designator index (reference [3]).
                   Recommended values have the format YYYY-
                   NNNP{PP}, where:
                   YYYY = Year of launch.
                   NNN = Three-digit serial number of launch
                                in year YYYY (with leading zeros).
                   P{PP} = At least one capital letter for the
                                identification of the part brought
                                into space by the launch.
                   If the asset is not listed in reference [3], the
                   UN Office of Outer Space Affairs designator
                   index format is not used, or the content is
                   either unknown or cannot be disclosed, the
                   value should be set to UNKNOWN.
CENTER_NAME        Origin of the OPM reference frame, which EARTH                                  M
                   shall be a natural solar system body (planets, EARTH BARYCENTER
                   asteroids, comets, and natural satellites),      MOON
                                                                    SOLAR SYSTEM BARYCENTER
                   including any planet barycenter or the solar
                                                                    SUN
                   system barycenter. Natural bodies shall be       JUPITER BARYCENTER
                   selected from the accepted set of values         STS 106
                   indicated in annex B, subsection B2.             EROS
REF_FRAME       Reference frame in which the state vector and ICRF                                 M
                optional Keplerian element data are given.        ITRF2000
                Use of values other than those in 3.2.3.3 should EME2000
                be documented in an ICD.                          TEME
REF_FRAME_EPOCH Epoch of reference frame, if not intrinsic to the 2001-11-06T11:17:33              C
                definition of the reference frame. (See 7.5.10 2002-204T15:56:23Z
                for formatting rules.)
TIME_SYSTEM     Time system used for state vector, maneuver, UTC, TAI, TT, GPS, TDB,               M
                and covariance data. Use of values other than TCB
                those in 3.2.3.2 should be documented in an
                ICD.

3.2.3.2   Values for the TIME_SYSTEM keyword should be selected from the following set:

Time System Value         Meaning
GMST                      Greenwich Mean Sidereal Time
GPS                       Global Positioning System
MET                       Mission Elapsed Time (note)
MRT                       Mission Relative Time (note)
SCLK                      Spacecraft Clock (receiver) (requires rules for interpretation in
                          ICD)
TAI                       International Atomic Time
TCB                       Barycentric Coordinate Time
TDB                       Barycentric Dynamical Time
TCG                       Geocentric Coordinate Time
TT                        Terrestrial Time
UT1                       Universal Time
UTC                       Coordinated Universal Time

If MET or MRT is chosen as the TIME_SYSTEM, then the epoch of either the start of the
mission for MRT, or of the event for MET, should either be given in a comment in the
message or provided in an ICD. The time system for the start of the mission or the event
should also be provided in the comment or the ICD. If these values are used for the
TIME_SYSTEM, then the times given in the file denote a duration from the mission start or
event. However, for clarity, an ICD should be used to fully specify the interpretation of the
times if these values are to be used. The time format should only utilize three-digit days
from the MET or MRT epoch, not months and days of the months.

3.2.3.3   Values for the REF_FRAME keyword should be selected from the following set:

REF_FRAME Value           Meaning
EME2000                   Earth Mean Equator and Equinox of J2000
GCRF                      Geocentric Celestial Reference Frame
GRC                       Greenwich Rotating Coordinates
ICRF                      International Celestial Reference Frame
ITRF2000                  International Terrestrial Reference Frame 2000
ITRF-93                   International Terrestrial Reference Frame 1993
ITRF-97                   International Terrestrial Reference Frame 1997
MCI                       Mars Centered Inertial
TDR                       True of Date, Rotating
TEME                      True Equator Mean Equinox (only used in OMMs)
TOD                       True of Date

### 3.2.4 OPM DATA

3.2.4.1 Table 3-3 provides an overview of the six logical blocks in the OPM Data section
(State Vector, Osculating Keplerian Elements, Spacecraft Parameters, Position/Velocity
Covariance Matrix, Maneuver Parameters, and User-Defined Parameters), and specifies for
each data item:
    a) the keyword to be used;
    b) a short description of the item;
    c) the units to be used;
    d) whether the item is Mandatory (M), Optional (O), or Conditional (C). An ‘M’
       denotes mandatory keywords that must be included in this section if that particular
       data section is included. Conditional indicates that the item is mandatory if specified
       conditions are met (e.g., providing all covariance matrix elements if any are
       provided).

3.2.4.2    Only those keywords shown in table 3-3 shall be used in OPM data.

NOTE – Requirements relating to the keywords in table 3-3 appear after the table.

                                            Table 3-3: OPM Data

             Keyword                                   Description                           Units          M/O/C
  State Vector Components in the Specified Coordinate System
  COMMENT                          (see 7.8 for formatting rules)                                             O
  EPOCH                            Epoch of state vector & optional Keplerian                                 M
                                   elements (see 7.5.10 for formatting rules)
  X                                Position vector X-component                                km              M
  Y                                Position vector Y-component                                km              M
  Z                                Position vector Z-component                                km              M
  X_DOT                            Velocity vector X-component                               km/s             M
  Y_DOT                            Velocity vector Y-component                               km/s             M
  Z_DOT                            Velocity vector Z-component                               km/s             M
  Osculating Keplerian Elements in the Specified Reference Frame (none or all parameters of this block must be given)
  COMMENT                          (see 7.8 for formatting rules)                                              O
  SEMI_MAJOR_AXIS                  Semi-major axis                                            km               C
  ECCENTRICITY                     Eccentricity                                                                C
  INCLINATION                      Inclination                                                deg              C
  RA_OF_ASC_NODE                   Right ascension of ascending node                          deg              C
  ARG_OF_PERICENTER                Argument of pericenter                                     deg              C
  TRUE_ANOMALY           or        True anomaly or mean anomaly                               deg              C
  MEAN_ANOMALY
  GM                               Gravitational Coefficient (Gravitational            km**3/s**2              C
                                   Constant × Central Mass)
  Spacecraft Parameters (if maneuver is specified, then mass must be provided)
  COMMENT                          (see 7.8 for formatting rules)                                              O

         Keyword                                     Description                       Units       M/O/C
 MASS                             Spacecraft mass                                       kg            C
 SOLAR_RAD_AREA                   Solar Radiation Pressure Area (AR)                   m**2           O
 SOLAR_RAD_COEFF                  Solar Radiation Pressure Coefficient (CR)                           O
 DRAG_AREA                        Drag Area (AD)                                       m**2           O
 DRAG_COEFF                       Drag Coefficient (CD)                                               O
 Position/Velocity Covariance Matrix (6x6 Lower Triangular Form. None or all parameters of the matrix must be
 given. COV_REF_FRAME may be omitted if it is the same as REF_FRAME.)
 COMMENT                         (see 7.8 for formatting rules)                                       O
 COV_REF_FRAME                   Reference frame in which the covariance data are                     C
                                 given. Select from the accepted set of values
                                 indicated in 3.2.4.11.
 CX_X                            Covariance matrix [1,1]                            km**2             C
 CY_X                            Covariance matrix [2,1]                            km**2             C
 CY_Y                            Covariance matrix [2,2]                            km**2             C
 CZ_X                            Covariance matrix [3,1]                            km**2             C
 CZ_Y                            Covariance matrix [3,2]                            km**2             C
 CZ_Z                            Covariance matrix [3,3]                            km**2             C
 CX_DOT_X                        Covariance matrix [4,1]                           km**2/s            C
 CX_DOT_Y                        Covariance matrix [4,2]                           km**2/s            C
 CX_DOT_Z                        Covariance matrix [4,3]                           km**2/s            C
 CX_DOT_X_DOT                    Covariance matrix [4,4]                          km**2/s**2          C
 CY_DOT_X                        Covariance matrix [5,1]                           km**2/s            C
 CY_DOT_Y                        Covariance matrix [5,2]                           km**2/s            C
 CY_DOT_Z                        Covariance matrix [5,3]                           km**2/s            C
 CY_DOT_X_DOT                    Covariance matrix [5,4]                          km**2/s**2          C
 CY_DOT_Y_DOT                    Covariance matrix [5,5]                          km**2/s**2          C
 CZ_DOT_X                        Covariance matrix [6,1]                           km**2/s            C
 CZ_DOT_Y                        Covariance matrix [6,2]                           km**2/s            C
 CZ_DOT_Z                        Covariance matrix [6,3]                           km**2/s            C
 CZ_DOT_X_DOT                    Covariance matrix [6,4]                          km**2/s**2          C
 CZ_DOT_Y_DOT                    Covariance matrix [6,5]                          km**2/s**2          C
 CZ_DOT_Z_DOT                    Covariance matrix [6,6]                          km**2/s**2          C
 Maneuver Parameters (Repeat for each maneuver)
 COMMENT                         (see 7.8 for formatting rules)                                       O
 MAN_EPOCH_IGNITION              Epoch of ignition (see 7.5.10 for formatting rules)                  O
 MAN_DURATION                    Maneuver duration (If = 0, impulsive maneuver)          s            O
 MAN_DELTA_MASS                  Mass change during maneuver (value is < 0)             kg            O
 MAN_REF_FRAME                   Reference frame in which the velocity increment                      O
                                 vector data are given. The user must select from
                                 the accepted set of values indicated in 3.2.4.11.
 MAN_DV_1                        1st component of the velocity increment               km/s           O
 MAN_DV_2                        2nd component of the velocity increment               km/s           O
 MAN_DV_3                        3rd component of the velocity increment               km/s           O

             Keyword                                   Description                        Units   M/O/C
  User-Defined Parameters (all parameters in this section must be described in an ICD).
  USER_DEFINED_x                   User-defined parameter, where ‘x’ is replaced by a               O
                                   variable-length user-specified character string.
                                   Any number of user-defined parameters may be
                                   included, if necessary, to provide essential
                                   information that cannot be conveyed in
                                   COMMENT statements. Example:
                                   USER_DEFINED_EARTH_MODEL = WGS-84

3.2.4.3 All values except Maneuver Parameters in the OPM data are ‘at epoch’, that is, the
value of the parameter at the time specified in the EPOCH keyword.

3.2.4.4 Table 3-3 is broken into six logical blocks, each of which has a descriptive heading.
These descriptive headings shall not be included in an OPM, unless they appear in a properly
formatted COMMENT statement.

3.2.4.5 If the solar radiation coefficient, CR, is set to zero, no solar radiation pressure shall
be considered.

NOTE – It is recommended that CR and solar radiation pressure area be provided for GEO
       spacecraft.

3.2.4.6 If the atmospheric drag coefficient, CD, is set to zero, no atmospheric drag shall be
considered.

NOTE – It is recommended that CD and drag area be provided for LEO spacecraft.

3.2.4.7 Parameters for thrust phases may be optionally given for the computation of the
trajectory during or after maneuver execution (see reference [H1] for the simplified modeling
of such maneuvers). For impulsive maneuvers, MAN_DURATION must be set to zero.
MAN_DELTA_MASS may be used for both finite and impulsive maneuvers; the value must
be a negative number.

3.2.4.8 Multiple sets of maneuver parameters may appear. For each maneuver, all the
maneuver parameters shall be repeated in the order shown in table 3-3.

3.2.4.9 If the OPM contains a maneuver definition, then the Conditional elements of the
Spacecraft Parameters section (designated with a ‘C’) must be included.

3.2.4.10 Values in the covariance matrix shall be expressed in the applicable reference frame
(COV_REF_FRAME keyword) and shall be presented sequentially from upper left [1,1] to
lower right [6,6], lower triangular form, row by row, left to right. Variance and covariance
values shall be expressed in standard double precision as related in 7.5. This logical block of
the OPM may be useful for risk assessment and establishing maneuver and mission margins.
The intent is to provide causal connections between output orbit data and both physical
hypotheses and measurement uncertainties. These causal relationships guide operators’
corrective actions and mitigations.

3.2.4.11 Values for the MAN_REF_FRAME and COV_REF_FRAME keyword may be
selected from the following set:

Reference Frame Value     Meaning
RSW                       Another name for ‘Radial, Transverse, Normal’
RTN                       Radial, Transverse, Normal
TNW                       A local orbital coordinate frame that has the x-axis along the
                          velocity vector, W along the orbital angular momentum vector,
                          and N completing the right-handed system

3.2.4.12 A section of User-Defined Parameters may be provided if necessary. In principle,
this provides flexibility, but also introduces complexity, non-standardization, potential
ambiguity, and potential processing errors. Accordingly, if used, the keywords and their
meanings must be described in an ICD. User-Defined Parameters, if included, should be
used as sparingly as possible; their use is not encouraged.

# 4 ORBIT MEAN-ELEMENTS MESSAGE
## 4.1 GENERAL

4.1.1 Orbit information may be exchanged between two participants by sending an orbital
state based on mean Keplerian elements (see reference [H1]) for a specified epoch using an
OMM. The message recipient must use appropriate orbit propagator algorithms to correctly
propagate the OMM state to compute the orbit at other desired epochs.

4.1.2 The OMM is intended to allow replication of the data content of an existing TLE in a
CCSDS standard format, but the message can also accommodate other implementations of
mean elements. All essential fields of the ‘de facto standard’ TLE are included in the OMM
in a style that is consistent with that of the other ODMs (i.e., the OPM and OEM). From the
fields in the OMM, it is possible to generate a TLE (see reference [H2]). Programs that
convert OMMs to TLEs must be aware of the structural requirements of the TLE, including
the checksum algorithm and the formatting requirements for the values in the TLE. The
checksum and formatting requirements of the TLE do not apply to the values in an OMM.

4.1.3 If participants wish to exchange osculating element information, then the OPM or the
OCM should be the selected message type. (See sections 3 and 6.)

4.1.4    The use of the OMM is best applicable under the following conditions:
      a) an orbit propagator consistent with the models used to develop the orbit data should
         be run at the receiver’s site;
      b) the receiver’s modeling of gravitational forces, solar radiation pressure, atmospheric
         drag, etc. (see reference [H1]), should fulfill accuracy requirements established
         between the exchange partners.

4.1.5    The OMM shall be a plain text file consisting of orbit data for a single object.

NOTE – A sequence of OMMs for either a single object or for multiple objects can be
       aggregated into a single NDM XML file as described in 8.12 and shown in annex G.

4.1.6 The OMM file-naming scheme should be mutually agreed upon between message
exchange partners.

4.1.7 The method of exchanging OMMs should be mutually agreed upon between message
exchange partners.

NOTES

1        Detailed syntax rules for the OMM are specified in section 7.

2        Example OMMs and associated supplementary (non-normative) information are
         provided in annex G.

## 4.2 OMM CONTENT/STRUCTURE

### 4.2.1 GENERAL

The OMM shall be represented as a combination of the following:
      a) a header;
      b) metadata (data about data);
      c) data; and
      d) optional comments (explanatory information).

### 4.2.2 OMM HEADER

4.2.2.1    Table 4-1 specifies for each header item:
      a) the keyword to be used;
      b) a short description of the item;
      c) examples of allowed values; and
      d) whether the item is Mandatory (M), Optional (O), or Conditional (C). An ‘M’
         denotes mandatory keywords that must be included in this section if that data section
         is included. Conditional indicates that the item is mandatory if specified conditions
         are met (e.g., providing all covariance matrix elements if any are provided).

4.2.2.2    Only those keywords shown in table 4-1 shall be used in an OMM header.

                                      Table 4-1: OMM Header

        Keyword                      Description                          Examples of Values   M/O/C
 CCSDS_OMM_VERS      Format version in the form of ‘x.y’, where ‘y’ 3.0                          M
                     is incremented for corrections and minor
                     changes, and ‘x’ is incremented for major
                     changes.

 COMMENT             Comments (allowed in the OMM Header only This is a comment                  O
                     immediately after the OMM version number).
                     (See 7.8 for formatting rules.)

 CLASSIFICATION      User-defined free-text message                 SBU                          O
                     classification/caveats of this OMM. It is      'Operator-proprietary
                     recommended that selected values be pre-       data; secondary
                     coordinated between exchanging entities by     distribution not
                                                                    permitted'
                     mutual agreement.

 CREATION_DATE       File creation date/time in UTC. (For format    2001-11-06T11:17:33          M
                     specification, see 7.5.10.)                    2002-204T15:56:23Z

 ORIGINATOR          Creating agency or operator. Select from the CNES, ESOC, GSFC,              M
                     accepted set of values indicated in annex B, GSOC, JPL, JAXA,
                     subsection B1 from the ‘Abbreviation’ column INTELSAT, USAF,
                     (when present), or the ‘Name’ column when an INMARSAT
                     Abbreviation column is not populated. If
                     desired organization is not listed there, follow
                     procedures to request that originator be added
                     to SANA registry.

 MESSAGE_ID          ID that uniquely identifies a message from a   OMM 201113719185             O
                     given originator. The format and content of    ABC-12_34
                     the message identifier value are at the
                     discretion of the originator.

### 4.2.3 OMM METADATA

4.2.3.1    Table 4-2 specifies for each metadata item:
   a) the keyword to be used;
   b) a short description of the item;
   c) examples of allowed values; and
   d) whether the item is Mandatory (M), Optional (O), or Conditional (C). Conditional
      indicates that the item is mandatory if specified conditions are met (e.g., providing all
      covariance matrix elements if any are provided).

4.2.3.2    Only those keywords shown in 4-2 shall be used in OMM metadata.

NOTE – For some keywords (OBJECT_NAME and OBJECT_ID), there are no definitive
       lists of authorized values maintained by a control authority; references [3] and
       [11] and the organizations provided on the SANA Registry (annex B,
       subsection B1) are the best known sources for authorized values to date.

                               Table 4-2: OMM Metadata

          Keyword                        Description                     Examples of Values      M/O/C
COMMENT                 Comments (allowed at the beginning of the     This is a comment            O
                        OMM Metadata). (See 7.8 for formatting rules.)
OBJECT_NAME             Spacecraft name for which mean element orbit         TelKom 2              M
                        state data is provided. While there is no CCSDS- Spaceway 2
                        based restriction on the value for this keyword, it INMARSAT 4-F2
                        is recommended to use names from the UN              UNKNOWN
                        Office of Outer Space Affairs designator index
                        (reference [3], which include Object name and
                        international designator of the participant). If
                        OBJECT_NAME is not listed in reference [3] or
                        the content is either unknown or cannot be
                        disclosed, the value should be set to
                        UNKNOWN.
OBJECT_ID               Object identifier of the object for which mean       2005-046A             M
                        element orbit state data is provided. While there 2005-046B
                        is no CCSDS-based restriction on the value for 2003-022A
                        this keyword, it is recommended to use the           UNKNOWN
                        international spacecraft designator as published
                        in the UN Office of Outer Space Affairs
                        designator index (reference [3]). Recommended
                        values have the format YYYY-NNNP{PP},
                        where:
                        YYYY = Year of launch.
                        NNN = Three-digit serial number of launch
                                     in year YYYY (with leading zeros).
                        P{PP} = At least one capital letter for the
                                     identification of the part brought into
                                     space by the launch.
                        If the asset is not listed in reference [3], the UN
                        Office of Outer Space Affairs designator index
                        format is not used, or the content is either
                        unknown or cannot be disclosed, the value
                        should be set to UNKNOWN.
CENTER_NAME             Origin of the OMM reference frame, which             EARTH                 M
                        shall be a natural solar system body (planets,       MARS
                        asteroids, comets, and natural satellites),          MOON
                        including any planet barycenter or the solar
                        system barycenter. Natural bodies shall be
                        selected from the accepted set of values
                        indicated in annex B, subsection B2.

         Keyword                           Description                      Examples of Values      M/O/C
 REF_FRAME                Reference frame in which the Keplerian element ICRF                        M
                          data are given. Use of values other than those in ITRF2000
                          3.2.3.3 should be documented in an ICD.           EME2000
                                                                            TEME
                          NOTE – NORAD Two Line Element Sets and
                                     corresponding Simplified General
                                     Perturbations (SGP) orbit propagator
                                     ephemeris outputs are explicitly
                                     defined to be in the True Equator
                                     Mean Equinox of Date (TEME of
                                     Date) reference frame. Therefore,
                                     TEME of date shall be used for
                                     OMMs based on NORAD Two Line
                                     Element sets, rather than the almost
                                     imperceptibly different TEME of
                                     Epoch (see reference [H2] or [H3] for
                                     further details).
 REF_FRAME_EPOCH          Epoch of reference frame, if not intrinsic to the 2001-11-06T11:17:33       C
                          definition of the reference frame. (See 7.5.10    2002-204T15:56:23Z
                          for formatting rules.)
 TIME_SYSTEM              Time system used for Keplerian elements and       UTC                       M
                          covariance data. Use of values other than those
                          in 3.2.3.2 should be documented in an ICD.
 MEAN_ELEMENT_THEORY      Description of the Mean Element Theory.           SGP                       M
                          Indicates the proper method to employ to          SGP4
                          propagate the state.                              SGP4-XP
                                                                            DSST
                                                                            USM

### 4.2.4 OMM DATA

4.2.4.1 Table 4-3 provides an overview of the five logical blocks in the OMM Data section
(Mean Keplerian Elements, Spacecraft Parameters, TLE Related Parameters,
Position/Velocity Covariance Matrix, and User-Defined Parameters), and specifies for each
data item:
   a) the keyword to be used;
   b) a short description of the item;
   c) the units to be used; and
   d) whether the item is Mandatory (M), Optional (O), or Conditional (C). Conditional
      indicates that the item is mandatory if specified conditions are met (e.g., providing all
      covariance matrix elements if any are provided).

4.2.4.2    Only those keywords shown in table 4-3 shall be used in OMM data.

NOTE – Requirements relating to the keywords in table 4-3 appear after the table.

                                              Table 4-3: OMM Data

           Keyword                                        Description                               Units          M/O/C
Mean Keplerian Elements in the Specified Reference Frame
COMMENT                         (see 7.8 for formatting rules)                                                       O
EPOCH                           Epoch of Mean Keplerian elements (see 7.5.10 for                                     M
                                formatting rules)
SEMI_MAJOR_AXIS or              Semi-major axis in kilometers (preferred), or, if                    km              M
MEAN_MOTION                     MEAN_ELEMENT_THEORY = SGP/SGP4, the                                rev/day
                                Keplerian Mean motion in revolutions per day
ECCENTRICITY                    Eccentricity                                                                         M
INCLINATION                     Inclination                                                          deg             M
RA_OF_ASC_NODE                  Right ascension of ascending node                                    deg             M
ARG_OF_PERICENTER               Argument of pericenter                                               deg             M
MEAN_ANOMALY                    Mean anomaly                                                         deg             M
GM                              Gravitational Coefficient (Gravitational Constant × Central       km**3/s**2         O
                                Mass)
Spacecraft Parameters
COMMENT                           (see 7.8 for formatting rules.)                                                    O
MASS                              Spacecraft Mass                                                    kg              O
SOLAR_RAD_AREA                    Solar Radiation Pressure Area (AR)                                m**2             O
SOLAR_RAD_COEFF                   Solar Radiation Pressure Coefficient (CR)                                          O
DRAG_AREA                         Drag Area (AD)                                                    m**2             O
DRAG_COEFF                        Drag Coefficient (CD)                                                              O
TLE Related Parameters (This section is only required if MEAN_ELEMENT_THEORY=SGP/SGP4)
COMMENT                          (see 7.8 for formatting rules.)                                                     O
EPHEMERIS_TYPE                   Default value = 0. (See 4.2.4.7.)                                                   O
CLASSIFICATION_TYPE              Default value = U. (See 4.2.4.7.)                                                   O
NORAD_CAT_ID                     NORAD Catalog Number (‘Satellite Number’) an integer                                O
                                 of up to nine digits. This keyword is only required if
                                 MEAN_ELEMENT_THEORY=SGP/SGP4.
ELEMENT_SET_NO                   Element set number for this satellite. Normally                                     O
                                 incremented sequentially but may be out of sync if it is
                                 generated from a backup source. Used to distinguish
                                 different TLEs, and therefore only meaningful if TLE-
                                 based data is being exchanged (i.e.,
                                 MEAN_ELEMENT_THEORY = SGP/SGP4).
REV_AT_EPOCH                     Revolution Number                                                                   O
BSTAR or BTERM                   Drag-like ballistic coefficient, required for SGP4 and SGP4-    BSTAR:              C
                                 XP mean element models:                                      1/[Earth radii]

                                  MEAN_ELEMENT_THEORY= SGP4 (BSTAR = drag                          BTERM:
                                  parameter for SGP4).                                              𝑚2�
                                                                                                       𝑘𝑘
                                  MEAN_ELEMENT_THEORY= SGP4-XP (BTERM
                                  ballistic coefficient CDA/m, where CD = drag coefficient, A =
                                  average cross-sectional area, m = mass. Example values for
                                  BTERM = 0.02 (rocket body), 0.0015 (payload); average
                                  value spanning 20,00 catalog objects = 0.0286.
MEAN_MOTION_DOT                   First Time Derivative of the Mean Motion (i.e., a drag          rev/day**2         C
                                  term, required when MEAN_ELEMENT_THEORY =
                                  SGP or PPT3). (See 4.2.4.7 for important details).

        Keyword                                          Description                             Units          M/O/C
MEAN_MOTION_DDOT or               MEAN_ELEMENT_THEORY= SGP or PPT3: Second                    MEAN_MOTI           C
AGOM                              Time Derivative of Mean Motion (i.e., a drag term). (See     ON_DDOT:
                                  4.2.4.7 for important details).                              rev/day**3

                                  MEAN_ELEMENT_THEORY= SGP4-XP: Solar radiation                          2
                                                                                              AGOM: 𝑚 �𝑘𝑘
                                                      𝐴𝐴
                                  pressure coefficient �𝑚, where 𝛾 = reflectivity, A =
                                  average cross-sectional area, m = mass. Example values
                                  AGOM = 0.01 (rocket body) and 0.001 (payload); average
                                  value spanning 20,00 catalog objects = 0.0143 m2/kg.
Position/Velocity Covariance Matrix (6x6 Lower Triangular Form. None or all parameters of the matrix must be given.
COV_REF_FRAME may be omitted if it is the same as the REF_FRAME.)
COMMENT                          (see 7.8 for formatting rules.)                                               O
COV_REF_FRAME                    Reference frame in which the covariance data are given.                       C
                                 Select from the accepted set of values indicated in
                                 3.2.4.11.
CX_X                             Covariance matrix [1,1]                                      km**2            C
CY_X                             Covariance matrix [2,1]                                      km**2            C
CY_Y                             Covariance matrix [2,2]                                      km**2            C
CZ_X                             Covariance matrix [3,1]                                      km**2            C
CZ_Y                             Covariance matrix [3,2]                                      km**2            C
CZ_Z                             Covariance matrix [3,3]                                      km**2            C
CX_DOT_X                         Covariance matrix [4,1]                                    km**2/s            C
CX_DOT_Y                         Covariance matrix [4,2]                                    km**2/s            C
CX_DOT_Z                         Covariance matrix [4,3]                                    km**2/s            C
CX_DOT_X_DOT                     Covariance matrix [4,4]                                   km**2/s**2          C
CY_DOT_X                         Covariance matrix [5,1]                                    km**2/s            C
CY_DOT_Y                         Covariance matrix [5,2]                                    km**2/s            C
CY_DOT_Z                         Covariance matrix [5,3]                                    km**2/s            C
CY_DOT_X_DOT                     Covariance matrix [5,4]                                   km**2/s**2          C
CY_DOT_Y_DOT                     Covariance matrix [5,5]                                   km**2/s**2          C
CZ_DOT_X                         Covariance matrix [6,1]                                     km**2/s           C
CZ_DOT_Y                         Covariance matrix [6,2]                                    km**2/s            C
CZ_DOT_Z                         Covariance matrix [6,3]                                    km**2/s            C
CZ_DOT_X_DOT                     Covariance matrix [6,4]                                   km**2/s**2          C
CZ_DOT_Y_DOT                     Covariance matrix [6,5]                                   km**2/s**2          C
CZ_DOT_Z_DOT                     Covariance matrix [6,6]                                   km**2/s**2          C
User-Defined Parameters (all parameters in this section must be described in an ICD).
USER_DEFINED_x                   User-defined parameter, where ‘x’ is replaced by a                               O
                                 variable length user specified character string. Any
                                 number of user-defined parameters may be included, if
                                 necessary, to provide essential information that cannot be
                                 conveyed in COMMENT statements. Example:
                                 USER_DEFINED_EARTH_MODEL = WGS-84

4.2.4.3 All values in the OMM are ‘at epoch’, that is, the value of the parameter at the time
specified in the EPOCH keyword.

4.2.4.4 Table 4-3 is broken into five logical blocks, each of which has a descriptive
heading. These descriptive headings shall not be included in an OMM, unless they appear in
a properly formatted COMMENT statement.

4.2.4.5 Values in the covariance matrix shall be expressed in the applicable reference frame
(COV_REF_FRAME keyword if used, or REF_FRAME keyword if not), and shall be
presented sequentially from upper left [1,1] to lower right [6,6], lower triangular form, row
by row left to right. Variance and covariance values shall be expressed in standard double
precision as related in 7.5. This logical block of the OMM may be useful for risk assessment
and establishing maneuver and mission margins.

4.2.4.6 For operations in Earth orbit with a TLE-based OMM, some special conventions
must be observed, as follows:
    –   The value associated with the CENTER_NAME keyword shall be ‘EARTH’.
    –   The value associated with the REF_FRAME keyword shall be ‘TEME’.
    –   The value associated with the TIME_SYSTEM keyword shall be ‘UTC’.
    –   The format of the OBJECT_NAME and OBJECT_ID keywords shall be that of the
        UN Office of Outer Space Affairs designator index (reference [3]).
    –   The MEAN_MOTION keyword must be used instead of SEMI_MAJOR_AXIS.

4.2.4.7 For those who wish to use the OMM to represent a TLE, there are several
considerations that apply with respect to precision of angle representation, use of certain
fields by the propagator, reference frame, etc. Some sources suggest the following coding for
the CLASSIFICATION_TYPE keyword: U=unclassified, S=secret. Some sources suggest
the coding for the EPHEMERIS_TYPE keyword as follows:

    0 = SGP
    2 = SGP4
    3 = PPT3
    4 = SGP4-XP
    6 = Special Perturbations

NOTES

1       References [H2] and [H3] can be consulted for additional information.

2       If the source of MEAN_MOTION_DOT and MEAN_MOTION_DDOT is a TLE or
        if these values are intended to be used as a TLE, then these values need to be divided
        by 2 and 6 respectively to reflect the SGP theory Taylor Series expansion terms.

4.2.4.8 Maneuvers are not accommodated in the OMM. Users of the OMM who wish to
model maneuvers may use several OMM files to describe the orbit at applicable epochs.

4.2.4.9 NORAD Two Line Element Sets are implicitly in a TEME of Date reference frame,
which is ill-defined in international standard or convention. TEME may be used only for
OMMs based on NORAD Two Line Element sets, and in no other circumstances. There are
subtle differences between TEME of Epoch and TEME of Date (see references [H2] and
[H3]). The effect is very small relative to TLE accuracy. The preferred option is TEME of
Date. Users should specify in the ICD if their assumption is TEME of Epoch.

4.2.4.10 A section of User-Defined Parameters may be provided if necessary. In principle,
this provides flexibility, but also introduces complexity, non-standardization, potential
ambiguity, and potential processing errors. Accordingly, if used, the keywords and their
meanings must be described in an ICD. User-Defined Parameters, if included, should be
used as sparingly as possible; their use is not encouraged.

# 5 ORBIT EPHEMERIS MESSAGE
## 5.1 GENERAL

5.1.1 Orbit information may be exchanged between two participants by sending an
ephemeris in the form of a series of state vectors (Cartesian vectors providing position and
velocity, and optionally accelerations) using an OEM. The message recipient must have a
means of interpolating across these state vectors to obtain the state at an arbitrary time
contained within the span of the ephemeris.

5.1.2 The OEM may be used for assessing mutual physical or electromagnetic interference
among Earth-orbiting spacecraft, developing collaborative maneuvers, and representing the
orbits of active satellites, inactive man-made objects, near-Earth debris fragments, etc. The
OEM reflects the dynamic modeling of any users’ approach to conservative and non-
conservative phenomena.

5.1.3     The OEM shall be a plain text file consisting of orbit data for a single object.

NOTE – A sequence of OEMs for either a single object or for multiple objects can be
       aggregated into a single NDM XML file as described in 8.12 and shown in annex G.

5.1.4 The OEM file-naming scheme should be mutually agreed between message exchange
partners.

5.1.5 The method of exchanging OEMs should be mutually agreed between message
exchange partners.

NOTES

1         Detailed syntax rules for the OEM are specified in section 7.

2         Example OEMs and associated supplementary (non-normative) information are
          provided in annex G.

## 5.2 OEM CONTENT/STRUCTURE

### 5.2.1 GENERAL

5.2.1.1     The OEM shall be represented as a combination of the following:
      a) a header;
      b) metadata (data about data);
      c) ephemeris data;
      d) optional covariance matrix data; and
      e) optional comments (explanatory information).

5.2.1.2 OEM files must have a set of minimum required sections; some may be repeated.
Table 5-1 outlines the contents of an OEM.

                        Table 5-1: OEM File Layout Specifications

  Required              Header
  Sections              Metadata
                        Ephemeris Data
                        (Appropriate comments should also be included, although they are
                        not required.)
  Allowable             Covariance Matrix (optional)
  Repetitions of        Metadata
  Sections              Ephemeris Data
                        Covariance Matrix (optional)
                        Metadata
                        Ephemeris Data
                        Covariance Matrix (optional)
                        Metadata
                        Ephemeris Data
                        Covariance Matrix (optional)
                        …etc.
                        (Appropriate comments should also be included.)

### 5.2.2 OEM HEADER

5.2.2.1    The OEM header assignments are shown in table 5-2, which specifies for each item:
   a) the keyword to be used;
   b) a short description of the item;
   c) examples of allowed values; and
   d) whether the item is Mandatory (M), Optional (O), or Conditional (C). An ‘M’
      denotes mandatory keywords that must be included in this section if that particular
      data section is included. Conditional indicates that the item is mandatory if specified
      conditions are met (e.g., providing all covariance matrix elements if any are
      provided).

5.2.2.2    Only those keywords shown in table 5-2 shall be used in an OEM header.

                                       Table 5-2: OEM Header

          Keyword                       Description                        Examples of Values   M/O/C
  CCSDS_OEM_VERS      Format version in the form of ‘x.y’, where ‘y’ is   3.0                    M
                      incremented for corrections and minor changes,
                      and ‘x’ is incremented for major changes.
  COMMENT             Comments (allowed in the OEM Header only            COMMENT This is a      O
                      immediately after the OEM version number).          comment
                      (See 7.8 for formatting rules.)
  CLASSIFICATION      User-defined free-text message                      SBU                    O
                      classification/caveats of this OEM. It is           'Operator-
                      recommended that selected values be pre-            proprietary data;
                                                                          secondary
                      coordinated between exchanging entities by          distribution not
                      mutual agreement.                                   permitted'
  CREATION_DATE       File creation date and time in UTC. (For format                            M
                                                                          2001-11-
                      specification, see 7.5.10.)
                                                                          06T11:17:33
                                                                          2002-204T15:56:23
  ORIGINATOR          Creating agency or operator. Select from the        CNES, ESOC, GSFC,      M
                      accepted set of values indicated in annex B,        GSOC, JPL, JAXA,
                      subsection B1 from the ‘Abbreviation’ column        INTELSAT, USAF,
                      (when present), or the ‘Name’ column when an        INMARSAT
                      Abbreviation column is not populated. If desired
                      organization is not listed there, follow procedures
                      to request that originator be added to SANA
                      registry.
  MESSAGE_ID          ID that uniquely identifies a message from a        OEM 201113719185       O
                      given originator. The format and content of the ABC-12_34
                      message identifier value are at the discretion of
                      the originator.

### 5.2.3 OEM METADATA

5.2.3.1     The OEM metadata assignments are shown in table 5-3, which specifies for each
item:
   a) the keyword to be used;
   b) a short description of the item;
   c) examples of allowed values; and
   d) whether the item is Mandatory (M), Optional (O), or Conditional (C). Conditional
      indicates that the item is mandatory if specified conditions are met (e.g., providing all
      covariance matrix elements if any are provided).

5.2.3.2     Only those keywords shown in table 5-3 shall be used in OEM metadata.

NOTE – For some keywords (OBJECT_NAME and OBJECT_ID) there are no definitive
       lists of authorized values maintained by a control authority; references [3] and
       [11] and the organizations provided on the SANA Registry (annex B,
       subsection B1) are the best known sources for authorized values to date. (For the
       TIME_SYSTEM keyword, see annex B, subsection B3, for guidance and a link
       to the approved set of values.)

5.2.3.3 A single metadata group shall precede each ephemeris data block. Multiple
occurrences of a metadata group followed by an ephemeris data block may be used. Before
each metadata group the string ‘META_START’ shall appear on a separate line and after
each metadata group (and before the associated ephemeris data block) the string
‘META_STOP’ shall appear on a separate line.

                              Table 5-3: OEM Metadata

           Keyword                     Description                Examples of Values    M/O/C
 META_START                The OEM message contains metadata,               n/a           M
                           ephemeris data, and covariance data; this
                           keyword is used to delineate the start of a
                           metadata block within the message
                           (metadata are provided in a block,
                           surrounded by ‘META_START’ and
                           ‘META_STOP’ markers to facilitate file
                           parsing). This keyword must appear on a
                           line by itself.
 COMMENT                   Comments allowed only immediately after COMMENT This is a      O
                           the META_START keyword. (See 7.8 for comment.
                           formatting rules.)
 OBJECT_NAME               Spacecraft name for which ephemeris data is EUTELSAT W1        M
                           provided. While there is no CCSDS-based MARS PATHFINDER
                           restriction on the value for this keyword, it is STS 106
                                                                            NEAR
                           recommended to use names from the UN             UNKNOWN
                           Office of Outer Space Affairs designator
                           index (reference [3], which include Object
                           name and international designator of the
                           participant). If OBJECT_NAME is not
                           listed in reference [3] or the content is either
                           unknown or cannot be disclosed, the value
                           should be set to UNKNOWN.

         Keyword                    Description                   Examples of Values         M/O/C
 OBJECT_ID            Object identifier of the object for which        2000-052A               M
                      ephemeris data is provided. While there is 1996-068A
                      no CCSDS-based restriction on the value 2000-053A
                      for this keyword, it is recommended to use 1996-008A
                                                                       UNKNOWN
                      the international spacecraft designator as
                      published in the UN Office of Outer Space
                      Affairs designator index (reference [3]).
                      Recommended values have the format
                      YYYY-NNNP{PP}, where:
                      YYYY = Year of launch.
                      NNN = Three-digit serial number of
                                   launch in year YYYY (with
                                   leading zeros).
                      P{PP} = At least one capital letter for the
                                   identification of the part
                                   brought into space by the
                                   launch.
                      If the asset is not listed in reference [3], the
                      UN Office of Outer Space Affairs
                      designator index format is not used, or the
                      content is either unknown or cannot be
                      disclosed, the value should be set to
                      UNKNOWN.
 CENTER_NAME          Origin of the OEM reference frame, which EARTH                           M
                      may be a natural solar system body               EARTH BARYCENTER
                      (planets, asteroids, comets, and natural         MOON
                      satellites), including any planet barycenter SOLAR SYSTEM
                                                                       BARYCENTER
                      or the solar system barycenter, or another SUN
                      reference frame center (such as a                JUPITER BARYCENTER
                      spacecraft, formation flying reference           STS 106
                      ‘chief’ spacecraft, etc.).                       EROS

                      Natural bodies shall be selected from the
                      accepted set of values indicated in
                      annex B, subsection B2.

                      For spacecraft, it is recommended to use
                      either the OBJECT_ID or international
                      designator of the participant as catalogued
                      in the UN Office of Outer Space Affairs
                      designator index (reference [3]).
 REF_FRAME            Reference frame in which the ephemeris      ICRF                         M
                      data are given. Use of values other than    ITRF2000
                      those in 3.2.3.3 should be documented in an EME2000
                      ICD.                                        TEME
 REF_FRAME_EPOCH      Epoch of reference frame, if not intrinsic 2001-11-                      C
                      to the definition of the reference frame.   06T11:17:33
                      (See 7.5.10 for formatting rules.)          2002-204T15:56:23Z
 TIME_SYSTEM          Time system used for ephemeris and          UTC, TAI, TT, GPS,           M
                      covariance data. Use of values other than TDB, TCB
                      those in 3.2.3.2 should be documented in
                      an ICD.
 START_TIME           Start of TOTAL time span covered by         1996-12-                     M
                                                                  18T14:28:15.1172
                      ephemeris data and covariance data          1996-277T07:22:54
                      immediately following this metadata
                      block. (For format specification, see
                      7.5.10.)

         Keyword                    Description                 Examples of Values       M/O/C
 USEABLE_START_TIME     Start time of USEABLE time span covered 1996-12-
                                                                18T14:28:15.1172
                        by ephemeris data immediately following 1996-277T07:22:54          O
                        this metadata block. (For format
                        specification, see 7.5.10.)

                        This optional keyword allows the message
                        creator to introduce fictitious (but
                        numerically smooth) data nodes prior to
                        the actual data time history to support
                        interpolation methods requiring more than
                        two nodes (e.g., pure higher-order
                        Lagrange interpolation methods). The use
                        of this keyword and introduction of
                        fictitious node points are optional and may
                        not be necessary.
 USEABLE_STOP_TIME      Stop time of USEABLE time span covered 1996-12-                    O
                                                                    18T14:28:15.1172
                        by ephemeris data immediately following 1996-277T07:22:54
                        this metadata block. (For format
                        specification, see 7.5.10.)

                        This optional keyword allows the message
                        creator to introduce fictitious (but
                        numerically smooth) data nodes following
                        the actual data time history to support
                        interpolation methods requiring more than
                        two nodes (e.g., pure higher-order
                        Lagrange interpolation methods). The use
                        of this keyword and introduction of
                        fictitious node points are optional and may
                        not be necessary.
 STOP_TIME              End of TOTAL time span covered by           1996-12-               M
                                                                    18T14:28:15.1172
                        ephemeris data and covariance data          1996-277T07:22:54
                        immediately following this metadata
                        block. (For format specification, see
                        7.5.10.)
 INTERPOLATION          This keyword may be used to specify the HERMITE                    O
                        recommended interpolation method for        LINEAR
                        ephemeris data in the immediately           LAGRANGE
                        following set of ephemeris lines.
 INTERPOLATION_DEGREE   Recommended interpolation degree for        5                      C
                        ephemeris data in the immediately           1
                        following set of ephemeris lines. Must be
                        an integer value. This keyword must be
                        used if the ‘INTERPOLATION’ keyword
                        is used.
 META_STOP              The OEM message contains metadata,          n/a                    M
                        ephemeris data, and covariance data; this
                        keyword is used to delineate the end of a
                        metadata block within the message
                        (metadata are provided in a block,
                        surrounded by ‘META_START’ and
                        ‘META_STOP’ markers to facilitate file
                        parsing). This keyword must appear on a
                        line by itself.

5.2.4     OEM DATA: EPHEMERIS DATA LINES

5.2.4.1 Each set of ephemeris data, including the time tag, must be provided on a single
line. The order in which data items are given shall be fixed: Epoch, X, Y, Z, X_DOT,
Y_DOT, Z_DOT, X_DDOT, Y_DDOT, Z_DDOT.

5.2.4.2 The position and velocity terms shall be mandatory; acceleration terms may be
provided.

5.2.4.3 At least one space character must be used to separate the items in each ephemeris
data line.

5.2.4.4 Repeated time tags may occur in consecutive ephemeris data blocks if the
STOP_TIME of the first ephemeris data block is greater than the START_TIME of the
second ephemeris data block. Although the USEABLE_STOP_TIME and
USEABLE_START_TIME of the consecutive ephemeris data blocks must not overlap
(except for a possibly shared endpoint), the STOP_TIME of the first ephemeris data block
may be greater than the START_TIME of the second ephemeris data block if the extra data is
required for interpolation purposes.

5.2.4.5    The TIME_SYSTEM value must remain fixed within an OEM.

5.2.4.6 The occurrence of a second (or greater) metadata block after some ephemeris data
indicates that interpolation using succeeding ephemeris data with ephemeris data occurring
prior to that metadata block shall not be done. This method may be used for proper modeling
of propulsive maneuvers or any other source of a discontinuity such as eclipse entry or exit.

5.2.4.7 Details about interpolation method should be specified using the
INTERPOLATION and INTERPOLATION_DEGREE keywords within the OEM. All data
blocks must contain enough ephemeris data records to allow the recommended interpolation
method to be carried out consistently throughout the OEM.

5.2.5     OEM DATA: COVARIANCE MATRIX LINES

5.2.5.1    A single covariance matrix data section may optionally follow each ephemeris data
block.

5.2.5.2 If present, the covariance matrix data lines in the OEM are separated from the
ephemeris data by means of two mandatory keywords as specified in table 5-4:
‘COVARIANCE_START’ and ‘COVARIANCE_STOP’. The COVARIANCE_START
keyword must appear before the first line of the covariance matrix data.          The
COVARIANCE_STOP keyword must appear after the last line of covariance data. Each of
these keywords shall appear on a line by itself with no time tags or values.

5.2.5.3 The epoch of the navigation solution related to the covariance matrix must be
provided via the ‘EPOCH’ keyword. The reference frame of the covariance matrix, if
different from that of the states in the ephemeris, must be provided via the
‘COV_REF_FRAME’ keyword.

5.2.5.4 Values in the covariance matrix shall be expressed in the applicable reference frame
(COV_REF_FRAME keyword if used, or REF_FRAME keyword if not), and shall be
presented sequentially from upper left [1,1] to lower right [6,6], lower triangular form, row
by row left to right. Variance and covariance values shall be expressed in standard double
precision as related in 7.5.

5.2.5.5 At least one space character must be used to separate the items in each covariance
matrix data line.

5.2.5.6 Multiple covariance matrices may appear in the covariance matrix section; they
may appear with any desired frequency (one for each navigation solution that makes up the
overall ephemeris is recommended). The OEM may also contain propagated covariances,
not just individual covariances associated with navigation solutions.

5.2.5.7 If there are multiple covariance matrices in the data section, they must be ordered
by increasing time tag.

                         Table 5-4: OEM Covariance Keywords

          Keyword                        Description                  Examples of Values       M/O/C
 COVARIANCE_START           This keyword is used to delineate the start n/a                      M
                            of a covariance data block within the
                            message.
 EPOCH                      Epoch of covariance matrix. (See 7.5.10 2019-12-28T21:29:07.267      C
                            for formatting rules.)
 COV_REF_FRAME              Reference frame in which the covariance EME2000                      C
                            data are given. Select from the accepted
                            set of values indicated in 3.2.3.3 or
                            3.2.4.11.
 COVARIANCE_STOP            This keyword is used to delineate the end n/a                        M
                            of a covariance data block within the
                            message.

# 6 ORBIT COMPREHENSIVE MESSAGE
## 6.1 GENERAL

6.1.1 Comprehensive orbit information may be exchanged between two participants by
sending orbit data/content for one or more epochs using an OCM. The OCM aggregates and
extends OMM, OPM, and OEM content in a single hybrid message. The OCM
simultaneously emphasizes flexibility and message conciseness by offering extensive
optional standardized content while minimizing mandatory content.

6.1.2 The OCM shall be a plain text file consisting of orbit data for a single space object, or
in the case of a parent/child satellite deployment scenario, a single parent object.

NOTE – A sequence of OCMs for either a single object or for multiple objects can be
       aggregated into a single NDM XML file as described in 8.12 and shown in annex G.

6.1.3 Orbit information may be exchanged between two or more participants by sending an
ephemeris in the form of one or more time series of orbital states (selectable as orbital
elements and/or Cartesian vectors providing position and optionally velocity and
accelerations) using an OCM. If orbital states are desired at arbitrary time(s) contained
within the span of the provided orbit or covariance time histories, the message recipient must
use a suitable interpolation method. For times outside of supplied orbit or covariance state
time spans or if the step size between time points is too large to support interpolation
(reference [H6]), optional perturbations parameters should be included in this message to
allow the message recipient to use a suitably compatible orbit and covariance propagator.

6.1.4 The OCM may be used for assessing mutual physical or electromagnetic interference
among Earth-orbiting spacecraft, developing collaborative maneuvers, and representing the
orbits of active satellites, inactive man-made objects, near-Earth debris fragments, etc. The
OCM reflects the dynamic modeling of any users’ approach to conservative and non-
conservative phenomena.

6.1.5 The OCM file-naming scheme should be mutually agreed between message exchange
partners.

6.1.6 The method of exchanging OCMs should be mutually agreed between message
exchange partners.

NOTES

1      Detailed syntax rules for the OCM are specified in section 7.

2      Example OCMs and associated supplementary (non-normative) information are
       provided in annex G.

## 6.2 OCM STRUCTURE AND OVERARCHING REQUIREMENTS

### 6.2.1 GENERAL STRUCTURE

6.2.1.1 The OCM shall be represented as the combination of the following mandatory (M)
and optional (O) data blocks, which (where provided) shall be ordered as listed in table 6-1.

6.2.1.2 Within the tables of each OCM section, each keyword is labeled as being
Mandatory (M), Optional (O), or Conditional (C). An ‘M’ denotes mandatory keywords
that must be included in this section if this data section is included. Keywords that have
a pre-defined (default) value are listed as ‘O’ (optional), because if the keyword is not
provided, then that default value as defined in the corresponding table shall be used in OCM
processing. A ‘C’ denotes keywords that are mandatory if this data block is included
and certain conditions are met, as specified in the keyword description.

NOTE – One can observe in table 6-1 that the OCM fully supports what might be
       considered as a ‘degenerate’ case, where the message is constructed without any
       data blocks. This was an intentional choice, given that the many metadata
       elements the OCM can accommodate are very useful (e.g., to convey phonebook
       information, link disparate messages together, and convey timing source
       information).

6.2.1.3 In some cases, default values have been provided for mandatory ‘M’ and
conditional ‘C’ content. Where such defaults exist and those default values match what the
message creator intends, the message creator is not required to explicitly provide those
mandatory or conditional keywords in that particular data block, and the default values shall
implicitly be adopted by the message recipient.

6.2.1.4 No defaults are supplied for Optional ‘O’ content. If an optional keyword/tag is not
supplied by the message creator, then no value is intended and shall be treated simply as
‘null’ (not set), and no value shall be assumed or used in OCM processing.

                  Table 6-1: OCM File Layout and Ordering Specification

                                                                                                   Status
            Section                           Content                                              M/O
         OCM Header                           A single header of the message                          M
         OCM Metadata                         A single metadata section (data about data)             M
        orbit data 1            data
Data
                                description                                                            O
                                data lines
                                              One or more orbit state time histories (consisting
                            ⁝
                                                       of one or more orbit states)
        orbit data norbit       data
                                description
                                data lines
        physical properties                    A single space object physical characteristics
                                                                                                       O
                                                                  section
        covariance data 1       data
                                description                                                            O
                                data lines
                                                One or more covariance time histories (each
                            ⁝
                                               consisting of one or more covariance matrices)
        covariance data         data
        ncovariance             description
                                data lines
        maneuver data 1         data        One or more maneuver specifications for either
                                description impulsive or finite burns or acceleration profiles         O
                                data lines
                            ⁝
        maneuver data           data
        nmaneuver               description
                                data lines
        perturbations                             A single perturbations parameters section
        parameters                              (required if an orbit determination section is         C
                                                                  provided)
        orbit determination                       A single orbit determination data section            O
        user-defined                              A single user-defined parameters section
        parameters                              containing data and supplemental comments              O
                                                         (explanatory information)

### 6.2.2 GENERAL REQUIREMENTS

The following requirements apply to all OCM sections and content:

6.2.2.1 The order of occurrence of OCM keywords shall be fixed as listed in the keyword
value tables in the OCM section descriptions.

6.2.2.2 If the message creator does not have a value for a mandatory keyword, a value of
‘UNKNOWN’ may be used.

6.2.2.3 All time-tags may be specified by either a (signed) double precision relative time
(e.g., 20157.26) measured in SI seconds with respect to the specified epoch time
(EPOCH_TZERO) or as an absolute time (e.g., 2018-11-13T11:13:20.5Z in CCSDS Time
String A or B format, as specified in 7.5.10).

6.2.2.4    Duplicate time tags shall not be used in any given OCM data block.

6.2.2.5 Within an OCM data block, all time-tags must adhere to either relative time or
absolute time for the entirety of that data block. Relative and absolute time shall not be used
within the same data block.

6.2.2.6 Time tags of information within ordered sequences of OCM sections may be
separated by uniform or non-uniform step size(s).

6.2.2.7 Time tags of one OCM section may or may not match those of another OCM
section.

### 6.2.3 OCM HEADER

6.2.3.1    Table 6-2 specifies the keywords for each header item.

6.2.3.2    Only those keywords shown in table 6-2 shall be used in an OCM header.

6.2.3.3 The order of occurrence of these OCM header keywords shall be fixed as shown in
table 6-2.

                                      Table 6-2: OCM Header

     Keyword                              Description                         Examples of Values        M/O/C
CCSDS_OCM_VERS       Format version in the form of ‘x.y’, where ‘y’ is         3.0                        M
                     incremented for corrections and minor changes, and ‘x’ is
                     incremented for major changes.
COMMENT              Comments (a contiguous set of one or more comment         This is a comment          O
                     lines may be provided in the OCM Header only
                     immediately after the OCM version number). (See 7.8
                     for formatting rules.)
CLASSIFICATION       User-defined free-text message classification/caveats of SBU                         O
                     this OCM. It is recommended that selected values be pre- 'Operator-
                     coordinated between exchanging entities by mutual         proprietary data;
                                                                               secondary
                     agreement.                                                distribution not
                                                                                 permitted'
CREATION_DATE        File creation date/time in UTC. (For format specification, 2001-11-06T11:17:33       M
                     see 7.5.10.)                                                2002-204T15:56:23Z
ORIGINATOR           Creating agency or operator. Select from the accepted set CNES, ESOC, GSFC,          M
                     of values indicated in annex B, subsection B1 from the      GSOC, JPL, JAXA,
                     ‘Abbreviation’ column (when present), or the ‘Name’         INTELSAT, USAF,
                     column when an Abbreviation column is not populated. If INMARSAT
                     desired organization is not listed there, follow procedures
                     to request that originator be added to SANA registry.
MESSAGE_ID           Free-text field containing an ID that uniquely identifies a OCM 201113719185         O
                     message from this message originator. The format and        ABC-12_34
                     content of the message identifier value are at the
                     discretion of the originator.

### 6.2.4 OCM METADATA

6.2.4.1 Table 6-3 specifies the metadata keywords.                    Only those keywords shown in
table 6-3 shall be used in OCM metadata.

6.2.4.2 The metadata section must begin with keyword META_START and end with
keyword META_STOP.

6.2.4.3    At most, only one metadata section shall appear in the entire scope of an OCM.

6.2.4.4 The order of occurrence of these OCM metadata keywords shall be fixed as shown
in table 6-3.

NOTES

1         For some keywords (OBJECT_NAME, OBJECT_DESIGNATOR) there are no
          definitive lists of authorized values maintained by a control authority; references [3]
          and [11] and the organizations provided on the SANA Registry (annex B,
          subsection B1) are the best known sources for authorized values to date.

2         While             OBJECT_NAME,                 OBJECT_DESIGNATOR, and
          INTERNATIONAL_DESIGNATOR are individually optional, it is recommended
          that at least one of these three keywords be supplied.

                                                                         Table 6-3: OCM Metadata

                            Keyword                                Description                           Units   Default (if any)            Examples of Values   M/O/C
                  META_START                 Start of the metadata section.                                                                                        M
                  COMMENT                    Comments (a contiguous set of one or more comment                                      This is a comment              O

                                             lines may be provided in the OCM Metadata section;
                                             see 7.8 for comment formatting rules).
                  OBJECT_NAME                Free-text field containing the name of the object. While                               SPOT-7                         O
                                             there is no CCSDS-based restriction on the value for this                              ENVISAT
                                             keyword, it is recommended to use names from either                                    IRIDIUM NEXT-8
                                             the UN Office of Outer Space Affairs designator index                                   INTELSAT G-15
                                             (reference [3], which include Object name and                                          UNKNOWN
                                             international designator of the participant), the
                                             spacecraft operator, or a State Actor or commercial
                                             Space Situational Awareness (SSA) provider
                                             maintaining the ‘CATALOG_NAME’ space catalog. If
                                             OBJECT_NAME is not listed in reference [3] or the
                                             content is either unknown (uncorrelated) or cannot be
                                             disclosed, the value should be set to UNKNOWN (or

Page 6-6
                                             this keyword omitted).
                  INTERNATIONAL_DESIGNATOR   Free-text field containing an international designator                                 2000-052A                      O
                                             for the object as assigned by the UN Committee on                                      1996-068A
                                             Space Research (COSPAR). Such designator values                                        2000-053A
                                             shall have the following COSPAR format:                                                1996-008A
                                             YYYY-NNNP{PP}, where:                                                                  UNKNOWN
                                             YYYY = Year of launch.
                                             NNN = Three-digit serial number of launch in
                                                          year YYYY (with leading zeros).
                                             P{PP} = At least one capital letter for the
                                                          identification of the part brought into
                                                          space by the launch.
                                             If the object has no international designator or the
                                             content is either unknown (uncorrelated) or cannot be
                                             disclosed, the value should be set to UNKNOWN (or
                                             this keyword omitted).

                                             NOTE – The international designator was typically
                                                    specified by ‘OBJECT_ID’ in the OPM,
                                                    OMM, and OEM.
                             Keyword                          Description                           Units   Default (if any)           Examples of Values    M/O/C

                  CATALOG_NAME          Free-text field containing the satellite catalog source                                CSPOC                          O
                                        (or source agency or operator, value to be drawn from                                  RFSA
                                        the SANA registry list of Space Object Catalogs at                                     ESA
                                        https://sanaregistry.org/r/space_object_catalog, or                                    COMSPOC
                                        alternatively, from the list of organizations listed in

                                        the ‘Abbreviation’ column of the SANA
                                        Organizations registry at
                                        https://www.sanaregistry.org/r/organizations) from
                                        which ‘OBJECT_DESIGNATOR’ was obtained.
                  OBJECT_DESIGNATOR     Free-text field specification of the unique satellite                                  22444                          O
                                        identification designator for the object, as reflected in                              18SPCS 18571
                                        the catalog whose name is ‘CATALOG_NAME’. If                                           2147483648_04ae[…]d84c
                                        the ID is not known (uncorrelated object) or cannot be                                 UNKNOWN
                                        disclosed, ‘UNKNOWN’ may be used (or this
                                        keyword omitted).
                  ALTERNATE_NAMES       Free-text comma-delimited field containing alternate                                   SV08, IN8                      O
                                        name(s) of this space object, including assigned names
                                        used by spacecraft operator, State Actors, commercial

Page 6-7
                                        SSA providers, and/or media.
                  ORIGINATOR_POC        Free-text field containing originator or programmatic                                  Mr. Rodgers                    O
                                        Point-of-Contact (PoC) for OCM.
                  ORIGINATOR_POSITION   Free-text field containing contact position of the                                     Flight Dynamics                O
                                        originator PoC.                                                                        Mission Design Lead
                  ORIGINATOR_PHONE      Free-text field containing originator PoC phone                                        +12345678901                   O
                                        number.
                  ORIGINATOR_EMAIL      Free-text field containing originator PoC email                                        JOHN.DOE@ SOMEWHERE.ORG        O
                                        address.
                  ORIGINATOR_ADDRESS    Free-text field containing originator’s physical address                               5040 Spaceflight Ave.,         O
                                        information for OCM creator (suggest comma-                                            Cocoa Beach, FL, USA, 12345
                                        delimited address lines).
                  TECH_ORG              Free-text field containing the creating agency or                                      NASA                           O
                                        operator (value should be drawn from the
                                        ‘Abbreviation’ column of the SANA Organizations
                                        registry at

                                        https://www.sanaregistry.org/r/organizations).
                  TECH_POC              Free-text field containing technical PoC for OCM.                                      Maxwell Smart                  O
                               Keyword                         Description                         Units   Default (if any)           Examples of Values    M/O/C

                  TECH_POSITION          Free-text field containing contact position of the                                   Flight Dynamics                O
                                         technical PoC.                                                                       Mission Design Lead
                  TECH_PHONE             Free-text field containing technical PoC phone                                       +49615130312                   O
                                         number.

                  TECH_EMAIL             Free-text field containing technical PoC email address.                              JOHN.DOE@ SOMEWHERE.ORG        O
                  TECH_ADDRESS           Free-text field containing technical PoC physical                                    5040 Spaceflight Ave.,         O
                                         address information for OCM creator (suggest                                         Cocoa Beach, FL, USA, 12345
                                         comma-delimited address lines).
                  PREVIOUS_MESSAGE_ID    Free-text field containing an ID that uniquely                                       OCM 201113719184               O
                                         identifies the previous message from this message                                    ABC-12_33
                                         originator for this space object. The format and
                                         content of the message identifier value are at the
                                         discretion of the originator.

                                         NOTE – One may provide the previous message ID
                                                without supplying the
                                                ‘PREVIOUS_MESSAGE_EPOCH’

Page 6-8
                                                keyword, and vice versa.
                  NEXT_MESSAGE_ID        Free-text field containing an ID that uniquely                                       OCM 201113719186               O
                                         identifies the next message from this message                                        ABC-12_35
                                         originator for this space object. The format and
                                         content of the message identifier value are at the
                                         discretion of the originator.

                                         NOTE – One may provide the next message ID
                                                without supplying the
                                                ‘NEXT_MESSAGE_EPOCH’ keyword, and
                                                vice versa.
                  ADM_MSG_LINK           Free-text field containing a unique identifier of                                    ADM_MSG_35132.txt              O
                                         Attitude Data Message (ADM) (reference [10]) that                                    ADM_ID_0572
                                         are linked (relevant) to this Orbit Data Message.
                  CDM_MSG_LINK           Free-text field containing a unique identifier of                                    CDM_MSG_35132.txt              O
                                         Conjunction Data Message (CDM) (reference [14])                                      CDM_ID_8257
                                         that are linked (relevant) to this Orbit Data Message.

                  PRM_MSG_LINK           Free-text field containing a unique identifier of                                    PRM_MSG_35132.txt              O
                                         Pointing Request Message (PRM) (reference [13]) that                                 PRM_ID_6897
                                         are linked (relevant) to this Orbit Data Message.
                             Keyword                        Description                           Units   Default (if any)            Examples of Values   M/O/C

                  RDM_MSG_LINK         Free-text field containing a unique identifier of                                     RDM_MSG_35132.txt              O
                                       Reentry Data Message (RDM) (reference [12]) that                                      RDM_ID_1839
                                       are linked (relevant) to this Orbit Data Message.
                  TDM_MSG_LINK         Free-text string containing a comma-separated list of                                 TDM_MSG_37.txt                 O

                                       file name(s) and/or associated identification number(s)                               TDM_835, TDM_836
                                       of Tracking Data Message (TDM) (reference [9])
                                       observations upon which this OD is based.
                  OPERATOR             Free-text field containing the operator of the space                                  INTELSAT                       O
                                       object.
                  OWNER                Free-text field containing the owner of the space                                     SIRIUS                         O
                                       object.
                  COUNTRY              Free-text field containing the name of the country,                                   US                             O
                                       country code, or country abbreviation where the space                                 SPAIN
                                       object owner is based.
                  CONSTELLATION        Free-text field containing the name of the constellation                              SPIRE                          O
                                       to which this space object belongs.

Page 6-9
                  OBJECT_TYPE          Specification of the type of object. Select from the                                  PAYLOAD                        O
                                       accepted set of values indicated in annex B,                                          ROCKET BODY
                                       subsection B11.                                                                       DEBRIS
                                                                                                                             UNKNOWN
                                                                                                                             OTHER
                  TIME_SYSTEM          Time system for all absolute time stamps in this OCM                    UTC           UTC                            M
                                       including EPOCH_TZERO. Select from the accepted
                                       set of values indicated in annex B, subsection B3.
                                       This field is used by all OCM data blocks.

                                       If the SCLK timescale is selected, then
                                       ‘EPOCH_TZERO’ shall be interpreted as the
                                       spacecraft clock epoch and both
                                       SCLK_OFFSET_AT_EPOCH and
                                       SCLK_SEC_PER_SI_SEC shall be supplied.

                               Keyword                         Description                          Units   Default (if any)             Examples of Values     M/O/C

                  EPOCH_TZERO            Default epoch to which all relative times are                                         2001-11-06T11:17:33               M
                                         referenced in data blocks (for format specification, see
                                         7.5.10). The time scale of EPOCH_TZERO is
                                         controlled via the ‘TIME_SYSTEM’ keyword, with
                                         the exception that for the SCLK timescale,

                                         EPOCH_TZERO shall be interpreted as being in the
                                         UTC timescale. This field is used by all OCM data
                                         blocks.
                  OPS_STATUS             Specification of the operational status of the space                                  OPERATIONAL                       O
                                         object. Select from the accepted set of values
                                         indicated in annex B, subsection B12.
                  ORBIT_CATEGORY         Specification of the type of orbit. Select from the                                   GEO                               O
                                         accepted set of values indicated in annex B,                                          LEO
                                         subsection B14.
                  OCM_DATA_ELEMENTS      Comma-delimited list of elements of information data                                  ORB, ORB, PHYS, COV, MAN, MAN,    O
                                         blocks included in this message. The order shall be the                               PERT, OD, USER
                                         same as the order of the data blocks in the message.

Page 6-10
                                         Values shall be confined to the following list: ORB,
                                         PHYS, COV, MAN, PERT, OD, and USER.
                                         If the OCM contains multiple ORB, COV, or MAN
                                         data blocks (as allowed by table 6-1), the
                                         corresponding ORB, COV, or MAN entry shall be
                                         duplicated to match.
                  SCLK_OFFSET_AT_EPOCH   Defines the number of spacecraft clock counts existing       s           0.0          -5000.0                           C
                                         at EPOCH_TZERO. This is only used if the SCLK
                                         timescale is employed by the user.
                  SCLK_SEC_PER_SI_SEC    Defines the current number of clock seconds occurring        s           1.0          2.5                               C
                                         during one SI second. It should be noted that this
                                         clock rate may vary with time and is the current
                                         approximate value. This is only used if the SCLK
                                         timescale is employed by the user.

                               Keyword                           Description                         Units   Default (if any)           Examples of Values   M/O/C

                  PREVIOUS_MESSAGE_EPOCH   Creation epoch of the previous message from this                                     2001-11-06T11:17:33           O
                                           originator for this space object. (For format
                                           specification, see 7.5.10.)

                                           NOTE – One may provide the previous message

                                                  epoch without supplying the
                                                  PREVIOUS_MESSAGE_ID, and vice
                                                  versa.
                  NEXT_MESSAGE_EPOCH       Anticipated (or actual) epoch of the next message                                    2001-11-07T11:17:33           O
                                           from this originator for this space object. (For format
                                           specification, see 7.5.10.)

                                           NOTE – One may provide the next message epoch
                                                  without supplying the
                                                  NEXT_MESSAGE_ID, and vice versa.
                  START_TIME               Time of the earliest data contained in the OCM,                                      0.0                           O
                                           specified as either a relative or absolute time tag.                                 2001-11-06T00:00:00

Page 6-11
                  STOP_TIME                Time of the latest data contained in the OCM,                                        86400.0                       O
                                           specified as either a relative or absolute time tag.                                 2001-11-08T00:00:00
                  TIME_SPAN                Span of time that the OCM covers, measured in days.        d                         20.0                          O
                                           TIME_SPAN is defined as (STOP_TIME-
                                           START_TIME), measured in days, irrespective of
                                           whether START_TIME or STOP_TIME are provided
                                           by the message creator.
                  TAIMUTC_AT_TZERO         Difference (TAI – UTC) in seconds (i.e., total number       s                        36                            O
                                           of leap seconds elapsed since 1958) as modeled by the
                                           message originator at epoch ‘EPOCH_TZERO’.
                  NEXT_LEAP_EPOCH          Epoch of next leap second, specified as an absolute                                  2016-12-31T23:59:60           O
                                           time tag.
                  NEXT_LEAP_TAIMUTC        Difference (TAI – UTC) in seconds (i.e., total number       s                        37                            C
                                           of leap seconds elapsed since 1958) incorporated by
                                           the message originator at epoch
                                           ‘NEXT_LEAP_EPOCH’. This keyword should be
                                           provided if NEXT_LEAP_EPOCH is supplied.

                  UT1MUTC_AT_TZERO         Difference (UT1 – UTC) in seconds, as modeled by            s                        0.357                         O
                                           the originator at epoch ‘EPOCH_TZERO’.
                               Keyword                        Description                           Units   Default (if any)          Examples of Values   M/O/C

                  EOP_SOURCE             Free-text field specifying the source and version of the                              CELESTRAK_20201028           O
                                         message originator’s Earth Orientation Parameters
                                         (EOP) used in the creation of this message, including
                                         leap seconds, TAI - UT1, etc.

                  INTERP_METHOD_EOP      Free-text field specifying the method used to select or                               PRECEDING_VALUE              O
                                         interpolate sequential EOP data.                                                      NEAREST_NEIGHBOR
                                                                                                                               LINEAR
                                                                                                                               LAGRANGE_ORDER_5
                  CELESTIAL_SOURCE       Free-text field specifying the source and version of the                              JPL_DE_FILES                 O
                                         message originator’s celestial body (e.g.,
                                         Sun/Earth/Planetary) ephemeris data used in the
                                         creation of this message.
                  META_STOP              End of the metadata section.                                                                                       M

Page 6-12

6.2.5   OCM DATA: TRAJECTORY STATE TIME HISTORY

6.2.5.1 Table 6-4 provides an overview of the OCM trajectory state time history
(‘ephemeris’) section. Only those keywords shown in table 6-4 shall be used in the OCM
trajectory state time history data specification.

6.2.5.2 Each trajectory state time history data block must begin with keyword
TRAJ_START and end with keyword TRAJ_STOP.

6.2.5.3 Multiple trajectory state data blocks shall appear in an OCM only if they are
delimited by separate TRAJ_START and TRAJ_STOP keywords.

6.2.5.4 Each trajectory state time history data block should differ from all others in at least
one of the following respects:
   a) the selected element set (TRAJ_TYPE);
   b) the orbit basis, that is, the orbit determination, navigation solution, or simulation
      (TRAJ_BASIS_ID);
   c) the reference frame is unique (TRAJ_REF_FRAME);
   d) the orbit center is unique (CENTER_NAME);
   e) the data interval timespan is unique (i.e., has no overlap with any other data
      interval(s)).

6.2.5.5 Where multiple trajectory state time history data blocks are provided for the same
TRAJ_BASIS and TRAJ_BASIS_ID, the top-most depiction shall be adopted as the true or
master depiction.

6.2.5.6 Each trajectory state time history shall be time-ordered to be monotonically
increasing.

6.2.5.7 Positionally discontinuous trajectory states (i.e., separated by a gap in the trajectory
state time history data across which interpolation should not be performed) shall be
represented by separate trajectory state time history data blocks.

6.2.5.8 Velocity-discontinuous trajectory states (i.e., by introduction of an impulsive
maneuver) shall be represented by separate trajectory state time history data blocks.

6.2.5.9 All trajectory state time history blocks must contain enough data records to allow
the recommended interpolation method to be carried out consistently throughout the time
span.

6.2.5.10 If the user includes trajectory states at key mission events or times, it may be useful
to provide times, names, and significance for such mission events in the descriptive comment
line(s) immediately following the TRAJ_START keyword.

6.2.5.11 Each line of orbit ephemeris data shall be provided in fixed order beginning with an
absolute or relative time tag, followed by the corresponding trajectory state elements as
defined by TRAJ_TYPE (see SANA registry, reference [11], and annex B, subsection B7).

6.2.5.12 At least one space character must be used to separate the items in each orbit
ephemeris data line.

6.2.5.13 The number of significant figures and time steps suitable for interpolation of an
orbit ephemeris time history should be chosen according to best practice to avoid positional
and interpolation loss of precision (reference [H6]).

6.2.5.14 If a trajectory state time history section is included in the message, a corresponding
perturbations section should be included as well to specify the perturbations incorporated in
these trajectory states.

6.2.5.15 The CENTER_NAME shall be used to specify the origin of the reference frame that
the trajectory state time history is specified in. The specified center may either be a natural,
gravitationally attracting body as provided in annex B, subsection B2, or it may be a non-
gravitationally attracting origin to allow relative positional time histories. If a non-
gravitationally attracting origin is selected, however, then the specified TRAJ_TYPE shall be
confined to Cartesian or spherical coordinates, where the reference frame may be rotating or
inertially fixed.

                                                                   Table 6-4: OCM Data: Trajectory State Time History

                                            Keyword        Description                                               Units   Default (if any)            Examples of Values   M/O/C
                                            TRAJ_START     Start of a trajectory state vector or time history                                   n/a                            M
                                                           section.

                                            COMMENT        Comments (a contiguous set of one or more comment                                    This is a comment              O
                                                           lines may be provided in the Trajectory State Time
                                                           History section only immediately after the
                                                           TRAJ_START keyword; see 7.8 for comment
                                                           formatting rules).
                                            TRAJ_ID        Free-text field containing the identification number                                 TRAJ_20160402_XYZ              O
                                                           for this trajectory state time history block.
                                            TRAJ_PREV_ID   Free-text field containing the identification number                                 ORB20160305A                   O
                                                           for the previous trajectory state time history,
                                                           contained either within this message or presented in a
                                                           previous OCM.

                                                           NOTE – If this message is not part of a sequence of

Page 6-15April 2023CCSDS RECOMMENDED STAN
                                                                  orbit time histories or if this trajectory state
                                                                  time history is the first in a sequence of
                                                                  orbit time histories, then TRAJ_PREV_ID
                                                                  should be excluded from this message.
                                            TRAJ_NEXT_ID   Free-text field containing the identification number                                 ORB20160305C                   O
                                                           for the next trajectory state time history, contained
                                                           either within this message, or presented in a future
                                                           OCM.

                                                           NOTE – If this message is not part of a sequence of
                                                                  orbit time histories or if this trajectory state
                                                                  time history is the last in a sequence of
                                                                  orbit time histories, then TRAJ_NEXT_ID
                                                                  should be excluded from this message.
                                            Keyword                Description                                                 Units   Default (if any)          Examples of Values   M/O/C

                                            TRAJ_BASIS             The basis of this trajectory state time history data.                                  PREDICTED                    O
                                                                   This is a free-text field with the following suggested
                                                                   values:
                                                                    a) ‘PREDICTED’.
                                                                    b) ‘DETERMINED’ when estimated from

                                                                         observation-based                   determination,
                                                                         reconstruction, and/or calibration.             For
                                                                         definitive OD performed onboard spacecraft
                                                                         whose solutions have been telemetered to the
                                                                         ground for inclusion in an OCM, the
                                                                         TRAJ_BASIS shall be DETERMINED.
                                                                    c) ‘TELEMETRY’ when the trajectory states are
                                                                         read directly from telemetry, for example, based
                                                                         on inertial navigation systems or GNSS data.
                                                                    d) ‘SIMULATED’ for generic simulations, future
                                                                         mission design studies, and optimization studies.
                                                                    e) ‘OTHER’ for other bases of this data.
                                            TRAJ_BASIS_ID          Free-text field containing the identification number                                   OD_5910                      O

Page 6-16April 2023CCSDS RECOMMENDED STAN
                                                                   for the telemetry dataset, orbit determination,
                                                                   navigation solution, or simulation upon which this
                                                                   trajectory state time history block is based. When a
                                                                   matching orbit determination block accompanies this
                                                                   trajectory state time history, the TRAJ_BASIS_ID
                                                                   should match the corresponding OD_ID (see
                                                                   table 6-11).
                                            INTERPOLATION          This keyword may be used to specify the                                                HERMITE                      O
                                                                   recommended interpolation method for ephemeris                                         LINEAR
                                                                   data in the immediately following set of ephemeris                                     LAGRANGE
                                                                   lines. PROPAGATE indicates that orbit propagation                                      PROPAGATE
                                                                   is the preferred method to obtain states at intermediate
                                                                   times, via either a midpoint-switching or endpoint
                                                                   switching approach.
                                            INTERPOLATION_DEGREE   Recommended interpolation degree for ephemeris                      3                  5                            C
                                                                   data in the immediately following set of ephemeris                                     1
                                                                   lines. Must be an integer value. This keyword must
                                                                   be provided if the ‘INTERPOLATION’ keyword is
                                                                   used and set to anything other than PROPAGATE.
                                            PROPAGATOR             Free-text field containing the name of the orbit                                       HPOP                         O
                                                                   propagator used to create this trajectory state time                                   SP
                                                                   history.                                                                               SGP4
                                            Keyword            Description                                                Units   Default (if any)           Examples of Values   M/O/C

                                            CENTER_NAME        Origin of the orbit reference frame, which may be a                EARTH              EARTH                         M
                                                               natural solar system body (planets, asteroids, comets,                                MOON
                                                               and natural satellites), including any planet barycenter                              SOLAR SYSTEM BARYCENTER
                                                               or the solar system barycenter, or another reference                                  SUN
                                                               frame center (such as a spacecraft, formation flying

                                                                                                                                                     ISS
                                                               reference ‘chief’ spacecraft, etc.).                                                  EROS
                                                                                                                                                     EARTH_SUN_L2
                                                               Natural bodies shall be selected from the accepted set                                EGLIN
                                                               of values indicated in annex B, subsection B2.

                                                               For spacecraft, it is recommended to use either the
                                                               ‘OBJECT_NAME’ or
                                                               ‘INTERNATIONAL_DESIGNATOR’ of the
                                                               participant as catalogued in the UN Office of Outer
                                                               Space Affairs designator index (reference [3]).
                                                               Alternately, the ‘OBJECT_DESIGNATOR’ may be
                                                               used.

Page 6-17April 2023CCSDS RECOMMENDED STAN
                                                               For other reference frame origins, this field is a free-
                                                               text descriptor which may draw upon other naming
                                                               conventions and sources.
                                            TRAJ_REF_FRAME     Reference frame of the trajectory state time history.              ICRF3              J2000                         M
                                                               Select from the accepted set of values indicated in
                                                               annex B, subsection B4.
                                            TRAJ_FRAME_EPOCH   Epoch of the orbit data reference frame, if not                    EPOCH_TZERO        2001-11-06T11:17:33           C
                                                               intrinsic to the definition of the reference frame. (See                              2002-204T15:56:23Z
                                                               7.5.10 for formatting rules.)
                                            Keyword              Description                                                Units   Default (if any)           Examples of Values   M/O/C

                                            USEABLE_START_TIME   Start time of USEABLE time span covered by                                            1996-12-18T14:28:15.1172
                                                                 ephemeris data immediately following this metadata                                    1996-277T07:22:54
                                                                 block. (For format specification, see 7.5.10.)

                                                                 NOTES

                                                                 1   This optional keyword allows the message
                                                                     creator to introduce fictitious (but numerically
                                                                     smooth) data nodes following the actual data
                                                                     time history to support interpolation methods
                                                                     requiring more than two nodes (e.g., pure
                                                                     higher-order Lagrange interpolation methods).
                                                                     The use of this keyword and introduction of
                                                                     fictitious node points are optional and may not
                                                                     be necessary.
                                                                 2   If this keyword is not supplied, then all data
                                                                     shall be assumed to be valid.
                                            USEABLE_STOP_TIME    Stop time of USEABLE time span covered by                                             1996-12-18T14:28:15.1172
                                                                 ephemeris data immediately following this metadata                                    1996-277T07:22:54

Page 6-18April 2023CCSDS RECOMMENDED STAN
                                                                 block. (For format specification, see 7.5.10.)

                                                                 NOTES
                                                                 1   This optional keyword allows the message
                                                                     creator to introduce fictitious (but numerically
                                                                     smooth) data nodes following the actual data
                                                                     time history to support interpolation methods
                                                                     requiring more than two nodes (e.g., pure
                                                                     higher-order Lagrange interpolation methods).
                                                                     The use of this keyword and introduction of
                                                                     fictitious node points are optional and may not
                                                                     be necessary.
                                                                 2   If this keyword is not supplied, then all data
                                                                     shall be assumed to be valid.
                                            ORB_REVNUM           The integer orbit revolution number associated with                                   1500                          O
                                                                 the first trajectory state in this trajectory state time                              30007
                                                                 history block.

                                                                 NOTE – The first ascending node crossing that
                                                                        occurs AFTER launch or deployment is
                                                                        designated to be the beginning of orbit
                                                                        revolution number = one (‘1’).
                                            Keyword            Description                                                Units   Default (if any)           Examples of Values   M/O/C

                                            ORB_REVNUM_BASIS   Specifies the message creator’s basis for their orbit              0                  0                             C
                                                               revolution counter, with                                                              1
                                                                – ‘0’, designating that the first launch or deployment
                                                                  trajectory state corresponds to a revolution number
                                                                  of 0.XXXX, where XXXX represents the fraction

                                                                  of an orbit revolution measured from the
                                                                  equatorial plane, and orbit revolution 1.0 begins at
                                                                  the very next (subsequent) ascending node
                                                                  passage;
                                                                – ‘1’, designating that the first launch or deployment
                                                                  trajectory state corresponds to a revolution number
                                                                  of 1.XXXX, and orbit revolution 2.0 begins at the
                                                                  very next ascending node passage.

                                                               This keyword shall be provided if ORB_REVNUM is
                                                               specified.
                                            TRAJ_TYPE          Specifies the trajectory state type; selected per                  CARTPV             CARTP                         M
                                                               annex B, subsection B7.

Page 6-19April 2023CCSDS RECOMMENDED STAN
                                            ORB_AVERAGING      If orbital elements are provided, specifies whether                OSCULATING         OSCULATING                    C
                                                               those elements are osculating elements or mean                                        BROUWER
                                                               elements, and if mean elements, which mean element                                    KOZAI
                                                               definition is employed. The intent of this field is to                                (other…)
                                                               allow the user to correctly interpret how to use the
                                                               provided orbit elements and know how to use them
                                                               operationally.

                                                               This field is not required if one of the orbital element
                                                               types selected by the “TRAJ_TYPE” keyword is
                                                               Cartesian (e.g., CARTP, CARTPV, or CARTPVA) or
                                                               spherical elements (e.g., LDBARV, ADBARV, or
                                                               GEODETIC).

                                                               Values should be selected from the accepted set
                                                               indicated in annex B, subsection B13. If an alternate
                                                               single- or double-averaging formulation other than
                                                               that provided is used, the user may name it as
                                                               mutually agreed upon by message exchange
                                                               participants.
                                            Keyword                                    Description                                                Units   Default (if any)            Examples of Values   M/O/C

                                            TRAJ_UNITS                                 A comma-delimited set of SI unit designations for                                     [km,km,km,km/s,km/s,km/s]      O
                                                                                       each element of the trajectory state time history                                     [km,n/a,deg, deg, deg, deg]
                                                                                       following the trajectory state time tag solely for
                                                                                       informational purposes, provided as a free-text field
                                                                                       enclosed in square brackets. When provided, each

                                                                                       trajectory state element shall have a corresponding
                                                                                       units entry, with non-dimensional values (such as
                                                                                       orbit eccentricity) denoted by ‘n/a’.

                                                                                       NOTE – The listing of units via the TRAJ_UNITS
                                                                                              keyword does not override the mandatory
                                                                                              units specified for the selected
                                                                                              TRAJ_TYPE (links to the relevant SANA
                                                                                              registries provided in annex B,
                                                                                              subsection B7).
                                            … < Insert trajectory state time history   Trajectory state time history line(s) shall be formatted                                                             M
                                             here >                                    as specified in 6.2.5.11, containing time and orbit
                                                                                       elements formatted as specified in 7.4.1.5 and

Page 6-20April 2023CCSDS RECOMMENDED STAN
                                                                                       corresponding to the selected TRAJ_TYPE in the
                                                                                       SANA Orbital Elements registry (annex B,
                                                                                       subsection B7). Units are as specified in this registry.
                                            TRAJ_STOP                                  End of a trajectory state vector or time history                                      n/a                            M
                                                                                       section.

6.2.6     OCM DATA: SPACE OBJECT PHYSICAL CHARACTERISTICS

6.2.6.1 Table 6-5 gives an overview of the OCM space object physical characteristics
section. Only those keywords shown in table 6-5 shall be used in OCM space object physical
characteristics data.

6.2.6.2    At most, only one space object physical characteristics section shall appear in an
OCM.

6.2.6.3 The space object physical characteristics data section in the OCM shall be indicated
by two keywords: PHYS_START and PHYS_STOP.

6.2.6.4 The Space Object Optimally Encompassing Box (OEB) parameters are defined in
further detail in informative annex F, subsection F1.

6.2.6.5 Modeling of cross-sectional area and the contributions of relevant parameters
(DRAG_CONST_AREA,                SRP_CONST_AREA,         AREA_ALONG_OEB_MAX,
AREA_ALONG_OEB_INT, and AREA_ALONG_OEB_MIN) to total cross-sectional area
is provided in informative annex F, subsection F1.

                                           Table 6-5: OCM Data: Space Object Physical Characteristics

                               Keyword                          Description                         Units   Default (if any)            Examples of Values   M/O/C
                  PHYS_START             Start of a Space Object Physical Characteristics                                                                     M
                                         section.
                  COMMENT                Comments (a contiguous set of one or more comment                                     This is a comment              O
                                         lines may be provided in the OCM Space Object
                                         Physical Characteristics only immediately after the
                                         PHYS_START keyword; see 7.8 for comment
                                         formatting rules).
                  MANUFACTURER           Free-text field containing the satellite manufacturer’s                               BOEING                         O
                                         name.
                  BUS_MODEL              Free-text field containing the satellite manufacturer’s                               702                            O
                                         spacecraft bus model name.
                  DOCKED_WITH            Free-text field containing a comma-separated list of                                  ISS                            O
                                         other space objects that this object is docked to.
                  DRAG_CONST_AREA        Attitude-independent drag cross-sectional area (AD)        m**2                       2.5                            O
                                         facing the relative wind vector, not already

Page 6-22
                                         incorporated into the attitude-dependent
                                         ‘AREA_ALONG_OEB’ parameters.
                  DRAG_COEFF_NOM         Nominal drag Coefficient (𝐶𝐷 𝑁𝑁𝑁 ). If the atmospheric                                2.2                            O
                                         drag coefficient, CD, is set to zero, no atmospheric
                                         drag shall be considered.
                  DRAG_UNCERTAINTY       Drag coefficient one sigma (1σ) percent uncertainty,        %                         10.0                           O
                                         where the actual range of drag coefficients to within 1σ
                                         shall be obtained from
                                                 𝐷𝐷𝐷𝐺𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈
                                         �1.0 ±                  � �𝐶𝐷 𝑁𝑁𝑁 �. This factor is
                                                       100.0
                                         intended to allow operators to supply the nominal
                                         ballistic coefficient components while accommodating
                                         ballistic coefficient uncertainties.

                             Keyword                              Description                          Units   Default (if any)           Examples of Values   M/O/C

                  INITIAL_WET_MASS         Space object total mass at beginning of life.                kg                        500                            O

                  WET_MASS                 Space object total mass (including propellant, i.e., ‘wet    kg                        472.3                          O
                                           mass’) at the current reference epoch
                                           ‘EPOCH_TZERO’.
                  DRY_MASS                 Space object dry mass (without propellant).                  kg                 300                                  O
                  OEB_PARENT_FRAME         Parent reference frame that maps to the OEB frame via               RSW_ROTATIN ITRF1997                             C
                                           the quaternion-based transformation defined in                           G
                                           annex F, subsection F1. Select from the accepted set
                                           of values indicated in B, subsections B4 and B5.

                                           This keyword shall be provided if OEB_Q1,2,3,4 are
                                           specified.
                  OEB_PARENT_FRAME_EPOCH   Epoch of the OEB parent frame, if                                   EPOCH_TZERO 2001-11-06T11:17:33                  C
                                           OEB_PARENT_FRAME is provided and its epoch is                                   2002-204T15:56:23Z
                                           not intrinsic to the definition of the reference frame.
                                           (See 7.5.10 for formatting rules.)
                  OEB_Q1                   q1 = e1 * sin(φ/2), where per reference [H1],                                          -0.575131822                  O
                                           φ = Euler rotation angle and e1 = 1st component of

Page 6-23
                                           Euler rotation axis for the rotation that maps from the
                                           OEB_PARENT_FRAME (defined above) to the frame
                                           aligned with the OEB (defined in annex F,
                                           subsection F1). A value of ‘-999’ denotes a tumbling
                                           space object.
                  OEB_Q2                   q2 = e2 * sin(φ/2), where per reference [H1],                                          -0.280510532                  O
                                           φ = Euler rotation angle and e2 = 2nd component of
                                           Euler rotation axis for the rotation that maps from the
                                           OEB_PARENT_FRAME (defined above) to the frame
                                           aligned with the Optimally Encompassing Box
                                           (defined in annex F, subsection F1). A value of ‘-999’
                                           denotes a tumbling space object.
                  OEB_Q3                   q3 = e3 * sin(φ/2), where per reference [H1],                                          -0.195634856                  O
                                           φ = Euler rotation angle and e3 = 3rd component of
                                           Euler rotation axis for the rotation that maps from the
                                           OEB_PARENT_FRAME (defined above) to the frame
                                           aligned with the Optimally Encompassing Box

                                           (defined in annex F, subsection F1). A value of ‘-999’
                                           denotes a tumbling space object.
                            Keyword                          Description                          Units   Default (if any)            Examples of Values   M/O/C

                  OEB_QC               qc = cos(φ/2), where per reference [H1],       φ = the                                0.743144825                     O

                                       Euler rotation angle for the rotation that maps from the
                                       OEB_PARENT_FRAME (defined above) to the frame
                                       aligned with the Optimally Encompassing Box
                                       (annex F, subsection F1). qc shall be made non-
                                       negative by convention. A value of ‘-999’ denotes a
                                       tumbling space object.
                  OEB_MAX              Maximum physical dimension (along 𝑋�𝑂𝑂𝑂 ) of the            m                         1                              O
                                       OEB.
                  OEB_INT              Intermediate physical dimension (along 𝑦�𝑂𝑂𝑂 ) of OEB       m                         0.5                            O
                                       normal to OEB_MAX direction.
                  OEB_MIN              Minimum physical dimension (along 𝑧̂𝑂𝑂𝑂 ) of OEB in         m                         0.3                            O
                                       direction normal to both OEB_MAX and OEB_INT
                                       directions.
                  AREA_ALONG_OEB_MAX   Attitude-dependent cross-sectional area of space object    m**2                       0.15                           O
                                       (not already included in DRAG_CONST_AREA and
                                       SRP_CONST_AREA) when viewed along max OEB
                                       (𝑋�𝑂𝑂𝑂 ) direction as defined in annex F.

Page 6-24
                  AREA_ALONG_OEB_INT   Attitude-dependent cross-sectional area of space object    m**2                       0.3                            O
                                       (not already included in DRAG_CONST_AREA and
                                       SRP_CONST_AREA) when viewed along
                                       intermediate OEB (𝑦�𝑂𝑂𝑂 ) direction as defined in
                                       annex F.
                  AREA_ALONG_OEB_MIN   Attitude-dependent cross-sectional area of space object    m**2                       0.5                            O
                                       (not already included in DRAG_CONST_AREA and
                                       SRP_CONST_AREA) when viewed along minimum
                                       OEB (𝑧̂𝑂𝑂𝑂 ) direction as defined in annex F.
                  AREA_MIN_FOR_PC      Minimum cross-sectional area for collision probability     m**2                       1.0                            O
                                       estimation purposes.
                  AREA_MAX_FOR_PC      Maximum cross-sectional area for collision probability     m**2                       1.0                            O
                                       estimation purposes.
                  AREA_TYP_FOR_PC      Typical (50th percentile) cross-sectional area sampled     m**2                       1.0                            O
                                       over all space object orientations for collision
                                       probability estimation purposes.
                  RCS                  Typical (50th percentile) effective Radar Cross Section    m**2                       1.25                           O

                                       of the space object sampled over all possible viewing
                                       angles.
                            Keyword                             Description                           Units   Default (if any)          Examples of Values   M/O/C

                  RCS_MIN                 Minimum Radar Cross Section observed for this               m**2                       1.1                           O

                                          object.
                  RCS_MAX                 Maximum Radar Cross Section observed for this               m**2                       2.5                          O
                                          object.
                  SRP_CONST_AREA          Attitude-independent solar radiation pressure cross-        m**2                       1.0                          O
                                          sectional area (AR) facing the Sun, not already
                                          incorporated into the attitude-dependent
                                          ‘AREA_ALONG_OEB’ parameters computed from

                                          { AREA_ALONG_OEB_MAX cos(𝜃1 ) +
                                            AREA_ALONG_OEB_INT cos(𝜃2 ) +
                                            AREA_ALONG_OEB_MIN cos(𝜃3 ) }

                                          Where 𝜃𝑖 represents the angle between the normal to
                                          each MAX/INT/MIN face and the direction to the Sun.

                  SOLAR_RAD_COEFF         Nominal Solar Radiation Pressure Coefficient                                           1.7                          O
                                          (𝐶𝑅 𝑁𝑁𝑁 ).

Page 6-25
                                          NOTE – If the solar radiation coefficient, CR, is set
                                                      to zero, no solar radiation pressure shall be
                                                      considered.
                  SOLAR_RAD_UNCERTAINTY   SRP one sigma (1σ) percent uncertainty, where the            %                         1.0                          O
                                          actual range of SRP coefficients to within 1σ shall be
                                                                  𝑆𝑆𝑆
                                          obtained from �1.0 ± 𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈𝑈 � �𝐶𝑅 𝑁𝑁𝑁 �. This
                                                                       100.0
                                          factor is intended to allow operators to supply the
                                          nominal ballistic coefficient components while
                                          accommodating ballistic coefficient uncertainties.
                  VM_ABSOLUTE             Typical (50th percentile) absolute Visual Magnitude of                                 15.0                         O
                                          the space object sampled over all possible viewing
                                          angles and ‘normalized’ as specified in informative
                                          annex F, subsection F2 to a 1 AU Sun-to-target
                                          distance, a phase angle of 0°, and a 40,000 km target-
                                          to-sensor distance (equivalent of GEO satellite tracked
                                          at 15.6° above local horizon).
                  VM_APPARENT_MIN         Minimum apparent Visual Magnitude observed for this                                    19.0                         O

                                          space object.
                  VM_APPARENT             Typical (50th percentile) apparent Visual Magnitude                                    15.0                         O
                                          observed for this space object.
                             Keyword                          Description                        Units   Default (if any)          Examples of Values   M/O/C

                  VM_APPARENT_MAX      Maximum apparent Visual Magnitude observed for this                                  16.0                          O

                                       space object.
                                       NOTE – The ‘MAX’ value represents the brightest
                                                   observation, which associates with a lower
                                                   Vmag.
                  REFLECTANCE          Typical (50th percentile) coefficient of                                             0.7                          O
                                       REFLECTANCE of the space object over all possible
                                       viewing angles, ranging from 0 (none) to 1 (perfect
                                       reflectance).
                  ATT_CONTROL_MODE     Free-text specification of primary mode of attitude                                  SPIN                         O
                                       control for the space object. Suggested examples
                                       include:
                                        – THREE_AXIS
                                        – SPIN
                                        – DUAL_SPIN
                                        – TUMBLING
                                        – GRAVITY_GRADIENT
                  ATT_ACTUATOR_TYPE    Free-text specification of type of actuator for attitude                             ATT_THRUSTERS                O

Page 6-26
                                       control. Suggested examples include:
                                        – ATT_THRUSTERS
                                        – ACTIVE_MAG_TORQUE
                                        – PASSIVE_MAG_TORQUE
                                        – REACTION_WHEELS
                                        – MOMENTUM_WHEELS
                                        – CONTROL_MOMENT_GYROSCOPE
                                        – NONE
                                        – OTHER
                  ATT_KNOWLEDGE        Accuracy of attitude knowledge.                            deg                       0.3                          O
                  ATT_CONTROL          Accuracy of attitude control system (ACS) to maintain      deg                       2.0                          O
                                       attitude, assuming attitude knowledge was perfect (i.e.,
                                       deadbands).
                  ATT_POINTING         Overall accuracy of spacecraft to maintain attitude,       deg                       2.3                          O
                                       including attitude knowledge errors and ACS
                                       operation.
                  AVG_MANEUVER_FREQ    Average maneuver frequency, measured in the number #/yr                              20.0                         O
                                       of orbit- or attitude-adjust maneuvers per year.

                  MAX_THRUST           Maximum composite thrust the spacecraft can              N                           1.0                          O
                                       accomplish in any single body-fixed direction.
                  DV_BOL               Total ΔV capability of the spacecraft at beginning of      km/s                      1.0                          O
                                       life.
                             Keyword                         Description                     Units Default (if any)          Examples of Values   M/O/C

                  DV_REMAINING         Total ΔV remaining for the spacecraft.                 km/s                  0.2                             O

                  IXX                  Moment of Inertia about the X-axis of the space      kg*m**2                 1000.0                          O
                                       object’s primary body frame (e.g., SC_Body_1) (see
                                       reference [H1]).
                  IYY                  Moment of Inertia about the Y-axis.                  kg*m**2                 800.0                          O
                  IZZ                  Moment of Inertia about the Z-axis.                  kg*m**2                 400.0                          O
                  IXY                  Inertia Cross Product of the X & Y axes.             kg*m**2                 20.0                           O
                  IXZ                  Inertia Cross Product of the X & Z axes.             kg*m**2                 40.0                           O
                  IYZ                  Inertia Cross Product of the Y & Z axes.             kg*m**2                 60.0                           O
                  PHYS_STOP            End of the Space Object Physical Characteristics                                                            M
                                       section.

Page 6-27

6.2.7     OCM DATA: COVARIANCE TIME HISTORY

6.2.7.1 Table 6-6 provides an overview of the OCM covariance time history section. Only
those keywords shown in table 6-6 shall be used in the OCM covariance time history data
specification.

6.2.7.2 Each covariance time history data block must begin with keyword COV_START
and end with keyword COV_STOP.

6.2.7.3 Multiple trajectory state covariance data blocks shall appear in an OCM only if they
are delimited by separate COV_START and COV_STOP keywords.

6.2.7.4 Each covariance time history data block should differ from all others in at least one
of the following respects:
   a) the selected element set (COV_TYPE);
   b) the orbit basis (COV_BASIS);
   c) the orbit determination, navigation solution, or simulation (COV_BASIS_ID);
   d) the reference frame is unique (COV_REF_FRAME);
   e) the data interval timespan is unique (i.e., has no overlap with any other data interval(s)).

6.2.7.5 When multiple covariance time history data blocks are provided for the same
COV_BASIS and COV_BASIS_ID, the top-most depiction shall be adopted as the true or
master depiction.

6.2.7.6    Each covariance time history shall be time-ordered to be monotonically increasing.

6.2.7.7 Discontinuous covariance time segments shall be represented by separate
covariance time history data blocks.

6.2.7.8 If the user includes trajectory state covariances at key mission events or times, it
may be useful to provide times, names, and significance for such mission events in
descriptive comment line(s) immediately following the COV_START keyword.

6.2.7.9 Values in the trajectory state covariance matrix shall be expressed in the applicable
reference frame specified via the COV_REF_FRAME keyword.

6.2.7.10 Users shall ensure the covariance provided in the message is positive-definite.

6.2.7.11 If a covariance time history section is included in the message:
   a) a corresponding perturbations section should be included as well to specify the
      perturbations accounted for in these covariances;
   b) each covariance time history line shall begin with either a relative or absolute time tag
      corresponding to the specified covariance matrix.

6.2.7.12 For all covariance representations, the covariance time tag and covariance matrix
elements (or dispersions and eigenvectors, in the case of COV_TYPE= SIG3EIGVEC3 or
TSIG3EIGVEC3) shall all be presented on a single line.

6.2.7.12.1 The composition of the covariance matrix shall be commensurate with the
specified COV_TYPE value.

6.2.7.12.2 Directly following the time tag specification on the same line as the time tag, all
elements of the ‘NxN’ covariance shall be presented in row wise fashion.

6.2.7.12.3 On each covariance line, the ordering of the covariance values shall be governed
by the ‘COV_ORDERING’ keyword. Acceptable values (illustrated with a 3x3 matrix example)
are:

6.2.7.12.3.1 LTM: Lower Triangular Matrix beginning with element [1,1], followed by
[2,1], [2,2], [3,1], [3,2] and so on, until all ∑𝑵
                                                 𝒊=𝟏 𝒊 of the LTM entries have been provided as
shown and ordered in figure 6-1.

                                        𝜎𝑥2
                                      �𝜎𝑥 𝜎𝑦        𝜎𝑦2            �
                                       𝜎𝑥 𝜎𝑧       𝜎𝑦 𝜎𝑧     𝜎𝑧2

          Figure 6-1: LTM Covariance Element Ordering following Time Tag

6.2.7.12.3.2 UTM: Upper Triangular Matrix beginning with element [1,1], followed by
[1,2], [1,3], [2,2], [2,3] and so on, until all ∑𝑵
                                                 𝒊=𝟏 𝒊 of the UTM entries have been provided as
shown and ordered in figure 6-2.

                                          𝜎𝑥2   𝜎𝑥 𝜎𝑦      𝜎𝑥 𝜎𝑧
                                      �          𝜎𝑦2       𝜎𝑦 𝜎𝑧 �
                                                            𝜎𝑧2

          Figure 6-2: UTM Covariance Element Ordering following Time Tag

6.2.7.12.3.3 FULL: The full, symmetric covariance matrix, beginning with element [1,1],
followed by [1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2] [3,3] and so on, until all covariance
entries (there are 𝑵𝟐 entries in total) have been provided as shown and ordered in figure 6-3.

                                       𝜎𝑥2        𝜎𝑥 𝜎𝑦     𝜎𝑥 𝜎𝑧
                                     �𝜎𝑥 𝜎𝑦        𝜎𝑦2      𝜎𝑦 𝜎𝑧 �
                                      𝜎𝑥 𝜎𝑧       𝜎𝑦 𝜎𝑧      𝜎𝑧2

           Figure 6-3: Full Covariance Element Ordering following Time Tag

6.2.7.12.3.4 LTMWCC: Lower Triangular Matrix conflated with cross-correlation terms,
where correlation is obtained by dividing the covariance of the two variables by the product
of their standard deviations.       This combined matrix shall be provided beginning with
covariance element [1,1], followed by correlationxy, correlationxz, covariance [2,1], [2,2],
correlationyz, covariance [3,1], [3,2] [3,3], and so on until all covariance entries (there are 𝑵𝟐
entries in total) have been provided as shown and ordered in figure 6-4.

                                     𝜎𝑥2     𝑐𝑐𝑐𝑐𝑥𝑥      𝑐𝑐𝑐𝑐𝑥𝑥
                                   �𝜎𝑥 𝜎𝑦      𝜎𝑦2       𝑐𝑐𝑐𝑐𝑦𝑦 �
                                    𝜎𝑥 𝜎𝑧     𝜎𝑦 𝜎𝑧        𝜎𝑧2

   Figure 6-4: LTM Covariance/Correlation Element Ordering following Time Tag

6.2.7.12.3.5 UTMWCC: Upper Triangular Matrix conflated with cross-correlation terms,
provided beginning with covariance element [1,1], followed by [1,2] and [1,3]; then
correlationxy, covariance [2,2], and [2,3]; then correlationxz, correlationyz, and covariance;
[3,3] and so on until all covariance entries (there are 𝑵𝟐 entries in total) have been provided
as shown and ordered in figure 6-5.

                                      𝜎𝑥2       𝜎𝑥 𝜎𝑦     𝜎𝑥 𝜎𝑧
                                   �𝑐𝑐𝑐𝑐𝑥𝑥       𝜎𝑦2      𝜎𝑦 𝜎𝑧 �
                                    𝑐𝑐𝑐𝑐𝑥𝑥     𝑐𝑐𝑐𝑐𝑦𝑦      𝜎𝑧2

   Figure 6-5: UTM Covariance/Correlation Element Ordering following Time Tag

6.2.7.12.4 At least one space character must be used to separate the items in each covariance
matrix data line as related in 7.4.1.6.

6.2.7.13 Variance and covariance values shall be expressed in floating point or scientific
notation as related in 7.5. The number of significant figures and time steps suitable for
interpolation of a covariance time history should be chosen according to best practice to
avoid covariance interpolation loss of precision (references [H6] and [H13]).

NOTE – It is strongly recommended that covariance matrix time history interpolation be
       done by using either (1) orbit-dynamics-aware numerical methods as provided in
       reference [H9]; (2) eigenvalue/vector decomposition, and linear (or higher-order)
       interpolation of neighboring eigenvalues; Euler axis/angle rotation of
       eigenvectors at intermediate time(s) of interest; and re-composition of attained
       eigenvalues and eigenvectors into covariances at time(s) of interest (see annex F,
       subsection F5 and references [H10], [H11], and [H12]); or (3) considered
       application of the state transition matrix for covariance propagation forward and
       backward from the respective ephemeris endpoints of the interpolation interval
       that produce a covariance at the time of interest using a weighted blending
       approach where the weight of each propagation is based on time from the
       endpoints. Failure to incorporate enough significant figures on the interpolated
       covariance elements can produce invalid (non-positive-semidefinite) covariances.
       Direct interpolation of covariance matrix components or failure to incorporate
       enough significant figures on the interpolated covariance elements can produce
       invalid (non-positive-semidefinite) covariances.

                                                    Table 6-6: OCM Data: Covariance Time History

                              Keyword                          Description                         Units   Default (if any)              Examples of Values   M/O/C
                  COV_START             Start of a covariance time history section.                                           n/a                              M
                  COMMENT               Comments (a contiguous set of one or more comment                                     This is a comment                 O

                                        lines may be provided in the OCM covariance time
                                        history section only immediately after the
                                        COV_START keyword; see 7.8 for comment
                                        formatting rules).
                  COV_ID                Free-text field containing the identification number for                              COV_20160402_XYZ                 O
                                        this covariance time history block.
                  COV_PREV_ID           Free-text field containing the identification number for                              COV_20160305a                    O
                                        the previous covariance time history, contained either
                                        within this message or presented in a previous OCM.

                                        NOTE – If this message is not part of a sequence of
                                                   covariance time histories or if this
                                                   covariance time history is the first in a
                                                   sequence of covariance time histories, then

Page 6-32
                                                   COV_PREV_ID should be excluded from
                                                   this message.
                  COV_NEXT_ID           Free-text field containing the identification number for                              COV_20160305C                    O
                                        the next covariance time history, contained either
                                        within this message, or presented in a future OCM.

                                        NOTE – If this message is not part of a sequence of
                                               covariance time histories or if this
                                               covariance time history is the last in a
                                               sequence of covariance time histories, then
                                               COV_NEXT_ID should be excluded from
                                               this message.

                              Keyword                           Description                        Units   Default (if any)          Examples of Values   M/O/C

                  COV_BASIS             Basis of this covariance time history data. This is free-                             PREDICTED                     O
                                        text field with the following suggested values:                                       EMPIRICAL
                                        a) ‘PREDICTED’.                                                                       DETERMINED
                                        b) ‘DETERMINED’               when      estimated    from                             SIMULATED
                                              observation-based          orbit       determination                            OTHER

                                              reconstruction and/or calibration. For definitive
                                              OD performed onboard whose solutions have
                                              been telemetered to the ground for inclusion in an
                                              OCM, the COV_BASIS shall be considered to be
                                              DETERMINED.
                                        c) EMPIRICAL (for empirically determined such as
                                              overlap analyses).
                                        d) SIMULATED for simulation-based (including
                                              Monte Carlo) estimations, future mission design
                                              studies, and optimization studies.
                                        e) ‘OTHER’ for other bases of this data.
                  COV_BASIS_ID          Free-text field containing the identification number for                              OD_5910                      O
                                        the orbit determination, navigation solution, or
                                        simulation upon which this covariance time history

Page 6-33
                                        block is based. When a matching orbit determination
                                        block accompanies this covariance time history, the
                                        COV_BASIS_ID should match the corresponding
                                        OD_ID (see table 6-11).
                  COV_REF_FRAME         Reference frame of the covariance time history. Select             TNW_INERTIA J2000                               M
                                        from the accepted set of values indicated in annex B,                   L
                                        subsection B4 and B5.
                  COV_FRAME_EPOCH       Epoch of the covariance data reference frame, if not               EPOCH_TZERO 2001-11-06T11:17:33                 C
                                        intrinsic to the definition of the reference frame. (See                       2002-204T15:56:23Z
                                        7.5.10 for formatting rules.)

                  COV_SCALE_MIN         Minimum scale factor to apply to this covariance data                                 0.5                          O
                                        to achieve realism.
                  COV_SCALE_MAX         Maximum scale factor to apply to this covariance data                                 5.0                          O
                                        to achieve realism.
                  COV_CONFIDENCE        A measure of the confidence in the covariance errors        %                         50                           O
                                        matching reality, as characterized via a Wald test, a
                                        Chi-squared test, the log of likelihood, or a numerical

                                        representation per mutual agreement.
                  COV_TYPE              Indicates covariance composition. Select from                         CARTPV          CARTP                        M
                                        annex B, subsections B7 and B8.                                                       CARTPV
                                                                                                                              ADBARV
                            Keyword                                        Description                           Units   Default (if any)       Examples of Values   M/O/C

                  COV_ORDERING                      Indicates covariance ordering as being either LTM,                       LTM          LTM                         M
                                                    UTM, Full covariance, LTM covariance with cross-                                      UTM
                                                    correlation information provided in upper triangle off-                               FULL
                                                    diagonal terms (LTMWCC), or UTM covariance with                                       LTMWCC
                                                    cross-correlation information provided in lower                                       UTMWCC

                                                    triangle off-diagonal terms (UTMWCC).
                  COV_UNITS                         A comma-delimited set of SI unit designations for each                              [km,km,km,km/s,km/s,km/s]     O
                                                    element of the covariance time history following the
                                                    covariance time tag, solely for informational purposes,
                                                    provided as a free-text field enclosed in square brackets.
                                                    When provided, these units designations shall
                                                    correspond to the units of the standard deviations (or
                                                    square roots) of each of the covariance matrix diagonal
                                                    elements (or variances), respectively, and all diagonal
                                                    elements shall have a corresponding units entry, with
                                                    non-dimensional values (such as dispersion in orbit
                                                    eccentricity) denoted by ‘n/a’.

                                                    NOTE – The listing of units via the COV_UNITS

Page 6-34
                                                               keyword does not override the mandatory
                                                               units specified for the selected
                                                               COV_TYPE (links to the relevant SANA
                                                               registries provided in annex B,
                                                               subsections B7 and B8).
                  …< Insert covariance data here>   Covariance time history line(s) shall be formatted as                                                             M
                                                    specified in b) through 6.2.7.13 and 7.4.1.6 and
                                                    corresponding to the selected time and covariance
                                                    elements by COV_TYPE.
                  COV_STOP                          End of a covariance time history section.                                           n/a                           M

6.2.8   OCM DATA: MANEUVER SPECIFICATION

6.2.8.1 Table 6-7 provides an overview of the OCM maneuver specification section. Only
those keywords shown in table 6-7 shall be used in the OCM maneuver time history data
specification.

6.2.8.2 The order of occurrence of these OCM Maneuver Specification keywords shall be
fixed as shown in table 6-7.

6.2.8.3 Maneuver data in the OCM shall be indicated by two keywords: MAN_START
and MAN_STOP.

6.2.8.4 Multiple maneuver data blocks shall appear in an OCM only when delimited by
separate MAN_START and MAN_STOP keywords.

6.2.8.5 The time intervals of multiple maneuver data blocks may be separated in time,
abutted, or overlapped.

NOTE – This is done to accommodate multiple maneuver reference frames, multiple
       thrusters in simultaneous operation, deployments during thrusting phases,
       multiple basis definitions (MAN_BASIS), etc.

6.2.8.6 Each maneuver data block shall be assigned a maneuver device ID
(MAN_DEVICE_ID) value, which specifies the unique thruster (or other propulsive device)
used in this maneuver sequence time history data block.

6.2.8.7 Except for the special values ‘ALL’ and ‘DEPLOY’, MAN_DEVICE_ID is a free-
text field that allows the user to identify which specific thruster or other propulsive device
performed this maneuver time history.

6.2.8.8 A MAN_DEVICE_ID value of ‘ALL’ shall be used to indicate that this maneuver
sequence represents an aggregation of thrust, acceleration, and/or velocity increments
imparted by any/all thrusters utilized in the maneuver that are not attributed to a single
specific propulsive device.

6.2.8.9 A MAN_DEVICE_ID value of ‘DEPLOY’ shall be used to indicate that this
maneuver data block represents ONLY maneuvers caused by a series of one or more
deployments from this host vehicle.

6.2.8.10 Multiple maneuver data blocks may invoke the same maneuver device ID
(MAN_DEVICE_ID) value.

6.2.8.11 All specified maneuver constituents having a common MAN_ID, MAN_BASIS,
and MAN_REF_FRAME shall be added together to obtain the total composite maneuver
description.

6.2.8.12 Each maneuver data block should differ from all other maneuver data blocks in at
least one of the following respects:

   a) the maneuver device ID (MAN_DEVICE_ID) is unique;
   b) the maneuver device ID is the same, but the ‘ON’ time intervals are unique and do not
      overlap with any other data interval(s) for this maneuver device ID (e.g., during
      multiple interleaved duty cycle ‘ON’ firings);
   c) the maneuver basis (MAN_BASIS) is unique;
   d) the reference frame is unique (MAN_REF_FRAME);
   e) the maneuver is based upon a unique orbit determination, navigation solution, or
      simulation (e.g., MAN_BASIS_ID);
   f) the data interval timespan is unique (i.e., has no overlap).

6.2.8.13 If the only difference between multiple maneuver time history data blocks is the
selected maneuver composition (MAN_COMPOSITION) or reference frame
(MAN_REF_FRAME), the top-most depiction (i.e., the time history occurring first in the
OCM) shall be adopted as the official depiction, and those subsequent data blocks shall be
treated as containing informational derivative depictions.

6.2.8.14 The MAN_COMPOSITION keyword shall specify the individual maneuver time
history elements to follow the maneuver time tag.

6.2.8.15 The MAN_COMPOSITION keyword shall contain a comma-separated list of
values taken from either table 6-8 or table 6-9 (i.e., keywords unique to table 6-8 or table 6-9
shall not be commingled within a single maneuver data block).

6.2.8.16 The values contained in the MAN_COMPOSITION keyword shall appear in the
order fixed in either table 6-8 or table 6-9.

6.2.8.17 Maneuver time history lines shall be confined to only one spacecraft object.

6.2.8.18 Only one of the time tag types (TIME_ABSOLUTE or TIME_RELATIVE) shall be
selected as the first element of the MAN_COMPOSITION specification sequence.

6.2.8.19 Within a single maneuver time history line, acceleration, impulsive ΔV, and thrust
parameters shall not be additive, but rather shall be interpreted as alternate representations of
the same underlying propulsive phenomenology.

6.2.8.20 Time tag(s) on each maneuver line shall represent the start of the maneuver, with
the exception that impulsive ΔV entries in the propulsive representation (table 6-8) shall be
interpreted as occurring at a time tag of Tstart + ½ (MAN_DURA).

NOTE – While one could artificially make Tstart and the impulsive maneuver time be the
       same value by setting MAN_DURA equal to zero, the actual duration of the
       maneuver is typically nonzero and providing it if/when known facilitates
       improved modeling and maneuver reconstruction.

6.2.8.20.1 When invoked, interpolation of acceleration (ACC_INTERP=ON) and/or thrust
vectors (THR_INTERP=ON) shall be done using a suitable interpolation scheme such as the
Euler axis/angle formulation discussed in informative annex F, subsection F5.

6.2.8.20.2 Thrust and acceleration levels for any propulsive device shall be presumed to be
‘OFF’ until explicitly turned ‘ON’ by setting one or more thrust or acceleration components
to a non-zero value.

6.2.8.20.3 Thrust and acceleration shall be set back to ‘OFF’ after the maneuver duration has
elapsed [ Tstart + MAN_DURA ]. Thrusters may also be turned ‘OFF’ by setting all thrust
and acceleration components to zero.

6.2.8.20.4 If thrust is continuous (not affected by a duty cycle), then none of the duty cycle
keywords (DC_XXXX) are required.

6.2.8.20.5 If thrust is not continuous (DC_TYPE ≠ CONTINUOUS), thruster duty cycles
shall be triggered either by a reference direction or a reference time.

NOTE – This duty cycle specification imposes cut-outs of non-thrust periods onto the
       thrust (finite burn) parameters to reflect the periods of duty cycle inactivity.

6.2.8.20.6 If the value of the DC_TYPE keyword is TIME, then the following duty cycle
parameters shall be present: DC_WIN_OPEN, DC_WIN_CLOSE, DC_EXEC_START,
DC_EXEC_STOP,            DC_REF_TIME,       DC_TIME_PULSE_DURATION,              and
DC_TIME_PULSE_PERIOD.

6.2.8.20.7 If the value of the DC_TYPE keyword is TIME_AND_ANGLE, then the
following duty cycle parameters shall be present: DC_WIN_OPEN, DC_WIN_CLOSE,
DC_EXEC_START,                     DC_EXEC_STOP,                DC_REF_TIME,
DC_TIME_PULSE_DURATION,              DC_TIME_PULSE_PERIOD,       DC_REF_DIR,
DC_BODY_FRAME,           DC_BODY_TRIGGER,          DC_PA_START_ANGLE,    and
DC_PA_STOP_ANGLE.

6.2.8.20.8 DC_MIN_CYCLES and DC_MAX_CYCLES may be specified to constrain the
number of duty cycles performed in either TIME or TIME_AND_ANGLE mode. These
parameters may override the duty cycle maneuver stop time (DC_EXEC_STOP).

NOTE

1      Relationships between such duty cycle parameters are described in informative
       annex F, subsection F3.

2      The effects of using a pulse width modulation thruster controller can be
       accommodated by applying a reduced constant thrust level or by invoking the duty
       cycle parameters, or a combination thereof (being careful to avoid double-booking of
       thruster degradations).

                                                    Table 6-7: OCM Data: Maneuver Specification

                              Keyword                          Description                        Units   Default (if any)            Examples of Values   M/O/C
                  MAN_START             Start of a maneuver time history section.                                                                           M
                  COMMENT               Comments (a contiguous set of one or more comment                                    This is a comment               O

                                        lines may be provided in the OCM Maneuver
                                        Specification only immediately after the
                                        MAN_START keyword; see 7.8 for comment
                                        formatting rules).
                  MAN_ID                Free-text field containing the unique maneuver                                       E_W_20160305B                  M
                                        identification number for this maneuver. All supplied                                STAGE2
                                        maneuver ‘constituents’ within the same MAN_BASIS
                                        and MAN_REF_FRAME categories shall be added
                                        together to represent the total composite maneuver
                                        description.
                  MAN_PREV_ID           Free-text field containing the identification number of                              E_W_20160305A                  O
                                        the previous maneuver for this MAN_BASIS,
                                        contained either within this message, or presented in a
                                        previous OCM. If this message is not part of a

Page 6-38
                                        sequence of maneuver messages or if this maneuver is
                                        the first in a sequence of maneuvers, then
                                        MAN_PREV_ID should be excluded from this
                                        message.
                  MAN_NEXT_ID           Free-text field containing the identification number of                              E_W_20160305C                  O
                                        the next maneuver for this MAN_BASIS, contained
                                        either within this message, or presented in a future
                                        OCM. If this message is not part of a sequence of
                                        maneuver messages or if this maneuver is the last in a
                                        sequence of maneuvers, then MAN_NEXT_ID should
                                        be excluded from this message.

                              Keyword                           Description                          Units   Default (if any)           Examples of Values   M/O/C

                  MAN_BASIS             Basis of this maneuver time history data, which shall                                   TELEMETRY                      O
                                        be selected from one of the following values:                                           CANDIDATE
                                        a) ‘CANDIDATE’ for a proposed operational or a
                                             hypothetical       (i.e.,    mission    design   and
                                             optimization studies) future maneuver

                                        b) ‘PLANNED’ for a currently planned future
                                             maneuver.
                                        c) ‘ANTICIPATED’ for a non-cooperative future
                                             maneuver that is anticipated (i.e., likely) to occur
                                             (e.g., based upon patterns-of-life analysis).
                                        d) ‘TELEMETRY’ when the maneuver is
                                             determined directly from telemetry (e.g., based on
                                             inertial navigation systems or accelerometers).
                                        e) ‘DETERMINED’ when a past maneuver is
                                             estimated       from       observation-based    orbit
                                             determination reconstruction and/or calibration.
                                        f) ‘SIMULATED’                for    generic     maneuver
                                             simulations, future mission design studies, and
                                             optimization studies.

Page 6-39
                                        g) ‘OTHER’ for other bases of this data.
                  MAN_BASIS_ID          Free-text field containing the identification number for                                OD_20181122A                  O
                                        the orbit determination, navigation solution, or
                                        simulation upon which this maneuver time history
                                        block is based. Where a matching orbit determination
                                        block accompanies this maneuver time history, the
                                        MAN_BASIS_ID should match the corresponding
                                        OD_ID (see table 6-11).
                  MAN_DEVICE_ID         Free-text field containing the maneuver device                                          THR_02                        M
                                        identifier used for this maneuver. ‘ALL’ indicates that                                 DEPLOYMENT
                                        this maneuver represents the summed acceleration,                                       ALL
                                        velocity increment, or thrust imparted by any/all
                                        thrusters utilized in the maneuver.
                  MAN_PREV_EPOCH        Identifies the completion time of the previous                                          50.0                          O
                                        maneuver for this MAN_BASIS.                                                            2001-11-06T11:17:33
                                                                                                                                2002-204T15:56:23Z
                  MAN_NEXT_EPOCH        Identifies the start time of the next maneuver for this                                 50.0                          O
                                        MAN_BASIS.                                                                              2001-11-06T11:17:33

                                                                                                                                2002-204T15:56:23Z
                            Keyword                          Description                          Units   Default (if any)          Examples of Values   M/O/C

                  MAN_PURPOSE         A free-text field used to specify the intention(s) of the                              DISPOSAL                      O
                                      maneuver. Multiple maneuver purposes can be
                                      provided as a comma-delimited list, and could include:
                                       – Aerobraking (AEROBRAKE)
                                       – Attitude adjust (ATTITUDE)

                                       – Collision avoidance (COLA)
                                       – Deployment (DEPLOY)
                                       – Disposal (DISPOSAL)
                                       – Gravity assist flyby
                                         (GRAV_ASSIST_FROM_XXXX, where
                                         XXXX=body center name, e.g., SANA Registry,
                                         reference [11])
                                       – Inclination adjustment (INCLINATION)
                                       – Launch & Early Orbit (LEOP)
                                       – Maneuver cleanup (MNVR_CLEANUP)
                                       – Mass adjust (MASS_ADJUST)
                                       – Momentum desaturation (DESAT)
                                       – Orbit adjust (ORBIT)
                                       – Orbit trim (TRIM)

Page 6-40
                                       – Other (OTHER)
                                       – Period adjustment (PERIOD)
                                       – Pointing Request Message (PRM_ID_xxxx)
                                       – Relocation (RELOCATION)
                                       – Science objective (SCI_OBJ)
                                       – Spin rate adjust (SPIN_RATE)
                                       – Station-keeping (SK)
                                       – Trajectory correction (TRAJ_CORR)
                  MAN_PRED_SOURCE     For future maneuvers, specifies the source of the orbit                                OD_5                         O
                                      and/or attitude state(s) upon which the maneuver is
                                      based. While there is no CCSDS-based restriction on
                                      the value for this free-text keyword, it is suggested to
                                      consider using TRAJ_ID and OD_ID keywords as
                                      described in tables 6-4 and 6-11, respectively, or a
                                      combination thereof.
                  MAN_REF_FRAME       Reference frame in which all maneuver vector                                                                        M
                                                                                                          TNW_INERTIAL J2000
                                      direction data is provided in this maneuver data block.
                                      Select from the accepted set of values indicated in
                                      annex B, subsections B4 and B5. The reference frame

                                      must be the same for all data elements within a given
                                      maneuver time history block.
                            Keyword                           Description                         Units   Default (if any)             Examples of Values   M/O/C

                  MAN_FRAME_EPOCH     Epoch of the maneuver data reference frame, if not                                     2001-11-06T11:17:33              C
                                      intrinsic to the definition of the reference frame. (See                               2002-204T15:56:23Z
                                      7.5.10 for formatting rules.)
                  GRAV_ASSIST_NAME    Origin of maneuver gravitational assist body, which                                    EARTH                           O

                                      may be a natural solar system body (planets, asteroids,                                MOON
                                      comets, and natural satellites), including any planet                                  EROS
                                      barycenter or the solar system barycenter. (See                                        JUPITER
                                      annex B, subsection B2, for acceptable
                                      GRAV_ASSIST_NAME values and the procedure to
                                      propose new values.)
                  DC_TYPE             Duty cycle type to use for this maneuver time history               CONTINUOUS CONTINUOUS                              M
                                      section:                                                                       TIME
                                       – CONTINUOUS denotes full/continuous thrust                                   TIME_AND_ANGLE
                                         <default>;
                                       – TIME denotes a time-based duty cycle driven by
                                         time past a reference time and the duty cycle ON
                                         and OFF durations;
                                       – TIME_AND_ANGLE denotes a duty cycle driven

Page 6-41
                                         by the phasing/clocking of a space object body
                                         frame ‘trigger’ direction past a reference direction.
                  DC_WIN_OPEN         Start time of the duty cycle-based maneuver window                                     50.0                            C
                                      that occurs on or prior to the actual maneuver                                         2001-11-06T11:17:33
                                      execution start time. For example, this may identify                                   2002-204T15:56:23Z
                                      the time at which the satellite is first placed into a
                                      special duty-cycle-based maneuver mode.

                                      This keyword shall be set if DC_TYPE ≠
                                      ‘CONTINUOUS’.
                  DC_WIN_CLOSE        End time of the duty cycle-based maneuver window                                       100.0                           C
                                      that occurs on or after the actual maneuver execution                                  2001-11-07T51:17:33
                                      end time. For example, this may identify the time at
                                                                                                                             2002-204T15:58:03Z
                                      which the satellite is taken out of a special duty-cycle-
                                      based maneuver mode.

                                      This keyword shall be set if DC_TYPE ≠
                                      ‘CONTINUOUS’.

                  DC_MIN_CYCLES       Minimum number of ‘ON’ duty cycles (may override                                       5                               O
                                      DC_EXEC_STOP). This value is optional even if
                                      DC_TYPE ≠ ‘CONTINUOUS’.
                            Keyword                                Description                     Units   Default (if any)           Examples of Values   M/O/C

                  DC_MAX_CYCLES            Maximum number of ‘ON’ duty cycles (may override                                   200                            O
                                           DC_EXEC_STOP). This value is optional even if
                                           DC_TYPE ≠ ‘CONTINUOUS’.
                  DC_EXEC_START            Start time of the initial duty cycle-based maneuver                                50.0                          C
                                           sequence execution. DC_EXEC_START is defined to                                    2001-11-06T11:17:33

                                           occur on or prior to the first maneuver ‘ON’ portion                               2002-204T15:56:23Z
                                           within the duty cycle sequence. DC_EXEC_START
                                           must be scheduled to occur coincident with or after
                                           DC_WIN_OPEN.

                                           This keyword shall be set if DC_TYPE ≠
                                           ‘CONTINUOUS’.
                  DC_EXEC_STOP             End time of the final duty cycle-based maneuver                                    100.0                         C
                                           sequence execution. DC_EXEC_ STOP typically                                        2001-11-07T51:17:33
                                           occurs on or after the end of the final maneuver ‘ON’                              2002-204T15:58:03Z
                                           portion within the duty cycle sequence.
                                           DC_EXEC_STOP must be scheduled to occur
                                           coincident with or prior to DC_WIN_CLOSE.

Page 6-42
                                           This keyword shall be set if DC_TYPE ≠
                                           ‘CONTINUOUS’.
                  DC_REF_TIME              Reference time for the THRUST duty cycle, specified                                8000.0                        C
                                           as either time in seconds (relative to                                             2001-11-06T11:17:33
                                           EPOCH_TZERO), or as an absolute ‘<epoch>’ (see
                                           7.5.10 for formatting rules).

                                           NOTE – Depending upon EPOCH_TZERO,
                                                  DC_REF_TIME relative times may be
                                                  negative.

                                           This keyword shall be set if DC_TYPE ≠
                                           ‘CONTINUOUS’.
                  DC_TIME_PULSE_DURATION   Thruster pulse ‘ON’ duration, initiated at first          s                        10.0                          C
                                           satisfaction of the burn ‘ON’ time constraint or upon
                                           completion of the previous
                                           DC_TIME_PULSE_PERIOD cycle.

                                           This keyword shall be set if DC_TYPE ≠
                                           ‘CONTINUOUS’.
                             Keyword                           Description                           Units   Default (if any)            Examples of Values   M/O/C

                  DC_TIME_PULSE_PERIOD   Elapsed time between the start of one pulse and the          s                         200.0                           C
                                         start of the next. Must be greater than or equal to
                                         DC_TIME_PULSE_DURATION.

                                         This keyword shall be set if DC_TYPE ≠

                                         ‘CONTINUOUS’.
                  DC_REF_DIR             For phase angle thruster duty cycles                                                   1.0 0.0 0.0                    C
                                         (DC_TYPE=TIME_AND_ANGLE); specifies the
                                         reference vector direction in the
                                         ‘MAN_REF_FRAME’ reference frame at which, when
                                         mapped into the space object’s spin plane (normal to
                                         the spin axis), the duty cycle is triggered (see
                                         DC_PA_START_ANGLE for phasing).

                                         This (tripartite, or three-element vector) value shall be
                                         provided if DC_TYPE = ‘TIME_AND_ANGLE’.

                                         This reference direction does not represent the duty

Page 6-43
                                         cycle midpoint.
                  DC_BODY_FRAME          For phase angle thruster duty cycles                                                   SC_BODY_1                      C
                                         (DC_TYPE=TIME_AND_ANGLE); specifies the                                                SENSOR_3
                                         body reference frame in which DC_BODY_TRIGGER
                                         will be specified. Select from the accepted set of
                                         values indicated in annex B, subsection B6. This
                                         keyword shall be set if DC_TYPE =
                                         ‘TIME_AND_ANGLE’.
                  DC_BODY_TRIGGER        For phase angle thruster duty cycles                                                   0.707 0.0 0.707                C
                                         (DC_TYPE=TIME_AND_ANGLE); specifies the
                                         body frame reference vector direction in the
                                         ‘DC_BODY_FRAME’ reference frame at which, when
                                         its projection onto the spin plane crosses the
                                         corresponding projection of DC_REF_DIR onto the
                                         spin plane, this angle-based duty cycle is initiated (see
                                         DC_PA_START_ANGLE for phasing).

                                         This tripartite value shall be provided if DC_TYPE =
                                         ‘TIME_AND_ANGLE’.

                             Keyword                          Description                          Units   Default (if any)          Examples of Values        M/O/C

                  DC_PA_START_ANGLE    For phase angle thruster duty cycles                        deg                        25.0                               C
                                       (DC_TYPE=TIME_AND_ANGLE); specifies the
                                       phase angle offset of thruster pulse start, measured with
                                       respect to the occurrence of a DC_BODY_TRIGGER
                                       crossing of the DC_REF_DIR direction when both are

                                       projected into the spin plane (normal to the body spin
                                       axis). This phase angle offset can be positive or
                                       negative to allow the duty cycle to begin prior to the
                                       next crossing of the DC_REF_DIR. As this angular
                                       direction is to be used in a modulo sense, there is no
                                       requirement for the magnitude of the phase angle offset
                                       to be less than 360 degrees.

                                       This keyword shall be set if DC_TYPE =
                                       ‘TIME_AND_ANGLE’.
                  DC_PA_STOP_ANGLE     For phase angle thruster duty cycles                        deg                        35.0                              C
                                       (DC_TYPE=TIME_AND_ANGLE); specifies the
                                       phase angle of thruster pulse stop, measured with respect
                                       to the DC_BODY_TRIGGER crossing of the

Page 6-44
                                       DC_REF_DIR direction when both are projected into
                                       the spin plane. This phase angle offset can be positive
                                       or negative to allow the duty cycle to end after to the
                                       next crossing of the DC_REF_DIR. As this angular
                                       direction is to be used in a modulo sense, there is no
                                       requirement for the magnitude of the phase angle offset
                                       to be less than 360 degrees.
                                       This keyword shall be set if DC_TYPE =
                                       ‘TIME_AND_ANGLE’.
                  MAN_COMPOSITION      The comma-delimited ordered set of maneuver                                            TIME_ RELATIVE, THR_X, THR_Y,     M
                                       elements of information contained on every maneuver                                    THR_Z, THR_ISP, THR_EFFIC,
                                       time history line, with values selected from table 6-8.                                DELTA_ MASS, DV_X, DV_Y, DV_Z,
                                       Within this maneuver data section, the maneuver                                        DV_MAG_ SIGMA
                                       composition shall include only one TIME specification
                                       (TIME_ABSOLUTE or TIME_RELATIVE).

                                Keyword                                   Description                        Units   Default (if any)            Examples of Values          M/O/C

                  MAN_UNITS                        A comma-delimited set of SI unit designations for each                               [N,N,N,s,%,kg, m/s,m/s,m/s, %,n/a]     O
                                                   and every element of the maneuver time history
                                                   following the maneuver time tag(s), solely for
                                                   informational purposes, provided as a free-text field
                                                   enclosed in square brackets. When MAN_UNITS is

                                                   provided, all elements of MAN_COMPOSITION
                                                   AFTER the maneuver time tag(s) must have a
                                                   corresponding units entry; percentages shall be denoted
                                                   by ‘%’, and control switches, non-dimensional values,
                                                   and text strings shall be labelled as ‘n/a’.
                                                   NOTE – The listing of units via the MAN_UNITS
                                                             keyword does not override the mandatory
                                                             units for the selected
                                                             MAN_COMPOSITION, as specified in
                                                             table 6-8 or table 6-9.
                  … < Insert maneuver data here>   <Maneuver time history data, content, and units shall                                                                      M
                                                   be provided, formatted as specified in 7.4.1.7 and
                                                   corresponding to the selected as specified by
                                                   MAN_COMPOSITION.>

Page 6-45
                  MAN_STOP                         End of a maneuver time history section.                                                                                    M

6.2.8.20.9 Maneuver elements of information shall be drawn from table 6-8 or table 6-9.

NOTE – Each set of data has practical benefits when applied to maneuver scenarios:

6.2.8.20.10 Specification of a time history of acceleration parameters ACC_X, ACC_Y, and
ACC_Z allows the OCM originator to portray and share the net effects of maneuvers without
the OCM recipient needing to do complex finite burn modeling.

6.2.8.21 Specification of ΔV parameters allows simplified modeling assuming impulsive
(instantaneous velocity change) maneuvers.

6.2.8.22 Specification of thrust parameters provides a finite burn capability. In the case of
low-thrust and/or long-duration burns, sequential low-thrust interval maneuver lines may be
used to reflect the evolution of the low-thrust maneuver thrust parameters.

 Table 6-8: OCM Data: Selectable Propulsive (i.e., Non-Deployment) Maneuver
            Fields in the Maneuver Time History Data

                                                                                               Examples of
      Keyword                                    Description                          Units       Values
 TIME_ABSOLUTE      Absolute epoch time as formatted in 7.5.10. (See special time      n/a       2018-11-
                    interpretation for impulsive maneuvers provided in 6.2.8.20.)             13T11:13:20.5Z
 TIME_RELATIVE      Relative epoch time measured in SI seconds with respect to the      s        20157.26
                    epoch time specified via the EPOCH_TZERO keyword. (See
                    special time interpretation for impulsive maneuvers provided in
                    6.2.8.20.)
 MAN_DURA           The maneuver duration associated with this impulsive ΔV, thrust,    s          200.0
                    and/or acceleration-imparted event.
 DELTA_MASS         Mass change (where a negative number denotes a mass                kg           -5.0
                    decrement/loss to the host) associated with this portion (‘time
                    slice’) of the maneuver. For ‘thrust’ specification, this mass
                    change shall include the mass change prescribed by the rocket
                    equation.
 ACC_X              Acceleration component AX in the selected maneuver frame.        km/s**2 0.000734092785
 ACC_Y              Acceleration component AY in the selected maneuver frame.        km/s**2 0.000189779834
 ACC_Z              Acceleration component AZ in the selected maneuver frame.        km/s**2 0.0000794872502
 ACC_INTERP         Acceleration vector Euler axis/angle interpolation mode between    n/a         OFF
                    current and next acceleration line.                                             ON
 ACC_MAG_SIGMA      One-sigma percent error on acceleration magnitude.                  %            1.0
 ACC_DIR_SIGMA      One-sigma angular off-nominal acceleration vector direction.       deg           5.0
 DV_X               Velocity increment ΔVX in the selected maneuver reference frame. km/s          0.025
                    The actual ΔV should be impulsively applied at a time of <time
                    tag> + ½ (MAN_DURA).
 DV_Y               Velocity increment ΔVY in the selected maneuver reference frame. km/s         0.0015
                    The actual ΔV should be impulsively applied at a time of <time
                    tag> + ½ (MAN_DURA).
 DV_Z               Velocity increment ΔVZ in the selected maneuver reference frame. km/s        0.00029
                    The actual ΔV should be impulsively applied at a time of <time
                    tag> + ½ (MAN_DURA).
 DV_MAG_SIGMA       One-sigma percent error on ΔV magnitude.                            %            2.0
 DV_DIR_SIGMA       One-sigma angular off-nominal ΔV vector direction.                 deg           5.0

                                                                                                       Examples of
         Keyword                                     Description                             Units       Values
 THR_X                  Thrust component TX measured in the selected maneuver reference       N           1.0
                        frame.
 THR_Y                  Thrust component TY measured in the selected maneuver reference       N            2.0
                        frame.
 THR_Z                  Thrust component TZ measured in the selected maneuver reference       N            3.0
                        frame.
 THR_EFFIC              Thrust efficiency ‘η,’ typically ranging between 0.0 and 1.0, that    n/a          0.95
                        must be applied to the nominal thrust X, Y, and Z constituents to
                        obtain the net resultant thrust applied to the vehicle.
 THR_INTERP             Thrust vector Euler axis/angle interpolation mode between current     n/a          OFF
                        and next thrust line; values shall be selected as either ‘OFF’ or                  ON
                        ‘ON’.
 THR_ISP                Thrust specific impulse.                                               s          330.0
 THR_MAG_SIGMA          One-sigma percent error on thrust magnitude.                           %           2.0
 THR_DIR_SIGMA          One-sigma angular off-nominal thrust vector direction.                deg          5.0

 Table 6-9: OCM Data: Selectable Deployment Fields in the Maneuver Time History
            Data

                                                                                                      Examples of
       Keyword                                     Description                            Units          Values
  TIME_ABSOLUTE           Absolute epoch time of deployment event as formatted in 7.5.10. n/a           2018-11-
                                                                                                     13T11:13:20.5Z
  TIME_RELATIVE    Relative epoch time of deployment event measured in SI                     s         20157.26
                   seconds with respect to the epoch time specified via the
                   EPOCH_TZERO keyword.
  DEPLOY_ID        Free-text identifier of the resulting ‘child’ object deployed from        n/a      CubeSat_001
                   this host at this time tag. Setting DEPLOY_ID to zero (value =
                   0) indicates that a deployment did not occur.
  DEPLOY_DV_X      Velocity increment ΔVX of the deployed ‘child’ object measured            km/s       0.0001
                   in the selected maneuver reference frame, applied
                   instantaneously at the time tag of deployment.
  DEPLOY_DV_Y      Velocity increment ΔVY of the deployed ‘child’ object measured            km/s       0.00003
                   in the selected maneuver reference frame, applied
                   instantaneously at the time tag of deployment.
  DEPLOY_DV_Z      Velocity increment ΔVZ of the deployed ‘child’ object measured            km/s       0.00002
                   in the selected maneuver reference frame, applied
                   instantaneously at the time tag of deployment.
  DEPLOY_MASS      Decrement in host mass as a result of deployment (shall be ≤              kg           -1.0
                   0.0).
  DEPLOY_DV_SIGMA One-sigma percent error on deployment ΔV magnitude.                         %           5.0
  DEPLOY_DIR_SIGMA One-sigma angular off-nominal deployment vector direction.                deg          5.0

                                                                                                Examples of
       Keyword                                   Description                            Units     Values
  DEPLOY_DV_RATIO      Ratio of child-to-host ΔV vectors, such that:                     n/a       -0.05

                                  ∆𝑣ℎ𝑜𝑜𝑜 = DEPLOY_DV_RATIO × ����
                                  ����                       ∆𝑣𝑐ℎ𝑖𝑖𝑖

                       NOTE – As an opposite ΔV is typically imparted to the host
                              during deployment, this number is typically less than
                              or equal to zero. This ratio allows the user to specify
                              how much ΔV is imparted to the host vehicle. This is
                              usually not -1.0 (i.e., an equal-and-opposite imparted
                              velocity), to account for the mass fraction between
                              the child and the host as well as any rotational torque
                              acted on the host as a result of deployment direction
                              centerline offsets as compared to the host’s center of
                              gravity.
  DEPLOY_DV_CDA                    th                                                   m**2       0.022
                       Typical (50 percentile) product of drag coefficient (Cd) times
                       cross-sectional area for the deployed ‘child’ object.

6.2.9     OCM DATA: PERTURBATIONS SPECIFICATION

6.2.9.1 Table 6-10 provides an overview of the OCM Perturbations Specification section.
Only those keywords shown in table 6-10 shall be used in an OCM Perturbations
Specification.

6.2.9.2    Only one OCM Perturbations Specification section shall appear in an OCM.

6.2.9.3 The OCM Perturbations Specification section shall be delimited by two keywords:
PERT_START and PERT_STOP.

                                                  Table 6-10: OCM Data: Perturbations Specification

                               Keyword                         Description                          Units    Default (if any)              Examples of Values   M/O/C
                  PERT_START             Start of the perturbations data section.                                                                                M
                  COMMENT                Comments (a contiguous set of one or more comment                                      This is a comment                O

                                         lines may be provided in the OCM Perturbations
                                         Specification only immediately after the
                                         PERT_START keyword; see 7.8 for comment
                                         formatting rules).
                  ATMOSPHERIC_MODEL      Name of atmosphere model, which shall be selected                                      MSISE90                          O
                                         from the accepted set of values indicated in annex B,                                  NRLMSIS00
                                         subsection B9.                                                                         J70
                                                                                                                                J71
                                                                                                                                JROBERTS
                                                                                                                                DTM
                                                                                                                                JB2008
                  GRAVITY_MODEL          The gravity model (selected from the accepted set of                                   EGM-96: 36D 36O                  O

Page 6-49
                                         gravity model names indicated in annex B,                                              WGS-84: 8D 0O
                                         subsection B10), followed by the degree (D) and order                                  GGM-01: 36D 36O
                                         (O) of the applied spherical harmonic coefficients                                     TEG-4: 36D 36O
                                         used in the simulation.

                                         NOTE – Specifying a zero value for ‘order’ (e.g., 2D
                                                0O) denotes zonals (J2 … JD).
                  EQUATORIAL_RADIUS      Oblate spheroid equatorial radius of the central body       km                         6378.137                         O
                                         used in the message, if different from the gravity
                                         model.
                  GM                     Gravitational coefficient of attracting body               km**3/                      3.986004e5                       O
                                         (Gravitational Constant x Central Mass), if different       s**2
                                         from the gravity model.
                  N_BODY_PERTURBATIONS   One OR MORE (N-body) gravitational perturbations                                       MOON, SUN, JUPITER               O
                                         bodies used. Values, listed serially in comma-
                                         delimited fashion, denote a natural solar or extra-solar
                                         system body (stars, planets, asteroids, comets, and

                                         natural satellites).
                                         NOTE – Only those entries specified under
                                                CENTER_NAME in annex B,
                                                subsection B2 are acceptable values.
                              Keyword                            Description                             Units   Default (if any)           Examples of Values   M/O/C

                  CENTRAL_BODY_ROTATION   Central body angular rotation rate, measured about the         deg/s                      4.17807421629e-3              O
                                          major principal axis of the inertia tensor of the central
                                          body, relating inertial, and central-body-fixed
                                          reference frames.

                                          NOTE – The rotation axis may be slightly offset
                                                 from the inertial frame Z-axis definition.
                  OBLATE_FLATTENING       Central body’s oblate spheroid oblateness for the                                         0.00335281066475              O
                                          polar-symmetric oblate central body model (e.g., for
                                          the Earth, it is approximately 1.0/298.257223563).
                  OCEAN_TIDES_MODEL       Name of ocean tides model (optionally specify order or                                    DIURNAL                       O
                                          constituent effects, diurnal, semi-diurnal, etc.). This is a                              SEMI-DIURNAL
                                          free-text field, so if the examples on the right are
                                          insufficient, others may be used.
                  SOLID_TIDES_MODEL       Name of solid tides model (optionally specify order or                                    DIURNAL                       O
                                          constituent effects, diurnal, semi-diurnal, etc.).                                        SEMI-DIURNAL
                  REDUCTION_THEORY        Specification of the reduction theory used for                                            IAU1976/FK5                   O

Page 6-50
                                          precession and nutation modeling. This is a free-text                                     IAU2010
                                          field, so if the examples on the right are insufficient,                                  IERS1996
                                          others may be used.
                  ALBEDO_MODEL            Name of the albedo model.                                                                 STK                           O
                  ALBEDO_GRID_SIZE        Number of grid points used in the albedo model.                                           100                           O
                  SHADOW_MODEL            Shadow model used for Solar Radiation Pressure; dual                                      NONE                          O
                                          cone uses both umbra/penumbra regions. Selected                                           CYLINDRICAL
                                          option should be one of ‘NONE’, ‘CYLINDRICAL’,                                            CONE
                                          ‘CONE’, or ‘DUAL_CONE’.                                                                   DUAL_CONE

                  SHADOW_BODIES           Comma-separated list of planetary bodies for which                                        EARTH                         O
                                          SRP shadowing is modeled, selected from annex B for                                       MOON
                                          CENTER_NAME values.
                  SRP_MODEL               Name of SRP model. This is a free-text field, so if the                                   GPS_ROCK                      O
                                          examples on the right are insufficient, others may be                                     BOX_WING
                                          used.                                                                                     CANNONBALL

                                                                                                                                    COD
                                Keyword                          Description                            Units   Default (if any)           Examples of Values   M/O/C

                  SW_DATA_SOURCE          Free-text field specifying the source and version of the                                 CELESTRAK                     O
                                          Space Weather data used in the creation of this
                                          message. Multiple space weather sources can be
                                          specified in a comma-delimited fashion.

                  SW_DATA_EPOCH           Epoch of the Space Weather data.                                                         2001-11-08T00:00:00           O
                  SW_INTERP_METHOD        Free-text field specifying the method used to select or                                  PRECEDING_VALUE               O
                                          interpolate any and all sequential space weather data                                    NEAREST_NEIGHBOR
                                          (Kp, ap, Dst, F10.7, M10.7, S10.7, Y10.7, etc.). While not                               LINEAR
                                          constrained to specific entries, it is anticipated that the                              LAGRANGE_ORDER_5
                                          utilized method would match methods detailed in
                                          numerical analysis textbooks.
                  FIXED_GEOMAG_KP         A fixed (time invariant) value of the planetary                nT                        3.2                           O
                                          geomagnetic index Kp used to override the normal time
                                          varying Kp values (e.g., obtained from
                                          SW_DATA_SOURCE).

                                          NOTE – The use of Kp or Ap would depend on the

Page 6-51
                                                 selected ATMOSPHERIC_MODEL.
                  FIXED_GEOMAG_AP         A fixed (time invariant) value of the geomagnetic              nT                        21                            O
                                          index ap used to override the normal time-varying ap
                                          values (e.g., obtained from SW_DATA_SOURCE).

                                          NOTE – The use of Kp or Ap would depend on the
                                                 selected ATMOSPHERIC_MODEL.
                  FIXED_GEOMAG_DST        A fixed (time invariant) value of the planetary                nT                        -20                           O
                                          geomagnetic index Dst used to override the normal time
                                          varying daily Dst values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  FIXED_F10P7             A fixed (time invariant) value of the Solar Flux Unit         SFU                        120.0                         O
                                          (SFU) daily proxy F10.7 used to override the normal
                                          time varying daily F10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  FIXED_F10P7_MEAN        A fixed (time invariant) value of the solar flux proxy        SFU                        132.0                         O
                                          F10.7 used to override the normal time varying averaged

                                          F10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                                Keyword                         Description                            Units   Default (if any)           Examples of Values   M/O/C

                  FIXED_M10P7             A fixed (time invariant) value of the solar flux daily       SFU                        120.0                         O
                                          proxy M10.7 used to override the normal time varying
                                          daily M10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).

                  FIXED_M10P7_MEAN        A fixed (time invariant) value of the solar flux proxy       SFU                        120.0                         O
                                          M10.7 used to override the normal time varying averaged
                                          M10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  FIXED_S10P7             A fixed (time invariant) value of the solar flux proxy       SFU                        120.0                         O
                                          S10.7 used to override the normal time varying daily S10.7
                                          values (e.g., obtained from SW_DATA_SOURCE).
                  FIXED_S10P7_MEAN        A fixed (time invariant) value of the solar flux proxy       SFU                        120.0                         O
                                          S10.7 used to override the normal time varying averaged
                                          S10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  FIXED_Y10P7             A fixed (time invariant) value of the solar flux proxy       SFU                        120.0                         O
                                          Y10.7 used to override the normal time varying daily

Page 6-52
                                          Y10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  FIXED_Y10P7_MEAN        A fixed (time invariant) value of the solar flux proxy       SFU                        120.0                         O
                                          Y10.7 used to override the normal time varying averaged
                                          Y10.7 values (e.g., obtained from
                                          SW_DATA_SOURCE).
                  PERT_STOP               End of the perturbations section.                                                                                     M

6.2.10 OCM DATA: ORBIT DETERMINATION DATA

6.2.10.1 Table 6-11 provides an overview of the OCM orbit determination data section.
Only those keywords shown in table 6-11 shall be used in an OCM orbit determination data
specification.

6.2.10.2 At most, only one Orbit Determination Data section shall appear in an OCM.

6.2.10.3 Orbit determination data in the OCM shall be indicated by two keywords:
OD_START and OD_STOP.

6.2.10.4 The values of the DAYS_SINCE_FIRST_OBS, and DAYS_SINCE_LAST_OBS
keywords shall be specified as relative time, in days, to the value of the OD_EPOCH
keyword.

6.2.10.5 If an orbit determination parameters section is included in the message, a
corresponding perturbations section shall be included as well to specify the perturbations
incorporated in the orbit determination.

6.2.10.6 When these orbit determination settings match those used to generate an OCM
orbit, covariance, and/or maneuver time history, the OD_ID should match the
TRAJ_BASIS_ID, COV_BASIS_ID, and/or MAN_BASIS_ID keyword values respectively.

                                                   Table 6-11: OCM Data: Orbit Determination Data

                  Keyword                Description                                                  Units   Default (if any)              Examples of Values   M/O/C
                  OD_START               Start of the orbit determination data section.                                          n/a                              M
                  COMMENT                Comments (a contiguous set of one or more comment                                       This is a comment                 O
                                         lines may be provided in the OCM Orbit

                                         Determination Data section only immediately after the
                                         OD_START keyword; see 7.8 for comment formatting
                                         rules).
                  OD_ID                  Identification number for this orbit determination.                                     OD_20160402                      M
                  OD_PREV_ID             Optional identification number for the previous orbit                                   OD_20160401                      O
                                         determination.

                                         NOTE – If this orbit determination is the first one
                                                     performed on this object, then OD_PREV_ID
                                                     should be excluded from this message.
                  OD_METHOD              Type of orbit determination method used to produce                                      BWLS: BAHN                       M
                                         the orbit estimate. While this is a free-text field, it is                              BWLS: ODIN
                                         suggested that it comprise the method, followed by a                                    SF: ODTK

Page 6-54
                                         colon delimiter and the actual OD tool used to estimate
                                         the orbit (e.g., BAHN, ODIN, ODTK).

                                         NOTE – Commonly used methods include Batch
                                                    Weighted Least Squares (BWLS), Extended
                                                    Kalman Filter (EKF), Sequential Filter (SF),
                                                    Square Root Information Filter (SRIF),
                                                    Sequential Simultaneous Estimation Method
                                                    (SSEM).
                  OD_EPOCH               Relative or absolute time tag of the orbit determination                                2001-11-06T11:17:33              M
                                         solved-for state in the selected OCM time system                                        27854.239
                                         specified by the TIME_SYSTEM keyword.

                  DAYS_SINCE_FIRST_OBS   Days elapsed between first accepted observation and           d                         3.5                              O
                                         OD_EPOCH.
                                         NOTE – May be positive or negative.
                  DAYS_SINCE_LAST_OBS    Days elapsed between last accepted observation and            d                         1.2                              O
                                         OD_EPOCH.

                                         NOTE – May be positive or negative.
                  RECOMMENDED_OD_SPAN    Number of days of observations recommended for the            d                         5.2                              O
                                         OD of the object (useful only for Batch OD systems).
                  Keyword              Description                                              Units   Default (if any)           Examples of Values   M/O/C

                  ACTUAL_OD_SPAN       Actual time span in days used for the OD of the object.   d                         2.3                            O
                                       NOTE – Should equal (DAYS_SINCE_FIRST_OBS
                                                   - DAYS_SINCE_LAST_OBS).
                  OBS_AVAILABLE        The number of observations available within the actual                              100                           O
                                       OD time span.

                  OBS_USED             The number of observations accepted within the actual                               90                            O
                                       OD time span.
                  TRACKS_AVAILABLE     The number of sensor tracks available for the OD                                    33                            O
                                       within the actual time span (see definition of ‘tracks’,
                                       1.5.2).
                  TRACKS_USED          The number of sensor tracks accepted for the OD                                     30                            O
                                       within the actual time span (see definition of ‘tracks’,
                                       1.5.2).
                  MAXIMUM_OBS_GAP      The maximum time between observations in the OD of        d                         1.0                           O
                                       the object.
                  OD_EPOCH_EIGMAJ      Positional error ellipsoid 1𝜎 major eigenvalue at the     m                         58.73                         O
                                       epoch of the OD.
                  OD_EPOCH_EIGINT      Positional error ellipsoid 1𝜎 intermediate eigenvalue at  m                         35.7                          O

Page 6-55
                                       the epoch of the OD.
                  OD_EPOCH_EIGMIN      Positional error ellipsoid 1𝜎 minor eigenvalue at the     m                         21.5                          O
                                       epoch of the OD.
                  OD_MAX_PRED_EIGMAJ   The resulting maximum predicted major eigenvalue of       m                         21.5                          O
                                       the 1𝜎 positional error ellipsoid over the entire
                                       TIME_SPAN of the OCM, stemming from this OD.
                  OD_MIN_PRED_EIGMIN   The resulting minimum predicted minor eigenvalue of       m                         21.5                          O
                                       the 1𝜎 positional error ellipsoid over the entire
                                       TIME_SPAN of the OCM, stemming from this OD.
                  OD_CONFIDENCE        OD confidence metric, which spans 0 to 100% (useful       %                         95.3                          O
                                       only for Filter-based OD systems). The OD
                                       confidence metric shall be as mutually defined by
                                       message exchange participants.
                  GDOP                 Generalized Dilution Of Precision for this orbit                                    .857                          O
                                       determination, based on the observability grammian as
                                       defined in references [H15] and [H16] and expressed in
                                       informative annex F, subsection F4. GDOP provides a
                                       rating metric of the observability of the element set

                                       from the OD. Alternate GDOP formations may be
                                       used as mutually defined by message exchange
                                       participants.
                  Keyword           Description                                             Units Default (if any)           Examples of Values   M/O/C

                  SOLVE_N           The number of solve-for states in the orbit                                      6                              O
                                    determination.
                  SOLVE_STATES      Free-text comma-delimited description of the state                               POS[3], VEL[3]                O
                                    elements solved for in the orbit determination.
                  CONSIDER_N        The number of consider parameters used in the orbit                              2                             O

                                    determination.
                  CONSIDER_PARAMS   Free-text comma-delimited description of the consider                            DRAG, SRP                     O
                                    parameters used in the orbit determination.
                  SEDR              The Specific Energy Dissipation Rate, which is the      W/kg                     4.54570E-05                   O
                                    amount of energy being removed from the object’s
                                    orbit by the non-conservative forces. This value is an
                                    average calculated during the OD. (See annex F,
                                    subsection F7 for definition.)
                  SENSORS_N         The number of sensors used in the orbit determination.                           3                             O
                  SENSORS           Free-text comma-delimited description of the sensors                             EGLIN, FYLINGDALES            O
                                    used in the orbit determination.
                  WEIGHTED_RMS      (Useful/valid only for Batch OD systems.)              (measur                   1.3                           O
                                    The weighted RMS residual ratio, defined as:            ement

Page 6-56
                                                                                            units)
                                                                    ∑𝑁 𝑤𝑖 (𝑦𝑖 − 𝑦�𝑖 )2
                                             𝑊𝑊𝑊𝑊ℎ𝑡𝑡𝑡 𝑅𝑅𝑅 = � 𝑖=1
                                                                           𝑁
                                    Where yi is the ith observation measurement,
                                    𝑦�𝑖 is the current estimate of yi,
                                             1
                                    𝑤𝑖 = 𝜎2 is the weight (sigma) associated with the
                                           𝑖
                                    measurement at the ith time and N is the number of
                                    observations.
                                    This is a value that can generally identify the quality of
                                    the most recent vector update and is used by the
                                    analyst in evaluating the OD process. A value of 1.00
                                    is ideal.

                  Keyword      Description                                                   Units   Default (if any)         Examples of Values   M/O/C

                  DATA_TYPES   Comma-separated list of observation data types                                           ANGLE_1, ANGLE_2             O
                               utilized in this orbit determination. Although this is a
                               free-text field, it is recommended at a minimum to use
                               data type descriptor(s) as provided in table 3-5 of the
                               TDM standard (reference [9]) (excluding the

                               DATA_START, DATA_STOP, and COMMENT
                               keywords). Additional descriptors/detail is encouraged
                               if the descriptors of table 3-5 are not sufficiently clear;
                               for example, one could replace ANGLE_1 and
                               ANGLE_2 with RADEC (e.g., from a telescope),
                               AZEL (e.g., from a ground radar), RANGE (whether
                               from radar or laser ranging), etc.
                  OD_STOP      End of the orbit determination data section.                                             n/a                         M

Page 6-57

6.2.11 OCM DATA: USER-DEFINED PARAMETERS

6.2.11.1 A single section of User-Defined Parameters may be provided if necessary. In
principle, this provides flexibility, but also introduces complexity, non-standardization,
potential ambiguity, and potential processing errors. Accordingly, if used, the keywords and
their meanings must be described in an ICD. User-Defined Parameters, if included, should
be used as sparingly as possible; their use is not encouraged.

6.2.11.2 At most, only one User-Defined Parameters section shall appear in an OCM.

6.2.11.3 Table 6-12 provides an overview of the OCM user-defined data section. Only those
keywords shown in table 6-12 shall be used in an OCM user-defined data specification.

                   Table 6-12: OCM Data: User-Defined Parameters

      Keyword                     Description               Units          Examples of Values      M/O/C
 USER_START        Start of the User-Defined Parameters                                             M
                   data block.

 COMMENT           Comments (a contiguous set of one or             This is a comment                O
                   more comment lines may be provided
                   immediately following the
                   USER_START keyword). (See 7.8 for
                   formatting rules.)
 USER_DEFINED_x    User-defined parameter, where ‘x’ is             USER_DEFINED_EARTH_MODEL =       M
                   replaced by a variable-length user-              WGS-84
                   specified character string. Any number
                   of user-defined parameters may be
                   included, if necessary, to provide
                   essential information that cannot be
                   conveyed in COMMENT statements.
 USER_STOP         End of the User-Defined Parameters                                                M
                   data block.

# 7 ORBIT DATA MESSAGE SYNTAX
## 7.1 OVERVIEW

This section details the syntax requirements for each of the Orbit Data Messages.

## 7.2 GENERAL

The Orbit Data Messages (OPM, OMM, OEM, and OCM) shall observe the syntax described
in 7.3 through 7.8.

## 7.3 ODM LINES

7.3.1     Each OPM, OMM, OEM, or OCM line shall be one of the following:
      –   Header line;
      –   Metadata line;
      –   Data line;
      –   Comment line; or
      –   Blank line.

7.3.2 Each OPM, OMM, or OEM line must not exceed 254 ASCII characters and spaces
(excluding line termination character[s]).

7.3.3 OCM lines may be of arbitrary length. If exchange between the two parties requires a
maximum line length, that limit should be mutually agreed upon between message exchange
partners.

7.3.4 Only printable ASCII characters and blanks shall be used. Control characters (such
as TAB, etc.) shall not be used, except for the line termination characters specified below.

7.3.5 Blank lines may be used at any position within the file. Blank lines shall have no
assignable meaning and may be ignored.

7.3.6     The first header line must be the first non-blank line in the file.

7.3.7 All lines shall be terminated by a single Carriage Return or a single Line Feed, a
Carriage Return/Line Feed pair, or a Line Feed/Carriage Return pair.

7.4     ORBIT DATA MESSAGES IN ‘KEYWORD = VALUE NOTATION’ (I.E., NON-
        XML) AND ORDER OF ASSIGNMENT STATEMENTS

7.4.1 For the OPM and OMM, all header, metadata, and data lines shall use ‘keyword =
value’ notation, abbreviated as KVN.

7.4.1.1    For the OEM, all header and metadata elements shall use KVN notation.

7.4.1.2 OEM ephemeris data lines shall not use KVN format; rather, the OEM ephemeris
data line has a fixed structure containing seven required fields (epoch time, three position
components, three velocity components), and three optional acceleration components. (See
5.2.4.)

7.4.1.3 OEM covariance matrix epoch and covariance reference frame (if used) shall use
KVN format. The OEM covariance data lines shall not use KVN format; rather, the OEM
covariance data line has a fixed structure containing from one to six required fields (a row
from the 6x6 lower triangular form covariance matrix). (See 5.2.5.)

7.4.1.4    For the OCM, all header and metadata elements shall use KVN notation.

7.4.1.5 OCM trajectory state time history data lines shall not use KVN format; rather, the
structure of such OCM trajectory state time history data shall comprise a contiguous set of
lines, with the values on each line separated by at least one white space character, and those
values consisting of the time tag followed by the parameters corresponding to the selected
orbit set (see TRAJ_TYPE, 6.2.5).

7.4.1.6 OCM covariance matrix epoch and covariance reference frame (if used) shall use
KVN format. The OCM covariance data lines shall not use KVN format; rather, OCM
covariance time history data shall comprise a contiguous set of lines, with the values on each
line separated by at least one white space character, and those values consisting of the time
tag followed by the covariance matrix corresponding to the selected covariance type (see
COV_TYPE, 6.2.7, particularly 6.2.7.11 through 6.2.7.13).

7.4.1.7 OCM maneuver data lines shall not use KVN format; rather, OCM maneuver data
shall comprise a contiguous set of lines, the values on each line separated by at least one
white space character, and with those values consisting of the specified maneuver parameters
(see MAN_COMPOSITION, 6.2.8.14).

7.4.2 The keywords ‘COMMENT’, *‘_START’, and *‘_STOP’ are exceptions to the KVN
syntax assignment.

7.4.3     Only a single ‘keyword = value’ assignment shall be made on a line.

7.4.4     Keywords must be uppercase and must not contain blanks.

7.4.5 Any white space immediately preceding or following the keyword shall not be
significant.

7.4.6 Any white space immediately preceding or following the ‘equals’ sign shall not be
significant.

7.4.7    Any white space immediately preceding the end of line shall not be significant.

7.4.8 The order of occurrence of mandatory and optional KVN assignments shall be fixed
as shown in the tables in sections 3, 4, 5, and 6 that describe the OPM, OMM, OEM, and
OCM keywords.

## 7.5 VALUES

7.5.1 A non-empty value field must be assigned to each mandatory keyword except for
*‘_START’ and *‘_STOP’ keyword values.

7.5.2 Comments and free-text value fields may be in any case (or mix of case) desired by
the user.

7.5.3 Apart from comments and free-text fields, normative text value fields shall be
constructed using only exclusively all uppercase or exclusively all lowercase.

7.5.4 Integer values shall consist of a sequence of decimal digits with an optional leading
sign (‘+’ or ‘-’). If the sign is omitted, ‘+’ shall be assumed. Leading zeroes may be used.
The range of values that may be expressed as an integer is:

-2,147,483,648 ≤ x ≤ +2,147,483,647 (i.e., -231 ≤ x ≤ 231-1).

NOTE – The commas in the range of values above are thousands separators and are used
       only for readability. They should not appear in an actual message.

7.5.5 Non-integer numeric values may be expressed in either fixed-point or floating-point
notation. Both representations may be used within an OPM, OMM, OEM, or OCM.

7.5.6 Non-integer numeric values expressed in fixed-point notation shall consist of a
sequence of decimal digits separated by a period as a decimal point indicator, with an
optional leading sign (‘+’ or ‘-’). If the sign is omitted, ‘+’ shall be assumed. Leading and
trailing zeroes may be used. At least one digit shall appear before and after a decimal point.
The number of digits shall be 16 or fewer.

7.5.7 Non-integer numeric values expressed in floating point notation shall consist of a
sign, a mantissa, an alphabetic character indicating the division between the mantissa and
exponent, and an exponent, constructed according to the following rules:
      a) The sign may be ‘+’ or ‘-’. If the sign is omitted, ‘+’ shall be assumed.
      b) The mantissa must be a string of no more than 16 decimal digits with a decimal point
         (‘.’) in the second position of the ASCII string, separating the integer portion of the
         mantissa from the fractional part of the mantissa.

      c) The character used to denote exponentiation shall be ‘E’ or ‘e’. If the character
         indicating the exponent and the following exponent are omitted, an exponent value of
         zero shall be assumed (essentially yielding a fixed-point value).
      d) The exponent must be an integer and may have either a ‘+’ or ‘-’ sign (if the sign is
         omitted, then ‘+’ shall be assumed).
      e) The maximum positive floating-point value is approximately 1.798E+308, with 16
         significant decimal digits precision. The minimum positive floating-point value is
         approximately 4.94E-324, with 16 significant decimal digits precision.

7.5.8    Blanks shall not be permitted within numeric values and time strings.

7.5.9 In value fields that are text, an underscore shall be equivalent to a single blank.
Individual blanks shall be retained (shall be significant), but multiple contiguous blanks shall
be equivalent to a single blank.

7.5.10 In value fields that represent an absolute time tag or epoch, times shall be given in
one of the following two formats:

             YYYY-MM-DDThh:mm:ss[.d→d][Z]

             or

             YYYY-DDDThh:mm:ss[.d→d][Z],

where ‘YYYY’ is the year; ‘MM’ is the two-digit month; ‘DD’ is the two-digit day; ‘DDD’
is the three-digit day of year; ‘T’ is constant; ‘hh:mm:ss[.d→d]’ is the time in hours, minutes,
seconds, and optional fractional seconds; and ‘Z’ is an optional time code terminator (the
only permitted value is ‘Z’ for Zulu, i.e., UTC). As many ‘d’ characters to the right of the
period as required may be used to obtain the required precision, up to the maximum allowed
for a fixed-point number. All fields shall have leading zeros. (See reference [2], ASCII
Time Code A or B.)

NOTE – During a leap second introduction, the value of the two-digit integer seconds (ss)
       field shall be ‘60’ as specified in reference [2].

7.5.11 The time system for CREATION_DATE is UTC; for all other keywords representing
times or epochs, the time system is determined by the TIME_SYSTEM metadata keyword.

## 7.6 OCM VECTOR DATA TYPE

7.6.1 Several OCM keywords may be set to values containing more than one number.
Examples include DC_REF_DIR and DC_BODY_TRIGGER. Such vectors shall be space-
delimited and provided serially on a single line following the equals ‘=’ sign, adhering to the
requirements for ‘numeric values’ provided in the previous sections.

## 7.7 UNITS IN THE ORBIT DATA MESSAGES

### 7.7.1 OPM/OMM UNITS

7.7.1.1 For documentation purposes and clarity only, units may be included as ASCII text
after a value in the OPM and OMM. If units are displayed, they must exactly match the units
(including lower/upper case) as specified in tables 3-3 and 4-3. If units are displayed, then:
      a) there must be at least one blank character between the value and the units text;
      b) the units must be enclosed within square brackets (e.g., ‘[km]’);
      c) combinations of units shall adhere to requirements listed in 1.5.

7.7.1.2 Some of the items in the applicable tables are dimensionless. The table shows a
unit value of ‘n/a’, which in this case means that there is no applicable units designator for
these items (e.g., for ECCENTRICITY).

7.7.1.3    The notation ‘[n/a]’ shall not appear in an OPM or OMM.

### 7.7.2 OEM UNITS

7.7.2.1 In an OEM ephemeris data line, units shall be km, km/s, and km/s**2 for position,
velocity, and acceleration components, respectively, but the units shall not be displayed.

7.7.2.2 In an OEM covariance matrix line, units shall be km**2, km**2/s, or km**2/s**2,
depending on whether the element is computed from two position components, one position
component and one velocity component, or two velocity components. The units shall not be
displayed.

### 7.7.3 OCM UNITS

7.7.3.1 Apart from trajectory state, covariance, and maneuver data lines, units of OCM
keyword values shall correspond to the normative ‘Units’ column of the accompanying
Keyword Value Tables (i.e., tables 6-3 through 6-12) for each section definition.

NOTE – The units used throughout the OCM are generally a combination of kilometers
       for distance and seconds for time (e.g., km/s for velocity, km/s**2 for
       acceleration, and so forth). Mass is in kilograms, and force is in Newtons.

7.7.3.2 The units of orbit time state history data lines, when present, shall adhere to the
specified units for trajectory states as provided in the SANA Registry (reference [11]) for
Orbital Elements (annex B, subsection B7).

7.7.3.3 The units of covariance time history data lines, when present, shall adhere to the
specified units for covariance data as provided in the SANA Registry (reference [11]) for
Orbital Elements (annex B, subsection B7) and Additional Covariance Representations
(annex B, subsection B8).

7.7.3.4 The units of maneuver time history data lines, when present, shall adhere to the
specified units for maneuver lines as provided in table 6-8 and table 6-9.

7.7.3.5 For OCM keywords used to convey multipartite trajectory state, covariance, or
maneuver data lines, units may accompany these data lines via the TRAJ_UNITS,
COV_UNITS, and MAN_UNITS keywords, respectively. Units shall not be displayed in
OCM trajectory state, covariance, or maneuver data lines themselves.

7.7.3.6 For OCM keywords that are not used to convey multipartite trajectory state,
covariance, or maneuver data lines, units may be included as ASCII text after a value in the
OCM for documentation purposes and clarity only. If units are displayed, then:
      a) there must be at least one blank character between the value and the units text;
      b) the units must be enclosed within square brackets (e.g., ‘[m]’);
      c) combinations of units shall adhere to requirements listed in 1.5.

7.7.3.7 Some of the items in the applicable tables are dimensionless. The table shows a
unit value of ‘n/a’, which in this case means that there is no applicable units designator for
these items (e.g., for ECCENTRICITY) and no units displayed.

## 7.8 COMMENTS IN THE ORBIT DATA MESSAGES

7.8.1 There are certain pieces of information that provide clarity and remove ambiguity
about the interpretation of the information in a file yet are not standardized so as to fit cleanly
into the ‘keyword = value’ paradigm. Rather than force the information to fit into a space
limited to one line, the ODM producer should put further specifications and information into
comments. Static information should be separately shared and/or mutually agreed upon
between message exchange partners outside of the ODM.

7.8.2 Comments may be used to provide provenance information or to help describe
dynamical events or other pertinent information associated with the data. This additional
information is intended to aid in consistency checks and elaboration when needed but shall
not be required for successful processing of a file.

7.8.3    For the OPM, OMM, OEM, and OCM, comment lines shall be optional.

7.8.4    Comment text may be in any case (or mix of case) desired by the user.

7.8.5 All comment lines shall begin with the ‘COMMENT’ keyword followed by at least
one space. This keyword must appear on every comment line, not just the first such line.
The remainder of the line shall be the comment value. White space shall be retained (shall be
significant) in comment values.

7.8.6 Placement of comments shall be as specified in the tables in sections 3, 4, 5, and 6
that describe the OPM, OMM, OEM, and OCM keywords.

7.8.7 Comments in the OPM may appear in the OPM Header immediately after the
‘CCSDS_OPM_VERS’ keyword, at the very beginning of the OPM Metadata section, and at
the beginning of a logical block in the OPM Data section. Comments must not appear
between the components of any logical block in the OPM Data section.

NOTE – The logical blocks in the OPM Data section are indicated in table 3-3.

7.8.8 Comments in the OMM may appear in the OMM Header immediately after the
‘CCSDS_OMM_VERS’ keyword, at the very beginning of the OMM Metadata section, and
at the beginning of a logical block in the OMM Data section. Comments must not appear
between the components of any logical block in the OMM Data section.

NOTE – The logical blocks in the OMM Data section are indicated in table 4-3.

7.8.9 Comments in the OEM may appear in the OEM Header immediately after the
‘CCSDS_OEM_VERS’ keyword, at the very beginning of the OEM Metadata section (after
the ‘META_START’ keyword), at the beginning of the OEM Ephemeris Data Section, and at
the beginning of the OEM Covariance Data section (after the ‘COV_START’ keyword).
Comment lines must not appear within any block of ephemeris lines or covariance matrix
lines.

7.8.10 Comments may appear in all logical blocks of the OCM, but only at the positions
shown in the defining tables (generally at the top of each section, following the *_START
section delimiting keyword).

7.8.11 Extensive comments in an ODM are recommended in cases when that content is
germane to the message and changes from message to message.

7.8.12 The following comments should be provided:
   a) Information regarding the genesis, history, interpretation, intended use, etc., of the
      state vector, spacecraft, maneuver, or ephemeris that may be of use to the receiver of
      the OPM, OMM, OEM, or OCM:

COMMENT Source: File created by JPL Multi-Mission Navigation Team as part
COMMENT of Launch Operations Readiness Test held on 20 April 2001.

      b) Natural body ephemeris information: When the Earth is not the center of motion, the
         ephemerides of the planets, satellites, asteroids, and/or comets (including associated
         constants) consistent with the ODM should be identified so that the recipient can, in a
         consistent manner, make computations involving other centers:

COMMENT Based on latest orbit solution which includes observations
COMMENT through 2000-May-15 relative to planetary ephemeris DE-0405.

      c) OEM accuracy vs. efficiency: If the covariance data section of the OEM is not utilized,
         the producer of an OEM should report in comment lines what the expected accuracy of
         the ephemeris is, so the user can smooth or otherwise compress the data without affecting
         the accuracy of the trajectory. The OEM producer also should strive to achieve not only
         the best accuracy possible, considering prediction errors, but also consider the efficiency
         of the trajectory representation (e.g., step sizes of fractional seconds between ephemeris
         lines may be necessary for precision scientific reconstruction of an orbit, but are
         excessive from the standpoint of antenna pointing predicts generation).

## 7.9 ORBIT DATA MESSAGE KEYWORDS

### 7.9.1 VERSION KEYWORDS

The Header of the OPM, OMM, OEM, and OCM shall provide a CCSDS Orbit Data Message
version number that identifies the format version; this is included to anticipate future changes.
The version keywords for the OPM, OMM, OEM, and OCM shall be CCSDS_OPM_VERS,
CCSDS_OMM_VERS, CCSDS_OEM_VERS, and CCSDS_OCM_VERS, respectively. The
value shall have the form of ‘x.y’, where ‘y’ shall be incremented for corrections and minor
changes, and ‘x’ shall be incremented for major changes. Version x.0 shall be reserved for
versions accepted by the CCSDS as an official Recommended Standard (‘Blue Book’). Testing
shall be conducted using OPM, OMM, OEM, and OCM version numbers less than 1.0 (e.g.,
0.x). The specific OPM, OMM, OEM, and OCM version numbers to be used should be
mutually agreed between message exchange partners. The following version numbers are
supported (Blue Book) or have been supported in the past (Silver Book):

           Version Keyword             Version Number      Applicable Recommendation
         CCSDS_OPM_VERS                      1.0           Silver Book 1.0, 09/2004
         CCSDS_OPM_VERS                      2.0           Silver Book 2.0, 11/2009
         CCSDS_OPM_VERS                      3.0           Blue Book 3.0 (this document)
         CCSDS_OMM_VERS                      2.0           Silver Book 2.0, 11/2009
         CCSDS_OMM_VERS                      3.0           Blue Book 3.0 (this document)
         CCSDS_OEM_VERS                      1.0           Silver Book 1.0, 09/2004
         CCSDS_OEM_VERS                      2.0           Silver Book 2.0, 11/2009
         CCSDS_OEM_VERS                      3.0           Blue Book 3.0 (this document)
         CCSDS_OCM_VERS                      3.0           Blue Book 3.0 (this document)

### 7.9.2 GENERAL KEYWORDS

7.9.2.1 Only those keywords shown in tables 3-1, 3-2, and 3-3 shall be used in an OPM.
Some keywords represent mandatory items, and some are optional. KVN assignments
representing optional items may be omitted.

7.9.2.2 Only those keywords shown in tables 4-1, 4-2, and 4-3 shall be used in an OMM.
Some keywords represent mandatory items, and some are optional. KVN assignments
representing optional items may be omitted.

7.9.2.3 Only those keywords shown in tables 5-2 and 5-3 shall be used in an OEM. Some
keywords represent mandatory items, and some are optional. KVN assignments representing
optional items may be omitted.

7.9.2.4 Only those keywords shown in tables 6-3 through 6-12 shall be used in an OCM.
Some keywords represent mandatory items, and some are optional. KVN assignments
representing optional items may be omitted.

7.10 VALIDATION AND INGEST OF KVN CONTENT VIA REGULAR
     EXPRESSIONS (OR ‘REGEX’)

7.10.1 BENEFITS OF USING REGULAR EXPRESSIONS WITH THE ODM

Unlike the schema validation feature native to XML versions of this message as described in
section 8, the KVN version of this message does not natively support such validations of
KVN content. To accomplish validation and ingest of KVN versions of the ODM, the use of
Regular Expressions (referred to as ‘Regex’) is strongly encouraged where possible. Most
programming languages support the Regex feature, and Regex offers a detailed and rigorous
way to ensure proper validation, interpretation, and conformance to Orbit Data Message
content.

7.10.2 SAMPLE REGULAR EXPRESSIONS FOR CCSDS MESSAGES

To facilitate the use of Regular Expressions when processing CCSDS Navigation Messages,
informative annex F, subsection F6 provides sample Regex patterns to rigorously match a
variety of common KVN sequences.

# 8 CONSTRUCTING AN ODM/XML INSTANCE
## 8.1 OVERVIEW

This section provides detailed instructions for the user on how to create an XML message
(reference [5]) based on one of the KVN-formatted messages described in sections 3, 4, 5,
and 6. This section applies only to the XML representation of ODMs.

Overall information on using XML for Navigation Data Messages is provided in
reference [5]. The ODM/XML schemas are available on the SANA Web site. SANA is the
registrar for the protocol registries created under CCSDS. The ODM/XML schemas
explicitly define the permitted data elements and values acceptable for the XML versions of
the ODMs. The location of the ODM/XML schemas is:

OPM: https://sanaregistry.org/files/ndmxml_unqualified/ndmxml-3.0.0-opm-3.0.xsd

OMM: https://sanaregistry.org/files/ndmxml_unqualified/ndmxml-3.0.0-omm-3.0.xsd

OEM: https://sanaregistry.org/files/ndmxml_unqualified/ndmxml-3.0.0-oem-3.0.xsd

OCM: https://sanaregistry.org/files/ndmxml_unqualified/ndmxml-3.0.0-ocm-3.0.xsd

Figure 8-1 illustrates the basic structure of an ODM/XML instance. Defined structural
elements are the header and body. The body then consists of one or more segments
depending on the message type (one for the OPM, OMM, and OCM; one or more for the
OEM). Each segment consists of a <metadata>/<data> pair. In an OEM, which could
have more than one segment, the metadata/data pair is repeated in each segment.

                     <header>
                     </header>
                     <body>
                           <segment>
                                 <metadata>
                                 </metadata>
                                 <data>
                                 </data>
                           </segment>
                     </body>

                        Figure 8-1: ODM/XML Basic Structure

ODM/XML tags for keywords defined in in sections 3, 4, 5, and 6 appear just as in the KVN,
that is, all capital letters. Tags related to the XML message structure (i.e., that do not
correspond directly to a KVN keyword) appear in ‘lowerCamelCase’ (e.g., <header>,
<segment>, <metadata>, <stateVector>, <covarianceMatrix>, etc.).

## 8.2 XML VERSION

This section describes the Extensible Markup Language (or XML) version of the Orbit Data
Message. The first line of each XML instantiation shall specify the XML version:

       <?xml version="1.0" encoding="UTF-8"?>

This line must appear on the first line of each instantiation, exactly as shown.

8.3   BEGINNING THE INSTANTIATION: ROOT ELEMENT TAG

8.3.1 Each instantiation shall have a ‘root element tag’ that identifies the message type and
other information such as where to find the applicable schema, required attributes, etc.

8.3.2 The root element tag in an ODM/XML instantiation shall be one of those listed in
table 8-1.

                        Table 8-1: ODM/XML Root Element Tags

Root Element Tag             Message Type
<opm></opm>                  Orbit Parameter Message
<omm></omm>                  Orbit Mean Elements Message
<oem></oem>                  Orbit Ephemeris Message
<ocm></ocm>                  Orbit Comprehensive Message

8.3.3 The XML Schema Instance namespace attribute must appear in the root element tag
of all ODM/XML instantiations, exactly as shown:

xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

If it is desired to validate an instantiation against the CCSDS Web-based schema, the
xsi:noNamespaceSchemaLocation attribute must be coded as a single string of non-
blank characters, with no line breaks exactly as shown:

xsi:noNamespaceSchemaLocation=https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-
3.0.0-master-3.0.xsd

and

xsi:noNamespaceSchemaLocation=https://sanaregistry.org/r/ndmxml_qualified/ndmxml-
3.0.0-master-3.0.xsd

NOTE – The value associated with the xsi:noNamespaceSchemaLocation
       attribute shown in this document is too long to appear on a single line.

8.3.4 For use in a local operations environment, the schema set may be downloaded from
the SANA website to a local server that meets local requirements for operations robustness.

8.3.5 If     a     local    version is used, the value associated with the
xsi:noNamespaceSchemaLocation attribute must be changed to a URL that is
accessible to the local server.

8.3.6 Two attributes shall appear in the root element tag of an ODM/XML single message
instantiation, specifically, the CCSDS_xxx_VERS keyword that is also part of the standard
KVN header, and the Blue Book version number. The final attributes of the root element tag
shall be ‘id’ and ‘version’.

8.3.7 The CCSDS_xxx_VERS keyword shall be supplied via the ‘id’ attribute of the root
element tag. The ‘id’ attribute shall be ‘id="CCSDS_xxx_VERS"’, where xxx = OPM,
OMM, OEM, or OCM.

8.3.8 The version number of the Blue Book to which the schema applies shall be supplied
via the ‘version’ attribute. The ‘version’ attribute shall be ‘version="3.0"’.

NOTE – The following example root element tag for an OPM instantiation combines all
       the directions in the preceding several sections:
            <?xml version="1.0" encoding="UTF-8"?>
            <opm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_
            unqualified/ndmxml-3.0.0-master-3.0.xsd"
            id="CCSDS_OPM_VERS" version="3.0">

            and

            <?xml version="1.0" encoding="UTF-8"?>
            <opm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_
            qualified/ndmxml-3.0.0-master-3.0.xsd"
            id="CCSDS_OPM_VERS" version="3.0">

## 8.4 THE STANDARD ODM/XML HEADER SECTION

8.4.1   The ODMs shall share a standard header section, with tags <header> and
</header>.

8.4.2   Immediately following the <header> tag, the message may have any number of
<COMMENT> elements.

8.4.3 The standard ODM header shall contain the <CREATION_DATE> and the
<ORIGINATOR> elements.

8.4.4   The standard ODM header may contain the <MESSAGE_ID> element.

NOTE – An example <header> section is shown immediately below.

            <header>
               <COMMENT>This is the common ODM/XML header</COMMENT>
               <COMMENT>I can put as many comments here as I want,
                  </COMMENT>
               <COMMENT>including none. </COMMENT>
               <CREATION_DATE>2004-281T17:26:06</CREATION_DATE>
               <ORIGINATOR>AGENCY-X</ORIGINATOR>
               <MESSAGE_ID>XYZ123-2019</MESSAGE_ID>
            </header>

## 8.5 THE ODM/XML BODY SECTION

8.5.1   After coding the <header>, the instantiation must include a <body> section.

8.5.2   Inside the <body> section must appear at least one <segment> section.

8.5.3 Each segment must be made up of one or more <metadata> and <data> sections,
depending on the specific message type.

## 8.6 THE ODM/XML METADATA SECTION

8.6.1   All ODMs must have a metadata section.

8.6.2   The metadata section shall be delimited by the <metadata> element.

8.6.3 Between the <metadata> and </metadata> tags, the keywords shall be the
same as those in the metadata sections in sections 3, 4, 5, and 6, with possible exceptions as
noted in the sections below that discuss creating instantiations of the specific messages.

## 8.7 THE ODM/XML DATA SECTION

8.7.1   All ODMs must have a data section.

8.7.2 The data section shall follow the metadata section and shall be delimited by the
<data> element.

8.7.3 Between the <data> and </data> tags, the keywords shall be the same as those in
the data sections in sections 3, 4, 5, and 6, with possible exceptions as noted in the sections
that discuss creating instantiations of the specific messages.

## 8.8 CREATING AN OPM INSTANTIATION

8.8.1 An OPM instantiation shall be delimited with the <opm></opm> root element tags
using the standard attributes documented in 8.3.

8.8.2   The final attributes of the <opm> tag shall be ‘id’ and ‘version’.

8.8.3   The ‘id’ attribute shall be ‘id="CCSDS_OPM_VERS"’.

8.8.4   The ‘version’ attribute shall be ‘version="3.0"’.

8.8.5   The standard NDM header shall follow the <opm> tag.

8.8.6   The OPM <body> shall consist of a single <segment>.

8.8.7   The <segment> shall consist of a <metadata> section and a <data> section.

8.8.8 The keywords in the <metadata> and <data> sections shall be those specified in
section 3. The rules for including any of the keyword tags in the OPM/XML are the same as
those specified for the OPM/KVN.

8.8.9   Tags for keywords specified in section 3 shall be all uppercase.

8.8.10 Several of the OPM/XML keywords may have the units attribute.

8.8.11 In all cases, the units shall match those defined in the tables in section 3.

8.8.12 Table 8-2 lists examples of the use of units in the OPM/XML.

                        Table 8-2: Examples of Units in OPM/XML

Keyword                  Units         Example
INCLINATION              deg           <INCLINATION units="deg">numeric-
                                       value</INCLINATION>
MASS                     kg            <MASS units="kg">numeric-value</MASS>
X                        km            <X units="km">numeric-value</X>
CX_X                     km**2         <CX_X units="km**2">numeric-value</CX_X>
CX_DOT_X                 km**2/s       <CX_DOT_X units="km**2/s">numeric-
                                       value</CX_DOT_X>
CX_DOT_X_DOT,            km**2/s**2    <CX_DOT_X_DOT units="km**2/s**2">numeric-
                                       value</CX_DOT_X_DOT>
GM                       km**3/s**2    <GM units="km**3/s**2">numeric-value</GM>
X_DOT                    km/s          <X_DOT units="km/s">numeric-value</X_DOT>
MAN_DV_1                 km/s          <MAN_DV_1 units="km/s">numeric-value</MAN_DV_1>
SOLAR_RAD_AREA           m**2          <SOLAR_RAD_AREA units="m**2">numeric-
                                       value</SOLAR_RAD_AREA>
MAN_DURATION             s             <MAN_DURATION units="s">numeric-
                                       value</MAN_DURATION>

8.8.13 In addition to the OPM keywords specified in section 3, there are several special tags
associated with the OPM body as described in the next few sections. The information

content in the OPM is separated into ‘logical blocks’. Special tags in the OPM are used to
encapsulate the information in the logical blocks of the OPM.

8.8.14 The OPM/XML tags used to delimit the logical blocks of the OPM shall be drawn
from table 8-3.

                           Table 8-3: OPM/XML Tag Delimiters

OPM Logical Block                         Associated ODM/XML OPM Tag
State Vector                              <stateVector>
Keplerian Elements                        <keplerianElements>
Spacecraft Parameters                     <spacecraftParameters>
Covariance Matrix                         <covarianceMatrix>
Maneuver Parameters                       <maneuverParameters>
User-Defined Parameters                   <userDefinedParameters>

8.8.15 Between the begin tag and end tag (i.e., between <spacecraftParameters>
and </spacecraftParameters>), the user shall place the keywords required by the
Spacecraft Parameters logical block as specified in table 3-3.

## 8.9 CREATING AN OMM INSTANTIATION

8.9.1 An OMM instantiation shall be delimited with the <omm></omm> root element tags
using the standard attributes documented in 8.3.

8.9.2   The final attributes of the <omm> tag shall be ‘id’ and ‘version’.

8.9.3   The ‘id’ attribute shall be ‘id="CCSDS_OMM_VERS"’.

8.9.4 The ‘version’ attribute for the version of the OMM described in section 4 shall be
‘version="3.0"’.

8.9.5   The standard NDM header shall follow the <omm> tag.

8.9.6   The OMM <body> shall consist of a single <segment>.

8.9.7   The <segment> shall consist of a <metadata> section and a <data> section.

8.9.8 The keywords in the <metadata> and <data> sections shall be those specified in
section 4. The rules for including any of the keyword tags in the OMM/XML are the same as
those specified for the OMM/KVN in section 4.

8.9.9   Tags for keywords specified in section 4 shall be all uppercase.

8.9.10 Several of the OMM/XML keywords may have the unit attribute.

8.9.11 In all cases, the units shall match those defined in the tables in section 4.

8.9.12 Table 8-4 lists examples of the use of units in the OMM/XML.

                         Table 8-4: Examples of Units in OMM/XML

Keyword             Units             Example
BSTAR               1/ER              <BSTAR units="1/ER">numeric-value</BSTAR>
INCLINATION         deg               <INCLINATION units="deg">numeric-
                                      value</INCLINATION>
MASS                kg                <MASS units="kg">numeric-value</MASS>
SEMI_MAJOR_AXIS     km                <SEMI_MAJOR_AXIS units="km">numeric-
                                      value</SEMI_MAJOR_AXIS>
CX_X                km**2             <CX_X units="km**2">numeric-value</CX_X>
CX_DOT_X            km**2/s           <CX_DOT_X units="km**2/s">numeric-
                                      value</CX_DOT_X>
CX_DOT_X_DOT        km**2/s**2        <CX_DOT_X_DOT units="km**2/s**2">numeric-
                                      value</CX_DOT_X_DOT>
GM                  km**3/s**2        <GM units="km**3/s**2">numeric-value</GM>
SOLAR_RAD_AREA      m**2              <SOLAR_RAD_AREA units="m**2">numeric-
                                      value</SOLAR_RAD_AREA>
MEAN_MOTION         rev/day           <MEAN_MOTION units="rev/day">numeric-
                                      value</MEAN_MOTION>
MEAN_MOTION_DOT     rev/day**2        <MEAN_MOTION_DOT units="rev/day**2">numeric-
                                      value</MEAN_MOTION_DOT>

8.9.13 In addition to the OMM keywords specified in section 4, there are several special tags
associated with the OMM body as described in the next few sections. The information
content in the OMM is separated into constructs described in section 4 as ‘logical blocks’.
Special tags in the OMM are used to encapsulate the information in the logical blocks of the
OMM.

8.9.14 The OMM/XML tags used to delimit the logical blocks of the OMM shall be drawn
from table 8-5:

                          Table 8-5: OMM/XML Tag Delimiters

OMM Logical Block                        Associated ODM/XML OMM Tag
Mean Keplerian Elements                  <meanElements>
Spacecraft Parameters                    <spacecraftParameters>
TLE Parameters                           <tleParameters>
Covariance Matrix                        <covarianceMatrix>
User-Defined Parameters                  <userDefinedParameters>

8.9.15 Between the begin tag and end tag (i.e., between <spacecraftParameters> and
</spacecraftParameters>), the user must place the keywords required by the
Spacecraft Parameters logical block as specified in table 4-3.

8.10 CREATING AN OEM INSTANTIATION

8.10.1 An OEM instantiation shall be delimited with the <oem></oem> root element tags
using the standard attributes documented in 8.3.

8.10.2 The final attributes of the <oem> tag shall be ‘id’ and ‘version’.

8.10.3 The ‘id’ attribute shall be ‘id="CCSDS_OEM_VERS"’.

8.10.4 The ‘version’ attribute for the version of the OEM described in section 5 shall be
‘version="3.0"’.

8.10.5 The standard NDM header shall follow the <oem> tag.

8.10.6 The OEM <body> shall consist of one or more <segment> constructs.

8.10.7 Each <segment> shall consist of a <metadata> section and a <data> section.

8.10.8 The keywords in the <metadata> and <data> sections shall be those specified in
section 5. The rules for including any of the keyword tags in the OEM/XML are the same as
those specified for the OEM/KVN in section 5.

8.10.9 Tags for keywords specified in section 5 shall be all uppercase.

8.10.10 Several of the OEM/XML keywords may have the unit attribute.

8.10.11 In all cases, the units shall match those defined in section 5.

8.10.12 In addition to the OEM keywords specified in section 5, there are some special tags
associated with the OEM body as described in the next sections.

8.10.13 The <stateVector> tag shall encapsulate the keywords associated with one of
the ephemeris data lines in the OEM.

8.10.14 In the XML representation of the OEM, the components of the <stateVector>
ephemeris data line must be represented with keywords (i.e., a tag).

8.10.15 The <stateVector> keywords shall be the same as those defined for the same
construct in the OPM.

8.10.16 The OEM/XML tags used within the <stateVector> structure shall be drawn
from table 8-6.

                        Table 8-6: Examples of Units in OEM/XML

 OEM Tag       Represents                    Example
 <EPOCH>       time tag of the state         <EPOCH>2007-09-20T17:41:00</EPOCH>
 <X>           x component of position       <X units="km">6678.0</X>
 <Y>           y component of position       <Y units="km">0.0</Y>
 <Z>           z component of position       <Z units="km">0.0</Z>
 <X_DOT>       x component of velocity       <X_DOT units="km/s">0</X_DOT>
 <Y_DOT>       y component of velocity       <Y_DOT units="km/s">7.73</Y_DOT>
 <Z_DOT>       z component of velocity       <Z_DOT units="km/s">0.0</Z_DOT>
 <X_DDOT>      x component of acceleration   <X_DDOT units="km/s**2">0.0</X_DDOT>
 <Y_DDOT>      y component of acceleration   <Y_DDOT units="km/s**2">0.50</Y_DDOT>
 <Z_DDOT>      z component of acceleration   <Z_DDOT units="km/s**2">0.0</Z_DDOT>

8.10.17 Between the begin tag and end tag (i.e., between <stateVector> and
</stateVector>), the user shall place the values required by the ephemeris data line as
specified in section 5.

8.10.18 Since the state vector structure is shared by the OPM schema and OEM schema,
units may optionally appear in the XML version of the OEM ephemeris data line.

8.10.19 The <covarianceMatrix> tag shall encapsulate the keywords associated with
the covariance matrix lines in the OEM.

8.10.20 In the XML representation of the OEM, the covariance data line must be
represented with keywords (i.e., a tag).

8.10.21 The OEM <covarianceMatrix> keywords shall be the same as those defined
for the same construct in the OPM and OMM.

NOTE – In the KVN representations of the OEM covariance matrix data lines, keywords
       are not used. Rather, the components of the covariance matrix data line appear in
       an order defined in section 5. Similarly, units are not used in the KVN version of
       the OEM covariance matrix; however, they are optional in the OPM and OMM.

8.10.22 Since the covariance matrix structure is shared by the OPM, OMM, and OEM, units
may optionally appear in the XML version of the OEM covariance matrix line.

8.10.23 The OEM/XML tags used within the <covarianceMatrix> structure shall be
drawn from table 8-7.

                          Table 8-7: OEM/XML Tag Delimiters

 Keyword                   Units          Example
 CX_X, CY_X, CY_Y,         km**2          <CX_X units="km**2">numeric-value</CX_X>
 CZ_X, CZ_Y, CZ_Z
 CX_DOT_X, CX_DOT_Y,       km**2/s        <CX_DOT_X units="km**2/s">numeric-
 CX_DOT_Z, CY_DOT_X,                      value</CX_DOT_X>
 CY_DOT_Y, CY_DOT_Z,
 CZ_DOT_X, CZ_DOT_Y,
 CZ_DOT_Z
 CX_DOT_X_DOT,             km**2/s**2     <CX_DOT_X_DOT units="km**2/s**2">numeric-
 CY_DOT_X_DOT,                            value</CX_DOT_X_DOT>
 CY_DOT_Y_DOT,
 CZ_DOT_X_DOT,
 CZ_DOT_Y_DOT,
 CZ_DOT_Z_DOT

8.10.24Between the begin tag and end tag (i.e., between <covarianceMatrix> and
</covarianceMatrix>), the user shall place the values required by the covariance
matrix line type as specified in 5.2.5.4 and table 5-4.

8.11 CREATING AN OCM INSTANTIATION

8.11.1 An OCM instantiation shall be delimited with the <ocm></ocm> root element tags
using the standard attributes documented in 8.3.

8.11.2 The final attributes of the <ocm> tag shall be ‘id’ and ‘version’.

8.11.3 The ‘id’ attribute shall be ‘id="CCSDS_OCM_VERS"’.

8.11.4 The ‘version’ attribute for the version of the OCM described in section 6 shall be
‘version="3.0"’.

8.11.5 The standard NDM header shall follow the <ocm> tag.

8.11.6 The OCM <body> shall consist of a single <segment> construct.

8.11.7 The <segment> shall consist of a <metadata> section and a <data> section.

8.11.8 The keywords in the <metadata> and <data> sections shall be those specified in
section 6. The rules for including any of the keyword tags in the OCM/XML are the same as
those specified for the OCM in section 6.

8.11.9 Tags for keywords specified in section 6 shall be all uppercase.

8.11.10    Several of the OCM/XML keywords may have the unit attribute.

8.11.11 In all cases, the units shall match those defined in the SANA Registry (detailed in
annex B) and tables in section 6, including orbit, covariance and maneuver data units as
specified by TRAJ_UNITS, COV_UNITS, and MAN_UNITS, respectively.

8.11.12    Table 8-8 lists examples of the use of units in the OCM/XML.

                       Table 8-8: Examples of Units in OCM/XML

 Keyword                   Units        Example
 ACTUAL_OD_SPAN            d            <ACTUAL_OD_SPAN units="d">numeric-
                                        value</ACTUAL_OD_SPAN>
 DC_PA_START_ANGLE         deg          <DC_PA_START_ANGLE units="deg">numeric-
                                        value</DC_PA_START_ANGLE>
 CENTRAL_BODY_ROTATIO      deg/s        <CENTRAL_BODY_ROTATION units="deg/s">numeric-
 N                                      value</CENTRAL_BODY_ROTATION>
 WET_MASS                  kg           <MASS units="kg">numeric-value</WET_MASS>
 IXX                       kg*m**2      <IXX units="kg*m**2">numeric-value</IXX>
 EQUATORIAL_RADIUS         km           <EQUATORIAL_RADIUS units="km">numeric-
                                        value</EQUATORIAL_RADIUS>
 GM                        km**3/s**    <GM units="km**3/s**2">numeric-value</GM>
                           2
 DV_BOL                    km/s         <DV_BOL units="km/s">numeric-value</DV_BOL>
 OEB_MAX                   m            <OEB_MAX units="m">numeric-value</OEB_MAX>
 DRAG_CONST_AREA           m**2         <DRAG_CONST_AREA units="m**2">numeric-
                                        value</DRAG_CONST_AREA>
 MAX_THRUST                N            <MAX_THRUST units="N">numeric-
                                        value</MAX_THRUST>
 FIXED_GEOMAG_KP           nT           <FIXED_GEOMAG_KP units="nT">numeric-
                                        value</FIXED_GEOMAG_KP>
 UT1MUTC_AT_TZERO          s            <UT1MUTC_AT_TZERO units="s">numeric-
                                        value</UT1MUTC_AT_TZERO>
 FIXED_F10P7               SFU          <FIXED_F10P7 units="SFU">numeric-
                                        value</FIXED_F10P7>
 DRAG_UNCERTAINTY          %            <DRAG_UNCERTAINTY units="%">numeric-
                                        value</DRAG_UNCERTAINTY>

8.11.13 In addition to the OCM keywords specified in section 6, there are some special tags
associated with the OCM body, as listed in table 8-9, described in the next sections.

                           Table 8-9: OCM/XML Tag Delimiters

                                         ODM/XML OCM
OCM Logical Block                        Section Tags            Data Line Tag
Trajectory Data                          <traj>                  <trajLine>
Space Object Physical Characteristics    <phys>                  N/A
Covariance Data                          <cov>                   <covLine>
Maneuver Data                            <man>                   <manLine>
Perturbations Parameters                 <pert>                  N/A
Orbit Determination Data                 <od>                    N/A
User-Defined Parameters                  <user>                  N/A

8.11.14 Between the begin tag and end tag (e.g., between <traj> and </traj>), the user must
place the keywords required by the specific OCM section as specified in, for example,
table 6-4.

8.11.15 The data type of the <trajLine>, <covLine>, and <manLine> elements is
‘xsd:string’, that is, there is no validation of the contents, and the line must be parsed by the
OCM recipient to access the individual components of the trajectory, covariance, or
maneuver data line.

8.11.16 The number of individual components in the multipartite <trajLine> shall be
determined by the number of components in the value for the TRAJ_TYPE keyword, plus
one for the timetag.

8.11.17 The number of individual components in the single multipartite <covLine> shall be
13 if COV_TYPE=SIG3EIGVEC3 is selected, or 14 if COV_TYPE=TSIG3EIGVEC3 is
selected. Otherwise, if ‘N’ is the dimension of the covariance matrix, then the number of
individual components in the single multipartite <covLine> shall either be 1 + (N**2 + N)/2
corresponding to the Lower or Upper Triangular Matrix formats plus one for the timetag, or 1
+ N**2 for the Full Matrix format plus one for the timetag.

8.11.18 The number of individual components in the multipartite <manLine> shall be
determined by the number of comma-separated values in the MAN_COMPOSITION
keyword, plus one for the timetag.

8.12 CREATING A COMBINED INSTANTIATION

8.12.1 An ODM user may create an XML instance that incorporates any number of
messages from sections 3 through 6 of this document in a logical suite called an ‘NDM
(Navigation Data Message) Combined Instantiation’. Such combined instantiations may be
useful for some situations, for example:

8.12.2 A maneuver scenario in which both ‘no burn’ and ‘with burn’ ephemerides are
combined in a single message.

8.12.3 A constellation scenario in which states (OPM, OMM) and/or ephemeris data (OEM,
OCM) for all the spacecraft in the constellation are combined in a single XML message.

8.12.4 A full OEM or OCM ephemeris with detail on important states reflected in some
number of OPMs. The OEM/OCM and the multiple OPMs can be conveniently conveyed in
a single NDM.

8.12.5 An NDM combined instantiation shall be delimited with the <ndm></ndm> root
element tags instead of one of the individual message tags described in 8.3.2.

8.12.6 The standard attributes documented in 8.3 shall be used with the <ndm> tag, with the
exception that neither ‘id’ nor ‘version’ attributes are associated with the <ndm> tag.

8.12.7 In the NDM combined instantiation, the only attributes that shall appear on the
constituent message tags (i.e., the tags listed in 8.3.2) are the ‘id’ and ‘version’ attributes.

8.12.8 Between the <ndm></ndm> tags, the desired messages described in 8.8 through 8.11
may be combined as needed to meet user requirements.

8.12.9 Any combination of constituent ODM types may be used in an NDM combined
instantiation.

8.12.10 Figures 8-2 and 8-3 illustrate the basic structure of an NDM combined instantiation.
All detail has been removed from figure 8-1 to contrast the single message ODM with an
NDM combined instantiation. As shown in figure 8-2, in an NDM combined instantiation the
individual message tags still have the ‘id’ and ‘version’ attributes, but the namespace
attributes and schema location attributes are associated with the <ndm> root element.

                  Single Message OPM      NDM Combined Instantiation
                                           <ndm>
                   <opm>                      <opm>
                      <header>                    <header>
                      </header>                   </header>
                      <body>                      <body>
                      </body>                     </body>
                   </opm>                     </opm>
                                                  .
                                                  .
                                                  .
                                              <opm>
                                                  <header>
                                                  </header>
                                                  <body>
                                                  </body>
                                              </opm>
                                           </ndm>

 Figure 8-2: Comparison of Single Message OPM with NDM Combined Instantiation

8.12.11 The OPMs shown in figure 8-2 may be replaced with any number of OMM, OEM,
or OCM messages in any combination as needed to meet user requirements, as shown in
figure 8-3, below.

<?xml version="1.0" encoding="UTF-8"?>
<ndm xmlns:
xsi:noNamespaceSchemaLocation=https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-3.0.0-
master-3.0.xsd>
<COMMENT>This figure combines multiple ODM/XML messages into a single message</COMMENT>
<COMMENT>Message detail is deleted in order to focus on the message structure</COMMENT>
<COMMENT>Note use of "<ndm>" root element, and ODM/version attributes</COMMENT>

   <opm id="CCSDS_OPM_VERS" version="3.0">
      <header>
      </header>
      <body>
      </body>
   </opm>

   <oem id="CCSDS_OEM_VERS" version="3.0">
      <header>
      </header>
      <body>
      </body>
   </oem>

   <opm id="CCSDS_OPM_VERS" version="3.0">
      <header>
      </header>
      <body>
      </body>
   </opm>

   <omm id="CCSDS_OMM_VERS" version="3.0">
      <header>
      </header>
      <body>
      </body>
   </omm>

   <ocm id="CCSDS_OCM_VERS" version="3.0">
      <header>
      </header>
      <body>
      </body>
   </ocm>

</ndm>

 Figure 8-3: NDM Combined Instantiation Showing Mix of ODMs and Use of
             Attributes

NOTE – Figure G-21 shows a full example of a use case combining multiple ODMs in a
       single XML message. (For instructions on creating a combined instantiation that
       incorporates ODM/XML messages combined with other navigation related
       messages, see reference [5].)

8.13 SPECIAL SYNTAX RULES FOR ODM/XML

8.13.1 Most of the KVN syntax rules apply for ODM/XML instantiations of an ODM;
however, there are a few variations described in this section that shall be observed.

8.13.2 Each mandatory XML tag must be present and contain a valid value.

8.13.3 Integer values shall follow the conventions of the integer data type per reference [6].
Additional restrictions on the allowable range of values permitted for any integer data
element may also be defined in the ODM/XML Schema.

NOTE – Examples of such restrictions may include a defined range (e.g., 0 - 100, 1 - 10,
       etc.), a set of enumerated values (e.g., 0,1,2,4,8), a pre-defined specific variation
       such as positiveInteger, or a user-defined data type variation.

8.13.4 Non-integer numeric values may be expressed in either fixed-point or floating-point
notation. Numeric values shall follow the conventions of the double data type per
reference [6]. Additional restrictions on the allowable range of values permitted for any
numeric data element may also be defined in the ODM/XML Schema.

NOTE – Examples of such restrictions may include a defined range (e.g., 0.0-100.0, etc.),
       or a user-defined data type variation.

8.13.5 Text values shall follow the conventions of the string data type per reference [6].
Additional restrictions on the allowable range or values permitted for any data element may
also be defined in the ODM/XML Schema.

NOTE – Examples of such restrictions may include a set of enumerated values (e.g.,
       ‘YES’/‘NO’) or other user-defined data type variation.

8.13.6 The units in the ODM/XML shall be the same units used in the KVN-formatted ODM
described in 7.7, or as mandated in the SANA registry per annex B. XML attributes shall be
used to explicitly define the units or other important information associated with the given
data element. (See the tables in this section for the OPM, OMM, OEM, and OCM for
examples of coding units in ODM/XML instantiations.)

8.13.7 Comments must be displayed as values between the <COMMENT> and
</COMMENT> tags.

# ANNEX A

  IMPLEMENTATION CONFORMANCE STATEMENT PROFORMA

                                       (NORMATIVE)

A1       INTRODUCTION

A1.1      OVERVIEW

This annex provides the Implementation Conformance Statement (ICS) Requirements List
(RL) for an implementation of the Orbit Data Messages (CCSDS 502.0). The ICS for an
implementation is generated by completing the RL in accordance with the instructions below.
An implementation shall satisfy the mandatory conformance requirements referenced in the
RL.

The RL in this annex is blank. An implementation’s completed RL is called the ICS. The ICS
states which capabilities and options have been implemented. The following can use the ICS:
     –    the implementer, as a checklist to reduce the risk of failure to conform to the standard
          through oversight;
     –    a supplier or potential acquirer of the implementation, as a detailed indication of the
          capabilities of the implementation, stated relative to the common basis for
          understanding provided by the standard ICS proforma;
     –    a user or potential user of the implementation, as a basis for initially checking the
          possibility of interworking with another implementation (it should be noted that,
          while interworking can never be guaranteed, failure to interwork can often be
          predicted from incompatible ICS lists);
     –    a tester, as the basis for selecting appropriate tests against which to assess the claim
          for conformance of the implementation.

A1.2      ABBREVIATIONS AND CONVENTIONS

The RL consists of information in tabular form. The status of features is indicated using the
abbreviations and conventions described below.

Item Column

The item column contains sequential numbers for items in the table.

Feature Column

The feature column contains a brief descriptive name for a feature. It implicitly means “Is
this feature supported by the implementation?”

Status Column

The status column uses the following notations:
   –   M               mandatory;
   –   O               optional;
   –   C               conditional;
   –   X               prohibited;
   –   I               out of scope;
   –   N/A             not applicable.

Support Column Symbols

The support column is to be used by the implementer to state whether a feature is supported
by entering Y, N, or N/A, indicating:
   –   Y        Yes, supported by the implementation.
   –   N        No, not supported by the implementation.
   –   N/A      Not applicable.

The support column should also be used, when appropriate, to enter values supported for a
given capability.

A1.3   INSTRUCTIONS FOR COMPLETING THE RL

An implementer shows the extent of compliance to the Recommended Standard by
completing the RL; that is, the state of compliance with all mandatory requirements and the
options supported are shown. The resulting completed RL is called an ICS. The implementer
shall complete the RL by entering appropriate responses in the support or values supported
column, using the notation described in A1.2. If a conditional requirement is inapplicable,
N/A should be used. If a mandatory requirement is not satisfied, exception information must
be supplied by entering a reference Xi, where i is a unique identifier, to an accompanying
rationale for the noncompliance.

A2     ICS PROFORMA FOR ORBIT DATA MESSAGES

A2.1       IDENTIFICATION OF ICS

Date of Statement (DD/MM/YYYY)

ICS serial number

System Conformance statement cross-reference

A2.2       IDENTIFICATION OF IMPLEMENTATION UNDER TEST

Implementation name

Implementation version

Special Configuration

Other Information

A2.3       IDENTIFICATION OF SUPPLIES

Supplier

Contact Point for Queries

Implementation Name(s) and Versions

Other information necessary for full identification,
for example, name(s) and version(s) for machines
and/or operating systems; System Name(s)

A2.4       DOCUMENT VERSIONS

CCSDS 502.0 Document Version                           3
Have any exceptions been required?                     Yes _____ No_____
NOTE – A YES answer means that the
        implementation does not conform to the
        Recommended Standard. Non-supported
        mandatory capabilities are to be identified
        in the ICS, with an explanation of why the
        implementation is non-conforming.

A2.5     REQUIREMENTS LISTS

A2.5.1     Orbit Parameter Message Requirements List

                                                                       Status
Item     Feature                    Keyword                Reference   M/O/C    Support
  1      OPM Header                 N/A                    Table 3-1   M
  2        OPM Version              CCSDS_OPM_VERS         Table 3-1   M
  3        Comment                  COMMENT                Table 3-1   O
  4        Message                  CLASSIFICATION         Table 3-1   O
           classification/caveats
  5        Message creation date    CREATION_DATE          Table 3-1   M
           and time
  6        Message originator       ORIGINATOR             Table 3-1   M
  7        Unique message           MESSAGE_ID             Table 3-1   O
           identifier
  8      OPM Metadata               N/A                    Table 3-2   M
  9        Comment                  COMMENT                Table 3-2   O
 10        Name of space object     OBJECT_NAME            Table 3-2   M
 11        Identifier of space      OBJECT_ID              Table 3-2   M
           object
 12        Orbit center             CENTER_NAME            Table 3-2   M
 13        Reference frame          REF_FRAME              Table 3-2   M
 14        Epoch of reference       REF_FRAME_EPOCH        Table 3-2   C
           frame
 15        Time system applicable TIME_SYSTEM              Table 3-2   M
           to data
 16      OPM Data                   N/A                    Table 3-3   M
 17      State Vector logical block N/A                    Table 3-3   M
 18        Comment                  COMMENT                Table 3-3   O
 19        Epoch of the state       EPOCH                  Table 3-3   M
           vector
 20        X component of           X                      Table 3-3   M
           position
 21        Y component of           Y                      Table 3-3   M
           position
 22        Z component of           Z                      Table 3-3   M
           position
 23        X component of           X_DOT                  Table 3-3   M
           velocity
 24        Y component of           Y_DOT                  Table 3-3   M
           velocity
 25        Z component of           Z_DOT                  Table 3-3   M
           velocity

                                                                    Status
Item   Feature                     Keyword              Reference   M/O/C    Support
 26    Keplerian Elements          N/A                  Table 3-3   O
       logical block
 27      Comment                   COMMENT              Table 3-3   O
 28      Semi-major axis of        SEMI_MAJOR_AXIS      Table 3-3   C
         orbit
 29      Eccentricity of orbit     ECCENTRICITY         Table 3-3   C
 30      Inclination of orbit      INCLINATION          Table 3-3   C
 31      Right ascension of      RA_OF_ASC_NODE         Table 3-3   C
         ascending node of orbit
 32      Argument of pericenter ARG_OF_PERICENTER       Table 3-3   C
         of orbit
 33      True or mean anomaly      TRUE_ANOMALY or      Table 3-3   C
         of orbit                  MEAN_ANOMALY
 34      Gravitational             GM                   Table 3-3   C
         coefficient of the
         central body
 35    Spacecraft Parameters       N/A                  Table 3-3   O
       logical block
 36      Comment                   COMMENT              Table 3-3   O
 37      Mass of the spacecraft    MASS                 Table 3-3   C
 38      Solar radiation area of   SOLAR_RAD_AREA       Table 3-3   C
         the spacecraft
 39      Solar radiation           SOLAR_RAD_COEFF      Table 3-3   C
         coefficient of the
         spacecraft
 40      Drag area of the          DRAG_AREA            Table 3-3   C
         spacecraft
 41      Drag coefficient of the   DRAG_COEFF           Table 3-3   C
         spacecraft
 42    Position/velocity           N/A                  Table 3-3   O
       Covariance Matrix
       logical block
 43      Comment                   COMMENT              Table 3-3   O
 44      Cov reference frame       COV_REF_FRAME        Table 3-3   C
 45      Covariance matrix [1,1] CX_X                   Table 3-3   C
 46      Covariance matrix [2,1] CY_X                   Table 3-3   C
 47      Covariance matrix [2,2] CY_Y                   Table 3-3   C
 48      Covariance matrix [3,1] CZ_X                   Table 3-3   C
 49      Covariance matrix [3,2] CZ_Y                   Table 3-3   C
 50      Covariance matrix [3,3] CZ_Z                   Table 3-3   C
 51      Covariance matrix [4,1] CX_DOT_X               Table 3-3   C

                                                                   Status
Item   Feature                   Keyword               Reference   M/O/C    Support
 52     Covariance matrix [4,2] CX_DOT_Y               Table 3-3   C
 53     Covariance matrix [4,3] CX_DOT_Z               Table 3-3   C
 54     Covariance matrix [4,4] CX_DOT_X_DOT           Table 3-3   C
 55     Covariance matrix [5,1] CY_DOT_X               Table 3-3   C
 56     Covariance matrix [5,2] CY_DOT_Y               Table 3-3   C
 57     Covariance matrix [5,3] CY_DOT_Z               Table 3-3   C
 58     Covariance matrix [5,4] CY_DOT_X_DOT           Table 3-3   C
 59     Covariance matrix [5,5] CY_DOT_Y_DOT           Table 3-3   C
 60     Covariance matrix [6,1] CZ_DOT_X               Table 3-3   C
 61     Covariance matrix [6,2] CZ_DOT_Y               Table 3-3   C
 62     Covariance matrix [6,3] CZ_DOT_Z               Table 3-3   C
 63     Covariance matrix [6,4] CZ_DOT_X_DOT           Table 3-3   C
 64     Covariance matrix [6,5] CZ_DOT_Y_DOT           Table 3-3   C
 65     Covariance matrix [6,6] CZ_DOT_Z_DOT           Table 3-3   C
 66    Maneuver Parameters       N/A                   Table 3-3   O
       logical block
 67     Comment                  COMMENT               Table 3-3   O
 68     Time of maneuver start MAN_EPOCH_IGNITION      Table 3-3   O
 69     Duration of maneuver     MAN_DURATION          Table 3-3   O
 70     Change of mass due to    MAN_DELTA_MASS        Table 3-3   O
        maneuver
 71     Relevant reference       MAN_REF_FRAME         Table 3-3   O
        frame for maneuver
 72     1st component of         MAN_DV_1              Table 3-3   O
        velocity change
 73     2nd component of         MAN_DV_2              Table 3-3   O
        velocity change
 74     3rd component of         MAN_DV_3              Table 3-3   O
        velocity change
 75    User-Defined Parameters N/A                     Table 3-3   O
       logical block
 76     As defined by user,      USER_DEFINED_x        Table 3-3   O
        ‘essential information
        that cannot be
        conveyed in
        COMMENT
        statements’

A2.5.2     Orbit Mean Elements Message Requirements List

                                                                       Status
Item     Feature                    Keyword                Reference   M/O/C    Support
  1      OMM Header                 N/A                    Table 4-1   M
  2        OMM Version              CCSDS_OMM_VERS         Table 4-1   M
  3        Comment                  COMMENT                Table 4-1   O
  4        Message                  CLASSIFICATION         Table 4-1   O
           classification/caveats
  5        Message creation date    CREATION_DATE          Table 4-1   M
           and time
  6        Message originator       ORIGINATOR             Table 4-1   M
  7        Unique message           MESSAGE_ID             Table 4-1   O
           identifier
  8      OMM Metadata               N/A                    Table 4-2   M
  9       Comment                   COMMENT                Table 4-2   O
 10       Name of space object      OBJECT_NAME            Table 4-2   M
 11       Identifier of space       OBJECT_ID              Table 4-2   M
          object
 12       Orbit center              CENTER_NAME            Table 4-2   M
 13       Reference frame           REF_FRAME              Table 4-2   M
 14       Epoch of reference        REF_FRAME_EPOCH        Table 4-2   C
          frame
 15       Time system applicable TIME_SYSTEM               Table 4-2   M
          to data
 16       Mean element set          MEAN_ELEMENT_THEORY    Table 4-2   M
          theory of data
 17      OMM Data                   N/A                    Table 4-3   M
 18      Mean Keplerian elements N/A                       Table 4-3   M
         logical block
 19       Comment                   COMMENT                Table 4-3   O
 20       Epoch of the orbital      EPOCH                  Table 4-3   M
          elements
 21       Semi-major axis or        SEMI_MAJOR_AXIS or     Table 4-3   M
          mean motion               MEAN_MOTION
 22       Eccentricity              ECCENTRICITY           Table 4-3   M
 23       Inclination               INCLINATION            Table 4-3   M
 24       Right ascension of        RA_OF_ASC_NODE         Table 4-3   M
          ascending node
 25       Argument of pericenter ARG_OF_PERICENTER         Table 4-3   M
 26       Mean anomaly              MEAN_ANOMALY           Table 4-3   M
 27       Gravitational             GM                     Table 4-3   O
          Coefficient

                                                                   Status
Item   Feature                   Keyword               Reference   M/O/C    Support
 28    Spacecraft Parameters     N/A                   Table 4-3   O
       logical block
 29      Comment                 COMMENT               Table 4-3   O
 30      Spacecraft Mass         MASS                  Table 4-3   O
 31      Solar Radiation         SOLAR_RAD_AREA        Table 4-3   O
         Pressure Area
 32      Solar Radiation         SOLAR_RAD_COEFF       Table 4-3   O
         Pressure Coefficient
 33      Drag Area               DRAG_AREA             Table 4-3   O
 34      Drag Coefficient        DRAG_COEFF            Table 4-3   O
 35    TLE logical block         N/A                   Table 4-3   O
 36      Comment                 COMMENT               Table 4-3   O
 37      Ephemeris Type          EPHEMERIS_TYPE        Table 4-3   O
 38      Classification Type     CLASSIFICATION_TYPE   Table 4-3   O
 39      NORAD Catalog           NORAD_CAT_ID          Table 4-3   O
         Number
 40      Element set number      ELEMENT_SET_NO        Table 4-3   O
 41      Revolution Number       REV_AT_EPOCH          Table 4-3   O
 42      SGP/SGP4 drag-like      BSTAR or BTERM        Table 4-3   C
         coefficient
 43      First Time Derivative   MEAN_MOTION_DOT       Table 4-3   C
         of the Mean Motion
 44      Second Time             MEAN_MOTION_DDOT or   Table 4-3   C
         Derivative of Mean      AGOM
         Motion
 45    Pos/Vel/Cov logical                             Table 4-3   O
       block
 46      Comment                 COMMENT               Table 4-3   O
 47      Cov reference frame     COV_REF_FRAME         Table 4-3   C
 48      Covariance [1,1]        CX_X                  Table 4-3   C
 49      Covariance [2,1]        CY_X                  Table 4-3   C
 50      Covariance [2,2]        CY_Y                  Table 4-3   C
 51      Covariance [3,1]        CZ_X                  Table 4-3   C
 52      Covariance [3,2]        CZ_Y                  Table 4-3   C
 53      Covariance [3,3]        CZ_Z                  Table 4-3   C
 54      Covariance [4,1]        CX_DOT_X              Table 4-3   C
 55      Covariance [4,2]        CX_DOT_Y              Table 4-3   C
 56      Covariance [4,3]        CX_DOT_Z              Table 4-3   C
 57      Covariance [4,4]        CX_DOT_X_DOT          Table 4-3   C

                                                                      Status
Item     Feature                    Keyword               Reference   M/O/C    Support
 58       Covariance [5,1]          CY_DOT_X              Table 4-3   C
 59       Covariance [5,2]          CY_DOT_Y              Table 4-3   C
 60       Covariance [5,3]          CY_DOT_Z              Table 4-3   C
 61       Covariance [5,4]          CY_DOT_X_DOT          Table 4-3   C
 62       Covariance [5,5]          CY_DOT_Y_DOT          Table 4-3   C
 63       Covariance [6,1]          CZ_DOT_X              Table 4-3   C
 64       Covariance [6,2]          CZ_DOT_Y              Table 4-3   C
 65       Covariance [6,3]          CZ_DOT_Z              Table 4-3   C
 66       Covariance [6,4]          CZ_DOT_X_DOT          Table 4-3   C
 67       Covariance [6,5]          CZ_DOT_Y_DOT          Table 4-3   C
 68       Covariance [6,6]          CZ_DOT_Z_DOT          Table 4-3   C
 69      User-Defined Parameters N/A                      Table 4-3   O
         logical block
 70       As defined by user,       USER_DEFINED_x        Table 4-3   O
          ‘essential information
          that cannot be
          conveyed in
          COMMENT
          statements’

A2.5.3     Orbit Ephemeris Message Requirements List

                                                                      Status
 Item    Feature                    Keyword               Reference   M/O/C      Support
   1     OEM Header                 N/A                   Table 5-2   M
   2       OEM Version              CCSDS_OEM_VERS        Table 5-2   M
   3       Comment                  COMMENT               Table 5-2   O
   4       Message                  CLASSIFICATION        Table 5-2   O
           classification/caveats
   5       Message creation date    CREATION_DATE         Table 5-2   M
           and time
   6       Message originator       ORIGINATOR            Table 5-2   M
   7       Unique message           MESSAGE_ID            Table 5-2   O
           identifier
   8     Metadata logical block     N/A                   Table 5-3   M
   9     Start of OEM Metadata      META_START            Table 5-3   M
  10       Comment                  COMMENT               Table 5-3   O
  11       Name of space object     OBJECT_NAME           Table 5-3   M

                                                                                Status
 Item   Feature                    Keyword                          Reference   M/O/C     Support
  12      Identifier of space      OBJECT_ID                        Table 5-3   M
          object
  13      Orbit center             CENTER_NAME                      Table 5-3   M
  14      Reference frame          REF_FRAME                        Table 5-3   M
  15      Epoch of reference       REF_FRAME_EPOCH                  Table 5-3   C
          frame
  16      Time system applicable TIME_SYSTEM                        Table 5-3   M
          to data
  17      Start of TOTAL time      START_TIME                       Table 5-3   M
          span covered by data
  18      Start of useable orbit   USEABLE_START_TIME               Table 5-3   O
          data
  19      End of useable orbit     USEABLE_STOP_TIME                Table 5-3   O
          data
  20      End of TOTAL time        STOP_TIME                        Table 5-3   M
          span covered by data
  21      Recommended              INTERPOLATION                    Table 5-3   O
          interpolation method
  22      Recommended              INTERPOLATION_DEGREE             Table 5-3   C
          interpolation degree
  23    End of OEM Metadata        META_STOP                        Table 5-3   M
  24    OEM Data logical block     N/A                              Table 5-3   M
  25      Ephemeris lines          … <insert ephemeris data lines   Table 5-3   M
                                   here.>
  26    OEM Covariance logical     N/A                              Table 5-3   O
        block
  27    Start of OEM Covariance COVARIANCE_START                    Table 5-3   M
               logical block
  28      Epoch of the             EPOCH                            Table 5-3   C
          navigation solution
          related to the
          covariance matrix
  29      Reference frame of the COV_REF_FRAME                      Table 5-3   C
          covariance matrix, if
          different from that of
          the states in the
          ephemeris
  30      Covariance lines         … <insert covariance matrices    Table 5-3   O
                                   here>
  31    End of OEM Covariance      COVARIANCE_STOP                  Table 5-3   M
        logical block

A2.5.4     Orbit Comprehensive Message Requirements List

A2.5.4.1    OCM Header

                                                                             Status
Item   Feature                      Keyword                    Reference     M/O/C     Support
  1    OCM Header                   N/A                        Table 6-2     M
  2      OCM Version                CCSDS_OCM_VERS             Table 6-2     M
  3      Comment                    COMMENT                    Table 6-2     O
  4      Message                    CLASSIFICATION             Table 6-2     O
         classification/caveats
  5      Message creation date      CREATION_DATE              Table 6-2     M
         and time
  6      Message originator         ORIGINATOR                 Table 6-2     M
  7      Unique message             MESSAGE_ID                 Table 6-2     O
         identifier

A2.5.4.2    OCM Metadata

                                                                                 Status
Item   Feature                      Keyword                      Reference       M/O/C Support
 1     Metadata logical block       N/A                          Table 6-3         M
 2     OCM Metadata Start           META_START                   Table 6-3         M
 3       Comment                    COMMENT                      Table 6-3         O
 4       Spacecraft name for the    OBJECT_NAME                  Table 6-3         O
         object
 5       International designator   INTERNATIONAL_DESIGNATOR     Table 6-3         O
         for the object
 6       Satellite catalog source   CATALOG_NAME                 Table 6-3         O
 7       Unique satellite          OBJECT_DESIGNATOR             Table 6-3         O
         identification designator
 8       Alternate name(s) of       ALTERNATE_NAMES              Table 6-3         O
         space object used by
         spacecraft operator,
         State Actors,
         commercial SSA
         providers and/or media.
 9       Message originator or      ORIGINATOR_POC               Table 6-3         O
         programmatic Point-of-
         Contact
 10      Contact position of the    ORIGINATOR_POSITION          Table 6-3         O
         originator PoC
 11      Originator PoC phone       ORIGINATOR_PHONE             Table 6-3         O
         number

                                                                      Status
Item   Feature                    Keyword                 Reference   M/O/C Support
 12     Originator PoC email      ORIGINATOR_EMAIL        Table 6-3     O
        address
 13     Originator PoC physical ORIGINATOR_ADDRESS        Table 6-3     O
        address
 14     Creating agency or        TECH _ORG               Table 6-3     O
        operator
 15     Technical Point-of-       TECH _POC               Table 6-3     O
        Contact
 16     Contact position of the   TECH _POSITION          Table 6-3     O
        technical PoC
 17     Technical PoC phone       TECH _PHONE             Table 6-3     O
        number
 18     Technical PoC email       TECH_EMAIL              Table 6-3     O
        address
 19     Technical PoC physical    TECH_ADDRESS            Table 6-3     O
        address
 20     ID that uniquely          PREVIOUS_MESSAGE_ID     Table 6-3     O
        identifies the previous
        message from this
        message originator for
        this particular space
        object
 21     ID that uniquely          NEXT_MESSAGE_ID         Table 6-3     O
        identifies the next
        message from this
        message originator for
        this particular space
        object
 22     Unique identifier of      ADM_MSG_LINK            Table 6-3     O
        linked Attitude Data
        Message(s)
 23     Unique identifier of    CDM_MSG_LINK              Table 6-3     O
        linked Conjunction Data
        Message(s)
 24     Unique identifier of    PRM_MSG_LINK              Table 6-3     O
        linked Pointing Request
        Message(s)
 25     Unique identifier of      RDM_MSG_LINK            Table 6-3     O
        linked Reentry Data
        Message(s)
 26     Unique identifier of      TDM_MSG_LINK            Table 6-3     O
        linked Tracking Data
        Message(s) (reference
        [9])
 27     Operator of the space     OPERATOR                Table 6-3     O
        object

                                                                        Status
Item   Feature                     Keyword                  Reference   M/O/C Support
 28     Owner of the space         OWNER                    Table 6-3     O
        object
 29     Country where the          COUNTRY                  Table 6-3     O
        owner or responsible
        party is based
 30     Name of the                CONSTELLATION            Table 6-3     O
        constellation
 31     Type of object             OBJECT_TYPE              Table 6-3     O
 32     Time system for all        TIME_SYSTEM              Table 6-3     M
        absolute time stamps in
        this OCM including
        EPOCH_TZERO
 33     Default epoch to which     EPOCH_TZERO              Table 6-3     M
        all relative times are
        referenced
 34     Operational status of the OPS_STATUS                Table 6-3     O
        space object
 35     Type of orbit              ORBIT_CATEGORY           Table 6-3     O
 36     Elements of information OCM_DATA_ELEMENTS           Table 6-3     O
        included in this message
 37     Spacecraft clock epoch     SCLK_OFFSET_AT_EPOCH     Table 6-3     C
 38     Spacecraft clock rate      SCLK_SEC_PER_SI_SEC      Table 6-3     C
 39     Creation epoch of the      PREVIOUS_MESSAGE_EPOCH   Table 6-3     O
        previous message from
        this originator for this
        particular space object
 40     Anticipated (or actual)    NEXT_MESSAGE_EPOCH       Table 6-3     O
        epoch of the next
        message from this
        originator for this
        particular space object
 41     Time of the earliest data START_TIME                Table 6-3     O
 42     Time of the latest data    STOP_TIME                Table 6-3     O
 43     Span of time that the      TIME_SPAN                Table 6-3     O
        OCM covers, measured
        in days
 44     Difference (TAI – UTC) TAIMUTC_AT_TZERO             Table 6-3     O
        in seconds
 45     Epoch of next leap         NEXT_LEAP_EPOCH          Table 6-3     O
        second(s)
 46     Difference (TAI – UTC) NEXT_LEAP_TAIMUTC            Table 6-3     O
        after next leap second(s)
        are introduced
 47     Difference (UT1 –          UT1MUTC_AT_TZERO         Table 6-3     O
        UTC) in seconds

                                                                        Status
Item   Feature                       Keyword                Reference   M/O/C Support
 48      Source and version of    EOP_SOURCE                Table 6-3     O
         the message originator’s
         EOP
 49      Method used to select or INTERP_METHOD_EOP         Table 6-3     O
         interpolate sequential
         EOP data
 50      Source and version of    CELESTIAL_SOURCE          Table 6-3     O
         the message originator’s
         celestial body (e.g.,
         Sun/Earth/Planetary)
         ephemeris data
 51      Metadata Stop               META_STOP              Table 6-3     M

A2.5.4.3     OCM Data: Trajectory State Time History

                                                                        Status
Item   Feature                       Keyword                Reference   M/O/C Support
  1    Trajectory state time         N/A                    Table 6-4     O
       history logical block
 2       Trajectory state time       TRAJ_START             Table 6-4     M
         history start
 3       Comment                     COMMENT                Table 6-4     O
 4       Identification number       TRAJ_ID                Table 6-4     O
         for this trajectory state
         time history block
 5       Identification number       TRAJ_PREV_ID           Table 6-4     O
         for the previous
         trajectory state time
         history
 6       Identification number       TRAJ_NEXT_ID           Table 6-4     O
         for the next trajectory
         state time history
 7       Basis of this Trajectory    TRAJ_BASIS             Table 6-4     O
         state time history data
 8       Identification number       TRAJ_BASIS_ID          Table 6-4     O
         for the orbit
         determination,
         navigation solution, or
         simulation
 9       Recommended                 INTERPOLATION          Table 6-4     O
         interpolation method
 10      Recommended                 INTERPOLATION_DEGREE   Table 6-4     C
         interpolation degree
 11      Orbit propagator used       PROPAGATOR             Table 6-4     O

 12     Origin of the orbit          CENTER_NAME                            Table 6-4     M
        reference frame
 13     Reference frame of the       TRAJ_REF_FRAME                         Table 6-4     M
        trajectory state time
        history
 14     Epoch of the orbit data      TRAJ_FRAME_EPOCH                       Table 6-4     C
        reference frame
 15     Start of useable orbit       USEABLE_START_TIME                     Table 6-4     O
        data
 16     End of useable orbit         USEABLE_STOP_TIME                      Table 6-4     O
        data
 17     Orbit revolution number ORB_REVNUM                                  Table 6-4     O
        (an integer)
 18     Orbit revolution basis       ORB_REVNUM_BASIS                       Table 6-4     C
        number
 19     Orbit element set type       TRAJ_TYPE                              Table 6-4     M
 20     Orbit averaging              ORB_AVERAGING                          Table 6-4     C
        technique used
 21     Orbital element units for TRAJ_UNITS                                Table 6-4     O
        data elements that
        follow the time tag
 22     OCM trajectory state         … <insert trajectory state time history Table 6-4    M
        time history                 here>
 23     Trajectory state time        TRAJ_STOP                              Table 6-4     M
        history end

A2.5.4.4    OCM Data: Space Object Physical Characteristics

                                                                                        Status
Item Feature                            Keyword                               Reference M/O/C Support
  1  Space Object Physical              N/A                                   Table 6-5   O
     Characteristics logical block
 2      Start of a Space Object         PHYS_START                            Table 6-5   M
        Physical Characteristics
        specification
 3      Comment                         COMMENT                               Table 6-5   O
 4      Satellite manufacturer name MANUFACTURER                              Table 6-5   O
 5      Satellite manufacturer’s        BUS_MODEL                             Table 6-5   O
        spacecraft bus model name
 6      Space objects that this         DOCKED_WITH                           Table 6-5   O
        object is docked to
 7      Additional drag Area facing DRAG_CONST_AREA                           Table 6-5   O
        the relative wind vector
        beyond that represented by
        AREA_ALONG_OEB_<M
        AX, INT, MIN>

                                                                        Status
Item Feature                         Keyword                  Reference M/O/C Support
  8    Drag coefficient              DRAG_COEFF_NOM           Table 6-5   O
 9      Drag coeff. 1σ uncertainty   DRAG_UNCERTAINTY         Table 6-5   O
 10     Space object total mass at   INITIAL_WET_MASS         Table 6-5   O
        beginning of life
 11     Space object wet mass        WET_MASS                 Table 6-5   O
 12     Space object dry mass        DRY_MASS                 Table 6-5   O
 13     Parent reference frame       OEB_PARENT_FRAME         Table 6-5   C
        which maps to the OEB
        frame
 14     Epoch of the OEB parent      OEB_PARENT_FRAME_EPOCH   Table 6-5   C
        reference frame
 15     Quaternion q1                OEB_Q1                   Table 6-5   O
 16     Quaternion q2                OEB_Q2                   Table 6-5   O
 17     Quaternion q3                OEB_Q3                   Table 6-5   O
 18     Quaternion qc                OEB_QC                   Table 6-5   O
 19     Maximum physical OEB         OEB_MAX                  Table 6-5   O
        dimension
 20     Intermediate physical OEB    OEB_INT                  Table 6-5   O
        dimension
 21     Minimum physical             OEB_MIN                  Table 6-5   O
        dimension
 22     Cross-sectional area viewed AREA_ALONG_OEB_MAX        Table 6-5   O
        along max OEB dimension
 23     Cross-sectional area viewed AREA_ALONG_ OEB_INT       Table 6-5   O
        along intermediate OEB
        dimension
 24     Cross-sectional area viewed AREA_ALONG_ OEB_MIN       Table 6-5   O
        along min OEB dimension
 25     Minimum cross-sectional        AREA_MIN_FOR_PC        Table 6-5   O
        area for collision probability
 26     Maximum cross-sectional        AREA_MAX_FOR_PC        Table 6-5   O
        area for collision probability
 27     Typical cross-sectional area AREA_TYP_FOR_PC          Table 6-5   O
        for collision probability
 28     Typical (50th percentile)    RCS                      Table 6-5   O
        effective Radar Cross
        Section
 29     Minimum Radar Cross          RCS_MIN                  Table 6-5   O
        Section
 30     Maximum Radar Cross          RCS_MAX                  Table 6-5   O
        Section
 31     SRP additional area          SRP_CONST_AREA           Table 6-5   O

                                                                       Status
Item Feature                           Keyword               Reference M/O/C Support
 32    Solar Radiation Pressure        SOLAR_RAD_COEFF       Table 6-5   O
       Coefficient
 33     Solar Radiation Pressure 1σ SOLAR_RAD_UNCERTAINTY    Table 6-5   O
        percent uncertainty
 34     Typical (50th percentile)      VM_ABSOLUTE           Table 6-5   O
        absolute Visual Magnitude
 35     Minimum apparent Visual        VM_APPARENT_MIN       Table 6-5   O
        Magnitude
 36     Typical (50th percentile)      VM_APPARENT           Table 6-5   O
        apparent Visual Magnitude
 37     Maximum apparent Visual        VM_APPARENT_MAX       Table 6-5   O
        Magnitude
 38     Typical (50th percentile)      REFLECTANCE           Table 6-5   O
        object surface reflectance
 39     Primary mode of attitude       ATT_CONTROL_MODE      Table 6-5   O
        control
 40     Type of actuator for attitude ATT_ACTUATOR_TYPE      Table 6-5   O
        control
 41     Accuracy of attitude           ATT_KNOWLEDGE         Table 6-5   O
        knowledge
 42     Ability (e.g., deadband) to    ATT_CONTROL           Table 6-5   O
        control attitude
 43     Combined ability to both       ATT_POINTING          Table 6-5   O
        knowledge and control
        attitude
 44     Average maneuver               AVG_MANEUVER_FREQ     Table 6-5   O
        frequency
 45     Maximum composite thrust       MAX_THRUST            Table 6-5   O
 46     Total ΔV capability of the     DV_BOL                Table 6-5   O
        spacecraft at beginning of
        life
 47     Total ΔV remaining             DV_REMAINING          Table 6-5   O
 48     Moment of Inertia about the IXX                      Table 6-5   O
        X-axis
 49     Moment of Inertia about the IYY                      Table 6-5   O
        Y-axis
 50     Moment of Inertia about the IZZ                      Table 6-5   O
        Z-axis
 51     Inertia Cross Product of the   IXY                   Table 6-5   O
        X & Y axes
 52     Inertia Cross Product of the   IXZ                   Table 6-5   O
        X & Z axes
 53     Inertia Cross Product of the   IYZ                   Table 6-5   O
        Y & Z axes

                                                                       Status
Item Feature                          Keyword                Reference M/O/C Support
 54    End of the Space Object        PHYS_STOP              Table 6-5       M
       Physical Characteristics
       specification

A2.5.4.5    OCM Data: Covariance Time History

                                                                         Status
Item   Feature                      Keyword                 Reference    M/O/C Support
 1     Covariance time history      N/A                     Table 6-6    O
       logical block
 2       OCM start of a             COV_START               Table 6-6    M
         covariance time history
         section
 3       Comment                    COMMENT                 Table 6-6    O
 4       Identification number      COV_ID                  Table 6-6    O
         for this covariance time
         history block
 5       Identification number      COV_PREV_ID             Table 6-6    O
         for the previous
         covariance time history
 6       Identification number      COV_NEXT_ID             Table 6-6    O
         for the next covariance
         time history
 7       Basis of this covariance   COV_BASIS               Table 6-6    O
         time history
 8       Identification number      COV_BASIS_ID            Table 6-6    O
         for the orbit
         determination,
         navigation solution, or
         simulation
 9       Reference frame of the     COV_REF_FRAME           Table 6-6    M
         covariance time history
 10      Epoch of the covariance COV_FRAME_EPOCH            Table 6-6    C
         data reference frame
 11      Minimum scale factor to COV_SCALE_MIN              Table 6-6    O
         apply to this covariance
         data
 12      Maximum scale factor       COV_SCALE_MAX           Table 6-6    O
         to apply to this
         covariance data
 13      Confidence in the          COV_CONFIDENCE          Table 6-6    O
         covariance errors
         matching reality
 14      Covariance composition COV_TYPE                    Table 6-6    M
 15      Covariance element         COV_ORDERING            Table 6-6    M
         ordering

                                                                                   Status
Item   Feature                       Keyword                           Reference   M/O/C Support
 16      Units of covariance data COV_UNITS                            Table 6-6   O
         line standard deviations
         (i.e., the square root of
         the variances supplied in
         the covariance matrix
         diagonal elements) that
         follow the time tag
 17      Covariance data             … <Insert covariance data here>   Table 6-6   M
 18      End of a covariance         COV_STOP                          Table 6-6   M
         time history section

A2.5.4.6    OCM Data: Maneuver Specification

                                                                                   Status
Item   Feature                        Keyword                          Reference   M/O/C Support
 1     Maneuver time history          N/A                              Table 6-7   O
       logical block
 2       Start of a maneuver data     MAN_START                        Table 6-7   M
         block
 3       Comment                      COMMENT                          Table 6-7   O
 4       Identification number for MAN_ID                              Table 6-7   M
         this maneuver
 5       Identification number for MAN_PREV_ID                         Table 6-7   O
         the previous maneuver
 6       Identification number for MAN_NEXT_ID                         Table 6-7   O
         the next maneuver
 7       Basis of this maneuver       MAN_BASIS                        Table 6-7   O
         time history data
 8       Identification number of     MAN_BASIS_ID                     Table 6-7   O
         the orbit determination
 9       Maneuver device              MAN_DEVICE_ID                    Table 6-7   M
         identifier
 10      Completion time of the       MAN_PREV_EPOCH                   Table 6-7   O
         previous maneuver
 11      Start time of the next       MAN_NEXT_EPOCH                   Table 6-7   O
         maneuver
 12      Specifies the purpose of     MAN_PURPOSE                      Table 6-7   O
         the maneuver
 13      Specifies the source of      MAN_PRED_SOURCE                  Table 6-7   O
         the orbit and/or attitude
         state(s)
 14      Reference frame in which MAN_REF_FRAME                        Table 6-7   M
         the maneuver vector
         direction data is provided

                                                                         Status
Item   Feature                      Keyword                  Reference   M/O/C Support
 15     Epoch of the maneuver       MAN_FRAME_EPOCH          Table 6-7   C
        data reference frame
 16     Origin of maneuver          GRAV_ASSIST_NAME         Table 6-7   O
        gravitational assist body
 17     Duty cycle type to use for DC_TYPE                   Table 6-7   M
        this maneuver time
        history
 18     Start time of the duty      DC_WIN_OPEN              Table 6-7   C
        cycle-based maneuver
        window
 19     End time of the duty        DC_WIN_CLOSE             Table 6-7   C
        cycle-based maneuver
        window
 20     Minimum number of ‘         DC_MIN_CYCLES            Table 6-7   O
        ‘ON’ duty cycles
 21     Maximum number of           DC_MAX_CYCLES            Table 6-7   O
        ‘ON’ duty cycles
 22     Start time of the initial   DC_EXEC_START            Table 6-7   C
        duty cycle-based
        maneuver sequence
 23     End time of the final duty DC_EXEC_STOP              Table 6-7   C
        cycle-based maneuver
        sequence
 24     THRUST duty cycle           DC_REF_TIME              Table 6-7   C
        reference time tag
 25     Thruster pulse ‘ON’         DC_TIME_PULSE_DURATION   Table 6-7   C
        duration
 26     Elapsed time between the DC_TIME_PULSE_PERIOD        Table 6-7   C
        start of one pulse and the
        start of the next
 27     Specifies the ‘ON’          DC_REF_DIR               Table 6-7   C
        reference unit vector
        direction
 28     Body reference frame        DC_BODY_FRAME            Table 6-7   C
        that
        DC_BODY_TRIGGER
        direction is expressed in
 29     Body frame reference        DC_BODY_TRIGGER          Table 6-7   C
        unit vector ‘trigger’
        direction
 30     Phase angle offset of       DC_PA_START_ANGLE        Table 6-7   C
        thruster pulse start
 31     Phase angle of thruster     DC_PA_STOP_ANGLE         Table 6-7   C
        pulse stop

                                                                                    Status
Item   Feature                       Keyword                           Reference    M/O/C Support
 32      Set of maneuver             MAN_COMPOSITION                   Table 6-7    M
         elements of information
         to follow the maneuver
         time tag
 33      Units of maneuver data      MAN_UNITS                         Table 6-7    O
         line elements that follow
         the time tag(s)
 34      Maneuver time history        … < Insert maneuver data here>   Table 6-7    M
         data
 35      End maneuver data block MAN_STOP                              Table 6-7    M

A2.5.4.7    OCM Data: Perturbations Specification

                                                                                    Status
Item   Feature                       Keyword                           Reference    M/O/C Support
 1     Orbit perturbations           N/A                               Table 6-10   O
       parameters
 2       Start of the                PERT_START                        Table 6-10   M
         Perturbations
         Specification
 3       Comment                     COMMENT                           Table 6-10   O
 4       Atmosphere model used ATMOSPHERIC_MODEL                       Table 6-10   O
         in the simulation
 5       Gravity model used in       GRAVITY_MODEL                     Table 6-10   O
         the simulation
 6       Oblate spheroid             EQUATORIAL_RADIUS                 Table 6-10   O
         equatorial radius
 7       Gravitational coefficient GM                                  Table 6-10   O
         of attracting body
 8       ‘N-body’ gravitational      N_BODY_PERTURBATIONS              Table 6-10   O
         perturbations bodies
         used
 9       Central body angular        CENTRAL_BODY_ROTATION             Table 6-10   O
         rotation rate
 10      Inverse of the central      OBLATE_FLATTENING                 Table 6-10   O
         body’s oblate spheroid
         oblateness
 11      Ocean tides model           OCEAN_TIDES_MODEL                 Table 6-10   O
 12      Solid tides model           SOLID_TIDES_MODEL                 Table 6-10   O
 13      Reduction theory used       REDUCTION_THEORY                  Table 6-10   O
         for precession and
         nutation modeling
 14      Albedo model                ALBEDO_MODEL                      Table 6-10   O

                                                                      Status
Item   Feature                     Keyword               Reference    M/O/C Support
 15     Number of grid points      ALBEDO_GRID_SIZE      Table 6-10   O
        used in the albedo
        model
 16     Shadow model used for SHADOW_MODEL               Table 6-10   O
        Solar Radiation Pressure
 17     List of planetary bodies   SHADOW_BODIES         Table 6-10   O
        for which SRP
        shadowing is modeled
 18     SRP model used             SRP_MODEL             Table 6-10   O
 19     Source and version of      SW_DATA_SOURCE        Table 6-10   O
        the Space Weather data
        used in the creation of
        this message
 20     Epoch of the Space         SW_DATA_EPOCH         Table 6-10   O
        Weather data
 21     Method used to select or SW_INTERP_METHOD        Table 6-10   O
        interpolate any and all
        sequential space weather
        data
 22     A fixed (time invariant) FIXED_GEOMAG_KP         Table 6-10   O
        value of the planetary 3-
        hour-range geomagnetic
        index Kp
 23     A fixed (time invariant)   FIXED_GEOMAG_AP       Table 6-10   O
        value of the 3-hourly
        (equivalent range)
        geomagnetic index Ap
 24     A fixed (time invariant) FIXED_GEOMAG_DST        Table 6-10   O
        value of the planetary 1-
        hour-range geomagnetic
        index Dst
 25     A fixed (time invariant)   FIXED_F10P7           Table 6-10   O
        value of the solar flux
        daily proxy F10.7
 26     A fixed (time invariant)   FIXED_F10P7_MEAN      Table 6-10   O
        value of the solar flux
        81‐day running center-
        averaged proxy F10.7
 27     A fixed (time invariant)   FIXED_M10P7           Table 6-10   O
        value of the solar flux
        daily proxy M10.7
 28     A fixed (time invariant)   FIXED_M10P7_MEAN      Table 6-10   O
        value of the solar flux
        81‐day running center-
        averaged proxy M10.7
 29     A fixed (time invariant)   FIXED_S10P7           Table 6-10   O
        value of the solar flux
        daily proxy S10.7

                                                                         Status
Item   Feature                      Keyword                 Reference    M/O/C Support
 30      A fixed (time invariant)   FIXED_S10P7_MEAN        Table 6-10   O
         value of the solar flux
         81‐day running center-
         averaged proxy S10.7
 31      A fixed (time invariant)   FIXED_Y10P7             Table 6-10   O
         value of the solar flux
         daily proxy Y10.7
 32      A fixed (time invariant)   FIXED_Y10P7_MEAN        Table 6-10   O
         value of the solar flux
         81‐day running center-
         averaged proxy Y10.7
 33      Perturbations Data         PERT_STOP               Table 6-10   M
         Block Stop

A2.5.4.8    OCM Data: Orbit Determination Data

                                                                         Status
Item   Feature                      Keyword                 Reference    M/O/C Support
 1     Orbit determination          N/A                     Table 6-11   O
       parameters logical block
 2       Start of an orbit          OD_START                Table 6-11   M
         determination data
         section
 3       Comment                    COMMENT                 Table 6-11   O
 4       Identification number      OD_ID                   Table 6-11   M
         for this orbit
         determination
 5       Identification number      OD_PREV_ID              Table 6-11   O
         for the previous orbit
         determination
 6       Type of orbit              OD_METHOD               Table 6-11   M
         determination method
         used
 7       UTC epoch of the orbit OD_EPOCH                    Table 6-11   M
         determination solved-for
         state
 8       Days elapsed between       DAYS_SINCE_FIRST_OBS    Table 6-11   O
         first accepted
         observation and
         OD_EPOCH
 9       Days elapsed between       DAYS_SINCE_LAST_OBS     Table 6-11   O
         last accepted
         observation and
         OD_EPOCH

                                                                      Status
Item   Feature                     Keyword               Reference    M/O/C Support
 10     Number of days of          RECOMMENDED_OD_SPAN   Table 6-11   O
        observations
        recommended for the
        OD
 11     Actual time span in days ACTUAL_OD_SPAN          Table 6-11   O
        used for the OD
 12     Number of observations OBS_AVAILABLE             Table 6-11   O
        available within the
        actual OD time span
 13     Number of observations OBS_USED                  Table 6-11   O
        accepted within the
        actual OD time span
 14     Number of sensor tracks TRACKS_AVAILABLE         Table 6-11   O
        available for the OD
        within the actual time
        span
 15     Number of sensor tracks TRACKS_USED              Table 6-11   O
        accepted for the OD
        within the actual time
        span
 16     Maximum time between MAXIMUM_OBS_GAP             Table 6-11   O
        observations in the OD
 17     Positional error ellipsoid OD_EPOCH_EIGMAJ       Table 6-11   O
        1𝜎 major eigenvalue at
        OD
 18     Positional error ellipsoid OD_EPOCH_EIGINT       Table 6-11   O
        1𝜎 intermediate
        eigenvalue at OD
 19     Positional error ellipsoid OD_EPOCH_EIGMIN       Table 6-11   O
        1𝜎 minor eigenvalue at
        OD
 20     Max positional error       OD_MAX_PRED_EIGMAJ    Table 6-11   O
        ellipsoid 1𝜎 major
        eigenvalue
 21     Min positional error       OD_MIN_PRED_EIGMIN    Table 6-11   O
        ellipsoid 1𝜎 minor
        eigenvalue
 22     OD confidence metric,      OD_CONFIDENCE         Table 6-11   O
        which by definition
        spans 0 to 100%
 23     Generalized Dilution of    GDOP                  Table 6-11   O
        Precision for this orbit
        determination
 24     Number of solve-for        SOLVE_N               Table 6-11   O
        states in the orbit
        determination

                                                                             Status
Item   Feature                    Keyword                       Reference    M/O/C Support
 25      State elements solved    SOLVE_STATES                  Table 6-11   O
         for in the orbit
         determination
 26      Number of consider       CONSIDER_N                    Table 6-11   O
         parameters used in the
         orbit determination
 27      Consider parameters      CONSIDER_PARAMS               Table 6-11   O
         used in the orbit
         determination
 28      Specific Energy          SEDR                          Table 6-11   O
         Dissipation Rate
 29      Number of sensors used SENSORS_N                       Table 6-11   O
         in the orbit
         determination
 30      Sensors used in the orbit SENSORS                      Table 6-11   O
         determination
 31      Weighted RMS residual WEIGHTED_RMS                     Table 6-11   O
         ratio
 32      Observation data types   DATA_TYPES                    Table 6-11   O
         utilized in this orbit
         determination
 33      End of an orbit          OD_STOP                       Table 6-11   M
         determination data
         section

A2.5.4.9    OCM Data: User-Defined Parameters

                                                                             Status
Item   Feature                    Keyword                       Reference    M/O/C Support
 1     User-Defined Parameters    N/A                           Table 6-12   O
       logical block
 2       OCM User-Defined         USER_START                    Table 6-12   M
         Parameters start
 3       Comment                  COMMENT                       Table 6-12   O
 4       As defined by user,     USER_DEFINED_x (user-defined   Table 6-12   M
         ‘essential information  keywords)
         that cannot be conveyed
         in COMMENT
         statements’
 5       OCM User-Defined         USER_STOP                     Table 6-12   M
         Parameters end

# ANNEX B

                     VALUES FOR SELECTED KEYWORDS

                                     (NORMATIVE)
The values in this annex represent the recommended values for selected keywords present in
OPM, OMM, OEM, or OCM message. For details and descriptions of the keyword
interpretations, the reader is directed to references [H1] and [H7]. The message creator
should seek to confirm with the recipient(s) that their software can support the selected
keyword value, particularly for more complex content such as reference frames, orbital
elements, and covariance definitions.

These recommended values are stored on the SANA Registry, globally accessible on the
CCSDS SANA registry website located at:

https://sanaregistry.org/r/navigation_standard_normative_annexes

It should be noted that the message creator or recipient may wish to automate processing of
SANA registry normative content, which can be done by ingesting and processing of such
content in electronic format. These formats can be accessed via the ‘Actions’ link on each
registry, for example, for the Orbital Elements registry, a Comma Separated Value (CSV)
format can be exported at: https://www.sanaregistry.org/r/orbital_elements?_export=csv and
a JSON format at: https://www.sanaregistry.org/r/orbital_elements?_export=json. It should
be noted that both the registry and these electronic data formats specify the number of vector
elements corresponding to each keyword value.

Exchange partners may submit additional (new) keyword values for consideration for future
inclusion into the SANA registry by submitting a detailed email request
(mailto:info@sanaregistry.org) per annex C, subsection C4. The CCSDS Area or Working
Group responsible for the maintenance of the ODM at the time of the request is the approval
authority. Until a suggested value is included in the SANA registry, exchange partners may
define and use values that are not listed in the SANA registry if mutually agreed between
message exchange partners.

B1   MESSAGE ORIGINATORS

The set of recommended values for the ORIGINATOR keyword is enumerated in the SANA
Registry of Organizations, located at:

https://sanaregistry.org/r/organizations

B2   REFERENCE FRAME CENTERS AND THIRD-BODY PERTURBATIONS

A set of allowed values for the reference frame center keywords (CENTER_NAME for
OPM, OEM, OMM, and OCM, as well as N_BODY_PERTURBATIONS in the OCM) is
enumerated in the SANA Registry of Orbit Centers, located at:

https://sanaregistry.org/r/orbit_centers

The orbit center name is provided in the ‘Orbit Center’ column of the Orbit Center registry. It
should be noted that these values may also be useful to specify another platform (satellite,
airframe, ground vehicle, etc.) as the reference frame origin to permit the specification of
relative positional state time history data. In this case, message authors shall clearly
communicate to recipients that the orbit center is not a gravitational center, that propagation
of ephemeris vectors or extrapolation of ephemeris start/stop states is not advisable, and that
interpolation of state time histories should not be accomplished using classical orbit
propagation forces (e.g., gravitational constants, drag).

B3   TIME SYSTEMS

A set of allowed values for the TIME_SYSTEM keyword is enumerated in the SANA
Registry of Time Systems, located at:

https://sanaregistry.org/r/time_systems

B4   CELESTIAL BODY REFERENCE FRAMES

A set of allowed celestial body reference frame values for *_REF_FRAME keywords is
enumerated in the SANA Registry of Celestial Body Reference Frames, located at:

https://sanaregistry.org/r/celestial_body_reference_frames

B5   ORBIT-RELATIVE REFERENCE FRAMES

In addition to the above reference frames, maneuver and covariance data may be selected
from the list of allowed orbit-relative reference frames using *_REF_FRAME keyword
values enumerated in the SANA Registry of Orbit-Relative Reference Frames, located at:

https://sanaregistry.org/r/orbit_relative_reference_frames

It should be noted that two types of orbit-relative local reference frames exist: inertial
and rotating. When transforming velocity terms between inertial and rotating frames,
remember to properly incorporate the (𝝎 � × ���
                                              𝒓) contribution.

B6   ADDITIONAL SPACECRAFT AND ATTITUDE REFERENCE FRAMES

An additional allowed set of spacecraft and attitude control reference frame values for
*_REF_FRAME keywords is enumerated in the SANA Registry of Spacecraft and Attitude
Control Reference Frames, located at:

https://sanaregistry.org/r/spacecraft_body_reference_frames

In numerous instances, these spacecraft body reference frames are specified by a keyword
followed by an ‘i’ (e.g., ACTUATOR_i), the ‘i’ should be replaced by an integer value (1, 2,
…) to denote the ‘ith’ reference frame within the set of those reference frames.

B7   ORBITAL ELEMENTS

A set of allowed values for the TRAJ_TYPE keyword is enumerated in the SANA Registry
of Orbital Elements, located at:

https://sanaregistry.org/r/orbital_elements

Unique to the OCM, orbit element states and/or time histories may be specified in multiple
element set types.

Orbit elements shall be interpreted as osculating elements unless either explicitly specified
via the ORB_AVERAGING keyword or as mutually agreed between message exchange
partners to contain mean elements (e.g., singly or doubly averaged elements based upon
Kozai, Brouwer, or other theories).

Inertial reference frames shall be specified when employing inertial element sets.

When employing non-inertial element sets, inertial reference frames shall not be specified.

B8   ADDITIONAL COVARIANCE REPRESENTATIONS

Covariance matrices may either be specified as representing uncertainties expressed in the
above ‘Orbital Elements’ types (e.g., COV_TYPE may be set to an TRAJ_TYPE such as
CARTPVA) or may specify an event-based covariance type that includes event time
uncertainties as enumerated in the SANA Registry of Covariance Representations, located at:

https://sanaregistry.org/r/orbital_covariance_matrix_types

B9   ATMOSPHERE MODELS

A set of allowed values for the ATMOSPHERIC_MODEL keyword is enumerated in the
SANA Registry of Atmosphere Models, located at:

https://sanaregistry.org/r/atmosphere_models

B10 GRAVITY MODELS

A set of allowed values for the GRAVITY_MODEL keyword is enumerated in the SANA
Registry of Gravity Models, located at:

https://sanaregistry.org/r/gravity_models

B11 OBJECT TYPES

A set of allowed values for the OBJECT_TYPE keyword is enumerated in the SANA
Registry of Object Types, located at:

https://sanaregistry.org/r/object_types

B12 OPERATIONAL STATUS

A set of allowed values for the OPS_STATUS keyword is enumerated in the SANA Registry
of Operational Status of Space Object, located at:

https://sanaregistry.org/r/operational_status

B13 ORBIT AVERAGING TECHNIQUES

A set of allowed values for the ORB_AVERAGING keyword is enumerated in the SANA
Registry of Orbit Averaging Techniques, located at:

https://sanaregistry.org/r/orbit_averaging

B14 ORBIT CATEGORIES

A set of allowed values for the ORBIT_CATEGORY keyword is enumerated in the SANA
Registry of Orbit Types, located at:

https://sanaregistry.org/r/orbit_categories

# ANNEX C

           SECURITY, SANA, AND PATENT CONSIDERATIONS

                                    (INFORMATIVE)

C1     SECURITY CONSIDERATIONS

C2     ANALYSIS OF SECURITY CONSIDERATIONS

This annex presents the results of an analysis of security considerations applied to the
technologies specified in this Recommended Standard.

C3     CONSEQUENCES OF NOT APPLYING SECURITY TO THE TECHNOLOGY

The consequences of not applying security to the systems and networks on which this
Recommended Standard is implemented could include potential loss, corruption, and theft of
data. Because these messages are used in preparing pointing and frequency predicts used
during spacecraft commanding, and may also be used in collision avoidance analyses, the
consequences of not applying security to the systems and networks on which this
Recommended Standard is implemented could include compromise or loss of the mission if
malicious tampering of a particularly severe nature occurs.

C3.1    POTENTIAL THREATS AND ATTACK SCENARIOS

Potential threats or attack scenarios include, but are not limited to, (a) unauthorized access to
the programs/processes that generate and interpret the messages, (b) unauthorized access to
the messages during transmission between exchange partners, and (c) modification of the
messages between partners. Protection from unauthorized access during transmission is
especially important if the mission utilizes open ground networks, such as the Internet, to
provide ground-station connectivity for the exchange of data formatted in compliance with
this Recommended Standard. It is strongly recommended that potential threats or attack
scenarios applicable to the systems and networks on which this Recommended Standard is
implemented be addressed by the management of those systems and networks.

C3.2    DATA PRIVACY

Privacy of data formatted in compliance with the specifications of this Recommended
Standard should be assured by the systems and networks on which this Recommended
Standard is implemented.

C3.3    DATA INTEGRITY

Integrity of data formatted in compliance with the specifications of this Recommended
Standard should be assured by the systems and networks on which this Recommended
Standard is implemented.

C3.4    AUTHENTICATION OF COMMUNICATING ENTITIES

Authentication of communicating entities involved in the transport of data that complies with
the specifications of this Recommended Standard should be provided by the systems and
networks on which this Recommended Standard is implemented.

C3.5    DATA TRANSFER BETWEEN COMMUNICATING ENTITIES

The transfer of data formatted in compliance with this Recommended Standard between
communicating entities should be accomplished via secure mechanisms approved by the
Information Technology Security functionaries of exchange participants.

C3.6    CONTROL OF ACCESS TO RESOURCES

Control of access to resources should be managed by the systems upon which originator
formatting and recipient processing are performed.

C3.7    AUDITING OF RESOURCE USAGE

Auditing of resource usage should be handled by the management of systems and networks
on which this Recommended Standard is implemented.

C3.8    UNAUTHORIZED ACCESS

Unauthorized access to the programs/processes that generate and interpret the messages
should be prohibited in order to minimize potential threats and attack scenarios.

C3.9    DATA SECURITY IMPLEMENTATION SPECIFICS

Specific information-security interoperability provisions that may apply between agencies
and other independent users involved in an exchange of data formatted in compliance with
this Recommended Standard could be specified in an ICD.

C4     SANA CONSIDERATIONS

The following ODM-related items have been registered with the SANA Operator.

     –    The ODM/XML schema (see section 8).

The following normative ODM elements should be selected from the SANA registry (see
annex B):
     –    ODM originators;
     –    spacecraft identifiers;
     –    Reference Frame Center and Third-Body Perturbations;
     –    time systems;
     –    Reference Frames (inertial, quasi-inertial, orbit-relative, spacecraft and attitude
          frames);
     –    orbital element set and covariance matrix composition definitions;
     –    atmosphere models;
     –    gravity models;
     –    object types;
     –    operational status;
     –    orbit averaging techniques;
     –    orbit types.

The registration rule for new entries in the SANA registry is the approval of new requests by
the CCSDS Area or Working Group responsible for the maintenance of the ODM at the time
of the request. New requests for this registry should be sent to SANA
(mailto:info@sanaregistry.org).

C5       PATENT CONSIDERATIONS

The recommendations of this document have no patent issues.

# ANNEX D

                    ABBREVIATIONS AND ACRONYMS

                                 (INFORMATIVE)
Term     Meaning
ADM      Attitude Data Message
ASCII    American Standard Code for Information Interchange
CATS     Critical Angle to the Sun
CCSDS    Consultative Committee for Space Data Systems
CDM      Conjunction Data Message
COSPAR United Nations Committee on Space Research
DSST     Draper Semi-Analytic Satellite Theory
EOP      Earth Orientation Parameters
GPS      Global Positioning System
HEO      high Earth orbit
IAU      International Astronomical Union
ICD      Interface Control Document
ICRF     International Celestial Reference Frame
IEC      International Electro-technical Commission
IIRV     Improved Inter-Range Vector
IOD      Initial Orbit Determination
ISO      International Organization for Standardization
ITRF     International Terrestrial Reference Frame
GDoP     generalized dilution of precision
GRC      Greenwich Rotating Coordinate Frame
J2000    Earth Mean Equator and Equinox of J2000 (Julian Date 2000)
KVN      keyword = value notation
LEO      low Earth orbit
LS       Least Squares
LTM      Lower Triangular Matrix
MARSGRAM            Mars Global Reference Atmosphere Model
MSIS     Mass-Spectrometer-Incoherent-Scatter

NORAD North American Aerospace Defense Command
OD       Orbit Determination
ODM      Orbit Data Message
OEB      Optimally Encompassing Box
OEM      Orbit Ephemeris Message
OCM      Orbit Comprehensive Message
OMM      Orbit Mean-Elements Message
OPM      Orbit Parameter Message
PoC      Point-of-Contact
PRM      Pointing Request Message
RDM      Reentry Data Message
RMS      Root Mean Square
RTN      Radial, Transverse (along-track), and Normal
RSO      Resident Space Object
SEDR     Specific Energy Dissipation Rate
SGP      Simplified General Perturbations
SGP4     US Air Force Simplified General Perturbations No. 4
SP       Sequential Processing
SPK      Satellite, Planetary Kernel
SRP      Solar Radiation Pressure
SSA      Space Situational Awareness
TAI      International Atomic Time
TCB      Barycentric Coordinate Time
TDB      Barycentric Dynamical Time
TDM      Tracking Data Message
TDR      True of Date Rotating
TEME     True Equator Mean Equinox
TLE      Two Line Element
TOD      True Equator and Equinox of Date
TT       Terrestrial Dynamical Time (see also ‘TDT’)
USM      Universal Semi-analytical Method
UTC      Coordinated Universal Time

UTM      Upper Triangular Matrix
VENUSGRAM          Venus Global Reference Atmosphere Model
W3C      World Wide Web Consortium
WGS      World Geodetic System
XML      Extensible Markup Language

# ANNEX E

                      RATIONALE FOR THIS STANDARD

                                   (INFORMATIVE)

E1    OVERVIEW

This annex presents the rationale behind the design of each message. It may help the
application engineer to select a suitable message.

A specification of requirements agreed to by all parties is essential to focus design and to
ensure the product meets the needs of the Member Agencies and satellite operators. There
are many ways of organizing requirements, but the categorization of requirements is not as
important as the agreement to a sufficiently comprehensive set. In this annex, the
requirements are organized into three categories:
     a) Primary Requirements: These are the most elementary and necessary requirements.
        They would exist no matter the context in which the CCSDS is operating, that is,
        regardless of pre-existing conditions within the CCSDS, its Member Agencies, or
        other independent users.
     b) Heritage Requirements: These are additional requirements that derive from pre-
        existing Member Agency or other independent user requirements, conditions, or
        needs. Ultimately, these carry the same weight as the Primary Requirements. This
        Recommended Standard reflects heritage requirements pertaining to some of the
        CCSDS Areas’ home institutions collected during the preparation of the document; it
        does not speculate on heritage requirements that could arise from other sources.
        Corrections and/or additions to these requirements are expected during future
        updates.
     c) Desirable Characteristics: These are not requirements, but they are felt to be
        important or useful features of the Recommended Standard.

E2     REQUIREMENTS ACCEPTED BY THE ORBIT DATA MESSAGES

E2.1    PRIMARY REQUIREMENTS

 #                            Requirement                                 OPM? OMM? OEM? OCM?
P1     Data must be provided in digital form (computer file).              Y    Y     Y         Y
P2     The file specification must not require of the receiving            N    N     Y         Y
       exchange partner the separate application of, or modeling of,
       spacecraft dynamics or gravitational force models, or
       integration or propagation.
P3     The interface must facilitate the receiver of the message to        Y    Y     Y         Y
       generate a six-component Cartesian state vector (position and
       velocity) at any required epoch.
P4     State vector information must be provided in a reference frame      Y    Y     Y         Y
       that is clearly identified and unambiguous.
P5     Identification of the object and the center(s) of motion must be    Y    Y     Y         Y
       clearly identified and unambiguous.
P6     Time measurements (time stamps, or epochs) must be provided         Y    Y     Y         Y
       in a commonly used, clearly specified system.
P7     The time bounds of the ephemeris must be unambiguously             N/A   N/A   Y         Y
       specified.
P8     The Recommended Standard must              provide   for   clear    Y    Y     Y         Y
       specification of units of measure.
P9     Files must be readily ported between, and useable within, ‘all’     Y    Y     Y         Y
       computational environments in use by Member Agencies.
P10    Files must have means of being uniquely identified and clearly      Y    Y     Y         Y
       annotated. The file name alone is considered insufficient for
       this purpose.
P11    File name syntax and length must not violate computer               Y    Y     Y         Y
       constraints for those computing environments in use by
       Member Agencies.
P12    A means to convey information about the uncertainty of the          Y    Y     Y         Y
       state shall be provided.

E2.2     HERITAGE REQUIREMENTS

 #                          Requirement                               OPM? OMM? OEM? OCM?
H1     Ephemeris data is reliably convertible into the SPICE SPK       N    N    Y      Y
       (NASA) format (reference [H4]) and IIRV (NASA) format
       (reference [H5]) using a standard, multi-mission,
       unsupervised pipeline process. A complete ephemeris, not
       subject to integration or propagation by the customer, must
       be provided.

H2     Ephemeris data provided for scheduling or operations            N    N    Y      Y
       (metric predicts) is to be certified by the providing Agency
       as correct and complete for the intended purpose. The
       receiving Agency cannot provide evaluation, trajectory
       propagation, or other usability services.

H3     The ODM shall provide a mechanism by which messages             Y    Y    Y      Y
       may be uniquely identified and clearly annotated. It
       facilitates discussion between the recipient and the message
       originator, should that be necessary.

H4     The ODM shall provide a mechanism by which maneuvers            N    N    N      Y
       may be uniquely identified and clearly annotated. It
       facilitates discussion between the recipient and the message
       originator, should that be necessary.

H5     The Recommended Standard is, or includes, an ASCII              Y    Y    Y      Y
       format.

H6     The Recommended Standard does not require software              Y    N    Y      Y
       supplied by other Agencies.

E2.3     DESIRABLE CHARACTERISTICS

 #                           Requirement                              OPM? OMM? OEM? OCM?
DC1     The Recommended Standard applies to non-traditional            Y    N    Y      Y
        objects, such as landers, rovers, balloons, and natural
        bodies (e.g., asteroids, comets).

DC2     The Recommended Standard allows state vectors to be            Y    Y    Y      Y
        provided in other than the traditional J2000 inertial
        reference frame; one example is the International
        Astronomical Union (IAU) Mars body-fixed frame. (In
        such a case, provision or ready availability of
        supplemental information needed to transform data into a
        standard frame must be arranged.)

DC3     The Recommended Standard is extensible with no                 Y    Y    Y      Y
        disruption to existing users/uses.

  #                        Requirement                            OPM? OMM? OEM? OCM?
DC4    The Recommended Standard is consistent with, and             Y        Y         Y       Y
       ideally a part of, ephemeris products and processes used
       for other space science purposes.

DC5    The Recommended Standard is as consistent as reasonable      Y        Y         Y       Y
       with any related CCSDS ephemeris Recommended
       Standards used for Earth-to-spacecraft or spacecraft-to-
       spacecraft applications.

E2.4     APPLICABILITY OF CRITERIA TO MESSAGE OPTIONS

The selection of one message will depend on the optimization criteria in the given
application. The following table compares the four recommended messages in terms of the
relevant selection criteria identified by the CCSDS.

E2.5     APPLICABILITY OF THE CRITERIA TO ORBIT DATA MESSAGES

                                                         Applicable Applicable Applicable Applicable
        Criteria                 Definition              to OPM? to OMM? to OEM? to OCM?
  Modeling Fidelity   Permits modeling of any                N          N          Y          Y
                      dynamic perturbation to the
                      trajectory.
  Human Readability Provides an easily readable              Y          Y          Y          Y
                    message corresponding to a
                    widely used orbit
                    representation.
      Remote Body     Permits use for assets on remote       Y          N          Y          Y
      Extensibility   solar system bodies.
      Lander/Rover    Permits exchange of non-orbit          N          N          Y          Y
      Compatibility   trajectories.

E3     INCREASING ORBIT PROPAGATION FIDELITY OF AN OPM OR OMM

Some OPM or OMM users may desire/require a higher fidelity propagation of the state
vector or Keplerian elements. A higher fidelity technique may be desired/required to
minimize inconsistencies in predictions generated by diverse, often operator-unique
propagation schemes. Nominally, the OPM and OMM are engineered only for low- to
medium-fidelity orbit propagation. However, with the inclusion of additional context
information, it is possible for users to provide data that could be used to provide a relatively
higher fidelity orbit propagation. For this relatively higher fidelity orbit propagation, a much
greater amount of ancillary information regarding spacecraft properties and dynamical
models should be provided. Higher fidelity orbit propagations may be useful in special
studies such as orbit conjunction studies.

Spacecraft orbit determination is a stochastic estimation problem; observations are inherently
uncertain, and not all of the phenomena that influence satellite motion are clearly discernible.
State vectors and Keplerian elements with their respective covariances are best propagated
with models that include the same forces and phenomena that were used for determining the
orbit. Including this information in an OPM or OMM allows exchange partners to compare
the results of their respective orbit propagations.

With additional context information, the OPM and OMM may be used for assessing mutual
physical or electromagnetic interference among Earth-orbiting spacecraft, developing
collaborative maneuvers, and propagating the orbits of active satellites, inactive man-made
objects, and near-Earth debris fragments. The additional information facilitates dynamic
modeling of any user’s approach to conservative and non-conservative phenomena.

The primary vehicle for the provision of additional optional ancillary information to be used
when propagating an OPM or OMM is the COMMENT mechanism. Alternatively, the
‘USER_DEFINED_’ keyword prefix may be used, though this usage is not encouraged.

E4   SERVICES RELATED TO THE DIFFERENT ORBIT DATA MESSAGE
     FORMATS

The different orbit data messages have been distinguished by the self-interpretability of the
messages. The different services that can be achieved without special arrangements between
users of the CCSDS orbit data messages are listed in table E-1

                   Table E-1: Services Available with Orbit Data Messages

                                                        Applicable    Applicable Applicable Applicable
     Service                  Definition                to OPM?       to OMM? to OEM? to OCM?
  Absolute Orbit State availability at specific times        Y            Y          Y          Y
  Interpretation for use in additional computations
                 (geometry, event detection, etc.).
  Relative Orbit Trajectory comparison and              Only at time   Only at       Y          Y
  Interpretation differencing for events based on       specified at    time
                 the same time source.                    Epoch      specified at
                                                                       Epoch

# ANNEX F

     TECHNICAL MATERIAL AND CONVENTIONS FOR ODM DATA

                                   (INFORMATIVE)

F1    SATELLITE PHYSICAL CHARACTERISTICS: OPTIMALLY
      ENCOMPASSING BOX

This section of the informative technical annex defines satellite dimensional and orientational
parameters of the OCM’s satellite physical characteristics specification.

To facilitate improved modeling of the physical space occupied by a space object, the space
object’s attitude/orientation, the probability of a hard body collision occurring, and drag and
SRP acceleration forces, the OCM allows the specification of an OEB. It should be noted
that the OEB describes the physical space occupied by the space object, which may or may
not align with the inertia tensor for that object.

For a box-shaped satellite (e.g., a CubeSat) without appendages, the satellite’s volume in
three-dimensional space and a corresponding OEB would have a one-to-one mapping.

For a satellite having solar arrays that extend from the spacecraft body structure, the OEB
would extend from the main satellite body to encompass the deployed solar arrays as well.

The OEB shape is shown in figure F-1 below. As illustrated, the OEB reference frame axes
(depicted as RED dotted lines) are defined by convention as follows:

The OEB x-axis is along the longest dimension of the box (𝑋�𝑂𝑂𝑂_𝑀𝑀𝑀 ). This is sometimes
referred to the ‘span’ of the space object.

The OEB y-axis is along the intermediate orthonormal dimension (𝑦�𝑂𝑂𝑂_𝐼𝐼𝐼 ).

The OEB z-axis is along the shortest orthonormal dimension (𝑧̂𝑂𝑂𝑂_𝑀𝑀𝑀 ).

The BOX shape can easily represent a cube by setting all orthonormal dimensions equal.

If the longest two or three principal axis dimensions of the box are equivalent, 𝑋�𝑂𝑂𝑂_𝑀𝑀𝑀 is
defined as the direction along one of those longest principal dimensions, and the next is
𝑦�𝑂𝑂𝑂_𝐼𝐼𝐼 .

The OEB z-axis is always defined as: 𝑧̂𝑂𝑂𝑂_𝑀𝑀𝑀 = 𝑋�𝑂𝑂𝑂_𝑀𝑀𝑀 × 𝑦�𝑂𝑂𝑂_𝐼𝐼𝐼 .

 Figure F-1: Depiction of Optimally Enclosing Box and Definitions of MAX, INT, and
             MIN Orientation Vectors Relative to OEB Parent Frame

NOTE – Parent and body axis are shown in proximity to each other for display purposes
       only but could generally be in any orientation as specified by the quaternion.

A fixed orientation of the Optimally Encompassing Box with respect to the user-specified
‘OEB_PARENT_FRAME’ is defined using a quaternion that maps from the user-specified
OEB_PARENT_FRAME to the Optimally Encompassing Box vector directions. The above
figure shows the proper definitions and sign conventions. The resulting transformation
sequence is:
                            𝑥            𝑥
                            𝑦
                           � �    = [𝑀]  𝑦
                                        � �
                            𝑧 OEB        𝑧 𝑂𝑂𝑂_𝑃𝑃𝑃𝑃𝑃𝑃_𝐹𝐹𝐹𝐹𝐹

Where the frame transformation matrix [M] is a function of the quaternion components:

        𝑄1 2 − 𝑄2 2 − 𝑄3 2 + 𝑄𝑐 2      2(𝑄1 𝑄2 + 𝑄3 𝑄𝑐 )            2(𝑄1 𝑄3 − 𝑄2 𝑄𝑐 )
 [𝑀] = � 2(𝑄1 𝑄2 − 𝑄3 𝑄𝑐 )          −𝑄1 2 + 𝑄2 2 − 𝑄3 2 + 𝑄𝑐 2      2(𝑄2 𝑄3 + 𝑄1 𝑄𝑐 )       �
            2(𝑄1 𝑄3 + 𝑄2 𝑄𝑐 )          2(𝑄2 𝑄3 − 𝑄1 𝑄𝑐 )         −𝑄1 2 − 𝑄2 2 + 𝑄3 2 + 𝑄𝑐 2

The physical dimensions of the OEB (long, intermediate, and short dimensions) are specified
via OEB_MAX, OEB_INT, and OEB_MIN, respectively.

The cross-sectional area is modeled in the OCM as a combination of two parameter types:
   a) an attitude-independent, constant cross-sectional area (e.g., DRAG_CONST_AREA or
       SRP_CONST_AREA);

   b) attitude-dependent cross-sectional area as viewed along the OEB x, y, and z axes
      (long,      intermediate,     and      short    dimension     directions)    via

       AREA_ALONG_OEB_MAX,             AREA_ALONG_OEB_INT,                                  and
       AREA_ALONG_OEB_MIN, respectively.

The analyst may use one or a combination of both parameter types to best represent the total
cross-sectional area profile of the space object to be used in drag, lift, and SRP force
estimates. The total cross-sectional area observed when viewed from an arbitrary unit-vector
direction [x y z] could be:

TOTAL_AREA = DRAG_CONST_AREA +
 AREA_ALONG_OEB_MAX           �
                              𝑥
� AREA_ALONG_OEB_INT � ∙ [𝑀] �𝑦�
 AREA_ALONG_OEB_MIN           𝑧 𝑂𝑂𝑂_𝑃𝑃𝑃𝑃𝑃𝑃_𝐹𝐹𝐹𝐹𝐹

For example, to model drag forces, a two-meter diameter spherical space object would be
best modeled as a constant area (DRAG_CONST_AREA=3.1415m2) with all three
AREA_ALONG_OEB parameters defaulting to zero. Conversely, a ten-meter long, 10 cm
box-cross section gravity gradient boom would best be modeled by leaving
DRAG_CONST_AREA defaulting to zero and setting AREA_ALONG_OEB_MAX =
AREA_ALONG_OEB_INT = 1 m2 and AREA_ALONG_OEB_MIN = 0.01 m2. Finally, one can
model a sphere encircling the gravity gradient boom’s centroid using a combination of these
approaches by setting DRAG_CONST_AREA = 3.1415m2, AREA_ALONG_OEB_MAX =
AREA_ALONG_OEB_INT = 1 m2 and AREA_ALONG_OEB_MIN = 0.01 m2.

As a second example, when modeling SRP forces, it should be noted that many GEO
spacecraft have very large solar arrays that dominate the total cross-sectional surface of the
spacecraft. Importantly, these solar arrays are designed to remain as normal to the Sun as
possible irrespective of current spacecraft bus orientation. As such, the cross-sectional area
of these arrays is best portrayed in the OCM by setting SRP_CONST_AREA to the
combined solar array surface area as observed along the Sun viewing vector, and the
remaining bus cross-sectional areas can be set using the three attitude-dependent
AREA_ALONG_OEB parameters.

F2   APPARENT-TO-ABSOLUTE VISUAL MAGNITUDE RELATIONSHIP

This section of the informative technical annex presents the relationships to be used to map
apparent to absolute visual magnitude for inclusion in an OCM. These equations, based on
reference [H8], examine signal magnitude for reflected illumination by a Resident Space
Object (RSO) that is exoatmospheric, meaning that its illumination by the Sun is not reduced
or impeded by atmospheric transmission losses. The equations do not account for spatial
distribution across multiple detectors, which involves characterizing the Point Spread
Function of the system.

Definitions:

 𝐴 𝑇𝑇𝑇𝑇𝑇𝑇          Effective area of the target [𝑚2 ].
                                                                                2
 𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸 The point source irradiance reaching the sensor aperture [W/m ].

    𝑑𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆     Distance from the sun to the target [m] (e.g., 1 AU = 1.4959787066 ×
                        1011 𝑚).
    𝑑 𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇 Distance from target to sensor [𝑚].
    𝑑𝑑𝑑 𝑇𝑇𝑇𝑇𝑇𝑇       Effective diameter of the target, [𝑚].
    𝐸𝑆𝑆𝑆             Exoatmospheric solar irradiance, nominally 1380 [𝑊�𝑚2 ] at 1 AU.
    𝐸𝑇𝑇𝑇𝑇𝑇𝑇          Target Irradiance at Sensor without atmospheric loss [W/m2].
    𝐸0               Ref. Visual Magnitude (Vega) Irradiance
                     [2.77894× 10−8 𝑊�𝑚2 ].
    𝐹                General shadowing term accounting for the penumbra region’s influence
                        [unitless, 0 ≤ F ≤1, 0 = umbra, and 1 = full Sun illumination].
    𝐼𝑆𝑆𝑆             Solar Intensity ≈ 3.088374161 × 1025 [𝑊/𝑠𝑠].
    𝐼𝑇𝑇𝑇𝑇𝑇𝑇          Intensity of reflected energy from target treated as a point source [W/sr].
    𝑃ℎ𝑎𝑎𝑎(φ)         Geometric reflectance phase function [unitless, 0 < 𝑃ℎ𝑎𝑎𝑎(φ) ≤1].
    φ                Critical Angle to the Sun (CATS) from sun to the sensor, as shown in
                        figure F-2 and referenced to the observed target [rad].
    𝜋                Pi constant.
    𝜌                Reflectance of the target [between 0 (none) and 1 (perfect reflectance)].
    𝜏𝐴𝐴𝐴𝐴𝐴𝐴ℎ𝑒𝑒𝑒      Effective transmission of the atmosphere [unitless, 0 < τ ≤ 1].

Given an optical sensor’s measured target entrance aperture radiance:
            𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸𝐸
𝐸𝑡𝑡𝑡𝑡𝑡𝑡 =
              𝜏𝐴𝐴𝐴𝐴𝐴𝐴ℎ𝑒𝑒𝑒
                                [W/m2]

                                 𝐸𝑡𝑡𝑡𝑡𝑡𝑡
𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎 = −2.5 log10                    , measured on the visual magnitude scale
                                   𝐸0

                                                         𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎
                                                    �−              �
or if 𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎 known: 𝐸𝑡𝑡𝑡𝑡𝑡𝑡 = 𝐸0 10                      2.5

                   2
𝐼𝑡𝑡𝑡𝑡𝑡𝑡 = 𝐸𝑡𝑡𝑡𝑡𝑡𝑡 𝑑𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇𝑇 [W]

                         [W/m2]
              𝐼𝑆𝑆𝑆
𝐸𝑆𝑆𝑆 =     2
          𝑑𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆𝑆

                                                   𝑠𝑠𝑠 𝜑 + (𝜋 − 𝜑) 𝑐𝑐𝑐 𝜑
                                  𝑃ℎ𝑎𝑎𝑎(𝜑) =
                                                             𝜋
                   𝜋 𝐼𝑇𝑇𝑇𝑇𝑇𝑇
𝐴 𝑇𝑇𝑇𝑇𝑇𝑇 =
             𝜌 𝐹 𝐸𝑆𝑆𝑆 𝑃ℎ𝑎𝑎𝑎(𝜑)
                                  [m2]

NOTES

1         𝐴 𝑇𝑇𝑇𝑇𝑇𝑇 is undefined in umbra (F=0=darkness), or no reflection (𝜌 = 0).

2        If reflectance is unknown, one may assume a standard reference reflectance of fifteen
         percent]

From which an effective diameter of the physical object can be roughly approximated as:

                                                        4 𝐴 𝑇𝑇𝑇𝑇𝑇𝑇
                                       𝑑𝑑𝑑 𝑇𝑇𝑇𝑇𝑇𝑇 ≈ �
                                                            𝜋

From the above equations, 𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎 ‘normalized’ to a 1 AU Sun-to-target distance, a phase
angle of 0° and an example reference 40,000 km target-to-sensor distance (equivalent to a
GEO satellite tracked at 15.6° elevation above the optical site’s local horizon), is obtained as:
                            𝐸𝑡𝑡𝑡𝑡𝑡𝑡
𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎 = −2.5 log10 �             � , from which:
                              𝐸0

                            �𝐸𝑆𝑆𝑆 1 𝐴𝐴 =1380 𝑊� 2 � [𝑃ℎ𝑎𝑎𝑎(0 𝑟𝑟𝑟)=1.0 ]� 𝜌 𝐴𝑇𝑇𝑇𝑇𝑇𝑇 𝑓𝑓𝑓𝑓 𝑎𝑎𝑎𝑎𝑎, 𝑖𝑖 𝑚2 �
                                                𝑚
𝑉𝑉𝑎𝑎𝑎𝑎𝑎𝑎𝑎𝑎 = −2.5 log10 �                                                                              �
                                          𝜋 �𝐸0 = 2.77894×10−8 𝑊� 2 �[(40,000,0002 ) 𝑚2 ]
                                                                   𝑚

                  CATS angle 𝜑

           Figure F-2:     Depiction of Optical Viewing CATS Angle Geometry

F3   MANEUVER AND DUTY CYCLE DIAGRAMS

This section of the informative technical annex defines time-based and phase-angle-based
duty cycle parameters.

A ‘duty cycle’ is a cycle of thruster operation that operates intermittently rather than
continuously, having an ‘on’ interval followed by an ‘off’ interval.

Time-based duty cycle parameters
Time-based duty cycle parameters define a window of duty cycle operations, the actual
execution interval and ‘ON’ and ‘OFF’ intervals, as shown in figure F-3.

        Figure F-3: Diagram of Time-based Duty Cycle (DC_TYPE = ‘TIME’)

Angle-based duty cycle parameters
Angle-based duty cycle parameters also define a window of duty cycle operations and actual
execution interval and ‘ON’ and ‘OFF’ intervals, but in this case the ‘ON’ and ‘OFF’
intervals are triggered by angular limits as shown in figure F-4.

  Figure F-4: Diagram of a Rotating Spacecraft Body’s Progression through an Inertial
              Clock Angle-based Duty Cycle (DC_TYPE = ‘TIME_AND_ANGLE’)

F4   ORBIT DETERMINATION GENERALIZED DILUTION OF PRECISION
     (GDOP) FORMULATION

This section of the informative technical annex defines the Generalized Dilution of Precision
(GDoP) formulation used in the orbit determination section of the OCM.

As described in reference [H16], GDoP provides a method to assess the navigation
performance over a time-integrated orbit solution. GDoP broadens the DoP concept from the
more common instantaneous geometric or kinematic solution of multiple transmit sources at
one time to a scenario associated with a receiver that can integrate metric range and/or
Doppler (or range-rate) measurements over time, potentially from different transmit sources,
to estimate the user’s orbital position and velocity state. It is defined as a function of the sum
of information matrices to obtain an observability grammian associated with a set of metric
tracking measurements collected over time.

The following equation for GDoP represents the uncertainty of an orbit state estimate as
observed over time.

                                                     𝑡𝑛           −1

                                              �0𝑇 𝑊𝐻
                         𝐺𝐺𝐺𝐺 = �max �𝑒𝑒𝑒 ��� 𝐻    �0 � ��
                                                     𝑡0

Where 𝐻� is the measurement matrix modeled in the state estimate at the update time (i.e., the
product of the observation and state transition matrices such that 𝐻 � = 𝐻 ∙ Φ), and W is a
diagonal matrix of relative weights that represents the accuracy of the measurements.
�0𝑇 𝑊𝐻
𝐻    �0 represents the information matrix, the inverse of which is the covariance matrix. By
summing over time, one obtains an estimate of the state uncertainty from the time-derived
measurement set.

F5     EULER AXIS/ANGLE INTERPOLATION

The Euler Axis and Angle representation of Euler’s Theorem (see reference [H17] 10–14) is
an effective way to interpolate a series of covariance matrices, reference frames or
maneuvers, thrust, or acceleration vector directions.

Interpolation of a series of three-dimensional vectors:
As presented in reference [H17], and consistent with the nomenclature of reference [H1]
where 𝑒1 , 𝑒2 , and 𝑒3 represent the three vector components of axis of rotation �𝑒 and 𝜑
represents the angle of rotation, a time-based interpolation of adjacent unit vectors 𝑣�𝐴 and 𝑣�𝐵
in a reference frame can be undertaken as:
                                                            𝑣� ×𝑣�
     a) The axis of rotation 𝑒̂ can be obtained as: 𝑒̂ = |𝑣�𝐵 � 𝐴 |;
                                                             𝐵 ×𝑣𝐴

                                                                                (𝑡−𝑡1 ) cos−1 (𝑣�𝐴 ∙𝑣�𝐵 )
     b) Assuming a constant rotational rate during this interval, 𝜑(𝑡) =               (𝑡2 −𝑡1 )
                                                                                                            ;

     c) The orthonormal rotation matrix [𝑀(𝑡)] is then:

       (1 − cos 𝜑)𝑒̂𝒙 2 + cos 𝜑       (1 − cos 𝜑)𝑒̂𝒙 𝑒̂𝒚 + 𝑒̂𝒛 sin 𝜑   (1 − cos 𝜑)𝑒̂𝒙 𝑒̂𝒛 − 𝑒̂𝒚 sin 𝜑
                                                       2
= �(1 − cos 𝜑)𝑒̂𝒚 𝑒̂𝒙 − 𝑒̂𝒛 sin 𝜑      (1 − cos 𝜑)𝑒̂𝒚 + cos 𝜑          (1 − cos 𝜑)𝑒̂𝒚 𝑒̂𝒛 + 𝑒̂𝒙 sin 𝜑�;
     (1 − cos 𝜑)𝑒̂𝒛 𝑒̂𝒙 + 𝑒̂𝒚 sin 𝜑   (1 − cos 𝜑)𝑒̂𝒛 𝑒̂𝒚 − 𝑒̂𝒙 sin 𝜑    (1 − cos 𝜑)𝑒̂𝒛 2 + cos 𝜑

     d) From which the interpolated vector at time t is then v� (t) = [M(t)]v� A ;
     e) The accompanying vector magnitudes (e.g., eigenvalues or thrust or acceleration
        magnitudes) may be interpolated using Lagrange polynomials or linear expressions.

Interpolation of a series of reference (or covariance eigenvector) frames:
The eigenvector matrix [𝐸(𝑡)] contains the row-wise storage of the major, intermediate, and
minor eigenvectors at time t, taking care to ensure that this ordered ‘triad’ of vectors adheres
to the righthand rule. When interpolating between two eigenvector matrices [𝐸1 ] 𝑎𝑎𝑎 [𝐸2 ],
derived from two adjacent covariance matrices, respectively, [𝐸(𝑡)] can be evaluated as:
     a) The rotation occurring between [𝐸1 ] 𝑎𝑎𝑎 [𝐸2 ] is: [𝑀𝐵𝐵 ] = [𝐸2 ][𝐸1 ]𝑇 ;

     b) Compute 𝜎 = �𝑀𝐵𝐵11 + 𝑀𝐵𝐵 22 + 𝑀𝐵𝐵 33 �;

                                                                           1
     c) The angle of rotation from A to B is: 𝜑𝐵𝐵 = cos−1 � (𝜎 − 1)�;
                                                                           2

     d) Exercising caution to accommodate nonunique cases (when sin 𝜑 = 0) as described
        in reference [H17], the axis of rotation
              �𝑀𝐵𝐵 23 −𝑀𝐵𝐵 32 �   �𝑀𝐵𝐵 31 −𝑀𝐵𝐵 13 �   �𝑀𝐵𝐵 12 −𝑀𝐵𝐵 21 �
        𝑒̂ = �                                                             �;
                   2 sin 𝜑             2 sin 𝜑             2 sin 𝜑

                                                        (𝑡 − 𝑡1 )𝜑𝐵𝐵
     e) The angle of rotation at time t is 𝜑(𝑡) =         (𝑡2 − 𝑡1 )
                                                                       ;

     f) [𝑀(𝑡)] can be computed using the above expression in step (3);
     g) And finally, the eigenvector matrix [𝐸(𝑡)] = [𝑀(𝑡)][𝐸1 ];
     h) When interpolating a series of covariance matrices, the accompanying eigenvalues
        may be interpolated using Lagrange polynomials or linear expressions.

F6    REGULAR EXPRESSIONS FOR VALIDATION AND INGEST OF ODMS

To accomplish validation and ingest of KVN versions of the ODM, the use of Regular
Expressions (referred to as ‘Regex’) is strongly encouraged whenever possible. Regex offers
a detailed and rigorous way to ensure proper validation, interpretation, and conformace to
Orbit Data Message content. Most programming languages support the Regex feature,
including C#, C++, Delphi, HTML5, Java and Javascript, MySQL, Oracle, PCRE, Perl, PHP,
PowerShell, Python, R, Ruby, Scala, TCL, VBscript, Visual Basic, and XML Schema.

While these RegEx sequences can provide a good level of validation of the entries, the reader
is cautioned that using them on a long series of orbit or covariance data can be very
inefficient and slow. RegEx sequences are best utilized on individual values such as
Keyword = SingleValue.

Sample Regular Expression for ‘Keyword = CCSDS Date/Time Format’
The CCSDS Timecode format specified in 7.5.10 provides a convenient illustration of the
power of using regular expressions. The color-coded Regex string below may be used to
readily match any general ODM KVN line that sets a KVN keyword to a Timecode value.
The group naming capability (color-coded in green below) inherent in Regex is particularly
useful, by which the keyword, year, month, day, hour, minute, and second can be readily
extracted and processed. As shown in figure F-5, this Regex sequence enforces the
requirement that KVN keywords must be uppercase and can only consist of letters A-Z,
digits 0-9, or underscores. It should be noted that in this expression, the optional inclusion by
the message creator of one or more white space characters with the ‘(\s*)?’ sequences allow
for maximum flexibility while still retaining a rigorous validation.

NOTE – In some languages, ‘^’ and ‘$’ matching at string line breaks must explicitly be
       enabled to process a string containing a series of lines of the message.

^(?:\s*)?(?<keyword>[0-9A-
Z_]*)(?:\s*)?=(?:\s*)?(?<yr>(?:\d{4}))-(?<mo>(?:\d{1,2}))-
(?<dy>(?:\d{1,2}))T(?<hr>(?:\d{1,2})):(?<mn>(?:\d{1,2})):(?<sc>
(?:\d{0,2}(?:\.\d*)?))(?:\s*)?$

                    Figure F-5: Regex Pattern for CCSDS Timecode

Regex Pattern Matching Sequence:
Applying the above CCSDS Timecode Regex to a file containing the string
‘CREATION_DATE = 2020-09-13T00:09:47.059345’ as an example, figure F-6 illustrates
how this Regex expression is used to rigorously validate and match the string and identify the
specified group names.

        Figure F-6: Regex Pattern Matching Sequence for CCSDS Timecode

Sample Regular Expression for ‘Keyword = NonDecimalString’
Another common and useful Regex addresses the setting of keywords to a free-text string.
Consistent with requirements for KVN values as specified in 7.5, the Regex shown in
figure F-7 matches this sequence.

^(?:\s*)(?<keyword>[0-9A-Z_]*)(?:\s*)=(?:\s*)(?<value>(?:(?:[0-
9A-Z_\- ]*)|(?:[0-9a-z_\- ]*)))(?:\s*)$

                       Figure F-7: Regex for a Non-Decimal String

Sample Regular Expression for ‘Keyword = FreeTextString’
Free-text strings that are contain exclusively uppercase or lowercase alphabetical characters,
numbers, and/or the decimal point, hyphen, space or underscore characters may be matched
as follows. It should be noted that the inclusion of a decimal point in this Regex sequence
means that numerical KVN values can be matched with potentially unintended consequences;
numbers should be specifically matched as a number (as shown below). Consistent with
requirements for KVN values as specified in 7.5, the Regex shown in figure F-8 matches this
sequence.

^(?:\s*)(?<keyword>[0-9A-Z_]*)(?:\s*)=(?:\s*)(?<value>(?:(?:[0-
9A-Z_\.\- ]*)|(?:[0-9a-z_\.\- ]*)))(?:\s*)$

                         Figure F-8: Regex for Free-Text String

Sample Regular Expression for ‘Keyword = CCSDS Numerical Value with
optional units’
Consistent with the requirements set forth in 7.5.4 through 7.5.7, KVN values that are
integers or non-integer fixed or floating-point numbers may be matched with the Regex
sequence provided in figure F-9, with named groups ‘keyword’, ‘value’, and ‘units’ set
accordingly:

^(?:\s*)(?<keyword>[0-9A-Za-z_]*)(?:\s*)=(?:\s*)(?<value>(?:[-
+]?)(?:[0-9]+)(?:\.\d*)?(?:[eE][+-
]?(?:\d+))?)(?:(?:\s*)(?:\[(?<unit>[0-9A-Za-
z/_*]*)\]?))?(?:\s*)?$

    Figure F-9: Regex for String Containing Numerical Value with Optional Units

Sample Regular Expression for ‘Keyword = Multipartite CCSDS
Numerical Values’
For orbit, covariance, and/or maneuver lines providing a multipartite sequence of numerical
values, the Regex pattern provided in figure F-10 may be used (in this example, to capture
and set value1, value2, and value3 for a 3-element set of numbers):

^(?:\s*)(?<value1>(?:[-+]?)(?:[0-9]*)(?:\.\d*)?(?:[eE][+-
]?\d+)?)(?:\s+)(?<value2>(?:[-+]?)(?:[0-
9]*)(?:\.\d*)?(?:[eE][+-]?\d+)?)(?:\s+)(?<value3>(?:[-
+]?)(?:[0-9]*)(?:\.\d*)?(?:[eE][+-]?\d+)?)(?:\s*)$

     Figure F-10: Regex for String Containing Numerical Value with Optional Units

F7    SPECIFIC ENERGY DISSIPATION RATE (SEDR) FORMULATION

An orbit’s Specific Energy Dissipation Rate (SEDR) represents the amount of energy (W/kg)
being removed from a satellite’s orbit by atmospheric drag. It is a very useful metric for
characterizing satellites since it accounts for both the drag environment (atmospheric density)
and the ‘area to mass ratio’ of the specific object. It does this by including drag acceleration
in the computation. Drag acceleration is proportional to atmospheric density and to satellite
area to mass.

SEDR is computed as follows:

       Instantaneous SEDR at time t is given by
                              
                SEDR(t ) = − A • V        D

       where,
                       = drag acceleration vector (inertial)
                
                A   D

                V = velocity vector (inertial)
       Average SEDR over the orbit determination interval is given by
                        T
                1
                T ∫0
                     SEDR(t )dt

       where, to correctly average over a complete orbital revolution, T is an integer
       multiple of the satellite period. This consideration is primarily for eccentric orbits.
       Aside from this consideration, T is the orbit determination interval.

F8     ORBIT DETERMINATION PARAMETERS

F8.1    GENERAL

Satellite Orbit Determination (OD) estimates the position and velocity of an orbiting object
from discrete observations (for greater detail, see reference [H7]). The set of observations
includes external measurements from terrestrial or space-based sensors and measurements
from instruments on the satellite itself. Satellite orbit propagation estimates the future state of
motion of a satellite whose orbit has been determined from past observations. Though a
satellite’s motion is described by a set of ideal equations of motion representing physical
hypotheses, the observations used in OD are subject to systematic and random uncertainties.
Therefore OD and propagation are probabilistic and can only approximately describe the
satellite’s motion. The degree of approximation that can be tolerated depends on the intended
use of the orbital information.

Satellite owners/operators employ different techniques to determine orbits from active and
passive observations, such that the same data inputs lead to different predictions when they
are used in different models. Satellite owners/operators often accept orbit descriptions
developed using physical models that others employ. Differences in orbit predictions caused
using different physical models and numerical techniques can be significant.

A spacecraft is influenced by a variety of external forces, including terrestrial gravity,
atmospheric drag, multibody gravitation, solar radiation pressure, tides, and spacecraft
thrusters. Selection of forces for modelling depends on the accuracy and precision required
by the OD process and the amount of available data. The complex modelling of these forces
results in a highly nonlinear set of dynamical equations. Many physical and computational
uncertainties limit the accuracy and precision of the spacecraft state that can be determined.
Similarly, the observational data are inherently nonlinear with respect to the state of motion
of the spacecraft, and some influences might not have been included in models of the
observation of the state of motion.

Satellite OD and propagation are stochastic estimation problems because observations are
inherently noisy and uncertain and because not all phenomena that influence satellite motion
are clearly discernible. Estimation is the process of extracting a desired time-varying signal
from statistically noisy observations accumulated over time. Estimation encompasses data
smoothing, which is statistical inference from past observations; filtering, which infers the
signal from past observations and current observations; and prediction or propagation, which
employs past and current observations to infer the future of the signal.

F8.2    INITIAL OD

Initial OD (IOD) methods input tracking measurements with tracking platform locations, and
output spacecraft position and velocity estimates. No a priori orbit estimate is required.
Associated solution error magnitudes can be very large. IOD methods are sometimes
nonlinear methods and are often trivial to implement. Measurement editing is typically not
performed during IOD calculations because there are insufficient observations.

Operationally, the OD process is frequently begun, or restarted, with IOD. IOD methods
were derived by various authors: LaPlace, Poincaré, Gauss, Lagrange, Lambert, Gibbs,
Herrick, Williams, Stumpp, Lancaster, Blanchard, Gooding, and Smith. Restarting
techniques are most easily accomplished by using a solution from another technique.

F8.3     METHODS FOR SUBSEQUENT OD

F8.3.1    Least Squares Differential Correction

Least Squares (LS) methods input tracking measurements with tracking platform locations
and an a priori orbit estimate and output a refined orbit estimate. Associated solution error
magnitudes are small when compared to IOD outputs. LS methods consist of an iterative
sequence of corrections where sequence convergence is defined as a function of tracking
measurement residual Root Mean Square (RMS). Each correction is characterized by a
minimization of the sum of squares of tracking measurement residuals. The LS method was
derived first by Gauss in 1795 and then independently by Legendre.

F8.3.2    Sequential Processing

Sequential Processing (SP) methods are distinguished from LS processing methods in that
batches of data are considered sequentially, collecting a set of observations over a specified
time interval and batch-processing one interval after the next. SP can be thought of as a
moving time window whose contents are captured and processed at intervals, independent of
previously processed batches of data. The analysis does not include process noise inputs and
calculations. It is in no way equivalent to filter processing, in which each new observation is
added to past observations, improving estimates in a rigorous, traceable manner.

F8.3.3    Filter Processing

Filter methods output refined state estimates sequentially at each observation time. Filter
methods are forward-time recursive sequential methods consisting of a repeating pattern of
time updates of the state of motion estimate and measurement updates of the state of motion
estimate. The filter time update propagates the state estimate forward, and the filter
measurement update incorporates the next measurement. The recursive pattern includes an
important interval of filter initialization. Filter-smoother methods are backward-time
recursive sequential methods consisting of a repeating pattern of state estimate refinement
using filter outputs and backwards transition. Time transitions for both filter and smoother
are dominated most significantly by numerical orbit propagators. The search for sequential
processing was begun by Wiener, Kalman, Bucy, and others.

F8.4     REQUIRED INFORMATION FOR ORBIT DETERMINATION

F8.4.1     Observations

When observation data are communicated for collaborative or independent determination of
satellite orbits, it is important to convey the observation types upon which that information is
based. Ground-based, airborne, and space-based sensor observations are routinely used in
orbit determination. These are conveyed in the CCSDS navigation family of messages using
the TDM (reference [9]). Many of these parameters are discussed in greater detail in
reference [H7].

The following table describes some of the various observation types and sources.

              Table F-1: Space Surveillance Observation Product Description

              Content                                                Source
 two angles and slant range                Radars
 two angles                                Baker-Nunn cameras, telescopes, binoculars, visual
                                           sightings
 Azimuth                                   Direction finders, radio antenna, Radio telescope
 Time of closest approach                  Radars, radio receivers [for transmitting (Doppler)
                                           satellites], relay satellite
 Range, angles, and rates                  Radars, radio antenna, radio telescope
 Pseudorange and carrier phase, as         GPS or onboard inertial sensors
 well as single, double, and triple
 differences of these basic
 measurement types
 Direction cosines                         Interferometric radars

F8.4.2     Observation Location Information

When data are communicated for collaborative or independent determination of satellite
orbits, the following information about the observation location and measuring devices is
important:
   –     facility location latitude, longitude, altitude, and the reference from which such are
         measured, (e.g., WGS-84);
   –     calibration/correction values associated with the ground path;
   –     tracking station identification (ID);
   –     elevation cutoff;
   –     measurement biases;
   –     clock and/or almanac information.

F8.4.3     Satellite Information

When performing OD using active transponder ranging, the transponder delay must be
provided.

F8.4.4     Estimation Parameters and Control

When data are communicated for collaborative or independent determination of satellite
orbits, the following information about estimation parameters and control are necessary, as
described in 6.2.10:
   –     estimation parameters;
   –     global force model controls;
   –     integration controls;
   –     database controls;
   –     observation uncertainties.

F8.4.5     Force Model Settings

F8.4.5.1    General

Spacecraft are affected by conservative and non-conservative forces. Non-conservative
phenomena dissipate spacecraft energy, for example by doing work on and heating the
atmosphere, as described in 6.2.9.

F8.4.5.2    Gravity

Central body gravitational fields are typically described using terms of a Jacobi polynomial
expansion of finite order and degree. Jacobi polynomials are a complete, orthonormal set
over the unit sphere. There are two angular degrees of freedom, equivalent to latitude and
longitude. Any analytic function within that space can be represented by a weighted doubly
infinite series of Jacobi polynomials.

Two-body motion or Keplerian motion considers only the point-mass gravity of the
attracting body. Both the spacecraft and the central body are considered point masses, with
all mass concentrated at their centres of mass. This is the lowest-order zonal harmonic
approximation.

A J2 zonal perturbation (first order) accounts for secular (constant rate over time)
variations in the orbit elements due to central body oblateness, mainly nodal precession and
rotation of the semi-major axis of orbit elements that are otherwise those of unperturbed,
Newtonian orbits. J2 is a zonal harmonic coefficient in an infinite Jacobi polynomial series

representation of the central body’s gravity field. The even zonal harmonic coefficients of the
gravity field are the only coefficients that result in secular changes in satellite orbital
elements. The J2 propagator includes only the dominant first-order secular effects.

For generalized spherical harmonics, it is impractical to determine the weights
(coefficients) for a mathematically complete Jacobi polynomial series representation;
therefore the series is truncated at meaningful (in terms of precision of the representation of
the gravity field) order (latitudinal) and degree (longitudinal). Whenever practical, it is
recommended to use the full degree and order of the determined spherical harmonics field, as
further truncation leads to introduction of non-conservative forces and deviation from the
intended fidelity of the gravitational model.

If the order and degree are equal, the truncation is ‘square’. Since gravitational and other
perturbations are not necessarily symmetrical in latitude and longitude, the best
approximation for a given application is not necessarily square. The GRAVITY_MODEL
keyword in 6.2.9 can specify (independently) the degree and order that are used.

Static elements of the gravity field are the gravitation of the fixed portions of the distribution
of the Earth’s mass. The static gravity field is not uniform. Dynamic elements of the gravity
are caused by the fluid elements of the Earth’s core and by variations in the distribution of
water. There are solid and ocean tides.                  The OCEAN_TIDES_MODEL and
SOLID_TIDES_MODEL of 6.2.9 can be used to specify these settings.

Multibody gravitation: Certain phenomena only exist with more than two gravitationally
interacting bodies. It is therefore important to describe information about third-body or
multiple-body    gravitational    interactions   if   such    are   considered.       The
N_BODY_PERTURBATIONS keyword in 6.2.9 is used to specify which bodies were
modelled.

F8.4.5.3     Atmospheric Resistance (‘Drag’)

F8.4.5.3.1    General

Gas-dynamic resistance can be a significant dissipative force in low altitude orbits about any
body with a significant atmosphere, for example, Earth (LEOs), Venus, and Mars. It is
usually sufficient to represent it as aerodynamic drag, the product of dynamic pressure,
aggregated drag coefficient, and cross-sectional area.

F8.4.5.3.2    Drag Coefficient

Drag coefficient depends upon satellite geometry, orientation, and gas-dynamic regime
described by Knudsen number (ratio of object characteristic dimension to gas mean free path)
and Mach number (ratio of object speed to acoustic propagation speed). When describing
how atmospheric resistance is represented, data providers provide the value of drag
coefficient employed using the keyword in 6.2.9.

F8.4.5.3.3    Atmospheric Density Model

Density within the Earth’s atmosphere varies temporally and spatially. Those variations are
important in LEO. Some acceptable and most-often used atmospheric density models are as
follows (although many may be utilized, as specified by the ATMOSPHERIC_MODEL
keyword in 6.2.9):
   –   1976 Standard Harris-Priester;
   –   Jacchia 1970 and 1971;
   –   Jaccia-Roberts;
   –   Mass-Spectrometer-Incoherent-Scatter (MSIS) model, in several versions and extensions;
   –   Mars Global Reference Atmosphere Model (MARSGRAM);
   –   Venus Global Reference Atmosphere Model (VENUSGRAM).

These models typically require measurable input parameters that are ‘proxies’ for the
variation of atmospheric parameters. These include solar flux/geomagnetic particle flux,
which can be inferred from the meteorological observables as set by the keyword
SW_DATA_SOURCE or FIXED_YYYYY of 6.2.9:
   –   daily F10.7;
   –   average F10.7; and
   –   geomagnetic index.

F8.4.5.4     Radiation Pressure

Momentum transfer from photons to satellites can be an important force for High Earth Orbits
(HEOs), cislunar trajectories, and interplanetary trajectories. For solar sail missions, such
radiation pressure is likely the primary source of propulsion. Radiation pressure depends on the
area and surface characteristics of the satellite and the nature of the incident radiative fluxes.
The Sun is the predominant direct source of electromagnetic radiation, but the Earth and the
Moon also emit and reflect electromagnetic radiation. The keywords provided in 6.2.9
(SHADOW_BODIES, SRP_MODEL, ALBEDO_MODEL, ALBEDO_GRID_SIZE) allow the
user to specify radiation pressure settings used in the OD and orbit propagation regarding:
   –   solar radiation pressure coefficient;
   –   area-to-mass ratio;
   –   satellite reflectivity;
   –   shadow and shape factor models;
   –   eclipse models (cylindrical, dual-cone);
   –   albedo and intensity at the satellite.

F8.4.6   Orbit Propagation

Orbit propagation or prediction has evolved synchronously with advances in computational
capability. Initially, force models were greatly simplified, and most important non-
gravitational forces were approximated analytically. These generally linearized approaches
were valid only over short intervals or for small variations from two-body Keplerian motion.

Even when more precise numerical integration became feasible, execution times were often
too long, and computation was too expensive to employ numerical integration on a regular
basis. Semi-analytical techniques emerged that reduced numerical complexity and
maintained run speed efficiency (with some compromise to precision) by providing formulae
from which significant elements of the propagation workflow could be extracted.

Purely numerical integration of force models (i.e., not employing singly or doubly averaged
physical approximations to describe important physical phenomena) are degraded primarily
to the numerical phenomena degradation common to all discrete computations.

Analytical, numerical, and semi-analytical orbit propagation techniques are all known as
‘orbit propagators’.

F8.4.7   Orbit Elements

Orbit elements are the sets of parameters that emerge from the smoothing, filtering, or
predictive estimation schemes. Six independent quantities and orbit elements describe the
orbit of a satellite. A seventh variable designates the satellite position at a specific time of
interest (epoch). There are many different sets of orbit elements (see orbit element set type;
selected per annex B, subsection B7). Each is best suited for a particular application, such as
aiming antennas, ease of manipulation in various coordinate systems, or estimating orbits
from different types of measurements.

The traditionally used set of orbital elements is called the set of Keplerian elements.
Keplerian elements parameters can be encoded as text in several formats. In semi-analytical
propagation, mean orbit elements are often used; the most common of them is as conveyed in
the NASA/NORAD TLE format, originally designed for use with 80-column punched cards
(but still in use because it is the most common format).

# ANNEX G

                                  ODM EXAMPLES

                                   (INFORMATIVE)

G1   OVERVIEW

The following are examples of OPMs.

G2   OPM EXAMPLES IN KVN

The following figures are examples of OPMs in KVN format. The first has only a state; the
second has state, Keplerian elements, and maneuvers; and the third and fourth include the
position/velocity covariance matrix.

       CCSDS_OPM_VERS = 3.0
       CREATION_DATE = 2022-11-06T09:23:57
       ORIGINATOR     = JAXA

       COMMENT          GEOCENTRIC, CARTESIAN, EARTH FIXED
       OBJECT_NAME    = OSPREY 5
       OBJECT_ID      = 1998-999A
       CENTER_NAME    = EARTH
       REF_FRAME      = ITRF2000
       TIME_SYSTEM    = UTC

       EPOCH =           2022-12-18T14:28:15.1172
       X =               6503.514000
       Y =               1239.647000
       Z =               -717.490000
       X_DOT =             -0.873160
       Y_DOT =              8.740420
       Z_DOT =             -4.191076
       MASS =            3000.000000
       SOLAR_RAD_AREA =    18.770000
       SOLAR_RAD_COEFF =    1.000000
       DRAG_AREA =         18.770000
       DRAG_COEFF =         2.500000

                         Figure G-1: Simple OPM File Example

           CCSDS_OPM_VERS     =   3.0

           COMMENT   Generated by GSOC, R. Kiehling
           COMMENT   Current intermediate orbit IO2 and maneuver planning data

           CREATION_DATE      =   2021-06-03T05:33:00.000
           ORIGINATOR         =   GSOC

           OBJECT_NAME        =   EUTELSAT W4
           OBJECT_ID          =   2021-028A
           CENTER_NAME        =   EARTH
           REF_FRAME          =   TOD
           TIME_SYSTEM        =   UTC

           COMMENT   State Vector
           EPOCH              = 2021-06-03T00:00:00.000
           X                  =   6655.9942        [km]
           Y                  = -40218.5751        [km]
           Z                  =    -82.9177        [km]
           X_DOT              =      3.11548208    [km/s]
           Y_DOT              =      0.47042605    [km/s]
           Z_DOT              =     -0.00101495    [km/s]

           COMMENT Keplerian elements
           SEMI_MAJOR_AXIS   =  41399.5123            [km]
           ECCENTRICITY      =      0.020842611
           INCLINATION       =      0.117746          [deg]
           RA_OF_ASC_NODE    =     17.604721          [deg]
           ARG_OF_PERICENTER =    218.242943          [deg]
           TRUE_ANOMALY      =     41.922339          [deg]
           GM                = 398600.4415            [km**3/s**2]

           COMMENT Spacecraft parameters
           MASS             =    1913.000             [kg]
           SOLAR_RAD_AREA   =      10.000             [m**2]
           SOLAR_RAD_COEFF  =       1.300
           DRAG_AREA        =      10.000             [m**2]
           DRAG_COEFF       =       2.300

           COMMENT   2 planned maneuvers

           COMMENT First maneuver: AMF-3
           COMMENT Non-impulsive, thrust direction fixed in inertial frame
           MAN_EPOCH_IGNITION =     2021-06-03T09:00:34.1
           MAN_DURATION      =    132.60          [s]
           MAN_DELTA_MASS    =    -18.418         [kg]
           MAN_REF_FRAME     =      EME2000
           MAN_DV_1          =     -0.02325700    [km/s]
           MAN_DV_2          =      0.01683160    [km/s]
           MAN_DV_3          =     -0.00893444    [km/s]

           COMMENT Second maneuver: first station acquisition maneuver
           COMMENT impulsive, thrust direction fixed in RTN frame
           MAN_EPOCH_IGNITION =     2021-06-05T18:59:21.0
           MAN_DURATION      =      0.00          [s]
           MAN_DELTA_MASS    =     -1.469         [kg]
           MAN_REF_FRAME     =      RTN
           MAN_DV_1          =      0.00101500    [km/s]
           MAN_DV_2          =     -0.00187300    [km/s]
           MAN_DV_3          =      0.00000000    [km/s]

 Figure G-2: OPM File Example with Optional Keplerian Elements and Two
             Maneuvers

      CCSDS_OPM_VERS = 3.0

      CREATION_DATE   = 2022-11-06T09:23:57
      ORIGINATOR      = JAXA
      MESSAGE_ID      = OPM 201113719185

      COMMENT           GEOCENTRIC, CARTESIAN, EARTH FIXED
      OBJECT_NAME     = OSPREY 5
      OBJECT_ID       = 2022-999A
      CENTER_NAME     = EARTH
      REF_FRAME       = ITRF1997
      TIME_SYSTEM     = UTC

      EPOCH =           2022-12-18T14:28:15.1172
      X =               6503.514000
      Y =               1239.647000
      Z =               -717.490000
      X_DOT =             -0.873160
      Y_DOT =              8.740420
      Z_DOT =             -4.191076

      MASS =            3000.000000
      SOLAR_RAD_AREA =    18.770000
      SOLAR_RAD_COEFF =    1.000000
      DRAG_AREA =         18.770000
      DRAG_COEFF =         2.500000

      CX_X = 3.331349476038534e-04
      CY_X = 4.618927349220216e-04
      CY_Y = 6.782421679971363e-04
      CZ_X = -3.070007847730449e-04
      CZ_Y = -4.221234189514228e-04
      CZ_Z = 3.231931992380369e-04
      CX_DOT_X = -3.349365033922630e-07
      CX_DOT_Y = -4.686084221046758e-07
      CX_DOT_Z = 2.484949578400095e-07
      CX_DOT_X_DOT = 4.296022805587290e-10
      CY_DOT_X = -2.211832501084875e-07
      CY_DOT_Y = -2.864186892102733e-07
      CY_DOT_Z = 1.798098699846038e-07
      CY_DOT_X_DOT = 2.608899201686016e-10
      CY_DOT_Y_DOT = 1.767514756338532e-10
      CZ_DOT_X = -3.041346050686871e-07
      CZ_DOT_Y = -4.989496988610662e-07
      CZ_DOT_Z = 3.540310904497689e-07
      CZ_DOT_X_DOT = 1.869263192954590e-10
      CZ_DOT_Y_DOT = 1.008862586240695e-10
      CZ_DOT_Z_DOT = 6.224444338635500e-10

                    Figure G-3: File Example with Covariance Matrix

           CCSDS_OPM_VERS    = 3.0
           COMMENT Generated by GSOC, R. Kiehling
           COMMENT Current intermediate orbit IO2 and maneuver planning data
           CREATION_DATE     = 2021-06-03T05:33:00.000
           ORIGINATOR        = GSOC
           OBJECT_NAME       = EUTELSAT W4
           OBJECT_ID         = 2021-028A
           CENTER_NAME       = EARTH
           REF_FRAME         = TOD
           TIME_SYSTEM       = UTC
           COMMENT State Vector
           EPOCH             = 2021-06-03T00:00:00.000
           X                 =    6655.9942       [km]
           Y                 = -40218.5751        [km]
           Z                 =     -82.9177       [km]
           X_DOT             =       3.11548208   [km/s]
           Y_DOT             =       0.47042605   [km/s]
           Z_DOT             =      -0.00101495   [km/s]
           COMMENT Keplerian elements
           SEMI_MAJOR_AXIS   =   41399.5123       [km]
           ECCENTRICITY      =       0.020842611
           INCLINATION       =       0.117746     [deg]
           RA_OF_ASC_NODE    =      17.604721     [deg]
           ARG_OF_PERICENTER =     218.242943     [deg]
           TRUE_ANOMALY      =      41.922339     [deg]
           GM                = 398600.4415        [km**3/s**2]
           COMMENT Spacecraft parameters
           MASS              =    1913.000        [kg]
           SOLAR_RAD_AREA    =      10.000        [m**2]
           SOLAR_RAD_COEFF   =       1.300
           DRAG_AREA         =      10.000        [m**2]
           DRAG_COEFF        =       2.300
           COV_REF_FRAME = RTN
           CX_X = 3.331349476038534e-04           [km**2]
           CY_X = 4.618927349220216e-04           [km**2]
           CY_Y = 6.782421679971363e-04           [km**2]
           CZ_X = -3.070007847730449e-04          [km**2]
           CZ_Y = -4.221234189514228e-04          [km**2]
           CZ_Z = 3.231931992380369e-04           [km**2]
           CX_DOT_X = -3.349365033922630e-07      [km**2/s]
           CX_DOT_Y = -4.686084221046758e-07      [km**2/s]
           CX_DOT_Z = 2.484949578400095e-07       [km**2/s]
           CX_DOT_X_DOT = 4.296022805587290e-10   [km**2/s**2]
           CY_DOT_X = -2.211832501084875e-07      [km**2/s]
           CY_DOT_Y = -2.864186892102733e-07      [km**2/s]
           CY_DOT_Z = 1.798098699846038e-07       [km**2/s]
           CY_DOT_X_DOT = 2.608899201686016e-10   [km**2/s**2]
           CY_DOT_Y_DOT = 1.767514756338532e-10   [km**2/s**2]
           CZ_DOT_X = -3.041346050686871e-07      [km**2/s]
           CZ_DOT_Y = -4.989496988610662e-07      [km**2/s]
           CZ_DOT_Z = 3.540310904497689e-07       [km**2/s]
           CZ_DOT_X_DOT = 1.869263192954590e-10   [km**2/s**2]
           CZ_DOT_Y_DOT = 1.008862586240695e-10   [km**2/s**2]
           CZ_DOT_Z_DOT = 6.224444338635500e-10   [km**2/s**2]
           USER_DEFINED_EARTH_MODEL = WGS-84

 Figure G-4: OPM File Example with Optional Keplerian Elements, Covariance
             Matrix, and a User-defined Parameter

G3   OPM EXAMPLE IN XML

Figure G-5 contains an example of an OPM in XML format.
<?xml version="1.0" encoding="UTF-8"?>
<opm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-
3.0.0-master-3.0.xsd"
      id="CCSDS_OPM_VERS" version="3.0">
  <header>
    <COMMENT>THIS IS AN XML VERSION OF THE OPM</COMMENT>
    <CLASSIFICATION>NONE</CLASSIFICATION>
    <CREATION_DATE>2022-11-06T09:23:57</CREATION_DATE>
    <ORIGINATOR>JAXA</ORIGINATOR>
    <MESSAGE_ID>OPM 201113719185</MESSAGE_ID>
  </header>
  <body>
    <segment>
       <metadata>
         <COMMENT>GEOCENTRIC, CARTESIAN, EARTH FIXED</COMMENT>
         <OBJECT_NAME>OSPREY 5</OBJECT_NAME>
         <OBJECT_ID>2022-999A</OBJECT_ID>
         <CENTER_NAME>EARTH</CENTER_NAME>
         <REF_FRAME>ITRF1997</REF_FRAME>
         <TIME_SYSTEM>UTC</TIME_SYSTEM>
       </metadata>
       <data>
         <stateVector>
           <EPOCH>2022-12-18T14:28:15.1172</EPOCH>
           <X>6503.514000</X>
           <Y>1239.647000</Y>
           <Z>-717.490000</Z>
           <X_DOT>-0.873160</X_DOT>
           <Y_DOT>8.740420</Y_DOT>
           <Z_DOT>-4.191076</Z_DOT>
         </stateVector>
         <spacecraftParameters>
           <MASS>3000.000000</MASS>
           <SOLAR_RAD_AREA>18.770000</SOLAR_RAD_AREA>
           <SOLAR_RAD_COEFF>1.000000</SOLAR_RAD_COEFF>
           <DRAG_AREA>18.770000</DRAG_AREA>
           <DRAG_COEFF>2.500000</DRAG_COEFF>
         </spacecraftParameters>
         <covarianceMatrix>
           <COV_REF_FRAME>ITRF1997</COV_REF_FRAME>
           <CX_X>0.316</CX_X>
           <CY_X>0.722</CY_X>
           <CY_Y>0.518</CY_Y>
           <CZ_X>0.202</CZ_X>
           <CZ_Y>0.715</CZ_Y>
           <CZ_Z>0.002</CZ_Z>
           <CX_DOT_X>0.912</CX_DOT_X>
           <CX_DOT_Y>0.306</CX_DOT_Y>
           <CX_DOT_Z>0.276</CX_DOT_Z>
           <CX_DOT_X_DOT>0.797</CX_DOT_X_DOT>
           <CY_DOT_X>0.562</CY_DOT_X>
           <CY_DOT_Y>0.899</CY_DOT_Y>
           <CY_DOT_Z>0.022</CY_DOT_Z>
           <CY_DOT_X_DOT>0.079</CY_DOT_X_DOT>
           <CY_DOT_Y_DOT>0.415</CY_DOT_Y_DOT>
           <CZ_DOT_X>0.245</CZ_DOT_X>
           <CZ_DOT_Y>0.965</CZ_DOT_Y>
           <CZ_DOT_Z>0.950</CZ_DOT_Z>
           <CZ_DOT_X_DOT>0.435</CZ_DOT_X_DOT>
           <CZ_DOT_Y_DOT>0.621</CZ_DOT_Y_DOT>
           <CZ_DOT_Z_DOT>0.991</CZ_DOT_Z_DOT>
         </covarianceMatrix>
       </data>
    </segment>
  </body>
</opm>

                     Figure G-5: OPM File Example in XML Format

NOTE – The following are examples of OMMs. All of these examples are based on the
       TLE shown in figure G-6.

GOES 9 [P]
1 23581U 95025A     07064.44075725 -.00000113 00000-0 10000-3 0 9250
2 23581    3.0539   81.7939 0005013 249.2363 150.1602 1.00273272 43169

                         Figure G-6: Example Two Line Element Set

G4    OMM EXAMPLES IN KVN

The following figures are examples of OMMs in KVN format.

        CCSDS_OMM_VERS = 3.0
        CREATION_DATE = 2020-065T16:00:00
        ORIGINATOR     = NOAA
        MESSAGE_ID     = OMM 202013719185

        OBJECT_NAME    = GOES 9
        OBJECT_ID      = 1995-025A
        CENTER_NAME    = EARTH
        REF_FRAME      = TEME
        TIME_SYSTEM    = UTC
        MEAN_ELEMENT_THEORY = SGP/SGP4

        EPOCH             = 2020-064T10:34:41.4264
        MEAN_MOTION       = 1.00273272
        ECCENTRICITY      = 0.0005013
        INCLINATION       =   3.0539
        RA_OF_ASC_NODE    = 81.7939
        ARG_OF_PERICENTER = 249.2363
        MEAN_ANOMALY      = 150.1602
        GM                = 398600.8
        EPHEMERIS_TYPE    = 0
        CLASSIFICATION_TYPE = U
        NORAD_CAT_ID      = 23581
        ELEMENT_SET_NO    = 0925
        REV_AT_EPOCH      = 4316
        BSTAR             = 0.0001
        MEAN_MOTION_DOT   = -0.00000113
        MEAN_MOTION_DDOT = 0.0

               Figure G-7: OMM File Example without Covariance Matrix

      CCSDS_OMM_VERS = 3.0
      CREATION_DATE = 2020-065T16:00:00
      ORIGINATOR     = NOAA

      OBJECT_NAME    = GOES 9
      OBJECT_ID      = 1995-025A
      CENTER_NAME    = EARTH
      REF_FRAME      = TEME
      TIME_SYSTEM    = UTC
      MEAN_ELEMENT_THEORY = SGP/SGP4

      EPOCH             = 2020-064T10:34:41.4264
      MEAN_MOTION       = 1.00273272
      ECCENTRICITY      = 0.0005013
      INCLINATION       =   3.0539
      RA_OF_ASC_NODE    = 81.7939
      ARG_OF_PERICENTER = 249.2363
      MEAN_ANOMALY      = 150.1602
      GM                = 398600.8

      EPHEMERIS_TYPE     = 0
      CLASSIFICATION_TYPE = U
      NORAD_CAT_ID    = 23581
      ELEMENT_SET_NO = 0925
      REV_AT_EPOCH       = 4316
      BSTAR              = 0.0001
      MEAN_MOTION_DOT    = -0.00000113
      MEAN_MOTION_DDOT = 0.0

      COV_REF_FRAME = TEME
      CX_X = 3.331349476038534e-04
      CY_X = 4.618927349220216e-04
      CY_Y = 6.782421679971363e-04
      CZ_X = -3.070007847730449e-04
      CZ_Y = -4.221234189514228e-04
      CZ_Z = 3.231931992380369e-04
      CX_DOT_X = -3.349365033922630e-07
      CX_DOT_Y = -4.686084221046758e-07
      CX_DOT_Z = 2.484949578400095e-07
      CX_DOT_X_DOT = 4.296022805587290e-10
      CY_DOT_X = -2.211832501084875e-07
      CY_DOT_Y = -2.864186892102733e-07
      CY_DOT_Z = 1.798098699846038e-07
      CY_DOT_X_DOT = 2.608899201686016e-10
      CY_DOT_Y_DOT = 1.767514756338532e-10
      CZ_DOT_X = -3.041346050686871e-07
      CZ_DOT_Y = -4.989496988610662e-07
      CZ_DOT_Z = 3.540310904497689e-07
      CZ_DOT_X_DOT = 1.869263192954590e-10
      CZ_DOT_Y_DOT = 1.008862586240695e-10
      CZ_DOT_Z_DOT = 6.224444338635500e-10

              Figure G-8: OMM File Example with Covariance Matrix

      CCSDS_OMM_VERS = 3.0
      CREATION_DATE = 2020-065T16:00:00
      ORIGINATOR     = NOAA

      OBJECT_NAME    = GOES 9
      OBJECT_ID      = 1995-025A
      CENTER_NAME    = EARTH
      REF_FRAME      = TEME
      TIME_SYSTEM    = UTC
      MEAN_ELEMENT_THEORY = SGP/SGP4

      EPOCH              = 2020-064T10:34:41.4264
      MEAN_MOTION        = 1.00273272    [rev/day]
      ECCENTRICITY       = 0.0005013
      INCLINATION        =    3.0539     [deg]
      RA_OF_ASC_NODE     = 81.7939       [deg]
      ARG_OF_PERICENTER = 249.2363       [deg]
      MEAN_ANOMALY       = 150.1602      [deg]
      GM                 = 398600.8      [km**3/s**2]
      EPHEMERIS_TYPE     = 0
      CLASSIFICATION_TYPE = U
      NORAD_CAT_ID    = 23581
      ELEMENT_SET_NO = 0925
      REV_AT_EPOCH       = 4316
      BSTAR              = 0.0001        [1/ER]
      MEAN_MOTION_DOT    = -0.00000113   [rev/day**2]
      MEAN_MOTION_DDOT = 0.0             [rev/day**3]

      USER_DEFINED_EARTH_MODEL = WGS-84

            Figure G-9: OMM with Units and a User-defined Parameter

G5   OMM EXAMPLE IN XML

Figure G-10 contains an example of an OMM in XML format.
<?xml version="1.0" encoding="UTF-8"?>
<omm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-
3.0.0-master-3.0.xsd"
      id="CCSDS_OMM_VERS" version="3.0">
  <header>
    <COMMENT> THIS IS AN XML VERSION OF THE OMM </COMMENT>
    <CLASSIFICATION>CUI</CLASSIFICATION>
    <CREATION_DATE>2020-065T16:00:00</CREATION_DATE>
    <ORIGINATOR>NOAA</ORIGINATOR>
    <MESSAGE_ID> OMM 202013719185</MESSAGE_ID>
  </header>
  <body>
    <segment>
      <metadata>
        <OBJECT_NAME>GOES-9</OBJECT_NAME>
        <OBJECT_ID>1995-025A</OBJECT_ID>
        <CENTER_NAME>EARTH</CENTER_NAME>
        <REF_FRAME>TEME</REF_FRAME>
        <TIME_SYSTEM>UTC</TIME_SYSTEM>
        <MEAN_ELEMENT_THEORY>SGP4</MEAN_ELEMENT_THEORY>
      </metadata>
       <data>
         <meanElements>
           <EPOCH>2020-064T10:34:41.4264</EPOCH>
           <MEAN_MOTION>1.00273272</MEAN_MOTION>
           <ECCENTRICITY>0.0005013</ECCENTRICITY>
           <INCLINATION>3.0539</INCLINATION>
           <RA_OF_ASC_NODE>81.7939</RA_OF_ASC_NODE>
           <ARG_OF_PERICENTER>249.2363</ARG_OF_PERICENTER>
           <MEAN_ANOMALY>150.1602</MEAN_ANOMALY>
           <GM>398600.8</GM>
         </meanElements>
         <tleParameters>
           <NORAD_CAT_ID>23581</NORAD_CAT_ID>
           <ELEMENT_SET_NO>0925</ELEMENT_SET_NO>
           <REV_AT_EPOCH>4316</REV_AT_EPOCH>
           <BSTAR>0.0001</BSTAR>
           <MEAN_MOTION_DOT>-0.00000113</MEAN_MOTION_DOT>
           <MEAN_MOTION_DDOT>0.0</MEAN_MOTION_DDOT>
         </tleParameters>
         <covarianceMatrix>
           <COV_REF_FRAME>TEME</COV_REF_FRAME>
           <CX_X>3.331349476038534e-04</CX_X>
           <CY_X>4.618927349220216e-04</CY_X>
           <CY_Y>6.782421679971363e-04</CY_Y>
           <CZ_X>-3.070007847730449e-04</CZ_X>
           <CZ_Y>-4.221234189514228e-04</CZ_Y>
           <CZ_Z>3.231931992380369e-04</CZ_Z>
           <CX_DOT_X>-3.349365033922630e-07</CX_DOT_X>
           <CX_DOT_Y>-4.686084221046758e-07</CX_DOT_Y>
           <CX_DOT_Z>2.484949578400095e-07</CX_DOT_Z>
           <CX_DOT_X_DOT>4.296022805587290e-10</CX_DOT_X_DOT>
           <CY_DOT_X>-2.211832501084875e-07</CY_DOT_X>
           <CY_DOT_Y>-2.864186892102733e-07</CY_DOT_Y>
           <CY_DOT_Z>1.798098699846038e-07</CY_DOT_Z>
           <CY_DOT_X_DOT>2.608899201686016e-10</CY_DOT_X_DOT>
           <CY_DOT_Y_DOT>1.767514756338532e-10</CY_DOT_Y_DOT>
           <CZ_DOT_X>-3.041346050686871e-07</CZ_DOT_X>
           <CZ_DOT_Y>-4.989496988610662e-07</CZ_DOT_Y>
           <CZ_DOT_Z>3.540310904497689e-07</CZ_DOT_Z>
           <CZ_DOT_X_DOT>1.869263192954590e-10</CZ_DOT_X_DOT>
           <CZ_DOT_Y_DOT>1.008862586240695e-10</CZ_DOT_Y_DOT>
           <CZ_DOT_Z_DOT>6.224444338635500e-10</CZ_DOT_Z_DOT>
         </covarianceMatrix>
       </data>
    </segment>
  </body>
</omm>

                    Figure G-10: OMM File Example in XML Format

G6   OEM EXAMPLES IN KVN

The following figures are examples of OEMs in KVN format. Some ephemeris data lines
have been omitted to save space.

CCSDS_OEM_VERS = 3.0
CREATION_DATE = 1996-11-04T17:22:31
ORIGINATOR = NASA/JPL

META_START
OBJECT_NAME         = MARS GLOBAL SURVEYOR
OBJECT_ID           = 1996-062A
CENTER_NAME         = MARS BARYCENTER
REF_FRAME           = EME2000
TIME_SYSTEM         = UTC
START_TIME          = 2019-12-18T12:00:00.331
USEABLE_START_TIME = 2019-12-18T12:10:00.331
USEABLE_STOP_TIME   = 2019-12-28T21:23:00.331
STOP_TIME           = 2019-12-28T21:28:00.331
INTERPOLATION       = HERMITE
INTERPOLATION_DEGREE = 7
META_STOP
COMMENT This file was produced by M.R. Pigs, OSAR NAV/JPL, 2019NOV 04. It is
COMMENT to be used for DSN scheduling purposes only.

2019-12-18T12:00:00.331   2789.619 -280.045 -1746.755    4.73372 -2.49586 -1.04195
2019-12-18T12:01:00.331   2783.419 -308.143 -1877.071    5.18604 -2.42124 -1.99608
2019-12-18T12:02:00.331   2776.033 -336.859 -2008.682    5.63678 -2.33951 -1.94687

   < intervening data records omitted here >

2019-12-28T21:28:00.331 -3881.024 563.959 -682.773     -3.28827 -3.66735 1.63861

META_START
OBJECT_NAME          = MARS GLOBAL SURVEYOR
OBJECT_ID            = 1996-062A
CENTER_NAME          = MARS BARYCENTER
REF_FRAME            = EME2000
TIME_SYSTEM          = UTC
START_TIME           = 2019-12-28T21:29:07.267
USEABLE_START_TIME   = 2019-12-28T22:08:02.5
USEABLE_STOP_TIME    = 2019-12-30T01:18:02.5
STOP_TIME            = 2019-12-30T01:28:02.267
INTERPOLATION        = HERMITE
INTERPOLATION_DEGREE = 7
META_STOP

COMMENT   This block begins after trajectory correction maneuver TCM-3.

2019-12-28T21:29:07.267 -2432.166 -063.042 1742.754     7.33702 -3.495867 -1.041945
2019-12-28T21:59:02.267 -2445.234 -878.141 1873.073     1.86043 -3.421256 -0.996366
2019-12-28T22:00:02.267 -2458.079 -683.858 2007.684     6.36786 -3.339563 -0.946654

   < intervening data records omitted here >

2019-12-30T01:28:02.267 2164.375 1115.811 -688.131     -3.53328 -2.88452 0.88535

            Figure G-11: OEM Example with No Acceleration, No Covariance

CCSDS_OEM_VERS = 3.0

COMMENT   OEM WITH OPTIONAL ACCELERATIONS

CREATION_DATE = 2019-11-04T17:22:31
ORIGINATOR = NASA/JPL

META_START
OBJECT_NAME         = MARS GLOBAL SURVEYOR
OBJECT_ID           = 1996-028A
CENTER_NAME         = MARS BARYCENTER
REF_FRAME           = EME2000
TIME_SYSTEM         = UTC
START_TIME          = 2019-12-18T12:00:00.331
USEABLE_START_TIME = 2019-12-18T12:10:00.331
USEABLE_STOP_TIME   = 2019-12-28T21:23:00.331
STOP_TIME           = 2019-12-28T21:28:00.331
INTERPOLATION       = HERMITE
INTERPOLATION_DEGREE = 7
META_STOP

COMMENT   This file was produced by M.R. Somebody, MSOO NAV/JPL, 2021 NOV 04. It is
COMMENT   to be used for DSN scheduling purposes only.

2019-12-18T12:00:00.331   2789.6 -280.0 -1746.8   4.73 -2.50 -1.04    0.008 0.001 -0.159
2019-12-18T12:01:00.331   2783.4 -308.1 -1877.1   5.19 -2.42 -2.00    0.008 0.001 0.001
2019-12-18T12:02:00.331   2776.0 -336.9 -2008.7   5.64 -2.34 -1.95    0.008 0.001 0.159

   < intervening data records omitted here >

2019-12-28T21:28:00.331 -3881.0   564.0 -682.8 -3.29 -3.67   1.64    -0.003 0.000   0.000

                 Figure G-12: OEM Example with Optional Accelerations

CCSDS_OEM_VERS = 3.0
CREATION_DATE = 2019-11-04T17:22:31
ORIGINATOR = NASA/JPL
MESSAGE_ID = OEM 201113719185
META_START
OBJECT_NAME           = MARS GLOBAL SURVEYOR
OBJECT_ID             = 1996-062A
CENTER_NAME           = MARS BARYCENTER
REF_FRAME             = EME2000
TIME_SYSTEM           = UTC
START_TIME            = 2019-12-28T21:29:07.267
USEABLE_START_TIME    = 2019-12-28T22:08:02.5
USEABLE_STOP_TIME     = 2019-12-30T01:18:02.5
STOP_TIME             = 2019-12-30T01:28:02.267
INTERPOLATION         = HERMITE
INTERPOLATION_DEGREE = 7
META_STOP

COMMENT This block begins after trajectory correction maneuver TCM-3.

2019-12-28T21:29:07.267 -2432.166 -063.042 1742.754     7.33702 -3.495867 -1.041945
2019-12-28T21:59:02.267 -2445.234 -878.141 1873.073     1.86043 -3.421256 -0.996366
2019-12-28T22:00:02.267 -2458.079 -683.858 2007.684     6.36786 -3.339563 -0.946654

   < intervening data records omitted here >

2019-12-30T01:28:02.267 2164.375 1115.811 -688.131     -3.53328 -2.88452 0.88535

COVARIANCE_START
EPOCH = 2019-12-28T21:29:07.267
COV_REF_FRAME = EME2000
 3.3313494e-04
 4.6189273e-04 6.7824216e-04
-3.0700078e-04 -4.2212341e-04 3.2319319e-04
-3.3493650e-07 -4.6860842e-07 2.4849495e-07       4.2960228e-10
-2.2118325e-07 -2.8641868e-07 1.7980986e-07       2.6088992e-10   1.7675147e-10
-3.0413460e-07 -4.9894969e-07 3.5403109e-07       1.8692631e-10   1.0088625e-10   6.2244443e-10

EPOCH = 2019-12-29T21:00:00
COV_REF_FRAME = EME2000
 3.4424505e-04
 4.5078162e-04 6.8935327e-04
-3.0600067e-04 -4.1101230e-04   3.3420420e-04
-3.2382549e-07 -4.5750731e-07   2.3738384e-07     4.3071339e-10
-2.1007214e-07 -2.7530757e-07   1.6870875e-07     2.5077881e-10   1.8786258e-10
-3.0302350e-07 -4.8783858e-07   3.4302008e-07     1.7581520e-10   1.0077514e-10   6.2244443e-10
COVARIANCE_STOP

            Figure G-13: OEM Example with Optional Covariance Matrices

G7   OEM EXAMPLE IN XML

Figure G-14 contains an example of an Orbit Ephemeris Message in XML format.
<?xml version="1.0" encoding="UTF-8"?>
<oem xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-
3.0.0-master-3.0.xsd"
      id="CCSDS_OEM_VERS" version="3.0">

  <header>
    <COMMENT>OEM WITH OPTIONAL ACCELERATIONS</COMMENT>
    <CREATION_DATE>2019-11-04T17:22:31</CREATION_DATE>
    <ORIGINATOR>NASA/JPL</ORIGINATOR>
    <MESSAGE_ID>OEM 201113719185</MESSAGE_ID>
  </header>
  <body>
    <segment>
      <metadata>
        <OBJECT_NAME>MARS GLOBAL SURVEYOR</OBJECT_NAME>
        <OBJECT_ID>2021-028A</OBJECT_ID>
        <CENTER_NAME>MARS BARYCENTER</CENTER_NAME>
        <REF_FRAME>EME2000</REF_FRAME>
        <TIME_SYSTEM>UTC</TIME_SYSTEM>
        <START_TIME>2019-12-18T12:00:00.331</START_TIME>
        <USEABLE_START_TIME>2019-12-18T12:10:00.331</USEABLE_START_TIME>
        <USEABLE_STOP_TIME>2019-12-28T21:23:00.331</USEABLE_STOP_TIME>
        <STOP_TIME>2019-12-28T21:28:00.331</STOP_TIME>
        <INTERPOLATION>HERMITE</INTERPOLATION>
        <INTERPOLATION_DEGREE>7</INTERPOLATION_DEGREE>
      </metadata>
      <data>
        <COMMENT>Produced by M.R. Somebody, MSOO NAV/JPL, 2019 OCT 11. It is</COMMENT>
        <COMMENT>to be used for DSN scheduling purposes only.</COMMENT>
        <stateVector>
          <EPOCH>2019-12-18T12:00:00.331</EPOCH>
          <X>2789.6</X>
          <Y>-280.0</Y>
          <Z>-1746.8</Z>
          <X_DOT>4.73</X_DOT>
          <Y_DOT>-2.50</Y_DOT>
          <Z_DOT>-1.04</Z_DOT>
          <X_DDOT>0.008</X_DDOT>
          <Y_DDOT>0.001</Y_DDOT>
          <Z_DDOT>-0.159</Z_DDOT>
        </stateVector>
        <stateVector>
          <EPOCH>2019-12-18T12:01:00.331</EPOCH>
          <X>2783.4</X>
          <Y>-308.1</Y>
          <Z>-1877.1</Z>
          <X_DOT>5.19</X_DOT>
          <Y_DOT>-2.42</Y_DOT>
          <Z_DOT>-2.00</Z_DOT>
          <X_DDOT>0.008</X_DDOT>
          <Y_DDOT>0.001</Y_DDOT>
          <Z_DDOT>0.001</Z_DDOT>
        </stateVector>
        <stateVector>
          <EPOCH>2019-12-18T12:02:00.331</EPOCH>
          <X>2776.0</X>
          <Y>-336.9</Y>
          <Z>-2008.7</Z>
          <X_DOT>5.64</X_DOT>
          <Y_DOT>-2.34</Y_DOT>
          <Z_DOT>-1.95</Z_DOT>
          <X_DDOT>0.008</X_DDOT>
          <Y_DDOT>0.001</Y_DDOT>
          <Z_DDOT>0.159</Z_DDOT>
        </stateVector>

                    Figure G-14: OEM File Example in XML Format

         <stateVector>
           <EPOCH>2019-12-28T21:28:00.331</EPOCH>
           <X>-3881.0</X>
           <Y>564.0</Y>
           <Z>-682.8</Z>
           <X_DOT>-3.29</X_DOT>
           <Y_DOT>-3.67</Y_DOT>
           <Z_DOT>1.64</Z_DOT>
           <X_DDOT>-0.003</X_DDOT>
           <Y_DDOT>0.000</Y_DDOT>
           <Z_DDOT>0.000</Z_DDOT>
         </stateVector>
         <covarianceMatrix>
           <EPOCH>2019-12-28T22:28:00.331</EPOCH>
           <COV_REF_FRAME>ITRF1997</COV_REF_FRAME>
           <CX_X>0.316</CX_X>
           <CY_X>0.722</CY_X>
           <CY_Y>0.518</CY_Y>
           <CZ_X>0.202</CZ_X>
           <CZ_Y>0.715</CZ_Y>
           <CZ_Z>0.002</CZ_Z>
           <CX_DOT_X>0.912</CX_DOT_X>
           <CX_DOT_Y>0.306</CX_DOT_Y>
           <CX_DOT_Z>0.276</CX_DOT_Z>
           <CX_DOT_X_DOT>0.797</CX_DOT_X_DOT>
           <CY_DOT_X>0.562</CY_DOT_X>
           <CY_DOT_Y>0.899</CY_DOT_Y>
           <CY_DOT_Z>0.022</CY_DOT_Z>
           <CY_DOT_X_DOT>0.079</CY_DOT_X_DOT>
           <CY_DOT_Y_DOT>0.415</CY_DOT_Y_DOT>
           <CZ_DOT_X>0.245</CZ_DOT_X>
           <CZ_DOT_Y>0.965</CZ_DOT_Y>
           <CZ_DOT_Z>0.950</CZ_DOT_Z>
           <CZ_DOT_X_DOT>0.435</CZ_DOT_X_DOT>
           <CZ_DOT_Y_DOT>0.621</CZ_DOT_Y_DOT>
           <CZ_DOT_Z_DOT>0.991</CZ_DOT_Z_DOT>
         </covarianceMatrix>
       </data>
    </segment>
  </body>
</oem>

             Figure G-14: OEM File Example in XML Format (Continued)

G8   OCM EXAMPLES IN KVN

The following figures are examples of OCMs in KVN format. The first has only a time
history of orbital states and constitutes a minimal content OCM. The second includes space
object characteristics and Perturbations Specifications; the third includes a time series of
maneuvers, a time history of Cartesian position and velocity trajectory states, followed by a
time history of Keplerian elements; and the fourth includes a time series of covariance
matrices.

       CCSDS_OCM_VERS = 3.0
       CREATION_DATE = 2022-11-06T09:23:57
       ORIGINATOR = JAPAN AEROSPACE EXPLORATION AGENCY
       META_START
       TIME_SYSTEM = UTC
       EPOCH_TZERO = 2022-12-18T14:28:15.1172
       META_STOP
       TRAJ_START
       CENTER_NAME = EARTH
       TRAJ_REF_FRAME=ITRF2000
          0.0 2854.5 -2916.2 -5360.7 5.90 4.86 0.52 0.0037 -0.0038 -0.0070
        120.0 5478.6    434.3 -3862.5 2.50 5.87 4.29 0.0072 0.0006 -0.0051
        240.0 4146.0 -1655.8 -5038.3 4.80 5.58 2.16 0.0054 -0.0022 -0.0066
       < intervening data records omitted here >
       86400.0 -1553.4       -4848.7 -4406.5 6.73 1.01 -3.53 -0.002 -0.0063 -0.0058
       TRAJ_STOP

  Figure G-15: Simple/Succinct OCM Example with Only Cartesian PVA Ephemeris

NOTE – In this example, CENTER_NAME defaults to EARTH and orbit type
       (TRAJ_TYPE) to CARTPV. In this example, at the expense of readability, KVN
       values are unaligned to minimize message storage and transmission size.

      CCSDS_OCM_VERS = 3.0
      COMMENT This OCM reflects the latest conditions post-maneuver A67Z
      COMMENT This example shows the specification of multiple comment lines
      CLASSIFICATION        = SBU
      CREATION_DATE         = 2022-11-06T09:23:57
      ORIGINATOR            = JAPAN AEROSPACE EXPLORATION AGENCY
      MESSAGE_ID            = OCM 201113719185

      META_START
      OBJECT_NAME           = OSPREY 5
      INTERNATIONAL_DESIGNATOR = 2022-999A

      ORIGINATOR_POC        = R. Rabbit
      ORIGINATOR_POSITION   = Flight Dynamics Mission Design Lead
      ORIGINATOR_PHONE      = (719)555-1234
      ORIGINATOR_ADDRESS    = 5040 Spaceflight Ave., Cocoa Beach FL USA 12345

      TECH_POC              = Mr. Rodgers
      TECH_PHONE            = (719)555-1234
      TECH_EMAIL            = email@email.XXX

      TIME_SYSTEM           = UT1
      EPOCH_TZERO           = 2022-12-18T00:00:00.0000

      TAIMUTC_AT_TZERO      = 36      [s]
      UT1MUTC_AT_TZERO      = .357    [s]
      META_STOP

      TRAJ_START
      COMMENT           GEOCENTRIC, CARTESIAN, EARTH FIXED
      COMMENT           THIS IS MY SECOND COMMENT LINE
      CENTER_NAME            = EARTH
      TRAJ_REF_FRAME         = EFG
      TRAJ_TYPE              = CARTPV
      TRAJ_UNITS             = [km, km, km, km/s, km/s, km/s]
      2022-12-18T14:28:25.1172 2854.533 -2916.187 -5360.774 5.688 4.652 0.520
      TRAJ_STOP

      PHYS_START
      COMMENT S/C Physical Chars, w/mandatory OEB_PARENT_FRAME defaulting to RSW_ROTATING:
      WET_MASS              = 100.0   [kg]
      OEB_Q1                = 0.03123
      OEB_Q2                = 0.78543
      OEB_Q3                = 0.39158
      OEB_QC                = 0.47832
      OEB_MAX               = 2.0     [m]
      OEB_INT               = 1.0     [m]
      OEB_MIN               = 0.5     [m]
      AREA_ALONG_OEB_MAX    = 0.5     [m**2]
      AREA_ALONG_OEB_INT    = 1.0     [m**2]
      AREA_ALONG_OEB_MIN    = 2.0     [m**2]
      PHYS_STOP

      PERT_START
      COMMENT Perturbations Specification:
      ATMOSPHERIC_MODEL     = NRLMSIS00
      GRAVITY_MODEL         = EGM-96: 36D 36O
      GM                    = 398600.4415          [km**3/s**2]
      N_BODY_PERTURBATIONS = MOON, SUN
      FIXED_GEOMAG_KP       = 12.0
      FIXED_F10P7           = 105.0
      FIXED_F10P7_MEAN      = 120.0
      PERT_STOP

      USER_START
      USER_DEFINED_CONSOLE_POC = MAXWELL RAFERTY
      USER_DEFINED_EARTH_MODEL = WGS-84
      USER_STOP

  Figure G-16: OCM Example with Space Object Characteristics and Perturbations

      CCSDS_OCM_VERS   = 3.0
      CREATION_DATE    = 2022-11-06T09:23:57
      ORIGINATOR       = JAPAN AEROSPACE EXPLORATION AGENCY
      META_START
      EPOCH_TZERO      = 2022-12-18T14:28:15.1172
      META_STOP
      TRAJ_START
      COMMENT ORBIT EPHEMERIS INCORPORATING DEPLOYMENTS AND MANEUVERS (BELOW)
      CENTER_NAME       = EARTH
      TRAJ_REF_FRAME    = TOD_EARTH
      TRAJ_FRAME_EPOCH = 2022-12-18T14:28:15.1172
      TRAJ_TYPE         = CARTPVA
      TRAJ_UNITS        = [km,km,km,km/s,km/s,km/s,km/s**2,km/s**2,km/s**2]
      2022-12-18T14:36:05.0 2854.5 -2916.2 -5360.7 5.90 4.86 0.52 0.0037 -0.0038 -0.0070
      2022-12-18T14:38:05.0 5478.6   434.3 -3862.5 2.50 5.87 4.29 0.0072 0.0006 -0.0051
      2022-12-18T14:40:05.0 4146.0 -1655.8 -5038.3 4.80 5.58 2.16 0.0054 -0.0022 -0.0066
      < intervening data records omitted here >
      2022-12-19T14:36:05.0 -1553.4 -4848.7 -4406.5 6.73 1.01 -3.53 -0.002 -0.0063 -0.0058
      TRAJ_STOP
      PHYS_START
      COMMENT Spacecraft Physical Characteristics:
      DRAG_CONST_AREA = 10.00 [m**2]
      DRAG_COEFF_NOM   = 2.300
      DRAG_UNCERTAINTY = 5.0
      WET_MASS         = 200.0 [kg]
      SRP_CONST_AREA   = 4.00
      SOLAR_RAD_COEFF = 1.300
      PHYS_STOP
      MAN_START
      COMMENT          Ten 1kg objects deployed at 1 m/s from 190kg host over 90 s time
      COMMENT          20 deg off of back-track direction
      MAN_ID           = E_W_20160305B
      MAN_BASIS        = CANDIDATE
      MAN_DEVICE_ID    = DEPLOY
      MAN_PURPOSE      = DEPLOY
      MAN_REF_FRAME    = RSW_ROTATING
      MAN_COMPOSITION = TIME_RELATIVE, DEPLOY_ID, DEPLOY_DV_X, DEPLOY_DV_Y, <cont.>
      DEPLOY_DV_Z, DEPLOY_MASS, DEPLOY_DV_SIGMA, DEPLOY_DV_RATIO, DEPLOY_DV_CDA
      MAN_UNITS        = [n/a, km/s, km/s, km/s, kg, %, n/a, m**2]
      500.0 CUBESAT_10 2.8773E-4 -9.3969E-4 1.8491E-4 -1.0 5.0 -0.005025 0.033
      510.0 CUBESAT_11 1.4208E-4 -9.3969E-4 3.1111E-4 -1.0 5.0 -0.005051 0.033
      520.0 CUBESAT_12 -4.8670E-5 -9.3969E-4 3.3854E-4 -1.0 5.0 -0.005076 0.033
      530.0 CUBESAT_13 -2.2398E-4 -9.3969E-4 2.5848E-4 -1.0 5.0 -0.005102 0.033
      540.0 CUBESAT_14 -3.2817E-4 -9.3969E-4 9.6360E-5 -1.0 5.0 -0.005128 0.033
      550.0 CUBESAT_15 -3.2817E-4 -9.3969E-4 -9.6360E-5 -1.0 5.0 -0.005154 0.033
      560.0 CUBESAT_16 -2.2398E-4 -9.3969E-4 -2.5848E-4 -1.0 5.0 -0.005181 0.033
      570.0 CUBESAT_17 -4.8670E-5 -9.3969E-4 -3.3854E-4 -1.0 5.0 -0.005208 0.033
      580.0 CUBESAT_18 1.4208E-4 -9.3969E-4 -3.1111E-4 -1.0 5.0 -0.005236 0.033
      590.0 CUBESAT_19 2.8773E-4 -9.3969E-4 -1.8491E-4 -1.0 5.0 -0.005263 0.033
      MAN_STOP
      MAN_START
      COMMENT           100 s of 0.5N +in-track thr w/η=0.95, Isp=300s, 5% 1-sigma error
      COMMENT           NOTE that this OCM specifies a future compound maneuver, with
      COMMENT           deployment during low-level host platform thrusting.
      MAN_ID            = E_W_20160305B
      MAN_BASIS         = CANDIDATE
      MAN_DEVICE_ID     = THR_01
      MAN_PURPOSE       = ORBIT
      MAN_REF_FRAME     = RSW_ROTATING
      MAN_COMPOSITION = TIME_ABSOLUTE, MAN_DURA, THR_X, THR_Y, THR_Z, THR_EFFIC, THR_INTERP,
      ISP THR_MAG_SIGMA
      MAN_UNITS         = [n/a, s, N, N, N, n/a, n/a, s, %]
      2022-12-18T14:36:35.1172 100.0 0.0 0.5 0.0 0.95 ON 300.0 5.0
      MAN_STOP
      PERT_START
      COMMENT Perturbations specification
      GM              = 398600.4415             [km**3/s**2]
      PERT_STOP
      OD_START
      COMMENT Orbit Determination information
      OD_ID            = OD #10059
      OD_PREV_ID       = OD #10058
      OD_METHOD        = SF: ODTK
      OD_EPOCH         = 2022-12-18T11:17:33
      OBS_USED         = 273
      TRACKS_USED      = 91
      OD_STOP

 Figure G-17: OCM Example with Deployed Objects and Low-level Thrusting
              Maneuver during Deployment to Make ‘String-of-Pearls’ Deployment

NOTES

1     This example is aligned with a multi-deployment simulation for a future mission; thus
      the specific mission is not identified.

2     The demarcation ‘<cont.>’ indicates that this single line is shown, for display
      purposes only, in multiple lines. This demarcation shall not be used in the actual
      OCM message, as all specified content shall be provided on the same line as its
      matching time tag.

      CCSDS_OCM_VERS       = 3.0
      CREATION_DATE        = 2022-11-06T09:23:57
      ORIGINATOR           = JAPAN AEROSPACE EXPLORATION AGENCY
      META_START
      OBJECT_NAME       = OSPREY 5
      INTERNATIONAL_DESIGNATOR = 2022-999A
      CATALOG_NAME      = CSPOC
      OBJECT_DESIGNATOR = 98765
      TIME_SYSTEM       = UTC
      EPOCH_TZERO       = 2022-12-18T14:28:15.1172
      META_STOP
      TRAJ_START
      TRAJ_BASIS        = PREDICTED
      CENTER_NAME       = EARTH
      TRAJ_REF_FRAME    = TOD_EARTH
      TRAJ_FRAME_EPOCH = 2022-12-18T14:28:15.1172
      USEABLE_START_TIME=2022-12-18T14:32:15.1172
      USEABLE_STOP_TIME= 2022-12-19T14:26:15.1172
      TRAJ_TYPE         = CARTPVA
      TRAJ_UNITS        = [km,km,km,km/s,km/s,km/s,km/s**2,km/s**2,km/s**2]
         0.0 2854.5 -2916.2 -5360.7 5.90 4.86 0.52 0.0037 -0.0038 -0.0070
       120.0 5478.6    434.3 -3862.5 2.50 5.87 4.29 0.0072 0.0006 -0.0051
       240.0 4146.0 -1655.8 -5038.3 4.80 5.58 2.16 0.0054 -0.0022 -0.0066
      < intervening data records omitted here >
      86400.0 -1553.4       -4848.7 -4406.5 6.73 1.01 -3.53 -0.002 -0.0063 -0.0058
      TRAJ_STOP
      TRAJ_START
      TRAJ_BASIS        = DETERMINED
      TRAJ_REF_FRAME    = J2000
      TRAJ_TYPE         = KEPLERIAN
      ORB_AVERAGING     = OSCULATING
      TRAJ_UNITS        = [km, n/a, deg, deg, deg, deg]
      0.000000 6600.0 .03 28.5 50.0 30.0 10.0
      10.000000 6600.0 .03 28.5 50.0 30.0 10.1
      20.000000 6600.0 .03 28.5 50.0 30.0 10.2
         < intervening data records omitted here >
      500.000000 6600.0 .03 28.5 50.0 30.0 35.0
      TRAJ_STOP
      PHYS_START
      COMMENT Spacecraft Physical Characteristics:
      DRAG_CONST_AREA = 10.00 [m**2]
      DRAG_COEFF_NOM   = 2.300
      WET_MASS         = 100.0 [kg]
      SRP_CONST_AREA   = 4.00
      SOLAR_RAD_COEFF = 1.300
      PHYS_STOP
      MAN_START
      COMMENT          200 s (in aggregate) of 10N thrust (in-track transitioning to radial)
      COMMENT          w/effic η=0.95, Isp=300s, 5% 1-sigma error
      MAN_ID           = E_W_20160305B
      MAN_BASIS        = CANDIDATE
      MAN_DEVICE_ID    = THR_01
      MAN_PURPOSE      = ORBIT
      MAN_REF_FRAME    = RSW_ROTATING
      MAN_COMPOSITION = TIME_RELATIVE, MAN_DURA, THR_X, THR_Y, THR_Z, THR_EFFIC, THR_INTERP,
      THR_ISP, THR_MAG_SIGMA
      MAN_UNITS        = [s, N, N, N, n/a, n/a, s, %]
      500.0 100.0 0.0 10.0 0.0 0.95 ON 300.0 5.0
      600.0 100.0 0.0 10.0 0.0 0.95 OFF 300.0 5.0
      MAN_STOP
      PERT_START
      COMMENT Perturbations specification
      GM              = 398600.4415             [km**3/s**2]
      PERT_STOP
      OD_START
      COMMENT          Orbit Determination information
      OD_ID               = OD #10059
      OD_PREV_ID          = OD #10058
      OD_METHOD           = BWLS: BAHN
      OD_EPOCH            = 2022-12-06T11:17:33
      OBS_USED            = 273
      TRACKS_USED         = 91
      OD_STOP

 Figure G-18: OCM Example with Multiple Orbit Time Histories, a Maneuver, OD,
              Cartesian, and Keplerian Ephemeris

       CCSDS_OCM_VERS      = 3.0
       CREATION_DATE       = 2022-11-06T09:23:57
       ORIGINATOR          = JAPAN AEROSPACE EXPLORATION AGENCY
       META_START
       OBJECT_NAME     = OSPREY 5
       INTERNATIONAL_DESIGNATOR = 2022-999A
       TIME_SYSTEM     = UTC
       EPOCH_TZERO     = 2022-12-18T14:28:15.1172
       META_STOP
       TRAJ_START
       COMMENT           GEOCENTRIC, CARTESIAN, EARTH FIXED
       TRAJ_BASIS       = PREDICTED
       CENTER_NAME      = EARTH
       TRAJ_REF_FRAME   = TOD_EARTH
       TRAJ_FRAME_EPOCH = 2022-12-18T14:28:15.1172
       TRAJ_TYPE        = CARTPVA
          0.0 2854.5 -2916.2 -5360.7 5.90 4.86 0.52 0.0037 -0.0038 -0.0070
        120.0 5478.6    434.3 -3862.5 2.50 5.87 4.29 0.0072 0.0006 -0.0051
        240.0 4146.0 -1655.8 -5038.3 4.80 5.58 2.16 0.0054 -0.0022 -0.0066
       < intervening data records omitted here >
       86400 -1553.4 -4848.7 -4406.5 6.73 1.01 -3.53 -0.002 -0.0063 -0.0058
       TRAJ_STOP
       PHYS_START
       COMMENT Spacecraft Physical Characteristics:
       DRAG_CONST_AREA =      10.000         [m**2]
       DRAG_COEFF_NOM =        2.300
       WET_MASS        =    1913.000         [kg]
       SRP_CONST_AREA =       10.000         [m**2]
       SOLAR_RAD_COEFF =       1.300
       PHYS_STOP
       COV_START
       COV_BASIS       = PREDICTED
       COV_REF_FRAME   = J2000
       COV_TYPE        = ADBARV
       COV_ORDERING    = LTM
       COV_UNITS       = [deg, deg, deg, deg, km, km/s]
       10.00 3.331349e-04 4.618927e-04 6.782421e-04 -3.070007e-04 -4.221234e-04 <cont.>
       3.231931e-04 -3.349365e-07 -4.686084e-07 2.484949e-07 4.296022e-10 <cont.>
       -2.211832e-07 -2.864186e-07 1.798098e-07 2.608899e-10 1.767514e-10 <cont.>
       -3.041346e-07 -4.989496e-07 3.540310e-07 1.869263e-10 1.008862e-10 6.224444e-10
          < … intervening data records omitted here … >
       20.0 3.442450e-04 4.507816e-04 6.893532e-04 -3.060006e-04 -4.110123e-04 <cont.>
       3.342042e-04 -3.238254e-07 -4.575073e-07 2.373838e-07 4.307133e-10 <cont.>
       -2.100721e-07 -2.753075e-07 1.687087e-07 2.507788e-10 1.878625e-10 <cont.>
       -3.030235e-07 -4.878385e-07 3.430200e-07 1.758152e-10 1.007751e-10 6.224444e-10
       COV_STOP
       COV_START
       COV_BASIS       = PREDICTED
       COV_REF_FRAME   = FIXED_EARTH
       COV_TYPE        = CARTP
       COV_UNITS       = [km, km, km]
       2022-12-18T14:31:35.1172 3.331349e-04                4.618927e-04   6.782421e-04 -3.070007e-04 <cont.>
       -4.221234e-04 3.231931e-04
       COV_STOP
       PERT_START
       COMMENT Perturbations specification
       GM             = 398600.4415                       [km**3/s**2]
       PERT_STOP

              Figure G-19: OCM Example with Covariance Matrix Time Histories in
                           Two Element Set Types

NOTE – The demarcation ‘<cont.>’ indicates that this single line is shown, for display
       purposes only, in multiple lines. This demarcation shall not be used in the actual
       OCM message, as all specified content shall be provided on the same line as its
       matching time tag.

G9   OCM EXAMPLE IN XML

The following is an example of an Orbit Comprehensive Message in XML format.
       <?xml version="1.0" encoding="UTF-8"?>
       <ocm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmx
       ml-3.0.0-master-3.0.xsd"
              id="CCSDS_OCM_VERS" version="3.0">
         <header>
         <COMMENT>ODM V.3 Example G-2</COMMENT>
         <COMMENT>OCM example with space object characteristics and
       perturbations.</COMMENT>
         <COMMENT>This OCM reflects the latest conditions post-maneuver A67Z</COMMENT>
         <COMMENT>This example shows the specification of multiple comment
       lines</COMMENT>
           <CREATION_DATE>2022-11-06T09:23:57</CREATION_DATE>
           <ORIGINATOR>JAPAN AEROSPACE EXPLORATION AGENCY</ORIGINATOR>
           <MESSAGE_ID> OCM 201113719185</MESSAGE_ID> </header>
         <body>
           <segment>
              <metadata>
                <OBJECT_NAME>OSPREY 5</OBJECT_NAME>
                <INTERNATIONAL_DESIGNATOR>2022-999A</INTERNATIONAL_DESIGNATOR>
                <ORIGINATOR_POC>R. Rabbit</ORIGINATOR_POC>
                <ORIGINATOR_POSITION>Flight Dynamics Mission Design
       Lead</ORIGINATOR_POSITION>
                <ORIGINATOR_PHONE>(719)555-1234</ORIGINATOR_PHONE>
                <ORIGINATOR_ADDRESS>5040 Spaceflight Ave., Cocoa Beach FL USA
       12345</ORIGINATOR_ADDRESS>
                <TECH_POC>Mr. Rodgers</TECH_POC>
                <TECH_PHONE>(719)555-1234</TECH_PHONE>
                <TECH_EMAIL>email@email.XXX</TECH_EMAIL>
                <TIME_SYSTEM>UT1</TIME_SYSTEM>
                <EPOCH_TZERO>2022-12-18T00:00:00.0000</EPOCH_TZERO>
                <TAIMUTC_AT_TZERO units="s">36</TAIMUTC_AT_TZERO>
                <UT1MUTC_AT_TZERO units="s">.357</UT1MUTC_AT_TZERO>
              </metadata>
              <data>
                <traj>
                   <COMMENT>GEOCENTRIC, CARTESIAN, EARTH FIXED</COMMENT>
                   <COMMENT>THIS IS MY SECOND COMMENT LINE</COMMENT>
                   <TRAJ_BASIS>PREDICTED</TRAJ_BASIS >
                   <CENTER_NAME>EARTH</CENTER_NAME>
                   <TRAJ_REF_FRAME>EFG</TRAJ_REF_FRAME>
                   <TRAJ_TYPE>CARTPVA</TRAJ_TYPE>
                   <trajLine>2022-12-18T14:28:25.1172 2854.5 -2916.2 -5360.7 5.90 4.86
       0.52 0.0037 -0.0038 -0.0070</trajLine>
                </traj>
                <phys>
                   <COMMENT>Spacecraft Physical Characteristics</COMMENT>
                   <WET_MASS units="kg">100.0</WET_MASS>
                   <OEB_Q1>0.03123</OEB_Q1>
                   <OEB_Q2>0.78543</OEB_Q2>
                   <OEB_Q3>0.39158</OEB_Q3>
                   <OEB_QC>0.47832</OEB_QC>
                   <OEB_MAX units="m">2.0</OEB_MAX>
                   <OEB_INT units="m">1.0</OEB_INT>
                   <OEB_MIN units="m">0.5</OEB_MIN>
                   <AREA_ALONG_OEB_MAX units="m**2">0.5</AREA_ALONG_OEB_MAX>
                   <AREA_ALONG_OEB_INT units="m**2">1.0</AREA_ALONG_OEB_INT>
                   <AREA_ALONG_OEB_MIN units="m**2">2.0</AREA_ALONG_OEB_MIN>
                </phys>
                <pert>
                   <COMMENT>Perturbations Specification</COMMENT>
                   <ATMOSPHERIC_MODEL>NRLMSIS00</ATMOSPHERIC_MODEL>
                   <GRAVITY_MODEL>EGM-96: 36D 36O</GRAVITY_MODEL>
                     <GM units="km**3/s**2">398600.4415</GM>
                   <N_BODY_PERTURBATIONS>MOON, SUN</N_BODY_PERTURBATIONS>
                   <FIXED_GEOMAG_KP>12.0</FIXED_GEOMAG_KP>
                   <FIXED_F10P7>105.0</FIXED_F10P7>
                   <FIXED_F10P7_MEAN>120.0</FIXED_F10P7_MEAN>
                </pert>
                <user>
                   <USER_DEFINED parameter="CONSOLE_POC">MAXWELL RAFERTY</USER_DEFINED>
                   <USER_DEFINED parameter="EARTH_MODEL">WGS-84</USER_DEFINED>
                </user>
              </data>
           </segment>
         </body>
       </ocm>

                     Figure G-20: OCM Example in XML Format

G10 AGGREGATING MULTIPLE ODMS IN A SINGLE NDM XML FILE

The following examples illustrate how multiple Orbit Data Messages can be aggregated in a
single XML file using the NDM ‘combined instantiation’ schema.
       <?xml version="1.0" encoding="UTF-8"?>
       <ndm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmx
       ml-3.0.0-master-3.0.xsd">
         <omm id="CCSDS_OMM_VERS" version="3.0">
           <header>
             <COMMENT>GENERATED VIA SPACE-TRACK.ORG API</COMMENT>
             <CREATION_DATE>2020-05-16T14:00:01</CREATION_DATE>
             <ORIGINATOR>18 SPCS</ORIGINATOR>
           </header>
           <body>
             <segment>
                <metadata>
                  <OBJECT_NAME>STARLINK-1073</OBJECT_NAME>
                  <OBJECT_ID>2020-001A</OBJECT_ID>
                  <CENTER_NAME>EARTH</CENTER_NAME>
                  <REF_FRAME>TEME</REF_FRAME>
                  <TIME_SYSTEM>UTC</TIME_SYSTEM>
                  <MEAN_ELEMENT_THEORY>SGP4</MEAN_ELEMENT_THEORY>
                </metadata>
                <data>
                  <meanElements>
                    <EPOCH>2020-05-16T14:00:01</EPOCH>
                    <MEAN_MOTION>15.05566242</MEAN_MOTION>
                    <ECCENTRICITY>0.0001225</ECCENTRICITY>
                    <INCLINATION>52.9981</INCLINATION>
                    <RA_OF_ASC_NODE>157.6133</RA_OF_ASC_NODE>
                    <ARG_OF_PERICENTER>93.35</ARG_OF_PERICENTER>
                    <MEAN_ANOMALY>295.8599</MEAN_ANOMALY>
                  </meanElements>
                  <tleParameters>
                    <EPHEMERIS_TYPE>0</EPHEMERIS_TYPE>
                    <CLASSIFICATION_TYPE>U</CLASSIFICATION_TYPE>
                    <NORAD_CAT_ID>44914</NORAD_CAT_ID>
                    <ELEMENT_SET_NO>999</ELEMENT_SET_NO>
                    <REV_AT_EPOCH>176</REV_AT_EPOCH>
                    <BSTAR>0.00057678</BSTAR>
                    <MEAN_MOTION_DOT>0.00008131</MEAN_MOTION_DOT>
                    <MEAN_MOTION_DDOT>0</MEAN_MOTION_DDOT>
                  </tleParameters>
                  <userDefinedParameters>
                    <USER_DEFINED parameter="TLE_LINE0">0 STARLINK-1073</USER_DEFINED>
                    <USER_DEFINED parameter="TLE_LINE1">
                       1 44914U 20211A 20137.58334491 +.00008131 +00000-0 +57678-3 0 9994
                    </USER_DEFINED>
                    <USER_DEFINED parameter="TLE_LINE2">
                       2 44914 052.9981 157.6133 0001225 093.3500 295.8599
       15.05566242001761
                    </USER_DEFINED>
                  </userDefinedParameters>
                </data>
             </segment>
           </body>
         </omm>
         <omm id="CCSDS_OMM_VERS" version="3.0">
           <header>
             <COMMENT>GENERATED VIA SPACE-TRACK.ORG API</COMMENT>
             <CREATION_DATE>2020-05-16T14:00:01</CREATION_DATE>
             <ORIGINATOR>18 SPCS</ORIGINATOR>
           </header>

          Figure G-21: Aggregating Multiple ODMs into a Single NDM File

          <body>
            <segment>
               <metadata>
                 <OBJECT_NAME>STARLINK-1084</OBJECT_NAME>
                 <OBJECT_ID>2020-001B</OBJECT_ID>
                 <CENTER_NAME>EARTH</CENTER_NAME>
                 <REF_FRAME>TEME</REF_FRAME>
                 <TIME_SYSTEM>UTC</TIME_SYSTEM>
                 <MEAN_ELEMENT_THEORY>SGP4</MEAN_ELEMENT_THEORY>
               </metadata>
               <data>
                 <meanElements>
                   <EPOCH>2020-05-16T14:00:01</EPOCH>
                   <MEAN_MOTION>15.05603711</MEAN_MOTION>
                   <ECCENTRICITY>0.000126</ECCENTRICITY>
                   <INCLINATION>52.9991</INCLINATION>
                   <RA_OF_ASC_NODE>157.611</RA_OF_ASC_NODE>
                   <ARG_OF_PERICENTER>75.9191</ARG_OF_PERICENTER>
                   <MEAN_ANOMALY>151.2104</MEAN_ANOMALY>
                 </meanElements>
                 <tleParameters>
                   <EPHEMERIS_TYPE>0</EPHEMERIS_TYPE>
                   <CLASSIFICATION_TYPE>U</CLASSIFICATION_TYPE>
                   <NORAD_CAT_ID>44915</NORAD_CAT_ID>
                   <ELEMENT_SET_NO>999</ELEMENT_SET_NO>
                   <REV_AT_EPOCH>1986</REV_AT_EPOCH>
                   <BSTAR>0.0006442</BSTAR>
                   <MEAN_MOTION_DOT>0.00009125</MEAN_MOTION_DOT>
                   <MEAN_MOTION_DDOT>0</MEAN_MOTION_DDOT>
                 </tleParameters>
                 <userDefinedParameters>
                   <USER_DEFINED parameter="TLE_LINE0">0 STARLINK-1084</USER_DEFINED>
                   <USER_DEFINED parameter="TLE_LINE1">
                      1 44915U 20211B 20137.58334491 +.00009125 +00000-0 +64420-3 0 9992
                   </USER_DEFINED>
                   <USER_DEFINED parameter="TLE_LINE2">
                      2 44915 052.9991 157.6110 0001260 075.9191 151.2104
      15.05603711019869
                   </USER_DEFINED>
                 </userDefinedParameters>
               </data>
            </segment>
          </body>
        </omm>
        <omm id="CCSDS_OMM_VERS" version="3.0">
          <header>
            <COMMENT>GENERATED VIA SPACE-TRACK.ORG API</COMMENT>
            <CREATION_DATE>2020-05-16T14:00:01</CREATION_DATE>
            <ORIGINATOR>18 SPCS</ORIGINATOR>
          </header>
          <body>
            <segment>
               <metadata>
                 <OBJECT_NAME>STARLINK-1097</OBJECT_NAME>
                 <OBJECT_ID>2020-001C</OBJECT_ID>
                 <CENTER_NAME>EARTH</CENTER_NAME>
                 <REF_FRAME>TEME</REF_FRAME>
                 <TIME_SYSTEM>UTC</TIME_SYSTEM>
                 <MEAN_ELEMENT_THEORY>SGP4</MEAN_ELEMENT_THEORY>
               </metadata>
               <data>
                 <meanElements>
                   <EPOCH>2020-05-16T14:00:01</EPOCH>
                   <MEAN_MOTION>15.05559315</MEAN_MOTION>
                   <ECCENTRICITY>0.0001361</ECCENTRICITY>
                   <INCLINATION>52.999</INCLINATION>
                   <RA_OF_ASC_NODE>157.6123</RA_OF_ASC_NODE>
                   <ARG_OF_PERICENTER>94.2334</ARG_OF_PERICENTER>
                   <MEAN_ANOMALY>78.9025</MEAN_ANOMALY>
                 </meanElements>

    Figure G-21: Aggregating Multiple ODMs into a Single NDM File (Continued)

                 <tleParameters>
                   <EPHEMERIS_TYPE>0</EPHEMERIS_TYPE>
                   <CLASSIFICATION_TYPE>U</CLASSIFICATION_TYPE>
                   <NORAD_CAT_ID>44916</NORAD_CAT_ID>
                   <ELEMENT_SET_NO>999</ELEMENT_SET_NO>
                   <REV_AT_EPOCH>1986</REV_AT_EPOCH>
                   <BSTAR>0.00072742</BSTAR>
                   <MEAN_MOTION_DOT>0.00010329</MEAN_MOTION_DOT>
                   <MEAN_MOTION_DDOT>0</MEAN_MOTION_DDOT>
                 </tleParameters>
                 <userDefinedParameters>
                   <USER_DEFINED parameter="TLE_LINE0">0 STARLINK-1097</USER_DEFINED>
                   <USER_DEFINED parameter="TLE_LINE1">
                     1 44916U 20211C 20137.58334491 +.00010329 +00000-0 +72742-3 0 9997
                   </USER_DEFINED>
                   <USER_DEFINED parameter="TLE_LINE2">
                     2 44916 052.9990 157.6123 0001361 094.2334 078.9025
      15.05559315019865
                   </USER_DEFINED>
                 </userDefinedParameters>
               </data>
             </segment>
          </body>
        </omm>
      </ndm>

    Figure G-21: Aggregating Multiple ODMs into a Single NDM File (Continued)

      <?xml version="1.0" encoding="UTF-8"?>
      <ndm xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:noNamespaceSchemaLocation="https://sanaregistry.org/r/ndmxml_unqualified/ndmxml-
      3.0.0-master-3.0.xsd">

      <COMMENT>This example combines an OPM, OMM, OEM, and OCM in a single Navigation
      Data Message XML.</COMMENT>
      <COMMENT>NOTE – In this case the messages are unrelated, but show how, in
      principle, related </COMMENT>
      <COMMENT>messages could be combined to satisfy a specific use case.</COMMENT>

      <opm id="CCSDS_OPM_VERS" version="3.0">
         <header>
           <COMMENT>Example Orbit Parameter Message</COMMENT>
           <COMMENT>The OPM includes a set of orbital elements at time t, and an
      impulsive maneuver design with MAN_EPOCH_IGNITION = t.</COMMENT>
             <CREATION_DATE>2009-05-18T13:06:00</CREATION_DATE>
             <ORIGINATOR>NASA</ORIGINATOR>
         </header>
         <body>
             <segment>
                <metadata>
                   <OBJECT_NAME>SOHO</OBJECT_NAME>
                   <OBJECT_ID>2009-000A</OBJECT_ID>
                   <CENTER_NAME>EARTH</CENTER_NAME>
                   <REF_FRAME>EME2000</REF_FRAME>
                   <TIME_SYSTEM>UTC</TIME_SYSTEM>
                </metadata>
                <data>
                   <stateVector>
                       <EPOCH>2009-05-12T15:30:00</EPOCH>
                       <X>687754.36358524448</X>
                       <Y>941287.85553999904</Y>
                       <Z>520080.81101286016</Z>
                       <X_DOT>-0.41396551860286032</X_DOT>
                       <Y_DOT>0.29174462217893128</Y_DOT>
                       <Z_DOT>0.11756781919443198</Z_DOT>
                   </stateVector>
                   <maneuverParameters>
                       <COMMENT>The below contains information for the impulsive
      maneuver.</COMMENT>
                       <MAN_EPOCH_IGNITION>2009-05-12T15:30:00</MAN_EPOCH_IGNITION>
                       <MAN_DURATION>0</MAN_DURATION>
                       <MAN_DELTA_MASS>-0.0252069575402913408</MAN_DELTA_MASS>
                       <MAN_REF_FRAME>EME2000</MAN_REF_FRAME>
                       <MAN_DV_1>0.000028562811624</MAN_DV_1>
                       <MAN_DV_2>3.0883529021E-7</MAN_DV_2>
                       <MAN_DV_3>1.4646782842E-8</MAN_DV_3>
                   </maneuverParameters>
                </data>
             </segment>
         </body>
      </opm>

      <omm   id="CCSDS_OMM_VERS" version="3.0">
         <header>
            <COMMENT> Example Orbit Mean-Elements Message</COMMENT>
            <COMMENT> ODM PROTOTYPING FOR CCSDS 502.0-P-1.1 - TEST NUMBER 4</COMMENT>
            <CREATION_DATE>2009-091T16:00:00</CREATION_DATE>
            <ORIGINATOR>CNES</ORIGINATOR>
         </header>

 Figure G-22:     Aggregating OPM, OMM, OEM, and OCM in a Single Navigation
                  Data Message XML

         <body>
             <segment>
                <metadata>
                   <OBJECT_NAME>ISS-ZARYA</OBJECT_NAME>
                   <OBJECT_ID>2022-067A</OBJECT_ID>
                   <CENTER_NAME>EARTH</CENTER_NAME>
                   <REF_FRAME>TEME</REF_FRAME>
                   <TIME_SYSTEM>UTC</TIME_SYSTEM>
                   <MEAN_ELEMENT_THEORY>SGP4</MEAN_ELEMENT_THEORY>
                </metadata>
                <data>
                   <COMMENT>USAF SGP4 IS THE ONLY PROPAGATOR THAT SHOULD BE USED FOR
      THIS DATA</COMMENT>
                   <meanElements>
                       <EPOCH>2009-087T11:58:23.211264</EPOCH>
                       <MEAN_MOTION>15.71784080</MEAN_MOTION>
                       <ECCENTRICITY>0.0009738</ECCENTRICITY>
                       <INCLINATION>51.6429</INCLINATION>
                       <RA_OF_ASC_NODE>0.4159</RA_OF_ASC_NODE>
                       <ARG_OF_PERICENTER>166.5533</ARG_OF_PERICENTER>
                       <MEAN_ANOMALY>354.9076</MEAN_ANOMALY>
                   </meanElements>
                   <tleParameters>
                       <EPHEMERIS_TYPE>0</EPHEMERIS_TYPE>
                       <CLASSIFICATION_TYPE>U</CLASSIFICATION_TYPE>
                       <NORAD_CAT_ID>25544</NORAD_CAT_ID>
                       <ELEMENT_SET_NO>557</ELEMENT_SET_NO>
                       <REV_AT_EPOCH>59325</REV_AT_EPOCH>
                       <BSTAR>-0.21414E-3</BSTAR>
                       <MEAN_MOTION_DOT>0.00027894</MEAN_MOTION_DOT>
                       <MEAN_MOTION_DDOT>0.0</MEAN_MOTION_DDOT>
                   </tleParameters>
                </data>
             </segment>
         </body>
      </omm>

      <oem id="CCSDS_OEM_VERS" version="3.0">
         <header>
            <COMMENT>Example Orbit Ephemeris Message</COMMENT>
            <CREATION_DATE>2009-02-05T10:09:12</CREATION_DATE>
            <ORIGINATOR>JAXA</ORIGINATOR>
         </header>
         <body>
            <segment>
                <metadata>
                   <OBJECT_NAME>SELENE</OBJECT_NAME>
                   <OBJECT_ID>131</OBJECT_ID>
                   <CENTER_NAME>EARTH</CENTER_NAME>
                   <REF_FRAME>EME2000</REF_FRAME>
                   <TIME_SYSTEM>UTC</TIME_SYSTEM>
                   <START_TIME>2007-09-14T10:43:00.000000</START_TIME>
                   <STOP_TIME>2007-09-14T10:47:00.000000</STOP_TIME>
                   <INTERPOLATION>Hermite</INTERPOLATION>
                   <INTERPOLATION_DEGREE>7</INTERPOLATION_DEGREE>
                </metadata>
                <data>
                   <stateVector>
                       <EPOCH>2007-09-14T10:43:00.000000</EPOCH>
                       <X>1.336886031675458E+03</X>
                       <Y>9.480146566872711E+04</Y>
                       <Z>3.266088528177066E+04</Z>
                       <X_DOT>-6.305293974707967E-01</X_DOT>
                       <Y_DOT>1.848864859994888E+00</Y_DOT>
                       <Z_DOT>9.377640352829226E-01</Z_DOT>
                   </stateVector>

 Figure G-22:     Aggregating OPM, OMM, OEM, and OCM in a Single Navigation
                  Data Message XML (Continued)

                   <stateVector>
                      <EPOCH>2007-09-14T10:44:00.000000</EPOCH>
                      <X>1.299053338219702E+03</X>
                      <Y>9.491233015399727E+04</Y>
                      <Z>3.271712789822781E+04</Z>
                      <X_DOT>-6.305602161673365E-01</X_DOT>
                      <Y_DOT>1.846618917569059E+00</Y_DOT>
                      <Z_DOT>9.369900978163187E-01</Z_DOT>
                   </stateVector>
                   <stateVector>
                      <EPOCH>2007-09-14T10:45:00.000000</EPOCH>
                      <X>1.261218825877070E+03</X>
                      <Y>9.502306005072314E+04</Y>
                      <Z>3.277332412355368E+04</Z>
                      <X_DOT>-6.305900282238581E-01</X_DOT>
                      <Y_DOT>1.844378570838882E+00</Y_DOT>
                      <Z_DOT>9.362176632629805E-01</Z_DOT>
                   </stateVector>
                   <stateVector>
                      <EPOCH>2007-09-14T10:46:00.000000</EPOCH>
                      <X>1.223382554832220E+03</X>
                      <Y>9.513365569386665E+04</Y>
                      <Z>3.282947404774766E+04</Z>
                      <X_DOT>-6.306188407720047E-01</X_DOT>
                      <Y_DOT>1.842143793832282E+00</Y_DOT>
                      <Z_DOT>9.354467257772656E-01</Z_DOT>
                   </stateVector>
                   <stateVector>
                      <EPOCH>2007-09-14T10:47:00.000000</EPOCH>
                      <X>1.185544584842622E+03</X>
                      <Y>9.524411741683590E+04</Y>
                      <Z>3.288557776045905E+04</Z>
                      <X_DOT>-6.306466608867719E-01</X_DOT>
                      <Y_DOT>1.839914560746108E+00</Y_DOT>
                      <Z_DOT>9.346772795446093E-01</Z_DOT>
                   </stateVector>
                </data>
             </segment>
          </body>
      </oem>

      <ocm id="CCSDS_OCM_VERS" version="3.0">

         <header>
            <COMMENT>Example G-4 from OCM P2.40</COMMENT>
            <COMMENT>OCM example with multiple trajectory state time histories, a
      maneuver, OD, Cartesian and Keplerian ephemeris</COMMENT>
            <CREATION_DATE>2022-11-06T09:23:57</CREATION_DATE>
            <ORIGINATOR>JAPAN AEROSPACE EXPLORATION AGENCY</ORIGINATOR>
         </header>

         <body>
            <segment>
                <metadata>
                   <OBJECT_NAME>OSPREY 5</OBJECT_NAME>
                   <INTERNATIONAL_DESIGNATOR>2022-999A</INTERNATIONAL_DESIGNATOR>
                   <CATALOG_NAME>CSPOC</CATALOG_NAME>
                   <OBJECT_DESIGNATOR>98765</OBJECT_DESIGNATOR>
                   <TIME_SYSTEM>UTC</TIME_SYSTEM>
                   <EPOCH_TZERO>2022-12-18T14:28:15.1172</EPOCH_TZERO>
                </metadata>

                <data>
                   <traj>
                       <TRAJ_BASIS>PREDICTED</TRAJ_BASIS>
                       <CENTER_NAME>EARTH</CENTER_NAME>
                       <TRAJ_REF_FRAME>TOD_EARTH</TRAJ_REF_FRAME>
                       <TRAJ_FRAME_EPOCH>2022-12-18T14:28:15.1172</TRAJ_FRAME_EPOCH>
                       <USEABLE_START_TIME>2022-12-18T14:28:15.1172</USEABLE_START_TIME>

 Figure G-22:     Aggregating OPM, OMM, OEM, and OCM in a Single Navigation
                  Data Message XML (Continued)

                     <USEABLE_STOP_TIME>2022-12-18T14:28:45.1172</USEABLE_STOP_TIME>
                     <TRAJ_TYPE>CARTPVA</TRAJ_TYPE>
                     <TRAJ_UNITS>[km, km, km, km/s, km/s, km/s, km/s**2, km/s**2,
      km/s**2]</TRAJ_UNITS>
                     <trajLine> 0.0 2854.5 -2916.2 -5360.7 5.90 4.86 0.52 0.0037 -
      0.0038 -0.0070</trajLine>
                     <trajLine>120.0 5478.6    434.3 -3862.5 2.50 5.87 4.29 0.0072
      0.0006 -0.0051</trajLine>
                     <trajLine>240.0 4146.0 -1655.8 -5038.3 4.80 5.58 2.16 0.0054 -
      0.0022 -0.0066</trajLine>
                     <trajLine>500.0 -1553.4 -4848.7 -4406.5 6.73 1.01 -3.53 -0.002 -
      0.0063 -0.0058</trajLine>
                  </traj>
                   <traj>
                      <TRAJ_BASIS>DETERMINED</TRAJ_BASIS>
                      <CENTER_NAME>EARTH</CENTER_NAME>
                      <TRAJ_REF_FRAME>J2000</TRAJ_REF_FRAME>
                      <TRAJ_TYPE>KEPLERIAN</TRAJ_TYPE>
                      <TRAJ_UNITS>[km, n/a, deg, deg, deg, deg]</TRAJ_UNITS>
                      <trajLine>0.000000 6600.0 .03 28.5 50.0 30.0 10.0</trajLine>
                      <trajLine>120.000000 6600.0 .03 28.5 50.0 30.0 10.1</trajLine>
                      <trajLine>240.000000 6600.0 .03 28.5 50.0 30.0 10.2</trajLine>
                      <trajLine>500.000000 6600.0 .03 28.5 50.0 30.0 35.0</trajLine>
                   </traj>

                   <phys>
                      <COMMENT>Spacecraft Physical Characteristics</COMMENT>
                      <DRAG_CONST_AREA units="m**2">10.00</DRAG_CONST_AREA>
                      <DRAG_COEFF_NOM>2.3</DRAG_COEFF_NOM>
                      <WET_MASS units="kg">100.0</WET_MASS>
                      <SRP_CONST_AREA units="m**2">4</SRP_CONST_AREA>
                      <SOLAR_RAD_COEFF >1.3</SOLAR_RAD_COEFF >
                   </phys>
                  <man>
                     <COMMENT>200 s of 10N thrust (in-track transitioning to radial)</COMMENT>
                     <COMMENT>w/effic η=0.95, Isp=300s, 5% 1-sigma error</COMMENT>
                     <MAN_ID>E_W_20160305B</MAN_ID>
                     <MAN_BASIS>CANDIDATE</MAN_BASIS>
                     <MAN_DEVICE_ID>THR_01</MAN_DEVICE_ID>
                     <MAN_PURPOSE>ORBIT</MAN_PURPOSE>
                     <MAN_REF_FRAME>RSW_ROTATING</MAN_REF_FRAME>
                     <DC_TYPE>CONTINUOUS</DC_TYPE>
                     <MAN_COMPOSITION>TIME_RELATIVE MAN_DURA, THR_X, THR_Y, THR_Z,
      THR_MAG_SIGMA, THR_INTERP, THR_ISP, THR_EFFIC</MAN_COMPOSITION>
                     <MAN_UNITS>[s, N, N, N, %, n/a, s, n/a]</MAN_UNITS>
                     <manLine>500.0 200.0 0.0 10.0 0.0 5.0 ON 300.0 0.95</manLine>
                     <manLine>700.0 200.0 0.0 10.0 0.0 5.0 OFF 300.0 0.95</manLine>
                  </man>
                   <pert>
                      <COMMENT>Perturbations specification</COMMENT>
                      <GM>398600.4415</GM>
                   </pert>

                   <od>
                      <COMMENT> Orbit Determination information</COMMENT>
                      <OD_ID>OD #10059</OD_ID>
                      <OD_PREV_ID>OD #10058</OD_PREV_ID>
                      <OD_METHOD>BWLS: BAHN</OD_METHOD>
                      <OD_EPOCH>2001-11-06T11:17:33</OD_EPOCH>
                      <OBS_USED>273</OBS_USED>
                      <TRACKS_USED>91</TRACKS_USED>
                   </od>

                </data>
             </segment>
         </body>
      </ocm>
      </ndm>

 Figure G-22:     Aggregating OPM, OMM, OEM, and OCM in a Single Navigation
                  Data Message XML (Continued)

# ANNEX H

                         INFORMATIVE REFERENCES

                                  (INFORMATIVE)

[H1]   Navigation Data—Definitions and Conventions. Issue 4. Report Concerning Space
       Data System Standards (Green Book), CCSDS 500.0-G-4. Washington, D.C.:
       CCSDS, November 2019.

[H2]   “CelesTrak.” Center for Space Standards & Innovation (CSSI). http://celestrak.com/.

[H3]   David A. Vallado, et al. “Revisiting Spacetrack Report #3.” In Proceedings of the
       AIAA/AAS Astrodynamics Specialist Conference and Exhibit. AIAA 2006-6753.
       Reston, Virginia: AIAA, 2006.

[H4]   “Documentation.” SPICE: NASA’s Solar System Exploration Ancillary Information
       System.       Navigation      and   Ancillary     Information Facility (NAIF).
       http://naif.jpl.nasa.gov/naif/documentation.html.

[H5]   Ground Network Tracking and Acquisition Data Handbook. 453-HNDK-GN.
       Greenbelt, Maryland: Goddard Space Flight Center, May 2007.

[H6]   Daniel L. Oltrogge, T.S. Kelso, and John H. Seago. “Ephemeris Requirements for
       Space Situational Awareness.” In Proceedings of the 21st AAS/AIAA Space Flight
       Mechanics Meeting (13–17 February 2011, New Orleans, Louisiana), AAS 11-151.
       San Diego, California: Univelt, 2011.

[H7]   David A. Vallado. Fundamentals of Astrodynamics and Applications. 4th ed. Space
       Technology Library. El Segundo, California: Microcosm Press, 2013.

[H8]   Daniel L. Oltrogge, Patrick North, and Michael Nicolls. “Multi-Phenomenology
       Observation Network Evaluation Tool (MONET).” In Proceedings of the 15th AMOS
       Surveillance Technologies Conference (9–12 September 2014, Maui, Hawaii). Kihei,
       Hawaii: Maui Economic Development Board, 2014.

[H9]   Salvatore Alfano. “Orbital Covariance Interpolation.” In Proceedings of the 14th
       AAS/AIAA Space Flight Mechanics Meeting (8–12 February 2004, Maui, Hawaii),
       AAS 04-223. San Diego, California: Univelt, 2004.

[H10] Sergei Tanygin. “Attitude Interpolation.” In Proceedings of the 13th AAS/AIAA Space
      Flight Mechanics Meeting (9–13 February 2003, Ponce, Puerto Rico), AAS 03-197.
      San Diego, California: Univelt, 2003.

[H11] Sergei Tanygin. “Efficient Covariance Interpolation Using Blending of Approximate
      State Error Transitions.” In Proceedings of the 2013 AAS/AIAA Astrodynamics
      Specialist Conference (11–15 August 2013, Hilton Head, South Carolina), AAS 13-
      762. San Diego, California: Univelt, 2013.

[H12] James Woodburn and Sergei Tanygin. “Position Covariance Visualization.” In
      Proceedings of the 2002 AIAA/AAS Astrodynamics Specialist Conference and Exhibit
      (Monterey, California, Monterey, California), AIAA 2002-4985. Reston, Virginia:
      AIAA, 2002.

[H13] Salvatore Alfano. “Variance-Covariance Significant Figure Reduction and Its Effect
      on Collision Probability Calculation.” In Proceedings of the 70th International
      Astronautical Congress (IAC) (21–25 October 2019, Washington D.C.), IAC-19-
      A6.2.8.51075. Paris: International Astronautical Federation, 2019.

[H14] DISCOSweb. ESA. https://discosweb.esoc.esa.int/.

[H15] Elliott D. Kaplan and Christopher Hegarty, eds. Understanding GPS/GNSS:
      Principles and Applications. GNSS Technology and Applications. Boston and
      London: Artech, 2017.

[H16] Obed S. Sands, et al. “Dilution of Precision-Based Lunar Navigation Assessment for
      Dynamic Position Fixing.” In Proceedings of the 2006 National Technical Meeting of
      The Institute of Navigation (January 18–20, 2006, Monterey, California), 260–268.
      Manassas, Virginia: ION, 2006.

[H17] Peter C. Hughes. Spacecraft Attitude Dynamics. New York: John Wiley and Sons,
      1986.

# ANNEX I

          ITEMS FOR AN INTERFACE CONTROL DOCUMENT

                                    (INFORMATIVE)

I1     STANDARD ICD ITEMS

In several places in this document, there are references to items that should be specified in an
Interface Control Document (ICD) between participants that supplements an exchange of
ephemeris data. The ICD should be jointly produced by both participants in a cross-support
involving the transfer of ephemeris data. This annex compiles those recommendations into a
single section. Although the Orbit Data Messages described in this document may at times
be used in situations in which participants have not negotiated ICDs, they should be
developed and negotiated whenever specified in this Recommended Standard.

Item                                                                        Section
1) Detailed description of any user defined OPM, OMM, OEM, and 3.2, 4.2, 5.2, 6.2
   OCM parameters used.
2) Detailed description of any exceptions for keyword values not annex B,
   drawn from the SANA registry (sanaregistry.org).              subsection B6

3) Specific information security interoperability provisions that apply annex C
   between agencies.

# ANNEX J

                  CHANGES VERSUS PREVIOUS VERSION

                                  (INFORMATIVE)

This annex lists the differences between ODM 2.0 and ODM 3.0. The differences are
divided into those which affect the content of one or more of the orbit data messages, and
those which only affect the document.

J1   CHANGES IN THE MESSAGES

1. The OCM was added to provide better support for ISO Technical Committee 20,
   Subcommittee 14 objectives (see section 6).

2. MESSAGE_ID was added to the OPM, OMM, and OEM to provide better satisfaction of
   requirement P10 (identification and annotation of messages).

3. EPHEMERIS_TYPE was updated in the OMM to reflect currently used numbering
   scheme.

4. BSTAR and MEAN_MOTION_DDOT fields are paired with BTERM and AGOM
   parameters to support the SGP and SGP4 propagators as well as the new SGP4-XP
   propagator, respectively.

J2   CHANGES IN THE DOCUMENT

1. A new CCSDS repository for normative keyword values for navigation messages has
   been created at the SANA Registry, accessible on the Internet at:
   https://sanaregistry.org/r/navigation_standard_normative_annexes/. (See annex B for
   details on the affected keywords and links to the content.)

2. Several annexes were added. Some are required by CCSDS rule changes, and some are
   for the provision of supplementary material.

3. Examples for OPM, OMM, and OEM that formerly appeared in sections 3, 4, and 5,
   respectively, have been moved to an informative annex.

4. The ‘Checklist ICD’ that was added in ODM Version 2 has been discontinued. This
   Checklist ICD, intended to convey information that the OPM, OEM, and OMM did not
   address, such as third-body perturbations, solar pressure model, solid tides, ocean tides,
   Earth albedo, and polar motion, has now been replaced by the material that can be
   specified in the Orbit Comprehensive Message.

