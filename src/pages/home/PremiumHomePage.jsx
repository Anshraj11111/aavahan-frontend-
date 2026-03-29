import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Calendar, Users, Trophy, ArrowRight, 
  Code, Cpu, Rocket, Play, ChevronDown, Award, Clock,
  Activity, Layers, Shield, Database, Wifi, Brain,
  Atom, Hexagon, Orbit
} from 'lucide-react';
import { useRegistrations } from '../../contexts/RegistrationContext';
import { useEvents } from '../../contexts/EventsContext';
import AnimatedBackground from '../../components/backgrounds/AnimatedBackground';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import aavhaanLogo from '../../assets/images/logo.png';

const PremiumHomePage = () => {
  const { getRegistrationStats } = useRegistrations();
  const { events } = useEvents();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Enhanced mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  // Real stats from context
  const registrationStats = getRegistrationStats();
  const totalEvents = events.length;

  // Enhanced smooth scrolling functionality
  useEffect(() => {
    // Add smooth scrolling class to html element
    document.documentElement.classList.add('smooth-scroll');
    
    // Enhanced smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    };

    // Add smooth scroll to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    return () => {
      document.documentElement.classList.remove('smooth-scroll');
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);
  
  // Enhanced mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-08T00:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const realStats = [
    { 
      icon: Users, 
      value: `${registrationStats.total}+`, 
      label: 'Registered Participants', 
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      description: 'Active participants'
    },
    { 
      icon: Trophy, 
      value: `${totalEvents}`, 
      label: 'Live Events', 
      color: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      description: 'Competitions running'
    },
    { 
      icon: Award, 
      value: '₹60K+', 
      label: 'Total Prize Pool', 
      color: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50',
      description: 'Rewards waiting'
    },
    { 
      icon: Calendar, 
      value: '3', 
      label: 'Days of Innovation', 
      color: 'from-orange-500 to-red-500',
      glow: 'shadow-orange-500/50',
      description: 'Non-stop action'
    },
  ];

  // Enhanced feature data based on poster departments
  const premiumFeatures = [
    {
      icon: Brain,
      title: 'Engineering & Technology',
      description: 'Cutting-edge engineering challenges, robotics competitions, and innovative tech solutions across multiple engineering disciplines.',
      color: 'from-blue-500 to-cyan-500',
      features: ['Robotics', 'AI/ML', 'IoT Projects'],
      gradient: 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent'
    },
    {
      icon: Atom,
      title: 'Science & Research',
      description: 'Explore scientific innovations, research presentations, and breakthrough discoveries in physics, chemistry, and life sciences.',
      color: 'from-purple-500 to-pink-500',
      features: ['Research Papers', 'Lab Innovations', 'Scientific Models'],
      gradient: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent'
    },
    {
      icon: Orbit,
      title: 'Management & Commerce',
      description: 'Business case studies, entrepreneurship challenges, and commerce competitions that bridge technology with business acumen.',
      color: 'from-orange-500 to-red-500',
      features: ['Case Studies', 'Startup Pitch', 'Business Plans'],
      gradient: 'bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <AnimatedBackground />
      
      {/* Cursor Follower Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-blue-400/30 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hero Section with Enhanced Effects */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center z-10 pb-20">
        {/* Heavy Tech Elements - Robotics & AI Themed */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Additional Robotics Elements */}
          
          {/* Robotic Arm with Gripper - Top Left */}
          <motion.div
            className="absolute top-20 left-10"
            animate={{
              rotate: [0, 15, -10, 0],
              y: [0, -20, 10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-30">
              <defs>
                <linearGradient id="robotArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              <rect x="35" y="10" width="10" height="30" fill="url(#robotArmGrad)" rx="2"/>
              <circle cx="40" cy="40" r="6" fill="#3b82f6" opacity="0.9"/>
              <rect x="35" y="40" width="10" height="35" fill="url(#robotArmGrad)" rx="2"/>
              <circle cx="40" cy="75" r="6" fill="#06b6d4" opacity="0.9"/>
              <rect x="35" y="75" width="10" height="25" fill="url(#robotArmGrad)" rx="2"/>
              <path d="M30 100 L30 110 M40 100 L40 115 M50 100 L50 110" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </motion.div>
          
          {/* Lidar Scanner - Top Right */}
          <motion.div
            className="absolute top-10 right-20"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90" className="opacity-35">
              <defs>
                <radialGradient id="lidarGrad">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              <circle cx="45" cy="45" r="35" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
              <circle cx="45" cy="45" r="25" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
              <circle cx="45" cy="45" r="15" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
              <path d="M45 45 L45 10" stroke="url(#lidarGrad)" strokeWidth="40" opacity="0.5"/>
              <circle cx="45" cy="45" r="4" fill="#10b981">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
              </circle>
              {/* Detection points */}
              {[30, 90, 150, 210, 270, 330].map((angle, i) => {
                const x = 45 + Math.cos(angle * Math.PI / 180) * 30;
                const y = 45 + Math.sin(angle * Math.PI / 180) * 30;
                return (
                  <circle key={i} cx={x} cy={y} r="2" fill="#fbbf24">
                    <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                  </circle>
                );
              })}
            </svg>
          </motion.div>
          
          {/* Robotic Arms */}
          <motion.div
            className="absolute top-20 left-10"
            animate={{
              rotate: [0, 15, -10, 0],
              y: [0, -20, 10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-30">
              <defs>
                <linearGradient id="robotArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Arm segments */}
              <rect x="35" y="10" width="10" height="30" fill="url(#robotArmGrad)" rx="2"/>
              <circle cx="40" cy="40" r="6" fill="#3b82f6" opacity="0.9"/>
              <rect x="35" y="40" width="10" height="35" fill="url(#robotArmGrad)" rx="2"/>
              <circle cx="40" cy="75" r="6" fill="#06b6d4" opacity="0.9"/>
              <rect x="35" y="75" width="10" height="25" fill="url(#robotArmGrad)" rx="2"/>
              {/* Gripper */}
              <path d="M30 100 L30 110 M40 100 L40 115 M50 100 L50 110" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </motion.div>
          
          {/* AI Neural Network */}
          <motion.div
            className="absolute top-1/4 right-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-40">
              <defs>
                <radialGradient id="neuralGlow">
                  <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.3 }} />
                </radialGradient>
              </defs>
              {/* Neural nodes */}
              {[[20, 20], [50, 15], [80, 25], [15, 50], [50, 50], [85, 55], [25, 80], [50, 85], [75, 75]].map((pos, i) => (
                <g key={i}>
                  <circle cx={pos[0]} cy={pos[1]} r="4" fill="url(#neuralGlow)">
                    <animate attributeName="r" values="3;5;3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite"/>
                  </circle>
                </g>
              ))}
              {/* Connections */}
              <line x1="20" y1="20" x2="50" y2="15" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
              <line x1="50" y1="15" x2="80" y2="25" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
              <line x1="20" y1="20" x2="15" y2="50" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
              <line x1="50" y1="15" x2="50" y2="50" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
              <line x1="80" y1="25" x2="85" y2="55" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
              <line x1="15" y1="50" x2="50" y2="50" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
              <line x1="50" y1="50" x2="85" y2="55" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
              <line x1="15" y1="50" x2="25" y2="80" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
              <line x1="50" y1="50" x2="50" y2="85" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
              <line x1="85" y1="55" x2="75" y2="75" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
            </svg>
          </motion.div>
          
          {/* Quantum Computing Visualization - Top Center */}
          <motion.div
            className="absolute top-10 left-1/2 transform -translate-x-1/2"
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-35">
              <defs>
                <radialGradient id="quantumGrad">
                  <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.9 }} />
                  <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.7 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }} />
                </radialGradient>
              </defs>
              {/* Quantum sphere */}
              <circle cx="50" cy="50" r="30" fill="url(#quantumGrad)" opacity="0.3"/>
              {/* Orbital rings */}
              {[0, 60, 120].map((angle, i) => (
                <ellipse 
                  key={i}
                  cx="50" 
                  cy="50" 
                  rx="35" 
                  ry="15" 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="1.5" 
                  opacity="0.5"
                  transform={`rotate(${angle} 50 50)`}
                >
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite"/>
                </ellipse>
              ))}
              {/* Quantum bits */}
              {[[50, 20], [50, 80], [20, 50], [80, 50]].map((pos, i) => (
                <circle key={i} cx={pos[0]} cy={pos[1]} r="3" fill="#06b6d4">
                  <animate attributeName="r" values="2;4;2" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </svg>
          </motion.div>
          
          {/* AI Neural Network */}
          
          {/* Drone/Quadcopter */}
          <motion.div
            className="absolute bottom-1/3 left-1/4"
            animate={{
              y: [0, -15, 5, 0],
              x: [0, 20, -10, 0],
              rotate: [0, 5, -3, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-35">
              <defs>
                <linearGradient id="droneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Body */}
              <rect x="25" y="25" width="10" height="10" fill="url(#droneGrad)" rx="2"/>
              {/* Arms */}
              <line x1="30" y1="30" x2="10" y2="10" stroke="#10b981" strokeWidth="2"/>
              <line x1="30" y1="30" x2="50" y2="10" stroke="#10b981" strokeWidth="2"/>
              <line x1="30" y1="30" x2="10" y2="50" stroke="#10b981" strokeWidth="2"/>
              <line x1="30" y1="30" x2="50" y2="50" stroke="#10b981" strokeWidth="2"/>
              {/* Propellers */}
              <circle cx="10" cy="10" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="10" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 50 10" to="360 50 10" dur="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="10" cy="50" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 10 50" to="360 10 50" dur="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="50" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="0.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Microchip/Processor */}
          <motion.div
            className="absolute top-1/2 right-10"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-35">
              <defs>
                <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Chip body */}
              <rect x="20" y="20" width="30" height="30" fill="url(#chipGrad)" rx="2"/>
              <rect x="25" y="25" width="20" height="20" fill="#1e293b" opacity="0.6" rx="1"/>
              {/* Pins */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <rect x="10" y={20 + i * 8} width="10" height="3" fill="#f59e0b" opacity="0.7"/>
                  <rect x="50" y={20 + i * 8} width="10" height="3" fill="#f59e0b" opacity="0.7"/>
                  <rect x={20 + i * 8} y="10" width="3" height="10" fill="#f59e0b" opacity="0.7"/>
                  <rect x={20 + i * 8} y="50" width="3" height="10" fill="#f59e0b" opacity="0.7"/>
                </g>
              ))}
              {/* Circuit traces */}
              <circle cx="35" cy="35" r="3" fill="#06b6d4" opacity="0.8">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Robot Head */}
          <motion.div
            className="absolute bottom-1/4 right-1/3"
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="60" height="70" viewBox="0 0 60 70" className="opacity-40">
              <defs>
                <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Antenna */}
              <line x1="30" y1="5" x2="30" y2="15" stroke="#6366f1" strokeWidth="2"/>
              <circle cx="30" cy="5" r="3" fill="#f59e0b">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              {/* Head */}
              <rect x="15" y="15" width="30" height="35" fill="url(#robotGrad)" rx="4"/>
              {/* Eyes */}
              <circle cx="22" cy="28" r="4" fill="#06b6d4">
                <animate attributeName="fill" values="#06b6d4;#3b82f6;#06b6d4" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="38" cy="28" r="4" fill="#06b6d4">
                <animate attributeName="fill" values="#06b6d4;#3b82f6;#06b6d4" dur="3s" repeatCount="indefinite"/>
              </circle>
              {/* Mouth */}
              <rect x="22" y="38" width="16" height="6" fill="#1e293b" opacity="0.6" rx="1"/>
              <line x1="24" y1="41" x2="36" y2="41" stroke="#06b6d4" strokeWidth="1"/>
              {/* Neck */}
              <rect x="25" y="50" width="10" height="8" fill="#6366f1" opacity="0.7"/>
            </svg>
          </motion.div>
          
          {/* PCB Circuit Board - Bottom Left */}
          <motion.div
            className="absolute bottom-20 left-10"
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-35">
              <defs>
                <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Circuit traces */}
              <path d="M20 20 L40 20 L40 40 L60 40 L60 60 L80 60" stroke="url(#pcbGrad)" strokeWidth="2" fill="none"/>
              <path d="M100 20 L80 20 L80 40 L60 40" stroke="url(#pcbGrad)" strokeWidth="2" fill="none"/>
              <path d="M20 100 L40 100 L40 80 L60 80" stroke="url(#pcbGrad)" strokeWidth="2" fill="none"/>
              <path d="M100 100 L80 100 L80 80 L60 80 L60 60" stroke="url(#pcbGrad)" strokeWidth="2" fill="none"/>
              {/* Components */}
              {[[20, 20], [40, 40], [60, 60], [80, 80], [100, 20], [80, 40], [40, 80], [100, 100]].map((pos, i) => (
                <g key={i}>
                  <rect x={pos[0] - 4} y={pos[1] - 4} width="8" height="8" fill="#1e293b" opacity="0.7" rx="1"/>
                  <circle cx={pos[0]} cy={pos[1]} r="3" fill="#10b981">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                  </circle>
                </g>
              ))}
              {/* Via holes */}
              {[[30, 30], [50, 50], [70, 70], [90, 30], [70, 50], [50, 90]].map((pos, i) => (
                <circle key={i} cx={pos[0]} cy={pos[1]} r="2" fill="#06b6d4" opacity="0.6">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </svg>
          </motion.div>
          
          {/* Robotic Wheels - Bottom Right */}
          <motion.div
            className="absolute bottom-10 right-20"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-35">
              <defs>
                <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Wheel rim */}
              <circle cx="35" cy="35" r="28" fill="none" stroke="url(#wheelGrad)" strokeWidth="3"/>
              <circle cx="35" cy="35" r="20" fill="none" stroke="url(#wheelGrad)" strokeWidth="2" opacity="0.6"/>
              {/* Spokes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line 
                  key={i}
                  x1="35" 
                  y1="35" 
                  x2={35 + Math.cos(angle * Math.PI / 180) * 20} 
                  y2={35 + Math.sin(angle * Math.PI / 180) * 20} 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  opacity="0.7"
                />
              ))}
              {/* Hub */}
              <circle cx="35" cy="35" r="8" fill="#1e293b" opacity="0.8"/>
              <circle cx="35" cy="35" r="4" fill="#fbbf24">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Gear Mechanism */}
          <motion.div
            className="absolute top-1/3 left-1/3"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-25">
              <defs>
                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.7 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.7 }} />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="25" fill="none" stroke="url(#gearGrad)" strokeWidth="3"/>
              {[...Array(8)].map((_, i) => (
                <rect 
                  key={i}
                  x="38" 
                  y="10" 
                  width="4" 
                  height="8" 
                  fill="url(#gearGrad)"
                  transform={`rotate(${i * 45} 40 40)`}
                />
              ))}
              <circle cx="40" cy="40" r="10" fill="#1e293b" opacity="0.6"/>
              <circle cx="40" cy="40" r="5" fill="url(#gearGrad)"/>
            </svg>
          </motion.div>
          
          {/* Binary Code Stream */}
          <div className="absolute top-0 left-1/2 w-px h-full opacity-20">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 text-green-400 text-xs font-mono"
                style={{ top: `${i * 7}%` }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'linear'
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.div>
            ))}
          </div>
          
          {/* Circuit Pathways */}
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="circuitPath" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            <path d="M100 200 L300 200 L300 400 L500 400" stroke="url(#circuitPath)" strokeWidth="2" fill="none"/>
            <path d="M1820 300 L1620 300 L1620 500 L1420 500" stroke="url(#circuitPath)" strokeWidth="2" fill="none"/>
            <path d="M960 100 L960 300 L1160 300" stroke="url(#circuitPath)" strokeWidth="2" fill="none"/>
            <circle cx="300" cy="200" r="5" fill="#06b6d4" opacity="0.8">
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="500" cy="400" r="5" fill="#10b981" opacity="0.8">
              <animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1620" cy="300" r="5" fill="#3b82f6" opacity="0.8">
              <animate attributeName="r" values="4;7;4" dur="2.2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          
          {/* 3D Cube Wireframe */}
          <motion.div
            className="absolute bottom-1/4 left-10"
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              rotateZ: [0, 360]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-30">
              <defs>
                <linearGradient id="cubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Front face */}
              <path d="M20 30 L50 30 L50 60 L20 60 Z" fill="none" stroke="url(#cubeGrad)" strokeWidth="2"/>
              {/* Back face */}
              <path d="M30 20 L60 20 L60 50 L30 50 Z" fill="none" stroke="url(#cubeGrad)" strokeWidth="2"/>
              {/* Connecting lines */}
              <line x1="20" y1="30" x2="30" y2="20" stroke="url(#cubeGrad)" strokeWidth="2"/>
              <line x1="50" y1="30" x2="60" y2="20" stroke="url(#cubeGrad)" strokeWidth="2"/>
              <line x1="50" y1="60" x2="60" y2="50" stroke="url(#cubeGrad)" strokeWidth="2"/>
              <line x1="20" y1="60" x2="30" y2="50" stroke="url(#cubeGrad)" strokeWidth="2"/>
            </svg>
          </motion.div>
          
          {/* DNA Helix */}
          <motion.div
            className="absolute top-1/2 left-20"
            animate={{
              rotateZ: 360
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="40" height="120" viewBox="0 0 40 120" className="opacity-30">
              <defs>
                <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Helix strands */}
              <path d="M10 10 Q20 30 10 50 Q20 70 10 90 Q20 110 10 130" 
                    stroke="url(#dnaGrad)" strokeWidth="2" fill="none"/>
              <path d="M30 10 Q20 30 30 50 Q20 70 30 90 Q20 110 30 130" 
                    stroke="url(#dnaGrad)" strokeWidth="2" fill="none"/>
              {/* Base pairs */}
              {[20, 40, 60, 80, 100].map((y, i) => (
                <line key={i} x1="10" y1={y} x2="30" y2={y} stroke="#ec4899" strokeWidth="1.5" opacity="0.6"/>
              ))}
            </svg>
          </motion.div>
          
          {/* Robotic Hand/Gripper */}
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{
              rotate: [0, -15, 10, 0],
              scale: [1, 1.1, 0.95, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="90" height="100" viewBox="0 0 90 100" className="opacity-35">
              <defs>
                <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Palm */}
              <rect x="30" y="50" width="30" height="35" fill="url(#handGrad)" rx="3"/>
              {/* Fingers */}
              <rect x="32" y="35" width="6" height="20" fill="url(#handGrad)" rx="2">
                <animate attributeName="height" values="20;15;20" dur="2s" repeatCount="indefinite"/>
              </rect>
              <rect x="40" y="30" width="6" height="25" fill="url(#handGrad)" rx="2">
                <animate attributeName="height" values="25;20;25" dur="2.2s" repeatCount="indefinite"/>
              </rect>
              <rect x="48" y="32" width="6" height="23" fill="url(#handGrad)" rx="2">
                <animate attributeName="height" values="23;18;23" dur="2.4s" repeatCount="indefinite"/>
              </rect>
              <rect x="56" y="38" width="6" height="17" fill="url(#handGrad)" rx="2">
                <animate attributeName="height" values="17;12;17" dur="2.6s" repeatCount="indefinite"/>
              </rect>
              {/* Thumb */}
              <rect x="20" y="60" width="12" height="8" fill="url(#handGrad)" rx="2" transform="rotate(-30 26 64)"/>
              {/* Wrist/Arm */}
              <rect x="38" y="85" width="14" height="15" fill="#ef4444" opacity="0.7" rx="2"/>
              {/* Joints */}
              <circle cx="35" cy="45" r="2" fill="#fbbf24" opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="43" cy="42" r="2" fill="#fbbf24" opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.7s" repeatCount="indefinite"/>
              </circle>
              <circle cx="51" cy="43" r="2" fill="#fbbf24" opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.9s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Sensor Array */}
          <motion.div
            className="absolute bottom-1/3 right-10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-40">
              <defs>
                <radialGradient id="sensorGlow">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                </radialGradient>
              </defs>
              {/* Sensor grid */}
              {[[20, 20], [40, 20], [60, 20], [20, 40], [40, 40], [60, 40], [20, 60], [40, 60], [60, 60]].map((pos, i) => (
                <g key={i}>
                  <circle cx={pos[0]} cy={pos[1]} r="5" fill="url(#sensorGlow)">
                    <animate attributeName="r" values="4;6;4" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.1}s`} repeatCount="indefinite"/>
                  </circle>
                  {/* Scanning lines */}
                  <line x1={pos[0]} y1={pos[1]} x2="40" y2="40" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2 + i * 0.2}s`} repeatCount="indefinite"/>
                  </line>
                </g>
              ))}
              {/* Central processor */}
              <circle cx="40" cy="40" r="8" fill="#1e293b" opacity="0.8"/>
              <circle cx="40" cy="40" r="4" fill="#06b6d4">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Machine Learning Model Visualization */}
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-35">
              <defs>
                <linearGradient id="mlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Input layer */}
              {[15, 30, 45, 60].map((y, i) => (
                <circle key={`input-${i}`} cx="15" cy={y} r="4" fill="url(#mlGrad)">
                  <animate attributeName="r" values="3;5;3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              ))}
              {/* Hidden layer */}
              {[10, 25, 40, 55, 70].map((y, i) => (
                <circle key={`hidden-${i}`} cx="60" cy={y} r="4" fill="url(#mlGrad)">
                  <animate attributeName="r" values="3;5;3" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              ))}
              {/* Output layer */}
              {[25, 40, 55].map((y, i) => (
                <circle key={`output-${i}`} cx="105" cy={y} r="4" fill="url(#mlGrad)">
                  <animate attributeName="r" values="3;5;3" dur={`${3 + i * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              ))}
              {/* Connections */}
              {[15, 30, 45, 60].map((y1) => 
                [10, 25, 40, 55, 70].map((y2, i) => (
                  <line key={`conn1-${y1}-${y2}`} x1="15" y1={y1} x2="60" y2={y2} stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${3 + i * 0.3}s`} repeatCount="indefinite"/>
                  </line>
                ))
              )}
              {[10, 25, 40, 55, 70].map((y1) => 
                [25, 40, 55].map((y2, i) => (
                  <line key={`conn2-${y1}-${y2}`} x1="60" y1={y1} x2="105" y2={y2} stroke="#ec4899" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${3.5 + i * 0.3}s`} repeatCount="indefinite"/>
                  </line>
                ))
              )}
            </svg>
          </motion.div>
          
          {/* Actuator/Motor */}
          <motion.div
            className="absolute bottom-1/4 right-1/4"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-35">
              <defs>
                <linearGradient id="motorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Motor body */}
              <circle cx="30" cy="30" r="20" fill="url(#motorGrad)" opacity="0.7"/>
              <circle cx="30" cy="30" r="15" fill="#1e293b" opacity="0.6"/>
              {/* Shaft */}
              <circle cx="30" cy="30" r="8" fill="url(#motorGrad)">
                <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              {/* Coils */}
              {[0, 90, 180, 270].map((angle, i) => (
                <rect 
                  key={i}
                  x="28" 
                  y="10" 
                  width="4" 
                  height="8" 
                  fill="#10b981"
                  opacity="0.8"
                  transform={`rotate(${angle} 30 30)`}
                />
              ))}
              {/* Rotation indicator */}
              <line x1="30" y1="30" x2="30" y2="15" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="2s" repeatCount="indefinite"/>
              </line>
            </svg>
          </motion.div>
          
          {/* Data Visualization Graph */}
          <motion.div
            className="absolute top-1/2 right-1/3"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="100" height="70" viewBox="0 0 100 70" className="opacity-40">
              <defs>
                <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                  <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Bar chart */}
              {[15, 30, 45, 60, 75].map((x, i) => {
                const height = 20 + Math.random() * 30;
                return (
                  <rect 
                    key={i}
                    x={x} 
                    y={60 - height} 
                    width="8" 
                    height={height} 
                    fill="url(#dataGrad)"
                    rx="2"
                  >
                    <animate attributeName="height" values={`${height};${height + 10};${height}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                    <animate attributeName="y" values={`${60 - height};${60 - height - 10};${60 - height}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                  </rect>
                );
              })}
              {/* Trend line */}
              <path d="M10 50 Q30 40 50 35 T90 25" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.7">
                <animate attributeName="d" values="M10 50 Q30 40 50 35 T90 25;M10 48 Q30 38 50 33 T90 23;M10 50 Q30 40 50 35 T90 25" dur="4s" repeatCount="indefinite"/>
              </path>
            </svg>
          </motion.div>
          
          {/* Servo Motor */}
          <motion.div
            className="absolute top-2/3 left-1/3"
            animate={{
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-35">
              <defs>
                <linearGradient id="servoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              <rect x="10" y="15" width="30" height="20" fill="url(#servoGrad)" rx="2"/>
              <circle cx="25" cy="25" r="8" fill="#1e293b" opacity="0.7"/>
              <circle cx="25" cy="25" r="4" fill="#fbbf24">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              {/* Servo arm */}
              <rect x="23" y="10" width="4" height="8" fill="#f59e0b" rx="1"/>
            </svg>
          </motion.div>
          
          {/* AI Brain Visualization */}
          <motion.div
            className="absolute bottom-1/3 left-1/2"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90" className="opacity-40">
              <defs>
                <radialGradient id="brainGlow">
                  <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.3 }} />
                </radialGradient>
              </defs>
              {/* Brain outline */}
              <path d="M25 20 Q15 25 15 35 Q15 50 25 60 Q35 65 45 60 Q55 50 55 35 Q55 25 45 20 Q35 15 25 20" 
                    fill="none" stroke="url(#brainGlow)" strokeWidth="2"/>
              <path d="M35 20 Q35 30 35 45 Q35 55 40 60" stroke="url(#brainGlow)" strokeWidth="1.5" opacity="0.6"/>
              {/* Neural activity */}
              {[[25, 30], [35, 35], [45, 30], [25, 45], [35, 50], [45, 45]].map((pos, i) => (
                <circle key={i} cx={pos[0]} cy={pos[1]} r="2" fill="#a855f7">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                  <animate attributeName="r" values="2;3;2" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </svg>
          </motion.div>
          
          {/* Radar Scanner */}
          <motion.div
            className="absolute top-1/3 left-10"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-30">
              <defs>
                <radialGradient id="radarGrad">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              {/* Radar circles */}
              <circle cx="35" cy="35" r="30" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
              <circle cx="35" cy="35" r="20" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
              <circle cx="35" cy="35" r="10" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
              {/* Scanning beam */}
              <path d="M35 35 L35 5" stroke="url(#radarGrad)" strokeWidth="30" opacity="0.6"/>
              {/* Center dot */}
              <circle cx="35" cy="35" r="3" fill="#10b981">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
              </circle>
              {/* Detected objects */}
              <circle cx="45" cy="20" r="2" fill="#fbbf24">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="25" cy="45" r="2" fill="#fbbf24">
                <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
          
          {/* Oscilloscope Wave */}
          <motion.div
            className="absolute bottom-1/4 left-1/4"
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="120" height="60" viewBox="0 0 120 60" className="opacity-35">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              <path d="M0 30 Q10 10 20 30 T40 30 T60 30 T80 30 T100 30 T120 30" 
                    stroke="url(#waveGrad)" strokeWidth="2" fill="none">
                <animate attributeName="d" 
                         values="M0 30 Q10 10 20 30 T40 30 T60 30 T80 30 T100 30 T120 30;M0 30 Q10 50 20 30 T40 30 T60 30 T80 30 T100 30 T120 30;M0 30 Q10 10 20 30 T40 30 T60 30 T80 30 T100 30 T120 30" 
                         dur="2s" 
                         repeatCount="indefinite"/>
              </path>
              {/* Grid lines */}
              {[0, 20, 40, 60, 80, 100, 120].map((x, i) => (
                <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="60" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2"/>
              ))}
              {[0, 15, 30, 45, 60].map((y, i) => (
                <line key={`h-${i}`} x1="0" y1={y} x2="120" y2={y} stroke="#06b6d4" strokeWidth="0.5" opacity="0.2"/>
              ))}
            </svg>
          </motion.div>
        </div>
        
        {/* Optimized Floating Geometric Shapes - reduced for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotate: 0,
                scale: 0.5,
                opacity: 0.1,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotate: 360,
                scale: [0.5, 1.2, 0.5],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <div
                className={`w-${Math.random() > 0.5 ? '16' : '20'} h-${Math.random() > 0.5 ? '16' : '20'} 
                  ${i % 3 === 0 ? 'bg-blue-500/10' : i % 3 === 1 ? 'bg-purple-500/10' : 'bg-cyan-500/10'}
                  ${i % 4 === 0 ? 'rounded-full' : i % 4 === 1 ? 'rounded-lg rotate-45' : 'rounded-none'}
                  backdrop-blur-sm border border-white/5`}
                style={{
                  clipPath: i % 5 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                           i % 5 === 1 ? 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' : 'none'
                }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 pt-24 md:pt-32"
          style={{ y }}
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Title with Enhanced Font Visibility - Shifted Down */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.3 }}
              className="mb-6 relative"
            >
              <motion.h1
                className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight relative"
                style={{ 
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 900,
                  color: "#ffffff",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.4)"
                }}
              >
                <motion.span
                  className="block relative text-white mb-0"
                  style={{
                    x: mouseXSpring,
                    y: mouseYSpring,
                    color: "#ffffff",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.7)"
                  }}
                  whileHover={{
                    scale: 1.05,
                    textShadow: "3px 3px 6px rgba(0,0,0,0.9), 0 0 50px rgba(59,130,246,0.9), 0 0 70px rgba(6,182,212,0.5)"
                  }}
                  animate={{
                    textShadow: [
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.7)",
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 50px rgba(6,182,212,0.8)",
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.7)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  AAVHAAN
                </motion.span>
                
                {/* Aavhaan Logo Between Title and Year */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
                  className="flex justify-center my-0"
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 blur-2xl rounded-full" />
                    <img 
                      src={aavhaanLogo} 
                      alt="Aavhaan Logo" 
                      className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain drop-shadow-2xl"
                      style={{
                        filter: "drop-shadow(0 0 20px rgba(59,130,246,0.5)) drop-shadow(0 0 40px rgba(139,92,246,0.3))"
                      }}
                    />
                  </motion.div>
                </motion.div>
                
                <motion.span 
                  className="text-white font-mono relative block"
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontWeight: 800,
                    color: "#ffffff",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.5)"
                  }}
                  animate={{
                    textShadow: [
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.5)",
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.6)",
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 35px rgba(6,182,212,0.6)",
                      "3px 3px 6px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  2026
                </motion.span>
                
                {/* Enhanced floating particles around title - reduced count */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400/60 rounded-full"
                      initial={{
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 100 - 50,
                        scale: 0,
                      }}
                      animate={{
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 200 - 100,
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360, 720]
                      }}
                      transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.h1>
            </motion.div>

            {/* Enhanced Animated Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="mb-8 perspective-1000"
            >
              <motion.div 
                className="ultra-glass px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-xl inline-block relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(59,130,246,0.3)"
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(129,140,248,0.1), rgba(6,182,212,0.1))",
                      "linear-gradient(45deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(129,140,248,0.1))",
                      "linear-gradient(45deg, rgba(129,140,248,0.1), rgba(6,182,212,0.1), rgba(59,130,246,0.1))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white relative z-10"
                    style={{ 
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontWeight: 700,
                      color: "#ffffff",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9)"
                    }}>
                  <motion.span 
                    className="text-green-400"
                    style={{ 
                      color: "#4ade80",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(34,197,94,0.6)"
                    }}
                    animate={{ 
                      textShadow: [
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(34,197,94,0.6)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 25px rgba(34,197,94,0.9)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(34,197,94,0.6)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    CODE
                  </motion.span> IT. 
                  <motion.span 
                    className="text-blue-400"
                    style={{ 
                      color: "#60a5fa",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(59,130,246,0.6)"
                    }}
                    animate={{ 
                      textShadow: [
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(59,130,246,0.6)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 25px rgba(59,130,246,0.9)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(59,130,246,0.6)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    BUILD
                  </motion.span> IT. 
                  <motion.span 
                    className="text-purple-400"
                    style={{ 
                      color: "#a78bfa",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(129,140,248,0.6)"
                    }}
                    animate={{ 
                      textShadow: [
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(129,140,248,0.6)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 25px rgba(129,140,248,0.9)",
                        "2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(129,140,248,0.6)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    BREAK
                  </motion.span> LIMITS.
                </h2>
              </motion.div>
            </motion.div>

            {/* Description with better font visibility */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-white/90 text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ 
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
              }}
            >
              Experience the ultimate celebration of technology, innovation, and creativity at Aavhaan 2026. 
              Join us for an extraordinary journey through Engineering, Pharmacy, Management, Computer Application, 
              Law, Commerce, Arts, and Science. Three days of competitions, workshops, and networking await you.
            </motion.p>

            {/* Enhanced Real-time Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              {realStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring", bounce: 0.4 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateY: 5,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px ${stat.glow.includes('blue') ? 'rgba(59,130,246,0.4)' : 
                                                                           stat.glow.includes('purple') ? 'rgba(129,140,248,0.4)' :
                                                                           stat.glow.includes('green') ? 'rgba(34,197,94,0.4)' :
                                                                           'rgba(249,115,22,0.4)'}`
                    }}
                    className="group relative perspective-1000"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="ultra-glass p-6 rounded-2xl border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-500 relative overflow-hidden">
                      {/* Animated background gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl`}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0, 0.1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Floating particles - reduced count */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(2)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/40 rounded-full"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.random() * 100,
                              y: Math.random() * 100,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.5,
                            }}
                          />
                        ))}
                      </div>
                      
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto relative z-10`}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          boxShadow: `0 0 30px ${stat.glow.includes('blue') ? 'rgba(59,130,246,0.6)' : 
                                                 stat.glow.includes('purple') ? 'rgba(129,140,248,0.6)' :
                                                 stat.glow.includes('green') ? 'rgba(34,197,94,0.6)' :
                                                 'rgba(249,115,22,0.6)'}`
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <motion.div 
                        className="text-2xl font-bold text-white mb-1 relative z-10"
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(255,255,255,0.3)",
                            "0 0 20px rgba(255,255,255,0.6)",
                            "0 0 10px rgba(255,255,255,0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {stat.value}
                      </motion.div>
                      
                      <div className="text-white/70 text-sm mb-2 relative z-10">{stat.label}</div>
                      <div className="text-white/50 text-xs relative z-10">{stat.description}</div>
                      
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${stat.glow.includes('blue') ? 'rgba(59,130,246,0.1)' : 
                                                                          stat.glow.includes('purple') ? 'rgba(129,140,248,0.1)' :
                                                                          stat.glow.includes('green') ? 'rgba(34,197,94,0.1)' :
                                                                          'rgba(249,115,22,0.1)'} 0%, transparent 70%)`
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Countdown Timer */}
            {!timeLeft.isExpired && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mb-12 relative z-10"
              >
                <h3 className="text-white text-xl font-semibold mb-6 flex items-center justify-center">
                  <Clock className="w-6 h-6 mr-2 text-yellow-400" />
                  Event Starts In
                </h3>
                <div className="flex justify-center space-x-4">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Minutes' },
                    { value: timeLeft.seconds, label: 'Seconds' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="glass-panel p-4 rounded-2xl border border-white/20 backdrop-blur-xl min-w-[80px] relative z-10"
                    >
                      <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                      <div className="text-white/70 text-sm">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10"
            >
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center group hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Explore Events
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/schedule">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-panel border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-xl hover:border-white/50 transition-all duration-300"
                >
                  View Schedule
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/60 cursor-pointer group"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-sm mb-2 group-hover:text-white/80 transition-colors">Scroll to explore</span>
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      {/* Enhanced Features Section with Advanced Glassmorphism */}
      <section id="features" className="py-20 relative z-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative z-10"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ 
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 800,
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}
              whileInView={{
                textShadow: [
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 40px rgba(59,130,246,0.4)",
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Why <span className="text-blue-400">Aavhaan 2026</span>?
            </motion.h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Experience innovation like never before with cutting-edge technology, 
              diverse culture, and endless opportunities for growth and networking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.02,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 80px rgba(59,130,246,0.3)"
                  }}
                  viewport={{ once: true }}
                  className="group relative perspective-1000"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="ultra-glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-500 h-full relative overflow-hidden">
                    {/* Dynamic background gradient */}
                    <motion.div 
                      className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Optimized floating tech particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: Math.random() * 200,
                            y: Math.random() * 200,
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                    
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 360,
                        boxShadow: "0 0 40px rgba(59,130,246,0.6)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300 relative z-10">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed mb-6 relative z-10">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-2 relative z-10">
                      {feature.features.map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center text-white/60"
                          whileHover={{ x: 5, color: "rgba(255,255,255,0.9)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Hexagon className="w-4 h-4 mr-2 text-blue-400" />
                          </motion.div>
                          <span className="text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Hover ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.1) 0%, transparent 50%)"
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Events Showcase */}
      <section id="events" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Live Events</span> & Competitions
            </h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Real-time event data showing active competitions and registrations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-panel p-6 rounded-2xl border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.category === 'technical' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {event.category}
                    </span>
                    <div className="flex items-center text-green-400">
                      <Activity className="w-4 h-4 mr-1" />
                      <span className="text-xs">Live</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {event.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Day {event.day}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>₹{event.entryFee}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">Registrations</span>
                      <span className="text-white text-sm font-medium">
                        {Math.floor(Math.random() * 45) + 5}/{event.maxRegistrations}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold backdrop-blur-xl hover:border-white/50 transition-all duration-300 group"
              >
                View All Events
                <ArrowRight className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Showcase with Heavy Robotics Elements */}
      <section id="tech" className="py-20 relative z-10">
        {/* Background Tech Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Robotic Assembly Line */}
          <motion.div
            className="absolute top-10 left-0 right-0"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <svg width="200" height="60" viewBox="0 0 200 60" className="opacity-50">
              <defs>
                <linearGradient id="assemblyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Conveyor belt */}
              <rect x="0" y="40" width="200" height="8" fill="url(#assemblyGrad)" opacity="0.5"/>
              {/* Moving parts */}
              {[20, 70, 120, 170].map((x, i) => (
                <g key={i}>
                  <rect x={x} y="25" width="15" height="15" fill="#3b82f6" opacity="0.7" rx="2">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                  </rect>
                </g>
              ))}
            </svg>
          </motion.div>
          
          {/* Holographic Display */}
          <motion.div
            className="absolute top-1/3 right-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-50">
              <defs>
                <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              {/* Holographic frame */}
              <rect x="10" y="10" width="80" height="60" fill="none" stroke="url(#holoGrad)" strokeWidth="2" rx="4"/>
              {/* Scan lines */}
              {[20, 30, 40, 50, 60].map((y, i) => (
                <line key={i} x1="15" y1={y} x2="85" y2={y} stroke="#06b6d4" strokeWidth="1" opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                </line>
              ))}
              {/* Holographic data */}
              <circle cx="30" cy="35" r="3" fill="#06b6d4">
                <animate attributeName="cy" values="35;25;35" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="40" r="3" fill="#8b5cf6">
                <animate attributeName="cy" values="40;30;40" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="70" cy="38" r="3" fill="#06b6d4">
                <animate attributeName="cy" values="38;28;38" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powered by <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Modern Tech</span>
            </h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Built with cutting-edge technologies for seamless experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { icon: Code, name: 'React', color: 'from-blue-400 to-blue-600' },
              { icon: Database, name: 'MongoDB', color: 'from-green-400 to-green-600' },
              { icon: Layers, name: 'Node.js', color: 'from-green-500 to-green-700' },
              { icon: Shield, name: 'JWT Auth', color: 'from-red-400 to-red-600' },
              { icon: Wifi, name: 'Real-time', color: 'from-purple-400 to-purple-600' },
              { icon: Cpu, name: 'AI/ML', color: 'from-orange-400 to-orange-600' },
            ].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="glass-panel p-6 rounded-2xl border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-300 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">{tech.name}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Premium Innovation Showcase */}
      <section id="innovation" className="py-20 relative z-10">
        {/* Background Robotics Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          {/* Mechanical Gears */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`gear-${i}`}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + (i % 2) * 60}%`
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <linearGradient id={`gearBg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                    <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }} />
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="20" fill="none" stroke={`url(#gearBg${i})`} strokeWidth="2"/>
                {[...Array(8)].map((_, j) => (
                  <rect 
                    key={j}
                    x="28" 
                    y="8" 
                    width="4" 
                    height="6" 
                    fill={`url(#gearBg${i})`}
                    transform={`rotate(${j * 45} 30 30)`}
                  />
                ))}
                <circle cx="30" cy="30" r="8" fill="#1e293b" opacity="0.7"/>
              </svg>
            </motion.div>
          ))}
          
          {/* AI Data Streams */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`stream-${i}`}
              className="absolute"
              style={{
                left: `${10 + i * 25}%`,
                top: 0,
                height: '100%'
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <svg width="2" height="100%" viewBox="0 0 2 400">
                <defs>
                  <linearGradient id={`streamGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0 }} />
                    <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="2" height="400" fill={`url(#streamGrad${i})`}>
                  <animate attributeName="y" values="0;-400;0" dur={`${4 + i}s`} repeatCount="indefinite"/>
                </rect>
              </svg>
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ 
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 800,
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}
            >
              Innovation <span className="text-cyan-400">Universe</span>
            </motion.h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Explore the infinite possibilities of technology and innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Rocket,
                title: 'Launch Ideas',
                description: 'Transform concepts into reality',
                color: 'from-orange-500 to-red-500',
                delay: 0
              },
              {
                icon: Orbit,
                title: 'Explore Tech',
                description: 'Discover cutting-edge solutions',
                color: 'from-blue-500 to-cyan-500',
                delay: 0.1
              },
              {
                icon: Brain,
                title: 'AI Innovation',
                description: 'Harness artificial intelligence',
                color: 'from-purple-500 to-pink-500',
                delay: 0.2
              },
              {
                icon: Atom,
                title: 'Future Tech',
                description: 'Build tomorrow today',
                color: 'from-green-500 to-emerald-500',
                delay: 0.3
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: item.delay }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 80px rgba(59,130,246,0.3)"
                  }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="ultra-glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-500 h-full text-center relative overflow-hidden">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto relative z-10`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 360,
                        boxShadow: "0 0 40px rgba(59,130,246,0.6)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/70 text-sm">{item.description}</p>
                    
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)`
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Stats Visualization */}
      <section id="stats-visual" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="ultra-glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-24 h-24 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-cyan-400/50"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500/60 to-cyan-500/60 flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">20+</h3>
                <p className="text-white/70">Technical Events</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="ultra-glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/60 to-pink-500/60 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">1000+</h3>
                <p className="text-white/70">Participants</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="ultra-glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="w-24 h-24 mx-auto mb-6 relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-500/60 to-emerald-500/60 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">₹60K+</h3>
                <p className="text-white/70">Prize Pool</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section id="cta" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="glass-panel p-12 rounded-3xl border border-white/20 backdrop-blur-xl max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Join the <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Revolution</span>?
              </h2>
              <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                Don't miss out on the biggest innovation festival of 2026. 
                Register now and be part of something extraordinary.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/events">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center group hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    Register Now
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-panel border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl backdrop-blur-xl hover:border-white/50 transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default PremiumHomePage;