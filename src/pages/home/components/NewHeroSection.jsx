import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import collegeBuilding from '../../../assets/images/college.png';
import aavhaanLogo from '../../../assets/images/techfest logo.png';
import botImage from '../../../assets/images/bot.png';

const NewHeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  });

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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a2744]">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* College Building - Bottom Right - Enhanced */}
      <div className="absolute bottom-0 right-0 w-1/2 h-2/3 opacity-30">
        <img 
          src={collegeBuilding} 
          alt="Shri Ram Group College" 
          className="w-full h-full object-contain object-bottom filter brightness-110 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a1628]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Bot Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Main Circle Container with Bot Image */}
                <div className="w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-blue-400/40 shadow-2xl relative overflow-hidden">
                  {/* Animated Scan Lines */}
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
                  />
                  
                  {/* Bot Image - Perfectly Circular with Better Positioning */}
                  <div className="relative z-10 w-[340px] h-[340px] rounded-full overflow-hidden border-2 border-cyan-400/30">
                    <motion.img 
                      src={botImage} 
                      alt="AI Robot" 
                      className="w-full h-full object-cover scale-110"
                      style={{ objectPosition: 'center center' }}
                      animate={{ 
                        scale: [1.1, 1.15, 1.1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Inner Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-cyan-400/10 pointer-events-none" />
                  </div>
                </div>
                
                {/* Glowing Effects */}
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
              </motion.div>

              {/* Floating Icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-10 left-10 w-12 h-12 bg-blue-500/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-blue-400">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Aavhaan Logo and Text */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-2">
                <motion.img 
                  src={aavhaanLogo} 
                  alt="Aavhaan Logo" 
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div>
                  <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg block">
                    AAVHAAN
                  </span>
                  <span className="text-cyan-400 drop-shadow-lg block">2026</span>
                </div>
              </div>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-white font-black mb-8 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              CODE IT. BUILD IT. BREAK LIMITS.
            </motion.p>

            {/* Countdown Timer */}
            {!timeLeft.isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex gap-3 justify-center lg:justify-start max-w-md">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Minutes' },
                    { value: timeLeft.seconds, label: 'Seconds' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="bg-blue-900/50 backdrop-blur-md px-3 py-3 rounded-xl border border-blue-400/30 flex-1 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="text-2xl md:text-3xl font-black text-cyan-400 mb-1">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-white font-bold uppercase tracking-wide">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/events"
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Explore Events</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              <Link
                to="/events"
                className="group relative bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Register Now</span>
                <Calendar className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex gap-6 justify-center lg:justify-start"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-cyan-400">50+</div>
                <div className="text-sm text-white font-bold uppercase tracking-wide">Events</div>
              </div>
              <div className="w-px bg-blue-400/30" />
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-cyan-400">₹60K+</div>
                <div className="text-sm text-white font-bold uppercase tracking-wide">Prizes</div>
              </div>
              <div className="w-px bg-blue-400/30" />
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-cyan-400">3</div>
                <div className="text-sm text-white font-bold uppercase tracking-wide">Days</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
