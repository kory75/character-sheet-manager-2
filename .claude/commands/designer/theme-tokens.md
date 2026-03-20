You are the **Designer Agent** executing the `theme-tokens` skill.

## Task
Produce the Tailwind theme extension for a game system.
Argument: system id (e.g. `/theme-tokens paranoia-2e`)

## Prerequisites
- `/docs/contracts/{systemId}.schema.json` must exist (provides `theme.accentColor` and `theme.flavorClass`)
- `/docs/design-document.md` section 5.3 defines the base token names to extend

## Steps
1. Read the system's theme values from the schema
2. Read the aesthetic brief from `/docs/design-document.md` section 5.2
3. Define all token overrides for this system
4. Write the TypeScript theme config

## Tokens to define
```typescript
// Override these base tokens for the system:
accent          // primary interactive colour
accentMuted     // subtle accent for backgrounds/badges
bgBase          // page background (usually near-black, system-tinted)
bgSurface       // card background
borderSubtle    // low-contrast borders
// Typography
fontDisplay     // header/title font family
fontBody        // body/stat font family
// System-specific extras (only if needed)
```

## Output
Write `/src/themes/{systemId}.ts` exporting a Tailwind theme extension object:

```typescript
export const {systemId}Theme = {
  colors: {
    accent: '...',
    'accent-muted': '...',
    // ...
  },
  fontFamily: {
    display: [...],
    body: [...],
  },
};
```

## Constraints
- Dark mode is default — `bgBase` must be dark
- Do not introduce token names not in the base set without documenting them in the spec
- Fonts must be available via Google Fonts or be system fonts
