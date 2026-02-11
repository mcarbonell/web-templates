/*
 * main.js - Seed 006536902 | Core JavaScript
 * Navigation, Theme Toggle, Scroll Reveals, Utilities
 */

(function () {
    'use strict';

    // ===== THEME MANAGEMENT =====
    const ThemeManager = {
        STORAGE_KEY: 'theme-preference',

        init() {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = saved || (prefersDark ? 'dark' : 'light');
            this.setTheme(theme);

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        },

        toggle() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.setTheme(next);
            localStorage.setItem(this.STORAGE_KEY, next);
        }
    };

    // ===== NAVIGATION =====
    const Navigation = {
        init() {
            this.header = document.querySelector('.header');
            this.mobileToggle = document.querySelector('.nav-mobile-toggle');
            this.mobileNav = document.querySelector('.nav-mobile');
            this.lastScroll = 0;

            if (this.mobileToggle) {
                this.mobileToggle.addEventListener('click', () => this.toggleMobile());
            }

            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.setActiveLink();
        },

        onScroll() {
            const scrollY = window.scrollY;

            if (this.header) {
                if (scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            }

            this.lastScroll = scrollY;
        },

        toggleMobile() {
            if (this.mobileNav) {
                this.mobileNav.classList.toggle('open');
                document.body.style.overflow = this.mobileNav.classList.contains('open') ? 'hidden' : '';
            }
        },

        closeMobile() {
            if (this.mobileNav) {
                this.mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        },

        setActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    };

    // ===== SCROLL REVEAL =====
    const ScrollReveal = {
        init() {
            this.elements = document.querySelectorAll('.reveal');
            if (this.elements.length === 0) return;

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            this.elements.forEach(el => this.observer.observe(el));
        }
    };

    // ===== COOKIE CONSENT =====
    const CookieConsent = {
        STORAGE_KEY: 'cookie-consent',

        init() {
            this.banner = document.querySelector('.cookie-banner');
            if (!this.banner || localStorage.getItem(this.STORAGE_KEY)) return;

            setTimeout(() => this.show(), 2000);

            this.banner.querySelector('.btn-accept')?.addEventListener('click', () => this.accept());
            this.banner.querySelector('.btn-decline')?.addEventListener('click', () => this.decline());
        },

        show() {
            this.banner.classList.add('show');
        },

        accept() {
            localStorage.setItem(this.STORAGE_KEY, 'accepted');
            this.hide();
        },

        decline() {
            localStorage.setItem(this.STORAGE_KEY, 'declined');
            this.hide();
        },

        hide() {
            this.banner.classList.remove('show');
        }
    };

    // ===== SMOOTH SCROLL =====
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        Navigation.closeMobile();
                    }
                });
            });
        }
    };

    // ===== UTILITIES =====
    const Utils = {
        debounce(fn, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        throttle(fn, limit) {
            let inThrottle;
            return (...args) => {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ===== GLOBAL INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        Navigation.init();
        ScrollReveal.init();
        CookieConsent.init();
        SmoothScroll.init();

        // Theme toggle button
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => ThemeManager.toggle());
        });
    });

    // Expose utilities globally
    window.NovaSaaS = { ThemeManager, Navigation, Utils };
})();
