You are the **Designer Agent** executing the `sheet-layout` skill.

## Task
Produce the full design spec for a game system's creation wizard and sheet view.
Argument: system id (e.g. `/sheet-layout paranoia-2e`)

## Prerequisites
- `/docs/contracts/{systemId}.schema.json` must exist and be validated
- `/docs/design-specs/shared-components.md` must exist

## Steps
1. Read the schema to understand all steps and fields
2. Read the shared component library spec
3. Read the Stitch reference images in `/docs/design-specs/assets/` if available
4. Read the system aesthetic brief from `/docs/design-document.md` section 5.2
5. Design the wizard layout and full sheet layout, then write the spec

## Spec must include

### Creation Wizard Layout
For each step in `creationSteps`:
- Grid layout (e.g. "2-column grid, stat fields left, description right")
- Which component renders each field type
- Any grouping (use `group` field from schema)
- Position of the AutoRollButton (top of wizard, always visible)

### Full Sheet Layout
- Section order (matching `sheetSections` from schema)
- Grid structure for each section
- Any sections that are hidden by default (e.g. Paranoia secrets page)
- How the two views (wizard / full sheet) transition

### Per-Field Render Rules
- Which die SVG to use on StatFields
- Any fields that should NOT have a dice button (e.g. calculated fields)
- Any fields with special display (e.g. colour-coded clearance ranks in Paranoia)

### System-Unique UX Rules
Document any mechanics that require non-standard UI behaviour. Examples:
- Paranoia: second tab/page for secret info (mutations, secret society)
- D&D: point-buy vs standard array toggle on ability score step

### Interaction Notes
- Dice roll animation duration and style for this system
- How the auto-roll cascade looks (stagger delay between fields)

## Output
Write `/docs/design-specs/{systemId}-sheet.md`

## Constraints
- Only design fields that exist in the schema
- Do not write Angular/TypeScript code
- Reference shared component names from `shared-components.md` — do not reinvent them
