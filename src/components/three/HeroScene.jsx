import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleField from './ParticleField';
import GeometryBackground from './GeometryBackground';
import GlowOrbs from './GlowOrbs';
import useThreePerformance from './useThreePerformance';

/**
 * HeroScene Component
 * Compositor that combines all Three.js elements for the hero section
 * Includes performance optimization and mouse tracking
 */
const HeroScene = () => {
  const { particleCount, geometryCount, bloomEnabled, dpr } = useThreePerformance();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ 
          position: 'absolute', 
          inset: 0,
          pointerEvents: 'none'
        }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: 'high-performance' 
        }}
        dpr={dpr}
      >
        <Suspense fallback={null}>
          {/* Ambient light for subtle illumination */}
          <ambientLight intensity={0.1} />
          
          {/* Glow orbs - background layer */}
          <GlowOrbs mouse={mouse} />
          
          {/* Particle field - mid layer */}
          <ParticleField count={particleCount} mouse={mouse} />
          
          {/* Geometric shapes - foreground layer */}
          <GeometryBackground count={geometryCount} />
          
          {/* Post-processing effects */}
          {bloomEnabled && (
            <EffectComposer>
              <Bloom
                intensity={0.4}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.9}
                height={300}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
