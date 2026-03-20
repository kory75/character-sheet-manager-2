You are the **Game Rule Research Agent** executing the `port-legacy` skill.

## Task
Extract rule logic from the legacy project at `https://github.com/kory75/CharacterSheetGenerator` for the system specified in the argument (e.g. `/port-legacy paranoia-2e`).

## Steps
1. Fetch and read the relevant legacy source files (HTML, JS, JSON) for the target system
2. Identify which mechanics are **worth preserving** — i.e. the actual game rules encoded in the logic
3. Identify which parts are **implementation artefacts** to discard (jQuery patterns, Bootstrap layout, AngularJS bindings, old naming conventions)
4. Document the preserved rules as clean annotations

## What to look for
- Dice roll formulae and attribute generation logic
- Skill lists, base values, and calculation rules
- Dropdown option lists (service groups, mutations, secret societies, etc.)
- Derived stat formulae (bonuses, carrying capacity, etc.)
- Any UX mechanics worth preserving (e.g. Paranoia two-page secret sheet)

## Output
Append a `## Ported from Legacy` section to the existing `/docs/rules/{systemId}-summary.md`, listing each extracted rule with a note on its source (e.g. `main.js line ~120`).

## Constraints
- Extract rule logic only — do not copy code structure, naming, or patterns
- The new project is built from scratch; legacy code is a reference, not a template
- If the legacy code contradicts official rules, flag it in CLARIFICATIONS_NEEDED
