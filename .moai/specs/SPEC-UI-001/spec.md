---
id: SPEC-UI-001
version: "1.0.0"
status: draft
created: "2026-03-03"
updated: "2026-03-03"
author: "9bit"
priority: high
---

## HISTORY

| Version | Date       | Author | Description                              |
|---------|------------|--------|------------------------------------------|
| 1.0.0   | 2026-03-03 | 9bit   | Initial SPEC creation for wedding invitation website |

---

# SPEC-UI-001: Korean Wedding Invitation Website (청첩장)

## 1. Environment

### 1.1 Runtime Environment

- **Platform:** Static website hosted on GitHub Pages
- **Primary Browsers:** Chrome Android 90+, Safari iOS 14+, Samsung Internet 14+, KakaoTalk in-app browser
- **Secondary Browsers:** Chrome Desktop 90+, Safari Desktop 14+, Firefox 88+
- **Network Conditions:** Mobile 4G/LTE (primary), WiFi (secondary), 3G (degraded graceful)
- **Viewport Range:** 320px (minimum mobile) to 1920px (desktop maximum)

### 1.2 External Dependencies

- **Kakao Maps JavaScript API v3:** Requires a registered JavaScript App Key from developers.kakao.com
- **Google Fonts CDN:** Noto Serif KR, Noto Sans KR, Playfair Display
- **No build tools required:** Pure HTML5 / CSS3 / Vanilla JavaScript (ES2020+)

### 1.3 Deployment Target

- **Hosting:** GitHub Pages (static file serving)
- **URL Pattern:** `https://{username}.github.io/friend-wedding/`
- **HTTPS:** Automatic via GitHub Pages (Let's Encrypt)

---

## 2. Assumptions

### 2.1 Content Assumptions

- A-001: The couple will provide approximately 24 pre-processed photos in JPEG or WebP format
- A-002: The couple will provide the wedding date, time, venue name, and address
- A-003: The couple will provide bank account numbers for both groom and bride family sides
- A-004: The couple will provide a background music file in MP3 format
- A-005: The invitation message text will be provided in Korean with optional English sections

### 2.2 Technical Assumptions

- A-006: The Kakao Maps JavaScript API key will be obtained and domain-registered before deployment
- A-007: Guest book messages will be stored in browser localStorage (client-side only, no persistence across devices)
- A-008: All gallery images will be optimized to under 200KB each before deployment
- A-009: The total page weight (including all assets) will remain under 5MB
- A-010: No server-side backend is required; all features operate client-side

### 2.3 User Assumptions

- A-011: The majority of guests (estimated 80%+) will access the site via mobile devices
- A-012: Most guests will arrive via a KakaoTalk shared link
- A-013: Guests are familiar with Korean wedding conventions (monetary gifts, account numbers)
- A-014: Guests expect Korean-language content with minimal English accent text

---

## 3. Requirements

### Module 1: Page Layout & Visual Design

#### REQ-UI-001: Page Structure (Ubiquitous)
The system SHALL render the wedding invitation as a single-page vertical scroll layout containing all sections in the defined order: Header, Save the Date, Invitation Message, Photo Gallery, Calendar Widget, Location, Kakao Map, Account Numbers, and Guest Book.

#### REQ-UI-002: Mobile-First Responsive Layout (Ubiquitous)
The system SHALL apply mobile-first CSS with base styles targeting viewports under 768px, with progressive enhancement via `min-width` media queries at 768px (tablet) and 1024px (desktop).

#### REQ-UI-003: Content Container Width (Ubiquitous)
The system SHALL constrain the content area to a maximum width of 640px, centered horizontally, to maintain readability on desktop screens while preserving a mobile-like reading experience.

#### REQ-UI-004: Design Token System (Ubiquitous)
The system SHALL define all colors, fonts, spacing, and breakpoints as CSS custom properties (design tokens) in the `:root` selector for consistent theming across all sections.

#### REQ-UI-005: Typography System (Ubiquitous)
The system SHALL use serif fonts (Noto Serif KR, Playfair Display) for headings and sans-serif fonts (Noto Sans KR) for body text, with fluid font sizes using `clamp()` for responsive scaling.

#### REQ-UI-006: Scroll Animation (Event-Driven)
WHEN a section enters the viewport, THE SYSTEM SHALL apply a fade-in animation using the Intersection Observer API with a configurable threshold.

#### REQ-UI-007: Color Scheme (Ubiquitous)
The system SHALL use a warm, minimalist color palette: cream/ivory background (#FAF8F5), dark charcoal text (#2C2C2C), and a muted accent color (rose or sage green) for interactive elements and highlights.

---

### Module 2: Interactive Features

#### REQ-UI-008: Gallery Grid Display (Ubiquitous)
The system SHALL display couple photos in a responsive CSS Grid layout: 2 columns on mobile (< 768px), 3 columns on tablet (768px-1023px), and 4 columns on desktop (1024px+).

#### REQ-UI-009: Gallery Lightbox (Event-Driven)
WHEN the user clicks or taps a gallery photo, THE SYSTEM SHALL display a full-screen lightbox modal showing the photo at its maximum viewable size with a close button.

#### REQ-UI-010: Lightbox Navigation (Event-Driven)
WHEN the lightbox is open and the user swipes left/right (touch) or clicks navigation arrows, THE SYSTEM SHALL navigate to the previous or next photo in the gallery sequence.

#### REQ-UI-011: Lightbox Scroll Lock (Complex)
WHILE the lightbox modal is open, THE SYSTEM SHALL prevent background page scrolling by setting `overflow: hidden` on the body element.

#### REQ-UI-012: Calendar Widget (Ubiquitous)
The system SHALL render a visual monthly calendar for the wedding month, with the wedding date visually highlighted using the accent color and distinct styling.

#### REQ-UI-013: Kakao Map Rendering (Optional)
WHERE the Kakao Maps JavaScript API is available and successfully loaded, THE SYSTEM SHALL render an interactive embedded map centered on the venue coordinates with a marker at the venue location.

#### REQ-UI-014: Kakao Map Fallback (Unwanted Behavior)
IF the Kakao Maps API fails to load or the API key is invalid, THEN THE SYSTEM SHALL display a static fallback message with the venue address and a link to open the location in Kakao Maps or Google Maps.

#### REQ-UI-015: Account Number Copy (Event-Driven)
WHEN the user clicks the copy button next to a bank account number, THE SYSTEM SHALL copy the account number to the clipboard using the `navigator.clipboard.writeText()` API and display a brief confirmation toast.

#### REQ-UI-016: Account Section Collapse (Event-Driven)
WHEN the user clicks the groom-side or bride-side account header, THE SYSTEM SHALL toggle the visibility of the corresponding account details section with a smooth expand/collapse animation.

#### REQ-UI-017: Guest Book Modal (Event-Driven)
WHEN the user clicks the "Leave a Message" button, THE SYSTEM SHALL display a modal popup containing a form with name and message input fields and a submit button.

#### REQ-UI-018: Guest Book Submission (Event-Driven)
WHEN the user submits the guest book form with valid input, THE SYSTEM SHALL store the message entry in browser localStorage and display it in the guest book message list.

#### REQ-UI-019: Guest Book Scroll Lock (Complex)
WHILE the guest book modal is open, THE SYSTEM SHALL prevent background page scrolling.

#### REQ-UI-020: Audio Toggle (Event-Driven)
WHEN the user clicks the audio toggle button, THE SYSTEM SHALL play or pause the background music and update the button icon to reflect the current state (muted/unmuted).

#### REQ-UI-021: Audio Autoplay Handling (Unwanted Behavior)
IF the browser blocks audio autoplay, THEN THE SYSTEM SHALL initialize the audio in a muted/paused state and display the toggle button in the muted state, awaiting user interaction.

#### REQ-UI-022: Audio Button Persistence (Ubiquitous)
The system SHALL display the audio toggle button as a fixed floating element visible at all scroll positions on the page.

---

### Module 3: Performance & Compatibility

#### REQ-UI-023: Lazy Loading (Ubiquitous)
The system SHALL apply `loading="lazy"` to all gallery images and provide explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS).

#### REQ-UI-024: First Contentful Paint Target (Ubiquitous)
The system SHALL achieve a First Contentful Paint (FCP) time of less than 1.5 seconds on a 4G mobile connection by inlining critical CSS and deferring non-critical scripts.

#### REQ-UI-025: Total Page Weight (Ubiquitous)
The system SHALL maintain a total page weight (HTML + CSS + JS + images + audio) of less than 5MB when all gallery images are optimized.

#### REQ-UI-026: Touch Target Size (Ubiquitous)
The system SHALL ensure all interactive elements (buttons, links, gallery thumbnails) meet the minimum touch target size of 44x44 pixels per WCAG 2.1 AA guidelines.

#### REQ-UI-027: KakaoTalk In-App Browser Compatibility (Ubiquitous)
The system SHALL function correctly in the KakaoTalk in-app browser (Android and iOS), including map rendering, audio controls, and clipboard operations.

#### REQ-UI-028: Graceful Degradation (Unwanted Behavior)
IF JavaScript is disabled or fails to load, THEN THE SYSTEM SHALL display all static content (text, images, venue information) in a readable format without interactive features.

#### REQ-UI-029: Image Format Optimization (Ubiquitous)
The system SHALL use WebP format for gallery images where supported, with JPEG fallback, and each gallery image SHALL NOT exceed 200KB in file size.

---

## 4. Specifications

### 4.1 File Structure

| File                      | Purpose                                              |
|---------------------------|------------------------------------------------------|
| `index.html`              | Single-page HTML structure with all 9 sections       |
| `assets/css/style.css`    | Complete stylesheet with 16 organized sections       |
| `assets/js/main.js`       | All interactive features in 9 organized modules      |
| `assets/images/gallery/`  | Couple photos (photo-01.jpg through photo-24.jpg)    |
| `assets/images/couple-main.jpg` | Hero/header main couple portrait              |
| `audio/bgm.mp3`          | Background music file                                 |

### 4.2 HTML Section Order

1. `<header>` -- Couple names, subtitle, audio toggle button
2. `#save-the-date` -- Date, time, day of week
3. `#invitation` -- Korean invitation text, parent names
4. `#gallery` -- Photo grid + lightbox modal overlay
5. `#calendar` -- Monthly calendar widget
6. `#location` -- Venue name, address, transit directions
7. `#map` -- Kakao Maps embed container
8. `#accounts` -- Collapsible groom/bride account sections
9. `#guestbook` -- Guest book trigger button + modal

### 4.3 CSS Architecture

- CSS Custom Properties for design tokens in `:root`
- Mobile-first with breakpoints at 768px and 1024px
- BEM-like class naming convention
- No preprocessor (SCSS/LESS) -- plain CSS3
- 16 organized comment-delimited sections

### 4.4 JavaScript Architecture

- Vanilla JS (ES2020+), no framework or library dependencies
- 9 organized comment-delimited modules in a single file
- Intersection Observer API for scroll-triggered animations
- Event delegation where appropriate
- `DOMContentLoaded` initialization entry point

### 4.5 External API Integration

- **Kakao Maps SDK:** Loaded via `<script>` tag from `//dapi.kakao.com/v2/maps/sdk.js`
- **API Key:** Public JavaScript App Key registered to deployment domain
- **Venue Coordinates:** Latitude/Longitude constants defined in `main.js`

### 4.6 Data Storage

- **Guest Book:** Browser `localStorage` with JSON serialization
- **Audio State:** No persistence (resets on page reload)
- **No cookies or sessions required**

---

## 5. Constraints

### 5.1 Hard Constraints

- C-001: No build tools, bundlers, or package managers (no npm, webpack, Vite)
- C-002: No JavaScript frameworks (no React, Vue, Angular, Svelte)
- C-003: No CSS preprocessors (no SCSS, LESS, PostCSS)
- C-004: Single HTML file for the entire page
- C-005: Kakao Maps API key must be manually configured before deployment
- C-006: GitHub Pages static hosting only (no server-side rendering)

### 5.2 Soft Constraints

- C-007: Gallery image count approximately 24 (flexible based on couple's photos)
- C-008: Background music file should be under 2MB for fast initial load
- C-009: Guest book localStorage approach means messages are device-local only
- C-010: Couple may optionally integrate a third-party service (Formspree, EmailJS) for persistent guest book

---

## 6. Traceability

| Requirement   | Plan Phase     | Acceptance Criteria  | Section          |
|---------------|----------------|----------------------|------------------|
| REQ-UI-001    | Phase 1        | AC-001               | Page Layout      |
| REQ-UI-002    | Phase 2        | AC-002               | Responsive       |
| REQ-UI-008    | Phase 2        | AC-003               | Gallery Grid     |
| REQ-UI-009    | Phase 3        | AC-004               | Lightbox         |
| REQ-UI-013    | Phase 4        | AC-005               | Kakao Map        |
| REQ-UI-015    | Phase 3        | AC-006               | Account Copy     |
| REQ-UI-017    | Phase 3        | AC-007               | Guest Book       |
| REQ-UI-020    | Phase 3        | AC-008               | Audio Toggle     |
| REQ-UI-023    | Phase 1        | AC-009               | Performance      |
| REQ-UI-027    | Phase 6        | AC-010               | Compatibility    |

---

## 7. Prerequisites

### Manual Steps Required Before Implementation

1. **Kakao Maps API Key:** Register at https://developers.kakao.com, create an application, obtain the JavaScript App Key, and register the deployment domain as an allowed origin
2. **Couple Content:** Collect wedding date, venue details, invitation text, parent names, bank account numbers, and background music file
3. **Photos:** Obtain approximately 24 couple photos, optimize to WebP/JPEG under 200KB each
4. **GitHub Repository:** Create repository and configure GitHub Pages deployment

---

## 8. Expert Consultation Recommendations

Based on SPEC analysis, the following expert consultations are recommended:

### Frontend Expert (expert-frontend)
- **Trigger Keywords:** component, page, UI, responsive, gallery, lightbox, modal, animation
- **Consultation Scope:** CSS architecture decisions, Intersection Observer patterns, lightbox implementation approach, mobile touch gesture handling, KakaoTalk in-app browser quirks
- **Rationale:** This SPEC is entirely frontend-focused; frontend expertise ensures optimal UX across all target browsers

### Design/UX Expert (design-uiux)
- **Trigger Keywords:** design system, accessibility, WCAG, user flow
- **Consultation Scope:** WCAG 2.1 AA compliance verification, color contrast ratios, touch target sizing, animation timing for elegance without motion sickness
- **Rationale:** Wedding invitation requires both aesthetic quality and accessibility compliance
