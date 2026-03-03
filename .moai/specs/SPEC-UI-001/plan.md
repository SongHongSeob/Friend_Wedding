---
id: SPEC-UI-001
document: plan
version: "1.0.0"
status: draft
created: "2026-03-03"
updated: "2026-03-03"
author: "9bit"
---

# Implementation Plan: SPEC-UI-001 Korean Wedding Invitation Website

## Overview

This plan covers the full implementation of a static, mobile-first Korean wedding invitation website using HTML5, CSS3, and Vanilla JavaScript. The site is a single-page application deployed to GitHub Pages with no build step required.

---

## Phase 1: HTML Structure (Semantic Markup)

**Priority:** Primary Goal
**Complexity:** Medium
**Output:** `index.html`

### Tasks

1. **Create base HTML document**
   - HTML5 doctype, `<html lang="ko">`, meta charset UTF-8
   - Viewport meta tag for mobile responsiveness
   - Open Graph meta tags for KakaoTalk link preview (title, description, image)
   - Preconnect to Google Fonts CDN and Kakao Maps CDN

2. **Build semantic section structure**
   - `<header>` with couple names (groom/bride), subtitle text, audio toggle button
   - `<section id="save-the-date">` with date, time, day of week
   - `<section id="invitation">` with Korean narrative paragraphs and parent names
   - `<section id="gallery">` with grid container for 24 image thumbnails
   - `<div id="lightbox">` overlay markup (hidden by default) with image container, close button, prev/next navigation
   - `<section id="calendar">` with table-based monthly calendar structure
   - `<section id="location">` with venue name, address, and transit direction lists
   - `<div id="map">` container for Kakao Maps embed
   - `<section id="accounts">` with collapsible groom-side and bride-side subsections
   - `<section id="guestbook">` with trigger button and modal overlay markup

3. **Add external resource references**
   - Google Fonts `<link>` tags (Noto Serif KR, Noto Sans KR, Playfair Display)
   - Kakao Maps SDK `<script>` tag with API key placeholder
   - Reference to `assets/css/style.css`
   - Reference to `assets/js/main.js` with `defer` attribute

4. **Apply accessibility attributes**
   - ARIA labels on interactive elements (buttons, modals)
   - `alt` attributes on all images
   - `role="dialog"` on modal overlays
   - Skip-to-content link for keyboard navigation

### Dependencies
- None (first phase)

### Risks
- Open Graph image URL requires the deployment URL to be known (use placeholder initially)

### Related Requirements
- REQ-UI-001, REQ-UI-003, REQ-UI-026, REQ-UI-028

---

## Phase 2: CSS Styling (Mobile-First)

**Priority:** Primary Goal
**Complexity:** High
**Output:** `assets/css/style.css`

### Tasks

1. **Define design tokens (CSS Custom Properties)**
   - Colors: `--color-primary` (#FAF8F5), `--color-accent`, `--color-text` (#2C2C2C)
   - Fonts: `--font-serif`, `--font-sans`
   - Spacing: `--spacing-section` (40px mobile, 60px desktop)
   - Transitions: `--transition-default`
   - Border radius, shadow, and z-index scale

2. **Write reset and base styles**
   - Box-sizing border-box reset
   - Body font-family, background-color, color
   - `max-width: 640px` centered container
   - Smooth scroll behavior

3. **Style all 9 sections (mobile-first)**
   - Header: centered text, serif font, background image or gradient overlay
   - Save the Date: large date typography with decorative elements
   - Invitation: Korean text block with appropriate line-height and letter-spacing
   - Gallery: CSS Grid with 2-column mobile layout and gap
   - Calendar: table styling with highlighted date cell
   - Location: icon + text layout for transit directions
   - Map: responsive container with aspect ratio
   - Accounts: collapsible sections with chevron icon animation
   - Guest Book: button styling and modal overlay

4. **Style modal overlays**
   - Lightbox: full-screen fixed overlay with centered image, navigation arrows
   - Guest Book modal: centered card with form inputs and submit button
   - Backdrop blur/dim effect

5. **Add animations**
   - Fade-in-up animation class for scroll-triggered reveals
   - Subtle hover effects on interactive elements
   - Smooth expand/collapse transitions for account sections
   - Lightbox open/close transitions

6. **Write responsive breakpoints**
   - Tablet (768px+): 3-column gallery, larger font sizes
   - Desktop (1024px+): 4-column gallery, increased section spacing

### Dependencies
- Phase 1 (HTML structure must exist for CSS selectors)

### Risks
- Font loading may cause FOUT (Flash of Unstyled Text); mitigate with `font-display: swap`
- KakaoTalk in-app browser may have CSS quirks; test early

### Related Requirements
- REQ-UI-002, REQ-UI-004, REQ-UI-005, REQ-UI-007, REQ-UI-008, REQ-UI-026

---

## Phase 3: JavaScript Interactions

**Priority:** Primary Goal
**Complexity:** High
**Output:** `assets/js/main.js`

### Tasks

1. **Constants and configuration module**
   - Wedding date, time, venue coordinates (latitude/longitude)
   - Kakao Maps API key constant
   - DOM element selectors cached as constants

2. **Audio player module**
   - Initialize `Audio` object with `audio/bgm.mp3`
   - Handle autoplay policy: start muted/paused, update button icon
   - Toggle play/pause on button click
   - Update button visual state (muted/unmuted icon)

3. **Photo gallery and lightbox module**
   - Click handler on gallery grid images (use event delegation)
   - Open lightbox: set image source, show overlay, lock body scroll
   - Close lightbox: hide overlay, unlock body scroll
   - Navigation: prev/next buttons, keyboard arrow keys, touch swipe detection
   - Close on backdrop click or Escape key

4. **Calendar widget module**
   - Generate month calendar HTML dynamically from wedding date
   - Highlight wedding date cell with accent styling
   - Display day-of-week headers in Korean (일, 월, 화, 수, 목, 금, 토)

5. **Account number copy module**
   - Click handler on copy buttons
   - Use `navigator.clipboard.writeText()` API
   - Show toast notification ("계좌번호가 복사되었습니다")
   - Fallback for older browsers: hidden textarea + `document.execCommand('copy')`

6. **Guest book modal module**
   - Open modal on button click, lock body scroll
   - Form validation (name required, message required, max length)
   - Save to localStorage as JSON array
   - Render saved messages on page load and after submission
   - Close modal on backdrop click, close button, or Escape key

7. **Scroll animations module**
   - Create Intersection Observer with threshold (e.g., 0.15)
   - Observe all sections with a `.reveal` class
   - Add `.visible` class when intersection occurs (triggers CSS animation)

8. **Collapsible sections module**
   - Toggle handler for account section headers
   - Animate max-height for smooth expand/collapse
   - Toggle chevron icon rotation

9. **Initialization module**
   - `DOMContentLoaded` event listener
   - Call all module initialization functions in order
   - Error boundary: wrap external API calls in try/catch

### Dependencies
- Phase 1 (HTML structure), Phase 2 (CSS animations and classes)

### Risks
- `navigator.clipboard.writeText()` may fail in KakaoTalk in-app browser on some devices; fallback is essential
- Touch swipe detection requires careful implementation to avoid interfering with native scroll
- localStorage quota is limited (~5MB); unlikely to be an issue for guest book messages

### Related Requirements
- REQ-UI-006, REQ-UI-009 through REQ-UI-022

---

## Phase 4: Kakao Maps Integration

**Priority:** Secondary Goal
**Complexity:** Medium
**Output:** Updates to `index.html` and `assets/js/main.js`

### Tasks

1. **Kakao Developer account setup (manual prerequisite)**
   - Register application at developers.kakao.com
   - Obtain JavaScript App Key
   - Register deployment domain and localhost as allowed origins

2. **Map initialization in main.js**
   - Check if `kakao.maps` is available before initializing
   - Create map instance centered on venue coordinates
   - Set appropriate zoom level (level 3 for neighborhood view)
   - Add marker at venue position
   - Add InfoWindow with venue name popup

3. **Map fallback handling**
   - If SDK fails to load: show static venue info with external map links
   - Link to Kakao Maps: `https://map.kakao.com/link/to/{venue_name},{lat},{lng}`
   - Link to Google Maps: `https://www.google.com/maps/search/?api=1&query={lat},{lng}`

4. **Map responsiveness**
   - Resize map on window resize events (debounced)
   - Set container aspect ratio via CSS

### Dependencies
- Phase 1 (HTML map container), Phase 3 (initialization flow)
- **BLOCKER:** Kakao Maps API key must be configured manually

### Risks
- **High Risk:** Kakao Maps API key is a manual prerequisite; without it, the map section will show the fallback
- API rate limits are generous for a wedding site (unlikely to be an issue)
- Deep linking to Kakao Maps app uses `kakaomap://` URL scheme which may not work in all browsers

### Related Requirements
- REQ-UI-013, REQ-UI-014

---

## Phase 5: Content Population

**Priority:** Secondary Goal
**Complexity:** Low
**Output:** Updates to all files with actual content

### Tasks

1. **Replace placeholder text**
   - Couple names (groom and bride)
   - Wedding date, time, day of week
   - Invitation narrative in Korean
   - Parent names per Korean tradition
   - Venue name, address, floor/hall information
   - Transit directions (subway lines, bus routes)

2. **Add photos**
   - Place optimized couple photos in `assets/images/gallery/`
   - Name sequentially: `photo-01.jpg` through `photo-24.jpg`
   - Place main couple photo as `assets/images/couple-main.jpg`
   - Verify all images are under 200KB and in WebP or optimized JPEG format

3. **Add audio file**
   - Place background music at `audio/bgm.mp3`
   - Verify file size is under 2MB

4. **Configure account numbers**
   - Groom side: bank name, account holder, account number
   - Bride side: bank name, account holder, account number

5. **Set venue coordinates**
   - Update latitude/longitude constants in `main.js`
   - Verify coordinates display correctly on Kakao Map

### Dependencies
- Phase 1-4 (all structural work complete)
- **BLOCKER:** Couple must provide all personal content (photos, text, music, account info)

### Risks
- Photos may not be optimized; provide instructions or tooling references (Squoosh)
- Couple may change content after initial integration; keep content easily editable

### Related Requirements
- A-001 through A-005

---

## Phase 6: Testing & Deployment

**Priority:** Final Goal
**Complexity:** Medium
**Output:** Deployed, tested website

### Tasks

1. **Cross-browser testing**
   - Chrome Android (physical device or emulator)
   - Safari iOS (physical device or simulator)
   - KakaoTalk in-app browser (Android and iOS)
   - Samsung Internet (if available)
   - Chrome Desktop, Safari Desktop, Firefox Desktop

2. **Performance testing**
   - Run Lighthouse audit (target: Mobile score > 85)
   - Verify FCP < 1.5s on simulated 4G
   - Verify total page weight < 5MB
   - Check for CLS issues (layout shift from images without dimensions)

3. **Functionality testing**
   - Gallery lightbox: open, navigate, close, keyboard, touch swipe
   - Guest book: submit, display, persist across page reload
   - Account copy: verify clipboard write and toast notification
   - Audio toggle: play, pause, muted state on load
   - Kakao Map: render, marker, zoom, fallback when API fails
   - Scroll animations: verify all sections animate on entry
   - Collapsible accounts: expand, collapse, animation smoothness

4. **Accessibility testing**
   - Color contrast check (minimum 4.5:1 ratio for text)
   - Keyboard navigation through all interactive elements
   - Screen reader testing for ARIA labels and roles
   - Touch target size verification (44x44px minimum)

5. **Deploy to GitHub Pages**
   - Push all files to `main` branch
   - Configure GitHub Pages in repository settings
   - Verify live URL works correctly
   - Test KakaoTalk link preview (Open Graph tags)

6. **Post-deployment verification**
   - Share test link via KakaoTalk to verify in-app browser experience
   - Verify Kakao Map loads with correct API key and domain
   - Confirm audio controls work across all target browsers

### Dependencies
- Phases 1-5 (all implementation complete)

### Risks
- GitHub Pages may take a few minutes to propagate changes
- KakaoTalk link preview cache may need time to update

### Related Requirements
- REQ-UI-024, REQ-UI-025, REQ-UI-027

---

## Architecture Overview

```
index.html (Single Page)
  |
  +-- assets/css/style.css
  |     +-- CSS Custom Properties (Design Tokens)
  |     +-- Mobile-first styles with media queries
  |     +-- Animation keyframes
  |
  +-- assets/js/main.js
  |     +-- Audio Player
  |     +-- Gallery & Lightbox
  |     +-- Calendar Generator
  |     +-- Kakao Map Init
  |     +-- Account Copy
  |     +-- Guest Book (localStorage)
  |     +-- Scroll Animations (Intersection Observer)
  |     +-- Collapsible Sections
  |
  +-- assets/images/
  |     +-- gallery/photo-01..24.jpg
  |     +-- couple-main.jpg
  |
  +-- audio/bgm.mp3
  |
  +-- External CDNs
        +-- Google Fonts (Noto Serif KR, Noto Sans KR, Playfair Display)
        +-- Kakao Maps SDK (//dapi.kakao.com/v2/maps/sdk.js)
```

---

## Risk Summary

| Risk                                  | Severity | Mitigation                                                |
|---------------------------------------|----------|-----------------------------------------------------------|
| Kakao Maps API key not configured     | High     | Implement fallback with static links; document setup steps |
| Couple photos not optimized           | Medium   | Provide Squoosh/ImageMagick optimization guide             |
| KakaoTalk in-app browser quirks       | Medium   | Test early on physical devices; add browser-specific fixes |
| Audio autoplay blocked                | Low      | Start muted; require user interaction to play              |
| localStorage cleared by user          | Low      | Accept as limitation; document optional backend options    |
| Content changes after implementation  | Low      | Keep all content in clearly marked constants/sections      |

---

## Performance Budget

| Asset Category    | Target Size | Strategy                                          |
|-------------------|-------------|---------------------------------------------------|
| HTML              | < 15KB      | Semantic, minimal markup                          |
| CSS               | < 20KB      | No framework, custom properties, no preprocessor  |
| JavaScript        | < 15KB      | Vanilla JS, no dependencies                       |
| Gallery Images    | < 4.8MB     | 24 images x 200KB max each, WebP format           |
| Main Photo        | < 200KB     | Optimized JPEG or WebP                            |
| Audio             | < 2MB       | Compressed MP3 at 128kbps                         |
| Fonts (cached)    | ~200KB      | Google Fonts CDN with font-display: swap          |
| **Total**         | **< 5MB**   | Well within target budget                         |

---

## File Dependency Order

```
1. index.html        (no dependencies)
2. style.css         (depends on: HTML class names from index.html)
3. main.js           (depends on: HTML IDs and classes, CSS animation classes)
4. images/gallery/*  (referenced by: index.html img src attributes)
5. audio/bgm.mp3     (referenced by: main.js Audio constructor)
```
