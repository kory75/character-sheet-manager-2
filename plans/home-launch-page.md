# Plan: Home / Launch Page

## Context
The app currently lands directly on the Paranoia character creation wizard. The user wants a neutral, RPG-themed home page — no Paranoia influence, no sidebar. The home page sits outside the ShellComponent entirely (its own full-width layout). The shell (Paranoia sidebar + header) only wraps game-specific routes.

## Files to Change
| Action | File |
|---|---|
| CREATE | `src/app/pages/home/home.component.ts` |
| MODIFY | `src/app/app.routes.ts` |

Shell, draft service, print CSS, and sheet component are untouched. The Paranoia wizard's `router.navigate(['/sheet'])` still works because `/sheet` stays inside the shell group.

---

## 1 — Routing (`app.routes.ts`)

Home page is a **top-level route** with no shell wrapper. Shell wraps only the game routes:

```typescript
export const routes: Routes = [
  {
    // Home — standalone, no shell
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    // Game routes — wrapped in shell (Paranoia sidebar/header)
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'paranoia',
        loadComponent: () =>
          import('./pages/paranoia-creation/paranoia-creation.component')
            .then(m => m.ParanoiaCreationComponent),
      },
      {
        path: 'sheet',
        loadComponent: () =>
          import('./pages/paranoia-sheet/paranoia-sheet.component')
            .then(m => m.ParanoiaSheetComponent),
      },
    ],
  },
];
```

Two sibling route objects with the same `path: ''` parent — Angular matches the first `''` for the home page, and the second `''` (shell) matches its children by their own paths. This is a standard Angular pattern for multiple layout groups.

---

## 2 — HomeComponent structure

Single-file standalone component. Imports: `[RouterLink]`. **No shell dependency, no CharacterDraftService.**

### Critical: use inline hex colors throughout
The app's Tailwind theme has `primary-container: #c41e1e` (Paranoia red). The home design uses gold as its primary. Using token classes like `text-primary` would give red, not gold. **All home-specific colours use inline `style` attributes.**

Shared surface tokens that ARE safe to use: `bg-surface-container` (#1f1f24), `bg-surface-container-low` (#1b1b20), `bg-surface-container-high` (#2a292f), `text-on-surface` (#e4e1e8), `text-outline` (#99907b via Stitch / `#ab8884` in app — close enough).

### Data arrays (module-level constants)

**`DOSSIER_CARDS`**:
```typescript
interface DossierCard {
  system: string;
  systemColor: string;  // left-border + label colour
  name: string;
  statLine: string;
}
```
| system | systemColor | name | statLine |
|---|---|---|---|
| PARANOIA 2E | `#c41e1e` | REX-R-GHQ-1 | CLEARANCE: RED |
| D&D 5E | `#fa8840` | AELINDRA NIGHTVEIL | LEVEL 8 ELF ROGUE |
| PARANOIA 2E | `#c41e1e` | ZIP-O-CRL-3 | CLEARANCE: RED |
| D&D 5E | `#fa8840` | GORVIN ASHMANTLE | LEVEL 4 DWARF CLERIC |
| WARHAMMER FANTASY | `#99907b` | BROTHER VAREK | DWARF SLAYER · REGIMENT III |

**`SYNTHESIZER_CARDS`**:
```typescript
interface SynthesizerCard {
  system: string;
  edition: string;
  icon: string;
  flavour: string;
  accentColor: string;
  route: string | null;
}
```
| system | edition | icon | accentColor | route |
|---|---|---|---|---|
| PARANOIA | 2ND EDITION | `psychology` | `#c41e1e` | `'/paranoia'` |
| DUNGEONS & DRAGONS | 5TH EDITION | `auto_awesome` | `#fa8840` | null |
| WARHAMMER FANTASY | ROLEPLAY | `military_tech` | `#99907b` | null |

### Layout (closely follows Stitch code.html)

```
<header>  fixed, 52px, bg #1b1b20, gold bottom-border at 15% opacity
  ◆ CODEX wordmark (gold #ecc246)
  person_outline + settings icon buttons (muted)

<main class="pt-[52px]">
  <section> VAULT HERO
    Corner L-brackets (gold)
    Eyebrow "CHARACTER ARCHIVE // v1.0"
    h1: "THE" white + "CODEX" gold (#ecc246), text-7xl font-black
    Subtitle in muted colour
    Decorative rule: gradient lines + ◆

  <section> ACTIVE DOSSIERS
    Header row: folder_open + "ACTIVE DOSSIERS" + count + arrow buttons
    Scroll track: flex gap-6 overflow-x-auto no-scrollbar  #dossierTrack
      @for → dossier card (min-w-[300px] h-[180px] bg-surface-container)
        [style]="{ 'border-left': '3px solid ' + card.systemColor }"
        system label (card.systemColor) | character name | stat line | visibility icon
      Ghost "NEW DOSSIER" card (dashed border)

  <section> CHARACTER SYNTHESIZERS
    Header row: casino + "CHARACTER SYNTHESIZERS" + label (NO arrows — grid, not scroll)
    grid grid-cols-1 md:grid-cols-3 gap-8
      @for → synth card (bg-surface-container-low, border-top 3px solid accentColor)
        Corner L-bracket (accentColor)
        icon (accentColor, text-4xl)
        system name (large, white) + edition label (accentColor)
        flavour text (muted)
        @if route → <a routerLink> filled button (accentColor bg)
        @else → disabled ghost button "COMING SOON"

<footer> muted label row
```

### Scroll method (dossier carousel only)
```typescript
scroll(track: HTMLElement, dir: 'left' | 'right'): void {
  track.scrollBy({ left: dir === 'left' ? -316 : 316, behavior: 'smooth' });
}
```
316 = 300px card + 16px gap.

### styles.css addition
```css
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

---

## 3 — Verification

1. `npx ng build` — no errors
2. Navigate to `/` → home page, no sidebar, neutral header
3. Navigate to `/paranoia` → creation wizard with Paranoia shell
4. Complete wizard → `/sheet` (with shell) ✓
5. Click "CREATE CHARACTER" on Paranoia card → `/paranoia`
6. D&D and Warhammer → "COMING SOON"
7. Carousels scroll via arrows

## Status
**Implemented** — build clean as of 2026-03-21.
