/* ==========================================================================
   CIPHER - Digital Creative Agency Landing Page
   Seed: 437895380
   JavaScript: WebGL Shader, Animations, Interactions
   ========================================================================== */

(function() {
    'use strict';

    const SEED = 437895380;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersLowPerformance = isMobile || isReducedMotion;

    /* -------------------------------------------------------------------------
       WebGL Shader - Dithering + Chromatic Aberration
       ------------------------------------------------------------------------- */
    class WebGLBackground {
        constructor(canvas) {
            this.canvas = canvas;
            this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!this.gl) {
                console.warn('WebGL not supported, falling back to CSS');
                canvas.style.display = 'none';
                return;
            }

            this.time = 0;
            this.resolutionScale = prefersLowPerformance ? 0.5 : 1;
            this.mouse = { x: 0.5, y: 0.5 };
            
            this.init();
            this.resize();
            this.bindEvents();
            
            if (!isReducedMotion) {
                this.animate();
            }
        }

        init() {
            const gl = this.gl;

            const vertexShaderSource = `
                attribute vec2 a_position;
                varying vec2 v_uv;
                void main() {
                    v_uv = a_position * 0.5 + 0.5;
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `;

            const fragmentShaderSource = `
                precision mediump float;
                varying vec2 v_uv;
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                uniform float u_seed;

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

                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 5; i++) {
                        value += amplitude * noise(p);
                        p *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                vec3 dither(vec2 pos, vec3 color, float strength) {
                    float dither_pattern = hash(pos + u_seed);
                    return color + (dither_pattern - 0.5) * strength;
                }

                void main() {
                    vec2 uv = v_uv;
                    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
                    
                    float time = u_time * 0.3;
                    
                    vec2 mouse_offset = (u_mouse - 0.5) * 0.1;
                    
                    float n1 = fbm(uv * 3.0 + time * 0.2 + mouse_offset);
                    float n2 = fbm(uv * 5.0 - time * 0.15 + vec2(n1));
                    float n3 = fbm(uv * 7.0 + time * 0.1 + vec2(n2));
                    
                    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
                    
                    vec3 color1 = vec3(0.0, 1.0, 0.83);
                    vec3 color2 = vec3(1.0, 0.0, 0.67);
                    vec3 color3 = vec3(0.53, 0.33, 1.0);
                    
                    vec3 baseColor = mix(color1, color2, pattern);
                    baseColor = mix(baseColor, color3, n3 * 0.5);
                    
                    baseColor *= 0.15;
                    
                    vec2 distort = vec2(
                        sin(uv.y * 20.0 + time) * 0.001,
                        cos(uv.x * 20.0 + time) * 0.001
                    );
                    
                    float r = pattern + fbm(uv + distort + 0.01);
                    float g = pattern + fbm(uv + distort);
                    float b = pattern + fbm(uv + distort - 0.01);
                    
                    vec3 chromatic = vec3(r, g, b) * 0.08;
                    
                    float scanline = sin(uv.y * u_resolution.y * 0.5) * 0.02;
                    
                    vec3 finalColor = baseColor + chromatic;
                    finalColor += scanline;
                    
                    finalColor = dither(gl_FragCoord.xy, finalColor, 0.03);
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `;

            this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
            gl.useProgram(this.program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                 1,  1
            ]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(this.program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            this.uniforms = {
                time: gl.getUniformLocation(this.program, 'u_time'),
                resolution: gl.getUniformLocation(this.program, 'u_resolution'),
                mouse: gl.getUniformLocation(this.program, 'u_mouse'),
                seed: gl.getUniformLocation(this.program, 'u_seed')
            };

            gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
            gl.uniform2f(this.uniforms.mouse, 0.5, 0.5);
            gl.uniform1f(this.uniforms.seed, SEED * 0.00001);
        }

        createProgram(vertexSource, fragmentSource) {
            const gl = this.gl;
            
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexSource);
            gl.compileShader(vertexShader);
            
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);
            
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            
            return program;
        }

        resize() {
            const width = window.innerWidth * this.resolutionScale;
            const height = window.innerHeight * this.resolutionScale;
            
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            
            if (this.gl && this.uniforms) {
                this.gl.viewport(0, 0, width, height);
                this.gl.uniform2f(this.uniforms.resolution, width, height);
            }
        }

        bindEvents() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => this.resize(), 100);
            });

            if (!prefersLowPerformance) {
                window.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX / window.innerWidth;
                    this.mouse.y = 1 - e.clientY / window.innerHeight;
                });
            }
        }

        animate() {
            const render = () => {
                this.time += 0.016;
                
                this.gl.uniform1f(this.uniforms.time, this.time);
                this.gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y);
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
                
                requestAnimationFrame(render);
            };
            
            requestAnimationFrame(render);
        }
    }

    /* -------------------------------------------------------------------------
       Scramble Text Effect
       ------------------------------------------------------------------------- */
    class ScrambleText {
        constructor(elements) {
            this.elements = elements;
            this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
            this.isScrambling = false;
        }

        scramble(element, finalText, duration = 1000) {
            if (isReducedMotion) {
                element.textContent = finalText;
                return;
            }

            const originalText = finalText;
            const length = originalText.length;
            const frameRate = 30;
            const totalFrames = duration / (1000 / frameRate);
            let frame = 0;

            const interval = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                
                let text = '';
                for (let i = 0; i < length; i++) {
                    if (Math.random() < progress) {
                        text += originalText[i];
                    } else {
                        text += this.chars[Math.floor(Math.random() * this.chars.length)];
                    }
                }
                
                element.textContent = text;
                
                if (frame >= totalFrames) {
                    clearInterval(interval);
                    element.textContent = originalText;
                }
            }, 1000 / frameRate);
        }

        bindHover() {
            this.elements.forEach(element => {
                const text = element.dataset.scramble || element.textContent;
                
                element.addEventListener('mouseenter', () => {
                    if (!this.isScrambling) {
                        this.isScrambling = true;
                        this.scramble(element, text, 500);
                        setTimeout(() => {
                            this.isScrambling = false;
                        }, 500);
                    }
                });
            });
        }
    }

    /* -------------------------------------------------------------------------
       Magnetic Buttons
       ------------------------------------------------------------------------- */
    class MagneticButton {
        constructor(elements) {
            this.elements = elements;
            this.strength = prefersLowPerformance ? 0 : 0.3;
            this.bindEvents();
        }

        bindEvents() {
            if (this.strength === 0) return;

            this.elements.forEach(element => {
                element.addEventListener('mousemove', (e) => {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
                });

                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'translate(0, 0)';
                });
            });
        }
    }

    /* -------------------------------------------------------------------------
       Scroll Reveal Animation
       ------------------------------------------------------------------------- */
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll('.reveal-text, .reveal-card');
            this.init();
        }

        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            this.elements.forEach((el, index) => {
                el.style.transitionDelay = `${index * 0.05}s`;
                observer.observe(el);
            });
        }
    }

    /* -------------------------------------------------------------------------
       Count Up Animation
       ------------------------------------------------------------------------- */
    class CountUp {
        constructor(elements) {
            this.elements = elements;
            this.animated = new Set();
            this.init();
        }

        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animated.has(entry.target)) {
                            this.animate(entry.target);
                            this.animated.add(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            this.elements.forEach(el => observer.observe(el));
        }

        animate(element) {
            const target = parseInt(element.dataset.count, 10);
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            };

            requestAnimationFrame(update);
        }
    }

    /* -------------------------------------------------------------------------
       Theme Toggle
       ------------------------------------------------------------------------- */
    class ThemeToggle {
        constructor() {
            this.toggle = document.querySelector('.theme-toggle');
            this.html = document.documentElement;
            this.init();
        }

        init() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                this.html.dataset.theme = savedTheme;
            }

            this.toggle.addEventListener('click', () => {
                const currentTheme = this.html.dataset.theme;
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                this.html.dataset.theme = newTheme;
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    /* -------------------------------------------------------------------------
       Kinetic Text Animation
       ------------------------------------------------------------------------- */
    class KineticText {
        constructor(elements) {
            this.elements = elements;
            this.init();
        }

        init() {
            if (isReducedMotion) return;

            this.elements.forEach(element => {
                const text = element.textContent;
                element.innerHTML = '';
                
                text.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.display = 'inline-block';
                    span.style.animationDelay = `${i * 0.03}s`;
                    element.appendChild(span);
                });
            });

            this.addStyles();
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .kinetic-text span {
                    animation: kineticFloat 3s ease-in-out infinite;
                }
                @keyframes kineticFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* -------------------------------------------------------------------------
       Smooth Scroll
       ------------------------------------------------------------------------- */
    class SmoothScroll {
        constructor() {
            this.links = document.querySelectorAll('a[href^="#"]');
            this.init();
        }

        init() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    }

    /* -------------------------------------------------------------------------
       Initialize
       ------------------------------------------------------------------------- */
    function init() {
        const canvas = document.getElementById('webgl-canvas');
        if (canvas) {
            new WebGLBackground(canvas);
        }

        const scrambleElements = document.querySelectorAll('[data-scramble]');
        if (scrambleElements.length) {
            const scramble = new ScrambleText(scrambleElements);
            scramble.bindHover();
        }

        const magneticElements = document.querySelectorAll('.magnetic');
        if (magneticElements.length) {
            new MagneticButton(magneticElements);
        }

        new ScrollReveal();

        const countElements = document.querySelectorAll('[data-count]');
        if (countElements.length) {
            new CountUp(countElements);
        }

        new ThemeToggle();

        const kineticElements = document.querySelectorAll('.kinetic-text');
        if (kineticElements.length) {
            new KineticText(kineticElements);
        }

        new SmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
