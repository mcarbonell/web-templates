/**
 * MAIN.JS - Core JavaScript | SEED: 195460458 | SaaS Website
 * Navigation, Theme Toggle, Scroll Reveals, Cookie Consent
 */

(function () {
    'use strict';

    // ========== THEME MANAGEMENT ==========
    const ThemeManager = {
        init() {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = saved || (prefersDark ? 'dark' : 'light');
            this.set(theme, false);

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.set(e.matches ? 'dark' : 'light', false);
                }
            });
        },

        set(theme, save = true) {
            document.documentElement.setAttribute('data-theme', theme);
            if (save) localStorage.setItem('theme', theme);
            document.querySelectorAll('.theme-toggle').forEach(btn => {
                btn.setAttribute('aria-checked', theme === 'dark');
            });
        },

        toggle() {
            const current = document.documentElement.getAttribute('data-theme');
            this.set(current === 'dark' ? 'light' : 'dark');
        }
    };

    // ========== NAVIGATION ==========
    const Navigation = {
        init() {
            this.nav = document.querySelector('.nav');
            this.toggle = document.querySelector('.nav-toggle');
            this.menu = document.querySelector('.mobile-menu');
            this.links = document.querySelectorAll('.nav-link');

            if (!this.nav) return;

            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            if (this.toggle && this.menu) {
                this.toggle.addEventListener('click', () => this.toggleMobile());
                this.links.forEach(link => {
                    link.addEventListener('click', () => this.closeMobile());
                });
            }

            this.highlightCurrent();
        },

        onScroll() {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        },

        toggleMobile() {
            const isOpen = this.menu.classList.toggle('open');
            this.toggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        },

        closeMobile() {
            if (this.menu) {
                this.menu.classList.remove('open');
                this.toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        },

        highlightCurrent() {
            const path = window.location.pathname.split('/').pop() || 'index.html';
            this.links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === path || (path === '' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    };

    // ========== SCROLL REVEAL ==========
    const ScrollReveal = {
        init() {
            this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            if (!this.elements.length) return;

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 100);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            this.elements.forEach(el => this.observer.observe(el));
        }
    };

    // ========== COOKIE CONSENT ==========
    const CookieConsent = {
        init() {
            this.banner = document.querySelector('.cookie-banner');
            if (!this.banner || localStorage.getItem('cookieConsent')) return;

            setTimeout(() => this.banner.classList.add('visible'), 1000);

            this.banner.querySelector('[data-accept]')?.addEventListener('click', () => this.accept());
            this.banner.querySelector('[data-decline]')?.addEventListener('click', () => this.decline());
        },

        accept() {
            localStorage.setItem('cookieConsent', 'accepted');
            this.hide();
        },

        decline() {
            localStorage.setItem('cookieConsent', 'declined');
            this.hide();
        },

        hide() {
            this.banner.classList.remove('visible');
        }
    };

    // ========== MODAL ==========
    const Modal = {
        init() {
            document.querySelectorAll('[data-modal-open]').forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const id = trigger.getAttribute('data-modal-open');
                    this.open(id);
                });
            });

            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this.close(overlay);
                });
                overlay.querySelector('.modal-close')?.addEventListener('click', () => this.close(overlay));
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal-overlay.open').forEach(m => this.close(m));
                }
            });
        },

        open(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        },

        close(modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    // ========== SMOOTH SCROLL ==========
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }
    };

    // ========== FORM VALIDATION ==========
    const FormValidation = {
        init() {
            document.querySelectorAll('form[data-validate]').forEach(form => {
                form.addEventListener('submit', (e) => this.validate(e, form));
            });
        },

        validate(e, form) {
            let valid = true;
            form.querySelectorAll('[required]').forEach(field => {
                const error = field.parentElement.querySelector('.form-error');
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    if (error) error.textContent = 'This field is required';
                } else if (field.type === 'email' && !this.isEmail(field.value)) {
                    valid = false;
                    field.classList.add('error');
                    if (error) error.textContent = 'Please enter a valid email';
                } else {
                    field.classList.remove('error');
                    if (error) error.textContent = '';
                }
            });

            if (!valid) e.preventDefault();
            return valid;
        },

        isEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    };

    // ========== COUNTER ANIMATION ==========
    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('[data-counter]');
            if (!counters.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        },

        animate(el) {
            const target = parseInt(el.getAttribute('data-counter'));
            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();

                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target.toLocaleString();
            };

            requestAnimationFrame(update);
        }
    };

    // ========== INITIALIZE ==========
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        Navigation.init();
        ScrollReveal.init();
        CookieConsent.init();
        Modal.init();
        SmoothScroll.init();
        FormValidation.init();
        CounterAnimation.init();

        // Theme toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => ThemeManager.toggle());
        });
    });

    // Export for external use
    window.SiteUtils = { ThemeManager, Modal, Navigation };
})();
