/**
 * SEED: 857652327
 * Components Logic: Modals, sophisticated interactions
 */

/* --- NEWSLETTER MODAL (Seed 0..9) --- */
/* Simple exit intent for now */
document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0) {
        // Show modal if not already shown/dismissed (mock implementation)
        // console.log('Exit intent detected'); 
    }
});

/* --- ACCORDION (For FAQ) --- */
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isActive = header.classList.contains('active');

        // Close others
        document.querySelectorAll('.accordion-header').forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.style.maxHeight = null;
        });

        if (!isActive) {
            header.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});
