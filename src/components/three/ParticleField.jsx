import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParticleField Component
 * Creates a dense field of particles drifting slowly for immersive background
 * 
 * @param {Object} props
 * @param {number} props.count - Number of particles (default: 3000)
 * @param {Object} props.mouse - Mouse position for parallax effect
 */
const ParticleField = React.memo(({ count = 3000, mouse = { x: 0, y: 0 } }) => {
  const pointsRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Update mouse reference
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  // Generate particle positions, sizes, and colors
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    // Color palette
    const colorPalette = [
      new THREE.Color(0x3B82F6), // Blue
      new THREE.Color(0x06B6D4), // Cyan
      new THREE.Color(0xE2E8F0), // White
    ];

    // Distribute particles in a sphere
    const radius = 150;
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Cubic root for uniform distribution
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Two particle sizes: 70% small, 30% medium
      sizes[i] = Math.random() < 0.7 ? 0.8 : 1.4;
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, sizes, colors };
  }, [count]);

  // Custom vertex shader
  const vertexShader = `
    precision highp float;
    
    attribute float size;
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      vColor = color;
      
      // Twinkle effect based on position
      float twinkle = sin(position.x * 0.1 + position.y * 0.1 + position.z * 0.1) * 0.5 + 0.5;
      vOpacity = 0.3 + twinkle * 0.7;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Custom fragment shader
  const fragmentShader = `
    precision highp float;
    
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      // Create circular particles with soft edges
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      // Soft edge
      float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slow rotation of entire particle system
    pointsRef.current.rotation.y = time * 0.0003;
    pointsRef.current.rotation.x = time * 0.0002;
    
    // Mouse parallax effect
    const targetX = mouseRef.current.x * 0.02;
    const targetY = mouseRef.current.y * 0.02;
    
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        pointsRef.current.material.dispose();
      }
    };
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
});

ParticleField.displayName = 'ParticleField';

export default ParticleField;
