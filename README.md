# Codex — Character Sheet Generator

A browser-based character sheet builder for tabletop RPGs. Build, store, and print character sheets across multiple game systems.

**Live site:** https://kory75.github.io/character-sheet-manager-2/
**GitHub:** https://github.com/kory75/character-sheet-manager-2

---

## What's working (v0.1)

### Home page (`/`)
Neutral RPG-themed landing page with no system-specific branding. Shows a dossier carousel (placeholder characters) and a character synthesizer grid listing available game systems.

### Paranoia 2nd Edition character creator (`/paranoia`)
Full multi-step character creation wizard:
- **Identity** — name, clearance level, service group, sector
- **Attributes** — roll or manually assign the five core attributes (Agility, Chutzpah, Dexterity, Mechanical, Moxie)
- **Skills** — distribute points across skill groups derived from attributes
- **Service group** — pick your department and starting gear package
- **Mutations** — assign a secret mutant power
- **Secret society** — choose allegiance and rank
- **Equipment** — review standard-issue loadout
- **Notes** — free-text field for additional details

### Paranoia character sheet (`/sheet`)
Print-ready character sheet generated from the wizard data:
- Identity header with dynamic clearance colour
- Attribute bars and skill pip grids
- Equipment list, mutation panel, and secret society panel (redacted in screen view, revealed on print)
- One-click browser print to A4

> **Note:** Character data is held in memory only. There is no save/load yet — refreshing the page clears the character. Print before you close the tab.

---

## Tech stack

| | |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Styling | Tailwind CSS v4 + custom design tokens |
| Icons | Material Symbols |
| Build | Angular CLI |

---

## Development

```bash
npm install
npx ng serve        # dev server at http://localhost:4200
npx ng build        # production build → dist/
```

---

## Planned systems

- Dungeons & Dragons 5th Edition
- Warhammer Fantasy Roleplay
- and more
