# FAQ Page — Test Scenarios

## Visual States

### S1: Banner visible (default)
- Banner displays with heading "Frequently Asked Questions" and subtitle
- Background color matches `banner_bg` setting
- Text color matches `banner_text_color` setting

### S2: Banner hidden
- Set `enable_banner` to false
- Banner region completely hidden, FAQ items start at top of section

### S3: All items collapsed (default)
- All `<details>` elements closed
- Only question text and toggle icon visible per item
- Divider lines visible between items

### S4: Single item expanded
- Click a question — answer content appears
- Icon rotates (45deg for plus, 180deg for caret)
- Other items remain collapsed

### S5: Multiple items expanded
- Expand several items simultaneously
- Each maintains independent open/close state
- No layout shift or overlap between expanded items

### S6: Item with `open_by_default` checked
- On page load, that item renders with `<details open>`
- Answer content visible without user interaction

### S7: Hover state on summary row
- Mouse over a collapsed question — subtle background highlight appears
- Cursor changes to pointer

---

## Icon Variants

### S8: Plus icon style
- Set `icon_style` to "plus"
- Collapsed: "+" icon on right side of question
- Expanded: icon rotates 45deg to form "x"

### S9: Caret icon style
- Set `icon_style` to "caret"
- Collapsed: downward-pointing caret
- Expanded: caret rotates 180deg (points up)

---

## Responsive Breakpoints

### S10: Desktop (1280px+)
- Banner has full padding
- FAQ content centered with max-width constraint
- Comfortable spacing between items

### S11: Tablet (768px - 1024px)
- Layout remains single column
- Reduced banner padding
- Content area respects horizontal padding setting

### S12: Mobile (390px)
- Banner font size reduces
- Banner padding reduces
- FAQ items full-width with mobile-appropriate padding
- Touch targets on summary rows meet 44px minimum height
- No horizontal overflow

---

## Data Edge Cases

### S13: Long question text
- Question wraps to multiple lines
- Icon stays right-aligned, vertically centered
- No text truncation

### S14: Long answer with rich text
- Answer contains headings, lists, links, bold/italic
- All richtext elements render correctly inside answer area
- Links are clickable and styled

### S15: Empty answer
- Block with question but blank answer
- Item still renders; expanding shows empty content area (no layout break)

### S16: Single FAQ item
- Only one block added
- No divider line (only shows between items, not above first or below last)
- Section renders cleanly

### S17: Maximum items (20 blocks)
- All 20 items render without performance issues
- Scrolling is smooth
- Theme editor remains responsive

### S18: No blocks added
- Section with zero FAQ blocks
- Banner still renders (if enabled)
- Content area shows nothing — no broken layout or errors

---

## Accessibility

### S19: Keyboard navigation
- Tab moves focus to each `<summary>` element in order
- Enter/Space toggles the focused item open/closed
- Focus ring visible on focused summary (`:focus-visible`)

### S20: Screen reader
- `<details>`/`<summary>` announces as expandable/collapsible
- Expanded state communicated ("expanded"/"collapsed")
- Answer content accessible when expanded

### S21: Color contrast
- Default color settings pass WCAG AA (4.5:1 ratio for body text, 3:1 for large text)
- Banner text on banner background passes contrast check

---

## Theme Editor

### S22: Settings apply live
- Changing any color setting updates the preview immediately
- Changing padding/spacing settings updates layout immediately
- Toggling banner shows/hides in real-time

### S23: Block reordering
- Drag FAQ item blocks to reorder in theme editor
- Front-end reflects new order on save

### S24: Block add/remove
- Add new FAQ block — appears at bottom of list
- Remove block — item disappears, remaining items reflow

---

## Cross-browser

### S25: Safari `<details>` rendering
- Verify `<details>` expand/collapse works in Safari (known quirks with animation)
- Summary `list-style: none` and `::marker` hidden correctly

### S26: Firefox focus styles
- `:focus-visible` outline renders correctly on summary elements
