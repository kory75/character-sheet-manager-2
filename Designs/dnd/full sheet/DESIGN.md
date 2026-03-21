# Design System Document: The Relic Ledger

## 1. Overview & Creative North Star
**Creative North Star: The Artifact of Record**
This design system rejects the "form-filler" aesthetic of traditional digital tools. Instead, it positions the character sheet as a living, enchanted artifact—an illuminated manuscript forged in a digital space. We are moving away from the "software" look and toward an "editorial relic" experience. 

The system achieves this through **Immersive Intentionality**:
- **Rigid Geometry:** 0px border radii across the board create a feeling of forged metal and cut stone.
- **Atmospheric Depth:** Using deep navy shifts to create focus rather than structural lines.
- **Illuminated Accents:** Gold is used sparingly but with high impact, functioning as "light" within a dark, cold environment.

## 2. Colors & Atmospheric Layers
Our palette is rooted in the "Void and Gilt" philosophy. We use the depth of the navy to recede and the warmth of the gold to advance.

### Surface Hierarchy & The "No-Line" Rule
While the user request mentions thin gold borders, these are to be treated as **jewelry, not structure.** 
- **Rule:** Do not use 1px lines to separate sections of a layout. 
- **Execution:** Use background shifts. A `surface-container-low` (#161c27) section sitting on a `surface` (#0d131e) base provides all the definition a high-end interface needs. 
- **Nesting:** Treat the UI as stacked sheets of obsidian. Use `surface-container-highest` (#2f3541) for interactive elements like buttons or active inputs to bring them "closer" to the user.

### Glass & Soul
- **Glassmorphism:** For floating overlays (modals, spell details), use `surface-variant` (#2f3541) at 80% opacity with a `20px` backdrop-blur. This maintains the "magic" feel and keeps the character sheet visible beneath the UI.
- **The Signature Gradient:** Primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#e6c364) to `primary_container` (#c9a84c) at a 45-degree angle to simulate the sheen of polished metal.

## 3. Typography: The Editorial Voice
The hierarchy is a conversation between **The Chronicler (Cinzel)** and **The Tactician (Inter)**.

- **Display & Headlines (Cinzel):** These must feel ritualistic. Use `display-lg` for character names and `headline-sm` for major section headers. *Director's Note: Use 'all-caps' for headers with 0.1rem letter spacing to enhance the "inscribed" feel.*
- **Body & Stats (Inter):** High-density information (Ability Scores, Spell Descriptions) requires the clinical precision of Inter. 
- **Labels (Inter Bold):** Small labels (`label-sm`) should be set in `tertiary` (#d1c5b2) to provide contrast without competing with the gold primary accents.

## 4. Elevation & Depth: Tonal Layering
In a 0px-radius system, traditional drop shadows can look muddy. We use **Ambient Depth.**

- **The Stacking Principle:** To lift a card, do not use a shadow. Instead, place a `surface-container-highest` element over a `surface-dim` background.
- **Ambient Glow:** If an element must float (e.g., a rolling die result), use an "Ambient Glow" instead of a shadow. Use the `primary` color (#e6c364) at 5% opacity with a `40px` blur. It should feel like the element is emitting light, not blocking it.
- **Ghost Borders:** For inactive inputs or secondary containers, use the `outline_variant` (#4d4637) at 20% opacity. It should be "felt, not seen."

## 5. Components & Ornamental Logic

### Ornamental Dividers
Never use a simple horizontal rule. Use the **Diamond Lozenge** divider:
- A `0.5px` gold line (`primary_container`) that fades to 0% opacity at the edges, featuring a small 4px rotated square (diamond) in the center.

### Character Cards
- **The Gold Accent Bar:** Every card/module must feature a `2px` solid gold (`primary`) vertical bar on the extreme left. This is our signature brand mark.
- **Corner Flourishes:** Use SVG corner flourishes on `surface-container-high` containers. These should be `primary` at 30% opacity to remain subtle.

### Inputs & Action Elements
- **Input Fields:** No visible box. Use a `surface-container-low` background with a `1px` bottom-border of `outline_variant`. On focus, the bottom border transitions to `primary` (#e6c364).
- **Buttons:**
    - **Primary:** Gradient fill, Cinzel font, all-caps.
    - **Secondary:** Transparent fill, `1px` gold border, Inter font.
- **The Dragon Watermark:** The 2-3% opacity heraldic dragon must be placed asymmetrically behind the main stat block—never centered. It should look like a faded mark on a piece of vellum.

### Interactive "Stats"
- Ability scores (STR, DEX, etc.) should be housed in "Triptych" containers: `surface-container-highest` background, a gold left accent bar, and the value set in `display-sm` (Cinzel).

## 6. Do's and Don'ts

### Do:
- **Embrace Asymmetry:** Place the dragon watermark off-center. Let some columns be wider than others to mimic a hand-laid ledger.
- **Use Color for Hierarchy:** Use `on_surface_variant` (#d0c5b2) for flavor text to keep it distinct from mechanical text in `on_surface`.
- **Treat Spacing as Luxury:** Use `spacing.16` (3.5rem) between major sections. White space in a dark UI is "breathing room" in a cramped dungeon.

### Don't:
- **No Rounded Corners:** Any radius above 0px breaks the "artifact" illusion.
- **No Generic Icons:** Use illustrative, thin-stroke gold icons. Avoid thick, "bubbly" UI icons.
- **No Pure Black:** Never use `#000000`. Use the `surface` (#0d131e) to maintain the "navy depth" of the dark fantasy world.
- **No Heavy Borders:** Structural borders are a failure of layout. Use surface shifts instead.