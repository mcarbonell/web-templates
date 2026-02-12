# Walkthrough: Luna's First Flight 3D

We have successfully transitioned the narrative of "Luna's First Flight" into a rich, immersive 3D scrollytelling experience.

## Key Accomplishments

### 1. Immersive 3D Environment
- Created a low-poly midnight forest using Three.js.
- Implemented **InstancedMesh** for optimized rendering of 5,000 blades of grass and 800 colorful flowers.
- Designed an atmospheric sky with a shimmering starfield and depth-based fog.

### 2. Character Logic & Animation
- **Luna**: A multi-sphere glowing creature that follows the camera with a "floaty" drift animation.
- **Rabbit**: A low-poly model with dynamic behaviors. It "shivers" when lonely and "hops" joyfully when guided by Luna.
- **Proximity Effects**: Animations are triggered based on the camera's progress along the narrative spline.

### 3. Visual Storytelling Techniques
- **Spline Camera**: The camera follows a Catmull-Rom spline, providing smooth transitions between story beats.
- **Post-Processing (Bloom)**: Used `UnrealBloomPass` to create a magical glowing effect for Luna that intensifies as she finds her "inner warmth."
- **Glassmorphism UI**: Narrative cards use a frosted glass effect that fades in/out in sync with the 3D scenes.
- **Dynamic Lighting**: Luna's light intensity and the environment's bloom are tied directly to the scroll progress.

## Interactive Experience

The user mark the pace of the story by scrolling.
- **0-20%**: Introduction to the silent meadow.
- **20-50%**: Discovery of the lost rabbit.
- **50-70%**: The moment of awakening (Luna's first glow).
- **70-100%**: The journey home and the happy ending at the burrow.

## Final Result
You can find the implementation in:
[luna_3d.html](./experiments/luna_3d.html)

> [!TIP]
> Use the mouse wheel or touch-scroll slowly to appreciate the micro-animations of the rabbit and the soft glow transitions.
