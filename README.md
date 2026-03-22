# Codex — Character Sheet Generator

A browser-based character sheet builder for tabletop RPGs. Build, store, and print character sheets across multiple game systems.

**Live site:** https://kory75.github.io/character-sheet-manager-2/
**GitHub:** https://github.com/kory75/character-sheet-manager-2

---

## What's working (v0.3)

### Home page (`/`)
Landing page with a live dossier carousel and a character synthesizer grid listing available game systems.

- Saved characters appear as dossier cards with system colour, name, and stat line
- Click a card to reopen the sheet; click the delete icon to remove it from storage
- Characters persist across page refreshes via `localStorage`

---

### Paranoia 2nd Edition (`/paranoia`) ✅

Full multi-step character creation wizard:
- **Identity** — name, clearance level, service group, sector
- **Attributes** — roll or manually assign the five core attributes (Agility, Chutzpah, Dexterity, Mechanical, Moxie)
- **Skills** — distribute points across skill groups derived from attributes
- **Service group** — pick your department and starting gear package
- **Mutations** — assign a secret mutant power
- **Secret society** — choose allegiance and rank
- **Equipment** — review standard-issue loadout
- **Notes** — free-text field for additional details

Character sheet (`/sheet`):
- Identity header with dynamic clearance colour
- Attribute bars and skill pip grids
- Equipment list, mutation panel, and secret society panel (redacted on screen, revealed on print)
- Print-ready A4 layout via browser print

Auto-roll sequence animates through all steps, filling each field in cascade.

---

### D&D 5th Edition 2024 (`/dnd`) 🚧 Experimental

Full 10-step character creation wizard with "The Relic Ledger" fantasy theme (deep navy + gold, Cinzel serif):
- **Identity** — character name, player name, level, background
- **Species** — choose from all 2024 PHB species
- **Class** — all 13 classes with subclass selection
- **Ability Scores** — Standard Array, Point Buy, or Roll (4d6 drop lowest), with animated per-stat dice rolls
- **Skills** — toggle proficiency or expertise (×2 proficiency bonus) per skill; saving throw proficiencies; Select All / Clear All shortcuts
- **Combat** — AC, speed, hit points, hit dice, death saves
- **Equipment** — currency, armour, weapons, gear
- **Spellcasting** — spell slots, cantrips, spells by level
- **Background** — personality traits, ideals, bonds, flaws, feat, languages, tool proficiencies
- **Notes** — backstory, allies, additional features, treasure

Character sheet (`/dnd-sheet`):
- Two-column layout — sidebar (identity, ability scores) + main (combat, skills, spells, equipment, background)
- All derived stats calculated live (modifiers, proficiency bonus, initiative, HP, spell save DC)
- Print-ready: dark gold → dark ink, identity section horizontal, combat and saving throws side-by-side

Auto-roll cascade animates through all 10 steps, rolling ability scores one-by-one.

Sheet includes an **Edit** button that returns to the wizard with all fields pre-populated from the saved character.

> **Experimental:** Skill and expertise slot limits are not yet enforced (pending rules research).

---

## Tech stack

| | |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Styling | Tailwind CSS v4 + custom design tokens |
| Icons | Material Symbols |
| Fonts | Cinzel (D&D), Inter (shared) |
| Build | Angular CLI |

---

## Development

```bash
npm install
npx ng serve        # dev server at http://localhost:4200
npx ng build        # production build → dist/
```

---

## Roadmap

| System | Status |
|---|---|
| Paranoia 2nd Edition | ✅ Complete |
| D&D 5e 2024 | 🚧 Experimental — wizard and sheet built, rules enforcement incomplete |
| Warhammer Fantasy Roleplay | ⏳ Planned |
| Call of Cthulhu 7e | ⏳ Planned |
