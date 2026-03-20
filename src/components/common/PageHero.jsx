import { motion } from 'framer-motion';
import { fadeUp, slideInLeft } from '../../lib/animations';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * PageHero Component
 * Hero section for inner pages (not home)
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional subtitle
 * @param {Array} props.breadcrumbs - Breadcrumb items [{label, path}]
 * @param {React.ReactNode} props.children - Optional additional content
 */
const PageHero = ({
  title,
  subtitle,
  breadcrumbs = [],
  children
}) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-navy-950/50 to-navy-950" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-line-grid opacity-20" />
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav 
            className="flex items-center gap-2 text-sm mb-6"
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-600" />}
                {crumb.path ? (
                  <Link 
                    to={crumb.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500">{crumb.label}</span>
                )}
              </div>
            ))}
          </motion.nav>
        )}
        
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold gradient-text mb-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Additional content */}
        {children && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
