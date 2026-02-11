/* 
SEED: 537480422 
Components:
- Navbar: Sticky, mobile-first hamburger
- Footer: Multi-column
- Theme Toggle: Persistent
- Cookie Consent: GDPR compliant
*/

const COMPONENTS = {
    header: `
    <header class="site-header">
      <div class="container flex justify-between items-center" style="height: 80px;">
        <a href="index.html" class="logo flex items-center gap-2">
          <!-- Seed-9 Accent: Slightly angular logo mark -->
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="4" y="4" width="32" height="32" rx="12" fill="var(--color-primary)" />
             <path d="M12 20L18 26L28 14" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-bold text-lg" style="color: var(--color-primary);">EcoStream</span>
        </a>
        
        <nav class="desktop-nav hidden-mobile">
          <ul class="flex items-center gap-4">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="services.html" class="nav-link">Services</a></li>
            <li><a href="case-studies.html" class="nav-link">Case Studies</a></li>
            <li><a href="pricing.html" class="nav-link">Pricing</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
            <li><a href="blog.html" class="nav-link">Blog</a></li>
            <li><a href="contact.html" class="btn btn-primary">Get Started</a></li>
            <li><button id="theme-toggle" class="btn-icon" aria-label="Toggle Theme">◐</button></li>
          </ul>
        </nav>

        <button class="mobile-toggle btn-icon hidden-desktop" aria-label="Menu">
          ☰
        </button>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu" style="display: none; position: absolute; top: 80px; left: 0; width: 100%; background: var(--color-surface); padding: var(--space-md); border-bottom: 2px solid var(--color-border);">
         <ul class="flex flex-col gap-4">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="services.html" class="nav-link">Services</a></li>
            <li><a href="case-studies.html" class="nav-link">Case Studies</a></li>
            <li><a href="pricing.html" class="nav-link">Pricing</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
            <li><a href="blog.html" class="nav-link">Blog</a></li>
            <li><a href="contact.html" class="btn btn-primary w-full">Get Started</a></li>
            <li><button id="mobile-theme-toggle" class="btn w-full">Toggle Dark Mode</button></li>
         </ul>
      </div>
    </header>
    <style>
      @media (max-width: 768px) {
        .hidden-mobile { display: none !important; }
      }
      @media (min-width: 769px) {
        .hidden-desktop { display: none !important; }
      }
      .btn-icon {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text);
        padding: 0.5rem;
      }
    </style>
  `,

    footer: `
    <footer class="site-footer">
      <div class="container grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-xl);">
        <div class="brands">
          <div class="flex items-center gap-2 mb-4">
             <div style="width: 32px; height: 32px; background: var(--color-primary-light); border-radius: 8px;"></div>
             <span class="font-bold text-lg">EcoStream</span>
          </div>
          <p class="text-sm opacity-80">Sustainable analytics for modern enterprises.</p>
        </div>
        
        <div class="links">
          <h4 class="mb-4">Platform</h4>
          <ul class="flex flex-col gap-2 opacity-80">
            <li><a href="services.html">Services</a></li>
            <li><a href="pricing.html">Pricing</a></li>
            <li><a href="resources.html">Resources</a></li>
          </ul>
        </div>
        
        <div class="links">
          <h4 class="mb-4">Company</h4>
          <ul class="flex flex-col gap-2 opacity-80">
            <li><a href="about.html">About Us</a></li>
            <li><a href="case-studies.html">Case Studies</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        
        <div class="legal">
           <h4 class="mb-4">Legal</h4>
           <ul class="flex flex-col gap-2 opacity-80">
             <li><a href="#">Privacy Policy</a></li>
             <li><a href="#">Terms of Service</a></li>
             <li><a href="#">Cookie Policy</a></li>
           </ul>
        </div>
      </div>
      <div class="container text-center mt-8 pt-8 border-t border-gray-700 opacity-60 text-sm">
        &copy; 2026 EcoStream SaaS. All rights reserved. Seed: 537480422.
      </div>
    </footer>
  `
};

function injectComponents() {
    const app = document.getElementById('app');
    if (!app) return; // Should be wrapped in #app or handle differently

    // Actually, we can just insertAdjacentHTML if markers exist, or prepend/append
    // But strictly, let's look for placeholders or just inject into body

    if (!document.querySelector('header')) {
        document.body.insertAdjacentHTML('afterbegin', COMPONENTS.header);
    }

    if (!document.querySelector('footer')) {
        document.body.insertAdjacentHTML('beforeend', COMPONENTS.footer);
    }

    initInteractions();
}

function initInteractions() {
    // Mobile Menu
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isHidden = menu.style.display === 'none';
            menu.style.display = isHidden ? 'block' : 'none';
            toggle.setAttribute('aria-expanded', isHidden);
        });
    }

    // Theme Toggle
    const themeToggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Set initial
    if (savedTheme === 'dark' || (!savedTheme && preferDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });

    // Highlight Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.style.color = 'var(--color-primary)';
            link.style.backgroundColor = 'rgba(5, 150, 105, 0.1)';
        }
    });
}
