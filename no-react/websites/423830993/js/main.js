/**
 * SEED: 423830993
 * Main JavaScript - Core functionality
 * Position 4 (8): Rich animations | Position 8 (3): Moderate 3D depth
 */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        animationDuration: 500,
        scrollOffset: 70,
        cookieConsentDelay: 3000,
        newsletterDelay: 15000,
        loaderDuration: 1500
    };

    // ===== DOM READY =====
    document.addEventListener('DOMContentLoaded', function () {
        initLoader();
        initNavigation();
        initThemeToggle();
        initScrollEffects();
        initCookieConsent();
        initNewsletterModal();
        initScrollToTop();
        initAnimations();
        initForms();
        initTabs();
        initAccordion();
    });

    // ===== LOADER =====
    function initLoader() {
        const loader = document.querySelector('.loader');
        if (!loader) return;

        // Position 4 (8): Rich animations - elaborate reveal
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';

            // Trigger entrance animations
            document.querySelectorAll('.animate-on-load').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-fadeInUp');
                }, index * 100);
            });
        }, CONFIG.loaderDuration);
    }

    // ===== NAVIGATION =====
    function initNavigation() {
        const nav = document.querySelector('.nav');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Sticky nav with background change on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu on link click
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Active link highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== THEME TOGGLE =====
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const html = document.documentElement;

        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            html.setAttribute('data-theme', 'dark');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // Position 4 (8): Rich animation on theme change
                document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 500);
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    // ===== SCROLL EFFECTS =====
    function initScrollEffects() {
        // Intersection Observer for reveal animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero sections
        const parallaxElements = document.querySelectorAll('.parallax');
        if (parallaxElements.length > 0 && !window.matchMedia('(pointer: coarse)').matches) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 0.5;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }, { passive: true });
        }
    }

    // ===== COOKIE CONSENT =====
    function initCookieConsent() {
        const cookieConsent = document.querySelector('.cookie-consent');
        const acceptBtn = document.querySelector('.cookie-accept');
        const declineBtn = document.querySelector('.cookie-decline');

        if (!cookieConsent) return;

        // Check if already consented
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, CONFIG.cookieConsentDelay);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieConsent.classList.remove('show');
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                cookieConsent.classList.remove('show');
            });
        }
    }

    // ===== NEWSLETTER MODAL =====
    function initNewsletterModal() {
        const modal = document.querySelector('.newsletter-modal');
        const overlay = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.modal-close');
        const form = document.querySelector('.newsletter-form');

        if (!modal) return;

        // Show modal after delay if not already subscribed
        if (!localStorage.getItem('newsletterSubscribed') && !localStorage.getItem('newsletterClosed')) {
            setTimeout(() => {
                showModal();
            }, CONFIG.newsletterDelay);
        }

        function showModal() {
            modal.classList.add('show');
            if (overlay) overlay.classList.add('show');
        }

        function hideModal() {
            modal.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
            localStorage.setItem('newsletterClosed', 'true');
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        }

        if (overlay) {
            overlay.addEventListener('click', hideModal);
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                localStorage.setItem('newsletterSubscribed', 'true');

                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success';
                successMsg.textContent = '¡Gracias por suscribirte!';
                form.innerHTML = '';
                form.appendChild(successMsg);

                setTimeout(hideModal, 2000);
            });
        }

        // Exit intent detection
        let exitIntentShown = false;
        document.addEventListener('mouseout', (e) => {
            if (!exitIntentShown && e.clientY < 10 && !localStorage.getItem('newsletterSubscribed')) {
                showModal();
                exitIntentShown = true;
            }
        });
    }

    // ===== SCROLL TO TOP =====
    function initScrollToTop() {
        const scrollTop = document.querySelector('.scroll-top');
        if (!scrollTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollTop.classList.add('show');
            } else {
                scrollTop.classList.remove('show');
            }
        }, { passive: true });

        scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== ANIMATIONS =====
    function initAnimations() {
        // Position 4 (8): Rich, dynamic animations
        const animatedElements = document.querySelectorAll('[data-animate]');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate;
                    const delay = entry.target.dataset.delay || 0;

                    setTimeout(() => {
                        entry.target.classList.add(`animate-${animation}`);
                    }, delay);

                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => animationObserver.observe(el));

        // Counter animation
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        };
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            });

            counterObserver.observe(counter);
        });
    }

    // ===== FORMS =====
    function initForms() {
        // Form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function (e) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('form-error');

                        // Add error message if not exists
                        let errorMsg = field.parentElement.querySelector('.form-error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('p');
                            errorMsg.className = 'form-error-message';
                            errorMsg.textContent = 'Este campo es obligatorio';
                            field.parentElement.appendChild(errorMsg);
                        }
                    } else {
                        field.classList.remove('form-error');
                        const errorMsg = field.parentElement.querySelector('.form-error-message');
                        if (errorMsg) errorMsg.remove();
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', function () {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.classList.add('form-error');
                    } else {
                        this.classList.remove('form-error');
                    }
                });
            });
        });
    }

    // ===== TABS =====
    function initTabs() {
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab');
            const contents = tabContainer.parentElement.querySelectorAll('.tab-content');

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Remove active from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    // Add active to clicked tab
                    tab.classList.add('active');
                    if (contents[index]) {
                        contents[index].classList.add('active');
                    }
                });
            });
        });
    }

    // ===== ACCORDION =====
    function initAccordion() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function () {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');

                // Close all items in same accordion
                const accordion = item.parentElement;
                accordion.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    window.utils = {
        // Debounce function
        debounce: function (func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function
        throttle: function (func, limit) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Format number
        formatNumber: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        // Copy to clipboard
        copyToClipboard: function (text) {
            return navigator.clipboard.writeText(text);
        },

        // Check if element is in viewport
        isInViewport: function (element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

})();
