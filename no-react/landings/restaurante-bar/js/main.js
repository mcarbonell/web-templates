/**
 * EL RINCÓN DEL SABOR - JavaScript
 * Funcionalidades interactivas del sitio
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');
    const reservationForm = document.getElementById('reservationForm');
    const modal = document.getElementById('confirmationModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBtn = document.querySelector('.modal-btn');

    // ============================================
    // NAVEGACIÓN - Scroll y clases activas
    // ============================================
    
    // Cambiar estilo del navbar al hacer scroll
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mostrar/ocultar botón volver arriba
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Actualizar link activo según sección visible
        updateActiveLink();
    }
    
    window.addEventListener('scroll', handleScroll);

    // ============================================
    // MENÚ MÓVIL
    // ============================================
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navbar.classList.toggle('menu-open');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // SCROLL SUAVE
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Ajuste por el navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Botón volver arriba
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // LINK ACTIVO EN NAVEGACIÓN
    // ============================================
    
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // TABS DEL MENÚ
    // ============================================
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todos los tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Añadir clase active al tab clickeado
            this.classList.add('active');
            
            // Obtener el panel correspondiente
            const targetPanel = this.getAttribute('data-tab');
            
            // Ocultar todos los panels
            menuPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Mostrar el panel objetivo
            document.getElementById(targetPanel).classList.add('active');
        });
    });

    // ============================================
    // FORMULARIO DE RESERVAS
    // ============================================
    
    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }
    
    // Validación y envío del formulario
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos requeridos
            const requiredFields = reservationForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--color-primary)';
                    
                    // Quitar el error al escribir
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            if (isValid) {
                // Simular envío (en producción aquí iría el fetch/axios)
                showModal();
                reservationForm.reset();
            }
        });
    }

    // ============================================
    // MODAL DE CONFIRMACIÓN
    // ============================================
    
    function showModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBtn) {
        modalBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================================
    // ANIMACIONES AL SCROLL (Intersection Observer)
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    const animateElements = document.querySelectorAll('.menu-item, .gallery-item, .about-img');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // CSS para elementos animados
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // GALERÍA - Efecto hover mejorado
    // ============================================
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            setTimeout(() => {
                this.style.zIndex = '';
            }, 300);
        });
    });

    // ============================================
    // UTILIDADES
    // ============================================
    
    // Las imágenes ya usan loading="lazy" nativo del navegador
    // No se necesita JavaScript adicional para lazy loading
    
    // Prevenir envío de formulario al presionar Enter en ciertos campos
    const formInputs = document.querySelectorAll('.reservations-form input, .reservations-form select');
    formInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.tagName !== 'TEXTAREA') {
                e.preventDefault();
                // Mover al siguiente campo
                const form = this.form;
                const index = Array.prototype.indexOf.call(form, this);
                form.elements[index + 1].focus();
            }
        });
    });
    
    // Validación de teléfono (formato español)
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            // Permitir solo números, espacios y el signo +
            this.value = this.value.replace(/[^0-9\s+]/g, '');
        });
    }
    
    console.log('🍽️ El Rincón del Sabor - Web cargada correctamente');
});

// ============================================
// FUNCIONES GLOBALES
// ============================================

// Función para debounce (optimizar eventos de scroll/resize)
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Función para throttle (limitar frecuencia de ejecución)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}