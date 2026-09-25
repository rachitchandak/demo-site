# Assure Scanner: eAccess check catalogue

Every accessibility check in `assure-scanner/engine/src/main/java/com/tcs/eaccess`, grouped by component, with the guidelines each check reports against.

Sources:
- **Checks:** every `addFailedCheck` and `addPassedCheck` call in the check files. Computed IDs are resolved, for example `prevLevel + 40` in the headings check and `93 + i` in the meta check.
- **Messages, severities and guidelines:** `assure-scanner/scanner/src/main/resources/masterdata.json`, the bundled copy of the platform tables. The scanner maps each finding through this chain: check ID → the check's checkpoint → that checkpoint's success criteria (`PageScanner.criteriaFor`).

## How to read this

- **Component:** a folder under `checks/`.
- **File = checkpoint class.** Masterdata's `check_class` names the file. `ValidatorAnalyzer` loads the `.js` file of every checkpoint enabled for the selected levels and calls the file's function on each element whose tag matches the checkpoint's `html_tag`. Java classes run through WebDriver.
- **Check:** one numbered failure mode. A file usually raises several. The **Check** column gives the masterdata `errorMessage`, which is what appears in the report.
- **Severity:** masterdata severity 0 or 1 is reported as Error, 2 as Warning and 3 as Recommendation.
- **Guidelines:** come from the checkpoint that owns the check in masterdata. **WCAG 2.2** lists success criteria with their level. **Other standards** lists Section 508 §1194.22 paragraphs, EN 301 549 and IS 17802 clauses, GIGW clauses, and TCS guideline numbers. At scan time the scanner shows only the criteria for the levels you selected.
- *Counted under checkpoint N*: the check is raised by this file, but masterdata files it under a different checkpoint. The report groups and tallies it there.
- **⚠ never recorded:** the code references the ID, but a bug stops it from reaching a report. The file's notes give the reason.
- **Unmapped:** the ID is not in masterdata. The scanner shows it as "Unmapped check N" with no guidelines.

## Summary

The 19 component folders hold 194 files, plus 4 shared infrastructure files (section 20). Between them they raise **562 distinct checks** that can reach a report. Appendix A lists 32 more masterdata checks that no code raises.

| # | Component | Files | Checks | WCAG 2.2 criteria covered |
|---:|---|---:|---:|---|
| 1 | [Blockquote](#1-blockquote-checksblockquote) | 1 | 3 | 1.3.1 |
| 2 | [Consistency](#2-consistency-checksconsistency) | 7 | 8 | 3.2.1, 3.2.3, 3.2.4, 3.2.5, 3.2.6 |
| 3 | [CSS](#3-css-checkscss) | 2 | 2 | 1.3.2 |
| 4 | [Dynamic elements (widgets)](#4-dynamic-elements-widgets-checksdynamicelements) | 15 | 136 | 1.1.1, 1.3.1, 1.3.2, 1.4.3, 1.4.5, 1.4.11, 1.4.13, 2.1.1, 2.1.2, 2.2.2, 2.4.3, 2.4.4, 2.4.7, 2.4.8, 3.2.1, 4.1.2, 4.1.3 |
| 5 | [External content (applet, embed, object)](#5-external-content-applet-embed-object-checksexternal) | 3 | 12 | 1.1.1, 2.1.2, 2.4.7 |
| 6 | [Forms](#6-forms-checksforms) | 14 | 54 | 1.1.1, 1.3.1, 1.3.5, 2.5.3, 3.2.1, 3.3.1, 3.3.2, 3.3.3, 3.3.4, 3.3.5, 3.3.6, 3.3.9 |
| 7 | [Frames](#7-frames-checksframes) | 1 | 10 | 1.4.4, 2.4.1, 4.1.2 |
| 8 | [Headings](#8-headings-checksheadings) | 4 | 14 | 1.3.1, 2.4.6, 2.4.10 |
| 9 | [Images](#9-images-checksimages) | 6 | 38 | 1.1.1, 1.3.1, 1.4.5, 2.4.4, 3.2.1, 3.3.2 |
| 10 | [Keyboard](#10-keyboard-checkskeyboard) | 24 | 49 | 1.4.10, 2.1.1, 2.1.3, 2.1.4, 2.4.1, 2.4.3, 2.4.11, 2.4.12, 2.4.13, 3.2.2, 4.1.2 |
| 11 | [Links](#11-links-checkslinks) | 12 | 23 | 1.3.1, 2.4.1, 2.4.4, 2.4.9, 3.2.1, 4.1.2 |
| 12 | [Lists](#12-lists-checkslist) | 3 | 6 | 1.3.1 |
| 13 | [Markup and ARIA](#13-markup-and-aria-checksmarkup) | 19 | 70 | 1.3.1, 2.1.1, 2.4.1, 2.4.6, 2.5.2, 2.5.7, 3.3.2, 4.1.2 |
| 14 | [Multimedia](#14-multimedia-checksmultimedia) | 18 | 26 | 1.2.1, 1.2.2, 1.2.3, 1.2.5, 1.2.6, 1.2.7, 1.2.8, 1.2.9, 1.4.2, 1.4.7, 2.1.2, 2.2.2 |
| 15 | [Others](#15-others-checksothers) | 12 | 15 | 1.3.1, 1.3.6, 2.4.5, 2.5.5, 2.5.8, 3.1.3, 3.1.4, 3.1.5, 3.1.6, 3.3.7, 3.3.8 |
| 16 | [Page information](#16-page-information-checkspageinfo) | 30 | 51 | 1.3.4, 1.4.4, 1.4.8, 1.4.10, 1.4.12, 2.2.1, 2.2.3, 2.2.4, 2.2.5, 2.2.6, 2.3.2, 2.3.3, 2.4.2, 2.4.8, 2.5.1, 2.5.4, 2.5.6, 3.1.1, 3.1.2, 3.2.5, 4.1.3 |
| 17 | [Paragraphs](#17-paragraphs-checksparagraph) | 2 | 4 | 1.3.1, 1.4.8 |
| 18 | [Tables](#18-tables-checkstables) | 4 | 19 | 1.3.1 |
| 19 | [Visual](#19-visual-checksvisual) | 17 | 23 | 1.3.3, 1.4.1, 1.4.3, 1.4.6, 1.4.11, 1.4.13, 2.2.2 |

## 1. Blockquote (`checks/blockquote`)

### [`ValidityCheck.js`](checks/blockquote/ValidityCheck.js)

- Checkpoint **9**: Blockquote, group *Blockquote*, runs on `blockquote|q`
- Runtime: JavaScript (in page)

Runs on `<blockquote>` and `<q>`. Fails 139 when there is no `cite` attribute. Always raises 421 and 422 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 139 | Blockquote should not be used for visual presentation purpose | Recommendation | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 421 | Longer quotes to be included in `<blockquote>` | Recommendation | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 422 | Shorter quoted to be included in `<q>` | Recommendation | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

## 2. Consistency (`checks/consistency`)

### [`ChangeOnRequestCheck.js`](checks/consistency/ChangeOnRequestCheck.js)

- Checkpoint **187**: Change on Request, group *Change on Request*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 463 | New window opens when a page is loaded. | Recommendation | 3.2.1 On Focus (A)<br>3.2.5 Change on Request (AAA) | EN 9.3.2.1 · IS 9.3.2.1 · GIGW 7.5 (i) · TCS 9.5 |

### [`ConsistentElementIdentificationCheck.js`](checks/consistency/ConsistentElementIdentificationCheck.js)

- Checkpoint **179**: Consistent identification of Repeated content, group *Consistancy of repeated content*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 454 | Labelling Mismatch for the content repeated across webpages. | Recommendation | 3.2.4 Consistent Identification (AA) | EN 9.3.2.4 · IS 9.3.2.4 · GIGW 5.4.2 · TCS 9.4 |

### [`ConsistentIdentificationCheck.java`](checks/consistency/ConsistentIdentificationCheck.java)

- Checkpoint **39**: Consistent identification of Repeated content, group *Consistancy of repeated content*, runs on `img|a`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver, once per page, over every `img` and `a`, and only when its checkpoint is selected. It remembers the text used for each link `href` and the `alt` used for each image `src`. It fails 136 when the same `href` appears again with different or empty link text. It fails 135 when the same image `src` (outside a link) appears again with different or empty `alt`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 135 | Repeated images not consistent | Warning | 3.2.4 Consistent Identification (AA) | EN 9.3.2.4 · IS 9.3.2.4 · GIGW 5.4.2 · TCS 9.4 |
| 136 | Repeated links not consistent | Warning | 3.2.4 Consistent Identification (AA) | EN 9.3.2.4 · IS 9.3.2.4 · GIGW 5.4.2 · TCS 9.4 |

### [`ConsistentIdentificationCheck.js`](checks/consistency/ConsistentIdentificationCheck.js)

- Checkpoint **39**: Consistent identification of Repeated content, group *Consistancy of repeated content*, runs on `img|a`
- Runtime: JavaScript (in page)

Contains only the JS helpers `getLinkText` and `getImageAlt`, and its check function is empty. The Java class of the same name does the checking.

*This file raises no checks.*

### [`ConsistentNavigationCheck.js`](checks/consistency/ConsistentNavigationCheck.js)

- Checkpoint **172**: Consistent Navigation, group *Consistancy of repeated content*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 444 | Navigational mechanisms that are repeated on multiple Web pages is not in consistent order. | Recommendation | 3.2.3 Consistent Navigation (AA) | EN 9.3.2.3 · IS 9.3.2.3 · GIGW 6.2.1, 6.8.2 · TCS 9.3 |
| 445 | Navigational Links that are repeated on multiple Web pages is not in consistent order. | Recommendation | 3.2.3 Consistent Navigation (AA) | EN 9.3.2.3 · IS 9.3.2.3 · GIGW 6.2.1, 6.8.2 · TCS 9.3 |

### [`HelpCheck.js`](checks/consistency/HelpCheck.js)

- Checkpoint **196**: Consistent Help, group *Consistancy of repeated content*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 476 | Help option is not consistent across webpages. | Recommendation | 3.2.6 Consistent Help (A) | TCS 9.6 |

### [`IconButtonConsistencyCheck.js`](checks/consistency/IconButtonConsistencyCheck.js)

- Checkpoint **253**: Repeated icons are labelled consistently, group *Consistancy of repeated content*, runs on `button`
- Runtime: JavaScript (in page)

Runs on icon-only buttons (`button` or `role=button` with no text). It finds other icon-only buttons that use the same icon, either an SVG `<use href>` or a glyph class. It fails 551 when their `aria-label` or `title` values differ.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 551 | Repeated icon has inconsistent labels | Warning | 3.2.4 Consistent Identification (AA) | (none) |

## 3. CSS (`checks/css`)

### [`ContentCheck.js`](checks/css/ContentCheck.js)

- Checkpoint **110**: CSS content, group *CSS & Logical Order*, runs on `all`
- Runtime: JavaScript (in page)

Reads the computed CSS `content` value, but its failure (334) is commented out, so this check emits nothing.

*This file raises no checks.*

### [`ContentSequenceCheck.js`](checks/css/ContentSequenceCheck.js)

- Checkpoint **171**: Meaningful Sequence, group *CSS & Logical Order*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 442 | Order of the content is not in a meaningful sequence. | Recommendation | 1.3.2 Meaningful Sequence (A) | EN 9.1.3.2 · IS 9.1.3.2 · GIGW 5.6.4 · TCS 4.4 |
| 443 | Change in Text direction is not rendered properly. | Recommendation | 1.3.2 Meaningful Sequence (A) | EN 9.1.3.2 · IS 9.1.3.2 · GIGW 5.6.4 · TCS 4.4 |

## 4. Dynamic elements (widgets) (`checks/dynamicelements`)

These are Java classes that run through WebDriver on widgets that `WidgetDetector` found (`ValidatorAnalyzer.runWidgetCheck`). A widget check runs when its checkpoint is enabled for the selected levels. Each widget run first calls `addFailedCheck(0)`, a sentinel that marks the widget as evaluated. The scanner discards IDs of 0 or below, so the sentinel is not listed here.

### [`AccordionCheck.java`](checks/dynamicelements/AccordionCheck.java)

- Checkpoint **261**: Name, state, role, value for accordion, group *Widgets*, runs on `div`
- Checkpoint **262**: Keyboard interaction for accordion, group *Widgets*, runs on `div`
- Checkpoint **263**: Info and Relationships for accordion, group *Widgets*, runs on `div`
- Checkpoint **264**: Visible focus for accordion, group *Widgets*, runs on `div`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each accordion that `WidgetDetector` finds. It checks each header (`[aria-expanded]`, `[aria-controls]`, `summary`, buttons) and its panel. Check 566 compares `aria-expanded` with whether the panel is actually visible.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 564 | Accordion header is not a button and has no button role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 565 | aria-expanded not defined on one or more accordion headers | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 566 | aria-expanded does not reflect the actual visibility of the panel | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 567 | aria-controls on the accordion header does not resolve to the panel | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 568 | Accordion header cannot be operated with Enter | Error | 2.1.1 Keyboard (A) | (none) |
| 569 | Accordion header cannot be operated with Space | Error | 2.1.1 Keyboard (A) | (none) |
| 570 | Accordion header is not wrapped in a heading element | Warning | 1.3.1 Info and Relationships (A) | (none) |
| 571 | Focus on accordion header is not visible | Error | 2.4.7 Focus Visible (AA) | (none) |

### [`BreadcrumbCheck.java`](checks/dynamicelements/BreadcrumbCheck.java)

- Checkpoint **270**: Location for breadcrumb, group *Widgets*, runs on `nav|ol|ul`
- Checkpoint **271**: Name, state, role, value for breadcrumb, group *Widgets*, runs on `nav|ol|ul`
- Checkpoint **272**: Info and Relationships for breadcrumb, group *Widgets*, runs on `nav|ol|ul`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each breadcrumb trail that `WidgetDetector` finds. It checks the navigation container, its accessible name, the list structure, and how the current page is marked.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 584 | Current page is not identified in the breadcrumb trail | Error | 2.4.8 Location (AAA) | (none) |
| 585 | Breadcrumb navigation is not inside a nav landmark | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 586 | Breadcrumb nav landmark does not have an accessible name | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 587 | Breadcrumb separators are exposed to assistive technology | Warning | 1.3.1 Info and Relationships (A) | (none) |
| 588 | Breadcrumb trail is not marked up as a list | Warning | 1.3.1 Info and Relationships (A) | (none) |

### [`CaptchaCheck.java`](checks/dynamicelements/CaptchaCheck.java)

- Checkpoint **72**: Keyboard interaction for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **73**: No keyboard trap for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **74**: Alternative to the CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **75**: Meaningful element sequence for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **76**: Meaningful link texts for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **77**: Color contrast (Minimum) for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **78**: Visible focus for CAPTCHA, group *Widgets*, runs on `form`
- Checkpoint **79**: Images of text for CAPTCHA, group *Widgets*, runs on `form`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each CAPTCHA that `WidgetDetector` finds. It checks keyboard operation and traps, whether an alternative version exists and where it is described, replay for audio CAPTCHAs, element purpose, reading sequence, link text, contrast, visible focus and images of text. Check 194 is commented out.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 195 | All functionality of CAPTCHA cannot be completed using keyboard | Warning | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 196 | Keyboard focus gets trapped in the CAPTCHA | Warning | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 197 | Alternate version of CAPTCHA missing | Warning | 1.1.1 Non-text Content (A) | 508 (a), (n) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.4 |
| 198 | Location of alternate version of CAPTCHA not described in the text alternative | Warning | 1.1.1 Non-text Content (A) | 508 (a), (n) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.4 |
| 199 | One or more elements missing purpose | Error | 1.1.1 Non-text Content (A) | 508 (a), (n) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.4 |
| 200 | No option to replay the audio CAPTCHA | Warning | 1.1.1 Non-text Content (A) | 508 (a), (n) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.4 |
| 201 | One or more elements do not appear in a meaningful sequence | Warning | 1.3.2 Meaningful Sequence (A)<br>2.4.3 Focus Order (A) | EN 9.1.3.2, 9.2.4.3 · IS 9.1.3.2, 9.2.4.3 · GIGW 5.6.4, 7.5 (m) · TCS 8.5 |
| 202 | One or more links in the CAPTCHA may not have meaningful text | Warning | 2.4.4 Link Purpose (In Context) (A) | EN 9.2.4.4 · IS 9.2.4.4 · GIGW 7.5 (h) · TCS 8.7 |
| 203 | One or more components fail to satisfy the minimum color contrast | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 204 | One or more elements do not have a visible keyboard focus indicator | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 205 | One or more elements may have images in place of text | Warning | 1.4.5 Images of Text (AA) | EN 9.1.4.5 · IS 9.1.4.5 · GIGW 6.6.1 · TCS 5.5 |

### [`CarouselCheck.java`](checks/dynamicelements/CarouselCheck.java)

- Checkpoint **80**: Pause/Stop/Hide carousel, group *Widgets*, runs on `div`
- Checkpoint **81**: Keyboard interaction for carousel, group *Widgets*, runs on `div`
- Checkpoint **82**: No keyboard trap for carousel, group *Widgets*, runs on `div`
- Checkpoint **83**: Name, state, role, value for carousel, group *Widgets*, runs on `div`
- Checkpoint **84**: Image alt text for carousel, group *Widgets*, runs on `div`
- Checkpoint **85**: Info and Relationships for carousel, group *Widgets*, runs on `div`
- Checkpoint **86**: Meaningful link texts for carousel, group *Widgets*, runs on `div`
- Checkpoint **87**: Color contrast (Minimum) for carousel, group *Widgets*, runs on `div`
- Checkpoint **88**: Meaningful element sequence for carousel, group *Widgets*, runs on `div`
- Checkpoint **89**: Visible focus for carousel, group *Widgets*, runs on `div`
- Checkpoint **90**: Images of text for carousel, group *Widgets*, runs on `div`
- Checkpoint **133**: On Focus context change for carousel, group *Widgets*, runs on `div`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each carousel that `WidgetDetector` finds. It checks the pause, stop or hide control (whether it exists, restarts, takes focus, works from the keyboard, and has a name and role), keyboard focus and traps, image `alt` text, heading levels, link text, contrast, reading sequence, visible focus, images of text, and changes of context on focus.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 206 | Option to pause/stop/hide carousel not provided | Warning | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.2, 7.3 |
| 207 | Movement of carousel restarting on its own | Error | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.2, 7.3 |
| 208 | Pause/stop/hide control ties up the user focus | Error | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.2, 7.3 |
| 209 | Pause/stop/hide control does not receive keyboard focus | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 210 | Pause/stop/hide control cannot be activated using keyboard | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 211 | One or more elements do not receive keyboard focus | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 212 | Keyboard focus gets trapped in the carousel | Warning | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 213 | Pause/stop/hide control does not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 214 | Role for pause/stop/hide control is not available | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 215 | Alt text for one or more images is blank. | Warning | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 216 | Alt text for images may not be describing their purpose | Warning | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 217 | Inappropriate heading levels have been used | Warning | 1.3.1 Info and Relationships (A) | 508 (n) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 218 | One or more links in the carousel may not have meaningful text | Warning | 2.4.4 Link Purpose (In Context) (A) | EN 9.2.4.4 · IS 9.2.4.4 · GIGW 7.5 (h) · TCS 8.7 |
| 219 | One or more components fail to satisfy the minimum color contrast | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 220 | One or more elements do not appear in a meaningful sequence | Warning | 1.3.2 Meaningful Sequence (A)<br>2.4.3 Focus Order (A) | EN 9.1.3.2, 9.2.4.3 · IS 9.1.3.2, 9.2.4.3 · GIGW 5.6.4, 7.5 (m) · TCS 8.5 |
| 221 | One or more elements do not have a visible keyboard focus indicator | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 222 | One or more elements may have images in place of text | Warning | 1.4.5 Images of Text (AA) | EN 9.1.4.5 · IS 9.1.4.5 · GIGW 6.6.1 · TCS 5.5 |
| 353 | Change of context is initiated on focus. | Error | 3.2.1 On Focus (A) | EN 9.3.2.1 · IS 9.3.2.1 · GIGW 7.5 (i) · TCS 9.1 |

### [`CommonMethods.java`](checks/dynamicelements/CommonMethods.java)

- No checkpoint in masterdata
- Runtime: Java (WebDriver)

Helper for the widget checks, with shared predicates such as `missingContainerName` and `focusTrapped`. It raises no checks of its own.

*This file raises no checks.*

### [`DatepickerCheck.java`](checks/dynamicelements/DatepickerCheck.java)

- Checkpoint **63**: Keyboard interaction for datepicker, group *Widgets*, runs on `input`
- Checkpoint **64**: No keyboard trap for datepicker, group *Widgets*, runs on `input`
- Checkpoint **65**: Info and Relationships for datepicker, group *Widgets*, runs on `input`
- Checkpoint **66**: Name, state, role, value for datepicker, group *Widgets*, runs on `input`
- Checkpoint **67**: Meaningful link texts for datepicker, group *Widgets*, runs on `input`
- Checkpoint **68**: Color contrast (Minimum) for datepicker, group *Widgets*, runs on `input`
- Checkpoint **69**: Meaningful element sequence for datepicker, group *Widgets*, runs on `input`
- Checkpoint **70**: Visible focus for datepicker, group *Widgets*, runs on `input`
- Checkpoint **71**: Images of text for datepicker, group *Widgets*, runs on `input`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each date picker that `WidgetDetector` finds. It opens the widget and drives it from the keyboard. It checks focus and traps, the calendar grid (grid, row and gridcell roles, column headers, selected and read-only states), accessible names and roles, link text, contrast, reading sequence, visible focus and images of text. Check 225 flags that a date picker is present. A commented-out `checkImage` helper held check 21, which is never raised.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 178 | Datepicker does not receive keyboard focus | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 179 | All functionality of datepicker cannot be completed using keyboard | Warning | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 180 | Appropriate keyboard interaction not provided for datepicker | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 181 | Keyboard focus gets trapped in the datepicker | Error | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 182 | Datepicker column headers not marked properly | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 183 | One or more elements do not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 184 | Role of one or more control not available programmatically in the datepicker | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 185 | Datepicker grid not marked with grid role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 186 | One or more datepicker grid rows not marked with row role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 187 | One or more datepicker grid cells not marked with gridcell role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 188 | Selected state for one or more gridcells not defined in the datepicker | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 189 | One or more links in the datepicker may not have meaningful text | Warning | 2.4.4 Link Purpose (In Context) (A) | EN 9.2.4.4 · IS 9.2.4.4 · GIGW 7.5 (h) · TCS 8.7 |
| 190 | One or more components fail to satisfy the minimum color contrast in the datepicker | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 191 | One or more elements do not appear in a meaningful sequence in the datepicker | Warning | 1.3.2 Meaningful Sequence (A)<br>2.4.3 Focus Order (A) | EN 9.1.3.2, 9.2.4.3 · IS 9.1.3.2, 9.2.4.3 · GIGW 5.6.4, 7.5 (m) · TCS 8.5 |
| 192 | One or more elements do not have a visible keyboard focus indicator in the datepicker | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 193 | One or more elements may have images in place of text in the datepicker | Warning | 1.4.5 Images of Text (AA) | EN 9.1.4.5 · IS 9.1.4.5 · GIGW 6.6.1 · TCS 5.5 |
| 225 | Datepicker field used | Warning | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 426 | Readonly state for grid not defined in the datepicker. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |

### [`DialogCheck.java`](checks/dynamicelements/DialogCheck.java)

- Checkpoint **256**: Keyboard interaction for dialog, group *Widgets*, runs on `div`
- Checkpoint **257**: No keyboard trap for dialog, group *Widgets*, runs on `div`
- Checkpoint **258**: Meaningful element sequence for dialog, group *Widgets*, runs on `div`
- Checkpoint **259**: Name, state, role, value for dialog, group *Widgets*, runs on `div`
- Checkpoint **260**: Visible focus for dialog, group *Widgets*, runs on `div`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each dialog that `WidgetDetector` finds. It checks the role, accessible name and `aria-modal`, whether the content behind it is inert, whether focus moves into the dialog, whether focus is confined but can still escape, whether the keyboard can close it, and visible focus inside it. Check 558 (focus returned to the trigger) is defined in masterdata but never raised.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 554 | Dialog cannot be closed using the keyboard | Error | 2.1.1 Keyboard (A) | (none) |
| 555 | Focus is not confined to the open modal dialog | Error | 2.1.2 No Keyboard Trap (A) | (none) |
| 556 | Keyboard focus gets trapped in the dialog | Error | 2.1.2 No Keyboard Trap (A) | (none) |
| 557 | Focus is not moved into the dialog when it opens | Error | 2.4.3 Focus Order (A) | (none) |
| 559 | Dialog not marked with dialog or alertdialog role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 560 | Modal dialog does not have aria-modal defined | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 561 | Dialog does not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 562 | Content behind the open dialog is not inert or aria-hidden | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 563 | One or more elements in the dialog do not have a visible keyboard focus indicator | Error | 2.4.7 Focus Visible (AA) | (none) |

### [`FeedCheck.java`](checks/dynamicelements/FeedCheck.java)

- Checkpoint **276**: Name, state, role, value for feed, group *Widgets*, runs on `div|section`
- Checkpoint **277**: Status messages for feed, group *Widgets*, runs on `div|section`
- Checkpoint **278**: Meaningful element sequence for feed, group *Widgets*, runs on `div|section`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each feed that `WidgetDetector` finds. It checks the feed and article roles, each entry's position in the set and its name, whether the loading state is conveyed, and whether focus survives new content. Check 601 reports only when scrolling loaded new entries and keyboard focus did not survive the load.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 596 | Feed not marked with feed role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 597 | Feed entries not marked with article role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 598 | Feed entries do not convey their position in the set | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 599 | Feed entry does not have an accessible name | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 600 | Loading state of the feed is not conveyed | Error | 4.1.3 Status messages (AA) | (none) |
| 601 | Keyboard focus is lost when new feed content is inserted | Warning | 2.4.3 Focus Order (A) | (none) |

### [`GridCheck.java`](checks/dynamicelements/GridCheck.java)

- Checkpoint **273**: Name, state, role, value for grid, group *Widgets*, runs on `div|table`
- Checkpoint **274**: Keyboard interaction for grid, group *Widgets*, runs on `div|table`
- Checkpoint **275**: Meaningful element sequence for grid, group *Widgets*, runs on `div|table`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each composite grid that `WidgetDetector` finds. It checks the grid, row and gridcell roles (native `tr`/`td` count), the accessible name, arrow-key and Home/End navigation, and roving tabindex.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 589 | Grid not marked with grid role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 590 | One or more grid rows not marked with row role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 591 | One or more grid cells not marked with gridcell role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 592 | Grid does not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 593 | Grid cells cannot be navigated using the arrow keys | Error | 2.1.1 Keyboard (A) | (none) |
| 594 | Home and End do not move within the grid row | Warning | 2.1.1 Keyboard (A) | (none) |
| 595 | Grid does not implement roving tabindex | Error | 2.4.3 Focus Order (A) | (none) |

### [`MenubarCheck.java`](checks/dynamicelements/MenubarCheck.java)

- Checkpoint **45**: Keyboard interaction for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **46**: No keyboard trap for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **47**: Name, state, role, value for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **48**: Info and Relationships for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **49**: Meaningful link texts for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **50**: Color contrast (Minimum) for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **51**: Meaningful element sequence for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **52**: Visible focus for menubar, group *Widgets*, runs on `ul|ol`
- Checkpoint **53**: Images of text for menubar, group *Widgets*, runs on `ul|ol`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each menu bar that `WidgetDetector` finds. It checks the menubar and menuitem roles and their ownership, `aria-haspopup` on items with submenus, keyboard interaction and traps, link text, contrast, reading sequence, visible focus and images of text.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 154 | Appropriate keyboard interaction not provided for menubar | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 155 | Keyboard focus gets trapped in the menubar | Error | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 156 | Menubar not marked with menubar role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 157 | Items in menu not marked with menuitem role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 158 | Menu items containing submenus not have aria-haspopup defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 159 | Items marked with menuitem role not owned by element with menu/menubar role | Error | 1.3.1 Info and Relationships (A) | 508 (n) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 160 | One or more links in the menubar may not have meaningful text | Warning | 2.4.4 Link Purpose (In Context) (A) | EN 9.2.4.4 · IS 9.2.4.4 · GIGW 7.5 (h) · TCS 8.7 |
| 161 | One or more components fail to satisfy the minimum color contrast | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 162 | One or more elements do not appear in a meaningful sequence | Warning | 1.3.2 Meaningful Sequence (A)<br>2.4.3 Focus Order (A) | EN 9.1.3.2, 9.2.4.3 · IS 9.1.3.2, 9.2.4.3 · GIGW 5.6.4, 7.5 (m) · TCS 8.5 |
| 163 | One or more elements do not have a visible keyboard focus indicator | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 164 | One or more elements may have images in place of text | Warning | 1.4.5 Images of Text (AA) | EN 9.1.4.5 · IS 9.1.4.5 · GIGW 6.6.1 · TCS 5.5 |

### [`ProgressBarCheck.java`](checks/dynamicelements/ProgressBarCheck.java)

- Checkpoint **268**: Name, state, role, value for progress bar, group *Widgets*, runs on `div|progress`
- Checkpoint **269**: Status messages for progress bar, group *Widgets*, runs on `div|progress`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each progress indicator that `WidgetDetector` finds. It checks the role, the current, minimum and maximum values, the accessible name, an indeterminate indicator that still declares a value, and whether updates are announced. A native `<progress>` element is exempt from the ARIA-only checks.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 578 | Progress indicator not marked with progressbar role | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 579 | Current value of progress indicator not available | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 580 | Minimum or maximum value of progress indicator not defined | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 581 | Progress indicator does not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 582 | Indeterminate progress indicator still declares a current value | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 583 | Progress updates are not announced | Warning | 4.1.3 Status messages (AA) | (none) |

### [`SliderCheck.java`](checks/dynamicelements/SliderCheck.java)

- Checkpoint **40**: Keyboard interaction for slider, group *Widgets*, runs on `div|span|a`
- Checkpoint **41**: No keyboard trap for slider, group *Widgets*, runs on `div|span|a`
- Checkpoint **42**: Name, state, role, value for slider, group *Widgets*, runs on `div|span|a`
- Checkpoint **43**: Color contrast (Minimum) for slider, group *Widgets*, runs on `div|span|a`
- Checkpoint **44**: Visible focus for slider, group *Widgets*, runs on `div|span|a`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each slider that `WidgetDetector` finds. It checks keyboard focus, operation and traps, the slider role on the thumb, the minimum, maximum and current values, contrast, and visible focus.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 144 | Slider does not receive keyboard focus | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 145 | All functionality of slider cannot be completed using keyboard | Warning | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 146 | Appropriate keyboard interaction not provided for slider | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 147 | Keyboard focus gets trapped in the slider | Error | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 148 | Thumb icon not marked with slider role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 149 | Minimum value of slider not defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 150 | Maximum value of slider not defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 151 | Current value of slider not available | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 152 | One or more components fail to satisfy the minimum color contrast | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 153 | Focus on slider is not visible | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |

### [`TabPanelCheck.java`](checks/dynamicelements/TabPanelCheck.java)

- Checkpoint **140**: Name, state,role,value for tabpanel, group *Widgets*, runs on `ul|ol`
- Checkpoint **141**: Keyboard interaction for tabpanel, group *Widgets*, runs on `ul|ol`
- Checkpoint **142**: Keyboard interaction for tabpanel, group *Widgets*, runs on `ul|ol`
- Checkpoint **143**: Visible focus for tabpanel, group *Widgets*, runs on `ul|ol`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each tab set that `WidgetDetector` finds. It checks the tablist and tabpanel containers, the tablist name, `aria-controls`, the active-tab state, keyboard interaction (roving tabindex), traps and visible focus.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 371 | Information about element serving as a container for a set of tabs is missing. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 372 | Information about element serving as a container for tab panel content is missing. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 373 | Missing Accessible name for the tablist. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 374 | aria-controls not defined. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 375 | Info about the active tab control is not provided. | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 376 | Appropriate keyboard interaction not provided for tabpanel. | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 377 | Keyboard focus gets trapped in the Tabpanel. | Error | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 378 | Focus on Tabpanel is not visible. | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |

### [`TooltipCheck.java`](checks/dynamicelements/TooltipCheck.java)

- Checkpoint **265**: Content on hover or focus for tooltip, group *Widgets*, runs on `div|span`
- Checkpoint **266**: Name, state, role, value for tooltip, group *Widgets*, runs on `div|span`
- Checkpoint **267**: Color contrast (Minimum) for tooltip, group *Widgets*, runs on `div|span`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each tooltip that `WidgetDetector` finds. It moves the pointer and uses the keyboard to test the dismissible, hoverable and persistent conditions of WCAG 1.4.13, then checks the role, the association with the trigger, and contrast.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 572 | Tooltip cannot be dismissed without moving the pointer | Error | 1.4.13 Content on hover or focus (AA) | (none) |
| 573 | Tooltip content is not hoverable | Error | 1.4.13 Content on hover or focus (AA) | (none) |
| 574 | Tooltip appears on hover but not on keyboard focus | Error | 1.4.13 Content on hover or focus (AA) | (none) |
| 575 | Tooltip is not associated with its trigger | Error | 4.1.2 Name, Role, Value (A) | (none) |
| 576 | Tooltip container not marked with tooltip role | Warning | 4.1.2 Name, Role, Value (A) | (none) |
| 577 | Tooltip surface fails the minimum non-text contrast | Warning | 1.4.11 Non text contrast (AA) | (none) |

### [`TreeviewCheck.java`](checks/dynamicelements/TreeviewCheck.java)

- Checkpoint **54**: Keyboard interaction for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **55**: No keyboard trap for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **56**: Name, state, role, value for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **57**: Info and Relationships for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **58**: Meaningful link texts for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **59**: Color contrast (Minimum) for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **60**: Meaningful element sequence for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **61**: Visible focus for treeview, group *Widgets*, runs on `ul|ol`
- Checkpoint **62**: Images of text for treeview, group *Widgets*, runs on `ul|ol`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on each tree view that `WidgetDetector` finds. It checks the tree, treeitem and group roles and their ownership, accessible names, expanded and collapsed states, keyboard interaction and traps, link text, contrast, reading sequence, visible focus and images of text.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 165 | Appropriate keyboard interaction not provided for tree | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 166 | Keyboard focus gets trapped in the tree | Error | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 167 | Tree not marked with tree role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 168 | Items in tree not marked with treeitem role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 169 | One or more elements do not have an accessible name | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 170 | One or more expandable/collapsible sub-trees not marked with group role | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 171 | Expanded/Collapsed state of one or more treeitems not defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 172 | Items marked with treeitem role not owned by element with tree role | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 173 | One or more links in the tree may not have meaningful text | Warning | 2.4.4 Link Purpose (In Context) (A) | EN 9.2.4.4 · IS 9.2.4.4 · GIGW 7.5 (h) · TCS 8.7 |
| 174 | One or more components fail to satisfy the minimum color contrast | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 175 | One or more elements do not appear in a meaningful sequence | Warning | 1.3.2 Meaningful Sequence (A)<br>2.4.3 Focus Order (A) | EN 9.1.3.2, 9.2.4.3 · IS 9.1.3.2, 9.2.4.3 · GIGW 5.6.4, 7.5 (m) · TCS 8.5 |
| 176 | One or more elements do not have a visible keyboard focus indicator | Error | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |
| 177 | One or more elements may have images in place of text | Warning | 1.4.5 Images of Text (AA) | EN 9.1.4.5 · IS 9.1.4.5 · GIGW 6.6.1 · TCS 5.5 |

## 5. External content (applet, embed, object) (`checks/external`)

### [`AppletCheck.js`](checks/external/AppletCheck.js)

- Checkpoint **25**: Text equivalent of the object, group *Plugins*, runs on `applet`
- Checkpoint **144**: Keyboard trap for applet, group *Plugins*, runs on `applet`
- Runtime: JavaScript (in page)

Runs on every `<applet>`. Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 110 | Applet may not have a text equivalent | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 111 | Text equivalent for applet may not update when applet updates | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 112 | Applet user interface may not be accessible | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 379 | Keyboard focus gets trapped in the Applet. | Recommendation | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |

### [`EmbedCheck.js`](checks/external/EmbedCheck.js)

- Checkpoint **27**: Text equivalent of the object, group *Plugins*, runs on `embed`
- Runtime: JavaScript (in page)

Runs on every `<embed>`. Fails 118 when there is no `<noembed>` fallback and 119 when the fallback is empty. Otherwise it raises 120 to confirm the fallback is meaningful.

> **Note:** The fallback test `!noembed.nodeName.toLowerCase() === "noembed"` is always false, so any next sibling element counts as the fallback. Check 118 is raised only when the embed has no `<noembed>` child and no next sibling.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 118 | Missing noembed element | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 119 | Blank noembed element | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 120 | noembed may not be meaningful | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |

### [`ObjectCheck.js`](checks/external/ObjectCheck.js)

- Checkpoint **26**: Text equivalent of the object, group *Plugins*, runs on `object`
- Checkpoint **145**: Keyboard trap for object, group *Plugins*, runs on `object`
- Checkpoint **146**: Visible Focus on Object, group *Plugins*, runs on `object`
- Runtime: JavaScript (in page)

Runs on every `<object>`. Fails 113 when there is no inner text alternative. Always raises 114, 115, 380 and 381 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 113 | Object does not have a text alternative | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 114 | Text equivalent for object may not update when object updates | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 115 | Object user interface may not be accessible | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 |
| 380 | Keyboard focus gets trapped in the Object. | Recommendation | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |
| 381 | keyboard focus indicator is not visible. | Recommendation | 2.4.7 Focus Visible (AA) | EN 9.2.4.7 · IS 9.2.4.7 · GIGW 7.5 (o) · TCS 8.6 |

## 6. Forms (`checks/forms`)

### [`AccessibleNameCheck.js`](checks/forms/AccessibleNameCheck.js)

- Checkpoint **113**: Label in name, group *Forms*, runs on `input|img|a|div`
- Runtime: JavaScript (in page)

Tests Label in Name on links, inputs, and elements with `role=button` or `role=link`, by comparing the accessible name (`aria-labelledby`, `aria-label`, `alt`) with the visible label (text, `value`, `placeholder`, `<label for>`). It fails 403 when the accessible name does not start with the visible label and 408 when `aria-labelledby` points at a missing id. It raises 409 for image-based controls, which need a manual comparison.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 403 | Visual label and accessible name of the element do not match | Error | 2.5.3 Label in name (A) | EN 9.2.5.3 · IS 9.2.5.3 |
| 408 | element reference defined in `<aria-labelledby>` is missing | Warning | 2.5.3 Label in name (A) | EN 9.2.5.3 · IS 9.2.5.3 |
| 409 | Check image content visual name matches with the accessible name | Recommendation | 2.5.3 Label in name (A) | EN 9.2.5.3 · IS 9.2.5.3 |

### [`AccessibleNameComputeCheck.js`](checks/forms/AccessibleNameComputeCheck.js)

- Checkpoint **212**: Accessible name can be computed for controls, group *Forms*, runs on `all`
- Runtime: JavaScript (in page)

Runs on visible interactive controls, native or ARIA. It computes an accessible name from `aria-label`, `aria-labelledby`, `<label for>`, a wrapping label, `title`, `value`, text and `img[alt]`. It fails 496 when there is no name but visible text sits beside the control.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 496 | Control has a visible label but no accessible name | Warning | 2.5.3 Label in name (A) | (none) |

### [`AlternateTextCheck.js`](checks/forms/AlternateTextCheck.js)

- Checkpoint **1**: Labels for form controls, Titles for form controls, group *Forms*, runs on `input|textarea|select`
- Checkpoint **119**: Autocomplete for form inputs, group *Forms*, runs on `input|textarea`
- Checkpoint **125**: Labels for form controls, Titles for form controls, group *Button*, runs on `button`
- Runtime: JavaScript (in page)

Checks the labels of form controls that ARIA does not already name. Button inputs: missing or blank `value` (7, 8), otherwise a prompt to verify it (15). Image inputs: missing or blank `alt` (9, 10), `alt` equal to the file name (11), placeholder `alt` (12), otherwise a prompt to verify it (16). `<button>`: no text or title (254), or placeholder text (260) or title (261). Other fields: implicit wrapping label (237). With no label, the `title` is missing (1), blank (4) or needs verifying (14). Several labels (2), an empty label (3), or a label to verify (13). `autocomplete` is missing (400), set to `on`/`off` (410), or present and needs verifying (401). A `title` matching (257) or differing from (258) the label. The label sits inside the control (233), is on the wrong side (5, 6), or is hidden (230, 231). Always raises 382 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 1 | Form control has no associated label or title | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 2 | Form control has more than one labels associated | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 3 | Empty or missing label text | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 4 | Empty or missing title text | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 5 | Incorrect label position | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 6 | Incorrect label position | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 7 | Missing value attribute | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 8 | Blank value attribute | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 9 | Missing alt attribute | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 10 | Blank alt attribute | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 11 | Alt attribute cannot be same as file name | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 12 | Alt attribute is placeholder text | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 13 | Label text may not be meaningful | Recommendation | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 14 | Title attribute text may not be meaningful | Recommendation | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 15 | Value attribute text may not be meaningful | Recommendation | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 16 | Alt attribute text may not be meaningful | Recommendation | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 230 | Incorrect label position | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 231 | Incorrect label position | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 233 | Label is implicitly associated to the input field | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 237 | Label is implicitly associated to the input field | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 254 | Button has no text or title | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 257 | Form control has both label and title associated with it | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 258 | Form control has both label and title associated with it | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 260 | Button has placeholder text | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 261 | Button has placeholder title | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 382 | Form instructions may not be available programmatically. | Recommendation | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 400 | `autocomplete` is missing | Warning | 1.3.5 Identify Input Purpose (AA) | EN 9.1.3.5 · IS 9.1.3.5 |
| 401 | autocomplete value may not be appropriate | Warning | 1.3.5 Identify Input Purpose (AA) | EN 9.1.3.5 · IS 9.1.3.5 |
| 410 | Check whether the purpose of input field can be programmatically determined or notautocomplete is required or not | Recommendation | 1.3.5 Identify Input Purpose (AA) | EN 9.1.3.5 · IS 9.1.3.5 |

### [`CriticalActionReversalCheck.js`](checks/forms/CriticalActionReversalCheck.js)

- Checkpoint **215**: Critical submissions are reversible, group *Error Indentification/Suggesstions*, runs on `form`
- Runtime: JavaScript (in page)

Runs on a `<form>` whose action or text mentions checkout, payment, transfer, account deletion, contracts and similar. It passes when there is a wizard step ("step 2 of 3") or a confirm, review or agreement checkbox, and fails 500 when there is none. It raises 501 to confirm that an undo or cancel control really reverses the action.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 500 | Critical submission has no confirm, review or undo step | Error | 3.3.4 Error Prevention (Legal, Financial, Data) (AA) | (none) |
| 501 | Cancel control near a critical action needs verification | Warning | 3.3.4 Error Prevention (Legal, Financial, Data) (AA) | (none) |

### [`ErrorIdentificationCheck.js`](checks/forms/ErrorIdentificationCheck.js)

- Checkpoint **124**: Error Indentification and Suggesstions, group *Error Indentification/Suggesstions*, runs on `form`
- Checkpoint **127**: Error Indentification and Suggesstions, group *Error Indentification/Suggesstions*, runs on `form`
- Checkpoint **128**: Error Indentification and Suggesstions, group *Error Indentification/Suggesstions*, runs on `form`
- Checkpoint **129**: Error Indentification and Suggesstions, group *Error Indentification/Suggesstions*, runs on `form`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 343 | Error message describing invalid form field may be missing. | Recommendation | 3.3.1 Error Identification (A) | EN 9.3.3.1 · IS 9.3.3.1 · GIGW 7.5 (e) · TCS 10.1 |
| 344 | Unable to access the form controls having invalid values. | Recommendation | 3.3.1 Error Identification (A) | EN 9.3.3.1 · IS 9.3.3.1 · GIGW 7.5 (e) · TCS 10.1 |
| 345 | Error correction suggestions may be missing. | Recommendation | 3.3.3 Error Suggestion (AA) | EN 9.3.3.3 · IS 9.3.3.3 · GIGW 7.5 (p) · TCS 10.3 |
| 346 | Required or aria required may be missing for the manadatory form controls. | Recommendation | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) · TCS 10.1 |
| 347 | No provision to cancel/review/recover/confirm the request before the submission is present. | Recommendation | 3.3.4 Error Prevention (Legal, Financial, Data) (AA)<br>3.3.6 Error Prevention (All) (AAA) | EN 9.3.3.4 · IS 9.3.3.4 · GIGW 7.5 (q) · TCS 10.4, 10.6 |

### [`ErrorSuggestionCheck.js`](checks/forms/ErrorSuggestionCheck.js)

- Checkpoint **214**: Error messages suggest a correction, group *Error Indentification/Suggesstions*, runs on `input|select|textarea|form`
- Runtime: JavaScript (in page)

On a `<form>`, fails 499 when fields have validation constraints (`required`, `pattern`, `min`/`max`, length) but the form has no error region (`role=alert`, `aria-live`, or an error or invalid class). On a field that is invalid (`aria-invalid=true`, or failing native validation with a value), fails 498 unless associated text suggests how to fix the entry.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 498 | Invalid field gives no correction suggestion | Error | 3.3.3 Error Suggestion (AA) | (none) |
| 499 | Form has validation rules but no error region | Warning | 3.3.3 Error Suggestion (AA) | (none) |

### [`FieldsetLegendCheck.js`](checks/forms/FieldsetLegendCheck.js)

- Checkpoint **99**: Legend for Fieldset, group *Fieldset*, runs on `fieldset`
- Runtime: JavaScript (in page)

Runs on every `<fieldset>`. Fails 259 when it groups fewer than two controls, 241 when the legend is missing and 243 when the legend is blank.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 241 | Fieldset is missing legend | Error | 1.3.1 Info and Relationships (A)<br>3.3.2 Labels or Instructions (A) | 508 (n) · EN 9.1.3.1, 9.3.3.2 · IS 9.1.3.1, 9.3.3.2 · GIGW 5.6.3, 7.5 (b) · TCS 4.1, 10.2 |
| 243 | Fieldset contains blank legend | Error | 1.3.1 Info and Relationships (A)<br>3.3.2 Labels or Instructions (A) | 508 (n) · EN 9.1.3.1, 9.3.3.2 · IS 9.1.3.1, 9.3.3.2 · GIGW 5.6.3, 7.5 (b) · TCS 4.1, 10.2 |
| 259 | Fieldset should not be used for visual presentation purpose only | Error | 1.3.1 Info and Relationships (A)<br>3.3.2 Labels or Instructions (A) | 508 (n) · EN 9.1.3.1, 9.3.3.2 · IS 9.1.3.1, 9.3.3.2 · GIGW 5.6.3, 7.5 (b) · TCS 4.1, 10.2 |

### [`HelpCheck.js`](checks/forms/HelpCheck.js)

- Checkpoint **147**: Help information for form field, group *Forms*, runs on `input|textarea|select`
- Runtime: JavaScript (in page)

Always raises 383 on every text-like field (anything other than hidden, button, image, radio and checkbox) as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 383 | Form instructions may not be available programmatically. | Recommendation | 3.3.5 Help (AAA) | TCS 10.5 |

### [`OnFocusContextChangeCheck.js`](checks/forms/OnFocusContextChangeCheck.js)

- Checkpoint **130**: On Focus Context change, group *Forms*, runs on `input|textarea|select|button`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 350 | Change of context is initiated on focus. | Recommendation | 3.2.1 On Focus (A) | EN 9.3.2.1 · IS 9.3.2.1 · GIGW 7.5 (i) · TCS 9.1 |

### [`PlaceholderOnlyLabelCheck.js`](checks/forms/PlaceholderOnlyLabelCheck.js)

- Checkpoint **213**: Placeholder used as the only label, group *Fieldset*, runs on `input|select|textarea`
- Runtime: JavaScript (in page)

Runs on fields with a `placeholder`. Fails 497 when there is no `aria-label`, `aria-labelledby`, `title`, `<label for>` or wrapping label.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 497 | Field is labelled only by its placeholder | Error | 3.3.2 Labels or Instructions (A) | (none) |

### [`RadioCheckboxGroupCheck.js`](checks/forms/RadioCheckboxGroupCheck.js)

- Checkpoint **95**: Fieldset for grouped elements, group *Fieldset*, runs on `form`
- Runtime: JavaScript (in page)

Radio buttons (242) or checkboxes (244) that share a `name` must sit inside a `<fieldset>`. Each failure also raises 348.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 242 | Radio button group not enclosed in a fieldset | Error | 1.3.1 Info and Relationships (A) | 508 (n) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 244 | Checkbox group not enclosed in a fieldset | Error | 1.3.1 Info and Relationships (A) | 508 (n) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 348 | Programmatic group may be missing for logically related fields. | Recommendation | 1.3.1 Info and Relationships (A) | 508 (n) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

### [`RedundantEntryCheck.js`](checks/forms/RedundantEntryCheck.js)

- Checkpoint **199**: Redundant Entry, group *Redundant Entry*, runs on `form`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 479 | Same information is requesting in multiple steps. | Recommendation | 3.3.9 Redundant Entry (A) | TCS 10.9 |

### [`RedundantEntryDuplicateCheck.js`](checks/forms/RedundantEntryDuplicateCheck.js)

- Checkpoint **216**: Information is not requested twice, group *Redundant Entry*, runs on `form`
- Runtime: JavaScript (in page)

Runs on a `<form>`. It keys each field by its `autocomplete` token or `name`/`id`, ignoring confirm and re-enter fields, and fails 502 when the form asks for the same information twice.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 502 | Same information is requested more than once | Error | 3.3.9 Redundant Entry (A) | (none) |

### [`RequiredFieldExplainerCheck.js`](checks/forms/RequiredFieldExplainerCheck.js)

- Checkpoint **211**: Required field marker is explained, group *Fieldset*, runs on `input|select|textarea`
- Runtime: JavaScript (in page)

Runs on required fields (`required`, `aria-required`, or `*` in the label). Fails 495 when no text in the form explains what the required marker means.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 495 | Required field marker is not explained | Warning | 3.3.2 Labels or Instructions (A) | (none) |

## 7. Frames (`checks/frames`)

### [`FrameAccessibilityCheck.js`](checks/frames/FrameAccessibilityCheck.js)

- Checkpoint **15**: Frames, group *Frames*, runs on `frame|iframe|frameset`
- Checkpoint **103**: Frames, group *Frames*, runs on `iframe` **(disabled)**
- Runtime: JavaScript (in page)

On `<frameset>`: no `<noframes>` (75) or an empty one (271). On `<frame>` and `<iframe>`: title missing (76 for frame, 272 for iframe), blank (77), shorter than 6 characters (81) or longer than 120 (82); placeholder title (78), title equal to `src` (269), the same title for a different `src` (270); `scrolling=no` (79); an iframe with no fallback content (80).

> **Note:** Check 75 is passed as `addFailedCheck(element, element, 75)`, so the element lands in the check-ID slot and the call is dropped. Check 75 is never recorded.

> **Note:** The `<noframes>` branch reads `.textContent` off an `HTMLCollection`, which throws, so 271 is never recorded either.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 76 | Missing title attribute | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 77 | Blank title | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 78 | Title attribute has placeholder text | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 79 | Scrolling is disabled | Warning | 1.4.4 Resize text (AA) | EN 9.1.4.4 · IS 9.1.4.4 · GIGW 6.4.5 · TCS 5.4 |
| 80 | iframe does not have alternate content | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 81 | Frame title text is short | Warning | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 82 | Frame title text is verbose | Warning | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 269 | Frame title is same as it page name | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 270 | Duplicate frame title | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 271 | Blank noframes **⚠ never recorded** | Error | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |
| 272 | iframe may require a title | Warning | 2.4.1 Bypass Blocks (A)<br>4.1.2 Name, Role, Value (A) | 508 (i) · EN 9.2.4.1, 9.4.1.2 · IS 9.2.4.1, 9.4.1.2 · GIGW 6.8.8, 7.5 (n) · TCS 8.3 |

## 8. Headings (`checks/headings`)

### [`HeadingCheck.js`](checks/headings/HeadingCheck.js)

- Checkpoint **8**: Headings, group *Headings*, runs on `body`
- Runtime: JavaScript (in page)

A page-level check. Fails 48 when the page has no headings and 50 when it has more than one level-1 heading.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 48 | Page has no headings | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 50 | More than one heading level 1 are present on the page | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

### [`HeadingTextQualityCheck.js`](checks/headings/HeadingTextQualityCheck.js)

- Checkpoint **252**: Headings describe their section, group *Headings*, runs on `h1|h2|h3|h4|h5|h6`
- Runtime: JavaScript (in page)

Fails 550 when heading text is a stock word ("Section", "Untitled", "Details", …) or only digits and punctuation.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 550 | Heading text does not describe its section | Warning | 2.4.6 Headings and Labels (AA) | (none) |

### [`SectionHeadingCheck.js`](checks/headings/SectionHeadingCheck.js)

- Checkpoint **138**: Headings, group *Headings*, runs on `body`
- Runtime: JavaScript (in page)

Raises 366 when the page has no headings. Otherwise raises 367 to confirm that headings organise the sections.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 366 | Section headings are missing. | Recommendation | 2.4.10 Section Headings (AAA) | TCS 8.11 |
| 367 | Section headings may not be meaningful. | Recommendation | 2.4.10 Section Headings (AAA) | TCS 8.11 |

### [`ValidityCheck.js`](checks/headings/ValidityCheck.js)

- Checkpoint **7**: Headings, group *Headings*, runs on `h1|h2|h3|h4|h5|h6`
- Runtime: JavaScript (in page)

Runs on each heading (`h1`–`h6`, `role=heading`). Text blank (45), shorter than 6 characters (46) or longer than 120 (47). The first heading is not level 1 (49). A level is skipped, or an `h1` appears after the first heading (41–46; the ID is the previous heading's level + 40). A heading is used for styling: it contains an image, or sits inside `p`, `dd`, `span`, `button` or `small` (335).

> **Note:** The hierarchy ID is `previousLevel + 40`. After an `h5` or `h6` this gives 45 ("Heading is blank") or 46 ("Heading text is short"), not a hierarchy message.

> **Note:** Check 49 belongs to `HeadingCheck`'s checkpoint (8), so it is counted there.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 41 | Heading does not follow a meaningful hierarchy | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 42 | Heading does not follow a meaningful hierarchy | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 43 | Heading does not follow a meaningful hierarchy | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 44 | Heading does not follow a meaningful hierarchy | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 45 | Heading is blank | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 46 | Heading text is short | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 47 | Heading text is verbose | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 49 | Page heading hierarchy is not meaningful *(counted under checkpoint 8, `headings.HeadingCheck`)* | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 335 | Heading is misused | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

## 9. Images (`checks/images`)

### [`AlternateTextCheck.js`](checks/images/AlternateTextCheck.js)

- Checkpoint **2**: Alternate text for images, group *Images*, runs on `img`
- Checkpoint **136**: Alternate Text of Image, group *Images*, runs on `img`
- Runtime: JavaScript (in page)

Runs on `<img>` elements that are not presentational and not named by ARIA. **Inside a link:** server-side `ismap` (29); empty `alt` with no link text (28) or with link text (30); `alt` repeated by the link text (239) or by an adjacent link (240); placeholder `alt` (19); a prompt to verify the linked image's `alt` (24). **Inside a button:** `alt` missing (262) or blank (263), `alt` equal to the file name (264), placeholder `alt` (265). **Other images:** `alt` missing (17), with a `title` (267) or a `longdesc` (283); empty `alt` with a `title` (23), a `usemap` (268) or a `longdesc` (283), otherwise a prompt to confirm the image is decorative (22); `longdesc` blank (25) or to verify (26); `title` matching (232) or differing from (255) the `alt`; `alt` equal to the file name (18), placeholder (19), shorter than 6 characters (20) or longer than 100 (21); a prompt to verify the `alt` (27).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 17 | Missing alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 18 | Alt attribute cannot be same as file name | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 19 | Alt attribute is placeholder text | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 20 | Image has short alt attribute | Warning | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 21 | Alt attribute of image is verbose | Warning | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 22 | Blank alt attribute | Warning | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 23 | Blank alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 24 | Alt attribute text may not describe the functional purpose of the image | Recommendation | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 25 | Images without an alt attribute cannot have an empty longdesc attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 26 | Longdesc attribute may not be meaningful | Recommendation | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 27 | Alt attribute of image may not be meaningful | Recommendation | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 28 | Alt text of image used as link cannot be empty when there is no text in the anchor | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 29 | Server side image map used | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 30 | Anchor text may not be meaningful | Recommendation | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 232 | Image has both alt & title attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 239 | Alt text of image used as link cannot be same as the text in anchor | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 240 | Alt text of image used as link cannot be same as the text in the adjacent anchor | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 255 | Image has both alt & title attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 262 | Image in the button is missing alt attribute *(counted under checkpoint 1, `forms.AlternateTextCheck`)* | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 263 | Image in the button has blank alt attribute *(counted under checkpoint 1, `forms.AlternateTextCheck`)* | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 264 | Image in the button has alt attribute same as file name *(counted under checkpoint 1, `forms.AlternateTextCheck`)* | Warning | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 265 | Image in the button is having alt attribute as placeholder text *(counted under checkpoint 1, `forms.AlternateTextCheck`)* | Error | 1.1.1 Non-text Content (A)<br>3.3.2 Labels or Instructions (A) | 508 (a), (n) · EN 9.1.1.1, 9.3.3.2 · IS 9.1.1.1, 9.3.3.2 · GIGW 6.6.3, 7.5 (b) · TCS 1.1, 1.2 |
| 267 | Title used in place of alt | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 268 | Blank alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 283 | Image having longdesc has blank or missing alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a), (e), (f) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |

### [`AlternateTextExtendedCheck.js`](checks/images/AlternateTextExtendedCheck.js)

- Checkpoint **245**: Quality of the image accessible name, group *Images*, runs on `img|svg|object|embed|area|input`
- Runtime: JavaScript (in page)

Fails 539 when `role=presentation|none` hides an element that still has `alt` text. On the computed name (`alt`, then `aria-label`, then `title`), fails 540 when it is only icon-font Private Use Area glyphs, 541 when it is a file name, and 542 when it is a camera-style automatic name such as `DSC_0012`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 539 | Decorative image still carries alt text | Error | 1.1.1 Non-text Content (A) | (none) |
| 540 | Accessible name is only icon font glyphs | Warning | 1.1.1 Non-text Content (A) | (none) |
| 541 | Accessible name is a file name | Error | 1.1.1 Non-text Content (A) | (none) |
| 542 | Accessible name is an auto generated file name | Warning | 1.1.1 Non-text Content (A) | (none) |

### [`AreaAlternateTextCheck.js`](checks/images/AreaAlternateTextCheck.js)

- Checkpoint **4**: Alternate text for images, group *Images*, runs on `area`
- Runtime: JavaScript (in page)

Runs on `<area>` elements that ARIA does not name. `alt` missing (31) or blank (32), otherwise a prompt to verify it (33). No `title` (226). A link to a sound file (124). An `alt` that a sibling area repeats (273).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 31 | Image map hotspot missing alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 32 | Image map hotspot having blank alt attribute | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 33 | Alt attribute of image map hotspot may not be meaningful | Recommendation | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 124 | Link to a sound file must have a text transcript *(counted under checkpoint 11, `links.ValidityCheck`)* | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 226 | Image map hotspot missing title | Warning | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |
| 273 | Alt attribute of image map hotspot having different href should not be duplicated. | Error | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |

### [`CSSImageCheck.js`](checks/images/CSSImageCheck.js)

- Checkpoint **3**: Alternate text for images, group *Images*, runs on `a|div|p|span|li|dd|dt|td|th|h1|h2|h3|h4|h5|h6|label|button`
- Runtime: JavaScript (in page)

Runs on elements larger than 64×64 px that have a CSS `background-image: url(...)`. A single sprite with a negative `background-position` is skipped. Raises 137, with thumbnails, to confirm the image is decorative.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 137 | Image has been added using CSS | Warning | 1.1.1 Non-text Content (A) | 508 (a) · EN 9.1.1.1 · IS 9.1.1.1 · GIGW 6.6.3 · TCS 1.3 |

### [`ImageTextDetectionCheck.js`](checks/images/ImageTextDetectionCheck.js)

- Checkpoint **246**: Images that render text, group *Images*, runs on `img|canvas|svg|div`
- Runtime: JavaScript (in page)

Uses heuristics to find images of text, skipping logos, and fails 543 for any of these: an `img` whose `alt` reads like a sentence or is quoted, or whose file name suggests text; a `canvas` with a label of several words; an inline `svg` that paints `<text>`; an element with no text of its own, a background image, and either a label or a file name that suggests text.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 543 | Element appears to render text as an image | Warning | 1.4.5 Images of Text (AA) | (none) |

### [`OnFocusContextChangeCheck.js`](checks/images/OnFocusContextChangeCheck.js)

- Checkpoint **131**: On Focus Context Change, group *Images*, runs on `img|map`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 351 | Change of context is initiated on focus. | Recommendation | 3.2.1 On Focus (A) | EN 9.3.2.1 · IS 9.3.2.1 · GIGW 7.5 (i) · TCS 9.1 |

## 10. Keyboard (`checks/keyboard`)

### [`AccesskeyConflictCheck.js`](checks/keyboard/AccesskeyConflictCheck.js)

- Checkpoint **225**: Access keys do not collide, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

Fails 512 when more than one element uses the same `accesskey` value.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 512 | Access key is assigned to more than one element | Warning | 2.1.1 Keyboard (A) | (none) |

### [`AccesskeyShortcutReviewCheck.js`](checks/keyboard/AccesskeyShortcutReviewCheck.js)

- Checkpoint **226**: Single character shortcuts are reviewed, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

Raises 513 on every element with an `accesskey` to confirm it does not clash with an assistive-technology shortcut.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 513 | Single character shortcut needs review | Warning | 2.1.4 Character key shortcuts (A) | (none) |

### [`AudioOnlyCheck.js`](checks/keyboard/AudioOnlyCheck.js)

- Checkpoint **169**: Keyboard interaction for audio only, group *Media*, runs on `audio`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 438 | All the controls of the audio file may not be accessible using keyboard. | Recommendation | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |

### [`EventHandlerCheck.js`](checks/keyboard/EventHandlerCheck.js)

- Checkpoint **5**: Keyboard Accessibility, group *Keyboard*, runs on `a|input|textarea|select|div|span|p|li|dd|dt|td|th|button|img`
- Checkpoint **102**: Name, state, role value for clickable elements, group *Markup*, runs on `div|span|p|li|dd|dt|td|th|button|img` **(disabled)**
- Runtime: JavaScript (in page)

Flags inline mouse handlers that have no keyboard equivalent: `onclick` without `onkeypress` (34, skipped for natively clickable `a`, `button` and inputs), `onmousedown`/`onkeydown` (35), `onmouseout`/`onblur` (36), `onmouseover`/`onfocus` (37), `onmouseup`/`onkeyup` (38), `ondblclick` (39), `onmousemove` (40). On a non-focusable element with `onclick`: no role (276), or a missing or negative `tabindex` (277). An `onfocus` handler that calls `this.blur` (354).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 34 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 35 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 36 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 37 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 38 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 39 | Missing Keyboard event handler | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 40 | Missing Keyboard event handler | Warning | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 276 | Appropriate role not defined | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 277 | Element does not recieve keyboard focus *(counted under checkpoint 92, `keyboard.FocusRecieveCheck`)* | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 354 | Missing Keyboard event handler. | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |

### [`FocusAppearanceCheck.js`](checks/keyboard/FocusAppearanceCheck.js)

- Checkpoint **189**: Visible Focus, group *Keyboard*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 465 | Focus indicatoris not meeting the sufficient 1 CSS px border requirement. | Recommendation | 2.4.11 Focus Appearance (Minimum) (AA) | TCS 8.12 |
| 466 | Focus indicator not meeting the 4 CSS px measurement requirement. | Recommendation | 2.4.11 Focus Appearance (Minimum) (AA) | TCS 8.12 |
| 467 | Focus indicators not meeting sufficient color contrast requirement. | Recommendation | 2.4.11 Focus Appearance (Minimum) (AA) | TCS 8.12 |
| 468 | Focus indicators not meeting sufficient color contrast requirement with adjacent colors. | Recommendation | 2.4.11 Focus Appearance (Minimum) (AA) | TCS 8.12 |

### [`FocusObscuredCheck.js`](checks/keyboard/FocusObscuredCheck.js)

- Checkpoint **190**: Visible Focus, group *Keyboard*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 469 | Content receiving focus may be hidden. | Recommendation | 2.4.12 Focus Not Obscured (Minimum) (AA) | TCS 8.13 |

### [`FocusObscuredEnhancedCheck.js`](checks/keyboard/FocusObscuredEnhancedCheck.js)

- Checkpoint **191**: VIsible Focus, group *Keyboard*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 470 | Focus indicators may not be meeting the size requirement. | Recommendation | 2.4.13 Focus Not Obscured (Enhanced) (AAA) | TCS 8.14 |
| 471 | Focus indicators may not be meeting the sufficient color contrast requirement | Recommendation | 2.4.13 Focus Not Obscured (Enhanced) (AAA) | TCS 8.14 |

### [`FocusOrderCheck.js`](checks/keyboard/FocusOrderCheck.js)

- Checkpoint **170**: Focus order, group *Keyboard*, runs on `body`
- Runtime: JavaScript (in page)

Fails 440 when the element contains positive `tabindex` values. Always raises 441 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 440 | Element have tabindex greater than zero. | Recommendation | 2.4.3 Focus Order (A) | EN 9.2.4.3 · IS 9.2.4.3 · GIGW 7.5 (m) · TCS 8.5 |
| 441 | Focus order of the element main not be in meaningful sequence. | Recommendation | 2.4.3 Focus Order (A) | EN 9.2.4.3 · IS 9.2.4.3 · GIGW 7.5 (m) · TCS 8.5 |

### [`FocusRecieveCheck.java`](checks/keyboard/FocusRecieveCheck.java)

- Checkpoint **92**: Keyboard Focus, group *Keyboard*, runs on `body|input|textarea|select|button|a|area|img`
- Runtime: Java (WebDriver)

Runs in Java through WebDriver on every page, whatever checkpoints are selected. It presses Tab from the body and records the focus order, failing 285 when focus repeats or is trapped. `checkReflow` zooms the page to 400% and fails 405 when both horizontal and vertical scrollbars appear. The focus list it records feeds `FocusRecieveCheck.js`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 285 | Keyboard focus repeats on page | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 405 | Horizontal Scrolling is present when re sizing the viewport to 400% *(counted under checkpoint 115, `pageinfo.ReflowCheck`)* | Warning | 1.4.10 Reflow (AA) | EN 9.1.4.10 · IS 9.1.4.10 |

### [`FocusRecieveCheck.js`](checks/keyboard/FocusRecieveCheck.js)

- Checkpoint **92**: Keyboard Focus, group *Keyboard*, runs on `body|input|textarea|select|button|a|area|img`
- Runtime: JavaScript (in page)

Uses the tab walk that the Java class recorded: the focusable list, the first focusable element, and the trap flag. A skip link that is not the first focusable element (249) or does not mention the main content (250). A displayed, enabled element that Tab never reaches (229; radio buttons are counted per group). An `onfocus` handler that calls `blur()` (238). Checks 229 and 238 are skipped when the walk found a focus trap.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 229 | Element does not recieve keyboard focus | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 238 | Element does not recieve keyboard focus | Error | 2.1.1 Keyboard (A) | 508 (l) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 249 | Skip to main content link is not the first focusable element on the page *(counted under checkpoint 14, `links.SkipLinkCheck`)* | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |
| 250 | Link may not skip to the main content *(counted under checkpoint 14, `links.SkipLinkCheck`)* | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |

### [`FocusViewportCheck.js`](checks/keyboard/FocusViewportCheck.js)

- Checkpoint **229**: Focused controls are not obscured, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

Runs on focusable, displayed elements. Fails 517 when another element sits on top of the control, which could hide its focus indicator.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 517 | Focusable control is covered by another element | Warning | 2.4.12 Focus Not Obscured (Minimum) (AA) | (none) |

### [`FormSubmitCheck.js`](checks/keyboard/FormSubmitCheck.js)

- Checkpoint **6**: Change of context on focus/input, group *Keyboard*, runs on `form`
- Runtime: JavaScript (in page)

Runs on every `<form>`. When there is no submit button, fails 138 if the form has only plain buttons or a single field, and 252 if it has several fields. Fails 223 when `action` is missing.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 138 | Form is missing a submit button | Warning | 3.2.2 On Input (A) | EN 9.3.2.2 · IS 9.3.2.2 · GIGW 7.5 (j) · TCS 9.2 |
| 223 | Form action not defined | Warning | 3.2.2 On Input (A) | EN 9.3.2.2 · IS 9.3.2.2 · GIGW 7.5 (j) · TCS 9.2 |
| 252 | Form is missing a submit button | Error | 3.2.2 On Input (A) | EN 9.3.2.2 · IS 9.3.2.2 · GIGW 7.5 (j) · TCS 9.2 |

### [`NewWindowLinkCheck.js`](checks/keyboard/NewWindowLinkCheck.js)

- Checkpoint **30**: Change of context on focus/input, group *Keyboard*, runs on `a|area`
- Runtime: JavaScript (in page)

Raises 142 for `target="_blank"`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 142 | Link opens in a new window | Warning | 3.2.2 On Input (A) | EN 9.3.2.2 · IS 9.3.2.2 · GIGW 7.5 (j) · TCS 9.2 |

### [`NoExceptionKeyboardAccessCheck.js`](checks/keyboard/NoExceptionKeyboardAccessCheck.js)

- Checkpoint **148**: Keyboard Accessibilty No exception, group *Keyboard*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 385 | Functionality has to be keyboard accessible. | Recommendation | 2.1.3 Keyboard (No Exception) (AAA) | EN 9.2.1.3 · TCS 2.6 |

### [`OnChangeCheck.js`](checks/keyboard/OnChangeCheck.js)

- Checkpoint **91**: Change of context on focus/input, group *Keyboard*, runs on `input|textarea|select`
- Runtime: JavaScript (in page)

Raises 224 for an inline `onchange` handler.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 224 | Input may cause a change of context | Warning | 3.2.2 On Input (A) | EN 9.3.2.2 · IS 9.3.2.2 · GIGW 7.5 (j) · TCS 9.2 |

### [`OnInputModalCheck.js`](checks/keyboard/OnInputModalCheck.js)

- Checkpoint **230**: Changing a value does not open a dialog, group *Keyboard*, runs on `select|input|textarea`
- Runtime: JavaScript (in page)

Runs on controls with an `onchange` handler. Fails 518 when the handler opens a dialog or modal.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 518 | Changing this control opens a dialog | Error | 3.2.2 On Input (A) | (none) |

### [`PluginCheck.js`](checks/keyboard/PluginCheck.js)

- Checkpoint **38**: Applet and plug-in, group *Keyboard*, runs on `applet|embed|object`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 129 | Text alternative required for plug-in | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |
| 130 | Element link may not be available through keyboard | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |
| 131 | Plug-in may not return focus to the parent window | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |
| 132 | Start/Stop/Pause buttons should be operable through keyboard | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |
| 133 | Allow plug-in to be downloaded through keyboard | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |
| 134 | Plug-in may be inaccessible | Warning | 2.1.1 Keyboard (A) | 508 (m) · EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.3 |

### [`PointerEventsBlockCheck.js`](checks/keyboard/PointerEventsBlockCheck.js)

- Checkpoint **223**: Interactive elements are not blocked by CSS, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

Runs on visible interactive elements. Fails 510 when `pointer-events` is `none`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 510 | Interactive element has pointer-events set to none | Error | 2.1.1 Keyboard (A) | (none) |

### [`RoleButtonKeySupportCheck.js`](checks/keyboard/RoleButtonKeySupportCheck.js)

- Checkpoint **224**: Links acting as buttons support the Space key, group *Keyboard*, runs on `a`
- Runtime: JavaScript (in page)

Runs on links (`href`) with `role=button`. Fails 511 when there is no key handler, because a button must activate on Space.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 511 | Link with role button does not handle the Space key | Error | 2.1.1 Keyboard (A) | (none) |

### [`RovingTabindexCheck.js`](checks/keyboard/RovingTabindexCheck.js)

- Checkpoint **228**: Composite widgets use a roving tabindex, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

Runs on composite items (tab, menuitem, menuitemcheckbox, menuitemradio, option, treeitem). Fails 516 when the item has no `tabindex`, meaning roving tabindex is missing.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 516 | Composite widget item has no tabindex | Warning | 2.4.3 Focus Order (A) | (none) |

### [`ShortcutKeyCheck.js`](checks/keyboard/ShortcutKeyCheck.js)

- Checkpoint **112**: Character Key Shorcut, group *Markup*, runs on `all`
- Runtime: JavaScript (in page)

Raises 402 for each inline key handler (`onkeydown`, `onkeyup`, `onkeypress`), since it may define a single-key shortcut.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 402 | Single character key shortcut should not be implemented | Recommendation | 2.1.4 Character key shortcuts (A) | EN 9.2.1.4 · IS 9.2.1.4 |

### [`StaleElementsCheck.java`](checks/keyboard/StaleElementsCheck.java)

- No checkpoint in masterdata
- Runtime: Java (WebDriver)

A data holder for elements that are detached from the DOM during the tab walk. It raises no checks.

*This file raises no checks.*

### [`VideoOnlyCheck.js`](checks/keyboard/VideoOnlyCheck.js)

- Checkpoint **181**: Keyboard interaction for video only, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 456 | All the controls of the video file may not be accessible using keyboard. | Recommendation | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |

### [`VisualOrderCheck.js`](checks/keyboard/VisualOrderCheck.js)

- Checkpoint **227**: Visual order matches tab order, group *Keyboard*, runs on `all`
- Runtime: JavaScript (in page)

On `<body>`, fails 515 when the Tab order jumps more than 40 px back up the page. On other elements that contain focusable content, fails 514 when CSS `order`, `float: right`, a reversed flex direction or `wrap-reverse` moves the element away from its DOM order.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 514 | CSS visually reorders content away from tab order | Error | 2.4.3 Focus Order (A) | (none) |
| 515 | Tab order jumps backward on screen | Error | 2.4.3 Focus Order (A) | (none) |

## 11. Links (`checks/links`)

### [`BareUrlLinkTextCheck.js`](checks/links/BareUrlLinkTextCheck.js)

- Checkpoint **238**: Link text is not a raw address, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Fails 529 when the link text is a raw URL, email address or file name.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 529 | Link text is a raw address or file name | Warning | 2.4.4 Link Purpose (In Context) (A) | (none) |

### [`DuplicateLinkTextCheck.js`](checks/links/DuplicateLinkTextCheck.js)

- Checkpoint **236**: Same link text with different destinations, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Fails 527 when the same link text points at different destinations.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 527 | Same link text points at different destinations | Warning | 2.4.4 Link Purpose (In Context) (A) | (none) |

### [`EmulatedLinkCheck.js`](checks/links/EmulatedLinkCheck.js)

- Checkpoint **160**: Emulated Links, group *Links*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 399 | Emulated Links present. | Recommendation | 1.3.1 Info and Relationships (A)<br>4.1.2 Name, Role, Value (A) | EN 9.1.3.1, 9.4.1.2 · IS 9.1.3.1, 9.4.1.2 · GIGW 5.6.3, 7.5 (n) · TCS 4.1, 12.2 |

### [`LinkContextCheck.js`](checks/links/LinkContextCheck.js)

- Checkpoint **237**: Generic link text needs surrounding context, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Passes links whose text is not generic. For generic text ("click here", "read more", and so on), raises 528 to confirm that the surrounding context (`aria-describedby` or the enclosing block) identifies the destination. It stays silent when there is no context.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 528 | Generic link text relies on surrounding context | Warning | 2.4.4 Link Purpose (In Context) (A) | (none) |

### [`LinkPurposeCheck.js`](checks/links/LinkPurposeCheck.js)

- Checkpoint **162**: Link, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 420 | Accessible name of the Link may not be meaningful. | Recommendation | 2.4.9 Link Purpose (Link Only) (AAA) | (none) |

### [`NewWindowWarningCheck.js`](checks/links/NewWindowWarningCheck.js)

- Checkpoint **239**: New window links warn the user, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Fails 530 when a link with `target=_blank` gives no warning in its text, `title`, `aria-label`, description or image `alt`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 530 | Link opens a new window with no warning | Warning | 2.4.4 Link Purpose (In Context) (A) | (none) |

### [`OnFocusContextChangeCheck.js`](checks/links/OnFocusContextChangeCheck.js)

- Checkpoint **132**: On Focus Context Change, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 352 | Change of context is initiated on focus. | Recommendation | 3.2.1 On Focus (A) | EN 9.3.2.1 · IS 9.3.2.1 · GIGW 7.5 (i) · TCS 9.1 |

### [`OnFocusContextChangeLiveCheck.js`](checks/links/OnFocusContextChangeLiveCheck.js)

- Checkpoint **240**: Focus does not change the context, group *Links*, runs on `a|button|input|select|textarea`
- Runtime: JavaScript (in page)

Runs on elements with an `onfocus` handler. Fails 531 when the handler opens a window and 532 when it opens a dialog. Otherwise raises 533 to confirm the handler does not change context.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 531 | Focus opens a new browser window | Error | 3.2.1 On Focus (A) | (none) |
| 532 | Focus opens a dialog with no warning | Error | 3.2.1 On Focus (A) | (none) |
| 533 | Script runs when this element receives focus | Warning | 3.2.1 On Focus (A) | (none) |

### [`SkipLinkAvailabilityCheck.js`](checks/links/SkipLinkAvailabilityCheck.js)

- Checkpoint **94**: Links to skip block of content, group *Bypass blocks of content*, runs on `body`
- Runtime: JavaScript (in page)

Fails 236 when the page has no same-page link (`href="#..."`).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 236 | Page contains no skip links | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |

### [`SkipLinkCheck.java`](checks/links/SkipLinkCheck.java)

- Checkpoint **14**: Links to skip block of content, group *Bypass blocks of content*, runs on `a`
- Runtime: Java (WebDriver)

The Java twin of `SkipLinkCheck.js`. Only its static `isSkipLink()` is used, by `FocusRecieveCheck.java`, and `doCheck` is never called, so the JS version is what runs.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 73 | Skip link not visible | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |
| 74 | Skip link description may not be meaningful | Recommendation | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |
| 227 | Skip link destination missing on page | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |

### [`SkipLinkCheck.js`](checks/links/SkipLinkCheck.js)

- Checkpoint **14**: Links to skip block of content, group *Bypass blocks of content*, runs on `a`
- Runtime: JavaScript (in page)

Runs on skip links: a same-page `#` link whose text mentions skip, navigate, go or jump. Fails 73 when the link stays hidden even when focused, raises 74 to verify the text of a visible link, and fails 227 when the target id does not exist.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 73 | Skip link not visible | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |
| 74 | Skip link description may not be meaningful | Recommendation | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |
| 227 | Skip link destination missing on page | Warning | 2.4.1 Bypass Blocks (A) | 508 (o) · EN 9.2.4.1 · IS 9.2.4.1 · GIGW 6.8.8 · TCS 8.1 |

### [`ValidityCheck.js`](checks/links/ValidityCheck.js)

- Checkpoint **11**: Link, group *Links*, runs on `a`
- Runtime: JavaScript (in page)

Runs on every `<a>`. `href` missing (53), blank (54), `javascript:` (55), or a link to a sound file (124). No text or image: with an `href` (56) or without one (248). Placeholder text (57), otherwise a prompt to verify the link text (58). A `title` identical to the text (234).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 53 | Link is missing href attribute | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 54 | Link has blank href attribute | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 55 | Javascript link used | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 56 | Empty link text | Error | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 57 | Suspicious link text | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 58 | Link text may not be meaningful | Recommendation | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 124 | Link to a sound file must have a text transcript | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 234 | Link title replicates its text | Error | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |
| 248 | Empty link text | Warning | 1.3.1 Info and Relationships (A)<br>2.4.4 Link Purpose (In Context) (A) | EN 9.1.3.1, 9.2.4.4 · IS 9.1.3.1, 9.2.4.4 · GIGW 5.6.3, 7.5 (h) · TCS 4.1 |

## 12. Lists (`checks/list`)

### [`ListContainerCheck.js`](checks/list/ListContainerCheck.js)

- Checkpoint **247**: List items sit inside a list container, group *Lists*, runs on `dt|dd|li`
- Runtime: JavaScript (in page)

Skipped when the element has a role. Fails 544 when a `dt` or `dd` is outside a `dl` (or `div`) and 545 when an `li` is outside a `ul`, `ol` or `menu`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 544 | Definition term or description used outside a dl | Error | 1.3.1 Info and Relationships (A) | (none) |
| 545 | List item used outside a list container | Error | 1.3.1 Info and Relationships (A) | (none) |

### [`NestedListCheck.js`](checks/list/NestedListCheck.js)

- Checkpoint **248**: Lists are nested correctly, group *Lists*, runs on `ul|ol`
- Runtime: JavaScript (in page)

Fails 546 when a list is nested directly inside another list without an `li` around it.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 546 | List nested directly inside another list | Warning | 1.3.1 Info and Relationships (A) | (none) |

### [`ValidityCheck.js`](checks/list/ValidityCheck.js)

- Checkpoint **10**: List, group *Lists*, runs on `ul|ol|dl`
- Runtime: JavaScript (in page)

Runs on `ul`, `ol` and `dl`. Fails 51 when the list has children that are not list items, 52 when it has fewer than two items, and 275 when a visible item is empty.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 51 | List content not marked up using list element | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 52 | List should not be used for visual presentation purpose | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 275 | Empty list items | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

## 13. Markup and ARIA (`checks/markup`)

### [`ARIA_latest.js`](checks/markup/ARIA_latest.js)

- No checkpoint in masterdata
- Runtime: JavaScript (in page) · **never loaded**

An older, debugging copy of `AriaCheck.js`. No checkpoint references it, so it never loads. Its role-specific checks are real calls. Its role and attribute checks (325–331, 338, 340) and 408 appear only as text inside `console.log()`, `alert()` or comments.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 287 | More than one `banner` exist in the document or application **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 288 | More than one `contentinfo` exist in the document or application **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 289 | More than one `main` region exist in the document or application **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 290 | `aria-required` or `aria-readonly` used in columnheader **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 291 | Definition is missing a term **⚠ never recorded** | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 292 | Missing dialog label **⚠ never recorded** | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 293 | Dialog label is blank **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 294 | Dialog is missing focusable element **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 295 | Articles in feed are not focusable **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 296 | Grid is missing rows **⚠ never recorded** | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 297 | Elements not marked with rowgroup role **⚠ never recorded** | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 298 | Unnecessary usage of aria heading **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 299 | List is missing listitems **⚠ never recorded** | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 300 | Elements not marked with group role **⚠ never recorded** | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 301 | Listbox is missing options **⚠ never recorded** | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 302 | Presentation role used on interactive element or hidden from aria **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 303 | Minimum value of progressbar not defined **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 304 | Maximum value of progressbar not defined **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 305 | Current value of progressbar not defined **⚠ never recorded** | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 306 | Label for region not defined **⚠ never recorded** | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 307 | Label element for region is missing **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 308 | Label element for region is not a heading **⚠ never recorded** | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 309 | Tabpanel not associated with respective tab **⚠ never recorded** | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 310 | Term is used on interactive element **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 311 | Text is used on interactive element **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 312 | Text contains interactive elements **⚠ never recorded** | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 313 | Tooltip not referenced **⚠ never recorded** | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 314 | Element targeted by `aria-activedescendant` is not a descendant of the container **⚠ never recorded** | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 315 | More than one element marked with `aria-current` **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 316 | Content is hidden **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 317 | Missing `aria-invalid` **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 318 | Element is missing label reference **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 319 | Element used as label reference does not exist **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 320 | `aria-selected` not specified **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 321 | `aria-owns` used for DOM descendant **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 322 | Max value is less than Min value **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 323 | Min value is greater than Max value **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 324 | `aria-valuenow` is not a decimal number **⚠ never recorded** | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 341 | ARIA attributes must conform to valid values. **⚠ never recorded** | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |

### [`AccessKeyCheck.js`](checks/markup/AccessKeyCheck.js)

- Checkpoint **23**: Parsing, group *Markup*, runs on `a|area|button|input|label|legend|textarea`
- Runtime: JavaScript (in page)

Fails 141 when an `accesskey` value repeats one already seen on the page.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 141 | Duplicate access key | Error | (none) | TCS 12.1 |

### [`AriaCheck.js`](checks/markup/AriaCheck.js)

- Checkpoint **104**: ARIA Parsing, group *ARIA*, runs on `all`
- Checkpoint **105**: ARIA Attributes, group *ARIA*, runs on `all`
- Checkpoint **106**: ARIA labels and instructions, group *ARIA*, runs on `all`
- Checkpoint **107**: ARIA Keyboard operable, group *ARIA*, runs on `all`
- Runtime: JavaScript (in page)

Full ARIA validation. It covers: whether the role is valid and allowed on the element; an explicit role that repeats the implicit one; required parent and child roles; required, supported and prohibited attributes; attribute value types (341); `idref` targets; and rules for specific roles (dialog, grid, heading, list, listbox, presentation, progressbar, region, tabpanel, term, text, tooltip, and so on).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 286 | Description of `alertdialog` is missing | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 287 | More than one `banner` exist in the document or application | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 288 | More than one `contentinfo` exist in the document or application | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 289 | More than one `main` region exist in the document or application | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 290 | `aria-required` or `aria-readonly` used in columnheader | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 291 | Definition is missing a term | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 292 | Missing dialog label | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 293 | Dialog label is blank | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 294 | Dialog is missing focusable element | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 295 | Articles in feed are not focusable | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 296 | Grid is missing rows | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 297 | Elements not marked with rowgroup role | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 298 | Unnecessary usage of aria heading | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 299 | List is missing listitems | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 300 | Elements not marked with group role | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 301 | Listbox is missing options | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 302 | Presentation role used on interactive element or hidden from aria | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 303 | Minimum value of progressbar not defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 304 | Maximum value of progressbar not defined | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 305 | Current value of progressbar not defined | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 306 | Label for region not defined | Error | 3.3.2 Labels or Instructions (A) | EN 9.3.3.2 · IS 9.3.3.2 · GIGW 7.5 (b) |
| 307 | Label element for region is missing | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 308 | Label element for region is not a heading | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 309 | Tabpanel not associated with respective tab | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 310 | Term is used on interactive element | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 311 | Text is used on interactive element | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 312 | Text contains interactive elements | Error | 2.1.1 Keyboard (A) | EN 9.2.1.1 · IS 9.2.1.1 · GIGW 7.5 (f) · TCS 2.1 |
| 313 | Tooltip not referenced | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 314 | Element targeted by `aria-activedescendant` is not a descendant of the container | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 315 | More than one element marked with `aria-current` | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 316 | Content is hidden | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 317 | Missing `aria-invalid` | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 318 | Element is missing label reference | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 319 | Element used as label reference does not exist | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 320 | `aria-selected` not specified | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 321 | `aria-owns` used for DOM descendant | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 322 | Max value is less than Min value | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 323 | Min value is greater than Max value | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 324 | `aria-valuenow` is not a decimal number | Error | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 325 | ARIA roles are not supported by element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 326 | Role applied is implicit to the element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 327 | Applied role is not allowed on element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 328 | Parent role for element is missing | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 329 | ARIA attributes are not supported by element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 330 | Applied attribute is not allowed on element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 331 | Required ARIA attributes are missing on element | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 338 | Child role is missing on the element. | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 339 | Applied role is not allowed on element. | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 340 | The li element is missing the parent tag. | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 341 | ARIA attributes must conform to valid values. | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |
| 342 | Accessible name for the element can not be computed. | Warning | 4.1.2 Name, Role, Value (A) | EN 9.4.1.2 · IS 9.4.1.2 · GIGW 7.5 (n) · TCS 12.2 |

### [`AriaIdrefCheck.js`](checks/markup/AriaIdrefCheck.js)

- Checkpoint **203**: ARIA relationship attributes resolve, group *ARIA*, runs on `all`
- Runtime: JavaScript (in page)

Fails 486 when `aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns` or `aria-activedescendant` refers to an id that does not exist.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 486 | ARIA relationship attribute points at an id that does not exist | Error | 4.1.2 Name, Role, Value (A) | (none) |

### [`AriaRoleValidityCheck.js`](checks/markup/AriaRoleValidityCheck.js)

- Checkpoint **202**: Validity of ARIA role names, group *ARIA*, runs on `all`
- Runtime: JavaScript (in page)

Fails 485 for a `role` token that is abstract or not a recognised ARIA role.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 485 | Role attribute value is not a recognized ARIA role | Error | 4.1.2 Name, Role, Value (A) | (none) |

### [`BlockquoteMisuseCheck.js`](checks/markup/BlockquoteMisuseCheck.js)

- Checkpoint **97**: Blockquote Misuse, group *Blockquote*, runs on `div|p|span|strong|em|h1|h2|h3|h4|h5|h6`
- Runtime: JavaScript (in page)

Fails 247 when an element's text is wrapped in quote marks but is not marked up as a `<blockquote>`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 247 | Blockquote should be used | Warning | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

### [`BypassMechanismCheck.js`](checks/markup/BypassMechanismCheck.js)

- Checkpoint **208**: A mechanism exists to bypass repeated content, group *Bypass blocks of content*, runs on `body`
- Runtime: JavaScript (in page)

A page-level check. It passes when there is a skip link, a `main` landmark, at least two landmarks or headings, or no navigation at all. Otherwise it fails 492.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 492 | No mechanism found to bypass repeated content | Error | 2.4.1 Bypass Blocks (A) | (none) |

### [`DraggingAlternativeCheck.js`](checks/markup/DraggingAlternativeCheck.js)

- Checkpoint **210**: Dragging has a single-pointer alternative, group *Input Modalitites*, runs on `all`
- Runtime: JavaScript (in page)

Runs on draggable elements (`draggable=true`, a grab cursor, or a drag-like class or role). Fails 494 when there is no range input and no pair of buttons nearby to act as a single-pointer alternative.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 494 | Dragging movement has no single-pointer alternative | Error | 2.5.7 Dragging Movements (AA) | (none) |

### [`DraggingMovementCheck.js`](checks/markup/DraggingMovementCheck.js)

- Checkpoint **194**: Dragging movement, group *Input Modalitites*, runs on `all`
- Runtime: JavaScript (in page)

Meant to raise 474 for drag event attributes.

> **Note:** The loop reads an undefined variable, `dragsEvents`, which throws a `ReferenceError` on every element. It also looks up `dragstart` and not `ondragstart`. Check 474 is never raised.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 474 | Drag event present for the functionality. **⚠ never recorded** | Recommendation | 2.5.7 Dragging Movements (AA) | TCS 3.7 |

### [`DuplicateLabelForCheck.js`](checks/markup/DuplicateLabelForCheck.js)

- Checkpoint **205**: Duplicate label associations, group *Fieldset*, runs on `label`
- Runtime: JavaScript (in page)

Fails 488 when more than one `<label>` points at the same field id.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 488 | More than one label points at the same field | Error | 4.1.2 Name, Role, Value (A) | (none) |

### [`FocusableRoleCheck.js`](checks/markup/FocusableRoleCheck.js)

- Checkpoint **204**: Focusable elements expose a role, group *ARIA*, runs on `all`
- Runtime: JavaScript (in page)

Fails 487 when a non-interactive element with `tabindex >= 0` has no `role`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 487 | Element is focusable but has no ARIA role | Warning | 4.1.2 Name, Role, Value (A) | (none) |

### [`HeadingMisuseCheck.js`](checks/markup/HeadingMisuseCheck.js)

- Checkpoint **96**: Heading Misuse, group *Headings*, runs on `div|p|span`
- Runtime: JavaScript (in page)

Fails 246 when the first child is `b`, `i`, `u`, `strong`, `font` or `em` and holds all of the element's text, meaning styled text is standing in for a heading.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 246 | Heading should be used | Warning | 1.3.1 Info and Relationships (A)<br>2.4.6 Headings and Labels (AA) | EN 9.1.3.1, 9.2.4.6 · IS 9.1.3.1, 9.2.4.6 · GIGW 5.6.1, 5.6.3 · TCS 4.1, 8.4 |

### [`NameCheck.js`](checks/markup/NameCheck.js)

- Checkpoint **24**: Parsing, group *Markup*, runs on `input|textarea|select`
- Runtime: JavaScript (in page)

Fails 108 when an element has a blank `name` attribute.

> **Note:** Check 108 is not in `masterdata.json`, so the scanner reports it as "Unmapped check 108" with no guidelines. The file's checkpoint (24) maps only to TCS 12.1 Parsing.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 108 | Element has a blank `name` attribute *(Unmapped)* | (none) | (none) | (none) |

### [`PointerCancellationCheck.js`](checks/markup/PointerCancellationCheck.js)

- Checkpoint **116**: Pointer Cancellation, group *Input Modalitites*, runs on `all`
- Runtime: JavaScript (in page)

Raises 406 for each down-event handler (`onmousedown`, `onkeydown`, `ontouchstart`) and 425 for each up-event handler.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 406 | Down-event is used | Warning | 2.5.2 Pointer cancellation (A) | EN 9.2.5.2 · IS 9.2.5.2 |
| 425 | Up-event is used. | Warning | 2.5.2 Pointer cancellation (A) | EN 9.2.5.2 · IS 9.2.5.2 |

### [`PointerCancellationLiveCheck.js`](checks/markup/PointerCancellationLiveCheck.js)

- Checkpoint **209**: Down-event actions are cancelable, group *Input Modalitites*, runs on `all`
- Runtime: JavaScript (in page)

Fails 493 when an element has a pointer-down handler (property, not attribute) but no matching up or click handler.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 493 | Action is bound to pointer-down with no matching up event | Warning | 2.5.2 Pointer cancellation (A) | (none) |

### [`SkipLinkPositionCheck.js`](checks/markup/SkipLinkPositionCheck.js)

- Checkpoint **207**: Skip link position in tab order, group *Bypass blocks of content*, runs on `a`
- Runtime: JavaScript (in page)

Fails 491 when a skip link is not among the first five focusable elements.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 491 | Skip link is not among the first focusable elements | Warning | 2.4.1 Bypass Blocks (A) | (none) |

### [`SkipLinkTargetCheck.js`](checks/markup/SkipLinkTargetCheck.js)

- Checkpoint **206**: Skip link target exists and takes focus, group *Bypass blocks of content*, runs on `a`
- Runtime: JavaScript (in page)

Fails 489 when a skip link's target does not exist, by id or by name, and 490 when the target cannot take focus.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 489 | Skip link destination missing on page | Error | 2.4.1 Bypass Blocks (A) | (none) |
| 490 | Skip link destination cannot receive focus | Error | 2.4.1 Bypass Blocks (A) | (none) |

### [`UniqueIdCheck.java`](checks/markup/UniqueIdCheck.java)

- Checkpoint **22**: Parsing, group *Markup*, runs on `all`
- Runtime: Java (WebDriver) · **never loaded**

The Java twin of `UniqueIdCheck.js`. Nothing references it, so it never runs.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 105 | Element has a blank `id` attribute *(Unmapped)* **⚠ never recorded** | (none) | (none) | (none) |
| 106 | `id` attribute value is not valid *(Unmapped)* **⚠ never recorded** | (none) | (none) | (none) |
| 107 | Duplicate `id` value on the page *(Unmapped)* **⚠ never recorded** | (none) | (none) | (none) |

### [`UniqueIdCheck.js`](checks/markup/UniqueIdCheck.js)

- Checkpoint **22**: Parsing, group *Markup*, runs on `all`
- Runtime: JavaScript (in page)

Runs on every element except head, body, meta, script, style and html. An `id` that is blank (105), invalid (106) or duplicated (107).

> **Note:** Checks 105–107 are not in `masterdata.json`, so the scanner reports them as "Unmapped check" with no guidelines. The file's checkpoint (22) maps only to TCS 12.1 Parsing.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 105 | Element has a blank `id` attribute *(Unmapped)* | (none) | (none) | (none) |
| 106 | `id` attribute value is not valid *(Unmapped)* | (none) | (none) | (none) |
| 107 | Duplicate `id` value on the page *(Unmapped)* | (none) | (none) | (none) |

## 14. Multimedia (`checks/multimedia`)

### [`AudioDescriptionCheck.js`](checks/multimedia/AudioDescriptionCheck.js)

- Checkpoint **182**: Audio description for prerecorded media, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 457 | Audio description of the video content may be missing. | Recommendation | 1.2.5 Audio Description (Prerecorded) (AA) | EN 9.1.2.5 · IS 9.1.2.5 · TCS 6.5 |

### [`AudioKeyboardTrapCheck.js`](checks/multimedia/AudioKeyboardTrapCheck.js)

- Checkpoint **173**: No keyboard trap for Audio only, group *Media*, runs on `audio`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 446 | Keyboard focus gets trapped in the Audio controls present. | Recommendation | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |

### [`AudioOnlyVideoOnlyCheck.js`](checks/multimedia/AudioOnlyVideoOnlyCheck.js)

- Checkpoint **167**: Audio only and video only Pre-recorded, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raises 427, 428 and 429 on `<audio>` and 430 on `<video>`, for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 427 | Title missing for the audio content present. | Recommendation | 1.2.1 Audio-only and Video-only (Prerecorded) (A) | EN 9.1.2.1 · IS 9.1.2.1 · GIGW 6.7.2 (a,b) · TCS 6.1 |
| 428 | Text transcript for audio is missing. | Recommendation | 1.2.1 Audio-only and Video-only (Prerecorded) (A) | EN 9.1.2.1 · IS 9.1.2.1 · GIGW 6.7.2 (a,b) · TCS 6.1 |
| 429 | Text Transcript and audio content may not be matching. | Recommendation | 1.2.1 Audio-only and Video-only (Prerecorded) (A) | EN 9.1.2.1 · IS 9.1.2.1 · GIGW 6.7.2 (a,b) · TCS 6.1 |
| 430 | Title missing for the video-only content present. | Recommendation | 1.2.1 Audio-only and Video-only (Prerecorded) (A) | EN 9.1.2.1 · IS 9.1.2.1 · GIGW 6.7.2 (a,b) · TCS 6.1 |

### [`AutoplayCheck.js`](checks/multimedia/AutoplayCheck.js)

- Checkpoint **98**: Autoplay of Media, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Runs on `<audio>` and `<video>`. Fails 251 for media that autoplays for 4 seconds or more with no controls. Raises 266 when `controls` is present. Always raises 439.

> **Note:** The duration test compares against `Inf`, an undefined name, so it throws for any media with `autoplay`. For autoplaying media, none of 251, 266 or 439 is raised. For other media only 266 and 439 are raised.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 251 | Autoplay is used on media | Warning | 1.4.2 Audio Control (A) | EN 9.1.4.2 · IS 9.1.4.2 · GIGW 6.7.3 (c) · TCS 7.1 |
| 266 | Default controls used on media | Warning | 1.4.2 Audio Control (A) | EN 9.1.4.2 · IS 9.1.4.2 · GIGW 6.7.3 (c) · TCS 7.1 |
| 439 | Audio may be missing controls that provide users with the ability to stop automatically played audio after three seconds. | Recommendation | 1.4.2 Audio Control (A) | EN 9.1.4.2 · IS 9.1.4.2 · GIGW 6.7.3 (c) · TCS 7.1 |

### [`BackgroundAudioCheck.js`](checks/multimedia/BackgroundAudioCheck.js)

- Checkpoint **193**: Background audio, group *Media*, runs on `audio`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 473 | Unable to distinguish between background noise and audio speech. | Recommendation | 1.4.7 Low or No Background Audio (AAA) | EN 9.1.4.7 · TCS 7.5 |

### [`CaptionCheck.js`](checks/multimedia/CaptionCheck.js)

- Checkpoint **108**: Captions for Media, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Fails 332 when there is no `<track kind="captions">`. When there is one, raises 432, 433 and 434 to verify the captions.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 332 | Captions for pre-recorded audio for synchronized media are missing | Error | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |
| 432 | Text Transcript and captions may not be matching. | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |
| 433 | Text Transcript may not be adequate. | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |
| 434 | Captions may be blocking the multimedia content. | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |

### [`CaptionVsSubtitleCheck.js`](checks/multimedia/CaptionVsSubtitleCheck.js)

- Checkpoint **242**: Captions track versus subtitles track, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Fails 535 when media has a `subtitles` track but no `captions` track.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 535 | Only a subtitles track was found | Warning | 1.2.2 Captions (Prerecorded) (A) | (none) |

### [`DecorativeMediaExclusionCheck.js`](checks/multimedia/DecorativeMediaExclusionCheck.js)

- Checkpoint **243**: Decorative media exclusion, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Raises 537 for media that is muted, has no controls, and loops or autoplays, to confirm it really is decorative.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 537 | Media looks decorative and may be out of scope | Warning | 1.2.1 Audio-only and Video-only (Prerecorded) (A) | (none) |

### [`DescriptionCheck.js`](checks/multimedia/DescriptionCheck.js)

- Checkpoint **109**: Descriptions for Media, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Fails 333 when there is no `<track kind="descriptions">`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 333 | Description of audio/video for synchronized media is missing | Error | 1.2.3 Audio Description or Media Alternative (Prerecorded) (A) | EN 9.1.2.3 · IS 9.1.2.3 · GIGW 6.7.2 (a,b) |

### [`EmbeddedMediaReviewCheck.js`](checks/multimedia/EmbeddedMediaReviewCheck.js)

- Checkpoint **241**: Third party media embeds need manual review, group *Media*, runs on `iframe`
- Runtime: JavaScript (in page)

Runs on third-party video embeds (YouTube, Vimeo, Wistia, Brightcove, …). Raises 534 to verify captions and 536 to verify audio description on the hosted source.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 534 | Third party video embed needs caption review | Warning | 1.2.2 Captions (Prerecorded) (A) | (none) |
| 536 | Third party video embed needs description review | Warning | 1.2.2 Captions (Prerecorded) (A) | (none) |

### [`ExtendedAudioDescriptionCheck.js`](checks/multimedia/ExtendedAudioDescriptionCheck.js)

- Checkpoint **183**: Extended audio description for multimedia, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 458 | Alternat version of video content with audio description may be missing. | Recommendation | 1.2.7 Extended Audio Description (Prerecorded) (AAA) | TCS 6.7 |

### [`LiveAudioTextCheck.js`](checks/multimedia/LiveAudioTextCheck.js)

- Checkpoint **185**: Audio only Live, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 460 | Text Transcript for the Live audio may be missing. | Recommendation | 1.2.9 Audio-only (Live) (AAA) | TCS 6.9 |

### [`LiveCaptionCheck.js`](checks/multimedia/LiveCaptionCheck.js)

- Checkpoint **168**: Captions for live multimedia, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

> **Note:** It raises `CaptionCheck`'s IDs 432–434 (checkpoint 108, 1.2.2) and not its own 435–437 (checkpoint 168, 1.2.4). Live-caption findings are therefore reported against 1.2.2.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 432 | Text Transcript and captions may not be matching. *(counted under checkpoint 108, `multimedia.CaptionCheck`)* | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |
| 433 | Text Transcript may not be adequate. *(counted under checkpoint 108, `multimedia.CaptionCheck`)* | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |
| 434 | Captions may be blocking the multimedia content. *(counted under checkpoint 108, `multimedia.CaptionCheck`)* | Recommendation | 1.2.2 Captions (Prerecorded) (A) | EN 9.1.2.2 · IS 9.1.2.2 · GIGW 6.7.2 (a,b) · TCS 6.3, 6.4 |

### [`MediaAlternativeCheck.js`](checks/multimedia/MediaAlternativeCheck.js)

- Checkpoint **184**: Media Alternative, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 459 | Text transcript may be missing for the pre-recorded media. | Recommendation | 1.2.8 Media Alternative (Prerecorded) (AAA) | TCS 6.8 |

### [`ProgrammaticAutoplayCheck.js`](checks/multimedia/ProgrammaticAutoplayCheck.js)

- Checkpoint **244**: Script started audio can be stopped, group *Media*, runs on `body`
- Runtime: JavaScript (in page)

Looks for audio that script starts (`new Audio`, `AudioContext`) or an iframe with `autoplay=1`. Fails 538 when no mute, pause, stop or sound control, and no native media control, is found.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 538 | Script can start audio with no stop control | Warning | 1.4.2 Audio Control (A) | (none) |

### [`SignVideoCheck.js`](checks/multimedia/SignVideoCheck.js)

- Checkpoint **176**: Sign Language, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 449 | Sign Language Video is missing. | Recommendation | 1.2.6 Sign Language (Prerecorded) (AAA) | TCS 6.6 |

### [`UpdatingContentCheck.js`](checks/multimedia/UpdatingContentCheck.js)

- Checkpoint **186**: Moving, scrolling, blinking, and auto-updating content, group *Media*, runs on `audio|video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 462 | Media may be missing controls that provide users with the ability to stop automatically played audio after 3 seconds. | Recommendation | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.3 |

### [`VideoKeyboardTrapCheck.js`](checks/multimedia/VideoKeyboardTrapCheck.js)

- Checkpoint **174**: No keyboard trap for multimedia, group *Media*, runs on `video`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 447 | Keyboard focus gets trapped in the multimedia controls present. | Recommendation | 2.1.2 No Keyboard Trap (A) | EN 9.2.1.2 · IS 9.2.1.2 · GIGW 7.5 (g) · TCS 2.4 |

## 15. Others (`checks/others`)

### [`AbbreviationCheck.js`](checks/others/AbbreviationCheck.js)

- Checkpoint **29**: Mechanism to identify the expanded form or meaning of abbreviations, group *Other Markup Elements*, runs on `abbr|acronym`
- Runtime: JavaScript (in page)

Runs on `<abbr>` and `<acronym>`. Fails 127 when `title` is missing and 128 when it is blank.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 127 | Missing title of abbreviation | Error | 3.1.4 Abbreviations (AAA) | (none) |
| 128 | Blank title of abbreviation | Error | 3.1.4 Abbreviations (AAA) | (none) |

### [`AccessibleAuthenticationCheck.js`](checks/others/AccessibleAuthenticationCheck.js)

- Checkpoint **197**: Accessible Authentication, group *Accessible Authentication*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 477 | Only password authentication method is present. | Recommendation | 3.3.7 Accessible Authentication (AA) | TCS 10.7 |

### [`IdentifyPurposeCheck.js`](checks/others/IdentifyPurposeCheck.js)

- Checkpoint **192**: Identify purpose, group *Identify Purpose*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 472 | Programmatically indicating the purpose of icons, regions and user interface components may be missing. | Recommendation | 1.3.6 Identify Purpose (AAA) | TCS 4.7 |

### [`MinAccessibleAuthenticationCheck.js`](checks/others/MinAccessibleAuthenticationCheck.js)

- Checkpoint **198**: Accessible Authentication Minimum, group *Accessible Authentication*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 478 | Cognitive test present for authentication. | Recommendation | 3.3.8 Accessible Authentication (No Exception) (AAA) | TCS 10.8 |

### [`MinTargetSizeCheck.js`](checks/others/MinTargetSizeCheck.js)

- Checkpoint **195**: Minimum Target Size, group *Target Size*, runs on `body`
- Runtime: JavaScript (in page)

Scans the interactive descendants of its target, skipping links inside `<p>`. Fails 475 when a target is smaller than 24 px and its margins do not make up the difference.

> **Note:** The width is read from the computed height, and the margin values are joined as strings rather than added, so the size test is unreliable.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 475 | Target Size not meeting the 24 by 24 CSS pixels in size requirements. | Warning | 2.5.8 Target Size (Minimum) (AA) | TCS 3.8 |

### [`PronunciationCheck.js`](checks/others/PronunciationCheck.js)

- Checkpoint **158**: Pronunciation, group *Pronunciation*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 395 | Pronunciation of complex word may not be provided. | Recommendation | 3.1.6 Pronunciation (AAA) | TCS 11.5 |

### [`ReadingLevelCheck.js`](checks/others/ReadingLevelCheck.js)

- Checkpoint **157**: Reading Level, group *Reading Level*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 394 | Complex words may be used. | Recommendation | 3.1.5 Reading Level (AAA) | TCS 11.4 |

### [`SignVideoCheck.js`](checks/others/SignVideoCheck.js)

- No checkpoint in masterdata
- Runtime: JavaScript (in page) · **never loaded**

A duplicate of `multimedia/SignVideoCheck.js` that raises 449. Masterdata points at the multimedia copy, so this file never loads.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 449 | Sign Language Video is missing. **⚠ never recorded** | Recommendation | 1.2.6 Sign Language (Prerecorded) (AAA) | TCS 6.6 |

### [`SiteNavigationCheck.js`](checks/others/SiteNavigationCheck.js)

- Checkpoint **175**: Site Navigation, group *Multiple ways to locate Web Pages*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 448 | Required number of site navigation techniques missing. | Recommendation | 2.4.5 Multiple Ways (AA) | EN 9.2.4.5 · IS 9.2.4.5 · GIGW 6.9.1, 6.10.1 · TCS 8.8 |

### [`TargetSizeCheck.js`](checks/others/TargetSizeCheck.js)

- Checkpoint **155**: Target Size, group *Target Size*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 392 | Target Size not meeting the 44 by 44 CSS pixels in size requirements. | Recommendation | 2.5.5 Target Size (AAA) | TCS 3.5 |

### [`UnusualWordsCheck.js`](checks/others/UnusualWordsCheck.js)

- Checkpoint **156**: Unusual Words, group *Unusual Words*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 393 | Definition/Glossary may be missing for words or phrase used in an unusual way. | Recommendation | 3.1.3 Unusual Words (AAA) | TCS 11.6 |

### [`UsabilityCheck.js`](checks/others/UsabilityCheck.js)

- Checkpoint **12**: Other markup elements, group *Other Markup Elements*, runs on `b|i|basefont|font`
- Runtime: JavaScript (in page)

Discouraged presentational elements: `<b>` (59) and `<i>` (60) when they contain text, `<basefont>` (61) always, and `<font>` (62) when it contains text.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 59 | b (bold) element used | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 60 | i (italic) element used | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 61 | basefont element used | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 62 | font element used | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

## 16. Page information (`checks/pageinfo`)

### [`.js`](checks/pageinfo/.js)

- No checkpoint in masterdata
- Runtime: JavaScript (in page) · **never loaded**

An empty file containing only a comment. It has no class name and never loads.

*This file raises no checks.*

### [`AnimationInteractionCheck.js`](checks/pageinfo/AnimationInteractionCheck.js)

- Checkpoint **153**: Animation from interactions, group *Seizures and Physical Reactions*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 390 | Animations may be triggered by interactions. | Recommendation | 2.3.3 Animation from Interactions (AAA) | EN 9.2.3.3 · TCS 7.11 |

### [`ConcurrentInputMechanismsCheck.js`](checks/pageinfo/ConcurrentInputMechanismsCheck.js)

- Checkpoint **159**: Concurrent Input Mechanisms, group *Input Modalitites*, runs on `all`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 396 | Functionality may not be accessible with multiple input modalities. | Recommendation | 2.5.6 Concurrent Input Mechanisms (AAA) | TCS 3.6 |

### [`LangConsistencyCheck.js`](checks/pageinfo/LangConsistencyCheck.js)

- Checkpoint **219**: Page language declarations agree, group *Page Information*, runs on `html`
- Runtime: JavaScript (in page)

Fails 505 when the page has `xml:lang` but no `lang`, and 506 when `lang` and `xml:lang` disagree.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 505 | xml:lang is set but lang is missing | Error | 3.1.1 Language of Page (A) | (none) |
| 506 | lang and xml:lang values do not match | Error | 3.1.1 Language of Page (A) | (none) |

### [`LangDirectionCheck.js`](checks/pageinfo/LangDirectionCheck.js)

- Checkpoint **220**: Page text direction matches its language, group *Page Information*, runs on `html`
- Runtime: JavaScript (in page)

Fails 507 when the page language is right-to-left but `dir` is not `rtl`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 507 | Right to left language declared without dir | Warning | 3.1.1 Language of Page (A) | (none) |

### [`LangPartDirectionCheck.js`](checks/pageinfo/LangPartDirectionCheck.js)

- Checkpoint **222**: Passage text direction matches its language, group *Page Information*, runs on `all`
- Runtime: JavaScript (in page)

Runs on elements other than `<html>` that have a `lang`. Fails 509 when the language is right-to-left but `dir` is not `rtl`, or when `dir="rtl"` is set on a left-to-right language.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 509 | Passage direction does not match its language | Warning | 3.1.2 Language of Parts (AA) | (none) |

### [`LangPartValidityCheck.js`](checks/pageinfo/LangPartValidityCheck.js)

- Checkpoint **221**: Language tags on passages are well formed, group *Page Information*, runs on `all`
- Runtime: JavaScript (in page)

Runs on elements other than `<html>` that have a `lang`. Fails 508 when the value is not a well-formed BCP 47 tag.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 508 | Language tag on a passage is not well formed | Warning | 3.1.2 Language of Parts (AA) | (none) |

### [`LanguageCheck.js`](checks/pageinfo/LanguageCheck.js)

- Checkpoint **17**: Language of page/parts, group *Page Information*, runs on `html`
- Runtime: JavaScript (in page)

Runs on `<html>`. `lang`/`xml:lang` missing (89), blank (90) or not a known language code (91), otherwise a prompt to verify it (92). Always raises 450 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 89 | Document language not defined | Error | 3.1.1 Language of Page (A)<br>3.1.2 Language of Parts (AA) | EN 9.3.1.1, 9.3.1.2 · IS 9.3.1.1, 9.3.1.2 · GIGW 5.3.7 · TCS 11.1, 11.2 |
| 90 | Document language is blank | Error | 3.1.1 Language of Page (A)<br>3.1.2 Language of Parts (AA) | EN 9.3.1.1, 9.3.1.2 · IS 9.3.1.1, 9.3.1.2 · GIGW 5.3.7 · TCS 11.1, 11.2 |
| 91 | Document language may not be valid | Error | 3.1.1 Language of Page (A)<br>3.1.2 Language of Parts (AA) | EN 9.3.1.1, 9.3.1.2 · IS 9.3.1.1, 9.3.1.2 · GIGW 5.3.7 · TCS 11.1, 11.2 |
| 92 | Document language may not be correct | Recommendation | 3.1.1 Language of Page (A)<br>3.1.2 Language of Parts (AA) | EN 9.3.1.1, 9.3.1.2 · IS 9.3.1.1, 9.3.1.2 · GIGW 5.3.7 · TCS 11.1, 11.2 |
| 450 | Document language of part may not defined. | Recommendation | 3.1.1 Language of Page (A)<br>3.1.2 Language of Parts (AA) | EN 9.3.1.1, 9.3.1.2 · IS 9.3.1.1, 9.3.1.2 · GIGW 5.3.7 · TCS 11.1, 11.2 |

### [`LocationCheck.js`](checks/pageinfo/LocationCheck.js)

- Checkpoint **154**: Location, group *Page Information*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 391 | Info about user's location is missing. | Recommendation | 2.4.8 Location (AAA) | TCS 8.9 |

### [`MetaCheck.js`](checks/pageinfo/MetaCheck.js)

- Checkpoint **18**: Meta data, group *Page Information*, runs on `head`
- Runtime: JavaScript (in page)

Runs on `<head>`. Loops over `keywords` and `description`: the meta tag is missing (93, 94) or its content is blank (97, 98). The author and last-modified checks (95, 96, 99, 100) are defined in masterdata, but those names are commented out of `metaData` in `Global.js`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 93 | Metadata keywords not specified | Error | (none) | TCS 12.3 |
| 94 | Metadata description not specified | Error | (none) | TCS 12.3 |
| 97 | Metadata keywords is blank | Error | (none) | TCS 12.3 |
| 98 | Metadata description is blank | Error | (none) | TCS 12.3 |

### [`MotionActuationCheck.js`](checks/pageinfo/MotionActuationCheck.js)

- Checkpoint **122**: Motion Actuation, group *Mobile Actuation*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

> **Note:** It raises 415, which masterdata assigns to `StatusMessagesCheck` (4.1.3). Its own check, 414 (2.5.4), is raised by `StatusMessagesCheck.js`. The two IDs are swapped.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 415 | Status messages must be available programmatically. *(counted under checkpoint 123, `pageinfo.StatusMessagesCheck`)* | Recommendation | 4.1.3 Status messages (AA) | EN 9.4.1.3 · IS 9.4.1.3 |

### [`NoTimingCheck.js`](checks/pageinfo/NoTimingCheck.js)

- Checkpoint **149**: No Timing, group *Time Limits*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 386 | Timed interactions are present in the webpage. | Recommendation | 2.2.3 No Timing (AAA) | EN 9.2.2.3 · TCS 7.6 |

### [`OrientationCheck.js`](checks/pageinfo/OrientationCheck.js)

- Checkpoint **118**: Device Orientation, group *Device Orientation*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 357 | CSS Media queries may be used to lock display orientation. | Recommendation | 1.3.4 Device Orientation (AA) | EN 9.1.3.4 · IS 9.1.3.4 · TCS 4.5 |
| 358 | Device Orientation may be locked using javascript. | Recommendation | 1.3.4 Device Orientation (AA) | EN 9.1.3.4 · IS 9.1.3.4 · TCS 4.5 |
| 411 | Device display orientation locked in one particular mode. | Recommendation | 1.3.4 Device Orientation (AA) | EN 9.1.3.4 · IS 9.1.3.4 · TCS 4.5 |

### [`PointerGesturesCheck.js`](checks/pageinfo/PointerGesturesCheck.js)

- Checkpoint **121**: Pointer Gestures, group *Input Modalitites*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 413 | Keyboard alternative may not be provided for path based gestures. | Recommendation | 2.5.1 Pointer gestures (A) | EN 9.2.5.1 · IS 9.2.5.1 |

### [`ReAuthenticationCheck.js`](checks/pageinfo/ReAuthenticationCheck.js)

- Checkpoint **150**: Re-authenticating, group *Time Limits*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 387 | Unable to continue the activity after re-authenticated. | Recommendation | 2.2.5 Re-authenticating (AAA) | EN 9.2.2.5 · IS 9.2.2.5 · TCS 7.8 |

### [`ReflowCheck.js`](checks/pageinfo/ReflowCheck.js)

- Checkpoint **115**: Reflow, group *Reflow*, runs on `all`
- Runtime: JavaScript (in page)

Reads the viewport `<meta>`. Fails 416 when `maximum-scale` is below 4 or `user-scalable=no`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 416 | Page does not allow resizing | Error | 1.4.10 Reflow (AA) | EN 9.1.4.10 · IS 9.1.4.10 |

### [`ReflowOverflowCheck.java`](checks/pageinfo/ReflowOverflowCheck.java)

- Checkpoint **255**: Content reflows at 320 pixels, group *Reflow*, runs on `body`
- Runtime: Java (WebDriver)

A live probe that runs in Java through WebDriver. It narrows the viewport to 320 CSS px and fails 553 when the page then needs horizontal scrolling.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 553 | Horizontal scrolling required at 320 pixels | Error | 1.4.10 Reflow (AA) | (none) |

### [`RefreshCheck.js`](checks/pageinfo/RefreshCheck.js)

- Checkpoint **19**: Meta data, group *Time Limits*, runs on `head`
- Runtime: JavaScript (in page)

Fails 140 for `<meta http-equiv="refresh">` with a timeout, and rewrites that timeout to 600 s in the live page. Always raises 384, 397 and 398 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 140 | Page refresh is used with a timeout | Error | 2.2.1 Timing Adjustable (A)<br>2.2.4 Interruptions (AAA)<br>3.2.5 Change on Request (AAA) | EN 9.2.2.1, 9.2.2.4 · IS 9.2.2.1 · GIGW 7.5 ( c) · TCS 7.2, 7.7, 9.5 |
| 384 | Unable to turn off/postpone alerts, page updates. | Recommendation | 2.2.1 Timing Adjustable (A)<br>2.2.4 Interruptions (AAA)<br>3.2.5 Change on Request (AAA) | EN 9.2.2.1, 9.2.2.4 · IS 9.2.2.1 · GIGW 7.5 ( c) · TCS 7.2, 7.7, 9.5 |
| 397 | Page may contain time limits for user interaction or viewing content. | Recommendation | 2.2.1 Timing Adjustable (A)<br>2.2.4 Interruptions (AAA)<br>3.2.5 Change on Request (AAA) | EN 9.2.2.1, 9.2.2.4 · IS 9.2.2.1 · GIGW 7.5 ( c) · TCS 7.2, 7.7, 9.5 |
| 398 | Time Limit may not be extended. | Recommendation | 2.2.1 Timing Adjustable (A)<br>2.2.4 Interruptions (AAA)<br>3.2.5 Change on Request (AAA) | EN 9.2.2.1, 9.2.2.4 · IS 9.2.2.1 · GIGW 7.5 ( c) · TCS 7.2, 7.7, 9.5 |

### [`ResizeOverflowCheck.java`](checks/pageinfo/ResizeOverflowCheck.java)

- Checkpoint **254**: Content survives 200 percent zoom, group *Resizing*, runs on `body`
- Runtime: Java (WebDriver)

A live probe that runs in Java through WebDriver. It halves the viewport to simulate 200% zoom and fails 552 when the document overflows horizontally. Tables, code and media are excluded.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 552 | Content overflows when zoomed to 200 percent | Error | 1.4.4 Resize text (AA) | (none) |

### [`ResizingCheck.js`](checks/pageinfo/ResizingCheck.js)

- Checkpoint **161**: Resizing to 200%, group *Resizing*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 417 | Resizing text content in not supported. | Recommendation | 1.4.4 Resize text (AA) | EN 9.1.4.4 · IS 9.1.4.4 · GIGW 6.4.5 · TCS 5.4 |
| 418 | Content may be lost on resizing. | Recommendation | 1.4.4 Resize text (AA) | EN 9.1.4.4 · IS 9.1.4.4 · GIGW 6.4.5 · TCS 5.4 |
| 419 | Horizontal Scrolling is present when resizing the text to 200% | Recommendation | 1.4.4 Resize text (AA) | EN 9.1.4.4 · IS 9.1.4.4 · GIGW 6.4.5 · TCS 5.4 |

### [`ScriptedRedirectCheck.js`](checks/pageinfo/ScriptedRedirectCheck.js)

- Checkpoint **217**: Script driven timers that change the page, group *Time Limits*, runs on `body`
- Runtime: JavaScript (in page)

Fails 503 when an inline script sets a timer (`setTimeout`/`setInterval`) that navigates, reloads or submits the page.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 503 | Timer in script navigates or submits the page | Error | 2.2.1 Timing Adjustable (A) | (none) |

### [`StatusMessagesCheck.js`](checks/pageinfo/StatusMessagesCheck.js)

- Checkpoint **123**: Status Messages, group *Page Information*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

> **Note:** It raises 414, which masterdata assigns to `MotionActuationCheck` (2.5.4). Its own check, 415 (4.1.3), is raised by `MotionActuationCheck.js`. The two IDs are swapped.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 414 | Device motion activities may not be operable by user interface components. *(counted under checkpoint 122, `pageinfo.MotionActuationCheck`)* | Recommendation | 2.5.4 Motion actuation (A) | EN 9.2.5.4 · IS 9.2.5.4 |

### [`TextSpacingCheck.js`](checks/pageinfo/TextSpacingCheck.js)

- Checkpoint **117**: Text Spacing, group *Text Spacing*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 359 | Letter spacing in style attributes is !important. | Recommendation | 1.4.12 Text spacing (AA) | EN 9.1.4.12 · IS 9.1.4.12 · TCS 5.8 |
| 360 | Word spacing in style attributes is !important | Recommendation | 1.4.12 Text spacing (AA) | EN 9.1.4.12 · IS 9.1.4.12 · TCS 5.8 |
| 361 | Line height in style attributes is !important. | Recommendation | 1.4.12 Text spacing (AA) | EN 9.1.4.12 · IS 9.1.4.12 · TCS 5.8 |
| 407 | Please check that content should not overlap when letter spacing changes | Recommendation | 1.4.12 Text spacing (AA) | EN 9.1.4.12 · IS 9.1.4.12 · TCS 5.8 |

### [`TextSpacingVisualCheck.js`](checks/pageinfo/TextSpacingVisualCheck.js)

- Checkpoint **200**: Text Spacing, group *Text Spacing*, runs on `p`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 480 | Unable to customize the visual presentation of the website. | Recommendation | 1.4.8 Visual Presentation (AAA) | EN 9.1.4.8 · TCS 5.11 |

### [`ThreeFlashesCheck.js`](checks/pageinfo/ThreeFlashesCheck.js)

- Checkpoint **152**: Flashing content, group *Seizures and Physical Reactions*, runs on `head`
- Runtime: JavaScript (in page)

Raises 389 when the page contains `<object>` or `<embed>`, which could flash.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 389 | Content flashes more than three times in any 1-second period. | Recommendation | 2.3.2 Three Flashes (AAA) | EN 9.2.3.2 · GIGW 6.7.3 (a) · TCS 7.10 |

### [`ThreeFlashesorBelowCheck.js`](checks/pageinfo/ThreeFlashesorBelowCheck.js)

- Checkpoint **164**: Large Flashing Content, group *Seizures and Physical Reactions*, runs on `head`
- Masterdata names this class `pageinfo.ThreeFlashesOrBelowCheck`, which differs from the file name in case
- Runtime: JavaScript (in page) · **never loaded**

Meant to raise 424 and 431 when the page contains `<object>` or `<embed>`.

> **Note:** The file is named `...orBelow...`, but masterdata loads `pageinfo.ThreeFlashesOrBelowCheck`. Resource lookup inside the jar is case-sensitive, so the packaged scanner never finds this file, and 424 and 431 are never raised. The function inside is spelled correctly.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 424 | Large Flashing Area **⚠ never recorded** | Recommendation | 2.3.1 Three Flashes or Below Threshold (A) | EN 9.2.3.1 · IS 9.2.3.1 · TCS 7.4 |
| 431 | Content in the webpage flashes more than three times in any 1-second period. **⚠ never recorded** | Recommendation | 2.3.1 Three Flashes or Below Threshold (A) | EN 9.2.3.1 · IS 9.2.3.1 · TCS 7.4 |

### [`TimeoutCheck.js`](checks/pageinfo/TimeoutCheck.js)

- Checkpoint **151**: Timeouts, group *Time Limits*, runs on `head`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 388 | Warning about duration of user inactivity not present. | Recommendation | 2.2.6 Timeouts (AAA) | EN 9.2.2.6 · TCS 7.9 |

### [`TitleCheck.js`](checks/pageinfo/TitleCheck.js)

- Checkpoint **16**: Page title, group *Page Information*, runs on `head`
- Runtime: JavaScript (in page)

Runs on `<head>`. `<title>` missing (83), blank (84), shorter than 6 characters (85) or longer than 120 (86). Placeholder title (87), otherwise a prompt to verify it (88).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 83 | Missing page title | Error | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |
| 84 | Page title is blank | Error | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |
| 85 | Page title text is short | Warning | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |
| 86 | Page title text is verbose | Warning | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |
| 87 | Page title is placeholder text | Error | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |
| 88 | Page title may not be meaningful | Recommendation | 2.4.2 Page Titled (A) | EN 9.2.4.2 · IS 9.2.4.2 · GIGW 2.1.6 · TCS 8.2 |

### [`TitleTemplateTokenCheck.js`](checks/pageinfo/TitleTemplateTokenCheck.js)

- Checkpoint **218**: Page title is fully rendered, group *Page Information*, runs on `title`
- Runtime: JavaScript (in page)

Fails 504 when the page title still contains a template token (`{{`, `${`, `<%`) or reads `undefined`, `null` or `NaN`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 504 | Page title contains an unrendered placeholder | Error | 2.4.2 Page Titled (A) | (none) |

### [`ZoomCheck.js`](checks/pageinfo/ZoomCheck.js)

- Checkpoint **111**: Zooming, group *Resizing*, runs on `all`
- Runtime: JavaScript (in page)

Reads the viewport `<meta>`. Fails 337 when `maximum-scale` is below 2 or `user-scalable=no`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 337 | Page does not allow zooming | Error | 1.4.4 Resize text (AA) | EN 9.1.4.4 · IS 9.1.4.4 · GIGW 6.4.5 |

## 17. Paragraphs (`checks/paragraph`)

### [`EmptyCheck.js`](checks/paragraph/EmptyCheck.js)

- Checkpoint **101**: Linebreak Misuse, group *Paragraphs*, runs on `p`
- Runtime: JavaScript (in page)

Runs on visible `<p>` elements. Fails 274 when a paragraph is empty. Always raises 368 and 369 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 274 | Empty Paragraph | Error | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 368 | Content may not be arranged syntactically using `<p>` tags. | Recommendation | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |
| 369 | (`<p>`) tags should not be used for visual presentations. | Recommendation | 1.3.1 Info and Relationships (A) | EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.1 |

### [`JustifyCheck.js`](checks/paragraph/JustifyCheck.js)

- Checkpoint **100**: Text justification, group *Paragraphs*, runs on `p`
- Runtime: JavaScript (in page)

Fails 253 for justified text, whether from CSS `text-align` or the `align` attribute.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 253 | Text alignment is justified | Warning | 1.4.8 Visual Presentation (AAA) | EN 9.1.4.8 · TCS 5.11 |

## 18. Tables (`checks/tables`)

### [`EmptyHeaderCheck.js`](checks/tables/EmptyHeaderCheck.js)

- Checkpoint **251**: Header cells are not empty, group *Tables*, runs on `th`
- Runtime: JavaScript (in page)

Fails 549 when a `<th>` has no text, no `aria-label` and no image `alt`.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 549 | Table header cell is empty | Warning | 1.3.1 Info and Relationships (A) | (none) |

### [`InfoAndRelationshipCheck.js`](checks/tables/InfoAndRelationshipCheck.js)

- Checkpoint **13**: Table, group *Tables*, runs on `table`
- Runtime: JavaScript (in page)

Runs on every `<table>`. A `role=presentation` table that contains `th` (370). A table with no `th` that still looks like data, because of borders (64). Tables with no `th` and no borders are treated as layout tables: without `role=presentation` they get 284, and they are flagged when they have a `<caption>` (70) or a `summary` (71). Data tables: caption missing (65), blank (66), shorter than 6 characters (279) or longer than 120 (280); summary missing on a complex table (67), blank (68), shorter than 15 characters (281) or the same as the caption (69); a complex table without `headers`/`id` (72); `scope` missing when there are both row and column headers (245). Always raises 452 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 64 | Missing row and column headers | Warning | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 65 | Missing caption | Warning | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 66 | Caption is blank | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 67 | Missing summary | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 68 | Blank summary | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 69 | Summary duplicates the caption | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 70 | Layout table contains caption | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 71 | Layout table contains summary | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 72 | Complex table missing id & header for identification of cells | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 245 | Table missing scope of row and column headers | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 279 | Caption is short | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 280 | Caption is long | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 281 | Summary is short | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 284 | Missing row and column headers | Warning | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 370 | `<th>` present for table used for Layout purpose . | Error | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |
| 452 | `<pre>` has been used to present tabular info | Recommendation | 1.3.1 Info and Relationships (A) | 508 (g), (h) · EN 9.1.3.1 · IS 9.1.3.1 · GIGW 5.6.3 · TCS 4.2 |

### [`NestedTableCheck.js`](checks/tables/NestedTableCheck.js)

- Checkpoint **249**: Tables are not nested, group *Tables*, runs on `table`
- Runtime: JavaScript (in page)

Fails 547 when a table is nested inside another table.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 547 | Table is nested inside another table | Error | 1.3.1 Info and Relationships (A) | (none) |

### [`TableStructureCheck.js`](checks/tables/TableStructureCheck.js)

- Checkpoint **250**: Tables contain data cells, group *Tables*, runs on `table`
- Runtime: JavaScript (in page)

Fails 548 when a table has header cells but no data cells.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 548 | Table has header cells but no data cells | Error | 1.3.1 Info and Relationships (A) | (none) |

## 19. Visual (`checks/visual`)

### [`AdditionalContentCheck.js`](checks/visual/AdditionalContentCheck.js)

- Checkpoint **120**: Additional Content on Hover or Focus, group *Content on Hover*, runs on `all`
- Runtime: JavaScript (in page)

Raises 412 for elements with `data-toggle`, which usually reveal extra content on hover or focus.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 412 | Additional content on focus or mouse hovers must be dismissable, hoverable and persistent. | Recommendation | 1.4.13 Content on hover or focus (AA) | EN 9.1.4.13 · IS 9.1.4.13 |

### [`AnimatedContentPauseCheck.js`](checks/visual/AnimatedContentPauseCheck.js)

- Checkpoint **235**: Moving content can be paused, group *Seizures and Physical Reactions*, runs on `all`
- Runtime: JavaScript (in page)

Runs on CSS animations that last more than 5 s or loop forever. Fails 525 when no pause or stop control exists on the page. When one does, raises 526 to confirm it stops everything.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 525 | Moving content has no pause control | Error | 2.2.2 Pause, Stop, Hide (A) | (none) |
| 526 | Pause control needs verification | Warning | 2.2.2 Pause, Stop, Hide (A) | (none) |

### [`ButtonTextColorContrastCheck.js`](checks/visual/ButtonTextColorContrastCheck.js)

- Checkpoint **163**: Color contrast for Button text, group *Button*, runs on `button|input`
- Runtime: JavaScript (in page)

Always raises 423 on buttons (`button`, `role=button`, and submit, reset and button inputs), for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 423 | Text in Button elements must have sufficient color contrast against the background. | Recommendation | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |

### [`ColorContrastCheckAA.js`](checks/visual/ColorContrastCheckAA.js)

- Checkpoint **21**: Color contrast, group *Visual Content*, runs on `a|div|p|span|strong|em|q|cite|blockquote|li|dd|dt|td|th|h1|h2|h3|h4|h5|h6|label|acronym|abbr|code|pre|input|select|textarea`
- Runtime: JavaScript (in page)

Defines the shared contrast engine. Runs on displayed elements with their own text, and on form inputs. Fails 103 below 4.5:1 (3:1 for large text). The same engine raises 104 (no background colour set), 256 (default foreground on a set background) and 278 (background image, so contrast is not computed).

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 103 | Insufficient contrast between text foreground and background | Error | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 104 | Element background color not set when text color is specified | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 256 | Element text color not set when background color is specified | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 278 | Background image is used | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |

### [`ColorContrastCheckAAA.js`](checks/visual/ColorContrastCheckAAA.js)

- Checkpoint **28**: Color contrast, group *Visual Content*, runs on `a|div|p|span|strong|em|q|cite|blockquote|li|dd|dt|td|th|h1|h2|h3|h4|h5|h6|label|acronym|abbr|code|pre|input|select|textarea`
- Runtime: JavaScript (in page)

Reuses `checkContrast` from `ColorContrastCheckAA.js` at 7:1 (4.5:1 for large text) and fails 125. The shared engine also raises 104, 256 and 278. When AAA is selected, `ValidatorAnalyzer` removes the AA checkpoint from the run, so 103 is not raised.

> **Note:** It depends on `checkContrast`, which is defined in `ColorContrastCheckAA.js`. The AA file must be loaded in the same run, even though the AA function itself is not called.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 104 | Element background color not set when text color is specified *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 125 | Insufficient contrast between text foreground and background | Error | 1.4.6 Contrast (Enhanced) (AAA) | EN 9.1.4.6 |
| 256 | Element text color not set when background color is specified *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 278 | Background image is used *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |

### [`ColorUtils.java`](checks/visual/ColorUtils.java)

- No checkpoint in masterdata
- Runtime: Java (WebDriver)

A Java colour helper used by `CommonMethods.java`, for widget contrast. It raises no checks.

*This file raises no checks.*

### [`ColorValue.java`](checks/visual/ColorValue.java)

- No checkpoint in masterdata
- Runtime: Java (WebDriver)

A Java colour value type used by `ColorUtils`. It raises no checks.

*This file raises no checks.*

### [`FocusIndicatorContrastCheck.js`](checks/visual/FocusIndicatorContrastCheck.js)

- Checkpoint **232**: Focus indicator is visible and contrasting, group *Visual Content*, runs on `all`
- Runtime: JavaScript (in page)

Runs on focusable elements. It collects the page's `:focus` rules. Fails 520 when a matching rule removes the outline and supplies no replacement. When no rule matches and the outline style at rest is `none`, raises 521 to confirm a focus indicator with at least 3:1 contrast appears.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 520 | Focus outline is removed with no replacement | Error | 1.4.11 Non text contrast (AA) | (none) |
| 521 | No focus indicator style could be found | Warning | 1.4.11 Non text contrast (AA) | (none) |

### [`FormDecorationCheck.js`](checks/visual/FormDecorationCheck.js)

- Checkpoint **134**: Color not the only means of identification., group *Forms*, runs on `form`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 362 | Color may be only visual means of conveying field in error. | Recommendation | 1.4.1 Use of Color (A) | EN 9.1.4.1 · IS 9.1.4.1 · GIGW 6.5.4 · TCS 5.2 |

### [`GradientContrastReviewCheck.js`](checks/visual/GradientContrastReviewCheck.js)

- Checkpoint **231**: Text on gradient backgrounds, group *Visual Content*, runs on `all`
- Runtime: JavaScript (in page)

Raises 519 for text that sits on a CSS gradient within 5 ancestor levels, because a single contrast ratio cannot be computed.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 519 | Text sits on a gradient background | Warning | 1.4.3 Contrast (Minimum) (AA) | (none) |

### [`HoverRevealDismissCheck.js`](checks/visual/HoverRevealDismissCheck.js)

- Checkpoint **234**: Hover content is dismissible and persistent, group *Content on Hover*, runs on `all`
- Runtime: JavaScript (in page)

Uses the `:hover` rules that reveal content, reusing helpers from `FocusIndicatorContrastCheck.js`. Fails 523 when no key handler exists to dismiss the revealed content. Always raises 524 to confirm the content can be hovered over and persists.

> **Note:** It silently does nothing unless `FocusIndicatorContrastCheck.js` is loaded in the same run.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 523 | Hover or focus content cannot be dismissed | Error | 1.4.13 Content on hover or focus (AA) | (none) |
| 524 | Hover or focus content needs persistence check | Warning | 1.4.13 Content on hover or focus (AA) | (none) |

### [`LinkDecorationCheck.js`](checks/visual/LinkDecorationCheck.js)

- Checkpoint **93**: Color not the only means of identification, group *Visual Content*, runs on `a`
- Runtime: JavaScript (in page)

Fails 235 for a link inside running text whose `text-decoration`, `font-style` and `font-weight` match its parent, so colour alone marks it as a link.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 235 | Color is the only means of differentiating link and text | Warning | 1.4.1 Use of Color (A) | 508 (c) · EN 9.1.4.1 · IS 9.1.4.1 · GIGW 6.5.4 · TCS 5.2 |

### [`NativeTooltipContentCheck.js`](checks/visual/NativeTooltipContentCheck.js)

- Checkpoint **233**: Title attribute used to carry content, group *Content on Hover*, runs on `all`
- Runtime: JavaScript (in page)

Fails 522 when `title` carries information beyond the visible label. Iframes, frames, images, areas and inputs are exempt.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 522 | Title attribute carries content beyond the label | Error | 1.4.13 Content on hover or focus (AA) | (none) |

### [`NonTextColorContrastCheck.js`](checks/visual/NonTextColorContrastCheck.js)

- Checkpoint **114**: Color Contrast for Non Text content, group *Visual Content*, runs on `button|div|input`
- Runtime: JavaScript (in page)

Reuses the helpers in `ColorContrastCheckAA.js` to compare the border colour with the background. Fails 404 below 3:1, and raises 104, 256 and 278 as the text engine does.

> **Note:** It depends on the helpers in `ColorContrastCheckAA.js`, so it throws when the AA contrast file is not loaded in the same run.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 104 | Element background color not set when text color is specified *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 256 | Element text color not set when background color is specified *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 278 | Background image is used *(counted under checkpoint 21, `visual.ColorContrastCheckAA`)* | Warning | 1.4.3 Contrast (Minimum) (AA) | EN 9.1.4.3 · IS 9.1.4.3 · GIGW 6.5.1 · TCS 5.3 |
| 404 | Insufficient contrast between UI component and background | Warning | 1.4.11 Non text contrast (AA) | EN 9.1.4.11 · IS 9.1.4.11 |

### [`SensoryCharacteristicsCheck.js`](checks/visual/SensoryCharacteristicsCheck.js)

- Checkpoint **178**: Color not the only means of identification, group *Visual Content*, runs on `body`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 453 | Graphical symbol alone is used to convey information. | Recommendation | 1.3.3 Sensory Characteristics (A) | EN 9.1.3.3 · IS 9.1.3.3 · GIGW 7.5 (d) · TCS 5.1 |

### [`TableDecorationCheck.js`](checks/visual/TableDecorationCheck.js)

- Checkpoint **135**: Color not the only means of identification., group *Tables*, runs on `table`
- Runtime: JavaScript (in page)

Always raised on its target, as a prompt for manual verification.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 363 | Color may be only visual means of conveying information in the table. | Recommendation | 1.4.1 Use of Color (A) | EN 9.1.4.1 · IS 9.1.4.1 · GIGW 6.5.4 · TCS 5.2 |

### [`UpdatingContentCheck.js`](checks/visual/UpdatingContentCheck.js)

- Checkpoint **20**: Moving, scrolling, blinking, and auto-updating content, group *Visual Content*, runs on `blink|marquee`
- Runtime: JavaScript (in page)

Fails 101 for `<blink>` and 102 for `<marquee>`. Always raises 461 for manual review.

| ID | Check | Severity | WCAG 2.2 | Other standards |
|---:|---|---|---|---|
| 101 | blink element used | Warning | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.3 |
| 102 | marquee element used | Warning | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.3 |
| 461 | Option to pause, stop, or hide the moving, blinking, scrolling, or updating content is missing. | Recommendation | 2.2.2 Pause, Stop, Hide (A) | EN 9.2.2.2 · IS 9.2.2.2 · GIGW 6.7.3 (b) · TCS 7.3 |

## 20. Shared infrastructure

These files raise no checks of their own. The runtime needs them.

| File | Role |
|---|---|
| `checks/Check.java` | The abstract base class for the Java checks. It collects failed and passed IDs, with their messages. |
| `common/Global.js` | Shared globals for every JS check: regexes, the heading list, focus data passed in from Java, and the checkpoint list. |
| `common/Util.js` | Shared DOM helpers: `getStyle`, `isDisplayed`, `isSkipLink`, `getIdentifier`, `countWords`, and so on. |
| `common/Results.js` | `getFailedCheck()`, which builds the result row (check ID, element, snippet and crop box) that `addFailedCheck` and `addPassedCheck` push. |

## Appendix A: masterdata checks that no code raises

These checks are in `masterdata.json` but no file raises them, so they never appear in a report.

| ID | Checkpoint | Check | Why it never appears |
|---:|---|---|---|
| 75 | 15 `frames.FrameAccessibilityCheck` | Noframes not specified | The call passes the element as the ID (see `FrameAccessibilityCheck.js`). |
| 95 | 18 `pageinfo.MetaCheck` | Metadata author not specified | The `author` entry is commented out of `metaData` in `Global.js`. |
| 96 | 18 `pageinfo.MetaCheck` | Metadata last modified not specified | The `last modified` entry is commented out of `metaData` in `Global.js`. |
| 99 | 18 `pageinfo.MetaCheck` | Metadata author is blank | The `author` entry is commented out of `metaData` in `Global.js`. |
| 100 | 18 `pageinfo.MetaCheck` | Metadata last modified is blank | The `last modified` entry is commented out of `metaData` in `Global.js`. |
| 116 | 26 `external.ObjectCheck` | Missing object title | No code raises it. |
| 117 | 26 `external.ObjectCheck` | Blank object title | No code raises it. |
| 121 | 27 `external.EmbedCheck` | embed must have alt attribute. | No code raises it. |
| 122 | 27 `external.EmbedCheck` | embed must not have empty Alt text. | No code raises it. |
| 123 | 4 `images.AreaAlternateTextCheck` | Image map hotspot to a sound file must have a text transcript | No code raises it. |
| 126 | 28 `visual.ColorContrastCheckAAA` | Transparent element background | No code raises it (the AAA engine raises 104 instead). |
| 143 | 37 `keyboard.VisibleFocusCheck` | Focus is not visible on the element | The checkpoint class has no file (and is disabled). |
| 194 | 72 `dynamicelements.CaptchaCheck` | One or more elements of CAPTCHA do not receive keyboard focus | Commented out in `CaptchaCheck.java`. |
| 228 | 14 `links.SkipLinkCheck` | Skip link not navigating to the desired location | No code raises it. |
| 282 | 13 `tables.InfoAndRelationshipCheck` | Summary has placeholder text | No code raises it. |
| 334 | 110 `css.ContentCheck` | Informational content has been added using CSS | Commented out in `css/ContentCheck.js`. |
| 349 | 1 `forms.AlternateTextCheck` | Single label for multiple form fields exists. | No code raises it. |
| 355 | 2 `images.AlternateTextCheck` | Image may be used of decorative purpose. | No code raises it. |
| 356 | 2 `images.AlternateTextCheck` | Image alt text may be duplicated. | No code raises it. |
| 364 | 136 `images.AlternateTextCheck` | Image of text has been used. | No code raises it (checkpoint 136 has no emitter). |
| 365 | 137 `images.ImageTextCheck` | Image of text has been used. | The checkpoint class has no file (and is disabled). |
| 435 | 168 `multimedia.LiveCaptionCheck` | Live multimedia missing open/closed captions. | `LiveCaptionCheck.js` raises 432–434 instead. |
| 436 | 168 `multimedia.LiveCaptionCheck` | Captions for live media are missing. | `LiveCaptionCheck.js` raises 432–434 instead. |
| 437 | 168 `multimedia.LiveCaptionCheck` | Captions may be blocking the live multimedia content. | `LiveCaptionCheck.js` raises 432–434 instead. |
| 451 | 177 `markup.LandmarkRegionCheck` | Missing landmark regions in the page. | The checkpoint class `LandmarkRegionCheck` has no file. |
| 455 | 180 `multimedia.VisibleFocusCheck` | One or more elements do not have a visible keyboard focus indicator. | The checkpoint class `multimedia.VisibleFocusCheck` has no file. |
| 464 | 188 `images.ImageTextNoExceptionCheck` | Image of text has been used to convey information. | The checkpoint class has no file (and is disabled). |
| 481 | 2 `images.AlternateTextCheck` | Missing alt attribute and long description of the image. | No code raises it. |
| 482 | 201 `common.general` | Verify web content has documented accessibility features | The checkpoint `common.general` has no file (and is disabled). |
| 483 | 201 `common.general` | Verify if ICT uses biological characteristics, it shall not rely on the use of a particular biological characteristic as the only means of user identification or for control of ICT. | The checkpoint `common.general` has no file (and is disabled). |
| 484 | 201 `common.general` | Verify if ICT converts information or communication it shall preserve all documented non-proprietary information that is provided for accessibility, to the extent that such information can be contained in or supported by the destination format | The checkpoint `common.general` has no file (and is disabled). |
| 558 | 258 `dynamicelements.DialogCheck` | Focus is not returned to the triggering control when the dialog closes | Documented in `DialogCheck.java`, but never raised. |

## Appendix B: checkpoints whose class has no file

| Checkpoint | `check_class` | Enabled | Status |
|---:|---|---|---|
| 137 | `images.ImageTextCheck` | no | The checkpoint is disabled. |
| 188 | `images.ImageTextNoExceptionCheck` | no | The checkpoint is disabled. |
| 37 | `keyboard.VisibleFocusCheck` | no | The checkpoint is disabled. |
| 177 | `markup.LandmarkRegionCheck` | yes | The checkpoint is **enabled**, but it has no file, so check 451 never runs. |
| 180 | `multimedia.VisibleFocusCheck` | yes | The checkpoint is **enabled**, but it has no file, so check 455 never runs. |
| 201 | `common.general` | no | The checkpoint is disabled. It holds the EN 301 549 generic requirements (482–484). |

## Appendix C: WCAG 2.2 success criteria and the checks that report against them

This covers checks that reach a report. A check can map to more than one criterion.

| Success criterion | Check IDs |
|---|---|
| 1.1.1 Non-text Content (A) | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 110, 111, 112, 113, 114, 115, 118, 119, 120, 137, 197, 198, 199, 200, 215, 216, 226, 230, 231, 232, 233, 237, 239, 240, 254, 255, 257, 258, 260, 261, 262, 263, 264, 265, 267, 268, 273, 283, 382, 539, 540, 541, 542 |
| 1.2.1 Audio-only and Video-only (Prerecorded) (A) | 427, 428, 429, 430, 537 |
| 1.2.2 Captions (Prerecorded) (A) | 332, 432, 433, 434, 534, 535, 536 |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) (A) | 333 |
| 1.2.5 Audio Description (Prerecorded) (AA) | 457 |
| 1.2.6 Sign Language (Prerecorded) (AAA) | 449 |
| 1.2.7 Extended Audio Description (Prerecorded) (AAA) | 458 |
| 1.2.8 Media Alternative (Prerecorded) (AAA) | 459 |
| 1.2.9 Audio-only (Live) (AAA) | 460 |
| 1.3.1 Info and Relationships (A) | 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 124, 139, 159, 172, 182, 217, 234, 241, 242, 243, 244, 245, 246, 247, 248, 259, 274, 275, 279, 280, 281, 284, 296, 299, 301, 309, 314, 328, 335, 338, 340, 348, 368, 369, 370, 399, 421, 422, 452, 544, 545, 546, 547, 548, 549, 570, 587, 588 |
| 1.3.2 Meaningful Sequence (A) | 162, 175, 191, 201, 220, 442, 443 |
| 1.3.3 Sensory Characteristics (A) | 453 |
| 1.3.4 Device Orientation (AA) | 357, 358, 411 |
| 1.3.5 Identify Input Purpose (AA) | 400, 401, 410 |
| 1.3.6 Identify Purpose (AAA) | 472 |
| 1.4.1 Use of Color (A) | 235, 362, 363 |
| 1.4.2 Audio Control (A) | 251, 266, 439, 538 |
| 1.4.3 Contrast (Minimum) (AA) | 103, 104, 152, 161, 174, 190, 203, 219, 256, 278, 423, 519 |
| 1.4.4 Resize text (AA) | 79, 337, 417, 418, 419, 552 |
| 1.4.5 Images of Text (AA) | 164, 177, 193, 205, 222, 543 |
| 1.4.6 Contrast (Enhanced) (AAA) | 125 |
| 1.4.7 Low or No Background Audio (AAA) | 473 |
| 1.4.8 Visual Presentation (AAA) | 253, 480 |
| 1.4.10 Reflow (AA) | 405, 416, 553 |
| 1.4.11 Non text contrast (AA) | 404, 520, 521, 577 |
| 1.4.12 Text spacing (AA) | 359, 360, 361, 407 |
| 1.4.13 Content on hover or focus (AA) | 412, 522, 523, 524, 572, 573, 574 |
| 2.1.1 Keyboard (A) | 34, 35, 36, 37, 38, 39, 40, 129, 130, 131, 132, 133, 134, 145, 146, 154, 165, 178, 179, 180, 195, 209, 210, 211, 225, 229, 238, 277, 285, 294, 295, 302, 310, 311, 312, 354, 376, 438, 456, 510, 511, 512, 554, 568, 569, 593, 594 |
| 2.1.2 No Keyboard Trap (A) | 147, 155, 166, 181, 196, 212, 377, 379, 380, 446, 447, 555, 556 |
| 2.1.3 Keyboard (No Exception) (AAA) | 385 |
| 2.1.4 Character key shortcuts (A) | 402, 513 |
| 2.2.1 Timing Adjustable (A) | 140, 384, 397, 398, 503 |
| 2.2.2 Pause, Stop, Hide (A) | 101, 102, 206, 207, 208, 461, 462, 525, 526 |
| 2.2.3 No Timing (AAA) | 386 |
| 2.2.4 Interruptions (AAA) | 140, 384, 397, 398 |
| 2.2.5 Re-authenticating (AAA) | 387 |
| 2.2.6 Timeouts (AAA) | 388 |
| 2.3.2 Three Flashes (AAA) | 389 |
| 2.3.3 Animation from Interactions (AAA) | 390 |
| 2.4.1 Bypass Blocks (A) | 73, 74, 76, 77, 78, 80, 81, 82, 227, 236, 249, 250, 269, 270, 272, 489, 490, 491, 492 |
| 2.4.2 Page Titled (A) | 83, 84, 85, 86, 87, 88, 504 |
| 2.4.3 Focus Order (A) | 162, 175, 191, 201, 220, 440, 441, 514, 515, 516, 557, 595, 601 |
| 2.4.4 Link Purpose (In Context) (A) | 53, 54, 55, 56, 57, 58, 124, 160, 173, 189, 202, 218, 234, 248, 527, 528, 529, 530 |
| 2.4.5 Multiple Ways (AA) | 448 |
| 2.4.6 Headings and Labels (AA) | 246, 550 |
| 2.4.7 Focus Visible (AA) | 144, 153, 163, 176, 192, 204, 221, 378, 381, 563, 571 |
| 2.4.8 Location (AAA) | 391, 584 |
| 2.4.9 Link Purpose (Link Only) (AAA) | 420 |
| 2.4.10 Section Headings (AAA) | 366, 367 |
| 2.4.11 Focus Appearance (Minimum) (AA) | 465, 466, 467, 468 |
| 2.4.12 Focus Not Obscured (Minimum) (AA) | 469, 517 |
| 2.4.13 Focus Not Obscured (Enhanced) (AAA) | 470, 471 |
| 2.5.1 Pointer gestures (A) | 413 |
| 2.5.2 Pointer cancellation (A) | 406, 425, 493 |
| 2.5.3 Label in name (A) | 403, 408, 409, 496 |
| 2.5.4 Motion actuation (A) | 414 |
| 2.5.5 Target Size (AAA) | 392 |
| 2.5.6 Concurrent Input Mechanisms (AAA) | 396 |
| 2.5.7 Dragging Movements (AA) | 494 |
| 2.5.8 Target Size (Minimum) (AA) | 475 |
| 3.1.1 Language of Page (A) | 89, 90, 91, 92, 450, 505, 506, 507 |
| 3.1.2 Language of Parts (AA) | 89, 90, 91, 92, 450, 508, 509 |
| 3.1.3 Unusual Words (AAA) | 393 |
| 3.1.4 Abbreviations (AAA) | 127, 128 |
| 3.1.5 Reading Level (AAA) | 394 |
| 3.1.6 Pronunciation (AAA) | 395 |
| 3.2.1 On Focus (A) | 350, 351, 352, 353, 463, 531, 532, 533 |
| 3.2.2 On Input (A) | 138, 142, 223, 224, 252, 518 |
| 3.2.3 Consistent Navigation (AA) | 444, 445 |
| 3.2.4 Consistent Identification (AA) | 135, 136, 454, 551 |
| 3.2.5 Change on Request (AAA) | 140, 384, 397, 398, 463 |
| 3.2.6 Consistent Help (A) | 476 |
| 3.3.1 Error Identification (A) | 343, 344 |
| 3.3.2 Labels or Instructions (A) | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 230, 231, 233, 237, 241, 243, 254, 257, 258, 259, 260, 261, 262, 263, 264, 265, 286, 291, 292, 297, 300, 306, 346, 382, 495, 497 |
| 3.3.3 Error Suggestion (AA) | 345, 498, 499 |
| 3.3.4 Error Prevention (Legal, Financial, Data) (AA) | 347, 500, 501 |
| 3.3.5 Help (AAA) | 383 |
| 3.3.6 Error Prevention (All) (AAA) | 347 |
| 3.3.7 Accessible Authentication (AA) | 477 |
| 3.3.8 Accessible Authentication (No Exception) (AAA) | 478 |
| 3.3.9 Redundant Entry (A) | 479, 502 |
| 4.1.2 Name, Role, Value (A) | 76, 77, 78, 80, 81, 82, 148, 149, 150, 151, 156, 157, 158, 167, 168, 169, 170, 171, 183, 184, 185, 186, 187, 188, 213, 214, 269, 270, 272, 276, 287, 288, 289, 290, 293, 298, 303, 304, 305, 307, 308, 313, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 329, 330, 331, 339, 341, 342, 371, 372, 373, 374, 375, 399, 426, 485, 486, 487, 488, 559, 560, 561, 562, 564, 565, 566, 567, 575, 576, 578, 579, 580, 581, 582, 585, 586, 589, 590, 591, 592, 596, 597, 598, 599 |
| 4.1.3 Status messages (AA) | 415, 583, 600 |
