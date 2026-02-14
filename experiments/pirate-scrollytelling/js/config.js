/**
 * Configuración global del proyecto El Último Pirata
 * Rutas de modelos, constantes y ajustes
 */

export const CONFIG = {
    // Ajustes de cámara
    camera: {
        fov: 60,
        near: 0.1,
        far: 1000,
        initialPosition: { x: 0, y: 12, z: 30 }
    },
    
    // Ajustes de renderer
    renderer: {
        antialias: true,
        pixelRatioLimit: 2,
        toneMapping: 'ACESFilmicToneMapping',
        toneMappingExposure: 1.0
    },
    
    // Rutas de modelos 3D
    models: {
        // Personajes
        barbarossa: '../../assets/3D/pirate-kit/glTF/Characters_Captain_Barbarossa.gltf',
        anne: '../../assets/3D/pirate-kit/glTF/Characters_Anne.gltf',
        henry: '../../assets/3D/pirate-kit/glTF/Characters_Henry.gltf',
        skeleton: '../../assets/3D/pirate-kit/glTF/Characters_Skeleton.gltf',
        tentacle: '../../assets/3D/pirate-kit/glTF/Characters_Tentacle.gltf',
        enemyTentacle: '../../assets/3D/pirate-kit/glTF/Enemy_Tentacle.gltf',
        
        // Barcos
        shipLarge: '../../assets/3D/pirate-kit/glTF/Ship_Large.gltf',
        shipSmall: '../../assets/3D/pirate-kit/glTF/Ship_Small.gltf',
        
        // Environment
        dock: '../../assets/3D/pirate-kit/glTF/Environment_Dock.gltf',
        dockPole: '../../assets/3D/pirate-kit/glTF/Environment_Dock_Pole.gltf',
        house1: '../../assets/3D/pirate-kit/glTF/Environment_House1.gltf',
        house2: '../../assets/3D/pirate-kit/glTF/Environment_House2.gltf',
        cliff1: '../../assets/3D/pirate-kit/glTF/Environment_Cliff1.gltf',
        cliff2: '../../assets/3D/pirate-kit/glTF/Environment_Cliff2.gltf',
        cliff3: '../../assets/3D/pirate-kit/glTF/Environment_Cliff3.gltf',
        palmTree1: '../../assets/3D/pirate-kit/glTF/Environment_PalmTree_1.gltf',
        palmTree2: '../../assets/3D/pirate-kit/glTF/Environment_PalmTree_2.gltf',
        palmTree3: '../../assets/3D/pirate-kit/glTF/Environment_PalmTree_3.gltf',
        largeBones: '../../assets/3D/pirate-kit/glTF/Environment_LargeBones.gltf',
        rock1: '../../assets/3D/pirate-kit/glTF/Environment_Rock_1.gltf',
        rock2: '../../assets/3D/pirate-kit/glTF/Environment_Rock_2.gltf',
        rock3: '../../assets/3D/pirate-kit/glTF/Environment_Rock_3.gltf',
        
        // Props
        chestGold: '../../assets/3D/pirate-kit/glTF/Prop_Chest_Gold.gltf',
        coins: '../../assets/3D/pirate-kit/glTF/Prop_Coins.gltf',
        goldBag: '../../assets/3D/pirate-kit/glTF/Prop_GoldBag.gltf',
        barrel: '../../assets/3D/pirate-kit/glTF/Prop_Barrel.gltf',
        skull: '../../assets/3D/pirate-kit/glTF/Prop_Skull.gltf',
        cannon: '../../assets/3D/pirate-kit/glTF/Prop_Cannon.gltf',
        
        // Weapons
        cutlass: '../../assets/3D/pirate-kit/glTF/Weapon_Cutlass.gltf',
        sword: '../../assets/3D/pirate-kit/glTF/Weapon_Sword_1.gltf',
        
        // Nature kit extras
        treeOak: '../../assets/3D/kenney_nature-kit/Models/GLTF format/tree_oak.glb',
        treeDetailed: '../../assets/3D/kenney_nature-kit/Models/GLTF format/tree_detailed.glb',
        treePineTall: '../../assets/3D/kenney_nature-kit/Models/GLTF format/tree_pineTallA.glb',
        rockLarge: '../../assets/3D/kenney_nature-kit/Models/GLTF format/rock_largeA.glb',
        plantBushLarge: '../../assets/3D/kenney_nature-kit/Models/GLTF format/plant_bushLarge.glb'
    },
    
    // Colores por escena
    colors: {
        storm: {
            background: 0x1a1a2e,
            fog: 0x1a1a2e,
            ambient: 0x1a1a2e,
            moon: 0xa8d8ea,
            water: 0x001f3f
        },
        port: {
            background: 0xff6b35,
            fog: 0xfff5e6,
            ambient: 0xfff5e6,
            sun: 0xffd700,
            water: 0x40E0D0
        },
        jungle: {
            background: 0x0f291e,
            fog: 0x1a2f1a,
            ambient: 0x1a2f1a,
            main: 0x4a7c59,
            ground: 0x3d5c3d
        },
        cave: {
            background: 0x0a0a1a,
            fog: 0x0a0a1a,
            ambient: 0x0a0a1a,
            water: 0x0a0a1a
        },
        beach: {
            background: 0xff6b35,
            fog: 0xfff5e6,
            ambient: 0xfff5e6,
            sun: 0xff6b35,
            sand: 0xE6C288,
            water: 0x40E0D0
        }
    },
    
    // Constantes de escena 1
    scene1: {
        DECK_LEVEL: 1.05,
        shipScale: 1.2,
        rainCount: 1500,
        lightningProbability: 0.02,
        lightningMinDuration: 100,
        lightningMaxDuration: 250
    }
};

/**
 * Crea geometría de fallback para modelos que no cargan
 */
export function createFallbackGeometry(type) {
    const group = new THREE.Group();
    let geometry, material, mesh;
    
    if (type.includes('barbarossa') || type.includes('anne') || type.includes('henry')) {
        geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.75;
    } else if (type.includes('skeleton')) {
        geometry = new THREE.CapsuleGeometry(0.4, 1.4, 4, 8);
        material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.7;
    } else if (type.includes('tentacle')) {
        geometry = new THREE.CylinderGeometry(0.3, 0.1, 3, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x8B008B });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 1.5;
    } else if (type.includes('ship')) {
        geometry = new THREE.BoxGeometry(4, 1.5, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.75;
    } else if (type.includes('chest')) {
        geometry = new THREE.BoxGeometry(1.5, 1, 1);
        material = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.5;
    } else if (type.includes('tree')) {
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.5, 2, 8),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = 1;
        group.add(trunk);
        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(2, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        leaves.position.y = 3;
        group.add(leaves);
    } else {
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        mesh = new THREE.Mesh(geometry, material);
    }
    
    if (mesh) group.add(mesh);
    return group;
}
