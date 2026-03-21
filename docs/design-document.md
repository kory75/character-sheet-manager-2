# RPG Character Sheet Generator — Design Document

**Version:** 0.3
**Date:** 2026-03-21
**Status:** In Progress

---

## 1. Vision

A browser-based, fully client-side RPG character sheet generator supporting multiple tabletop systems. Players walk through guided character creation step-by-step — rolling dice interactively or auto-generating a full character — fill in narrative details, and export or use the sheet online. No server required; everything runs in the browser.

The design is **modern and clean first**, with thematic flavour applied as an accent layer. Avoid skeuomorphism or recreating the look of physical paper sheets — this is a digital product that happens to serve tabletop players, not a scanned form.

---

## 2. Supported Game Systems (Roadmap)

| Priority | System | Edition | Status | Notes |
|---|---|---|---|---|
| Phase 1 | **Paranoia** | 2nd Edition | ✅ Complete | Wizard + sheet + print working |
| Phase 2 | **D&D** | 5e (2024 PHB) | 🚧 Experimental | Wizard + sheet built; rules enforcement incomplete — see section 9 |
| Phase 3 | **Warhammer Fantasy** | WFRP 4e | ⏳ Not started | Mechanically complex; good stress test for the platform |
| Future | Call of Cthulhu | 7e | ⏳ Not started | — |

> **Note on legacy code:** Two previous implementations exist at `kory75/CharacterSheetGenerator` and `kory75/character-sheet-manager`. These are available for **rule logic reference only** — particularly the Paranoia 2nd Ed attribute list, skill system, service group mechanics, and the two-page secret-info UX pattern. Do not carry forward their visual design, code structure, or UX patterns wholesale. The new project is built from scratch.

---

## 3. Core User Flows

### 3.1 New Character Creation

```
Landing Page
  → Select Game System
    → Character Creation Wizard (step-by-step)
      → Each step: Roll manually (click dice icon) OR fill dropdown / text
      → OR: "Auto-Roll Entire Character" button at any point
    → Review Sheet — all stats calculated and displayed
    → Narrative fields: name, description, appearance (free text)
  → Save to browser / Download PDF / Download JSON
```

### 3.2 Load Existing Character

```
Landing Page (character list from IndexedDB)
  → Open saved character → Full Sheet View (editable)
  → OR: Import from JSON file
  → Modify / re-roll individual stats / re-export
```

### 3.3 Online Sheet Use

```
Full Sheet View (active session)
  → All fields visible and editable
  → Dice roll buttons available for re-rolls and skill checks
  → Derived stats recalculate live on any change
  → Changes auto-saved to IndexedDB
```

---

## 4. Interaction Design

### 4.1 Dice Rolling UX

Every rollable field has an **inline dice icon button** next to its value. Clicking it:
1. Plays a brief dice roll animation (CSS keyframe, ~400ms)
2. Fills the field with the result
3. Triggers live recalculation of all dependent fields

**"Auto-Roll Full Character"** button (prominent, top of wizard):
- Rolls all rollable fields in rapid sequence
- Animated cascade: fields fill in one after another with a staggered delay
- Each individual field can still be re-rolled afterwards

**Design goal:** Rolling feels satisfying — not just a number appearing, but a small moment of anticipation. Keep it snappy, not slow.

### 4.2 Field Types

| Type | Example | Behaviour |
|---|---|---|
| `roll` | Strength, HP | Number display + dice icon; animated on roll |
| `dropdown` | Race, Class, Service Group | Styled select with game-appropriate options |
| `text` | Name, Appearance | Clean input, minimal chrome |
| `textarea` | Backstory | Autoresizing textarea |
| `calculated` | Modifier, Carrying Capacity | Read-only display, updates reactively |
| `checkbox` | Proficiencies, Mutations | Grid of toggles, compact |
| `pointAlloc` | Skill points | +/− stepper with remaining pool counter |

### 4.3 Views Per Game System

Each system has two distinct views:

1. **Creation Wizard** — focused stepper, one logical section at a time, progress indicator at top
2. **Full Sheet View** — all sections visible simultaneously, print-ready layout

**Paranoia special case:** The Full Sheet has two tabs/pages — public info (visible to GM and party) and secret info (mutations, secret society — hidden by default). This is a core mechanic of the game, not just a layout choice.

---

## 5. Visual Design Direction

### 5.1 Design Principles

- **Modern first** — the primary aesthetic is a clean, contemporary dark-mode UI (think: design tool or developer dashboard)
- **Flavour as accent** — game-specific character comes from typography choices, accent colours, iconography, and subtle texture/motif — not from recreating physical sheets
- **Readable above all** — stat-dense layouts must remain scannable; generous spacing, clear hierarchy
- **Dark mode default** — light mode toggle available but dark is the primary experience
- **Responsive** — tablet and desktop supported; mobile is secondary but not broken
- **Print-friendly** — `@media print` CSS ensures a clean hard-copy fallback

### 5.2 Per-System Themes

| System | Base Mood | Primary Palette | Accent | Type Character |
|---|---|---|---|---|
| **Paranoia** | Sinister bureaucracy | Deep charcoal, near-black | Infrared red → UV violet gradient | Mono/terminal for codes and stats; clean sans for body |
| **D&D 5e** | Epic high fantasy | Dark slate, deep navy | Warm gold | Elegant serif for headers; clean sans for stats |
| **WFRP 4e** | Grim, grimy realism | Dark warm brown, near-black | Tarnished brass, amber | Slightly condensed sans; no decorative flourishes |

**Principle:** The theme should feel like the game without cosplaying as its rulebook.

### 5.3 Shared Design Tokens (Tailwind config extension)

```
--bg-base          Dark base background (default: charcoal #1a1a1f)
--bg-surface       Card / panel background (slightly lighter)
--bg-surface-raised Hover states, tooltips
--border-subtle    Low-contrast borders
--border-default   Standard borders
--text-primary     High contrast body text
--text-muted       Labels, placeholders
--text-disabled    Inactive states
--accent           Primary interactive colour (overridden per system)
--accent-muted     Subtle accent (backgrounds, badges)
--success          Confirmation states
--danger           Damage, errors, critical states
--dice-flash       Brief highlight on a freshly rolled field
```

### 5.4 Dice Visual

The dice icon should be a clean SVG (not emoji). Per-system styling: Paranoia uses a d6 (appropriate to the system), D&D uses a d20. Icon is part of the shared component library but can swap per system.

### 5.5 Design Artefacts (produced by Designer Agent via Stitch)

- Landing page / system selector
- Creation wizard stepper (shared component)
- Full sheet layout — Paranoia
- Full sheet layout — D&D 5e
- Dice roll interaction states (idle / animating / settled)
- Dark + light mode token set
- Component library reference sheet

---

## 6. Export & Persistence

### 6.1 Export Options

| Format | Method | Notes |
|---|---|---|
| PDF | `jsPDF` + `html2canvas` | Captures the Full Sheet View |
| JSON | Browser File API | Full character data; re-importable |
| Print | `@media print` CSS | Always-available fallback |

### 6.2 Local Persistence

- **IndexedDB** via `localForage` — multiple characters stored per browser profile
- Landing page shows saved characters with system icon, name, last-modified
- **No cloud sync in Phase 1** — JSON export/import is the sharing mechanism

> Architecture note: Cloud sync (Firebase) may be added later. The `StorageService` abstraction must not assume IndexedDB is the only backend — design for a swappable adapter.

---

## 7. Technical Stack

| Concern | Choice |
|---|---|
| Framework | Angular 17+ (standalone components) |
| Reactivity | Angular Signals |
| Styling | Tailwind CSS |
| E2E testing | Playwright |
| Unit testing | Jest (replacing Karma) |
| PDF export | jsPDF + html2canvas |
| Storage | localForage (IndexedDB) |
| Deployment | Static — GitHub Pages / Firebase Hosting |

All game rules are encoded as TypeScript + JSON. No runtime API calls for rules data.

---

## 9. D&D 5e 2024 — Current Status (as of 2026-03-21)

### What is built

| Area | Status | Notes |
|---|---|---|
| Schema (`docs/contracts/dnd-5e-2024.schema.json`) | ✅ Done | 133 fields, all 10 steps defined |
| Creation rules (`src/app/games/dnd-5e-2024/creation-rules.ts`) | ✅ Done | Modifiers, proficiency, HP, spell DC, point buy, standard array |
| Draft service (`DndDraftService`) | ✅ Done | ~40 signals, computed derived stats, `finalise()` snapshot |
| All 10 wizard step components | ✅ Done | Identity, Species, Class, Ability Scores, Skills, Combat, Equipment, Spellcasting, Background, Notes |
| Wizard orchestrator (`DndCreationComponent`) | ✅ Done | Diamond step indicator, auto-roll animation, skip button, bottom nav |
| Auto-roll cascade | ✅ Done | Animated step-by-step: identity → species → class → ability scores (one-by-one) → skills (random pick) → steps 5–9 flash |
| Full sheet view (`DndSheetComponent`) | ✅ Done | Two-column layout, all sections, derived stats |
| Shell chrome (header + sidebar) | ✅ Done | Route-aware: D&D chrome shown for `/dnd*` routes |
| Print stylesheet | ✅ Done | Dark colours → dark ink, identity horizontal, combat/saves side-by-side, 3-col abilities |
| Skills step — expertise + bulk actions | ✅ Done | Three-state cycle (none/proficient/expert), Select All / Clear All |
| Home page experimental badge | ✅ Done | D&D card shows EXPERIMENTAL label |

### What is pending / incomplete

| Area | Priority | Notes |
|---|---|---|
| Skill & save proficiency limits | 🔴 Needs research | Limits depend on class + background — need PHB lookup before enforcing |
| Expertise slot limits | 🔴 Needs research | Class-dependent (Rogue, Bard, etc.) — do not guess |
| Auto-roll: steps 5–9 content | 🟡 Medium | Currently just navigates through; no data is filled for combat, equipment, spells, background, notes |
| Persistence (IndexedDB) | 🟡 Medium | Characters are lost on page refresh; `DndDraftService` is in-memory only |
| Sheet → wizard round-trip | 🟡 Medium | Cannot load a saved character back into the wizard for editing |
| PDF / print export button | 🟡 Medium | Print works via browser `Ctrl+P` but no in-app button |
| Class feature enforcement | 🔴 Low now | Subclass options, hit die, spell access not filtered by class yet |
| Step validation / required fields | 🟢 Low | CONTINUE button does not block on empty required fields |

---

## 8. Out of Scope (Phase 1)

- Cloud character sync
- Multiplayer / party management
- Campaign or session management
- Active-play resource tracking (spell slots, conditions) — creation focus only
- Mobile-first layout
- Supplemental content beyond core rulebook (no third-party subclasses, etc.)
