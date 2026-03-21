/**
 * D&D 5e (2024) — Theme Token Overrides
 *
 * Applied when the class `theme-dnd5e` is active on the root element.
 * All CSS custom properties listed in `cssVars` override the shared design
 * token defaults defined in the global stylesheet.
 *
 * Design intent: deep navy base with warm parchment text and gold accent.
 * The contrast relationship --bg-base → --text-primary (deep navy → warm
 * parchment white) must be preserved across all token changes.
 *
 * See: docs/design-specs/dnd-5e-2024-sheet.md for full design spec.
 */

export const dnd5eTheme = {

  // ── Identity ───────────────────────────────────────────────────────────────

  /** Matches systemId in dnd-5e-2024.schema.json */
  systemId: 'dnd-5e-2024',

  /** Human-readable name shown in the system selector */
  systemName: 'D&D 5e (2024)',

  // ── Dice ───────────────────────────────────────────────────────────────────

  /**
   * Die type rendered by the DiceRoller component.
   * 'd20' triggers the icosahedron SVG variant (flat-front pentagon with
   * triangular facets radiating outward, viewBox 0 0 24 24, stroke weight 1.5px).
   */
  dieType: 'd20' as const,

  // ── Tailwind / Angular flavour class ──────────────────────────────────────

  /**
   * CSS class applied to the sheet root element when this system is active.
   * All CSS custom property overrides in `cssVars` are scoped to this class.
   * Example selector: `.theme-dnd5e { --accent: #c9a84c; }`
   */
  flavorClass: 'theme-dnd5e',

  // ── Primary accent colours (convenience — also set in cssVars) ────────────

  /** Warm gold — primary interactive colour, dice icons, proficiency indicators */
  accentColor: '#c9a84c',

  /** Deep amber — muted backgrounds, badges, selected option highlights */
  accentColorMuted: '#8b6914',

  // ── CSS Custom Property Overrides ─────────────────────────────────────────

  /**
   * Applied as inline style or via a stylesheet rule scoped to `.theme-dnd5e`.
   * Keys are CSS custom property names; values are their overridden values.
   *
   * Shared tokens that are NOT listed here inherit their global defaults and
   * do not need to be set. Currently all shared tokens are explicitly set
   * to ensure no bleed from other themes.
   */
  cssVars: {

    // ── Background layers ──────────────────────────────────────────────────

    /** Near-black deep navy — page/app background */
    '--bg-base': '#0f1520',

    /** Deep navy — card / panel background */
    '--bg-surface': '#1a2340',

    /** Slightly lighter navy — hover states, open dropdowns, tooltips */
    '--bg-surface-raised': '#1f2d4f',

    // ── Borders ────────────────────────────────────────────────────────────

    /** Low-contrast navy — section separators, resting field outlines */
    '--border-subtle': '#2a3a5c',

    /** Mid-contrast navy — active/focused field borders, card edges */
    '--border-default': '#3d5080',

    // ── Accent ─────────────────────────────────────────────────────────────

    /** Warm gold — primary interactive colour */
    '--accent': '#c9a84c',

    /**
     * Parchment-tint background for selected states, badges, proficient skill rows.
     * rgba so it layers transparently over any surface colour.
     */
    '--accent-muted': 'rgba(201,168,76,0.15)',

    // ── Text ───────────────────────────────────────────────────────────────

    /**
     * Warm parchment white — all body text and stat values.
     * Intentionally warm (slight yellow) rather than pure white to
     * complement the gold accent without harsh contrast.
     */
    '--text-primary': '#e8dcc8',

    /** Muted parchment — labels, placeholders, section headers */
    '--text-muted': '#9a8f7a',

    /** Dim warm grey — inactive controls, calculated field indicators */
    '--text-disabled': '#5a5244',

    // ── Semantic ───────────────────────────────────────────────────────────

    /** Muted green — stabilised state, death save successes */
    '--success': '#5a9e6f',

    /** Muted red — death save failures, error states, damage indicators */
    '--danger': '#b84040',

    /**
     * Roll-settled field flash.
     * Same hue as --accent (gold) at 40% opacity so it reads as
     * "result landed here" without competing with interactive gold.
     */
    '--dice-flash': 'rgba(201,168,76,0.40)',

    // ── D&D-specific additions (not in the shared token set) ───────────────

    /**
     * Serif font stack for headings, section titles, the class/level banner,
     * and the character name input in the identity step.
     * Cinzel must be loaded via Google Fonts in index.html:
     *   https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap
     */
    '--dnd-serif-font': '"Cinzel", "Palatino Linotype", Georgia, serif',

    /**
     * Ornament colour — SVG flourishes, corner decorations, diamond dividers,
     * the ornamental rule below section card headers.
     * Gold at 25% opacity keeps decorations present but never competing
     * with actual content.
     */
    '--dnd-ornament-color': 'rgba(201,168,76,0.25)',

    /**
     * Section card header background tint.
     * Applied to the header row only (not the full card body) to create
     * a subtle parchment warmth on the label area.
     * Gold at 8% opacity — visible on deep navy without feeling coloured.
     */
    '--dnd-parchment-bg': 'rgba(201,168,76,0.08)',

    /**
     * Card body texture overlay.
     * Used as a radial gradient in a :before pseudo-element to suggest
     * aged material. Must stay at or below 4% opacity.
     * Applied via: background: radial-gradient(ellipse at top left,
     *   var(--dnd-parchment-dark) 0%, transparent 70%)
     */
    '--dnd-parchment-dark': 'rgba(201,168,76,0.04)',

  } as const,

} as const;

export type Dnd5eTheme = typeof dnd5eTheme;
