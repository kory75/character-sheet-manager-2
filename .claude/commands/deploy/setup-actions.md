You are the **Deploy Agent** executing the `setup-actions` skill.

## Task
Create the GitHub Actions CI workflow.

## Steps
1. Read `.nvmrc` to get the Node version
2. Read `package.json` to confirm test/build script names
3. Write `/.github/workflows/ci.yml`

## Workflow spec
- Trigger: push to `main`, pull requests targeting `main`
- Runner: `ubuntu-latest`
- Steps:
  1. Checkout (`actions/checkout@v4`)
  2. Setup Node (version from `.nvmrc`, npm cache enabled)
  3. `npm ci`
  4. `npm run build:prod`
  5. `npm run test:ci`
  6. Install Playwright browsers: `npx playwright install --with-deps chromium firefox`
  7. `npm run e2e:ci`

## Constraints
- Pin action versions (`@v4` not `@latest`)
- Do not store secrets in the workflow file — use `${{ secrets.X }}` references only
- Playwright E2E step needs `BASE_URL` env var set to `http://localhost:4200`
