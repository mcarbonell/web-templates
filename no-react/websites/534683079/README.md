# FlowSync - SaaS Collaboration Platform

**Seed Number:** 534683079

## Design System Breakdown

### Seed Digit Analysis

| Position | Digit | Design Domain | Implementation |
|----------|-------|---------------|----------------|
| 1 | 5 | Color Palette | Deep Ocean Blues (#0d8fb0) + Coral Accents (#ff6448) |
| 2 | 3 | Typography | Inter (body) + Space Grotesk (headings) |
| 3 | 4 | Layout Rhythm | Medium density spacing (1.5rem base unit) |
| 4 | 6 | Animation | Moderate-high motion with smooth transitions |
| 5 | 8 | Corner Treatment | Very rounded corners (1.5rem border-radius) |
| 6 | 3 | Visual Texture | Light layering with subtle gradients |
| 7 | 0 | Content Density | Very airy spacing between elements |
| 8 | 7 | Interaction Depth | High interactivity with 3D transforms |
| 9 | 9 | Accent Geometry | Angular shapes (clip-path polygons) |

### Website Type

**SaaS Platform** (sum of digits: 45)

FlowSync is a modern collaboration platform for distributed teams, featuring real-time messaging, project management, video conferencing, and AI-powered workflows.

## Site Architecture

### Core Pages (3)
- `index.html` - Landing page with hero, features, testimonials, and CTA
- `about.html` - Company story, values, and team
- `contact.html` - Contact form with multiple channels

### Content Pages (4)
- `services.html` - Feature overview with integration showcase
- `service-detail.html` - Deep dive into specific features
- `case-studies.html` - Customer success stories gallery
- `case-study.html` - Detailed case study with metrics

### Conversion Pages (2)
- `pricing.html` - Three-tier pricing (Starter, Professional, Enterprise)
- `checkout.html` - Order completion with summary

### Engagement Pages (3)
- `blog.html` - Article listing with categories
- `blog-post.html` - Long-form content with optimized reading experience
- `resources.html` - Downloads, templates, and tools

### System Pages (4)
- `404.html` - Creative error page with recovery options
- `login.html` - User authentication
- `register.html` - Account creation
- `legal.html` - Privacy, Terms, and Cookie policies

## Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks
- **Google Fonts** - Inter & Space Grotesk

## Features

### Theme System
- Light/dark mode toggle
- Persistent preference storage
- Respects `prefers-color-scheme`
- Smooth transitions

### Navigation
- Sticky header with blur effect
- Mobile hamburger menu
- Active page highlighting
- Smooth scroll anchors

### Animations
- Intersection Observer for scroll reveals
- Counter animations for statistics
- Parallax effects
- Smooth page transitions

### Components
- Cookie consent banner
- Newsletter modal (exit-intent)
- Form validation
- Page loader
- Testimonial cards
- Feature cards with hover effects
- Pricing cards
- Stats grid

### Performance
- Lazy loading
- Font display swap
- Minimal dependencies
- Optimized animations
- Content visibility API

## Color Palette

### Primary (Deep Ocean Blue)
- 50: #e6f4f9
- 500: #0d8fb0 (main)
- 900: #011314

### Accent (Coral)
- 50: #fff0ed
- 500: #ff6448 (main)
- 900: #4d1410

### Neutral
- 50: #f8fafb (light bg)
- 500: #6e8290
- 900: #0e161c (dark text)

## Typography

- **Headings:** Space Grotesk (700)
- **Body:** Inter (400, 500, 600, 700)
- **Monospace:** JetBrains Mono

### Scale
- H1: clamp(2.5rem, 5vw, 4rem)
- H2: clamp(2rem, 4vw, 3rem)
- H3: clamp(1.5rem, 3vw, 2rem)
- Body: 1rem (16px)

## Spacing System

Base unit: 1.5rem (24px)

- xs: 0.375rem (6px)
- sm: 0.75rem (12px)
- md: 1.5rem (24px)
- lg: 3rem (48px)
- xl: 4.5rem (72px)
- 2xl: 6rem (96px)
- 3xl: 9rem (144px)

## Border Radius

- sm: 0.75rem
- md: 1.5rem (primary)
- lg: 2.5rem
- xl: 4rem
- full: 9999px

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
websites/534683079/
├── index.html
├── about.html
├── contact.html
├── services.html
├── service-detail.html
├── case-studies.html
├── case-study.html
├── pricing.html
├── checkout.html
├── blog.html
├── blog-post.html
├── resources.html
├── 404.html
├── login.html
├── register.html
├── legal.html
├── css/
│   ├── base.css (design tokens, reset, utilities)
│   └── components.css (shared UI patterns)
├── js/
│   └── main.js (core functionality)
└── assets/
    ├── fonts/
    ├── images/
    └── icons/
```

## Getting Started

1. Open `index.html` in a modern web browser
2. No build process required
3. All assets load from CDN (fonts)
4. Works offline after first load

## Customization

### Colors
Edit CSS custom properties in `css/base.css` under `:root`

### Typography
Change font imports in HTML `<head>` and update `--font-primary` and `--font-display` variables

### Spacing
Adjust `--space-unit` in `css/base.css` to scale entire spacing system

## Performance Targets

- Lighthouse Performance: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Reduced motion support
- Color contrast WCAG AA compliant

## License

© 2026 FlowSync. All rights reserved.
