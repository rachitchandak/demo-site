# Checks missing from EAP, grouped by component

This is a port-ready list of every check `testing-agent` runs that EAP has no code path for, organized under EAP's own `checks/<component>` folders. Each entry names the testing-agent condition, cites the **exact file and line range** in `testing-agent/src/rules/criteria/` that implements it (verified by reading the source directly, not inferred), proposes the `error_message` EAP would show (matching the terse style already in `eache_checks.error_message`), and gives the row data needed to insert it into `eachk_checkpoints` + `eache_checks`.

**Before using the IDs below:** they're sequential placeholders starting after the current max (`checkpoint_id` > 201, `check_id` > 484, confirmed against the live DB on 2026-08-17). Re-check both maxes at insert time.

**Severity convention** (confirmed from `URLValidationInitiator.java`): severity 0–1 = **error**, severity 2 = **warning**, severity 3 = **silently excluded from both counts**. All rows below use 0–2 only, mapped from testing-agent's own outcome: a `fail` result → severity 0/1, a `needs-review` result → severity 2.

**Corrections from the first pass of this document:** four rows turned out to be wrong once checked against the real source, and one was fabricated outright — a `NOT FOUND` search across every file in `testing-agent/src/rules/criteria/` turned up nothing supporting it. All are corrected or removed below, and called out inline with **⚠ corrected** / **⚠ removed**.

All line numbers are relative to the file as it exists in `testing-agent/src/rules/criteria/` at the time of this audit (2026-08-17) — re-verify if the source has moved since.

---

## markup — 13 checks (was 14 — one removed as fabricated)

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 202 | all | `markup.AriaRoleValidityCheck` | ARIA roles and properties | 23 ARIA | 485 | 1 | Role attribute value is not a recognized ARIA role | high | `sc-4-1-2.ts:135-139` (allowlist `:30-43`, token check `:60-64`) |
| 203 | all | `markup.AriaIdrefCheck` | ARIA roles and properties | 23 ARIA | 486 | 1 | ARIA reference attribute (`aria-describedby`, `aria-controls`, or `aria-owns`) points to an id that does not exist | high | `sc-4-1-2.ts:67-74` (detection), `:140-144` (fail) — **⚠ corrected**: originally listed as three separate checks (486/487/488, one per attribute). The real code validates `aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns`, and `aria-activedescendant` together in one shared loop producing one combined message — it is a single check, not three. **Drop check_id 487 and 488 entirely; insert 486 only.** |
| ~~204~~ | — | — | — | — | ~~487~~ | — | — | — | **⚠ removed** — merged into 203/486 above |
| ~~205~~ | — | — | — | — | ~~488~~ | — | — | — | **⚠ removed** — merged into 203/486 above |
| 206 | all | `markup.FocusableRoleCheck` | Name, Role, Value | 23 ARIA | 489 | 2 | Element is focusable (`tabindex >= 0`) but has no ARIA role — verify it exposes the correct semantics | medium | `sc-4-1-2.ts:152-159` (condition computed `:92-95`) |
| 207 | label | `markup.DuplicateLabelForCheck` | Labels or Instructions | 25 Fieldset | 490 | 1 | More than one `<label>` has `for` pointing at the same field id | medium | `sc-4-1-2.ts:145-149` (condition computed `:122-126`) |
| 208 | a | `markup.SkipLinkTargetCheck` | Bypass Blocks | 12 Bypass blocks of content | 491 | 0 | Skip-link target anchor does not exist on the page | high | `sc-2-4-1.ts:68-69` |
| 209 | a | `markup.SkipLinkTargetCheck` (same class) | Bypass Blocks | 12 Bypass blocks of content | 492 | 1 | Skip-link target is not focusable | medium | `sc-2-4-1.ts:71-73` |
| 210 | a | `markup.SkipLinkPositionCheck` | Bypass Blocks | 12 Bypass blocks of content | 493 | 2 | Skip link is not among the first 5 focusable elements on the page | medium | `sc-2-4-1.ts:74-76` |
| 211 | all | `markup.BypassMechanismCheck` | Bypass Blocks | 12 Bypass blocks of content | 494 | 1 | No skip link, `<main>` landmark, or sufficient heading/landmark structure found to bypass repeated content | high | `sc-2-4-1.ts:91-99` (final fail in a decision chain starting `:79`) |
| 212 | h1,h2,h3,h4,h5,h6 | `markup.HeadingTextQualityCheck` | Headings and Labels | 4 Headings | 495 | 2 | Heading text is generic and does not describe the section (e.g. "Section", "Untitled") | low | `sc-2-4-6.ts:50-52` — **note**: this is the *same* regex block as row 274 under `headings` below (it also fires for form labels, not headings exclusively). Port once; see the cross-reference there. |
| 213 | a,button,[role] | `markup.PointerCancellationLiveCheck` | Pointer Cancellation | 32 Input Modalitites | 496 | 2 | Down-event handler observed to trigger an action via script; verify the action is cancelable on pointer-move-away | medium | `sc-2-5-2.ts:45-83`, fires at `:77-79` (live MutationObserver-based simulation — distinct from the static `hasDown && !hasUp` attribute check at `:32-39`, which EAP's `PointerCancellationCheck.js` already covers) |
| 214 | all | `markup.DraggingAlternativeCheck` | Dragging Movements | 32 Input Modalitites | 497 | 1 | Drag interaction detected (`draggable`, drag-cursor, or drag-role hint) with no single-pointer alternative control | high | `sc-2-5-7.ts:44-55` (detection `:24-37`) |
| ~~215~~ | — | — | — | — | ~~498~~ | — | — | — | **⚠ removed — fabricated.** No check for "duplicate id referenced by an ARIA relationship attribute" exists anywhere in `testing-agent/src/rules/criteria/` — grepped across every file, confirmed absent. Do not insert. |

---

## forms — 9 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 216 | input,select,textarea | `forms.RequiredFieldExplainerCheck` | Labels or Instructions | 25 Fieldset | 499 | 2 | Required-field marker present with no text explaining what the marker means | low | `sc-3-3-2.ts:73-75` (flagged at `:98-99`) |
| 217 | input,select,textarea,[role] | `forms.AccessibleNameComputeCheck` | Label in Name | 1 Forms | 500 | 2 | Visible label exists but no accessible name could be computed for the control — verify manually (may also indicate a 4.1.2 failure) | medium | `sc-2-5-3.ts:75-77` — **⚠ corrected**: originally scoped to "custom ARIA-role widgets only." The actual code applies to *any* interactive control, native or ARIA, whenever a visible label exists with no computed accessible name — not restricted to non-native widgets. `html_tag` widened accordingly. |
| 218 | input,select,textarea | `forms.PlaceholderOnlyLabelCheck` | Labels or Instructions | 25 Fieldset | 501 | 1 | Field is labeled only by its `placeholder` attribute, which disappears once text is entered | high | `sc-3-3-2.ts:92-94` |
| 219 | input,select,textarea | `forms.ErrorSuggestionCheck` | Error Suggestion | 24 Error Indentification/Suggesstions | 502 | 1 | Field flagged invalid but no suggestion text was found to help correct it | high | `sc-3-3-3.ts:103-106` |
| 220 | form | `forms.ErrorSuggestionCheck` (same class) | Error Suggestion | 24 Error Indentification/Suggesstions | 503 | 2 | No invalid-field error was observed on submit — verify error handling manually | medium | `sc-3-3-3.ts:96-98` |
| 221 | form,button | `forms.CriticalActionReversalCheck` | Error Prevention | 24 Error Indentification/Suggesstions | 504 | 1 | Submission commits a legal/financial/data-deleting action with no confirm, review, or undo step | high | `sc-3-3-4.ts:75-77` |
| 222 | form,button | `forms.CriticalActionReversalCheck` (same class) | Error Prevention | 24 Error Indentification/Suggesstions | 505 | 2 | Cancel/undo control found near a critical action — verify it actually reverses the action | low | `sc-3-3-4.ts:69-71` |
| 223 | form | `forms.CriticalActionReversalCheck` (same class) | Error Prevention | 24 Error Indentification/Suggesstions | 506 | 2 | No on-page confirm mechanism found; action may be finalized on a later step — verify | low | `sc-3-3-4.ts:72-78` |
| 224 | input,select,textarea | `forms.RedundantEntryLiveCheck` | Redundant Entry | 42 Redundant Entry | 507 | 1 | Same information is requested more than once in the same form/flow with no auto-fill or reuse offered | medium | `sc-3-3-7.ts:83-90` — **⚠ corrected**: the previous draft claimed this file is misleadingly named "Accessible Authentication" but implements Redundant Entry. That claim was itself wrong — the file's own docblock (lines 4-7) correctly reads *"3.3.7 Redundant Entry (A)"*. It's correctly named; no naming issue exists. |

---

## pageinfo — 9 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 225 | body | `pageinfo.ResizeOverflowCheck` | Resize Text | 27 Resizing | 508 | 1 | Content overflows or is clipped when the page is zoomed to 200% | high | `sc-1-4-4.ts:103-120` (live 200%-zoom overflow probe — the halved-viewport simulation). A related but distinct check in the same file at `:123-131` (`needs-review`, severity 2) covers fixed-height text containers that would clip enlarged text without ever causing page-level overflow — port as a second `eache_checks` row under this checkpoint if you want both. |
| 226 | body | `pageinfo.ReflowOverflowCheck` | Reflow | 28 Reflow | 509 | 1 | Content requires horizontal scrolling at a 320px viewport width | high | `sc-1-4-10.ts:65-81` (detection `:22-61`) |
| 227 | body | `pageinfo.ScriptedRedirectCheck` | Timing Adjustable | 17 Time Limits | 510 | 1 | Page navigates, reloads, or auto-submits via a script-based timer with no user control | high | `sc-2-2-1.ts:76-78` |
| 228 | title | `pageinfo.TitleTemplateTokenCheck` | Page Titled | 14 Page Information | 511 | 0 | Page title contains an unrendered template placeholder (e.g. `{{title}}`, `undefined`) | high | `sc-2-4-2.ts:35-37` |
| 229 | html | `pageinfo.LangConsistencyCheck` | Language of Page | 14 Page Information | 512 | 1 | `xml:lang` is set but `lang` is missing | medium | `sc-3-1-1.ts:42-44` |
| 230 | html | `pageinfo.LangConsistencyCheck` (same class) | Language of Page | 14 Page Information | 513 | 1 | `lang` and `xml:lang` values do not match | medium | `sc-3-1-1.ts:48-50` |
| 231 | html | `pageinfo.LangDirectionCheck` | Language of Page | 14 Page Information | 514 | 2 | Page language is right-to-left but `dir="rtl"` is not set | low | `sc-3-1-1.ts:60-62` |
| 232 | all | `pageinfo.LangPartDirectionCheck` | Language of Parts | 14 Page Information | 515 | 2 | Text passage's declared language is right-to-left but the enclosing element has no `dir="rtl"`, or vice-versa | low | `sc-3-1-2.ts:118-125` (covers both directions of the mismatch) |
| 233 | all | `pageinfo.LangPartValidityCheck` | Language of Parts | 14 Page Information | 516 | 2 | `lang` attribute on a text passage is not a valid BCP 47 language tag | low | `sc-3-1-2.ts:113-116` — **⚠ corrected**: originally described as also catching a `lang` value that's "mismatched with its actual content" (e.g. `lang="fr"` on English text). No such comparison exists anywhere in this file — only tag-*format* validity is checked, not content-language mismatch. Description, error_message, and severity (1→2, since this is a `needs-review`-style format check, not a hard fail) narrowed accordingly. |

---

## keyboard — 8 checks (was 9 — one removed as unsupported by the code)

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 234 | all | `keyboard.PointerEventsBlockCheck` | Keyboard | 3 Keyboard | 517 | 1 | Interactive element has `pointer-events: none`, which also blocks assistive-technology interaction | medium | `sc-2-1-1.ts:54-56` |
| 235 | a | `keyboard.RoleButtonKeySupportCheck` | Keyboard | 3 Keyboard | 518 | 1 | `<a role="button">` does not respond to the Space key, only Enter | medium | `sc-2-1-1.ts:60-67` |
| 236 | all | `keyboard.AccesskeyConflictCheck` | Keyboard | 3 Keyboard | 519 | 2 | `accesskey` attribute present — verify it does not conflict with browser/AT shortcuts | low | `sc-2-1-1.ts:70-77` |
| 237 | all | `keyboard.AccesskeyShortcutReviewCheck` | Character Key Shortcuts | 3 Keyboard | 520 | 2 | Page defines an `accesskey`-based single-character shortcut — these require a browser modifier key so are usually out of scope for 2.1.4, but verify no unmodified conflict exists | low | `sc-2-1-4.ts:106-113` — **⚠ corrected**: the original error_message ("no visible way to turn it off or remap it") described a check that doesn't exist. Reading the file: `accesskey`-based shortcuts are explicitly *excluded* from the "no disable/remap" fail block (lines 92-99 — that block only fires for non-accesskey shortcuts), and the actual `accesskey`-specific branch returns `needs-review` with the opposite rationale shown above. Message corrected to match what the code really does. |
| 238 | all | `keyboard.VisualOrderCheck` | Focus Order | 3 Keyboard | 521 | 1 | CSS `order`, `float`, or reversed flex-direction visually reorders content away from DOM/tab order | high | `sc-2-4-3.ts:48-65` (detection), `:89-96` (report) |
| 239 | all | `keyboard.VisualOrderCheck` (same class) | Focus Order | 3 Keyboard | 522 | 1 | Tab order jumps backward on screen relative to the previous focused element | high | `sc-2-4-3.ts:67-75` (detection), `:97-104` (report) |
| 240 | [role=tab],[role=menuitem],[role=option],[role=treeitem] | `keyboard.RovingTabindexCheck` | Focus Order | 3 Keyboard | 523 | 2 | Composite-widget item has no `tabindex` attribute — roving tabindex pattern may be missing | medium | `sc-2-4-3.ts:30-35` (detection), `:105-112` (report) |
| 241 | all | `keyboard.FocusViewportCheck` | Focus Not Obscured | 3 Keyboard | 524 | 2 | Focused element is scrolled outside the viewport | medium | `sc-2-4-11.ts:80-82` — severity corrected from 1→2 (source returns `needs-review`, not `fail`) |
| 242 | select,input,textarea | `keyboard.OnInputModalCheck` | On Input | 3 Keyboard | 525 | 1 | Changing this control's value opens a modal dialog with no prior warning | high | `sc-3-2-2.ts:97-99` |

---

## visual — 8 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 243 | all | `visual.ColorContrastCheckAA` **(extend existing — checkpoint 21)** | Contrast (Minimum) | 18 Visual Content | 526 | 2 | Text sits on a gradient background — contrast could not be calculated automatically, verify manually | medium | `sc-1-4-3.ts:57-64` |
| 244 | all | `visual.FocusIndicatorContrastCheck` | Non-text Contrast | 18 Visual Content | 527 | 1 | Focus indicator (outline/box-shadow) has less than 3:1 contrast against the adjacent background | high | `sc-1-4-11.ts:111-113` |
| 245 | all | `visual.FocusIndicatorContrastCheck` (same class) | Non-text Contrast | 18 Visual Content | 528 | 2 | No border or measurable focus style found — verify fill/icon contrast manually | low | `sc-1-4-11.ts:117-123` |
| 246 | [title] | `visual.NativeTooltipContentCheck` | Content on Hover or Focus | 30 Content on Hover | 529 | 1 | `title` attribute carries content beyond the element's own label — native tooltips aren't dismissible or persistent | medium | `sc-1-4-13.ts:19-44` (detection `:19-27`, fail `:37-44`) |
| 247 | all | `visual.HoverRevealDismissCheck` | Content on Hover or Focus | 30 Content on Hover | 530 | 1 | Content revealed on hover/focus does not dismiss on Escape | high | `sc-1-4-13.ts:93-100` |
| 248 | all | `visual.HoverRevealDismissCheck` (same class) | Content on Hover or Focus | 30 Content on Hover | 531 | 2 | Content revealed on hover/focus — verify it stays visible on hover and can be hovered over itself | low | `sc-1-4-13.ts:101-106` |
| 249 | all | `visual.AnimatedContentPauseCheck` | Pause, Stop, Hide | 31 Seizures and Physical Reactions | 532 | 1 | CSS animation or `setInterval`-driven content moves/updates with no pause control found | high | `sc-2-2-2.ts:95-97` |
| 250 | all | `visual.AnimatedContentPauseCheck` (same class) | Pause, Stop, Hide | 31 Seizures and Physical Reactions | 533 | 2 | Pause control found — verify it actually stops all moving/updating content on the page | low | `sc-2-2-2.ts:98` |

---

## links — 7 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 251 | a | `links.DuplicateLinkTextCheck` | Link Purpose (In Context) | 8 Links | 534 | 2 | Same link text used elsewhere on the page pointing at a different destination | medium | `sc-2-4-4.ts:32-49` |
| 252 | a | `links.LinkContextCheck` | Link Purpose (In Context) | 8 Links | 535 | 2 | Link text is generic ("click here", "more") — nearby context text was found; verify it actually disambiguates the destination | low | `sc-2-4-4.ts:92-95` — **⚠ corrected**: originally described as firing when context "could not be checked automatically." The code always attempts the context lookup (via `aria-describedby` or surrounding block text); this branch actually fires when context *was found nearby*, returning `needs-review` to confirm the found context is adequate — not a failure-to-check case. Message corrected to match. |
| 253 | a | `links.BareUrlLinkTextCheck` | Link Purpose (In Context) | 8 Links | 536 | 2 | Link text is a raw URL, filename, or email address instead of a description | low | `sc-2-4-4.ts:101-103` — severity corrected from 1→2 (source returns `needs-review`) |
| 254 | a[target=_blank] | `links.NewWindowWarningCheck` | Link Purpose (In Context) | 8 Links | 537 | 2 | Link opens in a new window/tab with no text warning the user beforehand | low | `sc-2-4-4.ts:62-69` (detection), `:104-106` (report) — severity corrected from 1→2 (source returns `needs-review`) |
| 255 | a,img,svg | `links.OnFocusContextChangeLiveCheck` **(extend existing — checkpoint 132)** | On Focus | 1 Forms | 538 | 1 | Focusing this element opens a new browser tab or window | high | `sc-3-2-1.ts:85-87` |
| 256 | a,img,svg | `links.OnFocusContextChangeLiveCheck` (same class) | On Focus | 1 Forms | 539 | 1 | Focusing this element opens a dialog with no prior warning | high | `sc-3-2-1.ts:95-97` |
| 257 | a,img,svg | `links.OnFocusContextChangeLiveCheck` (same class) | On Focus | 1 Forms | 540 | 2 | Focusing this element triggers a large amount of DOM change — verify it doesn't move focus or context unexpectedly | low | `sc-3-2-1.ts:118-120` |

---

## multimedia — 5 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 258 | video,iframe | `multimedia.EmbeddedMediaReviewCheck` | Captions (Prerecorded) | 19 Media | 541 | 2 | Third-party video embed detected (YouTube/Vimeo/etc.) — verify captions are enabled on the source | medium | `sc-1-2-2.ts:65-67` |
| 259 | video | `multimedia.CaptionVsSubtitleCheck` | Captions (Prerecorded) | 19 Media | 542 | 2 | Only a subtitles track was found, not a true captions track — non-speech audio cues may be missing | low | `sc-1-2-2.ts:68-70` |
| 260 | video,iframe | `multimedia.EmbeddedMediaReviewCheck` (same class) | Audio Description | 19 Media | 543 | 2 | Third-party video embed detected — verify an audio-description track is available | medium | `sc-1-2-3.ts:90-92` **and** `sc-1-2-5.ts:76-78` — same check duplicated in both files (1.2.3 and 1.2.5 each independently implement it); port once, apply to both checkpoints, or dedupe in EAP |
| 261 | audio,video | `multimedia.DecorativeMediaExclusionCheck` **(extend existing — checkpoint 108/109)** | Captions / Audio Description | 19 Media | 544 | 2 | Media element is muted/looped with no controls — likely decorative, verify caption/description requirement doesn't apply | low | `sc-1-2-1.ts:78-80`, `sc-1-2-2.ts:26-28`, `sc-1-2-3.ts:56-58`, `sc-1-2-5.ts:42-44` — the identical `isSilentDecorative` predicate appears independently in all 4 files; severity **corrected from 3→2** (the original draft used severity 3, which — per this document's own stated convention — is silently excluded from the pass/fail summary; that was a self-contradiction, now fixed) |
| 262 | audio,video,script | `multimedia.ProgrammaticAutoplayCheck` | Audio Control | 19 Media | 545 | 2 | Audio may be played programmatically (`Audio()`, Web Audio API, or embedded iframe autoplay parameter) with no visible stop control — verify | low | `sc-1-4-2.ts:39-49` (detection), `:63-70` (report) — severity corrected from 1→2 (source returns `needs-review`) |

---

## images — 3 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 263 | img,svg,[role=img] | `images.AlternateTextCheck` **(extend existing — checkpoint 2)** | Text-alternative for non-text content | 2 Images | 546 | 1 | Image has `role="presentation"` but a non-empty `alt` — the alt text is being suppressed | medium | `sc-1-1-1.ts:152-159` |
| 264 | img,svg,[role=img] | `images.AlternateTextCheck` (same class, checkpoint 2) | Text-alternative for non-text content | 2 Images | 547 | 2 | Accessible name is made entirely of icon-font glyph characters, not real text | low | `sc-1-1-1.ts:218-220` (helper `allPua()` at `:25-39`) |
| 265 | img,canvas,svg,[style*=background-image] | `images.ImageTextDetectionCheck` **(reuses checkpoint 137, currently disabled/no code)** | Images of Text | 2 Images | 548 | 2 | Image, canvas, inline SVG, or background-image element appears to render text (sentence-like alt, text-role filename, or labelled canvas/SVG text) — verify real text is used instead | low | `sc-1-4-5.ts:20-107` — one composite check covering `<img>` (`:28-49`), `<canvas>` (`:52-59`), inline `<svg><text>` (`:63-74`), and CSS background-image containers (`:77-93`), all feeding a single `needs-review` result at `:102-107` |

---

## list — 3 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 266 | dt,dd | `list.ListContainerCheck` | Info and Relationships | 6 Lists | 549 | 1 | `<dt>`/`<dd>` used outside of a `<dl>` | medium | `sc-1-3-1.ts:200-202` |
| 267 | li | `list.ListContainerCheck` (same class) | Info and Relationships | 6 Lists | 550 | 1 | `<li>` used outside of a `<ul>`, `<ol>`, or `<menu>` | medium | `sc-1-3-1.ts:203-205` — note: the source regex only tests `ul\|ol` for the parent tag, `menu` is named in the message but not actually excluded by the check |
| 268 | ul,ol | `list.NestedListCheck` | Info and Relationships | 6 Lists | 551 | 2 | List is nested directly inside another list with no `<li>` wrapping it | low | `sc-1-3-1.ts:206-208` |

---

## tables — 3 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 269 | table | `tables.NestedTableCheck` | Info and Relationships | 10 Tables | 552 | 1 | Table is nested inside another table | medium | `sc-1-3-1.ts:42-44` |
| 270 | table | `tables.TableStructureCheck` | Info and Relationships | 10 Tables | 553 | 1 | Table contains only `<th>` cells and no `<td>` data cells | medium | `sc-1-3-1.ts:47-49` |
| 271 | th | `tables.EmptyHeaderCheck` | Info and Relationships | 10 Tables | 554 | 2 | Table header cell (`<th>`) has no text, aria-label, or image alt text | low | `sc-1-3-1.ts:55-58` |

---

## external — 2 checks

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 272 | img,object,embed,svg,area | `images.AlternateTextCheck` **(same shared check as row 263 — not object-specific)** | Text-alternative for non-text content | 22 Plugins | 555 | 1 | Accessible name matches a filename pattern, not a real description | medium | `sc-1-1-1.ts:209-211` — **⚠ corrected**: originally described as an `<object>`/`<embed>`/`<applet>`-specific check. No such dedicated branch exists — `<object>` and `<embed>` are just members of the same generic `isImage` tag list that `<img>` belongs to (line `:82-83`), so this is the *identical* `FILENAME_LIKE` check already listed as row 272/263's sibling, reached via a shared code path, not separate logic. **`<applet>` is not handled anywhere in testing-agent at all** — no matches found for the string "applet" in the file. Port once (with row 263), apply to EAP's `ObjectCheck.js`/`EmbedCheck.js` by calling the same underlying pattern rather than writing new logic. |
| 273 | img,object,embed,svg,area | `images.AlternateTextCheck` (same shared check as row 264) | Text-alternative for non-text content | 22 Plugins | 556 | 2 | Accessible name is an auto-generated filename (e.g. `IMG-1234`) | low | `sc-1-1-1.ts:212-214` — same correction as row 272: this is the shared `AUTO_NAME` check, not object-specific, and `<applet>` still has no coverage. |

---

## headings — 1 check

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 274 | h1,h2,h3,h4,h5,h6 | `headings.ValidityCheck` **(extend existing — checkpoint 7)** | Headings and Labels | 4 Headings | 557 | 2 | Heading text is generic or non-descriptive (digits/punctuation only, or a stock phrase) | low | `sc-2-4-6.ts:50-52` — same source block as row 212 under `markup` above (the check is shared between headings and form labels in testing-agent's code). Implement once; whichever EAP file gets it first, cross-reference the other. |

---

## consistency — 1 check

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 275 | button,[role=button] | `consistency.IconButtonConsistencyCheck` | Consistent Identification | 16 Consistancy of repeated content | 558 | 2 | Icon-only button using the same icon as elsewhere on the site has a different accessible name | medium | `sc-3-2-4.ts:53-66` |

---

## others — 1 check

| checkpoint_id | html_tag | check_class | rationale | group | check_id | sev | error_message | impact | **source** |
|---|---|---|---|---|---|---|---|---|---|
| 276 | input,select,textarea | `others.RedundantEntryCheck` **(duplicate of forms row 224 above — insert once, pick one folder)** | Redundant Entry | 42 Redundant Entry | 559 | 1 | Same information is requested more than once with no auto-fill or reuse offered | medium | `sc-3-3-7.ts:83-90` — same file naming correction as row 224 (file is correctly named "Redundant Entry," no mismatch) |

---

## Not included

- **`dynamicelements`** — the direction reverses here (EAP's six widget-specific Selenium tests are more capable than testing-agent's generic rules), so there's nothing to port from testing-agent into this folder.
- **`frames`, `css`, `paragraph`, `blockquote`** — no testing-agent-only checks found for these folders; nothing to add.

## Summary of corrections made in this revision

| # | Issue | Fix |
|---|---|---|
| 1 | Row 215 (`UniqueIdSemanticCheck`) | **Removed** — confirmed fabricated, no such check exists anywhere in testing-agent |
| 2 | Rows 204/205 (aria-controls / aria-owns as separate checks) | **Merged into row 203** — all 5 ARIA reference attributes are validated by one shared loop/message, not per-attribute checks |
| 3 | Rows 272/273 (object/embed/applet-specific filename checks) | **Corrected** — same shared `FILENAME_LIKE`/`AUTO_NAME` logic as images (rows 263/264), not a separate object-specific branch; `<applet>` has zero coverage in testing-agent |
| 4 | Row 237 (accesskey disable/remap) | **Corrected** — the real code excludes accesskeys from that fail condition entirely; message rewritten to match actual behavior |
| 5 | Row 252 (link context "could not be checked") | **Corrected** — the code fires when context *was* found, not when checking failed |
| 6 | Row 217 (accessible-name compute, "ARIA-only widgets") | **Corrected** — applies to any interactive control, not just non-native ARIA widgets |
| 7 | Row 233 (lang "mismatched with content") | **Corrected** — only format validity is checked; no content-language comparison exists |
| 8 | Rows 224/276 ("misnamed" file claim) | **Corrected** — `sc-3-3-7.ts` is correctly named/scoped as Redundant Entry; the earlier claim of a naming mismatch was wrong |
| 9 | Row 261 severity | **Corrected 3→2** — was self-contradicting this document's own stated severity convention |
| 10 | Rows 241, 253, 254, 262 severity | **Corrected 1→2** — source returns `needs-review`, not `fail` |

## Reference: current schema

```
eachk_checkpoints (checkpoint_id PK, html_tag, info_message, long_description, rationale, check_class, checkpoint_group_id FK, enabled)
eache_checks      (check_id PK, checkpoint_id FK, severity_level, error_message, repair_technique, valid_example, invalid_example, level_of_impact)
```

`info_message` and `long_description` are left blank in the rows above — fill those in with the same short "what this checkpoint covers" phrasing EAP already uses per `check_class` (e.g. `AlternateTextCheck` → *"Alternate text for images"*) once you know which existing checkpoints these get merged into.
