---
id: SPEC-UI-001
document: acceptance
version: "1.0.0"
status: draft
created: "2026-03-03"
updated: "2026-03-03"
author: "9bit"
---

# Acceptance Criteria: SPEC-UI-001 Korean Wedding Invitation Website

## Overview

This document defines the acceptance criteria for the Korean wedding invitation website. Each criterion follows the Given-When-Then format and maps to requirements defined in spec.md.

---

## AC-001: Page Structure and Section Order

**Related Requirements:** REQ-UI-001, REQ-UI-003

### Scenario 1: Full page loads with all sections
```
Given the user opens the wedding invitation URL in a browser
When the page finishes loading
Then all 9 sections are rendered in vertical scroll order:
  Header, Save the Date, Invitation Message, Photo Gallery,
  Calendar, Location, Kakao Map, Account Numbers, Guest Book
And the content area does not exceed 640px width on desktop screens
```

### Scenario 2: Semantic HTML structure
```
Given the page has loaded
When the HTML source is inspected
Then each section uses semantic HTML elements (header, section, div)
And each section has a unique ID attribute matching the defined section names
```

---

## AC-002: Mobile-First Responsive Layout

**Related Requirements:** REQ-UI-002, REQ-UI-005, REQ-UI-007

### Scenario 1: Mobile viewport rendering
```
Given the user opens the page on a device with viewport width < 768px
When the page renders
Then the layout displays in a single-column vertical stack
And font sizes are readable without zooming (minimum 16px body text)
And section spacing uses the mobile value (40px)
```

### Scenario 2: Tablet viewport rendering
```
Given the user opens the page on a device with viewport width between 768px and 1023px
When the page renders
Then the gallery displays in a 3-column grid
And section spacing increases to the tablet value
```

### Scenario 3: Desktop viewport rendering
```
Given the user opens the page on a device with viewport width >= 1024px
When the page renders
Then the gallery displays in a 4-column grid
And section spacing uses the desktop value (60px)
And content is centered within a max-width container
```

---

## AC-003: Photo Gallery Grid Display

**Related Requirements:** REQ-UI-008, REQ-UI-023, REQ-UI-029

### Scenario 1: Gallery images load correctly
```
Given the page has loaded on a mobile device
When the gallery section is scrolled into view
Then approximately 24 photos are displayed in a 2-column grid layout
And each image has loading="lazy" attribute
And each image has explicit width and height attributes
```

### Scenario 2: No layout shift during image loading
```
Given the page is loading on a 4G connection
When gallery images load progressively
Then the page layout does not shift (CLS = 0 for gallery section)
And placeholder space is reserved for each image before it loads
```

---

## AC-004: Gallery Lightbox

**Related Requirements:** REQ-UI-009, REQ-UI-010, REQ-UI-011

### Scenario 1: Open lightbox on photo tap
```
Given the gallery section is displayed with all photos
When the user taps/clicks on any gallery photo
Then a full-screen lightbox modal appears with the selected photo
And the photo is displayed at maximum viewable size
And background page scrolling is disabled
And a close button (X) is visible in the lightbox
```

### Scenario 2: Navigate between photos in lightbox
```
Given the lightbox is open showing a photo
When the user taps the next arrow or swipes left
Then the next photo in the gallery sequence is displayed
When the user taps the previous arrow or swipes right
Then the previous photo in the gallery sequence is displayed
```

### Scenario 3: Close lightbox
```
Given the lightbox is open
When the user taps the close button, presses Escape, or taps the backdrop area
Then the lightbox closes
And background page scrolling is re-enabled
And the page returns to the gallery section position
```

### Scenario 4: Keyboard navigation in lightbox
```
Given the lightbox is open on a desktop browser
When the user presses the left arrow key
Then the previous photo is displayed
When the user presses the right arrow key
Then the next photo is displayed
When the user presses the Escape key
Then the lightbox closes
```

---

## AC-005: Kakao Map Integration

**Related Requirements:** REQ-UI-013, REQ-UI-014

### Scenario 1: Map renders successfully
```
Given the Kakao Maps API key is configured and the domain is registered
When the page loads and the map section becomes visible
Then an interactive Kakao Map is rendered in the #map container
And the map is centered on the venue coordinates
And a marker is displayed at the venue location
And the user can zoom and pan the map
```

### Scenario 2: Map fallback on API failure
```
Given the Kakao Maps API key is missing or the SDK fails to load
When the page loads
Then the #map container displays a fallback message with the venue address
And the fallback includes a link to open Kakao Maps externally
And the fallback includes a link to open Google Maps as an alternative
And no JavaScript error is thrown to the console
```

---

## AC-006: Account Number Copy

**Related Requirements:** REQ-UI-015, REQ-UI-016

### Scenario 1: Copy account number to clipboard
```
Given the account section is expanded (groom or bride side)
When the user taps the copy button next to a bank account number
Then the account number string is copied to the device clipboard
And a toast notification appears confirming the copy action
And the toast notification disappears after approximately 2 seconds
```

### Scenario 2: Expand and collapse account sections
```
Given the account section is visible
When the user taps the "Groom Side" header
Then the groom-side account details expand with a smooth animation
And a chevron icon rotates to indicate the expanded state
When the user taps the "Groom Side" header again
Then the groom-side account details collapse with a smooth animation
And the chevron icon rotates back to the collapsed state
```

### Scenario 3: Copy fallback for restricted browsers
```
Given the user is in a browser that restricts the Clipboard API
When the user taps the copy button
Then a fallback copy mechanism is attempted (execCommand or text selection)
And the user is notified whether the copy succeeded or failed
```

---

## AC-007: Guest Book

**Related Requirements:** REQ-UI-017, REQ-UI-018, REQ-UI-019

### Scenario 1: Open guest book modal
```
Given the guest book section is visible
When the user taps the "Leave a Message" button
Then a modal popup appears with a form containing name and message fields
And a submit button is visible
And background page scrolling is disabled
```

### Scenario 2: Submit a guest book message
```
Given the guest book modal is open
And the user has entered a name and a message
When the user taps the submit button
Then the message is saved to browser localStorage
And the new message appears in the guest book message list
And the form fields are cleared
And a success confirmation is shown briefly
```

### Scenario 3: Validation prevents empty submission
```
Given the guest book modal is open
And the name field or message field is empty
When the user taps the submit button
Then the form is not submitted
And a validation message indicates which fields are required
```

### Scenario 4: Messages persist across page reloads
```
Given a guest has previously submitted a message
When the page is reloaded in the same browser
Then the previously submitted message is displayed in the guest book list
```

### Scenario 5: Close guest book modal
```
Given the guest book modal is open
When the user taps the close button, presses Escape, or taps the backdrop
Then the modal closes
And background page scrolling is re-enabled
```

---

## AC-008: Audio Toggle

**Related Requirements:** REQ-UI-020, REQ-UI-021, REQ-UI-022

### Scenario 1: Audio starts in muted state
```
Given the user opens the page for the first time
When the page finishes loading
Then the background music is NOT playing (respecting browser autoplay policy)
And the audio toggle button displays a muted/paused icon
And the audio toggle button is visible as a fixed floating element
```

### Scenario 2: User toggles audio on
```
Given the page is loaded and audio is muted/paused
When the user taps the audio toggle button
Then the background music begins playing
And the button icon changes to an unmuted/playing state
```

### Scenario 3: User toggles audio off
```
Given the background music is currently playing
When the user taps the audio toggle button
Then the music pauses
And the button icon changes to a muted/paused state
```

### Scenario 4: Audio button stays visible during scroll
```
Given the user is scrolling through the page
When the user scrolls to any section
Then the audio toggle button remains visible in a fixed position
And the button does not overlap critical content
```

---

## AC-009: Performance Requirements

**Related Requirements:** REQ-UI-023, REQ-UI-024, REQ-UI-025, REQ-UI-029

### Scenario 1: First Contentful Paint
```
Given the page is loaded on a simulated 4G mobile connection
When Lighthouse performance audit is run
Then the First Contentful Paint (FCP) is less than 1.5 seconds
```

### Scenario 2: Total page weight
```
Given all gallery images are optimized and included
When the total transfer size is measured
Then the total page weight is less than 5MB
And no individual gallery image exceeds 200KB
```

### Scenario 3: Lighthouse mobile score
```
Given the page is deployed to GitHub Pages
When a Lighthouse audit is run in mobile mode
Then the Performance score is greater than 85
And there are no critical accessibility violations
```

### Scenario 4: Lazy loading verification
```
Given the page is loaded on a slow connection
When only the header and first section are visible
Then gallery images below the fold have NOT been downloaded yet
And images download only as the user scrolls near them
```

---

## AC-010: KakaoTalk In-App Browser Compatibility

**Related Requirements:** REQ-UI-027, REQ-UI-028

### Scenario 1: Page renders in KakaoTalk
```
Given a user receives the wedding invitation link via KakaoTalk
When the user taps the link and it opens in KakaoTalk's in-app browser
Then the full page renders correctly with all sections visible
And the layout is mobile-optimized
And no JavaScript errors prevent page functionality
```

### Scenario 2: Interactive features work in KakaoTalk
```
Given the page is open in KakaoTalk's in-app browser
When the user interacts with page features
Then the gallery lightbox opens and closes correctly
And the account number copy function works
And the guest book modal opens, accepts input, and saves messages
And the audio toggle button plays and pauses music
```

### Scenario 3: Kakao Map in KakaoTalk browser
```
Given the page is open in KakaoTalk's in-app browser
When the map section is visible
Then the Kakao Map renders (or the fallback is displayed)
And the external Kakao Maps link opens the Kakao Maps app if installed
```

---

## AC-011: Scroll Animations

**Related Requirements:** REQ-UI-006

### Scenario 1: Sections animate on scroll
```
Given the page has loaded
When the user scrolls and a new section enters the viewport
Then the section content fades in with an upward motion animation
And the animation plays only once (not on re-entry)
```

---

## AC-012: Calendar Widget

**Related Requirements:** REQ-UI-012

### Scenario 1: Calendar displays correctly
```
Given the page has loaded
When the calendar section is visible
Then a monthly calendar for the wedding month is displayed
And the wedding date is visually highlighted with the accent color
And day-of-week headers are displayed in Korean
And the calendar accurately reflects the days of the month
```

---

## Quality Gates

### Definition of Done

All of the following must be satisfied before the SPEC is considered complete:

- [ ] All 9 HTML sections render in correct order
- [ ] CSS is mobile-first with working breakpoints at 768px and 1024px
- [ ] Gallery lightbox opens, navigates, and closes on mobile and desktop
- [ ] Guest book saves and retrieves messages from localStorage
- [ ] Account numbers can be copied to clipboard with confirmation
- [ ] Audio toggle works (play/pause) with muted initial state
- [ ] Kakao Map renders with venue marker (or fallback displays)
- [ ] Calendar widget correctly highlights the wedding date
- [ ] Scroll animations trigger on section entry
- [ ] FCP < 1.5s on simulated 4G
- [ ] Total page weight < 5MB
- [ ] All images have loading="lazy" and explicit dimensions
- [ ] Touch targets are minimum 44x44px
- [ ] Page works correctly in KakaoTalk in-app browser
- [ ] No JavaScript errors in browser console on page load
- [ ] WCAG 2.1 AA color contrast ratios are met
- [ ] Page is deployed and accessible on GitHub Pages

### Verification Methods

| Method                | Tool / Approach                              | Criteria          |
|-----------------------|----------------------------------------------|-------------------|
| Visual Inspection     | Manual testing on physical devices           | Layout, styling   |
| Performance Audit     | Chrome DevTools Lighthouse                   | FCP, score > 85   |
| Accessibility Audit   | Lighthouse + axe DevTools extension          | No critical issues|
| Cross-Browser Testing | Chrome Android, Safari iOS, KakaoTalk        | All features work |
| Clipboard Testing     | Manual test on mobile devices                | Copy + toast      |
| LocalStorage Testing  | Submit message, reload, verify persistence   | Data persists     |
| Network Throttling    | Chrome DevTools 4G preset                    | Page loads < 3s   |
| Page Weight Check     | Chrome DevTools Network tab                  | Total < 5MB       |
