/**
 * NOVA CREATIVE AGENCY - Main JavaScript
 * Seed: 034334455
 * 
 * Core functionality: Navigation, Theme Toggle, Utilities
 */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        theme: {
            storageKey: 'nova-theme-preference',
            defaultTheme: 'light'
        },
        animations: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        scroll: {
            navOffset: 100
        }
    };

    // ============================================
    // THEME MANAGER
    // ============================================
    const ThemeManager = {
        init() {
            this.toggle = document.querySelector('.theme-toggle');
            if (!this.toggle) return;

            this.applyTheme(this.getTheme());
            this.toggle.addEventListener('click', () => this.toggleTheme());

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(CONFIG.theme.storageKey)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        },

        getTheme() {
            const stored = localStorage.getItem(CONFIG.theme.storageKey);
            if (stored) return stored;

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : CONFIG.theme.defaultTheme;
        },

        setTheme(theme) {
            localStorage.setItem(CONFIG.theme.storageKey, theme);
            this.applyTheme(theme);
        },

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.toggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        },

        toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.setTheme(next);
        }
    };

    // ============================================
    // NAVIGATION MANAGER
    // ============================================
    const NavigationManager = {
        init() {
            this.nav = document.querySelector('.nav');
            this.toggle = document.querySelector('.nav__toggle');
            this.menu = document.querySelector('.nav__menu');
            this.links = document.querySelectorAll('.nav__link');

            if (!this.nav) return;

            this.handleScroll();
            this.setupMobileMenu();
            this.highlightCurrentPage();
            this.setupSmoothScroll();
        },

        handleScroll() {
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                // Add/remove scrolled class
                if (currentScroll > 50) {
                    this.nav.classList.add('nav--scrolled');
                } else {
                    this.nav.classList.remove('nav--scrolled');
                }

                // Hide/show nav on scroll direction (mobile only)
                if (window.innerWidth <= 768) {
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        this.nav.style.transform = 'translateY(-100%)';
                    } else {
                        this.nav.style.transform = 'translateY(0)';
                    }
                }

                lastScroll = currentScroll;
            }, { passive: true });
        },

        setupMobileMenu() {
            if (!this.toggle || !this.menu) return;

            this.toggle.addEventListener('click', () => {
                const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
                this.toggle.setAttribute('aria-expanded', !isExpanded);
                this.menu.classList.toggle('nav__menu--open');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            // Close menu when clicking a link
            this.links.forEach(link => {
                link.addEventListener('click', () => {
                    this.toggle.setAttribute('aria-expanded', 'false');
                    this.menu.classList.remove('nav__menu--open');
                    document.body.style.overflow = '';
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.menu.classList.contains('nav__menu--open')) {
                    this.toggle.setAttribute('aria-expanded', 'false');
                    this.menu.classList.remove('nav__menu--open');
                    document.body.style.overflow = '';
                }
            });
        },

        highlightCurrentPage() {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';

            this.links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                    link.setAttribute('aria-current', 'page');
                }
            });
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const navHeight = this.nav?.offsetHeight || 0;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ============================================
    // ANIMATION MANAGER (Seed[3] = 3: Moderate)
    // ============================================
    const AnimationManager = {
        init() {
            this.observer = null;
            this.initRevealAnimations();
            this.initParallax();
            this.initCounterAnimations();
        },

        initRevealAnimations() {
            const reveals = document.querySelectorAll('[data-reveal]');
            if (reveals.length === 0) return;

            if (!('IntersectionObserver' in window)) {
                // Fallback for browsers without IntersectionObserver
                reveals.forEach(el => el.classList.add('is-visible'));
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay * 1000);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONFIG.animations.threshold,
                rootMargin: CONFIG.animations.rootMargin
            });

            reveals.forEach(el => this.observer.observe(el));
        },

        initParallax() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            if (parallaxElements.length === 0) return;

            // Only enable parallax on non-touch devices
            if (window.matchMedia('(pointer: coarse)').matches) return;

            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;

                        parallaxElements.forEach(el => {
                            const speed = parseFloat(el.dataset.parallax) || 0.5;
                            const yPos = -(scrolled * speed);
                            el.style.transform = `translateY(${yPos}px)`;
                        });

                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        initCounterAnimations() {
            const counters = document.querySelectorAll('[data-counter]');
            if (counters.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        },

        animateCounter(element) {
            const target = parseInt(element.dataset.counter, 10);
            const duration = parseInt(element.dataset.duration, 10) || 2000;
            const suffix = element.dataset.suffix || '';
            const prefix = element.dataset.prefix || '';

            const startTime = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(startValue + (target - startValue) * easeProgress);

                element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // ============================================
    // COOKIE CONSENT
    // ============================================
    const CookieConsent = {
        init() {
            this.banner = document.querySelector('.cookie-consent');
            if (!this.banner) return;

            // Check if user has already made a choice
            if (localStorage.getItem('nova-cookies-accepted')) return;

            // Show banner after a short delay
            setTimeout(() => {
                this.banner.classList.add('cookie-consent--visible');
            }, 1000);

            this.setupButtons();
        },

        setupButtons() {
            const acceptBtn = this.banner.querySelector('[data-cookies-accept]');
            const declineBtn = this.banner.querySelector('[data-cookies-decline]');

            acceptBtn?.addEventListener('click', () => this.accept());
            declineBtn?.addEventListener('click', () => this.decline());
        },

        accept() {
            localStorage.setItem('nova-cookies-accepted', 'true');
            this.hide();
        },

        decline() {
            localStorage.setItem('nova-cookies-accepted', 'false');
            this.hide();
        },

        hide() {
            this.banner.classList.remove('cookie-consent--visible');
            setTimeout(() => {
                this.banner.style.display = 'none';
            }, 500);
        }
    };

    // ============================================
    // NEWSLETTER MODAL
    // ============================================
    const NewsletterModal = {
        init() {
            this.modal = document.querySelector('[data-newsletter-modal]');
            this.overlay = document.querySelector('[data-modal-overlay]');
            if (!this.modal) return;

            this.triggered = false;
            this.setupTriggers();
            this.setupCloseHandlers();
        },

        setupTriggers() {
            // Exit intent trigger
            document.addEventListener('mouseout', (e) => {
                if (e.clientY < 10 && !this.triggered && !this.hasSubscribed()) {
                    this.show();
                    this.triggered = true;
                }
            });

            // Scroll trigger (50% of page)
            let scrollTriggered = false;
            window.addEventListener('scroll', () => {
                if (scrollTriggered || this.triggered || this.hasSubscribed()) return;

                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                if (scrollPercent > 50) {
                    this.show();
                    this.triggered = true;
                    scrollTriggered = true;
                }
            }, { passive: true });
        },

        setupCloseHandlers() {
            const closeBtn = this.modal.querySelector('[data-modal-close]');
            closeBtn?.addEventListener('click', () => this.hide());

            this.overlay?.addEventListener('click', () => this.hide());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.hide();
            });
        },

        show() {
            this.modal.classList.add('modal--active');
            this.overlay?.classList.add('modal-overlay--active');
            document.body.style.overflow = 'hidden';
        },

        hide() {
            this.modal.classList.remove('modal--active');
            this.overlay?.classList.remove('modal-overlay--active');
            document.body.style.overflow = '';
        },

        hasSubscribed() {
            return localStorage.getItem('nova-newsletter-subscribed') === 'true';
        }
    };

    // ============================================
    // FORM VALIDATION
    // ============================================
    const FormValidation = {
        init() {
            document.querySelectorAll('form[data-validate]').forEach(form => {
                form.addEventListener('submit', (e) => this.validate(e));
            });
        },

        validate(e) {
            const form = e.target;
            let isValid = true;

            // Clear previous errors
            form.querySelectorAll('.form-error').forEach(el => el.remove());
            form.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));

            // Validate required fields
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    this.showError(field, 'This field is required');
                }
            });

            // Validate email fields
            form.querySelectorAll('input[type="email"]').forEach(field => {
                if (field.value && !this.isValidEmail(field.value)) {
                    isValid = false;
                    this.showError(field, 'Please enter a valid email address');
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        },

        showError(field, message) {
            field.classList.add('form-input--error');
            const error = document.createElement('div');
            error.className = 'form-error';
            error.textContent = message;
            field.parentNode.appendChild(error);
        },

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    };

    // ============================================
    // LAZY LOADING
    // ============================================
    const LazyLoader = {
        init() {
            if ('loading' in HTMLImageElement.prototype) {
                // Native lazy loading supported
                document.querySelectorAll('img[data-src]').forEach(img => {
                    img.src = img.dataset.src;
                    img.loading = 'lazy';
                });
            } else {
                // Fallback for older browsers
                this.initIntersectionObserver();
            }
        },

        initIntersectionObserver() {
            const images = document.querySelectorAll('img[data-src]');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => observer.observe(img));
        }
    };

    // ============================================
    // COPY TO CLIPBOARD
    // ============================================
    const ClipboardManager = {
        init() {
            document.querySelectorAll('[data-copy]').forEach(btn => {
                btn.addEventListener('click', () => this.copy(btn));
            });
        },

        async copy(button) {
            const text = button.dataset.copy;

            try {
                await navigator.clipboard.writeText(text);
                this.showFeedback(button, 'Copied!');
            } catch (err) {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showFeedback(button, 'Copied!');
            }
        },

        showFeedback(button, message) {
            const original = button.textContent;
            button.textContent = message;
            button.disabled = true;

            setTimeout(() => {
                button.textContent = original;
                button.disabled = false;
            }, 2000);
        }
    };

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        ThemeManager.init();
        NavigationManager.init();
        AnimationManager.init();
        CookieConsent.init();
        NewsletterModal.init();
        FormValidation.init();
        LazyLoader.init();
        ClipboardManager.init();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
