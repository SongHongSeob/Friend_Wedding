# Technology Stack: Friend Wedding Invitation Website

## Stack Overview

| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic structure, accessibility |
| Styling | CSS3 | Variables, Grid, Flexbox, animations — no preprocessor needed |
| Interactivity | Vanilla JavaScript (ES2020+) | No build step, fast load, zero dependencies |
| Map | Kakao Maps JavaScript API v3 | Standard in Korean web apps; embeds natively |
| Hosting | GitHub Pages | Free, static, zero-config deployment |
| Fonts | Google Fonts (Noto Serif KR, Noto Sans KR, Playfair Display) | Korean-optimized, beautiful serif headings |

---

## Technology Rationale

### Why HTML5 + CSS3 + Vanilla JavaScript

A wedding invitation website is a one-page static site with a clear, finite feature set. There is no need for a JavaScript framework:

- **No build step:** The project can be edited and deployed without npm, webpack, or any CLI tooling. The couple or any developer can open `index.html` directly.
- **Instant deployment:** Static files are uploaded directly to GitHub Pages — no CI/CD pipeline needed.
- **Fast load times:** Zero framework overhead means the page loads quickly on mobile networks (3G/LTE), which is critical since most guests will open the link via KakaoTalk on their phones.
- **Long-term maintainability:** No dependency rot. The site will continue to work years from now without updating packages or resolving security vulnerabilities.
- **Low barrier to customization:** Any developer (or the couple themselves with basic skills) can modify text, photos, and colors without understanding a framework.

### Why Not React / Vue / Next.js

A framework like React or Next.js would add unnecessary complexity:
- Requires Node.js and npm to develop and build
- Adds hundreds of kilobytes to bundle size
- Introduces build pipeline that can break with dependency updates
- Overkill for a single-page static invitation site

---

## Kakao Maps API

### Overview
Kakao Maps is the dominant mapping service in South Korea. Wedding guests will be familiar with it and can open directions directly in the Kakao Maps mobile app.

### Setup Steps

1. **Create a Kakao Developer Account**
   - Visit: https://developers.kakao.com
   - Sign in with a Kakao account
   - Create a new application

2. **Register the Application**
   - Go to "My Applications" → "Add Application"
   - Set Application Name (e.g., "Wedding Invitation")
   - Note the **JavaScript App Key** from the app summary page

3. **Register the Domain (Allowed Origins)**
   - In the app settings, go to "Platform" → "Web"
   - Add the deployment URL (e.g., `https://username.github.io`)
   - Add `http://localhost:8080` for local development

4. **Embed the SDK in `index.html`**
   ```html
   <script type="text/javascript"
     src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY">
   </script>
   ```

5. **Initialize the Map in `main.js`**
   ```javascript
   const container = document.getElementById('map');
   const options = {
     center: new kakao.maps.LatLng(VENUE_LATITUDE, VENUE_LONGITUDE),
     level: 3
   };
   const map = new kakao.maps.Map(container, options);
   ```

6. **Add a Custom Marker**
   - Use `kakao.maps.Marker` to place a pin at the venue coordinates
   - Optionally use `kakao.maps.InfoWindow` for a popup label with the venue name

### Finding Venue Coordinates
- Open https://map.kakao.com
- Search for the venue name
- Right-click the pin → "Copy coordinates" to get latitude/longitude

### API Key Security
The Kakao Maps JavaScript API key is a **public key** intended for client-side use. It is safe to include directly in `index.html`. Protect it only by registering specific allowed domains in the Kakao developer console.

---

## Responsive Design Approach

### Mobile-First Strategy
CSS is written for mobile screens first, then enhanced for larger screens using `min-width` media queries:

```css
/* Mobile base styles (default) */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}
```

### Breakpoints
| Breakpoint | Width | Target Devices |
|---|---|---|
| Mobile (default) | < 768px | Smartphones (primary target) |
| Tablet | 768px – 1023px | Tablets, large phones |
| Desktop | 1024px+ | Laptops, desktops |

### Layout Techniques
- **CSS Grid:** Photo gallery, two-column account section
- **CSS Flexbox:** Header, navigation, inline elements
- **CSS Custom Properties:** Design tokens for consistent spacing and color
- **`max-width: 640px` container:** Content is centered with a max-width for readability on desktop, mimicking a mobile frame

### Typography
- Font sizes use `clamp()` for fluid scaling between mobile and desktop
- Minimum tap target size: 44x44px for all buttons (WCAG 2.1 AA)
- Line height: 1.6–1.8 for body text; 1.2–1.4 for headings

---

## Deployment: GitHub Pages

### Why GitHub Pages
- Free hosting for static sites
- The reference example (mirew.github.io) already uses GitHub Pages
- Zero server maintenance
- Automatic HTTPS via Let's Encrypt

### Setup Steps

1. Create a GitHub repository (e.g., `friend-wedding`)
2. Push all project files to the `main` branch
3. Go to repository **Settings** → **Pages**
4. Set Source to "Deploy from a branch" → select `main` → `/ (root)`
5. Site will be available at `https://username.github.io/friend-wedding/`

### Custom Domain (Optional)
- Purchase a domain (e.g., `wedding.example.com`)
- Add a `CNAME` file to the repository root containing the domain name
- Configure DNS A records to point to GitHub Pages IPs

### Alternative: Vercel
If GitHub Pages is not preferred, Vercel offers:
- Drag-and-drop deployment from the Vercel dashboard
- Instant deployment URL (e.g., `friend-wedding.vercel.app`)
- Automatic HTTPS and CDN

---

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome (Android) | 90+ | Primary target — most Korean KakaoTalk users |
| Safari (iOS) | 14+ | iPhone users; test audio autoplay behavior carefully |
| Chrome (Desktop) | 90+ | Desktop guests |
| Safari (Desktop) | 14+ | Mac users |
| Samsung Internet | 14+ | Common on Galaxy devices in Korea |
| Firefox | 88+ | Secondary support |

### Known Browser Quirks
- **Audio Autoplay:** Modern browsers require a user gesture before playing audio. Implement a "tap to unmute" overlay on first load or start audio muted and show an unmute button.
- **Kakao Maps on iOS:** Works correctly in mobile Safari via the JavaScript SDK. Deep link to the Kakao Maps app uses the `kakaomap://` URL scheme.
- **CSS `gap` in Flexbox:** Supported in all targets above; no workaround needed.

---

## Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| First Contentful Paint | < 1.5s | Inline critical CSS, defer non-critical scripts |
| Total Page Weight | < 5MB | Compress images to WebP, optimize audio |
| Gallery Image Size | < 200KB each | Use WebP format, resize to 800x1000px max |
| Lighthouse Mobile Score | > 85 | Mobile-first CSS, lazy-load gallery images |

### Image Optimization
- Convert photos to WebP using tools like Squoosh (https://squoosh.app) or ImageMagick
- Use `loading="lazy"` attribute on all gallery `<img>` tags
- Provide `width` and `height` attributes to prevent layout shift (CLS)

---

## No Backend Required

This is a fully static site. All features work without a server:

| Feature | Implementation |
|---|---|
| Guest book messages | Stored in `localStorage` (client-side only) OR use a free service like Formspree / EmailJS for email delivery |
| Account number copy | `navigator.clipboard.writeText()` API — no server needed |
| Kakao Map | Client-side JavaScript API — no proxy needed |
| Photo gallery | Static image files served directly |

### Optional Guest Book Backend
If persistent guest book messages are needed (messages survive browser cache clearing):
- **Formspree** (https://formspree.io): Free tier, form submissions emailed to the couple
- **EmailJS** (https://www.emailjs.com): Free tier, sends email on form submit without a backend
- **Notion API**: Write guest book entries directly to a Notion database

These are all zero-cost, zero-infrastructure options compatible with a static deployment.
