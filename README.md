# Aetheris AI — Enterprise Visual Cognitive Platform

A next-generation, high-performance landing showcase for **Aetheris AI**, designing and deploying autonomous multi-agent workspaces, secure cognitive pipelines, and localized vector data vaults for large-scale operations.

This repository features an award-winning, immersive 3D scroll-driven experience utilizing real-time WebGL, interactive particle physics, and glassmorphic user interfaces built with custom design specifications.

---

## 🚀 Key Visual & Interactive Features

### 1. Interactive 3D Neural Core
*   **Three.js Renderer**: Utilizes physical-based rendering (PBR) and transparency models to build a live glowing wireframe core and outer glass refraction shell.
*   **Scroll-Scrub Animation**: Binds camera position, scale, and emissive intensity to scroll progress using GSAP ScrollTrigger.
*   **Mouse Parallax**: PIVOTS the entire core group in response to mouse movements, giving a responsive, interactive depth.

### 2. Frosted Glassmorphism Tiles
*   **Refractive UI**: Implements custom glassmorphism layers (`35%` background opacity slate base, deep `24px` backdrop-filter blur, and thin border outlines) to allow background WebGL particles to shine through.
*   **Glassy Inputs**: Interactive form controls fade, glow, and tilt dynamically on mouse hover.

### 3. Dynamic Pipeline Simulator
*   **Responsive SVG Paths**: Rather than hardcoded coordinates, the simulator tracks the exact relative positions of nodes via JavaScript (`updateConnectorPaths`).
*   **Auto-Alignment**: Paths and active running connection sweeps auto-recalculate on window resize and page load.

### 4. Horizontal Metrics Section
*   **Horizontal Layout**: Organizes core VM specs and performance rates into a single horizontal glass card.
*   **Number Counter Animation**: Auto-increments metrics dynamically as the section scrolls into focus.

---

## 🔒 Security & Privacy Checklist

*   **Path Traversal Shield**: The Node.js static server (`serve.mjs`) resolves paths absolutely (`path.resolve`) and enforces root containment (`safeFilePath.startsWith(__dirname)`), protecting local directories from traversal attacks.
*   **Sensitive Exclusions**: Optimized `.gitignore` settings guarantee that credentials, local environment configurations (`.env`), package locks, and temporary directories are excluded from version control.
*   **Zero Leakage**: Standard HTML builds are served directly via lightweight local protocols with no cloud-based asset requests or external trackers.

---

## 🛠️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)

### Setup & Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/chakradharreddy141-netizen/AI-enterprise-Website.git
    cd AI-enterprise-Website
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
4.  Open the site in your browser:
    ```
    http://localhost:3000
    ```

---

## 📂 Project Structure

```
├── brand_assets/
│   ├── logo.png                # Official brand logo icon
│   └── brand_guidelines.md     # Visual guidelines, color palette, and typography
├── css/
│   └── style.css               # Core stylesheets, layout rules, and card effects
├── js/
│   └── app.js                  # Three.js canvas setup, Lenis scroll, and interactive simulator
├── index.html                  # Core HTML document structure
├── serve.mjs                   # Secure, lightweight HTTP server file
├── package.json                # Project script specifications and dependencies
├── .gitignore                  # Git tracking exclusion rules
└── README.md                   # Project documentation
```

---

*Built with Antigravity Visual Engineering.*
