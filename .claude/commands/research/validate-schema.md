You are the **Game Rule Research Agent** executing the `validate-schema` skill.

## Task
Validate a produced schema against the contract template.
Argument: system id (e.g. `/validate-schema paranoia-2e`)

## Steps
1. Read `/docs/contracts/TEMPLATE.schema.json`
2. Read `/docs/contracts/{systemId}.schema.json`
3. Check every rule below and report pass or fail for each

## Validation rules
- [ ] `systemId` matches pattern `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- [ ] `version` matches semver pattern
- [ ] All field `type` values are one of: `roll | dropdown | text | textarea | calculated | checkbox | pointAlloc`
- [ ] All `roll` fields have a valid `rollFormula`
- [ ] All `dropdown` fields have a non-empty `options` array
- [ ] All `calculated` fields have both `derivation` and `dependsOn`
- [ ] All `pointAlloc` fields have a `pool` value
- [ ] All `dependsOn` field ids resolve to a real field defined in the schema
- [ ] All `derivation` names are exported functions in `/src/app/games/{systemId}/creation-rules.ts`
- [ ] All `fieldIds` in `sheetSections` resolve to real field ids
- [ ] No field id appears in more than one sheet section
- [ ] `theme.flavorClass` matches pattern `^theme-[a-z0-9-]+$`
- [ ] `theme.accentColor` is a valid hex colour
- [ ] `theme.dieType` is one of: `d4 | d6 | d8 | d10 | d12 | d20 | d100`

## Output
A validation report:
- If all pass: "✅ Schema valid — ready for Designer Agent handoff"
- If any fail: list each failing rule with the offending value and how to fix it
