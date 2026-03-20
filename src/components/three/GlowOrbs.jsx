import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GlowOrbs Component
 * Large soft glow orbs creating ambient colored light atmosphere
 * 
 * @param {Object} props
 * @param {Object} props.mouse - Mouse position for interaction
 */
const GlowOrbs = React.memo(({ mouse = { x: 0, y: 0 } }) => {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Update mouse reference
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  // Orb configurations
  const orbs = useMemo(() => [
    {
      color: new THREE.Color(0x1D4ED8), // Deep Blue
      position: [-30, 20, -50],
      size: 80,
      opacity: 0.5,
      speed: 0.3,
      offset: 0,
      scaleSpeed: 0.4,
      scaleOffset: 0
    },
    {
      color: new THREE.Color(0x0891B2), // Cyan
      position: [35, -15, -60],
      size: 90,
      opacity: 0.45,
      speed: 0.25,
      offset: Math.PI / 2,
      scaleSpeed: 0.35,
      scaleOffset: Math.PI
    },
    {
      color: new THREE.Color(0x4F46E5), // Purple
      position: [0, -25, -70],
      size: 100,
      opacity: 0.4,
      speed: 0.2,
      offset: Math.PI,
      scaleSpeed: 0.3,
      scaleOffset: Math.PI / 2
    },
    {
      color: new THREE.Color(0x3B82F6), // Electric Blue
      position: [25, 30, -55],
      size: 75,
      opacity: 0.55,
      speed: 0.35,
      offset: Math.PI * 1.5,
      scaleSpeed: 0.45,
      scaleOffset: Math.PI * 1.5
    },
    {
      color: new THREE.Color(0x06B6D4), // Bright Cyan
      position: [-20, -10, -65],
      size: 85,
      opacity: 0.48,
      speed: 0.28,
      offset: Math.PI / 4,
      scaleSpeed: 0.38,
      scaleOffset: Math.PI / 4
    },
    {
      color: new THREE.Color(0x2563EB), // Royal Blue
      position: [15, 5, -75],
      size: 95,
      opacity: 0.42,
      speed: 0.22,
      offset: Math.PI * 1.25,
      scaleSpeed: 0.32,
      scaleOffset: Math.PI * 1.25
    }
  ], []);

  // Custom fragment shader for soft radial gradient
  const fragmentShader = `
    precision highp float;
    
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  const vertexShader = `
    precision highp float;
    
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    groupRef.current.children.forEach((mesh, index) => {
      const orb = orbs[index];
      if (!orb) return;
      
      // Elliptical drift animation
      const driftX = Math.sin(time * orb.speed + orb.offset) * 10;
      const driftY = Math.cos(time * orb.speed * 0.7 + orb.offset) * 8;
      
      mesh.position.x = orb.position[0] + driftX;
      mesh.position.y = orb.position[1] + driftY;
      
      // Scale pulsing
      const scale = 1 + Math.sin(time * orb.scaleSpeed + orb.scaleOffset) * 0.1;
      mesh.scale.set(scale, scale, 1);
      
      // Opacity breathing
      const opacityVariation = Math.sin(time * 0.5 + orb.offset) * 0.1;
      mesh.material.uniforms.uOpacity.value = orb.opacity + opacityVariation;
      
      // Mouse interaction - gentle drift toward mouse
      const targetX = mouseRef.current.x * 5;
      const targetY = mouseRef.current.y * 5;
      
      mesh.position.x += (targetX - (mesh.position.x - orb.position[0])) * 0.05;
      mesh.position.y += (targetY - (mesh.position.y - orb.position[1])) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, index) => (
        <mesh
          key={index}
          position={orb.position}
        >
          <planeGeometry args={[orb.size, orb.size]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              uColor: { value: orb.color },
              uOpacity: { value: orb.opacity }
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
});

GlowOrbs.displayName = 'GlowOrbs';

export default GlowOrbs;
