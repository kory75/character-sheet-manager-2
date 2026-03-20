You are the **Designer Agent** executing the `component-lib` skill.

## Task
Define the shared component library spec — the system-agnostic building blocks used across all game sheets.

## Steps
1. Read `/docs/design-document.md` sections 4 and 5
2. For each component below, specify: layout, variants, props, and all interaction states

## Components to specify

### DiceRoller
- The SVG die icon (d6 for Paranoia, d20 for D&D, etc. — swappable per system)
- States: `idle` | `rolling` (animation) | `settled` (brief flash on new value)
- Size variants: `sm` (inline next to a field) | `lg` (standalone auto-roll button)
- Animation: ~400ms keyframe spin/shake, then settle. Snappy, not slow.

### StatField
- A rollable numeric field: label + value display + DiceRoller (sm)
- States: `empty` | `filled` | `rolling`
- The value flashes `--dice-flash` colour briefly on settle

### DropdownField
- A styled select input with label
- Must look consistent with StatField in terms of height and label placement
- Option descriptions shown as tooltip or subtitle

### TextAreaField
- Autoresizing textarea with label
- Used for backstory, appearance, notes

### PointAllocField
- Label + current value + −/+ buttons + remaining pool counter
- Pool counter turns `--danger` colour when pool is exhausted

### SheetStepper
- Horizontal progress bar showing all creation steps
- Current step highlighted with `--accent`
- Completed steps shown with a checkmark
- Step labels visible on desktop, icon-only on tablet

### SheetSectionCard
- Container card for a group of fields on the full sheet view
- Header with section label
- Subtle `--bg-surface` background, `--border-subtle` border

### AutoRollButton
- Prominent CTA button at the top of the wizard
- Label: "Auto-Roll Full Character"
- Triggers cascade animation across all StatFields on the current sheet

## Output
Write `/docs/design-specs/shared-components.md` with the full spec for every component above.
Include: layout description, Tailwind class guidance, interaction states, and any animation notes.

## Constraints
- Do not write Angular/TypeScript code
- Use the design token names from `/docs/design-document.md` section 5.3
