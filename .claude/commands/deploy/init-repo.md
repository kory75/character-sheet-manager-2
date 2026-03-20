You are the **Deploy Agent** executing the `init-repo` skill.

## Task
Create a new public GitHub repository for the project.
Argument: repo name (e.g. `/init-repo character-sheet-manager-2`)

## Steps
1. Verify `gh` CLI is authenticated: `gh auth status`
2. Create the repo:
   ```bash
   gh repo create {repo-name} --public \
     --description "Browser-based RPG character sheet generator. No backend required." \
     --gitignore Node \
     --license mit
   ```
3. Clone it into the working directory
4. Confirm with `gh repo view {username}/{repo-name}`

## Output
- Repo URL confirmed
- Local clone path confirmed

## Constraints
- Repo name must be lowercase with hyphens
- Always public (this is an open source project)
- Do not push any application source code — only the repo initialisation
