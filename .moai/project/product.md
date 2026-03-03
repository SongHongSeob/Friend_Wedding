# Product Definition: Friend Wedding Invitation Website (친구 청첩장)

## Project Overview

**Project Name:** Friend Wedding Invitation Website (친구 청첩장)

**Description:** A beautiful, mobile-responsive digital wedding invitation website designed to provide wedding guests with all the information they need — from event details and venue directions to a guest book and gift account information. The site is designed to feel warm, elegant, and personal, reflecting the couple's story and aesthetic.

**Target Audience:** Wedding guests — friends and family of the couple — who will primarily access the site on mobile devices after receiving a KakaoTalk or SMS invitation link.

---

## Core Features

### 1. Hero Section / Header
- Couple names displayed prominently with decorative typography (serif, elegant)
- Background audio with a mute/unmute toggle button
- Subtle entrance animations for a refined first impression

### 2. Save the Date
- Large, prominent display of the wedding date and time
- Day of the week included (e.g., "Saturday, May 10, 2025 · 12:00 PM")
- Stylized typography to make the date a visual centerpiece

### 3. Invitation Message (청첩장 문구)
- Personal narrative of the couple's story written in Korean
- Bilingual layout supporting both Korean and English text
- Names of parents of both the groom and bride included per Korean tradition
- Warm, literary tone appropriate for a formal invitation

### 4. Photo Gallery
- Grid layout displaying approximately 24 couple photos
- Lightbox modal for full-screen viewing of individual photos
- Smooth transitions and touch-swipe support for mobile users

### 5. Calendar Widget
- Visual mini-calendar highlighting the wedding date
- Month view with the specific date visually accented
- Simple, clean design that reinforces the "Save the Date" section

### 6. Location & Venue Details
- Venue name, full address, and floor/hall information
- Transit directions (subway line, bus routes, walking directions)
- Parking information if applicable

### 7. Kakao Map Integration
- Embedded interactive Kakao Maps with a custom venue marker
- Zoom and pan functionality
- Direct link to Kakao Maps app for mobile navigation
- Fallback to Google Maps link for non-Kakao users

### 8. Account Information (계좌번호)
- Bank account numbers for monetary gifts — standard in Korean wedding culture
- Separate collapsible sections for the groom's side and bride's side
- One-tap copy button for each account number for mobile convenience
- Discreet, tasteful presentation style

### 9. Guest Book (방명록)
- Interactive popup/modal for guests to leave congratulatory messages
- Name and message fields with submit functionality
- Display of submitted messages (stored locally or via a lightweight backend)
- Moderation-friendly design

### 10. Audio Player
- Background music that plays on page load (with browser autoplay policy handling)
- Floating mute/unmute toggle button accessible at all times
- Graceful fallback when autoplay is blocked by the browser

---

## Use Cases

| Use Case | Description |
|---|---|
| View Invitation | Guest opens the link on mobile/desktop and reads the full invitation |
| Find the Venue | Guest uses the Kakao Map to get directions to the wedding hall |
| Save the Date | Guest notes the date/time from the visual calendar widget |
| Copy Account Number | Guest copies a bank account number to send a monetary gift |
| Leave a Message | Guest writes a congratulatory note in the guest book popup |
| View Photos | Guest browses couple photos in the gallery with lightbox |
| Share the Invitation | Guest shares the URL with other guests via KakaoTalk |

---

## Design Principles

- **Mobile-First:** The majority of guests will view on smartphones; layout and interactions are optimized for touch
- **Minimalist Elegance:** White/cream backgrounds, serif typography, generous whitespace
- **Bilingual:** Korean primary, English accent text for dates, venue, and section headers
- **Performance:** Fast load time even on mobile networks; images optimized, no heavy frameworks
- **Accessibility:** Sufficient color contrast, readable font sizes, keyboard-navigable

---

## Out of Scope

- User authentication or accounts
- Payment processing
- RSVP management with a database backend (guest book uses a simple static or serverless approach)
- Admin dashboard
- Email notification system
