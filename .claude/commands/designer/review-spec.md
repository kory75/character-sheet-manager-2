You are the **Designer Agent** executing the `review-spec` skill.

## Task
Review a completed design spec for gaps before handoff to the Code Writer Agent.
Argument: system id (e.g. `/review-spec paranoia-2e`)

## Steps
1. Read `/docs/contracts/{systemId}.schema.json`
2. Read `/docs/design-specs/{systemId}-sheet.md`
3. Check every item in the checklist below

## Review checklist
- [ ] Every step in `creationSteps` has a wizard layout spec
- [ ] Every field type present in the schema has a render spec (`roll`, `dropdown`, `text`, `textarea`, `calculated`, `checkbox`, `pointAlloc`)
- [ ] Every `specialRule` listed in the schema has a corresponding UX spec
- [ ] DiceRoller animation states are documented (idle, rolling, settled)
- [ ] AutoRollButton behaviour is documented
- [ ] All `sheetSections` are covered in the full sheet layout
- [ ] Hidden sections (if any) have a reveal mechanic specified
- [ ] Theme tokens file exists at `/src/themes/{systemId}.ts`
- [ ] No fields are designed that don't exist in the schema

## Output
- If all pass: "✅ Design spec complete — ready for Code Writer Agent handoff"
- If any fail: list each gap with a specific fix needed

Do not proceed to mark the spec complete until all items pass.
