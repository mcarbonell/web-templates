# Scrollytelling 3D con Three.js + GSAP

## Resumen de la Técnica

Esta técnica permite contar historias narrativas en 3D controladas por el scroll del usuario. La cámara y los objetos se mueven sincronizadamente con el progreso del scroll.

## Stack Tecnológico

- **Three.js** (r128+) - Renderizado 3D
- **GSAP + ScrollTrigger** - Animaciones controladas por scroll
- **GLTFLoader** - Carga de modelos 3D (.glb/.gltf)

## Estructura del Proyecto

```
story-seed-journey/
├── index.html              # Contenedor de secciones + canvas 3D
├── css/
│   └── styles.css          # Overlays de texto, navegación, progreso
├── js/
│   └── main.js             # Lógica Three.js + GSAP
└── assets/models/          # Modelos 3D (.glb)
```

## Patrones Clave

### 1. Canvas 3D Fijo

```css
#canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
}
```

### 2. Secciones de Scroll Largas

```css
.story-section {
    min-height: 300vh;  /* Cada escena = 20% del scroll total */
    width: 100%;
}
```

### 3. Timeline GSAP con ScrollTrigger

```javascript
const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            scrollProgress = self.progress;
            updateProgressBar(self.progress);
        }
    }
});
```

### 4. Cámara que Sigue al Protagonista

```javascript
const targetX = protagonist.position.x + cameraOffset.x;
const targetY = protagonist.position.y + cameraOffset.y;
const targetZ = protagonist.position.z + cameraOffset.z;

camera.position.x += (targetX - camera.position.x) * smoothness;
camera.position.y += (targetY - camera.position.y) * smoothness;
camera.position.z += (targetZ - camera.position.z) * smoothness;

camera.lookAt(protagonist.position);
```

### 5. Cambios de Color Suaves

```javascript
const targetColor = { r: 0.8, g: 0.85, b: 0.9 };
mainTimeline.to(targetColor, {
    duration: 0.2,
    onUpdate: () => {
        scene.fog.color.setRGB(targetColor.r, targetColor.g, targetColor.b);
        scene.background.setRGB(targetColor.r, targetColor.g, targetColor.b);
    }
});
```

## Recursos de Modelos 3D

- **Kenney.nl** - CC0, calidad excelente
- **Sketchfab** - Filtrar por CC0/CC-BY
- **Poly Pizza** - Optimizados para web
- **Quaternius** - CC0

## Problemas Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| GSAP "target null" | Animar objetos Three.js directamente | Usar objetos intermedios con onUpdate |
| WebGL uniform3fv | Animar scene.background como RGB | Crear objeto {r,g,b} intermediario |
| Cámara se sale | GSAP + loop de animación | Controlar cámara SOLO desde el loop |
| Scroll no sincronizado | Alturas incorrectas | 300vh+ por sección, trigger "top 60%" |

## Referencias

- Técnica vista en sitios Awwwards
- Perfecta para storytelling inmersivo
- Funciona en mobile con optimizaciones
