/**
 * Three.js Experience - Interactive Background
 * Crea una escena 3D inmersiva con partículas y efectos visuales
 */

// Configuración
const CONFIG = {
    particleCount: 2000,
    particleSize: 2,
    connectionDistance: 100,
    mouseInfluence: 150,
    colors: {
        primary: 0x00ffff,
        secondary: 0xffd700,
        tertiary: 0xff00ff
    }
};

// Variables globales
let scene, camera, renderer, particles, lines;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isActive = true;

// Inicialización
function init() {
    // Crear escena
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0008);

    // Crear cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    // Crear renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050508, 1);

    // Crear canvas container si no existe
    let canvasContainer = document.getElementById('three-canvas');
    if (!canvasContainer) {
        canvasContainer = document.createElement('div');
        canvasContainer.id = 'three-canvas';
        document.body.insertBefore(canvasContainer, document.body.firstChild);
    }
    canvasContainer.appendChild(renderer.domElement);

    // Crear partículas
    createParticles();

    // Crear líneas de conexión
    createLines();

    // Añadir luces
    addLights();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    window.addEventListener('resize', onWindowResize);

    // Ocultar indicador de scroll después de un tiempo
    setTimeout(() => {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 1000);
        }
    }, 5000);

    // Iniciar animación
    animate();
}

// Crear sistema de partículas
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    const color1 = new THREE.Color(CONFIG.colors.primary);
    const color2 = new THREE.Color(CONFIG.colors.secondary);
    const color3 = new THREE.Color(CONFIG.colors.tertiary);

    for (let i = 0; i < CONFIG.particleCount; i++) {
        // Posiciones aleatorias en un espacio 3D
        positions.push(
            (Math.random() - 0.5) * 4000,
            (Math.random() - 0.5) * 4000,
            (Math.random() - 0.5) * 4000
        );

        // Colores mezclados
        const mixFactor = Math.random();
        let color;
        if (mixFactor < 0.33) {
            color = color1.clone().lerp(color2, Math.random());
        } else if (mixFactor < 0.66) {
            color = color2.clone().lerp(color3, Math.random());
        } else {
            color = color3.clone().lerp(color1, Math.random());
        }
        colors.push(color.r, color.g, color.b);

        // Tamaños variados
        sizes.push(Math.random() * CONFIG.particleSize + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Shader material para partículas más bonitas
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 customColor;
            varying vec3 vColor;
            uniform float time;
            uniform float pixelRatio;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
                
                // Efecto de pulso
                gl_PointSize *= 1.0 + sin(time * 2.0 + position.x * 0.01) * 0.3;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Crear círculo suave
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                
                // Glow effect
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                glow = pow(glow, 2.0);
                
                gl_FragColor = vec4(vColor, alpha * glow);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Crear líneas de conexión entre partículas cercanas
function createLines() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.particleCount * 6); // 2 puntos por línea, 3 coords por punto
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
        color: CONFIG.colors.primary,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);
}

// Añadir luces ambientales
function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(CONFIG.colors.primary, 2, 3000);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(CONFIG.colors.secondary, 2, 3000);
    pointLight2.position.set(-500, -500, 500);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(CONFIG.colors.tertiary, 2, 3000);
    pointLight3.position.set(0, 0, -500);
    scene.add(pointLight3);
}

// Event handlers
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

function onDocumentTouchStart(event) {
    if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX) * 0.5;
        mouseY = (event.touches[0].clientY - windowHalfY) * 0.5;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX) * 0.5;
        mouseY = (event.touches[0].clientY - windowHalfY) * 0.5;
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Actualizar líneas de conexión
function updateLines() {
    const positions = particles.geometry.attributes.position.array;
    const linePositions = lines.geometry.attributes.position.array;
    let lineIndex = 0;
    
    const maxConnections = 3;
    const connectionDistance = CONFIG.connectionDistance;
    
    for (let i = 0; i < Math.min(CONFIG.particleCount, 300); i++) {
        let connections = 0;
        
        for (let j = i + 1; j < Math.min(CONFIG.particleCount, 300); j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < connectionDistance && connections < maxConnections) {
                linePositions[lineIndex++] = positions[i * 3];
                linePositions[lineIndex++] = positions[i * 3 + 1];
                linePositions[lineIndex++] = positions[i * 3 + 2];
                linePositions[lineIndex++] = positions[j * 3];
                linePositions[lineIndex++] = positions[j * 3 + 1];
                linePositions[lineIndex++] = positions[j * 3 + 2];
                connections++;
            }
        }
    }
    
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.setDrawRange(0, lineIndex / 3);
}

// Animación principal
function animate() {
    if (!isActive) return;

    requestAnimationFrame(animate);

    const time = Date.now() * 0.0005;

    // Actualizar uniformes del shader
    if (particles.material.uniforms) {
        particles.material.uniforms.time.value = time;
    }

    // Suavizado del movimiento del mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotar cámara basada en mouse
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animar partículas
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3;
        
        // Movimiento ondulante
        positions[i3 + 1] += Math.sin(time + positions[i3] * 0.001) * 0.5;
        
        // Rotación suave
        const x = positions[i3];
        const z = positions[i3 + 2];
        const rotSpeed = 0.0002;
        positions[i3] = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
        positions[i3 + 2] = x * Math.sin(rotSpeed) + z * Math.cos(rotSpeed);
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.05;

    // Actualizar líneas cada 2 frames para rendimiento
    if (Math.floor(time * 60) % 2 === 0) {
        updateLines();
    }

    renderer.render(scene, camera);
}

// Cleanup cuando se cambia de tema
function cleanup() {
    isActive = false;
    if (renderer) {
        renderer.dispose();
    }
    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
    }
    if (lines) {
        lines.geometry.dispose();
        lines.material.dispose();
    }
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
        canvas.remove();
    }
}

// Detectar cuando se cambia a otro tema
window.addEventListener('themeChange', (e) => {
    if (e.detail.theme !== 'threejs') {
        cleanup();
    }
});

// Iniciar
init();
