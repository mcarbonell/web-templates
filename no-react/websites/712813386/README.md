# FlowSync - SaaS Platform Website

**Seed:** 712813386

## Design System Breakdown

### Seed Digit Analysis

| Position | Digit | Domain | Implementation |
|----------|-------|--------|----------------|
| 1 | 7 | Color Palette | Deep jewel tones (emerald #047857, sapphire #1e40af, amethyst #7c3aed) |
| 2 | 1 | Typography | Modern serif (Crimson Pro) + geometric sans (Inter) |
| 3 | 2 | Layout Rhythm | Tight spacing system (0.5rem base unit) |
| 4 | 8 | Animation | Rich, sophisticated motion with cubic-bezier easing |
| 5 | 1 | Corner Treatment | Slightly rounded (4px base radius) |
| 6 | 3 | Visual Texture | Subtle layering with gradient overlays |
| 7 | 3 | Content Density | Balanced, moderate spacing |
| 8 | 8 | Interaction Depth | Advanced 3D transforms on hover |
| 9 | 6 | Accent Geometry | Rounded rectangles throughout |

**Site Type:** SaaS Platform (sum of digits: 39 → 3)

## Pages Included

### Core Pages
- `index.html` - Landing page with hero, features, social proof
- `about.html` - Company story, values, team
- `contact.html` - Contact form with multiple channels

### Content Pages
- `services.html` - Feature overview grid
- `service-detail.html` - Deep dive into task management
- `case-studies.html` - Customer success stories gallery
- `case-study.html` - TechCorp detailed case study

### Conversion Pages
- `pricing.html` - 3-tier pricing with FAQ
- `checkout.html` - Payment form with order summary

### Engagement Pages
- `blog.html` - Article listing with sidebar
- `blog-post.html` - Long-form content with serif typography
- `resources.html` - Tools, docs, ROI calculator

### SaaS-Specific Pages
- `login.html` - Sign in with social auth options
- `register.html` - Sign up with trial messaging
- `dashboard.html` - User dashboard with stats and tasks

### System Pages
- `404.html` - Creative error page with animated 404
- `legal.html` - Privacy, terms, cookies

## Technical Features

### Performance
- Critical CSS inlined
- Lazy loading ready
- Intersection Observer for scroll animations
- CSS custom properties for theming
- Minimal JavaScript footprint

### Functionality
- Dark/light theme toggle with localStorage persistence
- Mobile-responsive navigation
- Cookie consent banner
- Newsletter modal (exit-intent + scroll trigger)
- Form validation
- Smooth scroll
- Active nav highlighting

### Design Highlights
- Gradient backgrounds using seed colors
- 3D transform effects on cards (digit 8)
- Rich animations with bounce easing (digit 4)
- Consistent 4px border radius (digit 5)
- Jewel tone color palette (digit 1)
- Modern serif headings (digit 2)

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Mobile-first responsive design

## Getting Started

1. Open `index.html` in a browser
2. No build process required
3. All assets are self-contained or CDN-loaded

## Customization

All design tokens are defined in `css/base.css` as CSS custom properties:
- Colors: `--color-primary`, `--color-secondary`, etc.
- Spacing: `--space-xs` through `--space-3xl`
- Typography: `--font-serif`, `--font-sans`
- Animations: `--transition-fast`, `--transition-base`, etc.

## License

© 2026 FlowSync. All rights reserved.
