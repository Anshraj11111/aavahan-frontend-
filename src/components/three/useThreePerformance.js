import { useState, useEffect } from 'react';

/**
 * Custom hook for adaptive Three.js performance based on device capability
 * Detects device specs and measures FPS to determine optimal quality settings
 * 
 * @returns {Object} Performance settings and device info
 */
export const useThreePerformance = () => {
  const [quality, setQuality] = useState('medium');
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState({
    particleCount: 2500,
    geometryCount: 5,
    bloomEnabled: true,
    dpr: [1, 1.5]
  });

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768;
    };

    const mobile = checkMobile();
    setIsMobile(mobile);

    // Detect device capabilities
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Initial quality estimate based on hardware
    let estimatedQuality = 'medium';
    
    if (mobile) {
      estimatedQuality = 'low';
    } else if (hardwareConcurrency >= 8 && devicePixelRatio <= 2) {
      estimatedQuality = 'high';
    } else if (hardwareConcurrency >= 4) {
      estimatedQuality = 'medium';
    } else {
      estimatedQuality = 'low';
    }

    // Measure FPS over first 60 frames
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsSum = 0;
    let animationFrameId;

    const measureFPS = (currentTime) => {
      frameCount++;
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        fpsSum += currentFPS;
      }
      
      lastTime = currentTime;

      // After 60 frames, calculate average FPS and set quality
      if (frameCount >= 60) {
        const avgFPS = fpsSum / frameCount;
        
        let finalQuality;
        if (avgFPS > 50) {
          finalQuality = 'high';
        } else if (avgFPS >= 30) {
          finalQuality = 'medium';
        } else {
          finalQuality = 'low';
        }

        // On mobile, cap at medium quality
        if (mobile && finalQuality === 'high') {
          finalQuality = 'medium';
        }

        setQuality(finalQuality);
        
        // Set quality-specific settings
        const qualitySettings = getQualitySettings(finalQuality, mobile);
        setSettings(qualitySettings);
        
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(measureFPS);
      }
    };

    // Start FPS measurement
    animationFrameId = requestAnimationFrame(measureFPS);

    // Set initial settings based on estimate
    const initialSettings = getQualitySettings(estimatedQuality, mobile);
    setSettings(initialSettings);
    setQuality(estimatedQuality);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return {
    quality,
    isMobile,
    settings,
    particleCount: settings.particleCount,
    geometryCount: settings.geometryCount,
    bloomEnabled: settings.bloomEnabled,
    dpr: settings.dpr
  };
};

/**
 * Get quality-specific settings
 * @param {string} quality - Quality level: 'high', 'medium', or 'low'
 * @param {boolean} mobile - Is mobile device
 * @returns {Object} Quality settings
 */
const getQualitySettings = (quality, mobile) => {
  // Mobile overrides
  if (mobile) {
    return {
      particleCount: 800,
      geometryCount: 3,
      bloomEnabled: false,
      dpr: [1, 1]
    };
  }

  // Desktop quality settings
  switch (quality) {
    case 'high':
      return {
        particleCount: 5000,
        geometryCount: 8,
        bloomEnabled: true,
        dpr: [1, 2]
      };
    case 'medium':
      return {
        particleCount: 2500,
        geometryCount: 5,
        bloomEnabled: true,
        dpr: [1, 1.5]
      };
    case 'low':
      return {
        particleCount: 1000,
        geometryCount: 3,
        bloomEnabled: false,
        dpr: [1, 1]
      };
    default:
      return {
        particleCount: 2500,
        geometryCount: 5,
        bloomEnabled: true,
        dpr: [1, 1.5]
      };
  }
};

export default useThreePerformance;
