# Accessibility Compliance Report

**Generated:** 2026-01-12
**Project:** The Silent Oasis (site)

## Summary
- Total files scanned: 17
- Files with issues: 8
- Total issues found: 51

## Issues Found

---

**WCAG Criterion:** 2.4.7 Focus Visible
**File:** src/index.css
**Line:** 1
**Issue:** Global CSS removes focus outlines (`* { outline: none !important; }`), making keyboard focus invisible.
**Recommendation:** Do not remove outlines globally. Provide a visible focus style for all interactive elements (e.g., buttons, links, form controls).

---

**WCAG Criterion:** 1.4.1 Use of Color; 1.4.11 Non-text Contrast
**File:** src/index.css
**Line:** ~30-40
**Issue:** Links are styled the same as body text (`a { color: inherit; text-decoration: none; }`), making them indistinguishable from surrounding text.
**Recommendation:** Ensure links are visually distinct from surrounding text via non-color cues (e.g., underline) and adequate contrast.

---

**WCAG Criterion:** 1.4.3 Contrast Minimum
**File:** src/index.css
**Line:** ~18, ~70
**Issue:** Low-contrast text color `#cccccc` is used via `.low-contrast-text` on white background, failing the 4.5:1 contrast ratio for normal text.
**Recommendation:** Use a color with at least 4.5:1 contrast against white (e.g., ~#767676 or darker), or avoid using low-contrast styles for essential content.

---

**WCAG Criterion:** 1.4.1 Use of Color
**File:** src/index.css (used by RoomAvailability)
**Line:** ~80-100
**Issue:** Status indicators rely only on colored dots (`.status-available`, `.status-booked`) without text or ARIA labels.
**Recommendation:** Provide a text label (e.g., “Available” / “Booked”) and/or ARIA labels for status.

---

**WCAG Criterion:** 1.3.1 Info and Relationships
**File:** src/App.jsx
**Line:** ~11-20
**Issue:** Broken heading hierarchy: page starts with an h3 before an h1.
**Recommendation:** Use a logical heading order. The first main heading on the page should be an h1, followed by descending levels.

---

**WCAG Criterion:** 1.3.1 Info and Relationships; 2.4.1 Bypass Blocks
**File:** src/App.jsx
**Line:** general
**Issue:** Missing landmark roles/regions (e.g., `<main>`). No skip link to main content.
**Recommendation:** Wrap main content in `<main>` and add a “Skip to main content” link near the top.

---

**WCAG Criterion:** 2.1.1 Keyboard; 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value
**File:** src/components/Header.jsx
**Line:** ~6-30
**Issue:** Navigation built with `<div>`/`<span>` and `onClick` only; items are not focusable or operable via keyboard.
**Recommendation:** Use semantic `<nav>`, `<ul>`, `<li>`, and `<a>` elements or `<button>` as appropriate. Ensure keyboard operability and visible focus.

---

**WCAG Criterion:** 2.1.1 Keyboard; 4.1.2 Name, Role, Value
**File:** src/components/Header.jsx
**Line:** ~20-26
**Issue:** “Book Now” is a `<div>` acting as a button with mouse click only; no role, tabIndex, or keyboard handling.
**Recommendation:** Use a `<button>` element or add role=“button”, tabIndex=“0”, and keyboard handlers.

---

**WCAG Criterion:** 1.1.1 Non-text Content
**File:** src/components/Hero.jsx
**Line:** ~10-17
**Issue:** Large hero image has `alt=""`. Given it sets context/ambience for the hero, a meaningful alt or marking as purely decorative with appropriate role should be provided.
**Recommendation:** If decorative, keep `alt=""` and add `aria-hidden="true"` or role="presentation". If informative, provide descriptive alt text.

---

**WCAG Criterion:** 1.3.1 Info and Relationships; 2.1.1 Keyboard; 4.1.2 Name, Role, Value
**File:** src/components/Hero.jsx
**Line:** ~28-35
**Issue:** CTA elements are `<div>` styled as buttons without semantics or keyboard support.
**Recommendation:** Use `<button>` elements or `<a>` links with proper hrefs. Ensure keyboard access and focus styles.

---

**WCAG Criterion:** 2.4.4 Link Purpose (In Context)
**File:** src/components/Hero.jsx
**Line:** ~31-34
**Issue:** Generic link/button text: “Click Here” and “Read More”.
**Recommendation:** Use descriptive text that conveys destination or action (e.g., “Explore Rooms” / “Learn More About The Oasis”).

---

**WCAG Criterion:** 1.1.1 Non-text Content
**File:** src/components/RoomAvailability.jsx
**Line:** ~32-58
**Issue:** Room images have empty `alt` attributes despite being informational.
**Recommendation:** Provide descriptive `alt` text for each room image (e.g., “Ocean View Suite bedroom with bay-facing windows”).

---

**WCAG Criterion:** 1.4.1 Use of Color
**File:** src/components/RoomAvailability.jsx
**Line:** ~44-48
**Issue:** Availability status indicated only by colored dots; no text label.
**Recommendation:** Add text labels (e.g., “Available” / “Booked”) and/or ARIA labels on the status element.

---

**WCAG Criterion:** 2.4.4 Link Purpose (In Context); 1.3.1 Info and Relationships
**File:** src/components/RoomAvailability.jsx
**Line:** ~55-60
**Issue:** “Read More” presented as a `<span>` with generic text and no link semantics.
**Recommendation:** Use an `<a>` with descriptive text (e.g., “View room details”) or a `<button>` for actions.

---

**WCAG Criterion:** 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value
**File:** src/components/PriceList.jsx
**Line:** ~16-38
**Issue:** Table lacks `<thead>`, `<th>`, and header `scope`. Headers are in a `<tr>` using `<td>`.
**Recommendation:** Use semantic table structure: `<thead>`, `<tbody>`, `<th scope="col">` for column headers and `<th scope="row">` for row headers as needed.

---

**WCAG Criterion:** 2.4.4 Link Purpose (In Context)
**File:** src/components/PriceList.jsx
**Line:** ~40-48
**Issue:** Generic link text “Click here” in the pricing note.
**Recommendation:** Replace with descriptive text (e.g., “View full terms and conditions”).

---

**WCAG Criterion:** 1.4.3 Contrast Minimum
**File:** src/components/PriceList.jsx
**Line:** ~39
**Issue:** Price note uses `.low-contrast-text` class causing insufficient contrast.
**Recommendation:** Use a higher-contrast color for body copy and links.

---

**WCAG Criterion:** 3.3.2 Labels or Instructions; 1.3.1 Info and Relationships
**File:** src/components/ContactForm.jsx
**Line:** ~35-48
**Issue:** Inputs and textarea have no `<label>` elements; rely on placeholder only.
**Recommendation:** Associate `<label for>` with each input and maintain clear instructions.

---

**WCAG Criterion:** 2.1.1 Keyboard; 4.1.2 Name, Role, Value; 2.5.3 Label in Name
**File:** src/components/ContactForm.jsx
**Line:** ~52-56
**Issue:** Submit action is a `<div>` without role, tabIndex, or keyboard handlers; not operable by keyboard.
**Recommendation:** Use a `<button type="submit">` with clear text, or add appropriate semantics and handlers.

---

**WCAG Criterion:** 1.3.5 Identify Input Purpose
**File:** src/components/ContactForm.jsx
**Line:** ~35-48
**Issue:** Missing `autocomplete` attributes (e.g., `given-name`, `family-name`, `email`, `tel`).
**Recommendation:** Add appropriate `autocomplete` values to help browsers and assistive tech.

---

**WCAG Criterion:** 1.4.3 Contrast Minimum; 1.4.1 Use of Color
**File:** src/components/Footer.jsx
**Line:** ~9-60
**Issue:** Multiple blocks apply `.low-contrast-text` leading to insufficient contrast; links styled similarly to text are not distinguishable.
**Recommendation:** Use readable colors and underline links by default or ensure strong visual differentiation.

---

**WCAG Criterion:** 1.1.1 Non-text Content; 2.1.1 Keyboard; 4.1.2 Name, Role, Value
**File:** src/components/Footer.jsx
**Line:** ~20-28
**Issue:** Social icons are `<img alt="">` used as buttons with `onClick`; they lack accessible names, roles, and keyboard access.
**Recommendation:** Use `<a>` links or `<button>` elements with `aria-label` and ensure keyboard operability.

---

## Priority Recommendations
1. Restore visible focus (remove global outline suppression) and add consistent focus styles across interactive elements. (WCAG 2.4.7)
2. Fix navigation and interactive controls to be semantic and keyboard accessible (Header, Hero CTAs, Contact submit, Footer social). (WCAG 2.1.1, 4.1.2)
3. Provide descriptive alt text for all informative images and accessible names for icon buttons. (WCAG 1.1.1)
4. Correct table semantics in PriceList with proper headers and scopes. (WCAG 1.3.1)
5. Replace generic link text (“Click here”, “Read more”) with descriptive labels. (WCAG 2.4.4)
6. Address color-contrast issues and make links visually distinct from surrounding text. (WCAG 1.4.3, 1.4.1)
7. Add labels and autocomplete attributes to form fields; use a real submit button. (WCAG 3.3.2, 1.3.5)
8. Add landmarks (main) and a skip-to-content link for bypassing repetitive headers. (WCAG 2.4.1)
