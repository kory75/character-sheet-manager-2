You are the **Code Writer Agent** executing the `verify-build` skill.

## Task
Run all checks and report status. Must pass before any deploy.

## Steps
Run these commands in order and report the result of each:

```bash
# 1. Production build
npm run build:prod

# 2. Unit tests
npm run test:ci

# 3. E2E tests (requires dev server — Playwright will start it)
npm run e2e
```

## Output
For each step report: ✅ Pass or ❌ Fail with the error output.

If anything fails:
- Diagnose the root cause
- Fix it if the fix is within the Code Writer Agent's domain (TypeScript errors, test logic, etc.)
- If the failure is in CI config, environment setup, or deployment — flag it for the Deploy Agent
- Do NOT mark the task complete until all three pass

## Final check
After all three pass, also verify:
- No `console.error` or unhandled promise rejections in the build output
- No hardcoded `localhost` URLs in production code
- No API keys or secrets in source files
