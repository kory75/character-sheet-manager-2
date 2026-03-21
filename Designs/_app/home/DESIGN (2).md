# Design System Specification: Institutional Brutalism

## 1. Overview & Creative North Star
**Creative North Star: The Monolithic Archivist**
This design system rejects the "friendly" softness of modern SaaS. It adopts the cold, authoritative weight of **Institutional Brutalism**—the digital equivalent of a concrete vault or a high-security government archive. It is designed to feel like a redacted intelligence file or an ancient, digitized grimoire.

To move beyond a "template" look, we utilize **Intentional Asymmetry**. We break the rigid grid by allowing headlines to bleed to the absolute edge of containers, while body copy remains strictly indented. We do not use "soft" UI; we use high-contrast scales, overlapping monolithic blocks, and structural L-brackets to create a sense of architectural permanence and tonal depth.

---

## 2. Colors & Surface Logic

### Palette Architecture
*   **Background (`surface`):** `#131318` (Deep Charcoal)
*   **Primary Accent (`primary`):** `#ecc246` (Warm Gold) / `#c9a227` (Container)
*   **System Accents:** 
    *   `secondary` (Error/Red): `#ffb4ab`
    *   `tertiary` (Amber/Warn): `#ffb68e`
    *   `outline`: `#99907b` (Muted Gold/Grey)

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through **Tonal Transitions**. To separate a sidebar from a main feed, simply shift from `surface` (#131318) to `surface-container-low` (#1b1b20). 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers stacked in a dark room. 
1.  **Level 0 (Floor):** `surface` (#131318) with a 20px grid at 8% opacity.
2.  **Level 1 (Foundation):** `surface-container-low` (#1b1b20) for primary content regions.
3.  **Level 2 (The Artifact):** `surface-container` (#1f1f24) for cards and interactive modules.
4.  **Level 3 (Focus):** `surface-bright` (#39393e) for active states or temporary modals.

### Signature Textures
Main CTAs should use a **Linear Gradient** (`primary-container` to `primary`) at a 45-degree angle to provide a "metallic" gold sheen, moving the design away from flat, "web-native" aesthetics toward a high-end editorial feel.

---

### 3. Typography

The typographic system is a dialogue between the aggressive, technical **Space Grotesk** and the invisible utility of **Inter**.

| Level | Font | Weight | Tracking | Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | Space Grotesk | Black (900) | -0.05em | ALL CAPS |
| **Headline** | Space Grotesk | Black (900) | -0.05em | ALL CAPS |
| **Title** | Inter | Bold (700) | 0 | Sentence |
| **Body** | Inter | Regular (400) | +0.01em | Sentence |
| **Label** | Space Grotesk | Bold (700) | +0.1em | ALL CAPS |

**Editorial Note:** Headlines should always be **Heavy Left-Aligned**. To create an "Institutional" feel, use `label-sm` for metadata, always paired with a geometric diamond rune (◆) to separate data points.

---

## 4. Elevation & Depth

### The Layering Principle
Do not use structural lines. Instead, nest containers. A `surface-container-lowest` card sitting on a `surface-container-low` background provides enough contrast to be felt without being "seen."

### Ambient Shadows
Shadows are rarely used. When required for floating elements (e.g., a context menu), use an **Extra-Diffused Tinted Shadow**:
*   **Blur:** 40px
*   **Opacity:** 8%
*   **Color:** `#ecc246` (The Primary Gold, diffused)

### The "Ghost Border" Fallback
If visual separation is failing accessibility tests, use a **Ghost Border**:
*   **Token:** `outline-variant`
*   **Opacity:** 15%
*   **Radius:** 0px (Absolute)

### L-Bracket Corner Marks
In place of borders, use 8px x 8px L-shaped brackets in `primary` at the four corners of high-importance containers. This frames the content like a scanned document or a targeting reticle.

---

## 5. Components

### Buttons
*   **Primary:** Sharp 0px corners. Background: `primary` gradient. Text: `on-primary` (Space Grotesk, All Caps).
*   **Secondary:** 0px corners. Background: Transparent. Border: 1px `ghost-border` (15% opacity).
*   **Hover State:** Increase background opacity or shift from `primary-container` to `primary-fixed`.

### Input Fields
Forbid the "box" look. Use a single bottom-border (`outline-variant` at 20%) and a `surface-container-low` background. On focus, the bottom border turns `primary` (Gold) and a small diamond rune (◆) appears at the left.

### Cards & Lists
*   **No Dividers:** Lists are separated by `spacing-4` (0.9rem) of vertical whitespace.
*   **Alignment:** All content is strictly left-aligned. Images/Portraits should use 0px border-radius and a `ghost-border` overlay.

### Character Stat Chips
Small, rectangular blocks using `surface-container-highest`. Use `label-sm` for the stat name and `title-md` for the value. No rounded corners.

---

## 6. Do's and Don'ts

### Do
*   **DO** use the 20px grid as your bible. Align every element's edge to a grid line.
*   **DO** leave massive amounts of negative space between sections to emphasize the "monolithic" feel.
*   **DO** use "Redacted" bars (solid blocks of `surface-bright`) for loading states.
*   **DO** utilize the L-bracket corner marks to draw attention to Hero characters.

### Don't
*   **DON'T** use border-radius. Ever. 0px is the only permitted value.
*   **DON'T** use standard drop shadows. If it doesn't look like it's part of the architecture, it doesn't belong.
*   **DON'T** center-align text. This system is built on the authority of the "margin-start" (left-alignment).
*   **DON'T** use 100% opaque borders. They clutter the archive; let the color shifts do the work.