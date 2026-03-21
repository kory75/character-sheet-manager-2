# Design System Strategy: Institutional Brutalism

## 1. Overview & Creative North Star
**Creative North Star: The Obsidian Ledger**

This design system is a digital manifestation of absolute authority. It rejects the "friendly" aesthetics of modern SaaS in favor of **Institutional Brutalism**—a high-contrast, sinister bureaucracy aesthetic inspired by the cold efficiency of Alpha Complex. 

We achieve a signature feel by leaning into the tension between oppressive void space and "Infrared" data. The design breaks standard templates through **intentional asymmetry**: large headers shoved into the far-left margins, technical data bleeding off-grid, and a total rejection of the "rounded corner" era. Every element is sharp, 90-degree precision, conveying a sense of rigid, uncompromising hierarchy.

---

## 2. Colors: Infrared & The Void
The palette is a study in ocular strain and authority. We use a "Deep Charcoal" base to simulate the windowless environments of a high-tech bunker, punctuated by "Infrared Red" to signal alerts, clearance levels, and mandatory commands.

### The "No-Line" Rule
Standard 1px borders are prohibited for sectioning. They are the mark of lazy design. Boundaries must be defined through:
*   **Background Shifts:** Use `surface-container-low` for secondary information sitting on a `surface` background.
*   **Tonal Transitions:** A transition from `surface-container-lowest` to `surface-container-high` creates a natural shelf for content without the need for structural "wireframes."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical dossiers.
*   **Base:** `surface` (#131318) is your canvas.
*   **Primary Containers:** Use `surface-container` (#1f1f24) for main interactive zones.
*   **Active Nodes:** Use `surface-container-highest` (#35343a) only for elements requiring immediate focus.

### Signature Textures (Glass & Gradient)
To simulate the glow of a CRT terminal, use semi-transparent `surface` colors with a `backdrop-blur` (12px-20px) for floating overlays. Main CTAs should utilize a subtle linear gradient from `primary-container` (#c41e1e) to a slightly darker variant to give the red "soul" and depth, preventing it from appearing as a flat "error" state.

---

## 3. Typography: The Language of Command
The typographic system utilizes a dual-font strategy to separate "The System" from "The User Data."

*   **Display & Headlines (Space Grotesk):** This is the voice of the bureaucracy. It is cold, wide, and modern. Use `display-lg` for section headers, but set them to `text-transform: uppercase` and `letter-spacing: -0.05rem` to create a dense, authoritative block of text.
*   **Body & Titles (Inter):** Used for instructional text and fine print. It is legible and invisible, ensuring that the "rules" are always clear.
*   **The Technical Layer (Labels):** For stat values, security codes, and technical data, utilize `label-sm` and `label-md`. While the scale uses Space Grotesk, designers should favor tabular figures (monospaced numbers) to evoke the feel of a high-tech terminal readout.

---

## 4. Elevation & Depth
In this system, elevation is not "lightness"; it is "presence." We move away from traditional shadows.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a recessed effect, as if the data is carved into the interface.
*   **Ambient Shadows:** If a floating element (like a context menu) is required, use a shadow with a 32px blur, but set the opacity to 6% using a tinted version of `on-surface`. It shouldn't look like a shadow; it should look like an atmospheric occlusion.
*   **The "Ghost Border":** If a container requires a perimeter for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "phantom" frame that only appears when the user's eye seeks it out. **100% opaque borders are strictly forbidden.**

---

## 5. Components: Terminal Primitives

### Buttons (Enforcement Nodes)
*   **Primary:** Background `primary-container` (#c41e1e), text `on-primary`. **0px roundedness.** Padding: `spacing-4` (vertical) by `spacing-8` (horizontal).
*   **Secondary:** Ghost style. No background, `outline-variant` ghost border (20% opacity). Text in `secondary`.
*   **Interaction:** On hover, primary buttons should not "lighten." They should "pulse" with a subtle `surface-bright` inner glow.

### Input Fields (Data Entry)
*   Inputs must look like official Alpha Complex forms. A solid `surface-container-low` background with a bottom-only border using `primary` (#ffb4ab) at 40% opacity. 
*   **Error State:** When a field fails validation, the entire background of the input shifts to `error_container` (#93000a).

### Cards & Dossiers
*   **Forbid Divider Lines.** Use `spacing-6` to separate content blocks within a card. 
*   **Header Shift:** The top 2.75rem (`spacing-12`) of a card should use a slightly higher surface tier than the body to define the title area without a line.

### Clearance Chips
*   Used to denote security levels. These are small, high-contrast pills (though still 0px radius) using `tertiary_container` for high-visibility warnings.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Void:** Use `spacing-20` and `spacing-24` to isolate critical data. Space is a tool of intimidation.
*   **Use Intentional Asymmetry:** Align labels to the right and data to the left to create a "technical glitch" layout that feels intentional and bespoke.
*   **Apply "Infrared" Sparingly:** If everything is red, nothing is a threat. Use `primary-container` only for the most vital interactions.

### Don't:
*   **No Rounded Corners:** If a component has a radius higher than `0px`, it is a violation of the system.
*   **No Centered Layouts:** Center-aligned text feels "marketing-heavy." Use left-aligned blocks to maintain a cold, document-like feel.
*   **No Standard Drop Shadows:** Never use the default "Material Design" shadows. If it looks like a standard web app, you have failed the Bureaucracy.

---

## 7. Spacing Scale Reference
All layouts must snap to the following logic to ensure structural rigidity:
*   **Micro (0.2rem - 0.5rem):** Internal component padding (e.g., chip margins).
*   **Standard (0.9rem - 1.3rem):** Content density (e.g., space between paragraphs).
*   **Macro (2.25rem - 5.5rem):** Sectional breathing room and "Bureaucratic Void" gaps.