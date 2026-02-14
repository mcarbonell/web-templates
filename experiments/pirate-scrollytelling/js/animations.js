/**
 * Sistema de animaciones para El Último Pirata
 * Gestión de AnimationMixer y transiciones de animaciones
 */

import * as THREE from 'three';

/**
 * Gestor de animaciones para un personaje
 */
export class CharacterAnimator {
    constructor(model, animations = []) {
        this.model = model;
        this.animations = animations;
        this.mixer = new THREE.AnimationMixer(model);
        this.currentAction = null;
        this.actions = new Map();
        
        // Precargar todas las acciones
        animations.forEach(clip => {
            this.actions.set(clip.name, this.mixer.clipAction(clip));
        });
    }
    
    /**
     * Reproduce una animación por nombre
     */
    play(animName, options = {}) {
        const action = this.actions.get(animName);
        if (!action) {
            console.warn(`Animación "${animName}" no encontrada`);
            return;
        }
        
        const loop = options.loop !== false;
        const crossFade = options.crossFade || 0.3;
        const timeScale = options.timeScale || 1;
        
        action.timeScale = timeScale;
        
        if (loop) {
            action.setLoop(THREE.LoopRepeat);
        } else {
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
        }
        
        // Crossfade desde animación anterior
        if (this.currentAction && this.currentAction !== action) {
            this.currentAction.fadeOut(crossFade);
        }
        
        action.reset();
        action.fadeIn(crossFade);
        action.play();
        
        this.currentAction = action;
    }
    
    /**
     * Detiene la animación actual
     */
    stop(fadeDuration = 0.3) {
        if (this.currentAction) {
            this.currentAction.fadeOut(fadeDuration);
            this.currentAction = null;
        }
    }
    
    /**
     * Actualiza el mixer
     */
    update(delta) {
        this.mixer.update(delta);
    }
    
    /**
     * Obtiene nombres de animaciones disponibles
     */
    getAnimationNames() {
        return Array.from(this.actions.keys());
    }
    
    /**
     * Limpia recursos
     */
    dispose() {
        this.mixer.stopAllAction();
        this.actions.clear();
    }
}

/**
 * Gestor de animaciones para múltiples personajes
 */
export class AnimationManager {
    constructor() {
        this.animators = new Map();
        this.clock = new THREE.Clock();
    }
    
    /**
     * Registra un personaje con sus animaciones
     */
    register(name, model, animations = []) {
        const animator = new CharacterAnimator(model, animations);
        this.animators.set(name, animator);
        return animator;
    }
    
    /**
     * Obtiene el animator de un personaje
     */
    get(name) {
        return this.animators.get(name);
    }
    
    /**
     * Reproduce animación en un personaje específico
     */
    play(characterName, animName, options = {}) {
        const animator = this.animators.get(characterName);
        if (animator) {
            animator.play(animName, options);
        }
    }
    
    /**
     * Actualiza todos los mixers
     */
    update() {
        const delta = this.clock.getDelta();
        this.animators.forEach(animator => animator.update(delta));
    }
    
    /**
     * Limpia todos los recursos
     */
    dispose() {
        this.animators.forEach(animator => animator.dispose());
        this.animators.clear();
    }
}

/**
 * Carga animaciones de un modelo GLTF y las devuelve
 */
export function extractAnimations(gltf) {
    return gltf.animations || [];
}

/**
 * Aplica animación Idle a un personaje si existe
 */
export function playIdleAnimation(model, animations, mixer) {
    if (!animations || animations.length === 0) return null;
    
    const idleAnim = animations.find(a => 
        a.name.toLowerCase().includes('idle')
    );
    
    if (idleAnim) {
        const action = mixer.clipAction(idleAnim);
        action.play();
        return action;
    }
    
    // Si no hay Idle, reproducir la primera animación
    const action = mixer.clipAction(animations[0]);
    action.play();
    return action;
}

/**
 * Crea un sistema de animación simple para un modelo
 */
export function createSimpleAnimator(model, animations) {
    if (!animations || animations.length === 0) {
        return { mixer: null, play: () => {}, update: () => {} };
    }
    
    const mixer = new THREE.AnimationMixer(model);
    let currentAction = null;
    
    return {
        mixer,
        play(animNameOrIndex, loop = true) {
            let clip;
            if (typeof animNameOrIndex === 'number') {
                clip = animations[animNameOrIndex];
            } else {
                clip = animations.find(a => a.name === animNameOrIndex);
            }
            
            if (!clip) return;
            
            const action = mixer.clipAction(clip);
            
            if (loop) {
                action.setLoop(THREE.LoopRepeat);
            } else {
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
            }
            
            if (currentAction && currentAction !== action) {
                currentAction.fadeOut(0.3);
            }
            
            action.reset();
            action.fadeIn(0.3);
            action.play();
            currentAction = action;
        },
        update(delta) {
            mixer.update(delta);
        }
    };
}
