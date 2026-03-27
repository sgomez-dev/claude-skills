---
description: Generate a 3D component (React Three Fiber, Three.js, Babylon.js) with types, animations, and controls
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a complete 3D component ready for production.

Steps:
1. **Detect project context**
   - Identify 3D library: React Three Fiber (@react-three/fiber), vanilla Three.js, Babylon.js, or A-Frame
   - If none detected, ask the user which to use (default: React Three Fiber + @react-three/drei)
   - Detect TypeScript vs JavaScript
   - Identify existing 3D patterns, helpers, or abstractions in the project

2. **Parse the component request from:** `$ARGUMENTS`
   - Determine the type of 3D component:
     - **Geometry**: custom mesh, primitive shape, parametric surface, CSG boolean
     - **Scene**: complete scene with lighting, camera, environment
     - **Model**: GLTF/GLB loader with animations
     - **Effect**: post-processing, particles, shaders
     - **UI**: HTML overlay, Billboard, HUD elements in 3D space
     - **Animation**: animated object, transition, procedural motion
   - If ambiguous, ask before proceeding

3. **Generate the 3D component**

   **Component file**
   - TypeScript interfaces for props (geometry params, material options, animation config)
   - Component implementation following detected library patterns:

   *React Three Fiber:*
   - Functional component with `useFrame`, `useThree`, `useRef` hooks
   - Proper mesh/group hierarchy
   - `@react-three/drei` helpers where useful (OrbitControls, Environment, useGLTF, Text3D, Float, MeshTransmissionMaterial, etc.)
   - Forward ref support for parent scene access
   - `useFrame` with delta time for frame-rate independent animations

   *Vanilla Three.js:*
   - Class or factory function pattern
   - Proper dispose/cleanup of geometries, materials, and textures
   - Animation loop integration via `requestAnimationFrame` or clock
   - Event listener cleanup

   *Babylon.js:*
   - Scene component pattern with proper engine integration
   - Material and mesh disposal

   **Material & appearance**
   - Sensible default material (MeshStandardMaterial or MeshPhysicalMaterial)
   - Configurable via props: color, metalness, roughness, opacity, wireframe
   - Support for textures if applicable (map, normalMap, roughnessMap)
   - Environment mapping consideration for reflective materials

   **Lighting (if scene-level component)**
   - Ambient + directional/point light setup
   - Shadows configuration (castShadow, receiveShadow)
   - Environment preset or custom HDRI support

   **Animation**
   - `useFrame` / `requestAnimationFrame` based animation with delta time
   - Configurable: speed, amplitude, easing, autoplay, loop
   - Pause/resume support
   - Spring-based animations via `@react-spring/three` if the project uses it

   **Interactivity**
   - Pointer events: onClick, onPointerOver, onPointerOut, onPointerMove
   - Hover effects (scale, color, glow)
   - Drag support via `@use-gesture/react` if applicable
   - Cursor change on interactive elements

   **Performance**
   - `useMemo` for geometries and materials that don't change
   - Instancing (`<Instances>`) for repeated objects
   - Level of detail (`<Lod>`) for complex meshes
   - `dispose={null}` considerations for shared resources
   - Frustum culling awareness

4. **Generate supporting files**

   **Types file** (if project separates types)
   - Props interface with JSDoc comments
   - Animation config type
   - Material config type
   - Event callback types

   **Tests**
   - Render test: component mounts inside `<Canvas>` without errors
   - Props test: geometry/material responds to prop changes
   - Snapshot test of the scene graph (optional)
   - Mock `useFrame` and `useThree` for unit testing

   **Story (if Storybook exists)**
   - Wrap in `<Canvas>` decorator with OrbitControls
   - Default story with sensible props
   - Variant stories (wireframe, different materials, animated vs static)
   - Controls for interactive prop editing (color, scale, speed)

5. **Canvas wrapper (if needed)**
   - If this is the first 3D component in the project, generate a reusable `<Scene3D>` or `<Canvas3D>` wrapper with:
     - `<Canvas>` with sensible defaults (shadows, dpr, camera position)
     - `<Suspense>` fallback for async loading
     - OrbitControls (optional, configurable)
     - Default environment/lighting
     - Error boundary for WebGL context loss
   - If a wrapper already exists, use it

6. **Place files and finalize**
   - Place in correct directory following project structure
   - Export from barrel file if one exists
   - List any dependencies that need to be installed (e.g., `@react-three/fiber`, `@react-three/drei`, `three`)
   - Warn if `three` peer dependency is missing

Component: $ARGUMENTS
