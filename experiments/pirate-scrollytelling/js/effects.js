/**
 * Efectos especiales para El Último Pirata
 * Lluvia, relámpagos, partículas, etc.
 */

import * as THREE from 'three';

/**
 * Sistema de lluvia con física de viento
 */
export class RainSystem {
    constructor(parent, count = 1500) {
        this.count = count;
        this.velocities = [];
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = Math.random() * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
            
            this.velocities.push({
                x: -0.3 + Math.random() * 0.2, // Viento
                y: -0.5 - Math.random() * 0.3, // Caída
                z: 0
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x88aaff,
            size: 0.15,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.points = new THREE.Points(geometry, material);
        parent.add(this.points);
    }
    
    update() {
        const positions = this.points.geometry.attributes.position.array;
        
        for (let i = 0; i < this.count; i++) {
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;
            positions[i * 3 + 2] += this.velocities[i].z;
            
            // Reset si cae demasiado bajo
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = 30 + Math.random() * 10;
                positions[i * 3] = (Math.random() - 0.5) * 80;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
            }
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
    }
    
    dispose() {
        this.points.geometry.dispose();
        this.points.material.dispose();
    }
}

/**
 * Sistema de relámpagos intermitentes
 */
export class LightningSystem {
    constructor(parent, options = {}) {
        this.probability = options.probability || 0.02;
        this.minDuration = options.minDuration || 100;
        this.maxDuration = options.maxDuration || 250;
        this.minIntensity = options.minIntensity || 2.0;
        this.maxIntensity = options.maxIntensity || 4.0;
        
        this.light = new THREE.PointLight(0xffffff, 0, 100);
        this.light.position.set(0, 30, 0);
        parent.add(this.light);
        
        this.isActive = false;
    }
    
    update() {
        if (!this.isActive && Math.random() < this.probability) {
            this.flash();
        }
    }
    
    flash() {
        this.isActive = true;
        this.light.intensity = this.minIntensity + Math.random() * (this.maxIntensity - this.minIntensity);
        
        const duration = this.minDuration + Math.random() * (this.maxDuration - this.minDuration);
        
        setTimeout(() => {
            this.light.intensity = 0;
            this.isActive = false;
        }, duration);
    }
    
    dispose() {
        this.light.parent?.remove(this.light);
    }
}

/**
 * Sistema de partículas genérico
 */
export class ParticleSystem {
    constructor(parent, options = {}) {
        this.count = options.count || 100;
        this.color = options.color || 0xffffff;
        this.size = options.size || 0.1;
        this.spread = options.spread || 10;
        this.blending = options.blending || THREE.AdditiveBlending;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        
        for (let i = 0; i < this.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * this.spread;
            positions[i * 3 + 1] = Math.random() * this.spread;
            positions[i * 3 + 2] = (Math.random() - 0.5) * this.spread;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.color,
            size: this.size,
            transparent: true,
            opacity: options.opacity || 0.8,
            blending: this.blending
        });
        
        this.points = new THREE.Points(geometry, material);
        this.positions = positions;
        parent.add(this.points);
    }
    
    update(callback) {
        if (callback) {
            for (let i = 0; i < this.count; i++) {
                callback(i, this.positions, this.count);
            }
            this.points.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    setPosition(x, y, z) {
        this.points.position.set(x, y, z);
    }
    
    dispose() {
        this.points.geometry.dispose();
        this.points.material.dispose();
    }
}

/**
 * Sistema de burbujas (para cueva)
 */
export class BubbleSystem extends ParticleSystem {
    constructor(parent, count = 50) {
        super(parent, {
            count,
            color: 0xaaddff,
            size: 0.15,
            spread: 30,
            opacity: 0.5
        });
        
        this.speeds = [];
        for (let i = 0; i < this.count; i++) {
            this.speeds.push(0.01 + Math.random() * 0.03);
        }
    }
    
    update() {
        super.update((i, positions) => {
            positions[i * 3 + 1] += this.speeds[i];
            
            // Reset si sube demasiado
            if (positions[i * 3 + 1] > 15) {
                positions[i * 3 + 1] = -1;
                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
        });
    }
}

/**
 * Sistema de chispas doradas (para tesoro)
 */
export class SparkleSystem extends ParticleSystem {
    constructor(parent, count = 30) {
        super(parent, {
            count,
            color: 0xffd700,
            size: 0.2,
            spread: 5,
            opacity: 0.9
        });
        
        this.basePositions = [];
        for (let i = 0; i < this.count; i++) {
            this.basePositions.push({
                x: (Math.random() - 0.5) * 5,
                y: Math.random() * 3,
                z: (Math.random() - 0.5) * 5
            });
        }
    }
    
    update(time) {
        super.update((i, positions) => {
            const base = this.basePositions[i];
            positions[i * 3] = base.x + Math.sin(time * 2 + i) * 0.2;
            positions[i * 3 + 1] = base.y + Math.sin(time * 3 + i * 0.5) * 0.3;
            positions[i * 3 + 2] = base.z + Math.cos(time * 2 + i) * 0.2;
        });
    }
}

/**
 * Crea agua animada
 */
export function createWater(width, height, color = 0x001f3f, options = {}) {
    const geometry = new THREE.PlaneGeometry(width, height, options.segments || 64, options.segments || 64);
    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: options.roughness || 0.1,
        metalness: options.metalness || 0.8,
        transparent: true,
        opacity: options.opacity || 0.9,
        emissive: options.emissive || 0x001122,
        emissiveIntensity: options.emissiveIntensity || 0.2
    });
    
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;
    
    return water;
}

/**
 * Anima las olas del agua
 */
export function animateWater(water, time, amplitude = 0.5) {
    if (!water.geometry || !water.geometry.attributes.position) return;
    
    const positions = water.geometry.attributes.position.array;
    const segments = water.geometry.parameters.widthSegments || 64;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.1 + time) * amplitude + 
                          Math.sin(z * 0.1 + time * 0.8) * amplitude * 0.5;
    }
    
    water.geometry.attributes.position.needsUpdate = true;
}
