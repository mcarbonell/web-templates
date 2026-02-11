/*
 * SEED: 712813386 - Main JavaScript
 * Core functionality: navigation, theme toggle, utilities
 */

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateToggleIcon();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  setupToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  updateToggleIcon() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = this.theme === 'light' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.mobile-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header')) {
        this.closeMenu();
      }
    });

    // Close menu on link click
    this.menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }
}

// Cookie Consent
class CookieConsent {
  constructor() {
    this.consent = localStorage.getItem('cookieConsent');
    this.init();
  }

  init() {
    if (!this.consent) {
      setTimeout(() => this.show(), 2000);
    }
  }

  show() {
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
      banner.classList.add('active');
      
      banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
        this.accept();
      });
      
      banner.querySelector('.cookie-decline')?.addEventListener('click', () => {
        this.decline();
      });
    }
  }

  accept() {
    localStorage.setItem('cookieConsent', 'accepted');
    this.hide();
  }

  decline() {
    localStorage.setItem('cookieConsent', 'declined');
    this.hide();
  }

  hide() {
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
      banner.classList.remove('active');
    }
  }
}

// Newsletter Modal
class NewsletterModal {
  constructor() {
    this.modal = document.querySelector('.modal-overlay');
    this.shown = sessionStorage.getItem('newsletterShown');
    this.init();
  }

  init() {
    if (!this.modal || this.shown) return;

    // Show on exit intent
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 0 && !this.shown) {
        this.show();
      }
    });

    // Show on scroll (80% of page)
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (scrollTriggered || this.shown) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 80) {
        scrollTriggered = true;
        setTimeout(() => this.show(), 1000);
      }
    });

    // Close handlers
    this.modal.querySelector('.modal-close')?.addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    // Form submit
    const form = this.modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
    }
  }

  show() {
    if (this.modal) {
      this.modal.classList.add('active');
      sessionStorage.setItem('newsletterShown', 'true');
      this.shown = true;
    }
  }

  hide() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  handleSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    console.log('Newsletter signup:', email);
    // Add your newsletter API call here
    this.hide();
    alert('Thank you for subscribing!');
  }
}

// Scroll Animations - Digit 4 (8): Rich motion
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}

// Active Navigation Link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Loader
function hideLoader() {
  const loader = document.querySelector('.loader-overlay');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
  }
}

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });

  return isValid;
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core features
  new ThemeManager();
  new MobileNav();
  new CookieConsent();
  new NewsletterModal();
  new ScrollAnimations();
  
  // Set active nav link
  setActiveNavLink();
  
  // Init smooth scroll
  initSmoothScroll();
  
  // Hide loader
  hideLoader();
});

// Page Load Performance
window.addEventListener('load', () => {
  // Mark page as fully loaded
  document.body.classList.add('loaded');
});

// Export for use in other scripts
window.AppUtils = {
  validateForm,
  ThemeManager,
  MobileNav
};
