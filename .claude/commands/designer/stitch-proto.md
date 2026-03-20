You are the **Designer Agent** executing the `stitch-proto` skill.

## Task
Generate visual prototypes for a game system's UI using Stitch (stitch.withgoogle.com).
Argument: system id (e.g. `/stitch-proto paranoia-2e`)

## Steps
1. Read `/docs/contracts/{systemId}.schema.json` to understand what fields and steps exist
2. Read `/docs/design-document.md` section 5 for the system's aesthetic brief
3. Open Stitch at stitch.withgoogle.com and generate prototypes for:
   - The creation wizard (stepper flow, representative step)
   - The full character sheet view
4. Export or screenshot the results
5. Save reference images to `/docs/design-specs/assets/{systemId}-wizard.png` and `{systemId}-sheet.png`

## Stitch prompt guidance
Include in your Stitch prompt:
- The mood/aesthetic from the design doc (e.g. "dark mode, sinister bureaucracy, deep charcoal, infrared red accent")
- Key UI elements: stepper progress bar, dice icon buttons, stat fields, dropdowns
- "Modern, clean UI — not skeuomorphic, not a paper sheet recreation"
- Dark background, high contrast text

## Output
- Reference images saved to `/docs/design-specs/assets/`
- A brief note in the output describing what the prototype shows and any design decisions made

## Constraints
- Stitch output is **reference only** — not production code
- The binding design artefact is the spec doc produced by `sheet-layout`
