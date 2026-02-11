
## INTRODUCTION

You are part of a maximum quality automated HTML template factory. Your output defines the gold standard for production-ready multi-page website templates.

## CORE MANDATE
Create a BEAUTIFUL, COHERENT, FULL WEBSITE. Novel visual language. Immediately memorable. Optimized for mobile-first, flawless everywhere.

## GENERATE A RANDOM SEED NUMBER (0-999999999)

Use your tools to generate a random seed number between 0 and 999999999. You can use the following JavaScript code snippet:

```bash
node -e "console.log(Math.floor(Math.random() * 1000000000))"
```


## TECHNICAL CONSTRAINTS
- Output directory: `websites/SEEDNUMBEREHERE/`
- Plain HTML5 + CSS3 (custom properties, no frameworks)
- Vanilla JavaScript; external libraries CDN-loaded and performance-justified
- Zero React, Zero Tailwind, Zero build steps
- Shared assets: `css/base.css`, `js/main.js`, `assets/` folder
- Lighthouse 95+ performance target

## RANDOMNESS ENGINE: SEEDNUMBEREHERE 
Decompose digit-by-digit to drive ALL design decisions. Document in HTML comments per page.

| Position | Digit | Design Domain |
|----------|-------|---------------|
| 1 | - | **Color palette family** (0-9 mapped to 10 curated palettes) |
| 2 | - | **Typography pairing** (0-9 mapped to 10 font combinations) |
| 3 | - | **Layout rhythm** (spacing system density) |
| 4 | - | **Animation personality** (motion style: 0=minimal, 9=maximal) |
| 5 | - | **Corner treatment** (0-9: sharp to super-rounded) |
| 6 | - | **Visual texture** (0-9: flat to rich layered) |
| 7 | - | **Content density** (0-9: airy to compact) |
| 8 | - | **Interaction depth** (0-9: static to 3D) |
| 9 | - | **Accent geometry** (0-9: circular to angular) |

---

## SITE ARCHITECTURE: 12 PAGES

### CORE PAGES (Universal)
| Page | Purpose | Seed-Driven Variant |
|------|---------|-------------------|
| `index.html` | Landing, conversion, first impression | Hero type from digit-4 palette + digit-0 motion |
| `about.html` | Story, team, values, trust-building | Layout density from digit-7 |
| `contact.html` | Form, map, multiple contact channels | Form complexity from digit-5 density |

### CONTENT PAGES (Informational)
| Page | Purpose | Seed-Driven Variant |
|------|---------|---------------------|
| `services.html` | Offerings overview, comparison | Card grid columns from digit-6 rhythm |
| `service-detail.html` | Deep dive into single offering | Narrative structure from digit-0 animation |
| `case-studies.html` | Portfolio, results, social proof | Gallery density from digit-7 |
| `case-study.html` | Single project deep dive | Visual storytelling from digit-8 texture |

### CONVERSION PAGES (Transactional)
| Page | Purpose | Seed-Driven Variant |
|------|---------|---------------------|
| `pricing.html` | Plans, comparison, FAQ | Tier complexity from digit-5 |
| `checkout.html` | Payment, summary, security | Form density from digit-7 |

### ENGAGEMENT PAGES (Relational)
| Page | Purpose | Seed-Driven Variant |
|------|---------|---------------------|
| `blog.html` | Article listing, categories, search | List density from digit-7 |
| `blog-post.html` | Long-form content, reading experience | Typography emphasis from digit-2 pairing |
| `resources.html` | Downloads, tools, calculators | Interactivity depth from digit-8 |

### SYSTEM PAGES (Functional)
| Page | Purpose | Seed-Driven Variant |
|------|---------|---------------------|
| `404.html` | Dead ends, recovery, personality | Creative freedom from digit-4 palette extremes |

---

## SHARED COMPONENTS (in `js/components.js` or inlined)

| Component | Location | Behavior |
|-----------|----------|----------|
| Navigation | All pages | Sticky, mobile hamburger, current page highlight |
| Theme toggle | All pages | Light/dark, persists, respects `prefers-color-scheme` |
| Footer | All pages | Multi-column, sitemap, legal, social |
| Cookie consent | All pages | GDPR-compliant, minimal intrusive |
| Newsletter modal | Triggered | Exit-intent or scroll-delayed |
| Loader | Optional | Seed-0 = none, Seed-9 = elaborate reveal |

---

## THEME SYSTEM
- CSS custom properties in `css/base.css`
- Toggle: persistent, smooth transitions, no flash
- Each page imports base, extends with page-specific variables if needed
- Page-specific CSS/JS only if needed

---

## PERFORMANCE DIRECTIVES
- Inline only hero+nav styles, keep under 4KB; `base.css` cached
- Use placeholder or stock images, explicit dimensions, lazy loading
- Fonts: `font-display: swap`, preconnect to CDN
- Intersection Observer for reveals
- `content-visibility` for below-fold

---

## OUTPUT STRUCTURE EXAMPLE
```
websites/SEEDNUMBEREHERE/
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
├── css/
│   ├── base.css          (design tokens, reset, utilities)
│   ├── components.css    (shared patterns)
│   └── page-[name].css   (page-specific, if needed)
├── js/
│   ├── main.js           (navigation, theme, utilities)
│   ├── components.js     (reusable UI)
│   └── page-[name].js    (page-specific, if needed)
└── assets/
    ├── fonts/
    ├── images/
    └── icons/            (SVG sprite)
```

Choose randomly one main type (sum of digits of seed number % 5):

| Personal/Portfolio |
| Creative/Agency  |   
| SaaS | 
| E-commerce |   
| Other | 

Include more pages as needed: Login/Register, Dashboard, Galery, Online Shop, Chat Widget, Search results, Legal, etc. 

---

## DOCUMENTATION REQUIREMENTS

Each file must include:
- **HTML comment header**: seed decomposition summary, page purpose
- **Section comments**: seed-derived choices explained
- **CSS comments**: token annotations with digit references

---

NO QUESTIONS. NO VERIFICATION. NO BROWSER OPENING.
PROCEED IMMEDIATELY WITH ALL FILES.


## FEEDBACK
Finally, after creating the full website structure and files as specified, give feedback about this prompt and how you can improve it.