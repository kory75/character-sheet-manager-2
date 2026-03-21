# D&D 5e (2024) — Character Sheet Design Specification

**Version:** 1.1
**Date:** 2026-03-21
**Status:** Implemented (Experimental) — wizard and sheet are built; rules enforcement is incomplete
**Audience:** Developer continuing work on the D&D 5e character sheet

> **Implementation status:** All 10 wizard steps and the full sheet view are built and functional.
> Known gaps: skill/expertise slot limits not enforced (pending rules research), auto-roll does not
> fill steps 5–9 with real data, no IndexedDB persistence yet.
> See `docs/design-document.md` § 9 for the full pending list.

---

## 1. Theme Overview

### 1.1 Colour Tokens

The D&D 5e theme overrides the shared CSS custom properties when the class `theme-dnd5e` is applied to the root element. All values listed here replace the system defaults for any component rendered inside `theme-dnd5e`.

| Token | Value | Notes |
|---|---|---|
| `--bg-base` | `#0f1520` | Near-black deep navy — darker than charcoal default |
| `--bg-surface` | `#1a2340` | Deep navy panel background — the primary card colour |
| `--bg-surface-raised` | `#1f2d4f` | Hover states, open dropdowns, tooltips |
| `--border-subtle` | `#2a3a5c` | Section separators, resting field borders |
| `--border-default` | `#3d5080` | Active field borders, card edges |
| `--accent` | `#c9a84c` | Warm gold — all interactive elements, dice icons, proficiency dots |
| `--accent-muted` | `rgba(201,168,76,0.15)` | Parchment-tint backgrounds, selected states, badges |
| `--text-primary` | `#e8dcc8` | Warm parchment white — all body text and stat values |
| `--text-muted` | `#9a8f7a` | Labels, placeholders, section headers |
| `--text-disabled` | `#5a5244` | Inactive controls, read-only indicators |
| `--success` | `#5a9e6f` | Stabilised / confirmed states |
| `--danger` | `#b84040` | Death saves (failures), error states |
| `--dice-flash` | `rgba(201,168,76,0.40)` | Roll-settled highlight — same hue as accent at 40% |

**D&D-specific additions** (not in the shared token set — apply alongside the overrides above):

| Token | Value | Usage |
|---|---|---|
| `--dnd-serif-font` | `"Cinzel", "Palatino Linotype", Georgia, serif` | Headings, section titles, class/level banner |
| `--dnd-ornament-color` | `rgba(201,168,76,0.25)` | Flourish SVGs, corner ornaments, divider lines |
| `--dnd-parchment-bg` | `rgba(201,168,76,0.08)` | Section header row background tint |
| `--dnd-parchment-dark` | `rgba(201,168,76,0.04)` | Very faint card texture overlay (`:before` pseudo-element) |

### 1.2 Typography

**Heading font:** Cinzel (Google Fonts, weights 400 and 700).
- Load via: `<link>` in `index.html` — `https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap`
- Fallback stack: `"Palatino Linotype", Georgia, serif`

**Body / stat font:** Inter (already loaded globally). `font-sans` in Tailwind.

**Monospace (stat values):** `font-mono` — unchanged from shared spec.

| Element | Font | Size | Weight | Colour | Other |
|---|---|---|---|---|---|
| Full sheet page title | Cinzel | `text-2xl` | 700 | `--text-primary` | `tracking-wide` |
| Class/Level banner — class name | Cinzel | `text-xl` | 700 | `--accent` | `tracking-widest uppercase` |
| Class/Level banner — level text | Cinzel | `text-base` | 400 | `--text-muted` | — |
| Section card header | Cinzel | `text-xs` | 400 | `--text-muted` | `tracking-widest uppercase` |
| Step heading (wizard) | Cinzel | `text-lg` | 700 | `--text-primary` | — |
| Step description (wizard) | Inter | `text-sm` | 400 | `--text-muted` | italic |
| Field labels | Inter | `text-xs` | 400 | `--text-muted` | `tracking-widest uppercase` |
| Stat values (StatField) | Inter mono | `text-2xl` | 400 | `--text-primary` | — |
| Modifier display | Inter mono | `text-sm` | 400 | `--text-muted` | See §5 |
| Body text / descriptions | Inter | `text-sm` | 400 | `--text-primary` | — |
| Option descriptions | Inter | `text-xs` | 400 | `--text-muted` | — |

### 1.3 Decorative Motifs

The following elements appear at specific locations throughout the UI. They are layered **in addition to** standard component styles — do not replace structural layout for decorative reasons.

#### Section Card Header
- **Background tint:** The header row (label + left accent bar) has `background-color: var(--dnd-parchment-bg)` and `border-radius: 4px 4px 0 0` applied to just the header row, not the full card.
- **Left accent bar:** 3px vertical bar in `--accent` on the left edge of the header text (unchanged from shared spec, same implementation: `border-l-[3px] border-[--accent] pl-2`). The gold colour replaces whatever the default accent was.
- **Ornamental divider:** immediately below the header row, a thin 1px horizontal rule using `--dnd-ornament-color`. This sits between the header and the card content (`mb-4` still applies below this rule). Implementation: `<hr class="border-0 h-px bg-[--dnd-ornament-color] mb-4" />`.

#### Section Card Body
- **Texture overlay:** A `:before` pseudo-element on `.dnd-card` applies a very faint radial gradient to suggest aged material — `background: radial-gradient(ellipse at top left, var(--dnd-parchment-dark) 0%, transparent 70%)`. This must remain at or below 4% opacity. Do not use a raster texture image.
- **Corner flourishes:** SVG flourishes appear in the top-left and bottom-right corners of SheetSectionCard components on the Full Sheet View only (not the wizard steps, where space is tight). Implement as absolutely-positioned SVG elements inside the card's relative container. Each flourish is a simple quarter-arc with a small stylised leaf or scroll terminus. Dimensions: approximately 24×24px. Colour: `--dnd-ornament-color`. These are `pointer-events-none aria-hidden="true"`.

#### Ornamental Section Dividers
Used between major sections in the Full Sheet View (between the combat section and the skills section, for example). A centred horizontal decorative rule consisting of:
- A thin line (`--dnd-ornament-color`, 1px) spanning the column width
- A small diamond or lozenge SVG icon (`--dnd-ornament-color`, ~12×12px) centred on the line

Implementation: `<div class="dnd-divider">` containing `<span class="dnd-divider__line"></span><svg class="dnd-divider__icon">...</svg><span class="dnd-divider__line"></span>` with `display: flex; align-items: center; gap: 8px`. The line spans (`flex-1 h-px bg-[--dnd-ornament-color]`), the icon is inline SVG.

#### Wizard Step Decorative Header
Each wizard step card has a short italic flavour-text quote below the step description. This is a short one-sentence excerpt from D&D lore or a thematic phrase (hardcoded per step — see §2). Style: `text-xs italic text-[--text-disabled] text-right mt-1`. Preceded by an em dash. Do not pull this from the schema — it is purely decorative.

#### Full Sheet Background Watermark
Behind the full sheet content area (not inside any card), a large SVG silhouette — a stylised dragon or heraldic shield — is absolutely positioned, centred, `opacity: 0.025`, `pointer-events-none`, `z-index: 0`. The content renders at `z-index: 1` above it. This is subtle enough to read as a textural element rather than a graphic. Use a simple flat SVG (no gradients inside the watermark itself).

#### Class/Level Banner
A full-width banner at the top of the Full Sheet View (see §3.3 for layout details). On the banner:
- Background: `linear-gradient(135deg, #1f2d4f 0%, #2a3a5c 100%)` — slightly lighter than `--bg-surface` to lift it visually
- Top and bottom borders: 1px `--dnd-ornament-color`
- Left section: a class icon (simple SVG glyph representing the class family — see below)
- Centre: character name in Cinzel, class + subclass in Cinzel, level in Cinzel

**Class icon glyphs** (simple SVG, 32×32px, `--accent` stroke, no fill):
- Fighters, Barbarians, Paladins, Rangers: sword silhouette
- Wizards, Sorcerers, Warlocks: arcane star / stylised spell symbol
- Clerics, Druids: holy symbol / leaf
- Rogues, Bards, Monks, Artificers: scroll or instrument

These are thematic, not literal — one icon per "archetype group" is sufficient. The developer may implement a simple lookup from class name to icon variant.

---

## 2. Creation Wizard Layout

The wizard uses the shared `SheetStepper` component at the top, then the `AutoRollButton` sticky bar, then a single-column step content area with a `SheetSectionCard` (or multiple) per step. The outer wizard container has a `max-w-3xl mx-auto px-4` layout — wide enough for two-column field grids, narrow enough to feel focused.

The `AutoRollButton` is present on steps 1–8 (identity through background-features). It is hidden on the notes step (step 10) where there is nothing to roll.

### Step 1 — Identity

**Visual tone:** Welcoming, heraldic. The first step should feel like inscribing your name in a tome.

**Flavour quote:** *"Every legend begins with a name."*

**Layout:**
- Character Name: full-width `TextInputField`, large — override the input to `text-lg font-[var(--dnd-serif-font)]` so the name is rendered in Cinzel as the user types. This is the only TextInputField across all steps that uses the serif font.
- Player Name: full-width `TextInputField`, standard size, below Character Name.
- Character Level and Experience Points: side by side in a `grid grid-cols-2 gap-4`. Level is a `DropdownField`; XP is a `TextInputField`.
- Background: full-width `DropdownField` below the level/XP row. The background dropdown uses the roll-to-select variant — a DiceRoller (sm) next to the label rolls a random background.
- The Background dropdown description (shown in the closed trigger after selection) should display the skill proficiencies granted — derived from the selected option's `description` field, truncated at one line.

**Step-specific decorative:** None beyond standard card motifs.

**Interactions:** Standard. No special interactions beyond the background roll-to-select.

---

### Step 2 — Species

**Visual tone:** Wondrous, varied. Conveys the breadth of the world's peoples.

**Flavour quote:** *"In the multiverse, no two souls share the same heritage."*

**Layout:**
- Species: full-width `DropdownField`. The species dropdown supports roll-to-select — a DiceRoller (sm) next to the label selects a random species.
- Below the species dropdown: a **Trait Display Panel** — a `SheetSectionCard` styled variant (same card, but without a header bar) that shows the selected species' traits. This panel:
  - Has `--dnd-parchment-bg` background (slightly warmer than standard surface)
  - Renders the full `description` text from the selected option in `text-sm text-[--text-primary]`, not truncated
  - Label: "Species Traits" in Cinzel `text-xs tracking-widest uppercase text-[--text-muted]` above the description text
  - Updates reactively when the species selection changes — the content transitions with `transition-opacity duration-200` (fade out, update, fade in)
  - If no species is selected: shows placeholder text "Select a species to see its traits" in `--text-disabled`

**Interactions:** The species dropdown fires the trait panel update on every selection change.

---

### Step 3 — Class

**Visual tone:** Decisive, powerful. The class defines the character's role.

**Flavour quote:** *"Your path is chosen. Your training begins."*

**Layout:**
- Class: full-width `DropdownField`. Does not use roll-to-select (class should be a deliberate choice).
- Subclass: full-width `DropdownField` below. **Conditional display:** When character level is below 3 (or level 1 for Cleric, Sorcerer, Warlock), show the subclass field but with a notice badge: a small `--accent-muted` pill badge with gold text reading "Available at Level 3" positioned to the right of the subclass label. The field remains interactive (some players build to a level where subclass is available). When no class is selected, the subclass dropdown shows "— Select a class first —" as its disabled placeholder.
- Hit Die: displayed as a `StatField` (read-only, calculated) below the subclass dropdown. The value renders as "d8", "d10", etc. — not as a raw number. The StatField label reads "HIT DIE". Since it is a calculated field, no DiceRoller is shown.
- **Hit Die visual treatment:** render the hit die value in `text-2xl font-[var(--dnd-serif-font)] text-[--accent]` to make it feel significant. The die type (d6, d8, d10, d12) is the most impactful choice on this step.

**Interactions:** Selecting a class reactively:
1. Updates the Hit Die display
2. Filters the subclass dropdown to show only that class's subclasses (plus the "— None —" option)
3. Does not reset a previously selected subclass if it matches the new class — but if the class changes to one that doesn't have the previously selected subclass, resets to "— None —"

---

### Step 4 — Ability Scores

**Visual tone:** Tense, anticipatory — this is where fate is determined. The roll variant should feel like throwing dice at the table.

**Flavour quote:** *"The gods have allotted you your gifts. How you use them is your choice."*

**Layout — Method Selector:**
- A segmented toggle control at the top of the step (not a dropdown) with three options: "Standard Array", "Point Buy", "Roll". Implemented as a horizontal `flex` group of three buttons. Active method: `--accent` background, `--text-primary` text, `rounded-md`. Inactive: `--bg-surface-raised`, `--text-muted`. The group has `gap-1 p-1 bg-[--bg-base] rounded-lg` container styling.
- The toggle drives the step's layout mode — all three share the same six-score grid, but behaviour differs.

**Layout — Score Grid:**
A `grid grid-cols-2 gap-4` (desktop) / `grid grid-cols-1 gap-3` (mobile) of six `StatField` components for STR, DEX, CON, INT, WIS, CHA.

Each StatField in this context has an extended layout (D&D-specific, distinct from the base StatField):
```
┌─────────────────────────────────┐
│ STRENGTH                [dice]  │   ← label + DiceRoller (Roll mode only)
│ ─────────────────────────────── │
│         14                      │   ← score (text-3xl, prominent)
│       (+2)                      │   ← modifier (text-sm, below score, --text-muted)
└─────────────────────────────────┘
```
- Score: `text-3xl font-mono text-[--text-primary]` — larger than standard to emphasise the raw number
- Modifier: displayed on its own line below the score, in `text-sm font-mono text-[--text-muted]`, in parentheses with explicit +/− sign: `(+2)`, `(-1)`, `(+0)`. This is a calculated value, not a second field.
- DiceRoller: visible only in **Roll** mode. Hidden in Standard Array and Point Buy modes.

**Mode-specific behaviour:**

*Roll mode:*
- Each StatField shows a DiceRoller (sm) — clicking it rolls 4d6 drop lowest and sets the score.
- The AutoRollButton rolls all six scores in cascade.
- Re-rolling is permitted for individual scores.

*Standard Array mode:*
- The six values (15, 14, 13, 12, 10, 8) are shown as draggable chips or as a simple assignment interface:
  - Below the method toggle, a row of six chips: `[15] [14] [13] [12] [10] [8]` — each chip is a small `px-3 py-1 rounded-md bg-[--bg-surface-raised] text-[--text-primary] font-mono` pill.
  - Each ability score field shows a dropdown instead of a number input, pre-populated with the unassigned values from the standard array. Once a value is assigned to STR, it disappears from the other dropdowns. When all six are assigned, no more options are available.
  - Alternatively (simpler): score fields are free-text inputs, and a "Remaining values" tracker shows which standard array values are still unassigned (same tracker design as the PointAllocField pool counter). This is the recommended approach — fewer moving parts than drag-and-drop.
- No DiceRoller shown in this mode.

*Point Buy mode:*
- Score fields are `PointAllocField`-style steppers showing values 8–15. Each score uses +/− buttons.
- A pool tracker ("Points remaining: 27") is sticky below the method toggle — same visual treatment as the Paranoia skill pool tracker, but gold accent.
- Costs per score value: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9. The +/− buttons enforce the maximum 15 ceiling and the pool floor.
- No DiceRoller shown in this mode.

**Proficiency Bonus:** displayed as a read-only `StatField` (calculated) below the six score grid. Label "PROFICIENCY BONUS". Value formatted as `+2`, `+3`, etc.

**Step-specific decorative:** A faint heraldic shield watermark behind the six score cards at 3% opacity.

---

### Step 5 — Skills & Proficiencies

**Visual tone:** Scholarly. A ledger of capabilities.

**Flavour quote:** *"Talent is inherited. Proficiency is earned."*

**Layout:**
Two vertical sub-sections within the step, separated by the ornamental divider:

**Sub-section A: Saving Throws**
- Label: "Saving Throws" in Cinzel heading style
- A `grid grid-cols-2 gap-2` of six rows, one per ability. Each row:
  ```
  [checkbox]  STR  +2
  ```
  - Checkbox (`CheckboxField`) on the left — checked if proficient
  - Ability abbreviation label in `text-xs font-bold text-[--text-muted] w-12`
  - Calculated total in `font-mono text-sm text-[--text-primary]` with explicit +/− sign, right-aligned

**Sub-section B: Skills**
- Label: "Skills" in Cinzel heading style
- A single-column list (not a grid) of 18 skill rows. Each row:
  ```
  [checkbox]  Acrobatics (DEX)  +4
  ```
  - Checkbox on the left
  - Skill name in `text-sm text-[--text-primary]` + ability abbreviation in `text-xs text-[--text-muted]` in parentheses
  - Calculated total in `font-mono text-sm text-[--text-primary]`, right-aligned with explicit +/− sign
  - Full row is `flex items-center justify-between px-2 py-1.5`
  - Alternating row background for readability: even rows `transparent`, odd rows `bg-white/[0.02]`. Not a full `--bg-surface` card — just a subtle stripe.
  - Proficient rows: when the checkbox is checked, apply `bg-[--accent-muted]` to the entire row (replaces the alternating stripe for that row).

**Interaction:** Checking a proficiency checkbox immediately recalculates and updates the displayed total. Skills whose proficiency is pre-filled by the character's class (from the schema) should be pre-checked but still toggleable (house rule support).

---

### Step 6 — Combat

**Visual tone:** Tactical, urgent. Numbers that decide life and death.

**Flavour quote:** *"Fortune favours the prepared."*

**Layout:**
Three horizontal stat blocks at the top in a `grid grid-cols-3 gap-4`:
- AC (Armor Class) — `TextInputField` variant displayed as a `StatField`-sized block. Large centred number, shield icon SVG (`--accent`, 16px) to the left of the label.
- Initiative — `StatField` (calculated, no dice). Show +/− sign explicitly.
- Speed — `TextInputField` displayed as a `StatField`-sized block. "ft." suffix in `text-sm text-[--text-muted]` after the value.

Below that, HP section in a `grid grid-cols-2 gap-4`:
- Maximum Hit Points — `StatField` (calculated). Label "MAX HP". Value in `text-3xl` — most important number in combat.
- Hit Dice — `TextInputField` displayed as a stat block. Label "HIT DICE". Placeholder "1d8".

Below HP, the Death Saves section:
- Label: "Death Saves" in Cinzel heading style
- Two rows: "Successes" and "Failures"
- Each row: label on the left, then three `CheckboxField` instances in a horizontal `flex gap-2` group
- Success checkboxes: when checked, fill with `--success` (green) instead of `--accent` gold
- Failure checkboxes: when checked, fill with `--danger` (red) instead of `--accent` gold
- The visual distinction between success/failure checkbox colours is a D&D-specific override to the CheckboxField component. Pass a `variant` prop: `variant="success"` or `variant="danger"` which overrides the checked fill colour.

**Step-specific decorative:** A small sword-and-shield crossed icon SVG (`--dnd-ornament-color`, 32px) centred above the AC/Initiative/Speed grid, above the sub-section heading.

---

### Step 7 — Equipment

**Visual tone:** Mercantile, practical. A merchant's ledger.

**Flavour quote:** *"What you carry into the dungeon may be all that brings you back out."*

**Layout:**

**Currency row** at the top: `grid grid-cols-5 gap-2` for CP, SP, EP, GP, PP. Each currency is a compact `TextInputField` with a small coin icon or coloured circle badge (copper/silver/electrum/gold/platinum) next to the label. Coin colours: CP=#b87333, SP=#aaa9ad, EP=#6fa8dc, GP=#c9a84c, PP=#e0d0f0. These are accent dots (`w-2 h-2 rounded-full` inline with the label), not full icon graphics.

**Armor section**: `grid grid-cols-2 gap-4`:
- Armor Name — `TextInputField`
- Armor Type — `DropdownField`

**Weapons grid**: Three weapon slots, each rendered as a compact row in a `grid grid-cols-[1fr_auto_auto] gap-2` or `grid grid-cols-3 gap-2`:
- Weapon Name — `TextInputField` (spans full width of slot row, or 1fr column)
- Damage Type — `TextInputField` (compact, ~80px)
- Damage — `TextInputField` (compact, ~80px, monospace font)

Each slot is visually separated by a `border-b border-[--border-subtle]` rule, not a full card. A small slot number label ("Weapon 1", "Weapon 2", "Weapon 3") in `text-xs text-[--text-disabled] mb-1` above each slot row.

**Equipment & Gear textarea**: below the weapons grid, full-width `TextAreaField`. Label "EQUIPMENT & GEAR". Minimum height 5 rows.

**Interactions:** No rolls on this step. The AutoRollButton is hidden (or shows as disabled) on the equipment step — there is nothing to roll.

---

### Step 8 — Spellcasting

**Visual tone:** Arcane, otherworldly. The spellcasting step should feel like transcribing a spellbook.

**Flavour quote:** *"Magic is not merely learned — it is remembered."*

**Visibility:** If the character's class has no spellcasting ability (Barbarian, Fighter without Eldritch Knight subclass, Monk without Four Elements), display a notice panel instead of the full spellcasting form: a `SheetSectionCard` with icon (scroll SVG) and text "This class does not cast spells. Multiclass characters may still use this section." in `--text-muted`. The notice should be non-blocking — the user can still fill in fields if needed (multiclassing).

**Layout:**

Header row of four stat blocks in `grid grid-cols-2 gap-4` (two rows of two on mobile), or `grid grid-cols-4 gap-3` on desktop:
- Spellcasting Class — `TextInputField` (small stat block layout: label + value)
- Spellcasting Ability — `DropdownField` (INT / WIS / CHA)
- Spell Save DC — `StatField` (calculated, read-only)
- Spell Attack Bonus — `StatField` (calculated, read-only, explicit +/− sign)

**Spell Slots Grid:**
A custom layout — not a standard field type. Displayed as a compact visual grid:

```
┌──────────────────────────────────────────────────────────┐
│  SPELL SLOTS                                             │
│  1st  2nd  3rd  4th  5th  6th  7th  8th  9th            │
│  [4]  [3]  [3]  [2]  [1]  [—]  [—]  [—]  [—]           │
└──────────────────────────────────────────────────────────┘
```

- The row of labels (1st through 9th) is `text-xs text-[--text-muted]` in a `grid grid-cols-9 gap-1`.
- Below it: nine `TextInputField`-derived compact inputs. Each input: `w-full text-center font-mono text-sm`. Width is constrained by the nine-column grid.
- The label row and input row together form a single visual unit — no card wrapper, just a flat grid inside the spellcasting `SheetSectionCard`.
- Empty spell slot levels (for classes that don't have that level yet) show `—` as placeholder and accept input for multiclassing flexibility.
- A thin gold border `border border-[--accent] opacity-20 rounded` wraps the entire 9-slot block as a subtle frame.

**Cantrips:**
Full-width `TextAreaField` below the spell slots grid. Label "CANTRIPS KNOWN". Minimum 2 rows. Rendered with a small arcane star icon (`--accent`, 12px) next to the label.

**Spell Lists by Level:**
Five `TextAreaField` components, one per spell level (1st through 5th). Labels: "1ST-LEVEL SPELLS", "2ND-LEVEL SPELLS", etc. Each minimum 2 rows. Displayed in a `grid grid-cols-1 gap-3` (single column). Higher levels (6th–9th) are omitted from the wizard step to keep the screen manageable; they are editable on the Full Sheet View.

**Step-specific decorative:** An arcane circle or rune SVG watermark (`--dnd-ornament-color`, ~100px) centred behind the spell slots grid at 8% opacity.

---

### Step 9 — Background & Features

**Visual tone:** Reflective, personal. The character's story takes shape.

**Flavour quote:** *"The adventurer you are is built on the person you were."*

**Layout:**
Two columns on desktop (`grid grid-cols-2 gap-6`), single column on mobile.

**Left column:**
- Background Feature — `TextAreaField`, full width of column, minimum 3 rows
- Background Feat — two-part: `TextInputField` for feat name (compact, one row), then `TextAreaField` for feat description, minimum 2 rows
- Languages Known — `TextAreaField`, minimum 2 rows
- Tool Proficiencies — `TextAreaField`, minimum 2 rows
- Other Proficiencies — `TextAreaField`, minimum 2 rows

**Right column:**
The four character pillars — each in its own mini `SheetSectionCard` (no corner flourishes — they are inside the step card, so this would nest cards inappropriately. Use a bordered `div` instead: `border border-[--border-subtle] rounded-md p-3` with the section header style):
- Personality Traits — `TextAreaField`, minimum 3 rows
- Ideals — `TextAreaField`, minimum 2 rows
- Bonds — `TextAreaField`, minimum 2 rows
- Flaws — `TextAreaField`, minimum 2 rows

The right column four-pillars layout uses `grid grid-cols-1 gap-3`.

**Interactions:** No rolls. AutoRollButton hidden on this step.

---

### Step 10 — Notes

**Visual tone:** Open, free. A blank page for the character's story.

**Flavour quote:** *"The greatest tales are those still unwritten."*

**Layout:**
Single column, five `TextAreaField` components stacked with `gap-4`:
1. Character Backstory — minimum 6 rows (generous — backstory is often long)
2. Allies & Organizations — minimum 3 rows
3. Additional Features & Traits — minimum 4 rows
4. Treasure — minimum 3 rows
5. Miscellaneous Notes — minimum 3 rows

Each field uses a small thematic icon next to its label (`--dnd-ornament-color`, 12px):
- Backstory: scroll icon
- Allies: shield icon
- Features: star icon
- Treasure: coin/chest icon
- Notes: quill icon

**Interactions:** No rolls. AutoRollButton is hidden on the notes step.

---

## 3. Full Sheet Layout

### 3.1 Desktop Layout (≥1024px)

A two-column layout: a narrower **left sidebar** (approximately 280px / 25% width) and a wider **main content area** (remaining width). Both columns are independently scrollable within a fixed-height viewport (`height: 100vh; overflow: hidden` on the sheet root, then `overflow-y: auto` on each column).

The **class/level banner** spans full width above both columns.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [CLASS ICON]  CHARACTER NAME — Paladin (Oath of Devotion) · Level 8        │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────┐  ┌───────────────────────────────────────────────────────┐
│  SIDEBAR         │  │  MAIN CONTENT                                         │
│  ─────────────── │  │  ─────────────────────────────────────────────────── │
│  Identity        │  │  Ability Scores                                       │
│  Combat          │  │  Skills                                               │
│  ─────────────── │  │  Spellcasting                                         │
│  [ornamental]    │  │  Equipment                                            │
│  ─────────────── │  │  Background & Features                                │
│  Skills sidebar  │  │  Notes                                                │
│  (saving throws  │  └───────────────────────────────────────────────────── ┘
│   only)          │
└──────────────────┘
```

**Sidebar sections (left column, top to bottom):**
1. Identity (`SheetSectionCard`) — character name (large, Cinzel), player name, class, subclass, species, background, level, XP, proficiency bonus
2. Combat (`SheetSectionCard`) — AC, initiative, speed, max HP, hit dice, death saves
3. Ornamental divider
4. Saving Throws (`SheetSectionCard`, collapsible) — all six saving throw rows

**Main content sections (right column, top to bottom):**
1. Ability Scores (`SheetSectionCard`) — the 2×3 grid of ability score stat blocks (score + modifier, as in the wizard step)
2. Ornamental divider
3. Skills (`SheetSectionCard`, collapsible by default — collapsed) — all 18 skill rows in a single-column list
4. Ornamental divider
5. Spellcasting (`SheetSectionCard`, collapsible) — spell slots, cantrips, spell lists. Collapsed by default if the class is a non-spellcaster.
6. Ornamental divider
7. Equipment (`SheetSectionCard`, collapsible) — weapons, armour, currency, gear
8. Ornamental divider
9. Background & Features (`SheetSectionCard`, collapsible)
10. Notes (`SheetSectionCard`, collapsible)

### 3.2 Mobile / Tablet Layout (< 1024px)

Single column. Column order collapses to:
1. Class/Level Banner (responsive — smaller text, smaller icon)
2. Identity card
3. Ability Scores card
4. Combat card
5. Saving Throws card (collapsible)
6. Skills card (collapsible)
7. Spellcasting card (collapsible)
8. Equipment card (collapsible)
9. Background & Features card (collapsible)
10. Notes card (collapsible)

Corner flourishes are hidden below 768px (they clip awkwardly on narrow cards).

### 3.3 Class/Level Banner

The banner occupies the full width of the sheet view, above the two-column content area. Height: approximately 72px on desktop, 56px on mobile.

**Contents (left to right):**
- Class icon SVG (32×32px, `--accent` stroke), `ml-6`
- Character name in Cinzel `text-xl font-bold text-[--text-primary]`, `ml-4`
- Separator: a thin vertical rule `w-px h-6 bg-[--dnd-ornament-color] mx-4`
- Class + subclass in Cinzel `text-base text-[--accent]`
- Separator
- Species in Cinzel `text-sm text-[--text-muted]`
- Separator
- "Level N" in Cinzel `text-sm text-[--text-muted]`
- Right-aligned: Proficiency Bonus badge — `+2` in a small rounded pill `bg-[--accent-muted] text-[--accent] text-xs font-mono px-2 py-0.5 rounded-full`

**Background:** `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-raised) 100%)`. Top and bottom borders: `1px solid var(--dnd-ornament-color)`.

**Print behaviour:** Banner prints in full (it is the sheet's primary identifying header).

### 3.4 Print Layout

Apply `@media print` rules:
- Hide: AutoRollButton, SheetStepper, DiceRoller icons, collapse/expand chevrons, the banner's class icon (or keep — it prints in gold if the printer supports it, which is fine).
- Expand all collapsible `SheetSectionCard` sections.
- Remove the sheet watermark (the full-page SVG watermark is `display: none` in print).
- Remove card corner flourishes.
- Print background: the card backgrounds should print with `--bg-surface` preserved (apply `print-color-adjust: exact` to `SheetSectionCard`). The deep navy cards on paper will be very dark — consider an alternative for the print stylesheet: if the system is printing, apply a `@media print { .theme-dnd5e .sheet-card { background: #f5f0e8 !important; border-color: #8b6914 !important; color: #1a1a1f !important; } }` rule so the sheet prints as parchment-on-dark-border. Section header left bars remain gold.
- The ornamental dividers and header parchment tints print in colour.
- Two-column layout is preserved in print — it naturally fits A4/Letter landscape, or the developer may force single-column for portrait print. The `@page` directive from the global stylesheet uses A4 portrait — for D&D's stat-dense layout, the developer should consider overriding this to landscape for the full sheet view print.

---

## 4. Stitch Design Prompt

Design two screens for a D&D 5e digital character sheet application. The app uses a dark fantasy aesthetic — deep navy backgrounds (#0f1520 base, #1a2340 surface), warm gold accents (#c9a84c), and parchment-toned text (#e8dcc8). Use Cinzel as the heading serif font for all section titles, character names, and the class banner. Use a clean sans-serif (Inter) for stats and body text.

**Screen 1 — Full Character Sheet View:**
Show a two-column layout: a narrower left sidebar (~280px) and a wider right main panel. At the very top, spanning both columns, place a full-width class/level banner with a dark navy gradient background, a thin gold top and bottom border, a small sword-icon SVG on the left in gold, and the character name "Eryndra Steelwhisper" in large Cinzel serif, followed by "Paladin · Oath of Devotion · Level 8" in smaller Cinzel in gold. Right-aligned in the banner: a small gold pill badge showing "+3 PROF".

Sidebar (left): Three `SheetSectionCard` panels stacked vertically, each with a deep navy background (#1a2340), a gold left accent bar on the section header, a gold ornamental 1px divider below the header, and very subtle corner flourishes (small SVG scroll-terminals in gold at 25% opacity). Cards have slight rounded corners. First card: Identity — show Character Name large in parchment white, below it Player Name, Class, Species, Background, Level, and XP in compact label+value pairs with muted gold labels. Second card: Combat — a 3-column stat grid showing AC (large number, shield icon), Initiative (+3), Speed (30 ft.), below that Max HP prominently (65), Hit Dice (3d10+2d8), and a Death Saves section with two rows of three small checkboxes each (labelled Successes and Failures). Third card (collapsible): Saving Throws — six rows, each with a small checkbox, an ability abbreviation, and a signed modifier value.

Main panel (right): Four `SheetSectionCard` panels. First: Ability Scores — a 2×3 grid of large stat blocks. Each stat block shows the score in very large monospace (e.g., 18), and directly below it the modifier in smaller text in parentheses (+4). A small d20 SVG icon in gold appears to the right of each score for re-rolling in play. Second (collapsible, shown collapsed): Skills — collapsed to just its header bar with a chevron. Third (expanded): Spellcasting — header row with four compact stat blocks (Spellcasting Class, Ability, Spell Save DC "16", Spell Attack Bonus "+8"), below that a Spell Slots row with nine labelled compact number boxes (1st through 9th) framed by a thin gold border, then three textarea areas for Cantrips, 1st-Level Spells, and 2nd-Level Spells. Fourth (shown partially): Equipment — currency row with five coin-denomination fields, then three weapon slot rows in a compact grid.

Behind the main panel (not the sidebar), place a very faint heraldic dragon SVG watermark at 2–3% opacity, centred vertically.

Between each major section pair in the right column, show a thin ornamental divider: a horizontal gold line with a small diamond lozenge centred on it.

Overall: the UI should feel like a fantasy game tool, not a paper form. Dark, immersive, gold accents, parchment text, subtle flourishes — but still readable and modern in its layout clarity.

**Screen 2 — Creation Wizard, Ability Scores Step:**
Show the creation wizard step for Ability Scores. At the top: a horizontal step progress bar with 10 nodes; nodes 1–3 filled/completed with a gold checkmark background, node 4 (Ability Scores) is the current step with a gold border and pulsing ring, nodes 5–10 are grey upcoming. Below the stepper: a full-width "Auto-Roll Character" button in solid gold with a d20 SVG icon on the left and white bold text.

The main content card (dark navy background, rounded corners, subtle corner flourishes) shows the step title "ABILITY SCORES" in Cinzel serif with a gold left bar, a thin ornamental gold divider below the title, and italic muted text "The gods have allotted you your gifts." Below that, a three-option segmented toggle: "Standard Array | Point Buy | Roll" — with "Roll" selected (gold background, white text).

Below the toggle: a 2×3 grid of six ability score stat blocks. Each block is a raised dark card. Show the blocks populated with rolled values: STR 16 (+3), DEX 12 (+1), CON 15 (+2), INT 8 (-1), WIS 13 (+1), CHA 10 (+0). Each block shows the score very large, the modifier smaller below it in parentheses, the ability label small and muted above, and a d20 gold icon to the right of the score for re-rolling. The STR block shows a gold flash highlight (brief warm glow) indicating it was just rolled. At the bottom right of the grid: a small read-only stat block showing "PROFICIENCY BONUS +3".

---

## 5. Component Overrides

### DiceRoller

The `dieType` in the D&D 5e schema `theme` block is set to `"d20"`. This confirms that the DiceRoller component should render the d20 SVG variant (icosahedron flat-front pentagon with triangular facets) throughout the D&D 5e sheet. No new behaviour is needed — the schema-driven `dieType` lookup handles this.

The d20 icon stroke colour is `--accent` (`#c9a84c`) — warm gold. This is consistent with the shared spec (stroke = `--accent`), and the gold accent value is set by the theme override.

### StatField — D&D Modifier Display

The D&D 5e ability score layout extends the base `StatField` with a second display row for the ability modifier. The standard `StatField` shows only one value. For D&D ability score fields specifically, a **wrapper variant** should be used — the developer should implement a `DndAbilityScoreField` component (or a `variant="dnd-ability"` prop on `StatField`) that renders:

```
┌─────────────────────────────────┐
│ STRENGTH                [d20]   │
│ ─────────────────────────────── │
│        16                       │   ← text-3xl font-mono --text-primary
│       (+3)                      │   ← text-sm font-mono --text-muted
└─────────────────────────────────┘
```

- The modifier is a **calculated display element**, not a separate `StatField` — it is rendered as a child of the same card, reactively computed from the score value: `Math.floor((score - 10) / 2)`.
- Formatted as `(+N)` or `(-N)` or `(+0)` — always with an explicit sign, always in parentheses.
- The modifier is in `--text-muted`, slightly smaller than the score, centred below it.
- The `dice-settled` flash on re-roll applies to both the score and modifier elements simultaneously.

For **saving throw totals** and **skill totals** shown in rows (not as score blocks), the display is simplified: just the signed total in `font-mono text-sm`, no parentheses.

### DropdownField — Class and Species

The Class and Species dropdowns should show a small icon emblem if possible. Implementation:

- **Class dropdown:** Each option row in the open panel includes a small SVG icon (16px, `--text-muted`) to the left of the option label text. The icon is determined by the class archetype group (same lookup as the class/level banner — sword for martial classes, star for arcane, symbol for divine). The closed trigger button also shows this icon to the left of the selected class name.
- **Species dropdown:** Each option row shows a small circular badge (16px diameter, `--bg-surface-raised` background, `--border-subtle` border) to the left of the option label. The badge contains a single character or a simple glyph representing the species (e.g., elf: a stylised leaf; dwarf: a mountain; human: a person silhouette). These are very simple SVG glyphs, not detailed illustrations.
- If implementing these icons is deemed too complex for the initial build, fall back to the standard `DropdownField` without icons. The icon system is a progressive enhancement, not a requirement.

### Spell Slots Grid

The 9-slot spell slot row (`spellSlots1` through `spellSlots9`) is not a standard field type. It requires a custom layout component: `DndSpellSlotsGrid`.

Specification:
- Renders as a `div` with `grid grid-cols-9 gap-1` for the nine slots.
- Row 1 (labels): nine `span` elements — "1st", "2nd", ... "9th" — `text-xs text-center text-[--text-muted]`.
- Row 2 (inputs): nine compact `TextInputField`-derived inputs. Each: `w-full text-center font-mono text-sm px-0 py-1 bg-[--bg-surface-raised] border border-[--border-subtle] rounded-sm`. Minimum width: none — the grid constrains width naturally.
- The entire grid is wrapped in a `div` with `border border-[--accent] rounded-md p-2` at `opacity-30` (so the gold border is subtle). Or implement as `ring-1 ring-[--accent]/30 rounded-md p-2`.
- Empty/inactive slots (levels the character hasn't reached) show a dash placeholder and accept input (for multiclassing and future levels).

### Death Save Checkboxes

The six death save checkboxes (3 successes, 3 failures) require a `variant` prop override on `CheckboxField`:

- `variant="success"`: checked fill colour is `--success` (#5a9e6f) instead of `--accent`.
- `variant="danger"`: checked fill colour is `--danger` (#b84040) instead of `--accent`.
- The unchecked state is identical to standard `CheckboxField` — no special treatment.
- The hover state for these variants shows a preview of the variant colour at 50% opacity (same pattern as the standard unchecked hover, but using the variant colour).

### SheetSectionCard — D&D Variant

The standard `SheetSectionCard` should accept an optional `decorative="dnd"` flag (or be wrapped in a `theme-dnd5e` context check) that activates:

1. The parchment-tint header row background (`--dnd-parchment-bg`).
2. The ornamental gold divider below the header.
3. The `:before` texture overlay on the card body.
4. Corner flourishes (on Full Sheet View cards only — not wizard step cards).

The card header text uses Cinzel (`var(--dnd-serif-font)`) instead of the default sans uppercase. Since the shared spec uses `text-xs tracking-widest uppercase`, applying Cinzel at `text-xs` produces an elegant small-caps-like effect appropriate for the theme.

### Point-Buy Stepper (Ability Scores Step)

The Point Buy mode on the ability scores step requires a variant of `PointAllocField` adapted for D&D's non-linear cost system:

- The standard `PointAllocField` assumes a linear 1-point-per-step cost. D&D Point Buy has non-linear costs: 8–13 cost 1 per point, 14 costs 2 more (total 7 from 8), 15 costs 2 more (total 9 from 8).
- The component must track **pool cost spent**, not just points above base. Implement a `DndPointBuyField` component or a `costTable` prop on `PointAllocField` that accepts a lookup map: `{ 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }`.
- The `+` button is disabled when either: the score would exceed 15, or the pool would go below 0 after applying the cost delta.
- The pool tracker shows `Points remaining: N` where N is `27 - sum(cost[score])` for all six scores.
- Visually, use the same layout as `PointAllocField` (label, current value, −/+ buttons) — no max cap indicator needed (the 15 cap is enforced by the button disable logic).
