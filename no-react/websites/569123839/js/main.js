/* 
   SEED: 569123839
   Main JavaScript
*/

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initScrollAnimations();
    initCookieConsent();
    initNewsletter();
});

// Navigation logic
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(10, 10, 12, 0.95)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(10, 10, 12, 0.8)';
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Add actual mobile menu logic if needed
        });
    }
}

// Theme management (Simplified as per SEED-5 dark focus)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Minimal Animation (4:1) logic using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Cookie Consent
function initCookieConsent() {
    const banner = document.querySelector('.cookie-banner');
    const acceptBtn = document.querySelector('#accept-cookies');

    if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => {
            banner.classList.add('active');
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            banner.classList.remove('active');
        });
    }
}

// Newsletter Modal (Exit intent)
function initNewsletter() {
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    let shown = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !shown && !localStorage.getItem('newsletter-closed')) {
            modal.classList.add('active');
            shown = true;
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            localStorage.setItem('newsletter-closed', 'true');
        });
    }
}

// Global utilities
const Utils = {
    formatDate: (date) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date),
    lazyLoad: (img) => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
    }
};
