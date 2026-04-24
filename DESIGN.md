# Design System Document: The Serene Path
 
## 1. Overview & Creative North Star: "The Intellectual Sanctuary"
This design system moves away from the chaotic, high-pressure visuals of traditional "productivity" apps. Our Creative North Star is **The Intellectual Sanctuary**. We aim to evoke the feeling of a high-end, architectural studio—places where clarity, quiet, and intentional progress are the priority.
 
To break the "standard template" look, we employ **Intentional Asymmetry** and **Tonal Depth**. This system rejects rigid, boxed-in grids in favor of an editorial layout that breathes. We use overlapping elements and generous white space to create a sense of calm, ensuring that a student’s educational roadmap feels like an invitation rather than a chore.
 
---
 
## 2. Colors, Tonal Architecture & Theming
We utilize a sophisticated, semantic palette centered around Sage (`primary`) and muted organic tones. 

**LLM System Instruction:** *Never hardcode hex values in components.* All components must exclusively reference the semantic token names to ensure seamless Light/Dark mode switching. The dark mode must maintain the "Serene Path" identity—avoiding pure, harsh blacks in favor of deep, organic slates.

### Semantic Token Matrix (Light & Dark Mode)
Use this exact mapping for CSS Variables or Tailwind configuration:

| Semantic Token | Light Mode Hex | Dark Mode Hex | Usage Context |
| :--- | :--- | :--- | :--- |
| `primary` | `#58624b` | `#b8cca1` | Main CTAs, active progress states, active icons. |
| `on-primary` | `#ffffff` | `#28321e` | Text or icons resting directly on a `primary` background. |
| `primary-container` | `#dce6ca` | `#3f4834` | Soft highlights, active node backgrounds. |
| `primary-dim` | `#a4b293` | `#6d7a5b` | Progress bar gradients (transitioning to primary). |
| `surface` | `#f9faf7` | `#111412` | The lowest layer; the main application background. |
| `surface-container-lowest` | `#ffffff` | `#0d0f0e` | Floating elements, interactive cards that "pop" forward. |
| `surface-container-low` | `#f2f4f1` | `#1a1f1c` | Sub-sections, grouping related content. |
| `surface-container` | `#ecefe9` | `#212623` | Base input fields, standard inactive zones. |
| `surface-container-high` | `#e6e9e3` | `#2b312d` | Secondary buttons, nested data groups. |
| `surface-container-highest`| `#dce5df` | `#353c38` | Progress bar tracks, heavy inactive backgrounds. |
| `on-surface` | `#2c3430` | `#e1e3df` | Primary text (Headlines, active titles), strong icons. |
| `on-surface-variant` | `#59615c` | `#aeb4b0` | Secondary text (Body text, captions, metadata). |
| `outline-variant` | `#abb4af` | `#414944` | Node connectors, ghost borders (use at specific opacities). |
 
### The "No-Line" Rule
**Explicit Instruction:** Designers and Developers are prohibited from using 1px solid borders to define sections. Boundaries must be established through background color shifts. A `surface-container-low` section sitting on a `surface` background provides all the definition needed. 
 
### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
* **Base:** `surface` for the main canvas.
* **Sub-sections:** Use `surface-container-low` to group related content.
* **Interactive Cards:** Use `surface-container-lowest` to make them "pop" forward naturally.
* **Nesting:** When nesting a container within a container, always move one step higher in the tier (e.g., a `surface-container-high` chip inside a `surface-container` card).
 
### The "Glass & Gradient" Rule
To avoid a flat, "web 1.0" feel:
* **Floating Navigation:** Use Glassmorphism. Apply `surface` at 70% opacity with a `24px` backdrop blur.
* **Visual Soul:** Main CTAs or progress track headers should use a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle.
 
---
 
## 3. Typography: Editorial Authority
We pair **Manrope** (Display/Headline) with **Inter** (Title/Body/Label) to create a high-contrast, editorial hierarchy.
 
* **Display (L/M/S):** *Manrope*. Wide aperture, modern, and expensive feel.
* **Headlines:** *Manrope*. Maintain a tight tracking (-0.02em).
* **Body & Titles:** *Inter*. Use `on-surface-variant` for body text to reduce eye strain.
* **Labels:** *Inter Semibold*. Meta-data and percentages.
 
---
 
## 4. Elevation & Depth: Tonal Layering
Elevation is a whisper, not a shout.
 
* **The Layering Principle:** Stacking tiers (e.g., `surface-container-lowest` on `surface-container-low`) is the primary way to show depth.
* **Ambient Shadows:** For floating elements, use a shadow with a `32px` blur, 0px offset, and 6% opacity of `on-surface`. (This automatically scales as `on-surface` inverts in dark mode).
* **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**.
 
---
 
## 5. Components
 
### Roadmap Nodes (Unique Component)
* **Visuals:** Circular or Soft-Hexagonal shapes using `rounded-full`.
* **States:** Completed (`primary`), Active (`primary-container` with `primary` Ghost Border), Locked (`surface-container-high`).
 
### Progress Bars
* **Track:** `surface-container-highest`.
* **Indicator:** Gradient from `primary-dim` to `primary`. 
 
### Buttons
* **Primary:** Solid `primary` background with `on-primary` text. `rounded-md`.
* **Secondary:** `surface-container-high` background with `on-surface` text.
* **Tertiary:** Text-only `primary` color; underline on hover.
 
---
 
## 6. Do's and Don'ts
 
### Do
* **Do** use asymmetrical padding for an editorial feel.
* **Do** allow elements to overlap slightly (e.g., progress chips over header images).
 
### Don't
* **Don't** use pure black (`#000000`) or pure white (`#ffffff`) for text/backgrounds unless specified by a container token.
* **Don't** use "Card Shadows" on every element. Rely on background color shifts first.

---

## 7. Developer & LLM Implementation Rules
**Strict Directives for AI Coding Agents and Frontend Developers:**

1.  **State Management:** Theme state must be managed via a root class (e.g., `<html class="dark">`). 
2.  **CSS Variables:** The Semantic Token Matrix must be mapped exactly to CSS custom properties.
3.  **Tailwind/Utility Classes:** Configure `tailwind.config.js` to map colors to these CSS variables. **Never use Tailwind's default color palette (e.g., `bg-gray-100`)**. Always use semantic names (e.g., `bg-surface`).
4.  **No Hardcoded Overrides:** Never use dark variants inline (e.g., `dark:bg-[#111412]`). Rely entirely on root variable flipping.