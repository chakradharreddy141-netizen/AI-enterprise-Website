# Aetheris AI — Brand Guidelines

This document defines the visual engineering spec and styling tokens for the Aetheris AI brand assets and website designs.

## 1. Visual Theme: Cyber Dark Tech (Neon & Obsidian)
A premium dark-mode aesthetic utilizing low-opacity glowing elements, precise borders, and deep backing layers to reflect a high-end agentic visual workspace.

### A. Color Palette
- **Base Background**: `#08080a` (Obsidian Deep)
  - A neutral absolute dark mode base.
- **Surface Card**: `#121318` (Obsidian Surface)
  - Elevated containers, modal cards, and input backgrounds.
- **Text Primary**: `#ffffff` (High contrast text)
- **Text Secondary**: `#e4e4e7` (Silver-Mist body text)
- **Accent Cyan**: `#06b6d4` (Neon cyan glow highlight, active indicators)
- **Accent Purple**: `#a855f7` (Cyber purple glow blend)
- **Border Tint**: `rgba(255, 255, 255, 0.08)` (Subtle reflective line borders)

### B. Typography
- **Heading Family**: `'Space Grotesk'`, sans-serif (Display typeface)
  - Layout usage: Navigation links, Section headings (`h1`, `h2`, `h3`).
  - Headings must use tracking `tracking-tight` (`-0.03em`) and leading `leading-tight` (`1.1`).
- **Body Family**: `'Plus Jakarta Sans'`, sans-serif (Geometric clean sans-serif)
  - Layout usage: Copy text, button labels, form text.
  - Body copy must use leading `leading-relaxed` (`1.7`).

### C. Spacing & Depth
- **Standard Spacing**:
  - Gaps between sections: `py-24` or `py-32`
  - Gaps inside cards: `p-8` or `p-10`
  - Gap inside grid items: `gap-6` or `gap-8`
- **Z-Plane Elevation Layering**:
  - Layer 0 (Back): Ambient Mesh Gradients & Noise Filter
  - Layer 1 (Base): Base Background Grid Skeletons
  - Layer 2 (Elevated): Glassmorphic cards with border outline tints
  - Layer 3 (Floating): Navbars, modal dialogs, and absolute cursor glows

### D. Easing & Micro-Animations
- **Transition Spring Curve**:
  - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Custom snap spring)
  - Animation properties: `transform`, `opacity`
  - Duration: `300ms` to `500ms`
