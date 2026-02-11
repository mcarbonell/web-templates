/*
SEED: 537480422
Main JavaScript Entry Point
Functions:
- Initialize Components
- Setup Global Event Listeners
- Performance Optimizations (Lazy Loading)
*/

document.addEventListener('DOMContentLoaded', () => {
    // Inject Header and Footer if they don't exist
    if (typeof COMPONENTS !== 'undefined') {
        const headerPlaceholder = document.querySelector('header');
        if (!headerPlaceholder) {
            document.body.insertAdjacentHTML('afterbegin', COMPONENTS.header);
        }
        const footerPlaceholder = document.querySelector('footer');
        if (!footerPlaceholder) {
            document.body.insertAdjacentHTML('beforeend', COMPONENTS.footer);
        }

        // Initialize Theme and Interactions
        if (typeof initInteractions !== 'undefined') {
            initInteractions();
        }
    }

    // Intersection Observer for Animations (Seed-4: Moderate/Fluid)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

// Polyfill for smooth scroll if needed (though modern browsers support it)
// Seed-2: Interaction Depth - Smooth Focus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href').length > 1) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
