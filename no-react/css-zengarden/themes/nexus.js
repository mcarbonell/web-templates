/* NEXUS Theme JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // Create Aurora Background
    createAuroraBackground();
    
    // Create WebGL Canvas
    createWebGLBackground();
    
    // Add kinetic text effects
    addKineticEffects();
    
    // Add scroll animations
    addScrollAnimations();
});

function createAuroraBackground() {
    const aurora = document.createElement('div');
    aurora.className = 'aurora-bg';
    aurora.innerHTML = `
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
        <div class="aurora-blob aurora-blob-3"></div>
    `;
    document.body.insertBefore(aurora, document.body.firstChild);
}

function createWebGLBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'webgl-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
        console.log('WebGL not supported');
        return;
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    
    const fragmentShaderSource = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution;
            
            float dither = random(floor(gl_FragCoord.xy / 2.0) + floor(time * 10.0));
            float noise = random(uv + time * 0.1) * 0.02;
            vec3 tint = vec3(0.0, 1.0, 1.0);
            vec3 color = vec3(0.0);
            color += tint * dither * 0.03;
            color += noise;
            
            gl_FragColor = vec4(color, 0.12);
        }
    `;
    
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');
    
    let startTime = performance.now();
    
    function render() {
        const time = (performance.now() - startTime) / 1000;
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, time);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    
    render();
}

function addKineticEffects() {
    // Hero title kinetic effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('span');
        
        // Add staggered animation on load
        lines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(30px)';
            line.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            line.style.transitionDelay = `${i * 0.15 + 0.3}s`;
            
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 50);
        });
    }
    
    // Add kinetic hover to section titles
    document.querySelectorAll('.section-header h2').forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        title.classList.add('kinetic-hover');
        
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.02}s`;
            title.appendChild(span);
        });
    });
    
    // Feature cards kinetic effect
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });
    
    // Animate feature cards with stagger
    document.querySelectorAll('.feature-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        item.style.transitionDelay = `${i * 0.15}s`;
        observer.observe(item);
    });
    
    // Animate testimonials
    document.querySelectorAll('.testimonial').forEach((testimonial, i) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(40px)';
        testimonial.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        testimonial.style.transitionDelay = `${i * 0.15}s`;
        observer.observe(testimonial);
    });
}
