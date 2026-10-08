# TPS Empire — Comprehensive Technology Stack Documentation

This document provides a thorough technical overview of all technologies, frameworks, libraries, custom modules, build tools, server configurations, and performance architectures utilized in the **TPS Empire** web platform.

---

## 1. High-Level Technology Overview

```
+-----------------------------------------------------------------------------------+
|                                  TPS EMPIRE                                       |
|                       Modern Responsive Web Application                           |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
[FRONTEND UI & LOGIC]           [ANIMATION & MOTION]             [INFRASTRUCTURE & SEO]
 - HTML5 Semantic Markup         - requestAnimationFrame Smooth Engine- Apache Web Server (.htaccess)
 - Vanilla CSS3 & SCSS           - 3D CSS Transforms & GPU Accel     - GZIP / Deflate Compression
 - Bootstrap 4.x Framework       - Custom Scroll-Driven Triggers     - Mod_Expires Browser Caching
 - Modern ES6+ / Vanilla JS      - Owl Carousel 2 & Magnific Popup   - HTTP Security Headers
 - jQuery 3.2.1 + Plugins        - Waypoints, Stellar & Scrollax     - Schema.org JSON-LD Metadata
```

---

## 2. Core Frontend Technologies

### 2.1 Markup & Document Structure
- **HTML5 (Semantic Web Standards)**
  - Utilizes semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<time>`, `<picture>`).
  - Strict accessibility principles with `aria-label`, `aria-controls`, `aria-expanded`, and `.sr-only` screen-reader tags.
  - Responsive viewport meta tags configured for high-DPI and mobile devices.

### 2.2 Styling & Preprocessing
- **Vanilla CSS3**
  - **CSS Custom Properties (Variables)**: Standardized color palettes, typography scales, z-index layers, and transitions.
  - **Layout Engines**: Advanced **CSS Grid** and **Flexbox** implementations for responsive, fluid layouts across 5 breakpoints (`xs < 576px`, `sm >= 576px`, `md >= 768px`, `lg >= 992px`, `xl >= 1200px`).
  - **Visual Effects**: Backdrop blur filters (`backdrop-filter: blur(12px)`), linear & radial gradients, glassmorphism UI cards, drop shadows, and subtle border highlights.
- **SCSS / SASS (Syntactically Awesome Style Sheets)**
  - Source directory: `scss/` (entry point `scss/style.scss`).
  - Modular stylesheet architecture including mixins, variables, nested rules, functions, and responsive breakpoint generators.
- **Bootstrap 4.x UI Framework**
  - Compiled and custom-integrated via `css/bootstrap.min.css` and `scss/bootstrap/`.
  - Grid system, responsive flexbox utilities, badges, cards, navigation bars, and modal containers.

### 2.3 JavaScript Engine & Scripting
- **Modern Vanilla JavaScript (ES5 / ES6+)**
  - Native DOM querying, traversal, and dynamic element creation.
  - Performance-optimized animation loops via `window.requestAnimationFrame`.
  - Event delegation, passive scroll listeners (`{ passive: true }`), and `ResizeObserver` / `getBoundingClientRect` positioning.
  - Encapsulation using **IIFEs (Immediately Invoked Function Expressions)** to eliminate global scope pollution.
- **Deferred Script Loading**
  - All non-critical JavaScript files are loaded with the `defer` attribute to ensure unblocked first contentful paint (FCP).

---

## 3. Third-Party JavaScript Libraries & Plugins

| Library / Plugin | Version / File | Purpose & Role |
| :--- | :--- | :--- |
| **jQuery** | `3.2.1` (`jquery.min.js`) | Fast, cross-browser DOM manipulation, event handling, and utility methods. |
| **jQuery Migrate** | `3.0.1` (`jquery-migrate-3.0.1.min.js`) | Backward compatibility bridge for older plugin dependencies. |
| **Popper.js** | `1.x` (`popper.min.js`) | Precise mathematical placement engine for popovers, dropdowns, and tooltips. |
| **Bootstrap JS** | `4.x` (`bootstrap.min.js`) | Interactive Bootstrap components (modals, collapses, alerts, tab navigation). |
| **Owl Carousel 2** | `2.x` (`owl.carousel.min.js`) | Touch-enabled, responsive carousel slider for client testimonials, case studies, and partner logos. |
| **Magnific Popup** | `1.x` (`jquery.magnific-popup.min.js`) | Lightbox modal viewer for high-resolution images, galleries, and embedded video popups. |
| **Waypoints** | `4.x` (`jquery.waypoints.min.js`) | Triggering animation states and CSS classes when elements scroll into the viewport. |
| **Stellar.js** | `0.6.2` (`jquery.stellar.min.js`) | Parallax scrolling effects on background hero banners and decorative elements. |
| **Scrollax** | `1.0.0` (`scrollax.min.js`) | Smooth parallax scroll plugin driven by data attributes (`data-scrollax`). |
| **jQuery Easing** | `1.3` (`jquery.easing.1.3.js`) | Advanced cubic and exponential easing equations (`easeInOutExpo`, `easeOutQuad`) for animations. |
| **jQuery AnimateNumber** | `0.0.14` (`jquery.animateNumber.min.js`) | Counter animation library for stats (projects completed, satisfied clients, team members). |
| **Bootstrap Datepicker** | `1.x` (`bootstrap-datepicker.js`) | Interactive calendar widget for consultation booking and schedule forms. |
| **Google Maps API** | Custom (`google-map.js`) | Maps JavaScript API integration for geographic visualization of Lucknow headquarters. |

---

## 4. Proprietary Custom Interactive & Motion Modules

The project features a modular suite of bespoke JavaScript controllers and paired CSS stylesheets:

### 4.1 Global Navigation & Page Flow
- **Global Morphing Navbar & Drawer Menu** (`js/morphing-nav.js`, `css/morphing-nav.css`)
  - Universal floating hamburger button that detects page scroll depth.
  - Slide-over right offcanvas drawer with frosted glass styling and active route detection across root and subdirectories.
  - Floating top-left brand badge.
- **Smooth Page-to-Page Transition Engine** (`js/page-transition.js`, `css/page-transition.css`)
  - Intercepts internal link clicks, triggers a smooth exit curtain fade/slide, and reveals new pages with entry transitions.

### 4.2 Hero & Banner Experience
- **Scroll-Driven Hero Banner Transition** (`js/hero-banner-transition.js`, `css/hero-banner-transition.css`)
  - Kinetic multi-phase transition transforming hero headers during initial downward scroll.
- **Hero Focal Zoom & Emergence Controller** (`js/hero-scroll-emergence.js`, `css/hero-scroll-emergence.css`)
  - Zoom-out depth effects and card emergence animations synchronized with scroll delta.

### 4.3 Interactive Showcases & Streams
- **Strategic Work Accordion & Image Showcase** (`js/strategic-work-scroll.js`, `css/strategic-work-scroll.css`)
  - Dual-pane scroll-pinned experience synchronizing left-hand text accordion items with right-hand image fade/zoom layers.
- **Exclusive IT Solutions Sticky Side-by-Side Stream** (`js/exclusive-it-solutions-stream.js`, `css/exclusive-it-solutions-stream.css`)
  - Sticky-pinned left header with independent smooth scrolling right-column feature cards.
- **Horizontal Consult Cards Stream** (`js/consult-cards-stream.js`, `css/consult-cards-stream.css`)
  - Converts vertical scroll progress into horizontal consultation service cards movement.
- **Insights Scatter-Stack Animation** (`js/insights-scatter-stack.js`, `css/insights-scatter-stack.css`)
  - Interactive 3D stacked card animation that scatters on scroll and stacks neatly into focus.
- **TPS Ecosystem & Split Showcase** (`js/tps-ecosystem-animation.js`, `js/tps-split-scroll-showcase.js`, `css/tps-ecosystem-animation.css`, `css/tps-split-scroll-showcase.css`)
  - Multi-service ecosystem visualization with interactive node links and split-screen reveal mechanics.

### 4.4 Services, FAQs & Knowledge Base
- **Layered Wave Transitions & FAQ Cascade** (`js/faq-layered-reveal.js`, `js/about-faq-cascade.js`, `css/faq-layered-reveal.css`, `css/about-faq-cascade.css`)
  - Fluid multi-layer cubic bezier wave section transitions over FAQ and Footer sections with scroll-driven path morphing and emerging section physics.
  - Interactive automatic hover-to-reveal accordion drawers where hovering over any FAQ question immediately expands its answer with smooth cubic-bezier easing, dynamic chevron rotation, and elevation feedback.
  - Staggered scroll-driven accordion reveals with category filtering, feedback voting, direct link copying, and full keyboard/click accessibility.
- **Services Background Morph & Card Stacks** (`js/services-bg-morph.js`, `js/services-scroll-reveal.js`, `js/stacked-service-cards.js`, `css/services-bg-morph.css`, `css/services-scroll-reveal.css`, `css/stacked-service-cards.css`)
  - Dynamic gradient shifts on section scroll and 3D stacked service cards with depth perspective.
- **Why Choose Cards & Flying Counters** (`js/why-choose-cards.js`, `js/flying-consult-counters.js`, `js/leaders-vision-reveal.js`, `css/why-choose-cards.css`, `css/flying-consult-counters.css`, `css/leaders-vision-reveal.css`)
  - Kinetic statistics counters flying into position and interactive card hover physics.
- **Blog Circular Portal Reveal & Stream** (`js/blog-circle-reveal.js`, `js/blog-stream-scroll.js`, `css/blog-circle-reveal.css`, `css/blog-stream-scroll.css`)
  - Circular clip-path portal expansion opening up featured blog articles.

---

## 5. Typography, Icons & Visual Assets

### 5.1 Web Typography
- **Montserrat Font Family** (Google Fonts CDN): Modern geometric sans-serif loaded with weights `200` through `800`.
- **DM Sans Font Family** (Google Fonts CDN): Crisp, high-legibility geometric sans-serif for body copy and headings.
- **Resource Preconnection**: `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin` for reduced font loading latency.
- **Non-blocking CSS loading**: `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">` with `<noscript>` fallbacks.

### 5.2 Iconography
- **FontAwesome 4.7.0**: Vector icon font for social media links (Facebook, Twitter/X, Instagram, LinkedIn), contact markers, and arrows.
- **Flaticon**: Specialized vector icon font suite stored in `fonts/flaticon/` and styled via `css/flaticon.css` for IT, server, cybersecurity, cloud, and programming visuals.
- **Inline SVG Icons**: Crisp, scalable vector shapes used for navigation controls, close icons, indicators, and loading spinners.

---

## 6. Build Tooling & Asset Compilation

- **Prepros 6** (`prepros-6.config`)
  - **SCSS Compilation**: Automated compilation of `scss/style.scss` and Bootstrap SCSS into unified CSS.
  - **Autoprefixer**: Adds vendor prefixes (`-webkit-`, `-moz-`, `-ms-`) for cross-browser CSS compatibility.
  - **Asset Minification**: Generates compressed production files (`css/style.min.css`).
  - **Live Reload & Local Server**: Local file-watcher environment for real-time browser synchronization during development.

---

## 7. Web Server Configuration & Infrastructure

### 7.1 Server Runtime
- **Apache HTTP Server / LiteSpeed Web Server** (Hostinger Production Infrastructure).
- **PHP 7.x / 8.x Support** (`default.php` template handler).

### 7.2 `.htaccess` Server Architecture
- **URL Rewriting (`mod_rewrite`)**:
  - Automatically strips `.html` file extensions for clean, modern URLs (e.g. `/services` instead of `/services.html`).
- **GZIP & Deflate Compression (`mod_deflate`)**:
  - Compresses `text/html`, `text/css`, `application/javascript`, `application/json`, `image/svg+xml`, and web fonts (`woff`, `woff2`, `ttf`).
- **Aggressive Browser Caching (`mod_expires`)**:
  - `1 year` cache lifetime for immutable static assets (CSS, JS, WebP/PNG/JPG images, SVG, Fonts).
  - `1 hour` cache lifetime for dynamic HTML pages to ensure fresh content.
- **Security & Privacy Headers (`mod_headers`)**:
  - `X-Content-Type-Options: nosniff` (prevents MIME-type sniffing attacks).
  - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking attacks).
  - `Referrer-Policy: strict-origin-when-cross-origin` (protects referrer privacy).
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()` (restricts unauthorized browser feature access).

---

## 8. SEO, Search Crawlers & Structured Data

### 8.1 Schema.org Structured Data (JSON-LD)
Rich structured data graphs embedded in `<script type="application/ld+json">`:
- `@type: ["Organization", "LocalBusiness", "ProfessionalService"]`
- Organization details: Name, logo, address (`Vibhuti Khand, Gomti Nagar, Lucknow`), phone, email, geographic coordinates (`lat: 26.8711, lon: 80.9995`), opening hours, and official social media profiles.
- `@type: "WebSite"`: Canonical URL references and publisher binding.

### 8.2 Social Graph & Search Metadata
- **Open Graph (OG) Tags**: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`.
- **Twitter Card Metadata**: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`.
- **Robots Control**: `robots.txt` and `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`.
- **XML Sitemap**: `sitemap.xml` mapping all pages, subpages, and legal directories for search engine crawlers.

---

## 9. Directory Structure & Key Files

```
public_html/
├── .htaccess                          # Apache server rules, clean URLs, GZIP, caching & security
├── robots.txt                         # Search crawler rules
├── sitemap.xml                        # XML sitemap for SEO indexing
├── prepros-6.config                   # Prepros build and compilation configuration
├── index.html                         # Main homepage
├── about.html                         # About Us & Company Profile
├── services.html                      # IT Services & Solutions
├── project.html                       # Case Studies & Portfolio
├── blog.html                          # Technology Blog index
├── blog-single.html                   # Blog Post detail template
├── contact.html                       # Contact form, Google Maps & inquiries
├── default.php                        # Hostinger PHP default handler
├── faq.html & faq/index.html          # Comprehensive FAQ section
├── legal/                             # Legal & compliance suite
│   ├── privacy-policy.html
│   ├── terms-and-conditions.html
│   ├── cookie-policy.html
│   └── disclaimer.html
├── css/                               # Core & specialized animation stylesheets
│   ├── style.css & style.min.css      # Main combined stylesheet
│   ├── bootstrap.min.css              # Bootstrap 4 framework
│   ├── animate.css & magnific-popup.css
│   ├── owl.carousel.min.css & owl.theme.default.min.css
│   ├── flaticon.css                   # Custom IT icon font
│   └── [custom-animation-styles].css # Custom scroll & transition styles
├── js/                                # Core libraries & custom controllers
│   ├── jquery.min.js                  # jQuery 3.2.1
│   ├── popper.min.js & bootstrap.min.js
│   ├── owl.carousel.min.js & jquery.magnific-popup.min.js
│   ├── jquery.waypoints.min.js & jquery.stellar.min.js & scrollax.min.js
│   ├── jquery.animateNumber.min.js & jquery.easing.1.3.js
│   ├── main.js                        # General UI initialization
│   └── [custom-controllers].js        # Custom scroll, hero & interaction engines
├── scss/                              # Sass source files
│   ├── style.scss                     # Master SCSS compilation file
│   └── bootstrap/                     # Bootstrap SCSS source components
├── fonts/                             # Web font files
│   └── flaticon/                      # Flaticon TTF, WOFF, WOFF2, EOT, SVG
└── images/                            # Optimized image assets (JPG, PNG, WebP, SVG)
```

---

## 10. Summary Matrix

| Category | Key Technologies Used |
| :--- | :--- |
| **Markup & Presentation** | HTML5 (Semantic), CSS3, SCSS, Flexbox, CSS Grid, 3D Transforms, Glassmorphism |
| **CSS Frameworks** | Bootstrap 4.x, Animate.css |
| **Scripting & DOM** | Vanilla JavaScript (ES5/ES6+), jQuery 3.2.1, Popper.js |
| **Interactive Plugins** | Owl Carousel 2, Magnific Popup, Waypoints, Stellar.js, Scrollax, jQuery AnimateNumber, Bootstrap Datepicker |
| **Custom Motion Engines** | Morphing Nav & Offcanvas Drawer, Scroll-Driven Hero Transition, Strategic Work Accordion, Consult Cards Stream, Insights Scatter-Stack, Layered FAQ Reveal, Page Transition Engine |
| **Icons & Typography** | Google Fonts (Montserrat, DM Sans), FontAwesome 4.7.0, Flaticon, Inline SVG |
| **Build & Tooling** | Prepros 6, Sass (SCSS) Compiler, Autoprefixer, CSS/JS Minification |
| **Server & Hosting** | Apache HTTP Server / LiteSpeed, PHP Runtime, `.htaccess` (mod_rewrite, mod_deflate, mod_expires, mod_headers) |
| **SEO & Performance** | Schema.org JSON-LD, Open Graph, Twitter Cards, DNS Preconnect, Resource Preload, Defer Loading, XML Sitemap |
