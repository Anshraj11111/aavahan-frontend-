import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Ticket, Home, Info, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumButton from '../common/PremiumButton';

/**
 * Navbar Component
 * Premium navigation with transparent-to-solid transition on scroll
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-panel border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group relative z-10"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-glow">
                <span className="text-white font-bold text-xl">TF</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-display font-bold text-xl gradient-text">
                Tech Fest 2026
              </h1>
              <p className="text-gray-400 text-xs">
                Shri Ram Group, Jabalpur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}>
                    <Icon size={16} />
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
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/my-tickets"
              className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors duration-300"
            >
              <Ticket size={18} />
              <span>My Tickets</span>
            </Link>
            <Link to="/events">
              <PremiumButton variant="primary" size="md" icon={<Sparkles size={18} />}>
                Register Now
              </PremiumButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300 relative z-10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation - Drawer from right */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm lg:hidden"
                style={{ top: 0 }}
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] glass-panel border-l border-white/10 shadow-2xl lg:hidden overflow-y-auto"
              >
                <div className="p-6">
                  {/* Close button */}
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                  
                  {/* Logo */}
                  <div className="mb-8 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">TF</span>
                      </div>
                      <div>
                        <h2 className="text-white font-display font-bold">Tech Fest 2026</h2>
                        <p className="text-gray-400 text-xs">Shri Ram Group</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nav items - staggered animation */}
                  <nav className="space-y-2 mb-6">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.path);
                      
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                  
                  {/* CTA buttons */}
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <Link to="/my-tickets" className="block">
                      <PremiumButton 
                        variant="ghost" 
                        size="md" 
                        icon={<Ticket size={18} />}
                        className="w-full justify-center"
                      >
                        My Tickets
                      </PremiumButton>
                    </Link>
                    <Link to="/events" className="block">
                      <PremiumButton 
                        variant="primary" 
                        size="md" 
                        icon={<Sparkles size={18} />}
                        className="w-full justify-center"
                      >
                        Register Now
                      </PremiumButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
