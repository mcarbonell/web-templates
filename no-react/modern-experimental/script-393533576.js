/**
 * VOID Studio Landing Page Scripts
 * Seed: 393533576
 * 
 * Features:
 * - WebGL Dithering (60fps optimized)
 * - Theme Toggle (Light/Dark)
 * - Magnetic Buttons
 * - Scramble Text Effect
 * - Scroll Reveal Animations
 * - Counter Animation
 */

(function() {
    'use strict';
    
    // ========================================
    // Configuration
    // ========================================
    
    const CONFIG = {
        dither: {
            enabled: true,
            patternSize: 4,
            fps: 60
        },
        magnetic: {
            strength: 0.3,
            radius: 100
        },
        scramble: {
            speed: 50,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        }
    };
    
    // ========================================
    // WebGL Dithering Shader
    // ========================================
    
    class DitherRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.gl = canvas.getContext('webgl', {
                alpha: true,
                antialias: false,
                depth: false,
                stencil: false,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
            });
            
            if (!this.gl) {
                console.warn('WebGL not supported, dither effect disabled');
                this.enabled = false;
                return;
            }
            
            this.enabled = true;
            this.frameInterval = 1000 / CONFIG.dither.fps;
            this.lastFrame = 0;
            this.time = 0;
            
            this.init();
        }
        
        init() {
            const gl = this.gl;
            
            // Vertex Shader
            const vertexSource = `
                attribute vec2 a_position;
                varying vec2 v_uv;
                
                void main() {
                    v_uv = a_position * 0.5 + 0.5;
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `;
            
            // Fragment Shader - Ordered Dithering with Animation (GLSL ES 1.0 compatible)
            const fragmentSource = `
                precision mediump float;
                
                varying vec2 v_uv;
                uniform float u_time;
                uniform vec2 u_resolution;
                
                // Bayer matrix lookup function (GLSL ES 1.0 compatible)
                float bayer(int index) {
                    if (index == 0) return 0.0 / 16.0;
                    else if (index == 1) return 8.0 / 16.0;
                    else if (index == 2) return 2.0 / 16.0;
                    else if (index == 3) return 10.0 / 16.0;
                    else if (index == 4) return 12.0 / 16.0;
                    else if (index == 5) return 4.0 / 16.0;
                    else if (index == 6) return 14.0 / 16.0;
                    else if (index == 7) return 6.0 / 16.0;
                    else if (index == 8) return 3.0 / 16.0;
                    else if (index == 9) return 11.0 / 16.0;
                    else if (index == 10) return 1.0 / 16.0;
                    else if (index == 11) return 9.0 / 16.0;
                    else if (index == 12) return 15.0 / 16.0;
                    else if (index == 13) return 7.0 / 16.0;
                    else if (index == 14) return 13.0 / 16.0;
                    else return 5.0 / 16.0;
                }
                
                // Simple noise function
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    
                    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                }
                
                void main() {
                    vec2 uv = v_uv;
                    
                    // Scale coordinates
                    vec2 pixelCoord = uv * u_resolution;
                    
                    // Animated noise layers with more dramatic movement
                    float n1 = noise(uv * 80.0 + u_time * 0.3);
                    float n2 = noise(uv * 160.0 - u_time * 0.4);
                    float n3 = noise(uv * 40.0 + vec2(u_time * 0.2, -u_time * 0.25));
                    
                    // Additional flowing noise layer
                    float n4 = noise(uv * 20.0 + vec2(sin(u_time * 0.1) * 2.0, cos(u_time * 0.15) * 2.0));
                    
                    float combinedNoise = n1 * 0.35 + n2 * 0.25 + n3 * 0.25 + n4 * 0.15;
                    
                    // Bayer dither pattern
                    int x = int(mod(pixelCoord.x, 4.0));
                    int y = int(mod(pixelCoord.y, 4.0));
                    int index = x + y * 4;
                    
                    float threshold = bayer(index);
                    
                    // Apply dither
                    float dithered = step(threshold, combinedNoise);
                    
                    // Soft dither (not just binary)
                    float softDither = combinedNoise + (threshold - 0.5) * 0.4;
                    softDither = clamp(softDither, 0.0, 1.0);
                    
                    // Result with more visible variation
                    float result = mix(softDither, dithered, 0.4);
                    
                    // Add animated color tint
                    vec3 color = vec3(result);
                    color.r += sin(u_time * 0.8 + uv.x * 6.28318) * 0.05;
                    color.g += sin(u_time * 0.6 + uv.y * 6.28318 + 1.0) * 0.03;
                    color.b += cos(u_time * 0.4 + (uv.x + uv.y) * 3.14159) * 0.05;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `;
            
            // Compile shaders
            const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
            const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
            
            if (!vertexShader || !fragmentShader) {
                this.enabled = false;
                return;
            }
            
            // Create program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
            
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(this.program));
                this.enabled = false;
                return;
            }
            
            // Get locations
            this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
            this.timeLocation = gl.getUniformLocation(this.program, 'u_time');
            this.resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
            
            // Create geometry
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1
            ]), gl.STATIC_DRAW);
            
            this.positionBuffer = positionBuffer;
            
            // Setup
            gl.enableVertexAttribArray(this.positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
            
            this.resize();
        }
        
        compileShader(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        }
        
        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.floor(window.innerWidth * dpr * 0.5); // Lower res for performance
            const height = Math.floor(window.innerHeight * dpr * 0.5);
            
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            
            if (this.enabled) {
                this.gl.viewport(0, 0, width, height);
            }
        }
        
        render(timestamp) {
            if (!this.enabled) return;
            
            // Throttle to target FPS
            const elapsed = timestamp - this.lastFrame;
            if (elapsed < this.frameInterval) return;
            
            this.lastFrame = timestamp - (elapsed % this.frameInterval);
            this.time = timestamp * 0.001;
            
            const gl = this.gl;
            
            gl.useProgram(this.program);
            gl.uniform1f(this.timeLocation, this.time);
            gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
            
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
    
    // ========================================
    // Theme Toggle
    // ========================================
    
    class ThemeToggle {
        constructor() {
            this.toggle = document.getElementById('theme-toggle');
            this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Initialize theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else if (!this.prefersDark.matches) {
                document.documentElement.setAttribute('data-theme', 'light');
            }
            
            this.bindEvents();
        }
        
        bindEvents() {
            this.toggle.addEventListener('click', () => this.toggleTheme());
            this.prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        }
        
        toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        }
    }
    
    // ========================================
    // Magnetic Buttons
    // ========================================
    
    class MagneticButtons {
        constructor() {
            this.buttons = document.querySelectorAll('[data-magnetic]');
            this.bound = false;
            
            // Only enable on non-touch devices
            if (!('ontouchstart' in window)) {
                this.bindEvents();
            }
        }
        
        bindEvents() {
            this.buttons.forEach(button => {
                button.addEventListener('mousemove', (e) => this.handleMove(e, button));
                button.addEventListener('mouseleave', (e) => this.handleLeave(e, button));
            });
            this.bound = true;
        }
        
        handleMove(e, button) {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < CONFIG.magnetic.radius) {
                const strength = CONFIG.magnetic.strength * (1 - distance / CONFIG.magnetic.radius);
                const moveX = deltaX * strength;
                const moveY = deltaY * strength;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        }
        
        handleLeave(e, button) {
            button.style.transform = '';
        }
    }
    
    // ========================================
    // Scramble Text Effect
    // ========================================
    
    class ScrambleText {
        constructor() {
            this.elements = document.querySelectorAll('[data-scramble]');
            this.originalTexts = new Map();
            
            this.elements.forEach(el => {
                this.originalTexts.set(el, el.textContent);
            });
            
            this.bindEvents();
        }
        
        bindEvents() {
            this.elements.forEach(el => {
                el.addEventListener('mouseenter', () => this.scramble(el));
                el.addEventListener('mouseleave', () => this.restore(el));
            });
        }
        
        scramble(element) {
            const original = this.originalTexts.get(element);
            const length = original.length;
            let iteration = 0;
            
            if (this.interval) {
                clearInterval(this.interval);
            }
            
            this.interval = setInterval(() => {
                element.textContent = original
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return original[index];
                        }
                        return char === ' ' ? ' ' : CONFIG.scramble.chars[Math.floor(Math.random() * CONFIG.scramble.chars.length)];
                    })
                    .join('');
                
                if (iteration >= length) {
                    clearInterval(this.interval);
                }
                
                iteration += 1 / 3;
            }, CONFIG.scramble.speed);
        }
        
        restore(element) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            element.textContent = this.originalTexts.get(element);
        }
    }
    
    // ========================================
    // Scroll Reveal
    // ========================================
    
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll('[data-reveal]');
            this.init();
        }
        
        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            this.elements.forEach(el => observer.observe(el));
        }
    }
    
    // ========================================
    // Counter Animation
    // ========================================
    
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('[data-count]');
            this.init();
        }
        
        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animate(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            
            this.counters.forEach(counter => observer.observe(counter));
        }
        
        animate(element) {
            const target = parseInt(element.getAttribute('data-count'), 10);
            const duration = 2000;
            const start = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-expo)
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                element.textContent = Math.floor(eased * target);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            };
            
            requestAnimationFrame(update);
        }
    }
    
    // ========================================
    // Animation Loop
    // ========================================
    
    class AnimationLoop {
        constructor(ditherRenderer) {
            this.dither = ditherRenderer;
            this.running = false;
        }
        
        start() {
            if (this.running) return;
            this.running = true;
            this.loop();
        }
        
        loop(timestamp) {
            if (!this.running) return;
            
            if (this.dither && this.dither.enabled) {
                this.dither.render(timestamp);
            }
            
            requestAnimationFrame((t) => this.loop(t));
        }
        
        stop() {
            this.running = false;
        }
    }
    
    // ========================================
    // Initialize
    // ========================================
    
    function init() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize dither renderer
        const canvas = document.getElementById('dither-canvas');
        const ditherRenderer = new DitherRenderer(canvas);
        
        // Start animation loop if dither is enabled and motion is OK
        if (!prefersReducedMotion && ditherRenderer.enabled) {
            const loop = new AnimationLoop(ditherRenderer);
            loop.start();
            
            // Handle resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => ditherRenderer.resize(), 100);
            });
        } else {
            // Hide canvas if disabled
            canvas.style.display = 'none';
        }
        
        // Initialize other features
        new ThemeToggle();
        new MagneticButtons();
        new ScrambleText();
        new ScrollReveal();
        new CounterAnimation();
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
