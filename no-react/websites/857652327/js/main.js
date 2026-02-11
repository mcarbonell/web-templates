/**
 * SEED: 857652327
 * Core Logic: Navigation, Theme Toggle, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initAnimations();
});

/* --- THEME TOGGLE --- */
function initTheme() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '◑';
    toggleBtn.className = 'theme-toggle btn btn-outline';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '2rem';
    toggleBtn.style.right = '2rem';
    toggleBtn.style.zIndex = '1000';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.width = '50px';
    toggleBtn.style.height = '50px';
    toggleBtn.style.padding = '0';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.ariaLabel = 'Toggle Theme';

    document.body.appendChild(toggleBtn);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    // Default to Dark (Seed 8) if no storage
    let currentTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); 
    
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

/* --- NAVIGATION --- */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navToggle.innerHTML = isExpanded ? '✕' : '☰';
        });
    }

    // Active state
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

/* --- ANIMATIONS (Seed 6: Scroll Reveals) --- */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}
