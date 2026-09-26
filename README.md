# Cover Maker (React App)

A drag-and-drop cover page designer — add text, boxes, lines, and a logo/image to build cover pages for theses, assignments, and lab reports, then export them as PNG or PDF. This is a full Vite + React project (converted from the original single-file HTML version).

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs static files into the `dist/` folder, which can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Project structure

```
cover-maker-app/
├── index.html          Vite entry HTML (includes Google Fonts link)
├── package.json         Dependencies: react, react-dom, html2canvas, jspdf
├── vite.config.js
└── src/
    ├── main.jsx          React root mount
    ├── App.jsx           The whole app (canvas editor, templates, undo/redo, PDF/PNG export)
    └── App.css           All styles (moved from the original <style> block)
```

## Features
- Add and drag/resize text, boxes, lines, and a logo/image
- 14+ ready-made cover templates (thesis, assignment, lab report, etc.)
- Undo/redo, keyboard shortcuts
- Image tools: background remove / sharpen / manual erase
- UI in 9 languages (Bengali, English, Hindi, Urdu, Arabic, Spanish, French, Chinese, Japanese, Russian)
- PNG / PDF export (via html2canvas + jsPDF)

## Notes
- The original file loaded React/html2canvas/jsPDF from a CDN — here they're imported as npm packages instead, so `npm install` is required.
- Drafts auto-save to localStorage (`covermaker_draft_v1` key), same as before.
