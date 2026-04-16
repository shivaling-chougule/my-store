# FAQ Page — Section Brief

## What & Why

**Feature name:** `faq-page`
**Purpose:** Standalone FAQ section for the "Fire the Imagination" Shopify theme. Merchants add FAQ categories with collapsible question/answer rows — gives customers self-service answers, reduces support tickets.

**Figma reference:**
- Desktop + Mobile: `https://www.figma.com/design/4WvAivFNw1LonxlSVCcUNG/FIRE-THE-IMAGINATION?node-id=950-12381&m=dev`
- FileKey: `4WvAivFNw1LonxlSVCcUNG` / NodeId: `950:12381`

---

## Architecture Decisions

### File: `sections/faq-page.liquid` (single self-contained section)

**Why a custom section (not reusing existing `blocks/accordion.liquid`):**
- Existing accordion block is a theme-level OS2 block designed for generic use inside any section. It relies on theme typography presets (`--font-h6--family` etc.) and theme color schemes.
- This FAQ page follows the custom section pattern established by `about-us.liquid` and `contact-us.liquid` — self-contained CSS via `{%- style -%}` tag, scoped CSS custom properties from section settings, Google Fonts loaded inline, no external SCSS/JS bundles.
- The FAQ design has a branded banner header + categorized accordion groups — not achievable with the generic accordion block alone.

**No separate snippet needed:**
- FAQ items are rendered via Shopify section blocks (type `faq_item`). Each is a `<details>` element. The markup is simple enough to live inline — extracting a snippet adds indirection with no reuse benefit.

**No JS entry needed:**
- Native `<details>`/`<summary>` handles expand/collapse. No JS required.
- If "only one open at a time" behavior is desired later, a small inline `<script>` in the section suffices (documented below as optional enhancement).

**No SCSS entry needed:**
- All styles scoped via `{%- style -%}` block, consistent with about-us.liquid and contact-us.liquid patterns.

---

## Data

### Data sources
- All content comes from **section settings** and **blocks** — no product/collection/cart/metafield data.
- Zero API calls. Pure static content managed by merchant in theme editor.

### Section settings (merchant-configurable)

| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| `banner_heading` | text | "Frequently Asked Questions" | Page title |
| `banner_subtitle` | textarea | "Find answers to common questions..." | Subtitle text |
| `enable_banner` | checkbox | true | Toggle banner visibility |
| `banner_bg` | color | #FE534C | Banner background |
| `banner_text_color` | color | #FFFFFF | Banner text color |
| `heading_color` | color | #333333 | FAQ question text color |
| `body_color` | color | #555555 | FAQ answer text color |
| `section_bg` | color | #FFFFFF | Content area background |
| `divider_color` | color | #E0E0E0 | Border between FAQ items |
| `icon_style` | select | "plus" | Toggle icon: "plus" or "caret" |
| `max_content_width` | range (800-1400) | 900 | Max width of FAQ content area |
| `banner_padding_vertical` | range (40-200) | 80 | Banner vertical padding |
| `content_padding_vertical` | range (40-200) | 60 | Content area vertical padding |
| `content_padding_horizontal` | range (16-120) | 24 | Content area horizontal padding |
| `item_spacing` | range (0-40) | 0 | Gap between FAQ items |

### Block: `faq_item`

| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| `question` | text | "What is your return policy?" | The question heading |
| `answer` | richtext | `<p>Answer goes here.</p>` | The answer body (supports rich text) |
| `open_by_default` | checkbox | false | Whether item starts expanded |

**Block limit:** 20 (reasonable upper bound for FAQ pages)

---

## Behaviour

### States
- **Collapsed (default):** `<details>` closed. Only question + icon visible.
- **Expanded:** `<details open>`. Answer content revealed with CSS transition.
- **Hover:** Summary row shows subtle background highlight.

### No JS states needed
All states handled by native `<details>` element. No `data-state` attributes, no JS state machine.

### Optional enhancement: single-open accordion
If desired, add inline `<script>` that listens for `toggle` events on `<details>` elements within the section container and closes siblings. This is NOT in scope for initial build — noted here for future consideration.

### Events
- None emitted, none listened to. Self-contained section.

### Responsive strategy (CSS-only)
- **Desktop (md+):** Banner has larger padding/font. FAQ content area centered with `max-width`.
- **Mobile (<md):** Banner padding/font reduce. FAQ content goes full-width with horizontal padding. No DOM differences — pure CSS responsive.

---

## Implementation Detail

### Liquid structure

```
sections/faq-page.liquid
  |-- {%- style -%} block (all CSS, scoped to #FaqPage-{{ sid }})
  |-- Banner region (conditional on enable_banner)
  |     |-- h1.faq-banner-heading
  |     |-- p.faq-banner-subtitle
  |-- FAQ content region
        |-- for block in section.blocks
              |-- <details> element
                    |-- <summary> (question text + icon)
                    |-- <div class="faq-answer"> (answer richtext)
```

### CSS architecture (inside `{%- style -%}`)
- Scoped to `#FaqPage-{{ sid }}` — zero global leakage
- CSS custom properties from section settings (pattern from about-us.liquid):
  ```
  --faq-font: 'Dosis', sans-serif;
  --faq-banner-bg, --faq-banner-text
  --faq-heading-color, --faq-body-color
  --faq-divider-color, --faq-max-w
  --faq-banner-pad-v, --faq-content-pad-v, --faq-content-pad-h
  --faq-item-spacing
  ```
- Summary row: `display: flex; align-items: center; justify-content: space-between;`
- Icon rotation on open: `details[open] .faq-icon { transform: rotate(45deg); }` (plus icon) or `rotate(180deg)` (caret)
- Smooth content reveal: `details .faq-answer { overflow: hidden; }` with transition
- Responsive: reduce font sizes and padding below 768px via `@media`

### Accessibility
- Native `<details>`/`<summary>` provides built-in keyboard navigation and ARIA semantics
- `<summary>` is focusable and togglable via Enter/Space by default
- Banner heading is `<h1>` (page title). Question headings use `<summary>` (not additional heading tags to avoid heading hierarchy issues)
- Sufficient color contrast required between question text and background (merchant responsibility via color settings, but defaults must pass WCAG AA)
- `list-style: none` on summary removes default disclosure triangle — custom icon replaces it
- Focus-visible outline on summary for keyboard users

### Font loading
Google Fonts `Dosis` loaded inline via `<link>` tags (same pattern as about-us.liquid and contact-us.liquid).

---

## Technical Tradeoffs

### Custom section vs reusing existing accordion blocks
- **Chosen:** Custom self-contained section
- **Alternative:** Compose page from existing `accordion.liquid` block
- **Why:** Existing accordion relies on theme presets and color schemes. FAQ page needs branded banner + specific layout matching about-us/contact-us pattern. Building custom keeps visual consistency with other custom pages.
- **Downside:** FAQ expand/collapse logic duplicated (trivially — it's native `<details>`)

### Blocks vs hardcoded settings for FAQ items
- **Chosen:** Shopify section blocks (`faq_item` type)
- **Alternative:** Numbered settings like about-us rows (`question_1`, `answer_1`, `question_2`, etc.)
- **Why:** Blocks are reorderable in theme editor, can be added/removed dynamically, support up to 50 items. Numbered settings are rigid and bloat the schema.
- **Downside:** None meaningful — blocks are the correct pattern for repeatable content.

### No JS vs JS accordion
- **Chosen:** Native `<details>` with no JS
- **Alternative:** Custom JS accordion with `data-state` management
- **Why:** Zero JS = faster load, no bundle overhead, progressive enhancement by default. Native element has full browser support and built-in a11y.
- **Downside:** Multiple items can be open simultaneously (no "only one open" constraint). Acceptable for FAQ pages — users often want to compare answers.

### Inline styles vs SCSS entry
- **Chosen:** `{%- style -%}` block inline
- **Alternative:** `scss/sections/faq-page.scss` compiled by webpack
- **Why:** Follows established pattern (about-us, contact-us). Section settings drive CSS custom properties that must be inline anyway. No benefit to external SCSS for a self-contained section.
- **Downside:** Styles not minified by webpack CSS minimizer (negligible for this volume of CSS).

---

## Constraints and Assumptions

- **Assumption:** Design uses Dosis font family consistent with other custom pages. Safe because all existing custom sections (about-us, contact-us) use Dosis.
- **Assumption:** Banner layout matches about-us pattern (centered text, colored background). Will be confirmed/adjusted when Figma design is fully extracted.
- **Constraint:** Block limit of 20 FAQ items. Can be increased if merchant needs more.
- **Constraint:** No search/filter functionality in initial build. FAQ pages with <20 items don't need it.
- **Platform constraint:** Shopify section schema — blocks are flat (no nesting for categories). If categories are needed, they would be implemented as a separate block type (`faq_category`) that renders as a heading divider between groups of `faq_item` blocks.

---

## Build Validation

- **Build command:** `yarn start` (webpack watch) — verifies no build errors from new section
- **Theme editor:** Section appears in theme editor with all settings functional
- **Responsive breakpoints to test:** 390px (small), 768px (md-small), 1024px (md), 1280px (lg)
- **Validation:** `shopify theme check` for Liquid linting
