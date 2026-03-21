import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not available');
        return;
      }
    } catch (error) {
      console.warn('Failed to get canvas context:', error);
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Optimized particle system with responsive count based on device
    const particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 60; // Reduced count on mobile for better performance
    const connectionDistance = isMobile ? 80 : 120; // Reduced connection distance on mobile

    class Particle {
      constructor(type = 'normal') {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.size = Math.max(1, Math.random() * 4 + 1); // Ensure minimum size
        this.opacity = Math.max(0.1, Math.random() * 0.8 + 0.2);
        this.type = type;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.trail = [];
        this.maxTrailLength = 8;
        
        // Enhanced particle types with different behaviors
        if (type === 'glow') {
          this.color = `rgba(59, 130, 246, ${this.opacity})`;
          this.glowSize = Math.max(2, this.size * 4); // Ensure minimum glow size
          this.energy = Math.random() * 100;
        } else if (type === 'spark') {
          this.color = `rgba(6, 182, 212, ${this.opacity})`;
          this.sparkle = true;
          this.sparklePhase = Math.random() * Math.PI * 2;
        } else if (type === 'quantum') {
          this.color = `rgba(129, 140, 248, ${this.opacity})`;
          this.quantumPhase = Math.random() * Math.PI * 2;
          this.quantumSpeed = 0.05;
        } else {
          this.color = `rgba(${Math.random() > 0.5 ? '129, 140, 248' : '34, 197, 94'}, ${this.opacity})`;
        }
      }

      update() {
        // Enhanced mouse attraction with physics
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 250) {
          const force = (250 - distance) / 250;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 0.02;
          this.vy += Math.sin(angle) * force * 0.02;
          
          // Add energy to glow particles
          if (this.type === 'glow') {
            this.energy = Math.min(this.energy + force * 10, 100);
          }
        }

        // Update trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }

        // Type-specific behaviors
        if (this.type === 'quantum') {
          this.quantumPhase += this.quantumSpeed;
          this.vx += Math.sin(this.quantumPhase) * 0.01;
          this.vy += Math.cos(this.quantumPhase) * 0.01;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Enhanced boundary collision with energy transfer
        if (this.x < 0 || this.x > canvas.width) {
          this.vx *= -0.7;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
          if (this.type === 'glow') this.energy += 20;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy *= -0.7;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
          if (this.type === 'glow') this.energy += 20;
        }

        // Enhanced friction with type variations
        const friction = this.type === 'quantum' ? 0.995 : 0.98;
        this.vx *= friction;
        this.vy *= friction;

        // Pulse animation with energy influence
        this.pulse += this.pulseSpeed;
        const energyMultiplier = this.type === 'glow' ? (1 + this.energy / 100) : 1;
        this.currentOpacity = Math.max(0.1, Math.min(1, this.opacity + Math.sin(this.pulse) * 0.4 * energyMultiplier));
        
        // Ensure size stays positive and valid
        this.size = Math.max(0.5, Math.abs(this.size));
        if (this.glowSize) this.glowSize = Math.max(2, Math.abs(this.glowSize));
        
        // Energy decay
        if (this.type === 'glow') {
          this.energy = Math.max(0, this.energy * 0.99);
        }
      }

      draw() {
        ctx.save();
        
        // Ensure valid coordinates and sizes
        if (!isFinite(this.x) || !isFinite(this.y) || !isFinite(this.size) || this.size <= 0) {
          ctx.restore();
          return;
        }
        
        // Ensure all size-related values are positive
        this.size = Math.max(0.5, Math.abs(this.size));
        if (this.glowSize) this.glowSize = Math.max(1, Math.abs(this.glowSize));
        if (this.sparklePhase) this.sparklePhase = Math.abs(this.sparklePhase || 0);
        
        // Draw trail for moving particles
        if (this.trail.length > 1 && (this.vx * this.vx + this.vy * this.vy) > 0.1) {
          ctx.strokeStyle = this.color.replace(/[\d\.]+\)$/g, '0.1)');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y);
          for (let i = 1; i < this.trail.length; i++) {
            const alpha = i / this.trail.length * 0.3;
            ctx.strokeStyle = this.color.replace(/[\d\.]+\)$/g, `${alpha})`);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          ctx.stroke();
        }
        
        if (this.type === 'glow') {
          // Enhanced glow effect with energy
          const glowIntensity = Math.max(0.1, 1 + this.energy / 50);
          const glowRadius = Math.max(1, Math.abs(this.glowSize * glowIntensity));
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, glowRadius
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(0.5, this.color.replace(/[\d\.]+\)$/g, '0.3)'));
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main particle with enhanced effects
        ctx.globalAlpha = Math.max(0, Math.min(1, this.currentOpacity || this.opacity));
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        if (this.type === 'quantum') {
          // Quantum particle with phase shifting
          const phaseSize = Math.max(0.5, Math.abs(this.size + Math.sin(this.quantumPhase || 0) * 2));
          ctx.arc(this.x, this.y, phaseSize, 0, Math.PI * 2);
        } else {
          ctx.arc(this.x, this.y, Math.max(0.5, Math.abs(this.size)), 0, Math.PI * 2);
        }
        ctx.fill();
        
        if (this.sparkle) {
          // Enhanced sparkle effect
          this.sparklePhase = (this.sparklePhase || 0) + 0.1;
          const sparkleSize = Math.max(1, Math.abs(this.size * (2 + Math.sin(this.sparklePhase))));
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.x - sparkleSize, this.y);
          ctx.lineTo(this.x + sparkleSize, this.y);
          ctx.moveTo(this.x, this.y - sparkleSize);
          ctx.lineTo(this.x, this.y + sparkleSize);
          // Diagonal sparkles
          ctx.moveTo(this.x - sparkleSize * 0.7, this.y - sparkleSize * 0.7);
          ctx.lineTo(this.x + sparkleSize * 0.7, this.y + sparkleSize * 0.7);
          ctx.moveTo(this.x - sparkleSize * 0.7, this.y + sparkleSize * 0.7);
          ctx.lineTo(this.x + sparkleSize * 0.7, this.y - sparkleSize * 0.7);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }

    // Initialize particles with enhanced distribution
    for (let i = 0; i < particleCount; i++) {
      let type = 'normal';
      if (i % 8 === 0) type = 'glow';
      if (i % 12 === 0) type = 'spark';
      if (i % 15 === 0) type = 'quantum';
      particles.push(new Particle(type));
    }

    particlesRef.current = particles;

    // Enhanced mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop with advanced effects
    const animate = () => {
      try {
        // Create advanced trailing effect with multiple layers
        ctx.fillStyle = 'rgba(3, 7, 18, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add enhanced grid pattern with glow
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Add grid intersection glow points
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        for (let x = 0; x < canvas.width; x += gridSize * 2) {
          for (let y = 0; y < canvas.height; y += gridSize * 2) {
            if (Math.random() < 0.1) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        particles.forEach(particle => {
          try {
            particle.update();
            particle.draw();
          } catch (error) {
            console.warn('Particle error:', error);
            // Reset particle if it has invalid values
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.size = Math.max(1, Math.random() * 4 + 1);
            particle.vx = (Math.random() - 0.5) * 1.2;
            particle.vy = (Math.random() - 0.5) * 1.2;
            particle.opacity = Math.max(0.1, Math.random() * 0.8 + 0.2);
            if (particle.glowSize) particle.glowSize = Math.max(2, particle.size * 4);
          }
        });

        // Enhanced connections with dynamic properties
        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach(otherParticle => {
            try {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < connectionDistance && isFinite(distance) && distance > 0) {
                const opacity = Math.max(0, Math.min(0.4, (1 - distance / connectionDistance) * 0.4));
                
                // Dynamic connection colors based on particle types
                let connectionColor;
                if (particle.type === 'glow' || otherParticle.type === 'glow') {
                  connectionColor = `rgba(59, 130, 246, ${opacity})`;
                } else if (particle.type === 'quantum' || otherParticle.type === 'quantum') {
                  connectionColor = `rgba(129, 140, 248, ${opacity})`;
                } else {
                  connectionColor = `rgba(6, 182, 212, ${opacity})`;
                }
                
                // Enhanced gradient line with energy influence
                const gradient = ctx.createLinearGradient(
                  particle.x, particle.y, 
                  otherParticle.x, otherParticle.y
                );
                gradient.addColorStop(0, connectionColor);
                gradient.addColorStop(0.5, connectionColor.replace(/[\d\.]+\)$/g, `${opacity * 1.5})`));
                gradient.addColorStop(1, connectionColor);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = Math.max(0.5, opacity * 3);
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
                
                // Add connection pulse effect
                if (Math.random() < 0.01) {
                  const midX = (particle.x + otherParticle.x) / 2;
                  const midY = (particle.y + otherParticle.y) / 2;
                  const pulseGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 20);
                  pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                  pulseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                  ctx.fillStyle = pulseGradient;
                  ctx.beginPath();
                  ctx.arc(midX, midY, 10, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            } catch (error) {
              console.warn('Connection drawing error:', error);
            }
          });
        });
      } catch (error) {
        console.warn('Animation loop error:', error);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } catch (error) {
        console.warn('Resize error:', error);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Enhanced Canvas with multiple blend modes and better opacity */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Premium Space-themed Background Layers - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-900/30 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-900/40 to-transparent" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-900/20 to-transparent animate-pulse" style={{ animationDelay: '4s' }} />
      
      {/* Aurora Borealis Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.25) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(236, 72, 153, 0.25) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 50%, rgba(129, 140, 248, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.25) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.25) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
      
      {/* Nebula Clouds */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px]"
          animate={{
            x: ['-20%', '120%'],
            y: ['-10%', '110%'],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)'
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[100px]"
          animate={{
            x: ['120%', '-20%'],
            y: ['110%', '-10%'],
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5
          }}
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(34, 197, 94, 0.3) 50%, transparent 70%)'
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-[90px]"
          animate={{
            x: ['-50%', '-50%'],
            y: ['-50%', '-50%'],
            scale: [1, 1.6, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 10
          }}
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(249, 115, 22, 0.25) 50%, transparent 70%)'
          }}
        />
      </div>
      
      {/* Hexagonal Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
              <path d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z" 
                    stroke="rgba(59, 130, 246, 0.4)" 
                    strokeWidth="1" 
                    fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)"/>
        </svg>
      </div>
      
      {/* Energy Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{
              scale: [0, 3, 3],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: 'easeOut'
            }}
          >
            <div 
              className="w-[400px] h-[400px] rounded-full border-2"
              style={{
                borderColor: i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : 
                            i % 3 === 1 ? 'rgba(168, 85, 247, 0.4)' : 
                            'rgba(6, 182, 212, 0.4)',
                boxShadow: `0 0 40px ${i % 3 === 0 ? 'rgba(59, 130, 246, 0.3)' : 
                                       i % 3 === 1 ? 'rgba(168, 85, 247, 0.3)' : 
                                       'rgba(6, 182, 212, 0.3)'}`
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Enhanced Space Stars Field with Shooting Stars - Optimized for Performance */}
      <div className="absolute inset-0 opacity-60">
        {/* Desktop: 100 stars, Mobile: hidden via CSS for performance */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full hidden md:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: i % 20 === 0 ? '2px' : '1px',
              height: i % 20 === 0 ? '2px' : '1px',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: i % 20 === 0 ? [0.5, 2, 0.5] : [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Mobile: 40 stars only */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`mobile-${i}`}
            className="absolute bg-white rounded-full md:hidden"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '1px',
              height: '1px',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Shooting Stars - Desktop only */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute h-[2px] w-[100px] bg-gradient-to-r from-white via-blue-300 to-transparent hidden md:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              rotate: '-45deg'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{
              x: [0, 300],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 8 + Math.random() * 5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Enhanced Circuit Board Pattern with Animated Nodes */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Horizontal lines */}
              <path d="M20 20h160M20 60h160M20 100h160M20 140h160M20 180h160" 
                    stroke="rgba(59, 130, 246, 0.4)" 
                    strokeWidth="1.5"/>
              {/* Vertical lines */}
              <path d="M20 20v160M60 20v160M100 20v160M140 20v160M180 20v160" 
                    stroke="rgba(59, 130, 246, 0.4)" 
                    strokeWidth="1.5"/>
              {/* Connection nodes with glow */}
              <circle cx="60" cy="60" r="4" fill="rgba(6, 182, 212, 0.7)">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="140" cy="100" r="4" fill="rgba(129, 140, 248, 0.7)">
                <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="100" cy="140" r="4" fill="rgba(34, 197, 94, 0.7)">
                <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="180" cy="20" r="3" fill="rgba(236, 72, 153, 0.6)">
                <animate attributeName="r" values="2;4;2" dur="2.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="20" cy="180" r="3" fill="rgba(249, 115, 22, 0.6)">
                <animate attributeName="r" values="2;4;2" dur="2.8s" repeatCount="indefinite"/>
              </circle>
              {/* Microchip symbols */}
              <rect x="95" y="95" width="10" height="10" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
              <rect x="97" y="97" width="6" height="6" fill="rgba(59, 130, 246, 0.2)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* Enhanced Floating Tech Elements with More Variety - Optimized for Mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Desktop: 12 elements, Mobile: 6 elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i >= 6 ? 'hidden md:block' : ''}`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              rotate: 0,
              scale: 0.5,
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              rotate: 360,
              scale: [0.5, 1.3, 0.5],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <div className="relative">
              {i % 6 === 0 && (
                <div className="w-16 h-16 border-2 border-blue-400/40 rounded-lg backdrop-blur-sm relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/25 to-cyan-500/25 rounded-lg flex items-center justify-center">
                    <motion.div 
                      className="w-8 h-8 bg-blue-400/70 rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
              {i % 6 === 1 && (
                <div className="w-12 h-12 border-2 border-purple-400/40 rotate-45 backdrop-blur-sm">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/25 to-pink-500/25"/>
                </div>
              )}
              {i % 6 === 2 && (
                <div className="w-24 h-5 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full backdrop-blur-sm border border-cyan-400/30"/>
              )}
              {i % 6 === 3 && (
                <div className="w-14 h-14 rounded-full border-2 border-green-400/40 bg-gradient-to-br from-green-500/25 to-emerald-500/25 flex items-center justify-center backdrop-blur-sm">
                  <motion.div 
                    className="w-6 h-6 bg-green-400/70 rounded-full"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>
              )}
              {i % 6 === 4 && (
                <div className="w-10 h-10 border-2 border-orange-400/40 backdrop-blur-sm" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                  <div className="w-full h-full bg-gradient-to-br from-orange-500/25 to-red-500/25"/>
                </div>
              )}
              {i % 6 === 5 && (
                <div className="relative">
                  <div className="w-16 h-2 bg-gradient-to-r from-pink-500/40 to-purple-500/40 rounded-full backdrop-blur-sm"/>
                  <div className="absolute top-1/2 left-0 w-2 h-2 bg-pink-400/70 rounded-full -translate-y-1/2"/>
                  <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-400/70 rounded-full -translate-y-1/2"/>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced morphing blobs with multiple layers and physics - Reduced on mobile */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-morph liquid-morph" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '2s' }} />
      <div className="hidden md:block absolute top-3/4 left-1/3 w-72 h-72 bg-green-500/12 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '6s' }} />
      <div className="hidden md:block absolute bottom-1/3 left-2/3 w-88 h-88 bg-pink-500/15 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '8s' }} />
      <div className="hidden md:block absolute top-1/3 right-1/3 w-96 h-96 bg-orange-500/12 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '10s' }} />
      <div className="hidden md:block absolute bottom-1/2 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-morph liquid-morph" style={{ animationDelay: '12s' }} />
      
      {/* Continuous Background Text - Removed */}
      
      {/* Enhanced Premium Space Elements with More Details */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced Floating Planet with Rings */}
        <motion.div
          className="absolute top-1/4 left-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-600/40 backdrop-blur-sm border-2 border-blue-400/30 relative overflow-hidden shadow-2xl"
                 style={{ boxShadow: '0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 30px rgba(59, 130, 246, 0.3)' }}>
              <motion.div 
                className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400/50 to-cyan-400/50"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="absolute top-2 left-3 w-5 h-5 bg-white/70 rounded-full blur-sm"/>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-cyan-300/90 rounded-full"/>
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-200/80 rounded-full"/>
            </div>
            {/* Planet Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-12 border-2 border-blue-300/30 rounded-full"
                 style={{ transform: 'translate(-50%, -50%) rotateX(75deg)', transformStyle: 'preserve-3d' }}/>
          </div>
        </motion.div>
        
        {/* Enhanced Satellite with Solar Panels */}
        <motion.div
          className="absolute top-1/3 right-20"
          animate={{
            y: [0, 20, -10, 0],
            rotate: [0, -15, 15, 0],
            x: [0, -30, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        >
          <div className="relative">
            <div className="w-20 h-10 bg-gradient-to-r from-gray-600/50 to-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-400/40 shadow-lg"/>
            {/* Solar panels */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-blue-400/70 to-transparent"/>
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-1 bg-gradient-to-l from-blue-400/70 to-transparent"/>
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400/60"/>
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Enhanced Space Station with Details */}
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{
            y: [0, -25, 15, 0],
            rotate: [0, 10, -5, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4
          }}
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700/40 to-gray-900/40 backdrop-blur-sm border-2 border-gray-400/30 flex items-center justify-center shadow-2xl"
                 style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)' }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/50 to-cyan-500/50 flex items-center justify-center border border-blue-400/40">
                <motion.div 
                  className="w-8 h-8 bg-white/70 rounded-full"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            {/* Station arms */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-t from-blue-400/70 to-transparent"/>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-b from-blue-400/70 to-transparent"/>
            <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-10 h-1 bg-gradient-to-l from-blue-400/70 to-transparent"/>
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-10 h-1 bg-gradient-to-r from-blue-400/70 to-transparent"/>
          </div>
        </motion.div>
        
        {/* Enhanced Rocket with Flame */}
        <motion.div
          className="absolute top-2/3 right-1/4"
          animate={{
            y: [0, -40, 20, 0],
            x: [0, 25, -15, 0],
            rotate: [0, -8, 4, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6
          }}
        >
          <div className="relative">
            <div className="w-8 h-20 bg-gradient-to-t from-red-500/50 via-orange-500/50 to-yellow-500/50 rounded-t-full border border-orange-400/40 shadow-lg"/>
            <div className="w-8 h-5 bg-gradient-to-t from-gray-600/50 to-gray-400/50 rounded-b-sm border-x border-b border-gray-500/40"/>
            {/* Enhanced flame */}
            <motion.div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-t from-orange-400/90 via-red-400/70 to-transparent rounded-full"
              animate={{ 
                scaleY: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            {/* Rocket windows */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-300/80 rounded-full"/>
          </div>
        </motion.div>
        
        {/* Enhanced Asteroid with Craters */}
        <motion.div
          className="absolute bottom-1/3 right-10"
          animate={{
            y: [0, 30, -20, 0],
            x: [0, -40, 25, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 8
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600/50 to-gray-800/50 rounded-full relative overflow-hidden border-2 border-gray-500/40 shadow-xl">
            <div className="absolute top-2 left-2 w-3 h-3 bg-gray-400/70 rounded-full"/>
            <div className="absolute bottom-3 right-2 w-2 h-2 bg-gray-300/90 rounded-full"/>
            <div className="absolute top-4 right-3 w-2 h-2 bg-gray-500/80 rounded-full"/>
            <div className="absolute bottom-5 left-4 w-1.5 h-1.5 bg-gray-400/60 rounded-full"/>
          </div>
        </motion.div>
        
        {/* Additional Space Elements */}
        
        {/* UFO/Flying Saucer */}
        <motion.div
          className="absolute top-1/2 left-1/4"
          animate={{
            y: [0, -20, 10, 0],
            x: [0, 30, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 10
          }}
        >
          <div className="relative">
            <div className="w-20 h-6 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full backdrop-blur-sm border border-cyan-400/40 shadow-lg"/>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-gradient-to-b from-blue-400/50 to-cyan-400/50 rounded-t-full border-t border-blue-400/40"/>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-4 bg-gradient-to-b from-cyan-300/80 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Meteor */}
        <motion.div
          className="absolute top-1/4 right-1/3"
          animate={{
            x: [0, -300],
            y: [0, 200],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 15,
            ease: 'easeIn'
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-br from-orange-400/80 to-red-500/80 rounded-full shadow-lg"
                 style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.8)' }}/>
            <div className="absolute top-1/2 left-full w-24 h-[3px] bg-gradient-to-r from-orange-400/80 via-red-400/60 to-transparent"
                 style={{ transform: 'translateY(-50%)' }}/>
          </div>
        </motion.div>
        
        {/* Black Hole Effect */}
        <motion.div
          className="absolute bottom-1/4 right-1/3"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div className="relative w-32 h-32">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                  width: `${(i + 1) * 20}px`,
                  height: `${(i + 1) * 20}px`,
                  borderColor: `rgba(${i % 2 === 0 ? '59, 130, 246' : '168, 85, 247'}, ${0.4 - i * 0.05})`,
                }}
                animate={{
                  scale: [1, 0.8, 1],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-2 border-purple-400/50"
                 style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(168, 85, 247, 0.5)' }}/>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced scanning lines effect with multiple directions and colors */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"
          animate={{ y: ['-100%', '100vh'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}
        />
        <motion.div
          className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"
          animate={{ x: ['-100%', '100vw'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2 }}
          style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}
        />
        <motion.div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          animate={{ y: ['100vh', '-100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 4 }}
          style={{ boxShadow: '0 0 18px rgba(6, 182, 212, 0.6)' }}
        />
        <motion.div
          className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-green-400/40 to-transparent"
          animate={{ x: ['100vw', '-100%'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 6 }}
          style={{ boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)' }}
        />
        <motion.div
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"
          animate={{ y: ['-100%', '100vh'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 8 }}
          style={{ boxShadow: '0 0 25px rgba(236, 72, 153, 0.6)' }}
        />
        <motion.div
          className="absolute w-1 h-full bg-gradient-to-b from-transparent via-orange-400/50 to-transparent"
          animate={{ x: ['100vw', '-100%'] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 10 }}
          style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' }}
        />
      </div>

      {/* Optimized floating orbs - enhanced with more variety */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            transition={{
              duration: Math.random() * 25 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            <motion.div
              className="rounded-full blur-xl animate-pulse-glow"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              style={{
                width: `${Math.random() * 100 + 40}px`,
                height: `${Math.random() * 100 + 40}px`,
                background: `radial-gradient(circle, ${
                  ['rgba(59, 130, 246, 0.25)', 'rgba(6, 182, 212, 0.22)', 'rgba(129, 140, 248, 0.28)', 'rgba(34, 197, 94, 0.2)', 'rgba(168, 85, 247, 0.25)'][i % 5]
                } 0%, transparent 70%)`,
                boxShadow: `0 0 ${Math.random() * 60 + 30}px ${
                  ['rgba(59, 130, 246, 0.4)', 'rgba(6, 182, 212, 0.35)', 'rgba(129, 140, 248, 0.45)', 'rgba(34, 197, 94, 0.3)', 'rgba(168, 85, 247, 0.4)'][i % 5]
                }`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Matrix-style digital rain effect */}
      <div className="absolute inset-0 matrix-rain opacity-20" />

      {/* Cyberpunk scanning effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 cyberpunk-glow opacity-30"
          animate={{
            background: [
              'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
              'linear-gradient(180deg, transparent, rgba(255, 0, 255, 0.1), transparent)',
              'linear-gradient(270deg, transparent, rgba(255, 255, 0, 0.1), transparent)',
              'linear-gradient(0deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Optimized quantum field effect - reduced count for performance */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              scale: 0,
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      {/* Comet Trails */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`comet-${i}`}
            className="absolute"
            initial={{
              x: -200,
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              x: typeof window !== 'undefined' ? window.innerWidth + 200 : 2120,
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) - 200,
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              delay: i * 6,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full shadow-lg" 
                   style={{ boxShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(59,130,246,0.6)' }}/>
              <div className="absolute top-1/2 right-full w-32 h-[2px] bg-gradient-to-l from-white via-blue-300 to-transparent"
                   style={{ transform: 'translateY(-50%)' }}/>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Electromagnetic Rings */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute left-1/2 top-1/2"
            style={{
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              scale: [0.5, 2.5],
              opacity: [0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeOut'
            }}
          >
            <div 
              className="w-[300px] h-[300px] rounded-full border-2"
              style={{
                borderColor: ['rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(34, 197, 94, 0.6)'][i % 4],
                boxShadow: `0 0 30px ${['rgba(59, 130, 246, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(6, 182, 212, 0.4)', 'rgba(34, 197, 94, 0.4)'][i % 4]}`
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Wormhole Effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`wormhole-${i}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [0, 3],
              opacity: [0.8, 0],
              rotate: [0, 720]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.3,
              ease: 'easeOut'
            }}
          >
            <div 
              className="w-[200px] h-[200px] rounded-full border-4"
              style={{
                borderColor: `rgba(${i % 2 === 0 ? '59, 130, 246' : '168, 85, 247'}, 0.5)`,
                borderStyle: 'dashed',
                boxShadow: `0 0 40px rgba(${i % 2 === 0 ? '59, 130, 246' : '168, 85, 247'}, 0.4)`
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Photon Streams */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`photon-${i}`}
            className="absolute w-1 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              height: '100vh',
              background: `linear-gradient(180deg, transparent, ${
                ['rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(236, 72, 153, 0.6)'][i % 5]
              }, transparent)`
            }}
            animate={{
              y: ['-100%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear'
            }}
          />
        ))}
      </div>
      
      {/* Supernova Bursts */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`supernova-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 4],
              opacity: [1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 5,
              ease: 'easeOut'
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  ['rgba(255, 255, 255, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)'][i % 3]
                } 0%, transparent 70%)`,
                boxShadow: `0 0 60px ${
                  ['rgba(255, 255, 255, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.6)'][i % 3]
                }`
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Cosmic Dust Particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute w-1 h-1 bg-blue-300/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.8, 0],
              x: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;