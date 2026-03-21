import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Ticket, Home, Info, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumButton from '../common/PremiumButton';
import RegistrationModal from '../modals/RegistrationModal';
import logoImage from '../../assets/images/Screenshot 2026-03-21 125551.png';

/**
 * Navbar Component
 * Premium navigation with transparent-to-solid transition on scroll
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect (80px threshold)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      {/* Backdrop blur overlay - only visible when mobile menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass-panel border-b border-white/10 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group relative"
          >
            {/* Shri Ram Group Logo - Actual Image */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden bg-white shadow-lg">
                <img 
                  src={logoImage} 
                  alt="Shri Ram Group Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Text - Always visible on all devices */}
            <div>
              <p className="text-gray-300 text-[10px] sm:text-xs lg:text-sm font-medium whitespace-nowrap" 
                 style={{ 
                   fontFamily: "'Inter', sans-serif",
                   textShadow: "1px 1px 2px rgba(0,0,0,0.6)"
                 }}>
                Shri Ram Group, Jabalpur
              </p>
              <h1 className="text-white font-black text-base sm:text-xl md:text-2xl lg:text-3xl whitespace-nowrap" 
                  style={{ 
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 900,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.4)",
                    color: "#ffffff",
                    letterSpacing: "0.02em"
                  }}>
                Aavhaan 2026
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className={`flex items-center gap-2 py-2 text-sm xl:text-base font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}>
                    <Icon size={16} className="xl:w-5 xl:h-5" />
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Active indicator - blue underline animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-lg transition-colors duration-300 -z-10" />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA - Right */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Link
              to="/my-tickets"
              className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors duration-300 text-sm xl:text-base"
            >
              <Ticket size={18} className="xl:w-5 xl:h-5" />
              <span>My Tickets</span>
            </Link>
            <PremiumButton 
              variant="primary" 
              size="md" 
              icon={<Sparkles size={18} className="xl:w-5 xl:h-5" />}
              onClick={() => setIsRegistrationModalOpen(true)}
              className="text-sm xl:text-base"
            >
              Register Now
            </PremiumButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-3 space-y-2">
                  <Link to="/my-tickets" className="block">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300">
                      <Ticket size={18} />
                      My Tickets
                    </button>
                  </Link>
                  <PremiumButton 
                    variant="primary" 
                    size="md" 
                    icon={<Sparkles size={18} />}
                    onClick={() => {
                      setIsRegistrationModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Register Now
                  </PremiumButton>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={{ title: 'General Registration', description: 'Register for Aavhaan 2026' }}
      />
    </header>
    </>
  );
};

export default Navbar;
