/**
 * NEXUS TECH - COMPONENTS JAVASCRIPT
 * Seed: 280895384
 * 
 * Reusable UI components and dynamic element creation
 * Digit 6 = 5: Layered depth effects
 * Digit 8 = 8: 3D interaction components
 */

(function() {
  'use strict';

  // ============================================
  // COMPONENT FACTORY
  // ============================================
  const Components = {
    /**
     * Create a button element
     */
    createButton(options = {}) {
      const {
        text = 'Button',
        variant = 'primary',
        size = 'md',
        href = null,
        icon = null,
        iconPosition = 'right',
        className = '',
        attributes = {}
      } = options;

      const element = document.createElement(href ? 'a' : 'button');
      element.className = `btn btn-${variant} btn-${size} ${className}`;
      
      if (href) {
        element.href = href;
      } else {
        element.type = 'button';
      }

      // Add content
      const content = [];
      
      if (icon && iconPosition === 'left') {
        content.push(this.createIcon(icon));
      }
      
      const span = document.createElement('span');
      span.textContent = text;
      content.push(span);
      
      if (icon && iconPosition === 'right') {
        content.push(this.createIcon(icon));
      }
      
      content.forEach(child => element.appendChild(child));

      // Add attributes
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });

      return element;
    },

    /**
     * Create a card element
     */
    createCard(options = {}) {
      const {
        title = '',
        description = '',
        image = null,
        badge = null,
        footer = null,
        variant = 'default',
        className = '',
        attributes = {}
      } = options;

      const card = document.createElement('div');
      card.className = `card card-${variant} ${className}`;

      // Image
      if (image) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'card-image-wrapper';
        imgWrapper.style.cssText = `
          margin: calc(-1 * var(--space-8));
          margin-bottom: var(--space-6);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          overflow: hidden;
        `;
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = title;
        img.style.cssText = 'width: 100%; height: 200px; object-fit: cover;';
        
        imgWrapper.appendChild(img);
        card.appendChild(imgWrapper);
      }

      // Badge
      if (badge) {
        const badgeEl = this.createBadge(badge);
        badgeEl.style.marginBottom = 'var(--space-3)';
        card.appendChild(badgeEl);
      }

      // Title
      if (title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'card-title';
        titleEl.textContent = title;
        card.appendChild(titleEl);
      }

      // Description
      if (description) {
        const descEl = document.createElement('p');
        descEl.className = 'card-text';
        descEl.textContent = description;
        card.appendChild(descEl);
      }

      // Footer
      if (footer) {
        const footerEl = document.createElement('div');
        footerEl.className = 'card-footer';
        footerEl.style.cssText = `
          margin-top: var(--space-6);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-border);
        `;
        
        if (typeof footer === 'string') {
          footerEl.innerHTML = footer;
        } else {
          footerEl.appendChild(footer);
        }
        
        card.appendChild(footerEl);
      }

      // Add attributes
      Object.entries(attributes).forEach(([key, value]) => {
        card.setAttribute(key, value);
      });

      return card;
    },

    /**
     * Create a badge element
     */
    createBadge(options = {}) {
      const {
        text = '',
        variant = 'default',
        icon = null,
        className = ''
      } = typeof options === 'string' ? { text: options } : options;

      const badge = document.createElement('span');
      badge.className = `badge badge-${variant} ${className}`;

      if (icon) {
        badge.appendChild(this.createIcon(icon));
      }

      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      badge.appendChild(textSpan);

      return badge;
    },

    /**
     * Create an icon element (SVG)
     */
    createIcon(name, options = {}) {
      const {
        size = 20,
        className = ''
      } = options;

      const iconMap = {
        'arrow-right': '<polyline points="9 18 15 12 9 6"></polyline><path d="M5 12h14"></path>',
        'arrow-left': '<polyline points="15 18 9 12 15 6"></polyline><path d="M19 12H5"></path>',
        'chevron-down': '<polyline points="6 9 12 15 18 9"></polyline>',
        'chevron-up': '<polyline points="18 15 12 9 6 15"></polyline>',
        'check': '<polyline points="20 6 9 17 4 12"></polyline>',
        'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
        'menu': '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
        'search': '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
        'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
        'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
        'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
        'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
        'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
        'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
        'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
        'sun': '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
        'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
        'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
        'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
        'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
        'info': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
        'alert-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
        'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
        'trash': '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
        'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
        'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
        'unlock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',
        'credit-card': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
        'shopping-cart': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
        'tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
        'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',
        'grid': '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
        'list': '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
        'play': '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
        'pause': '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
        'home': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'
      };

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.classList.add(className);

      if (iconMap[name]) {
        svg.innerHTML = iconMap[name];
      }

      return svg;
    },

    /**
     * Create an alert element
     */
    createAlert(options = {}) {
      const {
        message = '',
        variant = 'info',
        dismissible = true,
        className = ''
      } = options;

      const alert = document.createElement('div');
      alert.className = `alert alert-${variant} ${className}`;
      alert.setAttribute('role', 'alert');

      const iconMap = {
        info: 'info',
        success: 'check-circle',
        warning: 'alert-circle',
        error: 'alert-circle'
      };

      alert.appendChild(this.createIcon(iconMap[variant] || 'info'));

      const messageEl = document.createElement('span');
      messageEl.textContent = message;
      alert.appendChild(messageEl);

      if (dismissible) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'alert-close';
        closeBtn.style.cssText = `
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: inherit;
          opacity: 0.6;
        `;
        closeBtn.appendChild(this.createIcon('x', { size: 16 }));
        closeBtn.addEventListener('click', () => {
          alert.style.opacity = '0';
          alert.style.transform = 'translateX(100%)';
          setTimeout(() => alert.remove(), 300);
        });
        alert.appendChild(closeBtn);
      }

      return alert;
    },

    /**
     * Create a toast notification
     */
    createToast(options = {}) {
      const {
        message = '',
        variant = 'info',
        duration = 5000
      } = options;

      const toast = document.createElement('div');
      toast.className = `toast toast-${variant}`;
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: var(--color-bg-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
      `;

      const iconMap = {
        info: 'info',
        success: 'check-circle',
        warning: 'alert-circle',
        error: 'alert-circle'
      };

      toast.appendChild(this.createIcon(iconMap[variant] || 'info'));

      const text = document.createElement('span');
      text.textContent = message;
      toast.appendChild(text);

      document.body.appendChild(toast);

      // Animate in
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
      });

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          toast.style.transform = 'translateX(120%)';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }

      return toast;
    },

    /**
     * Create an accordion item
     */
    createAccordionItem(options = {}) {
      const {
        title = '',
        content = '',
        open = false
      } = options;

      const item = document.createElement('div');
      item.className = 'accordion-item';
      item.style.cssText = `
        border-bottom: 1px solid var(--color-border);
      `;

      const header = document.createElement('button');
      header.className = 'accordion-header';
      header.style.cssText = `
        width: 100%;
        padding: var(--space-5) 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: none;
        border: none;
        cursor: pointer;
        font-family: var(--font-heading);
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        color: var(--color-text);
        text-align: left;
      `;

      const titleSpan = document.createElement('span');
      titleSpan.textContent = title;
      header.appendChild(titleSpan);

      const icon = this.createIcon('chevron-down');
      icon.style.cssText = `
        transition: transform 0.3s ease;
        flex-shrink: 0;
      `;
      header.appendChild(icon);

      const body = document.createElement('div');
      body.className = 'accordion-body';
      body.style.cssText = `
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
      `;

      const bodyContent = document.createElement('div');
      bodyContent.innerHTML = content;
      bodyContent.style.cssText = `
        padding-bottom: var(--space-5);
        color: var(--color-text-secondary);
        line-height: var(--leading-relaxed);
      `;
      body.appendChild(bodyContent);

      header.addEventListener('click', () => {
        const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
        
        if (isOpen) {
          body.style.maxHeight = '0px';
          body.style.paddingBottom = '0';
          icon.style.transform = 'rotate(0deg)';
        } else {
          body.style.maxHeight = body.scrollHeight + 'px';
          body.style.paddingBottom = 'var(--space-5)';
          icon.style.transform = 'rotate(180deg)';
        }
      });

      item.appendChild(header);
      item.appendChild(body);

      if (open) {
        setTimeout(() => {
          body.style.maxHeight = body.scrollHeight + 'px';
          body.style.paddingBottom = 'var(--space-5)';
          icon.style.transform = 'rotate(180deg)';
        }, 100);
      }

      return item;
    },

    /**
     * Create a tab component
     */
    createTabs(tabs = []) {
      const container = document.createElement('div');
      container.className = 'tabs';

      const tabList = document.createElement('div');
      tabList.className = 'tab-list';
      tabList.style.cssText = `
        display: flex;
        gap: var(--space-2);
        border-bottom: 2px solid var(--color-border);
        margin-bottom: var(--space-6);
      `;

      const tabPanels = document.createElement('div');
      tabPanels.className = 'tab-panels';

      tabs.forEach((tab, index) => {
        const button = document.createElement('button');
        button.className = `tab-button ${index === 0 ? 'active' : ''}`;
        button.textContent = tab.label;
        button.style.cssText = `
          padding: var(--space-3) var(--space-5);
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--color-text-secondary);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        if (index === 0) {
          button.style.color = 'var(--color-primary-500)';
          button.style.borderBottomColor = 'var(--color-primary-500)';
        }

        button.addEventListener('click', () => {
          // Update buttons
          tabList.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.color = 'var(--color-text-secondary)';
            btn.style.borderBottomColor = 'transparent';
          });
          button.classList.add('active');
          button.style.color = 'var(--color-primary-500)';
          button.style.borderBottomColor = 'var(--color-primary-500)';

          // Update panels
          tabPanels.querySelectorAll('.tab-panel').forEach((panel, i) => {
            panel.style.display = i === index ? 'block' : 'none';
          });
        });

        tabList.appendChild(button);

        const panel = document.createElement('div');
        panel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
        panel.style.display = index === 0 ? 'block' : 'none';
        
        if (typeof tab.content === 'string') {
          panel.innerHTML = tab.content;
        } else {
          panel.appendChild(tab.content);
        }
        
        tabPanels.appendChild(panel);
      });

      container.appendChild(tabList);
      container.appendChild(tabPanels);

      return container;
    },

    /**
     * Create a dropdown menu
     */
    createDropdown(options = {}) {
      const {
        trigger = null,
        items = [],
        align = 'left'
      } = options;

      const wrapper = document.createElement('div');
      wrapper.className = 'dropdown';
      wrapper.style.cssText = `
        position: relative;
        display: inline-block;
      `;

      if (trigger) {
        wrapper.appendChild(trigger);
      }

      const menu = document.createElement('div');
      menu.className = 'dropdown-menu';
      menu.style.cssText = `
        position: absolute;
        top: 100%;
        ${align}: 0;
        margin-top: var(--space-2);
        min-width: 200px;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
      `;

      items.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href || '#';
        link.className = 'dropdown-item';
        link.textContent = item.label;
        link.style.cssText = `
          display: block;
          padding: var(--space-3) var(--space-4);
          color: var(--color-text);
          font-size: var(--text-sm);
          transition: background 0.2s ease;
        `;
        link.addEventListener('mouseenter', () => {
          link.style.backgroundColor = 'var(--color-bg-elevated)';
        });
        link.addEventListener('mouseleave', () => {
          link.style.backgroundColor = 'transparent';
        });
        menu.appendChild(link);
      });

      wrapper.appendChild(menu);

      // Toggle functionality
      const toggle = trigger || wrapper;
      let isOpen = false;

      const open = () => {
        isOpen = true;
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
      };

      const close = () => {
        isOpen = false;
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
      };

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? close() : open();
      });

      document.addEventListener('click', () => {
        if (isOpen) close();
      });

      return wrapper;
    }
  };

  // Expose globally
  window.NexusComponents = Components;
})();
