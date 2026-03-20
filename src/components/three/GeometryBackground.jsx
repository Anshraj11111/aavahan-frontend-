import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GeometryBackground Component
 * Slowly rotating wireframe geometric shapes for depth and futuristic aesthetic
 * 
 * @param {Object} props
 * @param {number} props.count - Number of geometry shapes (default: 8, reduced on mobile)
 */
const GeometryBackground = React.memo(({ count = 8 }) => {
  const groupRef = useRef();

  // Generate geometry configurations
  const geometries = useMemo(() => {
    const configs = [];
    
    // 3-5 Icosahedron geometries (different sizes)
    const icosaCount = Math.min(5, Math.ceil(count * 0.625));
    for (let i = 0; i < icosaCount; i++) {
      configs.push({
        type: 'icosahedron',
        size: 5 + Math.random() * 10,
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          -30 - Math.random() * 70
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004
        ],
        floatSpeed: 0.5 + Math.random() * 1.5,
        floatOffset: Math.random() * Math.PI * 2,
        scaleSpeed: 0.3 + Math.random() * 0.5,
        scaleOffset: Math.random() * Math.PI * 2,
        opacity: 0.06 + Math.random() * 0.09,
        color: Math.random() > 0.5 ? 0x1E40AF : 0x0E7490
      });
    }
    
    // 2-3 Octahedron geometries
    const octaCount = Math.min(3, Math.ceil(count * 0.25));
    for (let i = 0; i < octaCount; i++) {
      configs.push({
        type: 'octahedron',
        size: 8 + Math.random() * 7,
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          -20 - Math.random() * 60
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ],
        floatSpeed: 0.6 + Math.random() * 1.2,
        floatOffset: Math.random() * Math.PI * 2,
        scaleSpeed: 0.4 + Math.random() * 0.4,
        scaleOffset: Math.random() * Math.PI * 2,
        opacity: 0.08 + Math.random() * 0.07,
        color: Math.random() > 0.5 ? 0x1E40AF : 0x0E7490
      });
    }
    
    // 2 Torus geometries
    if (count >= 5) {
      for (let i = 0; i < 2; i++) {
        configs.push({
          type: 'torus',
          size: 12 + Math.random() * 8,
          position: [
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            -40 - Math.random() * 50
          ],
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          rotationSpeed: [
            (Math.random() - 0.5) * 0.003,
            (Math.random() - 0.5) * 0.003,
            (Math.random() - 0.5) * 0.003
          ],
          floatSpeed: 0.4 + Math.random() * 1.0,
          floatOffset: Math.random() * Math.PI * 2,
          scaleSpeed: 0.2 + Math.random() * 0.3,
          scaleOffset: Math.random() * Math.PI * 2,
          opacity: 0.07 + Math.random() * 0.08,
          color: Math.random() > 0.5 ? 0x1E40AF : 0x0E7490
        });
      }
    }
    
    // 1 large Icosahedron cage (if count allows)
    if (count >= 8) {
      configs.push({
        type: 'icosahedron',
        size: 40,
        position: [0, 0, -80],
        rotation: [0, 0, 0],
        rotationSpeed: [0.0001, 0.0002, 0.0001],
        floatSpeed: 0,
        floatOffset: 0,
        scaleSpeed: 0,
        scaleOffset: 0,
        opacity: 0.03,
        color: 0x1E40AF
      });
    }
    
    return configs;
  }, [count]);

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    groupRef.current.children.forEach((mesh, index) => {
      const config = geometries[index];
      if (!config) return;
      
      // Rotation
      mesh.rotation.x += config.rotationSpeed[0];
      mesh.rotation.y += config.rotationSpeed[1];
      mesh.rotation.z += config.rotationSpeed[2];
      
      // Floating (sin-based y oscillation)
      if (config.floatSpeed > 0) {
        mesh.position.y = config.position[1] + Math.sin(time * config.floatSpeed + config.floatOffset) * 5;
      }
      
      // Scale breathing
      if (config.scaleSpeed > 0) {
        const scale = 1 + Math.sin(time * config.scaleSpeed + config.scaleOffset) * 0.02;
        mesh.scale.set(scale, scale, scale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((config, index) => {
        let geometry;
        
        switch (config.type) {
          case 'icosahedron':
            geometry = <icosahedronGeometry args={[config.size, 1]} />;
            break;
          case 'octahedron':
            geometry = <octahedronGeometry args={[config.size]} />;
            break;
          case 'torus':
            geometry = <torusGeometry args={[config.size, config.size * 0.3, 16, 32]} />;
            break;
          default:
            geometry = <icosahedronGeometry args={[config.size, 1]} />;
        }
        
        return (
          <mesh
            key={index}
            position={config.position}
            rotation={config.rotation}
          >
            {geometry}
            <meshBasicMaterial
              color={config.color}
              wireframe
              transparent
              opacity={config.opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
});

GeometryBackground.displayName = 'GeometryBackground';

export default GeometryBackground;
