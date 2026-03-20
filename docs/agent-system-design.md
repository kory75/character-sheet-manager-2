# RPG Character Sheet Generator — Agent System Design

**Version:** 0.3 (Planning)
**Date:** 2026-03-20
**Status:** Draft

---

## 1. Overview

The project is built by a team of four specialised AI agents, each owning a distinct domain. Agents execute discrete **skills** — focused, scoped tasks that produce a specific output. Claude Code (this session) acts as the **orchestrator**: directing agents, invoking skills, reviewing outputs, and resolving inter-agent conflicts.

```
┌──────────────────────────────────────────────────────────────────────┐
│                            ORCHESTRATOR                               │
│                       (Claude Code / human)                           │
└──────────┬─────────────────┬──────────────────┬───────────────────────┘
           │                 │                  │                │
           ▼                 ▼                  ▼                ▼
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────┐
│   Game Rule     │ │    Designer      │ │   Code Writer    │ │   Deploy Agent     │
│  Research Agent │ │     Agent        │ │      Agent       │ │                    │
│                 │ │                  │ │                  │ │  Skills:           │
│  Skills:        │ │  Skills:         │ │  Skills:         │ │  • init-repo       │
│  • research     │ │  • stitch-proto  │ │  • scaffold      │ │  • setup-actions   │
│  • port-legacy  │ │  • component-lib │ │  • implement-feat│ │  • setup-pages     │
│  • gen-schema   │ │  • sheet-layout  │ │  • implement-test│ │  • add-env         │
│  • validate     │ │  • theme-tokens  │ │  • impl-export   │ │  • deploy          │
│  • clarify      │ │  • review-spec   │ │  • verify-build  │ │  • verify-deploy   │
└─────────────────┘ └──────────────────┘ └──────────────────┘ └────────────────────┘
           │                 │                  │                │
           └─────────────────┴──────────────────┴────────────────┘
                                  Shared Contracts
                            /docs/contracts/*.schema.json
                            /docs/design-specs/*.md
```

---

## 2. Shared Contracts

Before any agent begins work on a new game system, the orchestrator defines a **shared contract** — the data shape all three agents agree on. This prevents the Code Writer from building against a schema the Research Agent hasn't finalised yet.

### 2.1 Character Schema Contract

**File:** `/docs/contracts/{system}.schema.json`
**Produced by:** Research Agent (`gen-schema` skill)
**Consumed by:** Designer Agent (knows what fields exist), Code Writer Agent (implements the model)

```json
{
  "systemId": "string",
  "systemName": "string",
  "version": "string",
  "creationSteps": [
    {
      "stepId": "string",
      "label": "string",
      "description": "string",
      "fields": [
        {
          "id": "string",
          "label": "string",
          "type": "roll | dropdown | text | textarea | calculated | checkbox | pointAlloc",
          "rollFormula": "string (e.g. 3d6, 4d6kh3)",
          "options": ["array — for dropdown type only"],
          "dependsOn": ["field ids this value derives from"],
          "derivation": "string (formula or named function from creation-rules.ts)",
          "notes": "string (rule clarifications or edge cases)"
        }
      ]
    }
  ],
  "sheetSections": [
    {
      "sectionId": "string",
      "label": "string",
      "fieldIds": ["references to fields defined above"]
    }
  ],
  "specialRules": ["array of named special mechanics (e.g. 'paranoia-two-page')"],
  "theme": {
    "accentColor": "hex string",
    "flavorClass": "string (tailwind theme extension name)"
  }
}
```

### 2.2 Design Spec Contract

**File:** `/docs/design-specs/{system}-sheet.md`
**Produced by:** Designer Agent (`sheet-layout` skill)
**Consumed by:** Code Writer Agent

Must include:
- Wizard step layout — field grouping, grid columns per step
- Full sheet layout — section order, grid structure
- Per-field render notes (e.g. "dice icon uses d6 SVG", "flash animation on roll")
- System theme token overrides
- Any system-unique UX rules (e.g. Paranoia two-page secret mechanic)
- Interaction states: idle, animating, settled (for dice fields)

---

## 3. Agent Definitions

---

### 3.1 Game Rule Research Agent

**Purpose:** Become the authoritative source of truth for RPG system rules as they relate to character creation. Produces machine-readable schemas, TypeScript rule logic, and human-readable summaries.

**Trigger:** Orchestrator assigns a game system task.

**Inputs:**
- Game system name and edition
- Scope constraints from orchestrator (e.g. "PHB races only, no supplements")
- Legacy code for reference when porting (not to copy blindly — extract rule logic only)

**Outputs:**
- `/docs/contracts/{system}.schema.json`
- `/docs/rules/{system}-summary.md`
- `/src/games/{system}/creation-rules.ts`
- `/src/games/{system}/data/*.ts` (static lookup data)

---

#### Skills

**`research`**
Research official rules for a game system from web sources, rulebook PDFs, or wikis. Produces `/docs/rules/{system}-summary.md` — a plain-English, step-by-step walkthrough of character creation including all options, dice formulae, and derived stat calculations. Ends with a `CLARIFICATIONS_NEEDED` section for anything ambiguous.

```
Invoke when: Starting work on a new game system with no prior schema.
Input:  system name + edition + scope constraints
Output: /docs/rules/{system}-summary.md
```

**`port-legacy`**
Extract rule logic from legacy code (jQuery/AngularJS) and document it cleanly. Identifies which mechanics are worth preserving (e.g. Paranoia's service group skill bonuses, two-page UX mechanic) versus which were implementation artefacts to discard. Produces annotated notes added to the rules summary.

```
Invoke when: A prior implementation exists and rules logic can be salvaged.
Input:  path or URL to legacy code + target system
Output: Annotated additions to /docs/rules/{system}-summary.md
```

**`gen-schema`**
Converts the rules summary into a validated `schema.json` following the shared contract format. Generates TypeScript types and derivation functions in `creation-rules.ts`. Generates static data files (race lists, class tables, equipment lists, etc.).

```
Invoke when: /docs/rules/{system}-summary.md exists and CLARIFICATIONS_NEEDED is resolved.
Input:  /docs/rules/{system}-summary.md + /docs/contracts/TEMPLATE.schema.json
Output: /docs/contracts/{system}.schema.json
        /src/games/{system}/creation-rules.ts
        /src/games/{system}/data/*.ts
```

**`validate`**
Validates a schema against the contract template. Checks: all field type values are in the allowed enum, all `dependsOn` references resolve to real field IDs, all `derivation` references map to a function in `creation-rules.ts`, no orphaned fields. Produces a validation report.

```
Invoke when: After gen-schema, before handing off to Designer Agent.
Input:  /docs/contracts/{system}.schema.json
Output: Validation report (pass or list of issues)
```

**`clarify`**
Resolves specific ambiguous rules flagged in the CLARIFICATIONS_NEEDED section. Asks the orchestrator targeted questions, incorporates answers into the rules summary, then re-runs `gen-schema` for affected fields.

```
Invoke when: CLARIFICATIONS_NEEDED section is non-empty after research.
Input:  list of open questions
Output: Updated /docs/rules/{system}-summary.md
```

---

**Agent Constraints:**
- Must not invent rules. If unsure, flag via `clarify`.
- Must not write UI code.
- Legacy code is a rule reference only — do not carry forward its structure or naming conventions.

**Example Prompt Template:**
```
You are the Game Rule Research Agent for an RPG character sheet generator.

Skill: [SKILL NAME]
System: [SYSTEM] [EDITION]
Scope: [e.g. "Core PHB only, no supplements"]

[Skill-specific inputs]

Output to: [file paths]

Design doc for context: /docs/design-document.md
Contract template: /docs/contracts/TEMPLATE.schema.json

Flag any ambiguous rules in a CLARIFICATIONS_NEEDED section rather than inventing answers.
```

---

### 3.2 Designer Agent

**Purpose:** Design the visual and interaction layer. Produces component specs and theme tokens that the Code Writer Agent implements. Uses Stitch as a rapid prototyping tool; the binding output is always the written spec doc.

**Trigger:** Orchestrator assigns a design task after a validated schema exists.

**Inputs:**
- `/docs/contracts/{system}.schema.json` (field inventory)
- `/docs/design-document.md` (design principles and token definitions)
- Stitch (stitch.withgoogle.com) for visual prototyping
- System aesthetic brief from orchestrator

**Outputs:**
- `/docs/design-specs/assets/` — Stitch screenshots / exported reference images
- `/docs/design-specs/shared-components.md` — shared component library spec
- `/docs/design-specs/{system}-sheet.md` — system sheet spec
- `/src/themes/{system}.ts` — Tailwind theme extension

---

#### Skills

**`stitch-proto`**
Uses Stitch to generate visual prototypes for a given layout (landing page, creation wizard, full sheet). Exports screenshots as reference artefacts. These are design inspiration — not production code.

```
Invoke when: Starting design for a new system or major layout.
Input:  aesthetic brief + field inventory from schema
Output: /docs/design-specs/assets/{system}-*.png (reference images)
```

**`component-lib`**
Defines the shared component library spec: dice roller (states: idle / rolling / settled), stat field, dropdown field, point allocation stepper, creation wizard stepper, sheet section card. Documents props, variants, and interaction states for each.

```
Invoke when: First-time setup, or when a new shared component is needed.
Input:  /docs/design-document.md
Output: /docs/design-specs/shared-components.md
```

**`sheet-layout`**
Produces the full design spec for a game system's creation wizard and sheet view. Specifies grid layout per wizard step, full sheet section order, field render rules (which SVG die, animation notes), system-unique UX rules.

```
Invoke when: Schema is validated and shared component lib spec exists.
Input:  /docs/contracts/{system}.schema.json
        /docs/design-specs/shared-components.md
        /docs/design-specs/assets/{system}-*.png (Stitch references)
Output: /docs/design-specs/{system}-sheet.md
```

**`theme-tokens`**
Produces Tailwind theme extension for a game system — accent colours, typography choices, any additional tokens beyond the shared defaults. Outputs a TypeScript config object.

```
Invoke when: After sheet-layout is drafted.
Input:  system aesthetic brief + /docs/design-document.md section 5.3
Output: /src/themes/{system}.ts
```

**`review-spec`**
Reviews a completed design spec for completeness against the schema. Verifies every field in the schema has a render spec, every wizard step has a layout, and all interaction states are defined. Produces a gap report.

```
Invoke when: sheet-layout and theme-tokens are complete, before handoff to Code Writer.
Input:  /docs/contracts/{system}.schema.json
        /docs/design-specs/{system}-sheet.md
Output: Gap report (pass or list of missing specs)
```

---

**Agent Constraints:**
- Must not write Angular, TypeScript, or HTML.
- Stitch output is reference only — the `.md` spec doc is the binding artefact.
- Must not design fields that aren't in the schema.
- Must reference shared design tokens; do not invent new token names.

**Example Prompt Template:**
```
You are the Designer Agent for an RPG character sheet generator.

Skill: [SKILL NAME]
System: [SYSTEM]
Aesthetic brief: [e.g. "Sinister bureaucracy. Deep charcoal, infrared red accent, monospace for codes."]

[Skill-specific inputs]

Output to: [file paths]

Design principles: /docs/design-document.md
Shared tokens: /docs/design-document.md section 5.3
Schema (field inventory): /docs/contracts/[system].schema.json

Dark mode is default. Modern, clean UI — flavour through accent and typography, not skeuomorphism.
Dice fields must show a clickable SVG dice icon with animation states documented.
```

---

### 3.3 Code Writer Agent

**Purpose:** Implement the Angular application from the contracts and design specs. Write production-quality, tested code. Never invent rules or design decisions — flag gaps and return to the orchestrator.

**Trigger:** Orchestrator assigns an implementation task after both schema and design spec are validated.

**Inputs:**
- `/docs/contracts/{system}.schema.json`
- `/docs/design-specs/{system}-sheet.md`
- `/docs/design-specs/shared-components.md`
- `/docs/design-document.md` (technical constraints)
- Existing codebase (always read before editing)

**Outputs:**
- Angular components, services, pipes in `/src/app/`
- Playwright E2E tests in `/e2e/`
- Jest unit tests alongside source files

---

#### Skills

**`scaffold`**
Sets up the Angular project or adds a new game system module structure. Runs `ng new` or `ng generate` as appropriate. Installs required dependencies. Configures Tailwind, Jest, and Playwright. Does not implement any game logic.

```
Invoke when: Starting a new project or adding a new game system folder.
Input:  /docs/design-document.md section 7 (tech stack)
Output: Angular project scaffold or /src/app/games/{system}/ skeleton
```

**`implement-feat`**
Implements a specific feature from the design spec: a component, service, or page. Reads all relevant files first. Follows the spec precisely — flags any spec gaps before writing, does not guess.

```
Invoke when: A specific component or feature needs implementing.
Input:  feature name + relevant schema fields + design spec section
Output: Implemented Angular standalone component(s) + unit tests
```

**`implement-tests`**
Writes Playwright E2E tests for a game system's full creation flow: complete the wizard, verify derived stats update, export to PDF, export to JSON, re-import JSON. Also covers auto-roll and individual field re-roll.

```
Invoke when: A game system's components are implemented.
Input:  /docs/contracts/{system}.schema.json (field list for assertions)
Output: /e2e/{system}/*.spec.ts
```

**`implement-export`**
Implements or updates the `ExportService`: PDF generation via jsPDF + html2canvas, JSON save, JSON load/import. Ensures the StorageService abstraction remains backend-agnostic (IndexedDB now, cloud-ready later).

```
Invoke when: First export implementation, or when export behaviour changes.
Input:  /docs/design-document.md section 6
Output: /src/app/core/export.service.ts
        /src/app/core/storage.service.ts
```

**`verify-build`**
Runs `ng build --configuration production`, `jest`, and `npx playwright test`. Reports any failures. Does not fix failures itself — reports them to the orchestrator with context.

```
Invoke when: After any significant implementation, before marking a task complete.
Input:  none (runs against current working directory)
Output: Build/test report (pass or failure log)
```

---

**Agent Constraints:**
- Angular 17+ standalone components only — no NgModules.
- Tailwind CSS only — no custom CSS unless a Tailwind utility genuinely cannot do it.
- Angular Signals for reactive state — not RxJS BehaviorSubjects.
- Never invent rules or design. Flag missing spec → return to orchestrator.
- Always read existing files before editing.
- `verify-build` must pass before a task is marked complete.

**Example Prompt Template:**
```
You are the Code Writer Agent for an RPG character sheet generator.

Skill: [SKILL NAME]
Task: [description]

Inputs:
- Schema: /docs/contracts/[system].schema.json
- Design spec: /docs/design-specs/[system]-sheet.md
- Tech constraints: /docs/design-document.md section 7

[Skill-specific instructions]

Output to: [file paths]

Do not invent rules or design decisions not in the inputs above.
Flag any spec gaps before writing code for them — do not guess.
Angular 17+ standalone components, Signals, Tailwind CSS only.
```

---

### 3.4 Deploy Agent

**Purpose:** Own everything between a passing build and a live URL. Creates and configures the GitHub repository, sets up CI/CD via GitHub Actions, enables GitHub Pages, and validates each deployment. Handles environment-specific configuration (base href, environment files). The Code Writer Agent never touches git remote or CI config — that is this agent's exclusive domain.

**Trigger:** Orchestrator assigns a deploy task. First invoked after the Angular scaffold exists; subsequently invoked whenever CI config, environment setup, or a manual deployment is needed.

**Inputs:**
- GitHub username / org name and desired repo name (from orchestrator)
- `/docs/design-document.md` section 7 (tech stack, deployment targets)
- Built Angular project (must pass `verify-build` first)
- Any secrets or environment variable names (values provided by human — agent only wires them up)

**Outputs:**
- New GitHub repository (initialised, with correct visibility)
- `/.github/workflows/` — GitHub Actions workflow files
- `/angular.json` updates (base href for Pages)
- `/src/environments/` — environment config files
- Deployment confirmation with live URL

---

#### Skills

**`init-repo`**
Creates a new GitHub repository using the GitHub CLI (`gh repo create`). Initialises with a `.gitignore` (Node), MIT licence, and a minimal `README.md`. Sets the default branch to `main`. Does not push any application code — that is the Code Writer's responsibility via normal git workflow.

```
Invoke when: Project is starting and no remote repo exists yet.
Input:  repo name + visibility (public/private) + GitHub username/org
Output: Remote repo created and confirmed via gh repo view
        README.md, .gitignore, LICENSE committed to main
```

**`setup-actions`**
Creates the GitHub Actions CI workflow at `/.github/workflows/ci.yml`. The workflow:
- Triggers on push to `main` and on pull requests
- Checks out the repo
- Sets up Node.js (version pinned to project's `.nvmrc` or `package.json` `engines` field)
- Runs `npm ci`
- Runs `ng build --configuration production`
- Runs `jest --ci`
- Runs `npx playwright install --with-deps && npx playwright test`
- Reports pass/fail status as a commit check

```
Invoke when: Repo exists and Angular scaffold is committed.
Input:  Node version + test commands from /docs/design-document.md section 7
Output: /.github/workflows/ci.yml
```

**`setup-pages`**
Adds a GitHub Actions deployment workflow at `/.github/workflows/deploy.yml`. The workflow:
- Triggers on push to `main` (after CI passes)
- Builds the Angular app with `--base-href` set to `/{repo-name}/`
- Deploys the `dist/` output to GitHub Pages using `peaceiris/actions-gh-pages`
- Configures repository Settings to serve Pages from the `gh-pages` branch

Also patches `angular.json` and `/src/environments/environment.prod.ts` with the correct base href and any production-specific values.

```
Invoke when: CI workflow is green and Pages deployment is desired.
Input:  repo name (for base href) + any prod environment values
Output: /.github/workflows/deploy.yml
        Updated angular.json baseHref
        Updated /src/environments/environment.prod.ts
```

**`add-env`**
Adds GitHub Actions secrets or environment variables to the repository via `gh secret set` or `gh variable set`. Used when the app needs runtime config injected at build time (e.g. a future Firebase project ID, analytics key, etc.). Never stores secret values in files — only wires up the reference names in workflow files.

```
Invoke when: A new secret or build-time variable needs to be available in CI/CD.
Input:  variable name + scope (secret or variable) + which workflow uses it
        Note: actual values are provided by the human — agent receives names only
Output: Workflow file updated with env reference
        Orchestrator prompted to set the actual value via gh secret set or GitHub UI
```

**`deploy`**
Triggers a manual deployment by pushing the current `main` branch and monitoring the GitHub Actions run to completion. Uses `gh run watch` to tail the deploy workflow. Reports the live URL on success.

```
Invoke when: A release is ready and a manual push/deploy is required.
Input:  confirmation from orchestrator that build is clean
Output: Deployment run monitored to completion
        Live GitHub Pages URL confirmed
```

**`verify-deploy`**
Runs a minimal Playwright smoke test against the live GitHub Pages URL to confirm the deployment is healthy. Checks: app loads without console errors, landing page renders, system selector is functional.

```
Invoke when: After a successful deploy, as final confirmation.
Input:  live GitHub Pages URL
Output: Smoke test pass/fail report
```

---

**Agent Constraints:**
- Never commits application source code — only CI/CD config, workflow files, and environment stubs.
- Never stores secret values in files or outputs — names only.
- Must confirm `verify-build` has passed before triggering a deployment.
- Base href must be set correctly for GitHub Pages subdirectory hosting — broken asset paths are the most common Pages deployment failure.
- Must use `gh` CLI (GitHub CLI) for all GitHub API operations — no manual `curl` to GitHub API.

**Example Prompt Template:**
```
You are the Deploy Agent for an RPG character sheet generator.

Skill: [SKILL NAME]
GitHub user/org: [USERNAME]
Repo name: [REPO NAME]

[Skill-specific inputs]

Output to: [file paths]

Tech constraints: /docs/design-document.md section 7
The app is a fully static Angular build — no server required.
GitHub Pages is the deployment target. Base href must be set to /[REPO NAME]/.
Never commit secret values. Use gh CLI for all GitHub operations.
```

---

## 4. Agent Collaboration Protocol

### 4.1 Sequencing

```
Phase 0 — One-time project setup (sequential):
  Deploy Agent:  init-repo      → GitHub repo exists, default branch main
  Code Writer:   scaffold       → Angular project committed to main
  Deploy Agent:  setup-actions  → CI runs on every push to main and PRs
  Deploy Agent:  setup-pages    → Pages deployment wired, base href set

Phase A — Per system, parallel once TEMPLATE.schema.json exists:
  Research Agent: research + port-legacy + gen-schema + validate → schema ready
  Designer Agent: component-lib → shared component spec ready (first time only)

Phase B — Sequential per system:
  B1: Designer Agent: stitch-proto + sheet-layout + theme-tokens + review-spec
      (requires schema from Phase A)
  B2: Code Writer: implement-feat (core services, first time only)
      Code Writer: implement-feat (game system components)
      Code Writer: implement-export (first time only)
      Code Writer: implement-tests
      Code Writer: verify-build → iterate if failures

Phase C — Release:
  Deploy Agent: deploy          → pushes main, monitors Actions run
  Deploy Agent: verify-deploy   → smoke test against live Pages URL

Phase D — Next system:
  Research Agent starts Phase A for next system while Code Writer finishes Phase B
  Repeat B → C for each system added
```

### 4.2 Handoff Checklist

**Research → Designer handoff (orchestrator verifies):**
- [ ] Schema validates against TEMPLATE (Research `validate` skill passed)
- [ ] All field types are valid enum values
- [ ] All `dependsOn` references resolve to real field IDs
- [ ] All `derivation` values map to a function in `creation-rules.ts`
- [ ] CLARIFICATIONS_NEEDED is empty

**Designer → Code Writer handoff (orchestrator verifies):**
- [ ] `review-spec` skill passed (no gap report issues)
- [ ] Every wizard step has a layout spec
- [ ] Every field type has a render spec
- [ ] All interaction states documented (idle, animating, settled)
- [ ] Theme tokens file exists at `/src/themes/{system}.ts`

**Code Writer → Deploy Agent handoff (orchestrator verifies):**
- [ ] `verify-build` skill passed (build + jest + playwright all green)
- [ ] No hardcoded localhost URLs or dev-only config in committed code
- [ ] `environment.prod.ts` contains correct production values
- [ ] All secrets are referenced by name only (no values in source)

### 4.3 Conflict Resolution

| Conflict | Authoritative agent |
|---|---|
| What the rule says | Research Agent |
| How it looks / where it sits | Designer Agent |
| How it's implemented | Code Writer Agent |
| Git, CI/CD, deployment config | Deploy Agent |
| Which rule to include in scope | Orchestrator |

Code Writer and Deploy Agent flag conflicts — neither resolves them unilaterally.

### 4.4 Iteration Loop

```
Code Writer flags gap in spec
  → Orchestrator identifies which agent owns it
    → Targeted skill invoked (e.g. Designer: review-spec → sheet-layout patch)
      → Code Writer resumes from flagged point
```

---

## 5. Repository Structure (Target)

```
/
├── docs/
│   ├── design-document.md
│   ├── agent-system-design.md
│   ├── contracts/
│   │   ├── TEMPLATE.schema.json
│   │   ├── paranoia.schema.json
│   │   └── dnd5e.schema.json
│   ├── rules/
│   │   ├── paranoia-summary.md
│   │   └── dnd5e-summary.md
│   └── design-specs/
│       ├── assets/                     ← Stitch reference images
│       ├── shared-components.md
│       ├── paranoia-sheet.md
│       └── dnd5e-sheet.md
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── game-registry.service.ts
│   │   │   ├── storage.service.ts      ← backend-agnostic adapter
│   │   │   └── export.service.ts
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── dice-roller/        ← SVG die + animation + roll logic
│   │   │       ├── stat-field/         ← roll field + dice button
│   │   │       ├── dropdown-field/
│   │   │       ├── point-alloc/        ← +/− stepper with pool
│   │   │       └── sheet-stepper/      ← creation wizard progress
│   │   ├── games/
│   │   │   ├── paranoia/
│   │   │   │   ├── creation-rules.ts
│   │   │   │   ├── data/
│   │   │   │   ├── wizard/
│   │   │   │   └── sheet/
│   │   │   └── dnd5e/
│   │   │       ├── creation-rules.ts
│   │   │       ├── data/
│   │   │       ├── wizard/
│   │   │       └── sheet/
│   │   ├── landing/
│   │   └── app.routes.ts
│   ├── themes/
│   │   ├── base.ts                     ← shared tokens
│   │   ├── paranoia.ts
│   │   └── dnd5e.ts
│   └── styles/
│       └── global.scss
├── e2e/
│   ├── paranoia/
│   └── dnd5e/
├── .github/
│   └── workflows/
│       ├── ci.yml                      ← build + test on push/PR (Deploy Agent)
│       └── deploy.yml                  ← build + publish to gh-pages (Deploy Agent)
└── public/
    └── assets/
        └── dice/                       ← d6, d20, d8... SVG files
```

---

## 6. Next Steps (Ordered)

**Phase 0 — Project setup**
1. ~~**Create `TEMPLATE.schema.json`**~~ ✅ Done
2. **Deploy Agent: `init-repo`** — create GitHub repo (`kory75/rpg-character-sheet-generator` or chosen name)
3. **Code Writer Agent: `scaffold`** — Angular 17 + Tailwind + Jest + Playwright; commit to main
4. **Deploy Agent: `setup-actions`** — CI workflow (build + test on every push)
5. **Deploy Agent: `setup-pages`** — Pages deployment workflow + base href config

**Phase A — Paranoia rules**
6. **Research Agent: `research` + `port-legacy`** — Paranoia 2nd Ed rules from web + extract logic from legacy repo
7. **Research Agent: `gen-schema` + `validate`** — produce and validate `paranoia.schema.json`

**Phase B — Paranoia design + implementation**
8. **Designer Agent: `component-lib`** — shared component spec (dice roller, stat field, stepper, point-alloc)
9. **Designer Agent: `stitch-proto` + `sheet-layout` + `theme-tokens` + `review-spec`** — Paranoia sheet design
10. **Code Writer Agent: `implement-feat`** — core services + Paranoia wizard + sheet
11. **Code Writer Agent: `implement-export` + `implement-tests` + `verify-build`**

**Phase C — First release**
12. **Deploy Agent: `deploy` + `verify-deploy`** — Paranoia live on GitHub Pages
13. **Orchestrator review** — end-to-end review of live Paranoia sheet

**Repeat Phase A → C for D&D 5e, then WFRP 4e**
