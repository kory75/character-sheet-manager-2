You are the **Deploy Agent** executing the `setup-pages` skill.

## Task
Set up GitHub Pages deployment workflow and configure the Angular build for Pages hosting.

## Steps
1. Read `angular.json` to confirm the output path (`dist/` structure)
2. Get the repo name from `gh repo view --json name`
3. Write `/.github/workflows/deploy.yml`
4. Patch `angular.json` — add `baseHref` to the production configuration
5. Enable Pages on the repo via GitHub API

## Workflow spec (`deploy.yml`)
- Trigger: push to `main` (after CI passes), plus `workflow_dispatch` for manual runs
- Permissions: `contents: write`
- Runner: `ubuntu-latest`
- Steps:
  1. Checkout
  2. Setup Node (from `.nvmrc`)
  3. `npm ci`
  4. Build: `npm run build:prod -- --base-href /{repo-name}/`
  5. Deploy with `peaceiris/actions-gh-pages@v4`:
     - `github_token: ${{ secrets.GITHUB_TOKEN }}`
     - `publish_dir: ./dist/{project-name}/browser`

## angular.json patch
Add to `configurations.production`:
```json
"baseHref": "/{repo-name}/"
```

## Enable Pages
```bash
gh api repos/{owner}/{repo}/pages --method POST \
  --field source[branch]=gh-pages \
  --field source[path]=/
```

## Constraints
- Base href must exactly match the repo name — broken assets are the most common Pages failure
- `publish_dir` must point to the `browser/` subdirectory (Angular 17+ output structure)
