# 🏴‍☠️ EL ÚLTIMO PIRATA - Documento de Planificación
## Scrollytelling 3D con Escenas Independientes

---

## 📋 RESUMEN DEL PROYECTO

**Título:** El Último Pirata  
**Formato:** Scrollytelling 3D (scroll-triggered storytelling)  
**Tecnología:** Three.js v0.160.0 + GSAP ScrollTrigger  
**Estilo:** Luminoso, épico, con toques de humor  
**Estructura:** 5 escenas completamente independientes con transiciones suaves

**Estado Actual:** 🚧 En desarrollo - Pulido de Escena 1 en progreso
- ✅ Arquitectura base implementada
- ✅ Escena 1 (La Tormenta) **100% COMPLETA** - Pulida y funcional
  - Capitán posicionado correctamente en cubierta (DECK_LEVEL = 1.2)
  - Barriles en cubierta (mismo nivel que capitán)
  - Capitán e hijos del barco (barriles) con balanceo sincronizado
  - Cámara con lookAt dinámico al capitán
  - Iluminación de tormenta con relámpagos intermitentes
- ✅ Escenas 2-5 construidas visualmente (~90%)
- ✅ Transiciones entre escenas funcionando
- ✅ Sistema de texto fijo implementado
- ✅ **Issue crítico resuelto:** Capitán visible y animado
- 🎯 **Próximo:** Activar personajes en escenas 2-5, añadir efectos, pulir transiciones

---

## 🎬 ESCENA 1: "LA TORMENTA"

### **Ambientación Narrativa**
El Capitán Barbarossa navega solo en medio de una tormenta nocturna. Las olas son gigantes, el viento aulla, y los relámpagos iluminan el cielo. Es un momento de desesperación, pero también de determinación. Encontrará un mapa que cambiará su destino.

### **Elementos Visuales**

#### **Skybox/Background:**
- Color base: `#1a1a2e` (azul noche profundo)
- Con transición a: `#2d3561` (azul tormenta)
- Fog: Denso, oscuro, para ocultar el horizonte

#### **Modelos 3D Necesarios:**

**Personajes:**
- `Characters_Captain_Barbarossa` (en cubierta, agarrándose)
  - Animación: Idle (con balanceo por el barco)
  - **Posición:** (0, DECK_LEVEL, -2) donde DECK_LEVEL = 1.2
  - **Nota:** El capitán es hijo del barco (shipInStorm.add), no de la escena
  - Balanceo: Sincronizado con el barco (misma rotación X/Z)
  - Escala: 1.0

**Props/Environment:**
- `Ship_Large` (barco principal)
  - Posición: (0, 0, 0)
  - Escala: 1.2
  - Rotación: Inclinación dinámica por las olas (ondas senoidales)
  
- `Prop_Barrel` x3 (en cubierta, rodando)
  - **Posiciones:** (-2, DECK_LEVEL, -3), (2.5, DECK_LEVEL, -4), (-1, DECK_LEVEL, -5)
  - **Nota:** Los barriles también son hijos del barco
  - Rotaciones: Dinámicas (rodando con el balanceo)
  - Escalas: 1.0 cada uno

**Agua:**
- Plano grande con animación de olas ALTAS
- Material: Azul oscuro `#001f3f`, metalizado
- Olas: Amplitud 2x, frecuencia rápida

**Efectos de Partículas:**
- **Lluvia:** 1000 gotas cayendo en ángulo (viento)
- **Spray del mar:** Partículas blancas en la proa
- **Relámpagos:** Flash de luz direccional intermitente

#### **Iluminación:**
- **Luz ambiental:** `#1a1a2e` (0.3 intensidad) - muy oscura
- **Luz de luna:** `#a8d8ea` (0.4 intensidad) - tenue, azulada
- **Relámpagos:** Flash intermitente de `lightningLight`
  - Probabilidad: 2% por frame
  - Intensidad: 2.0-4.0
  - Duración: 100-250ms
  - Efecto: Ilumina bruscamente toda la escena, luego oscuridad

#### **Cámara:**
- Posición dinámica: Se mueve según el scroll
- **LookAt:** Siempre apuntando al capitán (posición mundial actualizada cada frame)
- Efecto: Aunque la cámara se desplace, el capitán siempre está centrado
- Código: `camera.lookAt(captain.getWorldPosition())`

### **Timing y Scroll**

**0-5%:**
- Vista amplia del barco en la tormenta
- Barco meciéndose
- Texto aparece: "El Último Pirata"

**5-10%:**
- Zoom hacia la cubierta
- Se ven barriles rodando
- Diálogo Barbarossa: "Maldita sea..."

**10-15%:**
- Primer plano de Barbarossa
- Relámpago ilumina su rostro
- Diálogo: "¿Dónde encontraré tripulación?"

**15-20%:**
- Flash de luz revela el mapa en sus manos
- Zoom al mapa
- Transición: Fade a negro, luego fade in Escena 2

### **Transición a Escena 2**
- **Tipo:** Fade to black (0.5s)
- **Cleanup:** Ocultar grupo de escena 1
- **Preparación:** Cargar grupo de escena 2
- **Fade in:** Desde negro a amanecer dorado

---

## 🌅 ESCENA 2: "EL PUERTO DORADO"

### **Ambientación Narrativa**
El amanecer ilumina el Puerto de Tortuga. Es un lugar bullicioso lleno de vida: barcos entrando y saliendo, piratas por todas partes, y el aroma de especias y ron en el aire. Aquí Barbarossa reclutará a su improbable tripulación.

### **Elementos Visuales**

#### **Skybox/Background:**
- Color: Gradiente de `#ff6b35` (naranja) a `#87CEEB` (azul cielo)
- Fog: Ligero, dorado, distancia media

#### **Modelos 3D Necesarios:**

**Personajes:**
- `Characters_Captain_Barbarossa`
  - Posición: (5, 0, 5)
  - Animación: Walk → Idle
  
- `Characters_Anne` (navegadora)
  - Posición: (8, 0, 8)
  - Animación: Idle → Wave
  
- `Characters_Henry` (artillero)
  - Posición: (10, 0, 4)
  - Animación: Idle
  
- `Characters_Skeleton` (cómico)
  - Posición inicial: Fuera de cámara
  - Entrada: Salta desde detrás de un barril
  - Animación: Jump → Sword → Idle

**Environment:**
- `Environment_Dock` x3 (muelle largo)
  - Posiciones: (-5, 0, 0), (0, 0, 0), (5, 0, 0)
  
- `Environment_Dock_Pole` x6 (postes)
  - Distribuidos a lo largo del muelle
  
- `Environment_House1` x2 (casas de fondo)
  - Posiciones: (-15, 0, -10), (20, 0, -8)
  
- `Environment_House2` x1
  - Posición: (25, 0, -5)
  
- `Ship_Small` x2 (barcos pequeños amarrados)
  - Posiciones: (-8, -0.2, 3), (12, -0.2, 2)

**Props:**
- `Prop_Barrel` x8 (apilados y dispersos)
- `Prop_Chest_Closed` x2
- `Prop_Bucket` x4
- `Prop_Bottle_1` y `_2` (dispersos, caídos)
- `Weapon_Cutlass` (clavado en un barril)

**Extras (Nature Kit):**
- `tree_palm` x5 (en el fondo, detrás de las casas)

#### **Iluminación:**
- **Sol naciente:** `#ffd700` (1.5 intensidad)
  - Posición: (-20, 10, -20) (bajo en el horizonte)
  - Color cálido dorado
- **Luz de relleno:** `#87CEEB` (0.4 intensidad)
- **Luz ambiental:** `#fff5e6` (0.6 intensidad)

#### **Efectos:**
- **Polen dorado:** Partículas amarillas flotando (luz del amanecer)
- **Bruma matutina:** Fog bajo en el suelo
- **Gaviotas:** Siluetas pasando (sprites simples)

#### **Cámara:**
- Posición inicial: (20, 5, 15)
- Recorrido lateral del muelle
- Paneo mostrando a cada personaje
- Transición final: Elevación suave

### **Timing y Scroll**

**20-25%:**
- Fade in desde negro
- Vista panorámica del puerto amaneciendo
- Texto: "El Puerto de Tortuga"

**25-30%:**
- Barbarossa camina por el muelle
- Encuentra a Anne
- Diálogo Anne: "¿Necesitas navegadora?"

**30-35%:**
- Paneo a Henry con un cañón
- Diálogo Henry: "Yo manejo los cañones"

**35-40%:**
- Skeleton aparece saltando
- Todos se giran sorprendidos
- Diálogo Skeleton: "¡Yo solo quiero ser pirata!"
- Transición: Wipe diagonal hacia arriba

---

## 🌴 ESCENA 3: "LA JUNGLA MALDITA"

### **Ambientación Narrativa**
El interior de la isla es denso, oscuro y misterioso. Árboles gigantes forman un dosel que bloquea el sol. El aire está cargado de humedad y el sonido de criaturas desconocidas. Huesos de antiguos aventureros yacen en el suelo como advertencia.

### **Elementos Visuales**

#### **Skybox/Background:**
- Color: `#0f291e` (verde oscuro profundo)
- Fog: Denso, verdoso, visibilidad 15-20 unidades

#### **Modelos 3D Necesarios:**

**Personajes:**
- Todos caminando en formación
- Animaciones: Walk (todos)
- Posiciones escalonadas:
  - Barbarossa: (0, 0, 0)
  - Anne: (-2, 0, 2)
  - Henry: (2, 0, 2)
  - Skeleton: (0, 0, 4) (detrás, tropezando)

**Environment (Nature Kit):**
- `tree_oak` y `tree_detailed` x10 (grandes, formando dosel)
  - Posiciones: Círculo alrededor, escala 2x
  
- `tree_pineTall` x8 (altura variada)
  
- `plant_bushLarge` y `plant_bushDetailed` x15 (suelo)

- `rock_large` x6 (bloqueando caminos)

**Environment (Pirate Kit):**
- `Environment_LargeBones` x3
  - Posiciones: (-5, 0, -5), (8, 0, 3), (-3, 0, 8)
  - Escalas: 1.5x
  
- `Prop_Skull` x10 (dispersos por el suelo)
  - Escalas pequeñas: 0.3x
  
- `Weapon_Sword_1` y `Weapon_Cutlass` (tirados, oxidados)

**Props:**
- `Prop_Barrel` x4 (rotos)
- Vines/creepers: Cilindros verdes subiendo por árboles

#### **Iluminación:**
- **Luz principal:** Filtrada por el dosel
  - Color: `#4a7c59` (verde bosque)
  - Intensidad: 0.8
  - Posición: (10, 30, 10)
- **Rayos de sol:** Conos de luz (`SpotLight`) atravesando hojas
  - 3-4 rayos visibles
  - Intensidad: 0.5
  - Color: `#d4f1d4` (verde claro)
- **Luz ambiental:** `#1a2f1a` (0.3 intensidad)

#### **Efectos:**
- **Niebla baja:** Plano transparente justo encima del suelo
- **Partículas:** Polen/hojas flotando, luciérnagas (puntos de luz amarillos)
- **Sombras:** Muy marcadas, contrastes fuertes

#### **Cámara:**
- Posición: Behind the shoulder de Barbarossa
- Movimiento: Traveling siguiendo al grupo
- Scroll: Avance por el "túnel" de árboles
- Efecto: Árboles pasan de largo en el periphery

### **Timing y Scroll**

**40-45%:**
- Transición: Wipe a verde oscuro
- Entrada a la jungla
- Texto: "La Jungla Maldita"
- Rayos de sol filtrándose

**45-50%:**
- Grupo caminando
- Se ven huesos gigantes
- Diálogo Anne: "Este lugar me da escalofríos..."

**50-55%:**
- Skeleton tropieza (animación HitReact)
- Diálogo Skeleton: "A mí me parece acogedor"
- Cámara revela más calaveras

**55-60%:**
- Abrense paso entre rocas
- Se vislumbra luz al final (cueva)
- Transición: Zoom rápido hacia la oscuridad

---

## 🦑 ESCENA 4: "LA CUEVA DEL KRAKEN"

### **Ambientación Narrativa**
Una caverna subterránea inundada parcialmente. El agua es negra y reflectante. Estalactitas cuelgan del techo, y gemas brillantes incrustadas en las paredes proporcionan la única luz. Del agua emergen los temibles tentáculos del Kraken.

### **Elementos Visuales**

#### **Skybox/Background:**
- Color: `#0a0a1a` (azul medianoche)
- Fog: Denso, azul-púrpura, misterioso

#### **Modelos 3D Necesarios:**

**Personajes (Posiciones de batalla):**
- `Characters_Captain_Barbarossa`
  - Posición: (-3, 0, 0)
  - Animación: Sword
  
- `Characters_Anne`
  - Posición: (0, 0, 3)
  - Animación: HitReact (esquivando)
  
- `Characters_Henry`
  - Posición: (4, 0, -2)
  - Animación: Punch (cargando cañón)
  
- `Characters_Skeleton`
  - Posición: (-1, 0, 2)
  - Animación: Death (¡sin loop!) → Idle (revive)

**Enemigos:**
- `Characters_Tentacle` x3
  - Posiciones: (-2, 0, -5), (3, 0, -4), (0, 0, -6)
  - Escalas: 1.5x
  - Animación: Idle (ondulando)
  
- `Enemy_Tentacle` x2
  - Posiciones: (-4, 0, -3), (5, 0, -5)

**Environment:**
- Cueva: Geometría procedural o `cliff` models del pirate kit
  - Paredes circulares
  - Techo alto con estalactitas (conos invertidos)
  
- `Environment_Cliff1`, `Cliff2`, `Cliff3` (formando paredes)
  - Escalas: 3x
  - Rotaciones: Variadas

**Agua:**
- Plano reflectante cubriendo 60% del suelo
- Material: Negro reflectante `#0a0a1a`
- Animación: Ondulación lenta, misteriosa

**Props:**
- `Prop_Chest_Gold` (el tesoro, en el fondo)
  - Posición: (0, 0.5, -8)
  - Brillo emisivo
  
- `UI_Gem_Blue`, `UI_Gem_Green`, `UI_Gem_Pink` x20
  - Incrustados en paredes
  - Materiales emisivos
  
- `Prop_Cannon` x2
  - Posiciones laterales

#### **Iluminación:**
- **Luz ambiental:** `#0a0a1a` (0.2 intensidad)
- **Gemas emisivas:** Cada gema es un punto de luz
  - Colores: Azul, verde, rosa
  - Intensidad: 0.3 cada una
  - Distribuidas por las paredes
- **Tesoro:** `PointLight` dorado `#ffd700`
  - Intensidad: 1.0
  - Rango: 10 unidades
- **Flash de batalla:** Luces rojas intermitentes durante el combate

#### **Efectos:**
- **Reflejos en agua:** El agua refleja las gemas y personajes
- **Burbujas:** Partículas subiendo desde el agua
- **Splash:** Cuando tentáculos golpean

#### **Cámara:**
- Posición: Dinámica, moviéndose alrededor de la acción
- Ángulos bajos (desde el agua)
- Zooms dramáticos durante golpes
- Slow motion en el golpe final

### **Timing y Scroll**

**60-65%:**
- Transición: Zoom desde oscuridad
- Entrada a la cueva
- Revelación de gemas brillantes
- Texto: "La Cueva del Kraken"

**65-70%:**
- Grupo avanza cauteloso
- Se ve el cofre dorado al fondo
- Tentáculos emergen del agua

**70-75%:**
- ¡BATALLA!
- Skeleton es golpeado → Death (se queda inmóvil)
- Diálogo Barbarossa: "¡A las armas!"

**75-80%:**
- Henry dispara cañón
- Barbarossa ataca con espada
- Tentáculos se retraen
- Skeleton revive (se levanta)
- Transición: Flash blanco

---

## 🏖️ ESCENA 5: "LA PLAYA DEL BOTÍN"

### **Ambientación Narrativa**
La playa dorada al atardecer. El peligro ha pasado, el tesoro es suyo. Es un momento de celebración, camaradería y triunfo. El barco los espera en la distancia, listo para nuevas aventuras.

### **Elementos Visuales**

#### **Skybox/Background:**
- Gradiente: `#ff6b35` (naranja) → `#f1c40f` (dorado) → `#9b59b6` (púrpura atardecer)
- Fog: Cálido, dorado, distancia larga

#### **Modelos 3D Necesarios:**

**Personajes (Celebrando):**
- Todos en círculo alrededor del tesoro
- Animaciones: Wave, Jump, Idle felices
- Posiciones:
  - Barbarossa: (-2, 0, 0)
  - Anne: (2, 0, 0)
  - Henry: (0, 0, 2)
  - Skeleton: (0, 0, -2) (haciendo el tonto)

**Props:**
- `Prop_Chest_Gold` (abierto, brillando)
  - Posición: (0, 0, 0)
  - Escala: 1.2
  
- `Prop_Coins` x10 (montones alrededor)
  - Escalas variadas
  - Distribuidas en círculo
  
- `Prop_GoldBag` x3
- `Weapon_Cutlass` (plantada en la arena como trofeo)
- `Prop_Bottle_1` y `_2` (celebrando)

**Environment:**
- Arena: Plano dorado `#C2B280`
- `Environment_PalmTree_1`, `_2`, `_3` x8
  - Dispersas por la playa
  - Algunas con hamacas (cuerdas simples)
  
- `Ship_Large` (anclado cerca)
  - Posición: (-20, -0.5, -15)
  - Escala: 1.0
  
- `Environment_Rock_1`, `_2` (decorativos)

**Agua:**
- Playa con orilla
- Agua cristalina turquesa `#40E0D0`
- Olas suaves rompiendo en la orilla

#### **Iluminación:**
- **Sol poniente:** `#ff6b35` (1.2 intensidad)
  - Posición: (-30, 5, -30) (bajo)
  - Luz cálida dorada
- **Luz de relleno:** `#f1c40f` (0.5 intensidad)
- **Luz ambiental:** `#fff5e6` (0.7 intensidad)
- **Brillo del tesoro:** `PointLight` dorado

#### **Efectos:**
- **Chispas doradas:** Partículas brillantes flotando desde el tesoro
- **Confeti:** Papeles de colores cayendo (celebración)
- **Lentejuelas:** Brillos en el agua (reflejos del sol)

#### **Cámara:**
- Posición: Elevada, vista panorámica
- Rotación: 360° alrededor del grupo
- Zoom out final mostrando toda la isla
- Movimiento suave, épico

### **Timing y Scroll**

**80-85%:**
- Transición: Flash blanco suave
- Fade in a la playa dorada
- Vista panorámica del paraíso
- Texto: "La Fortuna del Caribe"

**85-90%:**
- Cámara desciende hacia el grupo
- Cofre abierto brillando
- Todos celebrando

**90-95%:**
- Paneo mostrando cada personaje feliz
- Diálogos de celebración
- Skeleton haciendo el payaso

**95-100%:**
- Cámara se eleva
- Vista amplia de la playa, barco, atardecer
- Texto final: "Y así, la leyenda comenzó..."
- Botón "Volver a zarpar"

---

## 📝 AJUSTES RECIENTES - DÍA 2

### **Sistema de Coordenadas de la Escena 1**

#### **Constante DECK_LEVEL**
```javascript
const DECK_LEVEL = 1.2; // Altura aproximada de la cubierta del barco
```

#### **Jerarquía de Objetos:**
```
scene (escena principal)
└── sceneGroups.storm (grupo escena 1)
    ├── shipInStorm (barco)
    │   ├── capitán (hijo del barco) ✓
    │   ├── barrel1 (hijo del barco) ✓
    │   ├── barrel2 (hijo del barco) ✓
    │   └── barrel3 (hijo del barco) ✓
    ├── agua (hermano del barco)
    └── lluvia (hermano del barco)
```

#### **Por qué hacer hijos del barco:**
- ✅ **Ventaja:** Se mueven automáticamente con el balanceo del barco
- ✅ **Ventaja:** No necesitan sincronización manual en el loop
- ✅ **Código más limpio:** Una sola animación del barco afecta a todos

#### **Posicionamiento Manual vs Automático:**
```javascript
// ❌ ANTES: Capitán en escena, sincronización manual compleja
const captain = loadedModels['barbarossa'];
group.add(captain); // Escena
// En loop: captain.position.y = baseY + ship.position.y;

// ✅ AHORA: Capitán hijo del barco, balanceo automático
const captain = loadedModels['barbarossa'];
shipInStorm.add(captain); // Hijo del barco
// En loop: SIN CÓDIGO, se mueve solo con el barco
```

#### **Problema del posicionamiento inicial:**
- **Issue:** El capitán estaba en Y=5.5 (levitando)
- **Causa:** Desconocimiento de la altura real de la cubierta
- **Solución:** Constante DECK_LEVEL = 1.2 ajustada visualmente
- **Resultado:** Tanto capitán como barriles alineados correctamente

---

## 📝 NOTAS TÉCNICAS IMPORTANTES

### **Three.js Versiones**
- **Inicialmente usamos:** r128 (viejo, 2021) - tenía bugs con SkinnedMesh
- **Actualmente usamos:** v0.160.0 - moderno, funciona perfecto
- **Importmap:** Esencial para usar la versión moderna correctamente

### **GLTF y SkinnedMesh - Lecciones Aprendidas**

#### **❌ NO HACER:**
```javascript
// Clonar modelos con SkinnedMesh rompe el esqueleto
const captain1 = loadedModels['barbarossa'].clone();
const captain2 = loadedModels['barbarossa'].clone();
// Resultado: SkinnedMesh no renderiza, solo meshes normales visibles
```

#### **✅ HACER:**
```javascript
// Usar el modelo directamente
const captain = loadedModels['barbarossa'];
group.add(captain);
// Resultado: Todo funciona perfectamente (cuerpo, loro, espada, animaciones)

// Si necesitas múltiples personajes del mismo tipo:
// Opción A: Cargar el archivo múltiples veces (diferentes loaders)
// Opción B: Usar instancing especializado (más complejo)
// Opción C: Usar diferentes modelos (Barbarossa, Anne, Henry, Skeleton)
```

#### **¿Por qué pasa esto?**
Los modelos GLTF con SkinnedMesh tienen un **skeleton** (esqueleto) con **bones** (huesos) que deforman el mesh. Cuando clonas el modelo:
1. Se clonan los meshes
2. Se clonan los huesos
3. Pero las **referencias** entre mesh y hueso se rompen
4. Resultado: SkinnedMesh no puede calcular deformaciones → invisible

### **Solución de Debug Efectiva**
Cuando algo no se ve:
1. **Crear archivo mínimo** (scene1.html) que solo carga ese modelo
2. **Comparar** configuración entre el mínimo y el proyecto complejo
3. **Identificar diferencias** (en nuestro caso: .clone())
4. **Aislar el problema** antes de intentar soluciones complejas

### **Arquitectura de Escenas**
```javascript
// 5 grupos independientes, uno por escena
sceneGroups.storm    // Escena 1: La Tormenta
sceneGroups.port     // Escena 2: El Puerto
sceneGroups.jungle   // Escena 3: La Jungla
sceneGroups.cave     // Escena 4: La Cueva
sceneGroups.beach    // Escena 5: La Playa

// Mostrar/ocultar según scroll
function switchToScene(sceneNum) {
    sceneGroups.storm.visible = (sceneNum === 1);
    sceneGroups.port.visible = (sceneNum === 2);
    // etc.
}
```

### **Animaciones - Mejores Prácticas**
```javascript
// Crear mixer y guardar referencia
const mixer = new THREE.AnimationMixer(model);
mixers.push(mixer); // Array global para actualizar todos

// Reproducir animación específica
const idleAction = mixer.clipAction(animations.find(a => a.name === 'Idle'));
idleAction.play();

// En el loop de animación
mixers.forEach(mixer => mixer.update(delta));

// Animación NO LOOP (ej: Death)
action.setLoop(THREE.LoopOnce);
action.clampWhenFinished = true;
```

### **Efectos Visuales Implementados**

#### **Lluvia (1500 partículas)**
```javascript
// BufferGeometry para rendimiento
const rainGeometry = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);
// ... llenar posiciones
rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

// Animación en loop
positions[i * 3] += velocity.x;     // Viento
positions[i * 3 + 1] += velocity.y; // Caída
```

#### **Relámpagos**
```javascript
// Luz puntual que se activa aleatoriamente
if (Math.random() < 0.02) { // 2% probabilidad
    lightningLight.intensity = 2 + Math.random() * 2;
    setTimeout(() => {
        lightningLight.intensity = 0;
    }, 100 + Math.random() * 150);
}
```

#### **Barco Meciéndose**
```javascript
// Ondas senoidales desfasadas para movimiento natural
ship.rotation.z = Math.sin(time * 0.8) * 0.08;  // Balanceo lateral
ship.rotation.x = Math.sin(time * 1.2) * 0.05;  // Cabeceo
ship.position.y = Math.sin(time * 0.6) * 0.3;   // Subir/bajar
```

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### **Estructura de Grupos**

```javascript
// Cada escena es un grupo independiente
scene1Group = new THREE.Group();
scene2Group = new THREE.Group();
scene3Group = new THREE.Group();
scene4Group = new THREE.Group();
scene5Group = new THREE.Group();

// Añadir a escena principal
scene.add(scene1Group);
scene.add(scene2Group);
// etc.

// Mostrar/ocultar según scroll
function showScene(sceneNum) {
    scene1Group.visible = (sceneNum === 1);
    scene2Group.visible = (sceneNum === 2);
    // etc.
}
```

### **Transiciones Entre Escenas**

**Opción 1: Fade to Black**
```javascript
// Overlay negro que cambia de opacidad
const fadeOverlay = document.getElementById('fade-overlay');

gsap.to(fadeOverlay, {
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
        showScene(nextScene);
        gsap.to(fadeOverlay, { opacity: 0, duration: 0.3 });
    }
});
```

**Opción 2: Wipe Effect**
```javascript
// Div que se mueve para revelar
const wipe = document.getElementById('wipe-transition');
gsap.fromTo(wipe, 
    { scaleX: 0 },
    { scaleX: 1, duration: 0.5, ease: "power2.inOut" }
);
```

### **Gestión de Memoria**

Como PC potente (64GB RAM), podemos mantener todo cargado. Pero por optimización:
- Cargar modelos al inicio (como ahora)
- Solo mostrar/ocultar grupos
- No destruir/recreate

### **Timeline ScrollTrigger por Escena**

```javascript
// Timeline principal controla transiciones
const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            handleSceneTransitions(self.progress);
        }
    }
});

function handleSceneTransitions(progress) {
    // 0-20%: Escena 1
    // 20-20.5%: Transición 1→2
    // 20.5-40%: Escena 2
    // etc.
}
```

---

## 📦 ASSETS NECESARIOS

### **Pirate Kit (ya usados):**
- Todos los personajes
- Barcos
- Environment (dock, houses, cliffs, palm trees, bones)
- Props (barrels, chests, bottles, weapons)

### **Nature Kit (extras):**
- Árboles grandes (escena 3)
- Rocas adicionales
- Plantas/jungle vegetation

### **Generados Proceduralmente:**
- Cueva (geometría básica)
- Agua (planos con shaders)
- Partículas (lluvia, nieve, polen)
- Efectos de luz (relámpagos, rayos sol)

---

## 🎯 CHECKLIST DE DESARROLLO - ESTADO ACTUAL

### **Fase 1: Escena 1 "La Tormenta"** ✅ 100% COMPLETADA Y PULIDA
- [x] Setup básico de Three.js v0.160.0
- [x] Cargar modelos necesarios
- [x] Crear sistema de grupos de escenas (5 grupos independientes)
- [x] Implementar agua animada con olas
- [x] Implementar lluvia (1500 partículas cayendo con viento)
- [x] Implementar relámpagos intermitentes (2% probabilidad/frame)
- [x] Animación de barco meciéndose (rotación Z/X + posición Y)
- [x] **Barriles y capitán como hijos del barco** ✅
  - Jerarquía: shipInStorm.add(captain)
  - Jerarquía: shipInStorm.add(barriles)
  - Balanceo automático sincronizado
- [x] **Capitán Barbarossa correctamente posicionado** ✅
  - DECK_LEVEL = 1.2 (constante ajustada visualmente)
  - Posición: (0, 1.2, -2) - en cubierta, no levitando
  - Animación Idle funcionando
  - Loro Ernest y espada visibles
- [x] **Cámara dinámica con lookAt** ✅
  - Cámara se mueve según scroll
  - Siempre apunta al capitán (getWorldPosition)
  - Efecto: capitán siempre centrado en pantalla
- [x] **Iluminación de tormenta** ✅
  - Luz ambiental oscura (0.3 intensidad)
  - Relámpagos intermitentes (flash 2-4 intensidad)
  - Efecto dramático: oscuridad → flash → oscuridad
- [x] Transición fade to black implementada
- [x] Sistema de texto fijo en panel superior

**Estado:** ✅ COMPLETA Y PULIDA - Todos los elementos visuales funcionando perfectamente.

### **Fase 2: Escena 2 "El Puerto"** ✅ 90% COMPLETADO
- [x] Crear grupo escena2Group
- [x] Posicionar muelle y casas
- [x] Barcos pequeños amarrados
- [x] Props dispersos (barriles, botellas)
- [x] Palmeras de fondo
- [ ] Animaciones de aparición de personajes (están colocados, falta activar)
- [ ] Efectos de polen dorado
- [x] Transición fade to black implementada

### **Fase 3: Escena 3 "La Jungla"** ✅ 90% COMPLETADO
- [x] Crear túnel de árboles (20 árboles grandes en círculo)
- [x] Pinos altos adicionales
- [x] Huesos gigantes dispersos
- [x] Calaveras por el suelo (12)
- [x] Rocas y arbustos
- [x] Armas tiradas (cutlass y sword)
- [ ] Rayos de sol filtrándose (SpotLights)
- [ ] Niebla baja
- [ ] Cámara traveling
- [x] Transición fade to black implementada

### **Fase 4: Escena 4 "La Cueva"** ✅ 85% COMPLETADO
- [x] Geometría de cueva (acantilados formando paredes)
- [x] Agua reflectante negra
- [x] Gemas emisivas (15 gemas de colores con PointLights)
- [x] Cofre del tesoro
- [x] Monedas dispersas
- [x] Cañones laterales
- [x] Personajes en posición de batalla
- [x] Tentáculos preparados (inicialmente ocultos)
- [ ] Batalla con tentáculos (animaciones)
- [ ] Animación Death sin loop (Skeleton)
- [ ] Transición flash

### **Fase 5: Escena 5 "La Playa"** ✅ 90% COMPLETADO
- [x] Playa dorada
- [x] Agua turquesa
- [x] Palmeras dispersas (12)
- [x] Barco anclado en fondo
- [x] Cofre del tesoro (brillando)
- [x] Montones de monedas (20)
- [x] Bolsas de oro (3)
- [x] Espada como trofeo
- [x] Barriles de celebración
- [x] Rocas decorativas
- [ ] Celebración de personajes (animaciones Wave/Jump)
- [ ] Cámara 360°
- [ ] Efectos de celebración (chispas, confeti)

### **Fase 6: Pulido y Mejoras** 🔄 EN PROGRESO
- [x] Sistema de texto fijo en panel superior
- [x] Transiciones suaves entre escenas (fade to black)
- [x] Cambio de luces y colores de fondo por escena
- [x] Barra de progreso
- [x] Navegación por puntos
- [ ] Optimizar rendimiento (con 64GB RAM no es prioridad)
- [ ] Refinar timing de textos
- [ ] Añadir más diálogos (se redujeron para el panel compacto)
- [ ] Test en diferentes resoluciones

---

## 🐛 ISSUES CONOCIDOS

### **Issue #1: SkinnedMesh invisible** ✅ **RESUELTO**
**Descripción:** El cuerpo del capitán (SkinnedMesh) no se renderizaba, solo se veía la espada.

**Causa raíz:** El problema no era SkinnedMesh ni la configuración, sino que **estábamos clonando el modelo** (`loadedModels['barbarossa'].clone()`) y eso rompía las referencias internas del esqueleto.

**Solución:** Usar el modelo directamente sin clonar:
```javascript
// ❌ INCORRECTO - Rompe SkinnedMesh
const captain = loadedModels['barbarossa'].clone();

// ✅ CORRECTO - Funciona perfectamente
const captain = loadedModels['barbarossa'];
```

**Lección aprendida:** Los modelos GLTF con SkinnedMesh (huesos) no deben clonarse si se van a usar inmediatamente. Si se necesitan múltiples instancias, hay que cargar el archivo múltiples veces o usar técnicas de instancing especializadas.

**Estado:** ✅ RESUELTO - Capitán completamente visible con animación Idle funcionando.

---

## ✅ LOGROS DEL DÍA 1

1. **Arquitectura completa** con 5 escenas independientes
2. **Escena 1 funcional** con todos los efectos (lluvia, relámpagos, olas)
3. **Sistema de transiciones** con fade to black y cambio de colores
4. **Panel de texto fijo** en la parte superior (más compacto)
5. **Todas las escenas construidas** con sus elementos visuales
6. **Cámara lookAt** al capitán funcionando

---

## 🎯 PRÓXIMOS PASOS (DÍA 3)

### **Prioridad 1: Activar personajes en todas las escenas** 🎭
Ahora que sabemos que NO hay que clonar los modelos, activar los personajes en cada escena:

**Escena 2 - Puerto:**
- [ ] Barbarossa caminando por el muelle
- [ ] Anne aparece con animación Wave
- [ ] Henry junto a los cañones
- [ ] Skeleton apareciendo desde las sombras

**Escena 3 - Jungla:**
- [ ] Todos caminando en formación
- [ ] Skeleton tropezando (HitReact)
- [ ] Cámara following

**Escena 4 - Cueva:**
- [ ] Posiciones de batalla
- [ ] Tentáculos emergiendo (scale up)
- [ ] Skeleton con animación Death (no loop)
- [ ] Barbarossa con animación Sword

**Escena 5 - Playa:**
- [ ] Todos celebrando (Wave/Yes/Jump)
- [ ] Skeleton haciendo el tonto

### **Prioridad 2: Efectos visuales** ✨
- [ ] Partículas de polen dorado en escena 2
- [ ] Rayos de sol filtrándose (SpotLights) en escena 3
- [ ] Burbujas subiendo del agua en escena 4
- [ ] Chispas doradas y confeti en escena 5

### **Prioridad 3: Pulir transiciones** 🎬
- [ ] Ajustar timing de fades (más rápidos/suaves)
- [ ] Sincronizar cambio de texto exactamente con cambio de escena
- [ ] Añadir variedad: wipe diagonal, zoom, etc.

### **Prioridad 4: Testing** 📱
- [ ] Probar en diferentes resoluciones
- [ ] Verificar rendimiento con 5 escenas cargadas
- [ ] Ajustar posiciones de cámara
- [ ] Test del botón "Volver a zarpar"

---

## 📊 RESUMEN DEL PROGRESO

### **DÍA 1 - COMPLETADO ✅**
Base sólida implementada:
- **5 escenas independientes** construidas
- **Sistema de transiciones** con fade to black
- **Escena 1 "La Tormenta"** con efectos visuales
- **Panel de texto fijo** rediseñado

### **DÍA 2 - MAÑANA COMPLETADO ✅**
- 🔧 **Issue del capitán RESUELTO** - Descubrimos que no hay que clonar modelos GLTF con SkinnedMesh
- ✅ **Escena 1 100% funcional** con capitán animado en la cubierta
- ✅ **Todas las escenas** tienen su estructura visual completa
- ✅ **Sistema de transiciones** entre escenas funcionando perfectamente

### **DÍA 3 - OBJETIVOS ACTUALES**
1. 🎭 **Activar personajes en todas las escenas**
   - Escena 2: Hacer visibles a Anne, Henry y Skeleton al llegar al puerto
   - Escena 3: Personajes caminando por la jungla
   - Escena 4: Activar tentáculos y animaciones de batalla
   - Escena 5: Celebración con todos los personajes
2. ✨ **Añadir efectos visuales**
   - Partículas de polen dorado en escena 2
   - Rayos de sol filtrándose en escena 3
   - Burbujas y reflejos en escena 4
   - Chispas doradas en escena 5
3. 🎬 **Pulir transiciones**
   - Timing de los fades
   - Sincronizar cambio de texto con cambio de escena
   - Añadir variedad de transiciones (wipe, zoom)
4. 📱 **Testing y ajustes**
   - Probar en diferentes resoluciones
   - Optimizar rendimiento si es necesario
   - Ajustar posiciones de cámara

### **LECCIÓN TÉCNICA CLAVE**
```javascript
// ❌ NO clonar modelos GLTF con SkinnedMesh
const captain = loadedModels['barbarossa'].clone(); // Rompe el esqueleto

// ✅ Usar directamente
const captain = loadedModels['barbarossa']; // Funciona perfectamente
```

### **ARCHIVOS**
- `index.html` - Escena completa (≈1800 líneas)
- `scene1.html` - Debug mínimo del capitán
- `PLANIFICACION.md` - Este documento

### **PARA PROBAR**
```bash
cd experiments/pirate-scrollytelling
python -m http.server 8000
# Abrir http://localhost:8000
```

---

**Estado:** 🎉 ¡Capitán visible! Continuamos con el Día 3 ⚓🌊
---

## INVENTARIO DE MODELOS PIRATE-KIT

> Fuente: `tools/inventory-generator/output/inventories/pirate-kit.json`
> Total: 72 modelos

### PERSONAJES (con animaciones)

| Modelo | Animaciones | Altura | Notas |
|--------|-------------|--------|-------|
| `Characters_Captain_Barbarossa` | Death, Duck, HitReact, Idle, Jump, Jump_Idle, Jump_Land, No, Punch, Run, Sword, Walk, Wave, Yes | 1.85m | Protagonista |
| `Characters_Anne` | Death, Duck, HitReact, Idle, Jump, Jump_Idle, Jump_Land, No, Punch, Run, Sword, Walk, Wave, Yes | 1.81m | Navegadora |
| `Characters_Henry` | Death, Duck, HitReact, Idle, Jump, Jump_Idle, Jump_Land, No, Punch, Run, Sword, Walk, Wave, Yes | 1.76m | Artillero |
| `Characters_Skeleton` | Death, Duck, HitReact, Idle, Jump, Jump_Idle, Jump_Idlea, Jump_Land, No, Punch, Run, Sword, Walk, Wave, Yes | 1.59m | Comicamente inmortal |
| `Characters_Tentacle` | Tentacle_Attack, Tentacle_Attack2, Tentacle_Idle, Tentacle_Poke | - | Tentaculo animado |
| `Characters_Shark` | Swim, Swim_Bite, Swim_Fast | 2.01m | Tiburon nadador |

### ENEMIGOS

| Modelo | Notas |
|--------|-------|
| `Enemy_Tentacle` | Tentaculo estatico |

### BARCOS

| Modelo | Notas |
|--------|-------|
| `Ship_Large` | Barco principal del capitan |
| `Ship_Small` | Barcos secundarios |

### ENVIRONMENT - CONSTRUCCION

| Modelo | Categoria | Notas |
|--------|-----------|-------|
| `Environment_Dock` | Muelle | Seccion de muelle |
| `Environment_Dock_Broken` | Muelle | Seccion rota |
| `Environment_Dock_Pole` | Muelle | Poste de muelle |
| `Environment_House1` | Edificio | Casa tipo 1 |
| `Environment_House2` | Edificio | Casa tipo 2 |
| `Environment_House3` | Edificio | Casa tipo 3 |

### ENVIRONMENT - NATURALEZA

| Modelo | Categoria | Notas |
|--------|-----------|-------|
| `Environment_PalmTree_1/2/3` | Vegetacion | Palmeras |
| `Environment_Cliff1/2/3/4` | Terreno | Acantilados |
| `Environment_Rock_1` a `Rock_5` | Terreno | Rocas variadas |
| `Environment_LargeBones` | Decoracion | Huesos grandes (jungla) |
| `Environment_Skulls` | Decoracion | Calaveras (cueva) |

### PROPS

| Modelo | Categoria | Notas |
|--------|-----------|-------|
| `Prop_Barrel` | Contenedor | Barril |
| `Prop_Chest_Gold` | Contenedor | Cofre con oro |
| `Prop_Coins` | Tesoro | Monedas |
| `Prop_GoldBag` | Tesoro | Bolsa de oro |
| `Prop_Skull` | Decoracion | Calavera suelta |
| `Prop_Cannon` | Arma | Canon |
| `Prop_Flag_Pirate` | Decoracion | Bandera pirata |
| `Prop_Lamp` | Iluminacion | Lampara |
| `Prop_TreasureMap` | Herramienta | Mapa del tesoro |

### WEAPONS

| Modelo | Notas |
|--------|-------|
| `Weapon_Cutlass` | Sable pirata |
| `Weapon_Sword_1` | Espada estandar |

---

**Estado:** Scene1 y Scene2 completadas. Continuamos con Scene3