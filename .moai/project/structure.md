# Project Structure: Friend Wedding Invitation Website

## Directory Layout

```
friend-wedding/
├── index.html                  # Main invitation page (single-page application)
├── assets/
│   ├── css/
│   │   └── style.css           # Main stylesheet (variables, layout, components, animations)
│   ├── js/
│   │   └── main.js             # All interactive features (map, gallery, guestbook, audio)
│   └── images/
│       ├── gallery/            # Couple photos (photo-01.jpg ... photo-24.jpg)
│       ├── couple-main.jpg     # Hero/header background or main portrait
│       └── favicon.ico         # Browser tab icon
├── audio/
│   └── bgm.mp3                 # Background music file
├── .moai/                      # MoAI configuration (already exists, do not modify)
└── .claude/                    # Claude Code configuration (already exists, do not modify)
```

---

## File Responsibilities

### `index.html`
The single HTML file that contains the entire invitation page. All sections are rendered as vertical scroll sections in this order:

1. `<header>` — Couple names, audio toggle button
2. `#save-the-date` — Date and time display
3. `#invitation` — Korean invitation message and parent names
4. `#gallery` — Photo grid (24 images) + lightbox modal overlay
5. `#calendar` — Visual calendar widget with highlighted wedding date
6. `#location` — Venue name, address, transit directions
7. `#map` — Kakao Maps embed container
8. `#accounts` — Gift account numbers (collapsible, groom + bride sides)
9. `#guestbook` — Guest book trigger button + popup modal

Includes `<script>` tags for Kakao Maps JavaScript SDK and a reference to `assets/js/main.js`.

---

### `assets/css/style.css`
Organized in the following sections via CSS comments:

```
/* 1. CSS Custom Properties (Design Tokens) */
/* 2. Reset & Base Styles */
/* 3. Typography */
/* 4. Layout & Grid */
/* 5. Header & Hero */
/* 6. Save the Date */
/* 7. Invitation Message */
/* 8. Photo Gallery */
/* 9. Lightbox Modal */
/* 10. Calendar Widget */
/* 11. Location & Map */
/* 12. Account Numbers */
/* 13. Guest Book Modal */
/* 14. Audio Toggle Button */
/* 15. Animations & Transitions */
/* 16. Responsive Breakpoints */
```

Key design tokens (CSS variables):
- `--color-primary`: Cream/ivory background (#FAF8F5)
- `--color-accent`: Muted rose or sage green for highlights
- `--color-text`: Dark charcoal for body text (#2C2C2C)
- `--font-serif`: Serif font for headings (e.g., 'Playfair Display' or 'Noto Serif KR')
- `--font-sans`: Sans-serif for body (e.g., 'Noto Sans KR')
- `--spacing-section`: Vertical padding between sections (60px desktop, 40px mobile)

---

### `assets/js/main.js`
Organized in the following modules via JS comments:

```
/* === 1. Constants & Configuration === */
/* === 2. Audio Player === */
/* === 3. Photo Gallery & Lightbox === */
/* === 4. Calendar Widget === */
/* === 5. Kakao Map Initialization === */
/* === 6. Account Number Copy === */
/* === 7. Guest Book Modal === */
/* === 8. Scroll Animations (Intersection Observer) === */
/* === 9. Initialization === */
```

---

### `assets/images/`
- `gallery/` — Named sequentially (`photo-01.jpg` through `photo-24.jpg`) for easy iteration
- `couple-main.jpg` — Main couple photo used in the hero or invitation section
- Images should be compressed to WebP or optimized JPEG before deployment (target: < 200KB per gallery image)

---

### `audio/bgm.mp3`
- Background music file provided by the couple
- MP3 format for broad browser compatibility
- Fallback: OGG format optional (`bgm.ogg`) for older Firefox versions

---

## Section Layout (Vertical Scroll Order)

```
┌─────────────────────────────────┐
│  HEADER                         │
│  Couple Names + Audio Button    │
├─────────────────────────────────┤
│  SAVE THE DATE                  │
│  Date · Time · Day of Week      │
├─────────────────────────────────┤
│  INVITATION MESSAGE             │
│  Korean narrative + Parent names│
├─────────────────────────────────┤
│  PHOTO GALLERY                  │
│  Grid of 24 photos              │
│  [Lightbox overlay on click]    │
├─────────────────────────────────┤
│  CALENDAR                       │
│  Month view, date highlighted   │
├─────────────────────────────────┤
│  LOCATION                       │
│  Venue name + Address + Transit │
├─────────────────────────────────┤
│  KAKAO MAP                      │
│  Embedded interactive map       │
├─────────────────────────────────┤
│  ACCOUNT NUMBERS                │
│  [Groom Side ▼]  [Bride Side ▼] │
├─────────────────────────────────┤
│  GUEST BOOK                     │
│  "Leave a Message" button       │
│  [Modal popup on click]         │
└─────────────────────────────────┘
```

---

## No Build Step Required

This is a pure static site. There is no package.json, no bundler, no compilation step. Editing and previewing requires only:

1. A text editor
2. A local HTTP server (e.g., VS Code Live Server extension, or `python -m http.server 8080`)
3. A modern web browser

Deployment requires only uploading the files to a static host (GitHub Pages, Vercel, Netlify).
