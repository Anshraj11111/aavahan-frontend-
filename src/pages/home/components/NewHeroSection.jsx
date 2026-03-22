import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, slideInLeft, heroWord, staggerContainer } from '../../../lib/animations';
import PremiumButton from '../../../components/common/PremiumButton';
import GradientBadge from '../../../components/common/GradientBadge';

// Lazy load Three.js scene for performance
const HeroScene = lazy(() => import('../../../components/three/HeroScene'));

/**
 * HeroSection Component
 * 100vh hero with Three.js background, animated title, countdown, and CTAs
 */
const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      ) || window.innerWidth < 768;
    };
    setIsMobile(checkMobile());
    
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-01T00:00:00').getTime();
    
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

  const quickStats = [
    { icon: Calendar, value: 'April 1-3', label: '2026', color: 'blue' },
    { icon: MapPin, value: 'Jabalpur', label: 'Shri Ram Group', color: 'cyan' },
    { icon: Users, value: '10,000+', label: 'Participants', color: 'purple' },
    { icon: Trophy, value: '50+', label: 'Events', color: 'gold' },
  ];

  const titleWords = ['Tech', 'Fest', '2026'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js Background - Only on Desktop */}
      {!isMobile && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}
      
      {/* Simple gradient background for mobile */}
      {isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
      )}
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/30 to-navy-950" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Organization Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <GradientBadge variant="blue" size="md">
              <Sparkles className="w-4 h-4" />
              <span>Shri Ram Group, Jabalpur Presents</span>
            </GradientBadge>
          </motion.div>

          {/* Main Title - Animated word by word */}
          <div className="mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold">
              {titleWords.map((word, index) => (
                <motion.span
                  key={word}
                  variants={heroWord}
                  custom={index}
                  className="inline-block gradient-text mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Tagline */}
          <motion.h2 
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            CODE IT. BUILD IT. BREAK LIMITS.
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Experience the ultimate celebration of technology, innovation, and creativity. 
            Join us for three days of competitions, workshops, cultural events, and networking.
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            variants={fadeUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          >
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="glass-panel p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Countdown Timer */}
          {!timeLeft.isExpired && (
            <motion.div variants={fadeUp} className="mb-12">
              <h3 className="text-white text-lg md:text-xl font-semibold mb-6">
                Event Starts In
              </h3>
              <div className="flex justify-center gap-3 md:gap-6">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="glass-panel px-4 py-3 md:px-6 md:py-4 rounded-xl border border-white/10 min-w-[70px] md:min-w-[100px]"
                  >
                    <div className="text-3xl md:text-5xl font-display font-bold gradient-text mb-1">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/events">
              <PremiumButton 
                variant="primary" 
                size="lg"
                icon={<Sparkles size={20} />}
              >
                Explore Events
              </PremiumButton>
            </Link>
            <Link to="/schedule">
              <PremiumButton 
                variant="glass" 
                size="lg"
                icon={<Calendar size={20} />}
              >
                View Schedule
              </PremiumButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
