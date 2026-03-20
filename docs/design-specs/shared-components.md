# Shared Component Library Specification

**Version:** 1.0
**Date:** 2026-03-20
**Status:** Draft
**Scope:** System-agnostic building blocks used across all game sheets

---

## Design Token Reference

All components reference these tokens exclusively. Do not introduce ad-hoc colour or spacing values.

```
--bg-base            Dark base background (#1a1a1f)
--bg-surface         Card / panel background (slightly lighter than base)
--bg-surface-raised  Hover states, tooltips, dropdowns

--border-subtle      Low-contrast borders (separators, field outlines at rest)
--border-default     Standard borders (focused fields, card edges)

--text-primary       High-contrast body text
--text-muted         Labels, placeholders, subtitles
--text-disabled      Inactive, read-only states

--accent             Primary interactive colour (overridden per system; Paranoia: #c41e1e)
--accent-muted       Subtle accent for backgrounds and badges

--success            Confirmation, completed states
--danger             Errors, damage, pool exhaustion
--dice-flash         Brief highlight colour applied to a freshly rolled value
```

All specs below describe **dark mode** (the default). Light mode differences are noted where they diverge meaningfully. All transition timings use `transition-colors duration-150` unless otherwise specified.

---

## 1. DiceRoller

The core interactive element. A clickable SVG die icon that triggers a roll animation on the parent field.

### Shape

A clean geometric SVG die — not an emoji or raster image. The specific die face is determined by the active game system's theme configuration (`dieType` in the schema `theme` block):

- **Default / Paranoia:** d6 — a cube shown at ~30-degree isometric angle, showing the top face and two side faces. The top face has a single large dot centred. Stroke weight 1.5px, no fill (outline style).
- **D&D 5e:** d20 — an icosahedron represented as a flat-front pentagon with triangular facets radiating outward. Stroke weight 1.5px, outline style.
- The SVG viewBox is `0 0 24 24`. Both variants must be visually clear at 16px and above. No text or numerals in the SVG.
- Stroke and fill colour: `--accent`. On hover: reduce opacity to 80% (`opacity-80`) — do not change the hue. Do not use a filter or shadow on hover.

### Size Variants

| Variant | Usage | Rendered size | Touch target |
|---|---|---|---|
| `sm` | Inline next to a field value | 24 × 24 px | 32 × 32 px minimum (use padding) |
| `lg` | Standalone auto-roll or step-level roll button | 48 × 48 px | 48 × 48 px |

The `sm` variant sits to the right of the value display inside StatField. The `lg` variant is used as a standalone trigger (e.g. "Roll Attributes" button).

### States

**`idle`**
- SVG rendered at full opacity in `--accent` colour.
- Cursor: `cursor-pointer`.
- On hover: opacity drops to 80%. Transition: `transition-opacity duration-150`.

**`rolling`**
- The SVG rotates continuously: a CSS keyframe `@keyframes dice-spin` runs at 400ms total, looping while the roll calculation is in progress.
- Keyframe: `0% { transform: rotate(0deg) scale(1) } 25% { transform: rotate(90deg) scale(1.1) } 50% { transform: rotate(180deg) scale(1) } 75% { transform: rotate(270deg) scale(1.1) } 100% { transform: rotate(360deg) scale(1) }`. The brief scale pulse (1.1×) on quarter-turns gives a snappy, tactile feel without being slow. Total animation duration: 400ms; `animation-timing-function: ease-in-out`; `animation-iteration-count: 1` (plays once through — the field value appears as it ends). If the roll resolution takes longer than 400ms the animation should not loop; it should hold at the final frame.
- Cursor: `cursor-not-allowed` (or `cursor-default`) while rolling — prevent re-click spam.
- Colour: `--accent` at 60% opacity during the animation to signal it is in-progress.

**`settled`**
- Returns to `idle` appearance.
- The parent field (not the DiceRoller itself) handles the `--dice-flash` highlight (see StatField).
- No separate visual state on the DiceRoller itself after settling.

### Accessibility

- Element type: `<button>` (not `<div>` or `<span>`).
- `aria-label`: dynamically set. Examples: `"Roll Strength"`, `"Roll for Service Group"`, `"Roll random mutation"`. The label must name the field being rolled, not just say "Roll".
- Keyboard: activates on `Enter` and `Space` (standard button behaviour — no custom binding needed if using `<button>`).
- `aria-disabled="true"` and `tabindex="-1"` while in `rolling` state to prevent keyboard re-trigger.
- When the roll settles, announce the result to screen readers using an `aria-live="polite"` region on the parent field (not on the DiceRoller itself).

---

## 2. StatField

The most common field type on any character sheet. Displays a numeric value with an inline roll trigger.

### Layout

```
┌──────────────────────────────┐
│ STRENGTH             [dice]  │
│ ──────────────────────────── │
│         14                   │
└──────────────────────────────┘
```

- **Label:** above the value, in `--text-muted`, small size (`text-xs`), uppercase letter-spacing (`tracking-widest`). Left-aligned.
- **Value:** large, centred or left-aligned (see below), `--text-primary`, `text-2xl font-mono`. The monospace font ensures the number does not shift width between 1 and 2-digit values.
- **DiceRoller (sm):** positioned at the right edge of the component, vertically centred with the value row. Use `flex items-center justify-between` for the value+dice row.
- **Minimum width:** enough to display a 2-digit number comfortably — approximately 80px for inline use. In a grid layout (e.g. the 8-attribute grid), all StatFields in a row share equal width via `grid-cols-4` or similar.

### States

**`empty`**
- Value display shows a dash `—` in `--text-disabled`.
- DiceRoller is visible and active — the user is expected to roll to fill the field.

**`filled`**
- Value display shows the number in `--text-primary`.
- DiceRoller remains visible — re-rolling is always permitted on `roll` type fields.
- No visual distinction from initial fill vs. re-roll (the flash handles momentary feedback).

**`rolling`**
- DiceRoller enters its `rolling` state (animation plays).
- The value display applies a blur: `filter: blur(4px)` and `opacity-50`. This creates anticipation — the old value is obscured while the new one is being "decided".
- Transition into blur: `transition: filter 150ms ease-in, opacity 150ms ease-in`.
- The blur is removed when the animation settles and the new value is written.

### The `--dice-flash` Highlight

Triggered once when a roll settles and a new value is written.

- The value display element receives a brief background colour flash: background transitions from `--dice-flash` to transparent over **600ms**.
- Implementation: add a CSS class `dice-settled` that applies `background-color: var(--dice-flash)` and `border-radius: 4px`, then immediately transition it out with `transition: background-color 600ms ease-out`. Remove the class after 700ms (to fully clear).
- The flash applies only to the value element itself (the `text-2xl` span), not the whole card.
- `--dice-flash` is a warm amber or yellow — noticeably distinct from `--accent` — so it reads as "result landed here" rather than "this is interactive". Exact value: defined in the token set; suggested default `#f5c542` at 40% opacity for dark mode.

### Read-Only Variant (Calculated Fields)

Used for `type: "calculated"` fields (e.g. Skill Bases, Damage Bonus, Carrying Capacity).

- No DiceRoller — the dice icon is omitted entirely.
- Value displayed in `--text-muted` (slightly dimmer than a rolled stat).
- A subtle `CALC` badge or a small formula icon (`ƒ`) in `--text-disabled` at `text-xs` positioned below or beside the value. This makes it scannable that the value is derived, not input. Do not use tooltip-only indication — it must be visible at a glance.
- No hover state change on the value itself.
- Background: same as filled StatField — no special treatment needed beyond the above.
- `aria-readonly="true"` on the value element. No focusable roll button.

### Grid Usage Note

Attributes and derived stats are displayed in grids. StatFields must be self-contained enough to sit in a `grid grid-cols-2 gap-3` or `grid grid-cols-4 gap-3` layout without overflow.

---

## 3. DropdownField

A styled select input. Replaces the browser default `<select>` entirely.

### Layout

```
┌──────────────────────────────────┐
│ SERVICE GROUP                    │
│ ┌────────────────────────────┐   │
│ │ PLC — Production, Logistics ▾  │
│ │ Provides food, clothing...  │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

- **Label:** above the trigger, `--text-muted`, `text-xs`, `tracking-widest`, uppercase.
- **Trigger button:** full-width, `--bg-surface` background, `--border-default` border, `rounded-md`, `px-3 py-2`. Selected option label in `--text-primary`. A chevron-down icon (`▾`) right-aligned in `--text-muted`. Height matches StatField's value row (~40px) for visual consistency in mixed-field layouts.
- **Option description subtitle:** displayed as a second line inside the trigger button, below the selected option label. Uses `--text-muted`, `text-xs`, `truncate` (clipped to one line with ellipsis). This is distinct from the option list — it appears on the closed control to show context for the current selection.
- **Dropdown panel:** appears below the trigger on open. `--bg-surface-raised` background. `--border-default` border. `rounded-md`. `shadow-lg`. `max-h-60 overflow-y-auto`.
- **Option rows:** `px-3 py-2.5`. On hover: `--bg-surface-raised` (slightly lighter than panel background — use `bg-white/5` layer). Selected option: `--accent-muted` background, `--accent` left border (3px).
- **Option description in the list:** shown as a second line in the option row, `--text-muted`, `text-xs`. Wraps to two lines maximum — use `line-clamp-2`.

### Dark Mode

The dropdown panel and trigger are dark by default (`--bg-surface` and `--bg-surface-raised`). There is no browser chrome involved. For light mode, invert to white/light-grey backgrounds with dark text.

### States

**`empty`**
- Trigger shows placeholder text in `--text-disabled`: e.g. "Select service group…".
- No description subtitle shown.

**`selected`**
- Trigger shows selected option label and description subtitle.
- Option in the list is highlighted with `--accent-muted` background.

### Roll-to-Select Variant

Used for fields like Service Group where the rules support random selection (the `serviceGroupRoll` field maps to `serviceGroup`).

- A DiceRoller (sm) is placed to the right of the label, inline with it (not inside the trigger button).
- Label row layout: `flex items-center justify-between` → label text left, DiceRoller right.
- Clicking the DiceRoller plays the roll animation, then selects the randomly determined option and auto-populates the dropdown. The trigger button updates with an animation identical to the `--dice-flash` on StatField (background flash on the trigger box, 600ms fade).
- `aria-label` on the DiceRoller: `"Roll random [field label]"`, e.g. `"Roll random Service Group"`.

### Accessibility

- Trigger is a `<button>` with `aria-haspopup="listbox"` and `aria-expanded` toggled.
- Dropdown panel is `role="listbox"`. Options are `role="option"` with `aria-selected`.
- Keyboard: `Enter`/`Space` opens/selects; `ArrowUp`/`ArrowDown` navigate options; `Escape` closes.

---

## 4. TextInputField

A single-line text input.

### Layout

```
┌──────────────────────────────┐
│ CHARACTER NAME               │
│ ┌──────────────────────────┐ │
│ │ Car-R-PET-1              │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

- **Label:** above the input, `--text-muted`, `text-xs`, `tracking-widest`, uppercase.
- **Input:** full-width, `--bg-surface` background, `--border-subtle` border at rest, `rounded-md`, `px-3 py-2`, `text-sm`, `--text-primary`. Height: ~40px.
- **Placeholder:** `--text-disabled`, same size as input text.
- **Focus ring:** `outline-none` on the input element; replace with `ring-2 ring-[--accent] ring-offset-1 ring-offset-[--bg-base]` on focus. Border colour transitions to `--border-default`. Transition: `transition-all duration-150`.
- Do not show a clear button — keep the field minimal.

### Special Variant: Character Name Field

The Character Name field (`characterName`) uses a **monospace font** (`font-mono`) for the input text. This reinforces the `[Name]-[R]-[Sector]-[1]` Alpha Complex code format visually. The placeholder also uses `font-mono` (e.g. `Car-R-PET-1`).

No other TextInputField uses monospace — weapon names, player names, and armour type use the default sans-serif.

### States

**`empty`**
- Placeholder text visible in `--text-disabled`.
- Border: `--border-subtle`.

**`filled`**
- Input text visible in `--text-primary`.
- Border: `--border-subtle` (same as empty — do not add a "filled" indicator; the presence of text is enough).

**`focused`**
- Focus ring applied (see above).
- Border: `--border-default`.
- Background: no change (stay at `--bg-surface`).

### Usage Notes

Used for: character name (monospace variant), player name, weapon name (up to 5 slots), weapon type, weapon damage, weapon range, armour type, armour rating, Plasticredits. Weapon stat sub-fields (type, damage, range) are short values — in the Weapons & Armour section, these should be laid out in a compact grid row rather than stacked individually.

---

## 5. TextAreaField

A multi-line text input that grows with its content.

### Layout

- **Label:** above the textarea, same style as TextInputField label (`--text-muted`, `text-xs`, `tracking-widest`, uppercase).
- **Textarea:** full-width, `--bg-surface` background, `--border-subtle` border, `rounded-md`, `px-3 py-2`, `text-sm`, `--text-primary`.
- **Minimum height:** 3 rows (~72px). There is no fixed maximum height — the field expands vertically to fit content.
- **Auto-resize:** implemented via JavaScript that sets `height: 'auto'` then `height: scrollHeight + 'px'` on every `input` event. Do not rely on CSS `resize: vertical` as the primary mechanism (allow it as a secondary affordance but keep auto-resize as the default behaviour). Set `overflow-y: hidden` to prevent the scrollbar from appearing during resize.
- **Resize handle:** `resize-none` via Tailwind — no manual resize grip shown. The field grows automatically, so a manual handle is not needed and would look inconsistent.
- Focus ring: identical to TextInputField.

### States

Identical state model to TextInputField: `empty` (placeholder in `--text-disabled`), `filled` (text in `--text-primary`), `focused` (focus ring, border to `--border-default`).

### Usage Notes

Used for: equipment notes (pre-filled with standard loadout), mutation notes (secret page), society notes (secret page), public notes. The equipment notes field has a multi-line default value — the auto-resize should correctly size to that initial content on mount.

---

## 6. CheckboxField

A binary toggle. Replaces the browser default `<input type="checkbox">`.

### Layout

```
[ ✓ ] Experimental
```

- **Layout:** inline — checkbox box on the left, label immediately to the right. `flex items-center gap-2`.
- **Box:** 18 × 18 px, `rounded-sm`, border `--border-default` at rest. Background `--bg-surface`.
- **Checked state:** background fills with `--accent`; a white checkmark SVG (stroke, weight 2px) appears centred in the box. Border colour transitions to `--accent`. Transition: `transition-colors duration-150`.
- **Hover (unchecked):** border transitions to `--border-default` (if already at that level, transition to `--accent` at 50% opacity — a preview of the checked fill).
- **Hover (checked):** `--accent` at 85% opacity — slight dim.
- **Label:** `--text-primary`, `text-sm`. Not uppercase (unlike field labels — this is an inline label beside the control, not a field heading).
- **Focus:** a `ring-2 ring-[--accent] ring-offset-2 ring-offset-[--bg-base]` ring around the box on keyboard focus.
- The entire `flex` row (box + label) is the clickable/keyboard-activatable target.

### Grid Layout for Multiple Checkboxes

When several checkboxes appear together (e.g. the five weapon-slot experimental flags in the Weapons & Armour section):

- Lay them out in a `grid grid-cols-2 gap-x-6 gap-y-2` rather than a single column.
- Do not add extra visual grouping (no card or separator between them) — the grid density itself provides the association.
- In the Weapons & Armour section, the `Experimental` checkbox is positioned inline within each weapon slot row (as the last item in that row's layout), not grouped separately.

### Accessibility

- Element: `<input type="checkbox">` visually hidden, paired with a custom styled `<span>` box rendered via CSS. The `<label>` wraps both.
- Or: a `<button role="checkbox" aria-checked="true|false">` pattern — either is acceptable; the visual and aria semantics must stay in sync.
- Keyboard: `Space` toggles; `Tab` navigates between checkboxes.

---

## 7. PointAllocField

The skill point allocation control. Used for all `pointAlloc` type fields in the skills step.

### Layout

```
┌─────────────────────────────────────────────────────┐
│ LASER WEAPONS         (base 3)    8  [−]  [+]  /12  │
└─────────────────────────────────────────────────────┘
```

From left to right:
- **Label:** `--text-muted`, `text-xs`, `tracking-widest`, uppercase. Left-aligned. Truncate at ~60% of row width with `truncate` if needed.
- **Base indicator:** `(base N)` in `--text-disabled`, `text-xs`. Shown inline after the label, separated by a space. This is the skill group's calculated skill base (e.g. `(base 3)` means the skill starts at 3 before any point allocation). It is read-only and always visible.
- **Current value:** `text-lg font-mono --text-primary`. Minimum width enough for 2 digits — use `w-8 text-center`. The value displayed is the total (base + allocated points).
- **Minus (−) button:** `rounded-md`, `px-2 py-1`, `--bg-surface-raised` background. `--text-primary`. `text-sm`. Disabled and `--text-disabled` / `opacity-50` when value equals base (cannot go below base).
- **Plus (+) button:** same style as minus. Disabled when value equals the skill's max cap OR when the shared pool is at 0.
- **Max cap indicator:** `/12` or `/20` in `--text-disabled`, `text-xs`, positioned to the right of the `+` button. Always visible — shows the cap at a glance.

### Pool Tracker (Shared Counter)

A separate component displayed at the top of the skills step — **not** embedded in each PointAllocField row. It is a persistent banner:

```
┌──────────────────────────────────────────────────────┐
│  Points remaining:  22                               │
└──────────────────────────────────────────────────────┘
```

- Label: "Points remaining:" in `--text-muted`, `text-sm`.
- Value: `text-xl font-mono font-bold`.
  - Normal (> 0): `--text-primary`.
  - At exactly 0: `--danger`. The colour change is immediate (no transition needed — it is a meaningful state boundary).
  - Going negative: blocked — the `+` buttons on all fields are disabled before the pool goes below 0. The pool should never visually display a negative number.
- The pool counter is `position: sticky; top: 0` within the skills step scroll container so it remains visible while the user scrolls through the long skill list. Background: `--bg-surface` with a bottom border `--border-subtle` to separate it from the scrolling content below.

### States

**`at-base`**
- Value equals the skill base. Zero points have been allocated above the base.
- `−` button is disabled.
- Visual: value in `--text-muted` (dimmer) to indicate no investment has been made.

**`allocated`**
- Value is above the base. Points have been spent.
- `−` button enabled.
- Visual: value in `--text-primary` (full brightness).

**`at-max`**
- Value equals the skill's maximum cap (12 or 20).
- `+` button is disabled (`opacity-50`, `cursor-not-allowed`).
- The `/12` or `/20` suffix can optionally change to `--accent` colour as a subtle indicator that the cap has been reached — do not make this alarming, just informative.

### Service Group Skills Visual

Skills whose maximum cap is raised to 20 by the character's selected service group:

- Entire PointAllocField row has a `--accent-muted` background: `bg-[--accent-muted] rounded-md`.
- The max cap indicator shows `/20` instead of `/12`.
- No additional label or badge is needed — the background tint is sufficient to identify them as service-group skills.
- This background is applied/removed reactively when the service group selection changes.

---

## 8. SheetStepper

The creation wizard progress bar. Shown at the top of the creation wizard view.

### Layout

A horizontal row of step nodes connected by a progress line:

```
  [✓]─────[✓]─────[●]─────[ ]─────[ ]─────[ ]─────[ ]─────[ ]─────[ ]─────[ ]
Identity Attrs  Derived  SvcGrp  Skills  Weapons  Equip  Mutation  Society  Notes
```

- The stepper spans the full width of the wizard container. Steps are evenly distributed.
- **Progress line:** a thin horizontal line (2px) connecting all step nodes. The filled portion (left of and up to the current step) uses `--accent` colour. The unfilled portion (right of current step) uses `--border-subtle`. The fill transitions with `transition-all duration-300 ease-in-out` as steps complete.
- **Step nodes:** circular icons, 32 × 32 px on desktop.
- **Labels:** below each node, `text-xs`, `--text-muted` for upcoming, `--text-primary` for current and completed. On tablet (below ~768px): labels are hidden; only the node icon is shown, with a tooltip (`title` attribute or a Tailwind tooltip pattern) revealing the label on hover.

### Step Node States

**`upcoming`**
- Background: `--bg-surface`.
- Border: `--border-subtle`, 2px.
- Content: step number (1, 2, 3…) in `--text-disabled`, `text-xs`.
- Not clickable. Cursor: `cursor-default`.

**`current`**
- Background: `--accent-muted`.
- Border: `--accent`, 2px.
- Content: step number in `--accent`, `text-xs font-bold`.
- Node is slightly larger: 36 × 36 px (use `transform: scale(1.1)` or set explicit size). The scale-up centres on the node.
- Not clickable (already the active step). Cursor: `cursor-default`.
- A pulsing ring animation (optional, subtle): `@keyframes step-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent) } 50% { box-shadow: 0 0 0 6px transparent } }` at 2s interval. This should be very subtle — if it reads as distracting in review, omit it.

**`completed`**
- Background: `--accent`.
- Border: `--accent`.
- Content: a checkmark SVG (white, stroke 2px) centred in the node.
- Clickable — navigates back to that step. Cursor: `cursor-pointer`.
- On hover: background dims to `--accent` at 85% opacity (`opacity-85`). Transition: `transition-opacity duration-150`.
- `aria-label`: `"Go back to [step label]"`.

### Accessibility

- The stepper is a `<nav aria-label="Character creation steps">`.
- Steps are an ordered list (`<ol>`).
- Completed step buttons have `aria-label="Go back to [step label]"`.
- Current step has `aria-current="step"`.
- Upcoming steps are non-interactive `<span>` elements (not `<button>`).

---

## 9. SheetSectionCard

The container for a group of fields on the Full Sheet View.

### Base Appearance

- **Background:** `--bg-surface`.
- **Border:** `--border-subtle`, 1px, `rounded-lg`.
- **Inner padding:** `p-5` (20px). This provides breathing room around dense stat grids. In narrow contexts (tablet), reduce to `p-4`.
- **Shadow:** `shadow-sm` — a very subtle lift from the base background. Not a strong drop shadow.
- **Section header:**
  - Text: uppercase, `text-xs`, `tracking-widest`, `font-semibold`, colour `--text-muted`.
  - Left decoration: a 3px vertical bar in `--accent` on the left edge of the header text. Implemented as `border-l-[3px] border-[--accent] pl-2`. This is the primary visual grouping signal.
  - No horizontal rule or underline — the left bar is sufficient.
  - Margin below header: `mb-4`.

### Collapsible Variant

Used for large sections where scrolling through all fields at once is burdensome (e.g. the full skill list in the sheet view — approximately 50 skill rows).

- The section header row includes a chevron icon (`›` or `▾`) on the right edge. The chevron rotates 90° (pointing down) when expanded, 0° (pointing right) when collapsed. Transition: `transition-transform duration-200`.
- The header row is a `<button>` (full-width, `text-left`) wrapping the existing header content. Add `cursor-pointer`. On focus: standard focus ring on the button.
- Collapsed state: card height collapses to header-only height. The content area transitions: `max-height: 0; overflow: hidden` → `max-height: [measured height]` using `transition-[max-height] duration-300 ease-in-out`. Note: use a `max-height` that is reliably larger than actual content (e.g. `9999px`) to avoid needing JavaScript measurement; for this project where the skill list is known-length, a generous fixed `max-height` is acceptable.
- When collapsed, the card's bottom padding is also removed (`pb-0`) so there is no empty gap below the header.
- `aria-expanded` on the header button. `id` on the content div, referenced by `aria-controls` on the button.

### Hidden / Secret Variant

Used for the Secret Mutation and Secret Society sections in Paranoia. These sections have `hidden: true` in the schema.

- When the secret page is locked (default state):
  - Card content is replaced by an overlay: a `--bg-surface` background, `backdrop-blur-sm` applied over the actual content (the real fields render in the DOM but are blurred and covered).
  - A centred lock icon (SVG, ~32px, `--text-muted`) and a text label `"Secret — locked"` in `--text-muted`, `text-sm` are displayed over the blur.
  - The card border uses `--border-subtle` (no special styling — the lock overlay communicates the restriction).
  - The actual field values must NOT be readable through the blur. Use `blur-xl` (not `blur-sm`) combined with `pointer-events-none` on the content layer.
- When unlocked (via SecretPageToggle):
  - The overlay fades out (`transition-opacity duration-300`) and the blur is removed.
  - Content slides in: `translate-y-2` → `translate-y-0` combined with the fade, over 300ms. This gives a reveal feel rather than an abrupt appearance.
  - The card thereafter appears as a standard SheetSectionCard with no special treatment.

---

## 10. AutoRollButton

The "roll everything" call-to-action. Present throughout the creation wizard.

### Position

- **Sticky:** `position: sticky; top: 0` (or `top: [SheetStepper height]` — positioned directly below the SheetStepper in the stacking order). It scrolls with the page until it reaches the top, then sticks.
- Z-index: above the step content, below any open dropdown panels. `z-10`.
- Full-width of the wizard content column. Not a narrow pill — it spans the layout column.
- Padding: `py-3 px-4`. Height approximately 48px.

### Default State: "Auto-Roll Character"

- Background: `--accent` (full, not muted).
- Text: `--text-primary` (white on dark accent), `text-sm font-semibold`, `tracking-wide`.
- Label: "Auto-Roll Character".
- A DiceRoller (lg) SVG icon to the left of the label text, white coloured.
- Border radius: `rounded-lg`.
- Hover: `--accent` at 90% opacity, `transition-opacity duration-150`. Do not change the hue or add a border on hover.
- Cursor: `cursor-pointer`.

### Active State: "Rolling…"

- Triggered when the auto-roll cascade begins.
- Label changes to "Rolling…".
- DiceRoller icon enters its `rolling` animation state.
- Button is disabled: `opacity-70`, `cursor-not-allowed`, `pointer-events-none`.
- Background remains `--accent` (no colour change — the spinning icon communicates the in-progress state).

### Post-Completion State: "Re-Roll All"

- Label changes to "Re-Roll All".
- DiceRoller icon returns to `idle` state.
- Background: `--bg-surface` (no longer the full accent fill — this reduces visual weight since the sheet is already filled).
- Border: `--border-default`, 1px (to make the button visible on the `--bg-base` background).
- Text: `--text-muted` (further deemphasis).
- Still clickable — triggers the cascade again from scratch.
- Hover: `--bg-surface-raised`.
- Transition from active to post-completion: `transition-all duration-300` on background and text colour.

### Accessibility

- `<button>` element.
- `aria-label`: matches visible label text ("Auto-Roll Character", "Rolling…", "Re-Roll All").
- `aria-disabled="true"` in the active/rolling state.
- An `aria-live="polite"` region elsewhere on the wizard announces when auto-roll completes (e.g. "Character auto-rolled. Review your stats below.").

---

## 11. SecretPageToggle

The mechanism for revealing the hidden secret page in systems that support it (currently Paranoia). Defined here as a shared component for potential reuse.

### Placement

- A tab or button positioned at the top of the Full Sheet View, after (or adjacent to) the public page sections.
- On desktop: rendered as a labelled tab in a two-tab layout ("Public Sheet" / "Secret Page"). On mobile/tablet: rendered as a full-width button at the top of the secret section area.
- The toggle is always visible — it is not hidden. The secret sections themselves are hidden, not the toggle.

### Locked State (Default)

- **Label:** "Show Secret Page".
- **Icon:** a closed padlock SVG, `--text-muted`, 16px, to the left of the label.
- **Style (tab variant):** `--bg-surface` background, `--border-subtle` border, `rounded-t-lg`. Text: `--text-muted`. The tab does not have the accent-coloured bottom border that the active tab has.
- **Style (button variant):** full-width, `--bg-surface`, `--border-default` border, `rounded-lg`, `py-2.5`. Icon + label centred.

### Unlocked State

- **Label:** "Hide Secret Page".
- **Icon:** an open padlock SVG, `--accent` colour, 16px.
- **Style (tab variant):** `--accent-muted` background on the tab, `--accent` bottom border (3px). Text: `--text-primary`.
- **Style (button variant):** `--accent-muted` background, `--accent` border.
- The secret SheetSectionCards animate in (fade + slide-up, 300ms — as described in SheetSectionCard hidden variant above).

### Reveal Animation

When transitioning from locked to unlocked:
1. The padlock icon transitions from closed to open (CSS swap, no animation needed beyond the icon swap).
2. The button/tab background and border colour transition over 200ms (`transition-all duration-200`).
3. The secret section cards animate in with their own reveal transition (see SheetSectionCard hidden variant).
4. Scroll to the revealed section automatically after the animation completes (300ms delay, `behavior: 'smooth'`).

### Re-locking Animation

When transitioning from unlocked to locked:
1. The secret section cards transition back to blurred/overlaid state (300ms fade-in of the lock overlay).
2. The button/tab transitions back to locked appearance.
3. No scroll behaviour on re-lock.

### Persistence

- The unlock state is stored in `sessionStorage` (not `localStorage`). It persists for the duration of the browser session but resets on page close or reload. This is intentional — the secret page should be locked by default on each new session.
- Key: `secret-page-unlocked-[characterId]` (namespaced to the character to support multiple open characters in different tabs).
- On mount, check `sessionStorage` and restore the unlock state silently (no animation on restore — the card is simply rendered in the correct state).

### Accessibility

- `<button>` element (or `<a role="tab">` in the tab variant).
- `aria-label` reflects the current state: `"Show secret page"` or `"Hide secret page"`.
- `aria-expanded` mirrors unlock state.
- `aria-controls` references the ID of the secret sections container.
- When secret sections are revealed, focus does not move automatically — the user can Tab into them naturally.

---

## Component Interaction Summary

| Component | Embeds | Used By |
|---|---|---|
| DiceRoller | — | StatField, DropdownField (roll-to-select), AutoRollButton |
| StatField | DiceRoller (sm) | SheetSectionCard (attributes, derived stats) |
| DropdownField | DiceRoller (sm, optional) | SheetSectionCard (service group, clearance, mutation, society) |
| TextInputField | — | SheetSectionCard (identity, weapons, armour, credits) |
| TextAreaField | — | SheetSectionCard (equipment, mutation notes, society notes, public notes) |
| CheckboxField | — | SheetSectionCard (weapon experimental flags) |
| PointAllocField | — | SheetSectionCard (all skill sections) |
| SheetStepper | — | Creation Wizard layout root |
| SheetSectionCard | Any field components | Full Sheet View layout |
| AutoRollButton | DiceRoller (lg) | Creation Wizard layout root |
| SecretPageToggle | — | Full Sheet View layout (Paranoia) |

---

## Print / `@media print` Notes

All components must degrade gracefully for print:

- DiceRoller: hidden (`display: none`) in print.
- AutoRollButton: hidden in print.
- SheetStepper: hidden in print.
- SecretPageToggle: hidden in print. Secret sections should only print if currently unlocked.
- StatField, DropdownField, TextInputField, TextAreaField, CheckboxField, PointAllocField: rendered as static read-only display (no interactive chrome, no borders on text inputs — just the label + value, cleanly laid out).
- SheetSectionCard: white background, black border, black text in print. The accent-coloured left header bar prints in `--accent` if the printer supports colour; otherwise degrades to a solid black bar.
- Use `@media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }` to preserve background colours on stat grids and badges where supported.
