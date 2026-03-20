You are the **Code Writer Agent** executing the `implement-tests` skill.

## Task
Write Playwright E2E tests for a game system's full creation flow.
Argument: system id (e.g. `/implement-tests paranoia-2e`)

## Prerequisites
- The game system's wizard and sheet components must be implemented
- The dev server must be startable via `npm start`

## Test scenarios to cover

### 1. Full manual creation flow
- Navigate to the landing page
- Select the target game system
- Complete every creation step manually (fill text fields, select dropdowns, click dice icons for roll fields)
- Verify each step's derived stats recalculate correctly
- Reach the review/sheet view
- Verify all fields are populated

### 2. Auto-roll full character
- Navigate to creation wizard
- Click "Auto-Roll Full Character"
- Verify all rollable fields are filled
- Verify derived stats are calculated

### 3. Re-roll individual field
- After auto-roll, click a specific dice icon
- Verify that field changes and dependent calculated fields update

### 4. Export to JSON
- Complete a character
- Click "Download JSON"
- Verify file is downloaded (check filename pattern)

### 5. Import from JSON
- Navigate to landing page
- Click "Import Character"
- Upload a previously exported JSON file
- Verify character loads correctly on the sheet view

### 6. LocalStorage persistence
- Create and save a character
- Reload the page
- Verify the character appears in the saved characters list

## Output
Write test files to `/e2e/{systemId}/` using Playwright's `test` and `expect` API.

## Constraints
- Use `data-testid` attributes for selectors — never use CSS classes or text content as selectors
- If a `data-testid` is missing from a component, note it and the Code Writer must add it
