/**
 * =============================================================================
 * COMPONENTS.JS - Reusable Component Functions
 * Seed: 297883763
 * =============================================================================
 * 
 * Additional component functionality:
 * - Accordion
 * - Tabs
 * - Modal system
 * - Toast notifications
 * - Dropdown menus
 * - Tooltip system
 * 
 * Animation level: Maximal (digit 4 = 8)
 * =============================================================================
 */

(function() {
  'use strict';

  // ============================================================================
  // ACCORDION COMPONENT
  // ============================================================================

  const Accordion = {
    init(selector = '.accordion') {
      const accordions = document.querySelectorAll(selector);
      accordions.forEach(accordion => this.setup(accordion));
    },
    
    setup(accordion) {
      const items = accordion.querySelectorAll('.accordion__item');
      
      items.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');
        if (!trigger) return;
        
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('accordion__item--open');
          
          // Close all others if single mode
          if (accordion.dataset.single !== 'false') {
            items.forEach(i => i.classList.remove('accordion__item--open'));
          }
          
          // Toggle current
          item.classList.toggle('accordion__item--open', !isOpen);
          
          // Update ARIA
          trigger.setAttribute('aria-expanded', !isOpen);
        });
      });
    }
  };

  // ============================================================================
  // TABS COMPONENT
  // ============================================================================

  const Tabs = {
    init(selector = '.tabs-container') {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => this.setup(container));
    },
    
    setup(container) {
      const tabs = container.querySelectorAll('.tab');
      const panels = container.querySelectorAll('.tab__panel');
      
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Deactivate all
          tabs.forEach(t => {
            t.classList.remove('tab--active');
            t.setAttribute('aria-selected', 'false');
          });
          panels.forEach(p => p.classList.remove('tab__panel--active'));
          
          // Activate current
          tab.classList.add('tab--active');
          tab.setAttribute('aria-selected', 'true');
          if (panels[index]) {
            panels[index].classList.add('tab__panel--active');
          }
        });
      });
    }
  };

  // ============================================================================
  // MODAL SYSTEM
  // ============================================================================

  const Modal = {
    activeModal: null,
    
    init() {
      // Setup existing modals
      document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.dataset.modal;
          this.open(modalId);
        });
      });
      
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close();
        }
      });
    },
    
    open(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      
      this.activeModal = modal;
      modal.classList.add('modal-overlay--open');
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
      
      // Setup close buttons
      modal.querySelectorAll('.modal__close, [data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });
      
      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    },
    
    close() {
      if (!this.activeModal) return;
      
      this.activeModal.classList.remove('modal-overlay--open');
      document.body.style.overflow = '';
      this.activeModal = null;
    },
    
    create(options = {}) {
      const {
        title = '',
        content = '',
        footer = '',
        size = 'medium'
      } = options;
      
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal modal--${size}">
          <div class="modal__header">
            <h3 class="modal__title">${title}</h3>
            <button class="modal__close" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal__body">${content}</div>
          ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
        </div>
      `;
      
      document.body.appendChild(modal);
      return modal;
    }
  };

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================

  const Toast = {
    container: null,
    
    init() {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    },
    
    show(options = {}) {
      if (!this.container) this.init();
      
      const {
        message = '',
        type = 'info',
        duration = 5000
      } = options;
      
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.innerHTML = `
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Dismiss">×</button>
      `;
      
      this.container.appendChild(toast);
      
      // Animate in
      requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
      });
      
      // Auto dismiss
      const dismiss = () => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
      };
      
      if (duration > 0) {
        setTimeout(dismiss, duration);
      }
      
      toast.querySelector('.toast__close').addEventListener('click', dismiss);
    },
    
    success(message, duration) {
      this.show({ message, type: 'success', duration });
    },
    
    error(message, duration) {
      this.show({ message, type: 'error', duration });
    },
    
    warning(message, duration) {
      this.show({ message, type: 'warning', duration });
    },
    
    info(message, duration) {
      this.show({ message, type: 'info', duration });
    }
  };

  // ============================================================================
  // DROPDOWN MENUS
  // ============================================================================

  const Dropdown = {
    init(selector = '[data-dropdown]') {
      document.querySelectorAll(selector).forEach(dropdown => {
        this.setup(dropdown);
      });
    },
    
    setup(dropdown) {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      
      if (!trigger || !menu) return;
      
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('dropdown--open');
        
        // Close all others
        document.querySelectorAll('[data-dropdown]').forEach(d => {
          d.classList.remove('dropdown--open');
        });
        
        dropdown.classList.toggle('dropdown--open', !isOpen);
      });
      
      // Close on outside click
      document.addEventListener('click', () => {
        dropdown.classList.remove('dropdown--open');
      });
    }
  };

  // ============================================================================
  // TOOLTIP SYSTEM
  // ============================================================================

  const Tooltip = {
    init(selector = '[data-tooltip]') {
      document.querySelectorAll(selector).forEach(el => {
        this.setup(el);
      });
    },
    
    setup(element) {
      const text = element.dataset.tooltip;
      const position = element.dataset.tooltipPosition || 'top';
      
      element.addEventListener('mouseenter', () => {
        this.show(element, text, position);
      });
      
      element.addEventListener('mouseleave', () => {
        this.hide();
      });
    },
    
    show(target, text, position) {
      const tooltip = document.createElement('div');
      tooltip.className = `tooltip tooltip--${position}`;
      tooltip.textContent = text;
      document.body.appendChild(tooltip);
      
      const rect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top, left;
      
      switch (position) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          break;
      }
      
      tooltip.style.top = `${top + window.scrollY}px`;
      tooltip.style.left = `${left}px`;
      
      requestAnimationFrame(() => {
        tooltip.classList.add('tooltip--visible');
      });
      
      this.currentTooltip = tooltip;
    },
    
    hide() {
      if (this.currentTooltip) {
        this.currentTooltip.remove();
        this.currentTooltip = null;
      }
    }
  };

  // ============================================================================
  // IMAGE LAZY LOADING
  // ============================================================================

  const LazyLoad = {
    init(selector = '[data-lazy]') {
      const images = document.querySelectorAll(selector);
      if (images.length === 0) return;
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.load(entry.target);
            imageObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });
      
      images.forEach(img => imageObserver.observe(img));
    },
    
    load(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      
      if (src) {
        img.src = src;
      }
      
      if (srcset) {
        img.srcset = srcset;
      }
      
      img.classList.add('loaded');
      img.removeAttribute('data-lazy');
    }
  };

  // ============================================================================
  // CAROUSEL/SLIDER
  // ============================================================================

  const Carousel = {
    init(selector = '.carousel') {
      document.querySelectorAll(selector).forEach(carousel => {
        this.setup(carousel);
      });
    },
    
    setup(carousel) {
      const track = carousel.querySelector('.carousel__track');
      const slides = carousel.querySelectorAll('.carousel__slide');
      const prevBtn = carousel.querySelector('.carousel__prev');
      const nextBtn = carousel.querySelector('.carousel__next');
      const dots = carousel.querySelectorAll('.carousel__dot');
      
      if (!track || slides.length === 0) return;
      
      let currentIndex = 0;
      
      const goTo = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.toggle('carousel__dot--active', i === currentIndex);
        });
      };
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
      }
      
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goTo(index));
      });
      
      // Auto-advance
      const autoPlay = carousel.dataset.autoplay;
      if (autoPlay) {
        setInterval(() => goTo(currentIndex + 1), parseInt(autoPlay));
      }
      
      // Touch support
      let startX = 0;
      let isDragging = false;
      
      track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });
      
      track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 50) {
          goTo(currentIndex + (diff > 0 ? 1 : -1));
          isDragging = false;
        }
      });
      
      track.addEventListener('touchend', () => {
        isDragging = false;
      });
    }
  };

  // ============================================================================
  // SEARCH FUNCTIONALITY
  // ============================================================================

  const Search = {
    init() {
      document.querySelectorAll('[data-search]').forEach(form => {
        this.setup(form);
      });
    },
    
    setup(form) {
      const input = form.querySelector('[data-search-input]');
      const results = form.querySelector('[data-search-results]');
      
      if (!input || !results) return;
      
      let debounceTimer;
      
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.performSearch(e.target.value, results);
        }, 300);
      });
    },
    
    async performSearch(query, resultsContainer) {
      if (!query.trim()) {
        resultsContainer.innerHTML = '';
        return;
      }
      
      // This would typically fetch from an API
      // For now, just show a loading state
      resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results
      resultsContainer.innerHTML = `
        <div class="search-results">
          <p class="search-results__count">Found results for "${query}"</p>
        </div>
      `;
    }
  };

  // ============================================================================
  // EXPOSE TO GLOBAL SCOPE
  // ============================================================================

  window.Components = {
    Accordion,
    Tabs,
    Modal,
    Toast,
    Dropdown,
    Tooltip,
    LazyLoad,
    Carousel,
    Search
  };

  // Auto-initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    Accordion.init();
    Tabs.init();
    Modal.init();
    Dropdown.init();
    Tooltip.init();
    LazyLoad.init();
    Carousel.init();
    Search.init();
  });

})();
