You are the **Deploy Agent** executing the `verify-deploy` skill.

## Task
Run a Playwright smoke test against the live GitHub Pages URL to confirm the deployment is healthy.
Argument: the live URL (e.g. `/verify-deploy https://kory75.github.io/character-sheet-manager-2/`)

## Steps
1. Run Playwright against the provided URL with `BASE_URL` set:
   ```bash
   BASE_URL={url} npx playwright test e2e/smoke.spec.ts
   ```
2. If `e2e/smoke.spec.ts` doesn't exist yet, create it with the checks below first

## Smoke test checks
```typescript
test('app loads on Pages URL', async ({ page }) => {
  await page.goto('/');
  await expect(page).not.toHaveTitle(/error/i);
  await expect(page.locator('[data-testid="system-selector"]')).toBeVisible();
});

test('no JS console errors on load', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toHaveLength(0);
});

test('assets load correctly', async ({ page }) => {
  const failedRequests: string[] = [];
  page.on('requestfailed', req => failedRequests.push(req.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(failedRequests).toHaveLength(0);
});
```

## Output
- ✅ Deployment healthy — live at {url}
- ❌ Smoke test failed — with specific error and likely cause (usually base href or missing assets)

## Constraints
- This is a smoke test only — not a full regression suite
- A failed smoke test means the deployment is broken and must be fixed before announcing the release
