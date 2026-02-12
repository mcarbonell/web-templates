/**
 * El Viaje de la Semilla - Scrollytelling 3D
 * Main JavaScript - Three.js + GSAP ScrollTrigger
 */

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    cameraSmoothness: 0.05,
    cameraOffset: { x: 2, y: 4, z: 10 }, // Offset de cámara respecto a la semilla
    models: {
        seed: 'assets/models/seed.glb',
        treeAutumn: 'assets/models/tree-autumn.glb',
        hedgehog: 'assets/models/hedgehog.glb',
        bird: 'assets/models/bird.glb',
        fish: 'assets/models/fish.glb',
        treeSapling: 'assets/models/tree-sapling.glb',
        rabbit: 'assets/models/rabbit.glb'
    }
};

// ============================================
// VARIABLES GLOBALES
// ============================================
let scene, camera, renderer;
let loadedModels = {};
let particles = [];
let currentScene = 0;
let scrollProgress = 0;
let animationId;

// Objetos de escena
let seedMesh, treeMesh, hedgehogMesh, birdMesh, fishMesh, saplingMesh, rabbitMesh;
let lights = {};

// ============================================
// INICIALIZACIÓN
// ============================================
function init() {
    // Configurar Three.js
    setupThreeJS();
    
    // Configurar luces
    setupLights();
    
    // Cargar modelos
    loadAllModels().then(() => {
        // Pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
            // Configurar escenas (esto también configura las animaciones)
            setupScenes();
            
            // Iniciar loop
            animate();
            
            // Mostrar primera escena
            updateNavigationDots(0);
            
            // Ocultar instrucciones después de un rato
            setTimeout(() => {
                const instructions = document.getElementById('instructions');
                if (instructions) {
                    instructions.style.opacity = '0';
                }
            }, 5000);
        }, 100);
    });
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartStory);
    }
    
    setupNavigationDots();
}

// ============================================
// THREE.JS SETUP
// ============================================
function setupThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    
    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    
    // Cámara
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(2, 4, 10);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
}

// ============================================
// LUCES
// ============================================
function setupLights() {
    // Luz ambiental base
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(lights.ambient);
    
    // Luz direccional principal (sol)
    lights.sun = new THREE.DirectionalLight(0xffd700, 1.5);
    lights.sun.position.set(10, 20, 10);
    lights.sun.castShadow = true;
    lights.sun.shadow.mapSize.width = 2048;
    lights.sun.shadow.mapSize.height = 2048;
    scene.add(lights.sun);
    
    // Luz de relleno
    lights.fill = new THREE.DirectionalLight(0x87ceeb, 0.5);
    lights.fill.position.set(-10, 10, -10);
    scene.add(lights.fill);
}

// ============================================
// CARGA DE MODELOS
// ============================================
function loadAllModels() {
    return new Promise((resolve) => {
        const loader = new THREE.GLTFLoader();
        const modelNames = Object.keys(CONFIG.models);
        let loadedCount = 0;
        
        modelNames.forEach(name => {
            const path = CONFIG.models[name];
            
            loader.load(
                path,
                (gltf) => {
                    loadedModels[name] = gltf.scene;
                    loadedCount++;
                    
                    // Escalar y preparar modelo
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    if (loadedCount === modelNames.length) {
                        resolve();
                    }
                },
                undefined,
                (error) => {
                    console.warn(`Error cargando ${name}:`, error);
                    // Crear geometría de fallback
                    loadedModels[name] = createFallbackGeometry(name);
                    loadedCount++;
                    
                    if (loadedCount === modelNames.length) {
                        resolve();
                    }
                }
            );
        });
    });
}

// Geometrías de fallback si los modelos fallan
function createFallbackGeometry(type) {
    const group = new THREE.Group();
    let geometry, material, mesh;
    
    switch(type) {
        case 'seed':
            geometry = new THREE.SphereGeometry(0.3, 8, 8);
            material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
            mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(1, 1.3, 1);
            break;
            
        case 'treeAutumn':
        case 'treeSapling':
            // Tronco
            const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeom, trunkMat);
            trunk.position.y = 1;
            group.add(trunk);
            
            // Copa
            const leavesGeom = new THREE.ConeGeometry(2, 4, 8);
            const leavesColor = type === 'treeAutumn' ? 0xff6b35 : 0x4a7c59;
            const leavesMat = new THREE.MeshStandardMaterial({ color: leavesColor });
            const leaves = new THREE.Mesh(leavesGeom, leavesMat);
            leaves.position.y = 3;
            group.add(leaves);
            break;
            
        case 'hedgehog':
            geometry = new THREE.SphereGeometry(0.5, 8, 8);
            material = new THREE.MeshStandardMaterial({ color: 0x8B7355 });
            mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(1.5, 1, 1);
            break;
            
        case 'bird':
            geometry = new THREE.SphereGeometry(0.3, 8, 8);
            material = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
            mesh = new THREE.Mesh(geometry, material);
            break;
            
        case 'fish':
            geometry = new THREE.ConeGeometry(0.3, 1, 8);
            material = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.z = Math.PI / 2;
            break;
            
        case 'rabbit':
            geometry = new THREE.SphereGeometry(0.4, 8, 8);
            material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            mesh = new THREE.Mesh(geometry, material);
            break;
            
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshStandardMaterial({ color: 0x808080 });
            mesh = new THREE.Mesh(geometry, material);
    }
    
    if (mesh) group.add(mesh);
    return group;
}

// ============================================
// CONFIGURACIÓN DE ESCENAS
// ============================================
function setupScenes() {
    // Crear instancias de modelos
    seedMesh = loadedModels.seed.clone();
    treeMesh = loadedModels.treeAutumn.clone();
    hedgehogMesh = loadedModels.hedgehog.clone();
    birdMesh = loadedModels.bird.clone();
    fishMesh = loadedModels.fish.clone();
    saplingMesh = loadedModels.treeSapling.clone();
    rabbitMesh = loadedModels.rabbit.clone();
    
    // Escalar modelos
    seedMesh.scale.set(0.5, 0.5, 0.5);
    treeMesh.scale.set(3, 3, 3);
    hedgehogMesh.scale.set(0.8, 0.8, 0.8);
    birdMesh.scale.set(0.6, 0.6, 0.6);
    fishMesh.scale.set(0.5, 0.5, 0.5);
    saplingMesh.scale.set(1, 1, 1);
    rabbitMesh.scale.set(0.7, 0.7, 0.7);
    
    // Posiciones iniciales - ESCENA 1: Otoño (visibles desde inicio)
    seedMesh.position.set(0, 12, -5);  // Arriba en el árbol
    treeMesh.position.set(0, -2, -8);  // Visible en el centro
    hedgehogMesh.position.set(10, -2, 0);  // Fuera de pantalla
    birdMesh.position.set(-15, 10, 5);  // Fuera de pantalla
    fishMesh.position.set(0, -10, 0);  // Fuera de pantalla
    saplingMesh.position.set(0, -10, 0);  // Fuera de pantalla
    saplingMesh.scale.set(0, 0, 0);  // Oculto
    rabbitMesh.position.set(-10, -2, 2);  // Fuera de pantalla
    
    // Asegurar colores correctos en materiales
    treeMesh.traverse((child) => {
        if (child.isMesh && child.material) {
            if (!child.material.map) {
                child.material.color.setHex(0xD2691E);
            }
        }
    });
    
    // Añadir a escena
    scene.add(seedMesh);
    scene.add(treeMesh);
    scene.add(hedgehogMesh);
    scene.add(birdMesh);
    scene.add(fishMesh);
    scene.add(saplingMesh);
    scene.add(rabbitMesh);
    
    // Suelo base
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Crear sistemas de partículas
    createParticleSystems();
    
    // Configurar animaciones de scroll
    setupScrollAnimations();
}

// ============================================
// SISTEMA DE PARTÍCULAS
// ============================================
function createParticleSystems() {
    // Partículas de hojas (Otoño)
    const leafGeometry = new THREE.BufferGeometry();
    const leafCount = 200;
    const leafPositions = new Float32Array(leafCount * 3);
    
    for (let i = 0; i < leafCount * 3; i += 3) {
        leafPositions[i] = (Math.random() - 0.5) * 20;
        leafPositions[i + 1] = Math.random() * 15;
        leafPositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    leafGeometry.setAttribute('position', new THREE.BufferAttribute(leafPositions, 3));
    
    const leafMaterial = new THREE.PointsMaterial({
        color: 0xff6b35,
        size: 0.3,
        transparent: true,
        opacity: 0
    });
    
    particles.leaves = new THREE.Points(leafGeometry, leafMaterial);
    scene.add(particles.leaves);
    
    // Partículas de nieve (Invierno)
    const snowGeometry = new THREE.BufferGeometry();
    const snowCount = 500;
    const snowPositions = new Float32Array(snowCount * 3);
    
    for (let i = 0; i < snowCount * 3; i += 3) {
        snowPositions[i] = (Math.random() - 0.5) * 30;
        snowPositions[i + 1] = Math.random() * 20;
        snowPositions[i + 2] = (Math.random() - 0.5) * 30;
    }
    
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    
    const snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: 0
    });
    
    particles.snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(particles.snow);
    
    // Partículas de polen (Primavera)
    const pollenGeometry = new THREE.BufferGeometry();
    const pollenCount = 300;
    const pollenPositions = new Float32Array(pollenCount * 3);
    
    for (let i = 0; i < pollenCount * 3; i += 3) {
        pollenPositions[i] = (Math.random() - 0.5) * 25;
        pollenPositions[i + 1] = Math.random() * 12;
        pollenPositions[i + 2] = (Math.random() - 0.5) * 25;
    }
    
    pollenGeometry.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3));
    
    const pollenMaterial = new THREE.PointsMaterial({
        color: 0xffeaa7,
        size: 0.2,
        transparent: true,
        opacity: 0
    });
    
    particles.pollen = new THREE.Points(pollenGeometry, pollenMaterial);
    scene.add(particles.pollen);
}

// ============================================
// SCROLL ANIMATIONS - GSAP + ScrollTrigger
// ============================================
function setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Timeline principal
    const mainTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                scrollProgress = self.progress;
                updateProgressBar(self.progress);
                updateSceneFromScroll(self.progress);
            }
        }
    });
    
    // ========================================
    // ESCENA 1: OTOÑO (0% - 20%)
    // ========================================
    
    // Árbol: Visible desde el inicio
    mainTimeline.to(treeMesh.position, 
        { y: -2, z: -8, duration: 0.05 },
        0
    );
    
    // Semilla: Cae desde el árbol
    mainTimeline.to(seedMesh.position, {
        x: 2, y: -1.5, z: 3, duration: 0.12, ease: "bounce.out"
    }, 0.03);
    
    // Partículas de hojas: Aparecen suavemente
    mainTimeline.to(particles.leaves.material, {
        opacity: 0.7,
        duration: 0.15
    }, 0.02);
    
    // Cambio de color de fondo (Otoño)
    const autumnColor = { r: 1, g: 0.42, b: 0.21 };
    mainTimeline.to(autumnColor, {
        r: 1, g: 0.42, b: 0.21,
        duration: 0.2,
        onUpdate: () => {
            scene.fog.color.setRGB(autumnColor.r, autumnColor.g, autumnColor.b);
            scene.background.setRGB(autumnColor.r, autumnColor.g, autumnColor.b);
        }
    }, 0);
    
    // ========================================
    // ESCENA 2: INVIERNO (20% - 40%)
    // ========================================
    
    // Semilla: Se desliza por el suelo nevado
    mainTimeline.to(seedMesh.position, {
        x: 4, y: -1.5, z: 4, duration: 0.2, ease: "power1.inOut"
    }, 0.2);
    
    // Erizo: Aparece
    mainTimeline.to(hedgehogMesh.position, {
        x: 2, y: -1.5, z: 2, duration: 0.15, ease: "power2.out"
    }, 0.22);
    
    // Conejo: Aparece de fondo
    mainTimeline.to(rabbitMesh.position, {
        x: -3, y: -1.5, z: 6, duration: 0.2, ease: "power2.out"
    }, 0.21);
    
    // Árbol: Se aleja
    mainTimeline.to(treeMesh.position, {
        z: -20,
        duration: 0.15
    }, 0.2);
    
    // Hojas: Desaparecen
    mainTimeline.to(particles.leaves.material, {
        opacity: 0,
        duration: 0.1
    }, 0.2);
    
    // Nieve: Aparece
    mainTimeline.to(particles.snow.material, {
        opacity: 0.8,
        duration: 0.1
    }, 0.22);
    
    // Cambio de color (Invierno)
    const winterColor = { r: 0.8, g: 0.85, b: 0.9 };
    mainTimeline.to(winterColor, {
        r: 0.8, g: 0.85, b: 0.9,
        duration: 0.2,
        onUpdate: () => {
            scene.fog.color.setRGB(winterColor.r, winterColor.g, winterColor.b);
            scene.background.setRGB(winterColor.r, winterColor.g, winterColor.b);
        }
    }, 0.2);
    
    // Luz: Más fría
    const winterLight = { r: 0.8, g: 0.9, b: 1 };
    mainTimeline.to(winterLight, {
        r: 0.8, g: 0.9, b: 1,
        duration: 0.2,
        onUpdate: () => {
            lights.sun.color.setRGB(winterLight.r, winterLight.g, winterLight.b);
        }
    }, 0.2);
    
    // ========================================
    // ESCENA 3: PRIMAVERA (40% - 60%)
    // ========================================
    
    // Semilla: Se eleva un poco (despertar)
    mainTimeline.to(seedMesh.position, {
        x: 3, y: 0, z: 3,
        duration: 0.2,
        ease: "power1.inOut"
    }, 0.4);
    
    // Semilla: Pulsa (escala)
    mainTimeline.to(seedMesh.scale, {
        x: 0.7, y: 0.7, z: 0.7,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    }, 0.45);
    
    // Erizo: Se aleja
    mainTimeline.to(hedgehogMesh.position, {
        x: 12, z: 5,
        duration: 0.15
    }, 0.4);
    
    // Conejo: Salta
    mainTimeline.to(rabbitMesh.position, {
        y: 0.5,
        duration: 0.1,
        yoyo: true,
        repeat: 3
    }, 0.42);
    
    // Pájaro: Vuela hacia la semilla
    mainTimeline.to(birdMesh.position, {
        x: 4, y: 2, z: 4, duration: 0.15, ease: "power2.inOut"
    }, 0.45);
    
    // Nieve: Desaparece
    mainTimeline.to(particles.snow.material, {
        opacity: 0,
        duration: 0.1
    }, 0.4);
    
    // Polen: Aparece
    mainTimeline.to(particles.pollen.material, {
        opacity: 0.6,
        duration: 0.1
    }, 0.45);
    
    // Cambio de color (Primavera)
    const springColor = { r: 0.4, g: 0.8, b: 0.6 };
    mainTimeline.to(springColor, {
        r: 0.4, g: 0.8, b: 0.6,
        duration: 0.2,
        onUpdate: () => {
            scene.fog.color.setRGB(springColor.r, springColor.g, springColor.b);
            scene.background.setRGB(springColor.r, springColor.g, springColor.b);
        }
    }, 0.4);
    
    const springLight = { r: 1, g: 0.95, b: 0.7 };
    mainTimeline.to(springLight, {
        r: 1, g: 0.95, b: 0.7,
        duration: 0.2,
        onUpdate: () => {
            lights.sun.color.setRGB(springLight.r, springLight.g, springLight.b);
        }
    }, 0.4);
    
    // ========================================
    // ESCENA 4: VERANO (60% - 80%)
    // ========================================
    
    // Pájaro: Se eleva con la semilla
    mainTimeline.to(birdMesh.position, {
        x: 3, y: 6, z: 3,
        duration: 0.1,
        ease: "power1.inOut"
    }, 0.6);
    
    // Semilla: En el pico del pájaro
    mainTimeline.to(seedMesh.position, {
        x: 3.5, y: 5.5, z: 3.5,
        duration: 0.1
    }, 0.6);
    
    // Pájaro: Vuela lejos
    mainTimeline.to(birdMesh.position, {
        x: 15, y: 10, z: -10,
        duration: 0.1
    }, 0.68);
    
    // Semilla: Cae al río
    mainTimeline.to(seedMesh.position, {
        x: 6, y: -2, z: 2,
        duration: 0.1,
        ease: "power2.in"
    }, 0.68);
    
    // Peces: Saltan alrededor
    mainTimeline.to(fishMesh.position, {
        x: 5, y: -1.5, z: 3, duration: 0.08, ease: "power2.out"
    }, 0.72);
    
    mainTimeline.to(fishMesh.position, {
        x: 7, y: -1.5, z: 1, duration: 0.04
    }, 0.76);
    
    mainTimeline.to(fishMesh.position, {
        x: 4, y: -1.5, z: 4, duration: 0.04
    }, 0.78);
    
    // Polen: Desaparece
    mainTimeline.to(particles.pollen.material, {
        opacity: 0,
        duration: 0.1
    }, 0.6);
    
    // Cambio de color (Verano)
    const summerColor = { r: 0.3, g: 0.6, b: 0.9 };
    mainTimeline.to(summerColor, {
        r: 0.3, g: 0.6, b: 0.9,
        duration: 0.2,
        onUpdate: () => {
            scene.fog.color.setRGB(summerColor.r, summerColor.g, summerColor.b);
            scene.background.setRGB(summerColor.r, summerColor.g, summerColor.b);
        }
    }, 0.6);
    
    const summerLight = { r: 1, g: 1, b: 0.9 };
    mainTimeline.to(summerLight, {
        r: 1, g: 1, b: 0.9,
        duration: 0.2,
        onUpdate: () => {
            lights.sun.color.setRGB(summerLight.r, summerLight.g, summerLight.b);
        }
    }, 0.6);
    
    // ========================================
    // ESCENA 5: CRECIMIENTO (80% - 100%)
    // ========================================
    
    // Semilla: Se sumerge en tierra
    mainTimeline.to(seedMesh.position, {
        x: 0, y: -3, z: 0,
        duration: 0.05
    }, 0.8);
    
    // Semilla: Desaparece
    mainTimeline.to(seedMesh.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.05
    }, 0.82);
    
    // Arbol joven: Aparece y crece
    mainTimeline.to(saplingMesh.position, {
        x: 0, y: -2, z: 0, duration: 0.01
    }, 0.82);
    
    mainTimeline.to(saplingMesh.scale, {
        x: 0.5, y: 0.5, z: 0.5, duration: 0.1, ease: "back.out"
    }, 0.83);
    
    mainTimeline.to(saplingMesh.scale, {
        x: 3, y: 3, z: 3,
        duration: 0.15,
        ease: "power2.out"
    }, 0.88);
    
    // Peces: Se alejan
    mainTimeline.to(fishMesh.position, {
        y: -10,
        duration: 0.1
    }, 0.8);
    
    // Cambio de color final
    const finalColor = { r: 0.2, g: 0.7, b: 0.4 };
    mainTimeline.to(finalColor, {
        r: 0.2, g: 0.7, b: 0.4,
        duration: 0.2,
        onUpdate: () => {
            scene.fog.color.setRGB(finalColor.r, finalColor.g, finalColor.b);
            scene.background.setRGB(finalColor.r, finalColor.g, finalColor.b);
        }
    }, 0.8);
    
    // Setup text overlays
    setupTextAnimations();
    
    // Refrescar ScrollTrigger
    ScrollTrigger.refresh();
}

// ============================================
// ANIMACIONES DE TEXTO
// ============================================
function setupTextAnimations() {
    const sections = document.querySelectorAll('.story-section');
    const overlays = document.querySelectorAll('.text-overlay');
    
    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => {
                overlays[index].classList.add('visible');
                updateNavigationDots(index);
            },
            onLeave: () => {
                overlays[index].classList.remove('visible');
            },
            onEnterBack: () => {
                overlays[index].classList.add('visible');
                updateNavigationDots(index);
            },
            onLeaveBack: () => {
                overlays[index].classList.remove('visible');
            }
        });
    });
}

// ============================================
// ACTUALIZACIONES EN TIEMPO REAL
// ============================================
function updateProgressBar(progress) {
    const fill = document.getElementById('progress-fill');
    if (fill) {
        fill.style.width = `${progress * 100}%`;
    }
}

function updateSceneFromScroll(progress) {
    const sceneIndex = Math.min(4, Math.floor(progress * 5));
    
    if (sceneIndex !== currentScene) {
        currentScene = sceneIndex;
        updateNavigationDots(sceneIndex);
    }
    
    animateParticles(progress);
}

function animateParticles(progress) {
    const time = Date.now() * 0.001;
    
    if (particles.leaves && particles.leaves.material.opacity > 0.1) {
        const positions = particles.leaves.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.03;
            positions[i - 1] += Math.sin(time + i * 0.1) * 0.01;
            if (positions[i] < -2) {
                positions[i] = 15;
                positions[i - 1] = (Math.random() - 0.5) * 20;
                positions[i + 1] = (Math.random() - 0.5) * 20;
            }
        }
        particles.leaves.geometry.attributes.position.needsUpdate = true;
    }
    
    if (particles.snow && particles.snow.material.opacity > 0.1) {
        const positions = particles.snow.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.06;
            positions[i - 1] += Math.sin(time * 0.5 + i * 0.05) * 0.02;
            if (positions[i] < -2) {
                positions[i] = 20;
                positions[i - 1] = (Math.random() - 0.5) * 30;
                positions[i + 1] = (Math.random() - 0.5) * 30;
            }
        }
        particles.snow.geometry.attributes.position.needsUpdate = true;
    }
    
    if (particles.pollen && particles.pollen.material.opacity > 0.1) {
        const positions = particles.pollen.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.015;
            positions[i] += Math.cos(time + positions[i + 1] * 0.1) * 0.008;
            if (positions[i + 1] > 15) positions[i + 1] = 0;
            if (positions[i + 1] < 0) positions[i + 1] = 15;
        }
        particles.pollen.geometry.attributes.position.needsUpdate = true;
    }
}

// ============================================
// NAVEGACIÓN
// ============================================
function setupNavigationDots() {
    const dots = document.querySelectorAll('.nav-dot');
    const container = document.getElementById('scroll-container');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetProgress = index / 5;
            const targetScroll = targetProgress * (container.scrollHeight - window.innerHeight);
            
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });
}

function updateNavigationDots(sceneIndex) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === sceneIndex);
    });
}

function restartStory() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    const overlays = document.querySelectorAll('.text-overlay');
    overlays.forEach(overlay => overlay.classList.remove('visible'));
    
    updateNavigationDots(0);
}

// ============================================
// UTILIDADES
// ============================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (seedMesh && scrollProgress < 0.82) {
        seedMesh.rotation.y += 0.005;
        seedMesh.rotation.x = Math.sin(time) * 0.1;
    }
    
    if (birdMesh && scrollProgress > 0.4 && scrollProgress < 0.75) {
        birdMesh.position.y += Math.sin(time * 3) * 0.015;
        birdMesh.rotation.z = Math.sin(time * 2) * 0.15;
        birdMesh.rotation.y += 0.01;
    }
    
    if (fishMesh && scrollProgress > 0.65 && scrollProgress < 0.85) {
        fishMesh.rotation.y += 0.03;
        fishMesh.position.y += Math.sin(time * 5) * 0.005;
    }
    
    // Cámara sigue a la semilla suavemente
    if (seedMesh && scrollProgress < 0.8) {
        const targetX = seedMesh.position.x + CONFIG.cameraOffset.x;
        const targetY = seedMesh.position.y + CONFIG.cameraOffset.y;
        const targetZ = seedMesh.position.z + CONFIG.cameraOffset.z;
        
        camera.position.x += (targetX - camera.position.x) * CONFIG.cameraSmoothness;
        camera.position.y += (targetY - camera.position.y) * CONFIG.cameraSmoothness;
        camera.position.z += (targetZ - camera.position.z) * CONFIG.cameraSmoothness;
        
        camera.lookAt(seedMesh.position);
    } else if (saplingMesh && scrollProgress >= 0.8) {
        camera.lookAt(saplingMesh.position);
    }
    
    renderer.render(scene, camera);
}

// ============================================
// INICIAR
// ============================================
document.addEventListener('DOMContentLoaded', init);
