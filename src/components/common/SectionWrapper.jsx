import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { staggerContainer } from '../../lib/animations';

/**
 * SectionWrapper Component
 * Wrapper for sections with glow, grid, and scroll animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {boolean} props.showGrid - Show background grid
 * @param {boolean} props.showGlow - Show glow effect
 * @param {string} props.glowColor - Glow color: blue, cyan, purple
 * @param {string} props.className - Additional classes
 * @param {string} props.id - Section ID for navigation
 */
const SectionWrapper = ({
  children,
  showGrid = false,
  showGlow = false,
  glowColor = 'blue',
  className = '',
  id
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const glowColorClasses = {
    blue: 'bg-blue-500/5',
    cyan: 'bg-cyan-500/5',
    purple: 'bg-purple-500/5'
  };

  return (
    <section 
      id={id}
      ref={ref}
      className={`relative py-16 md:py-24 overflow-hidden ${className}`}
    >
      {/* Background grid */}
      {showGrid && (
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
      )}
      
      {/* Glow effect */}
      {showGlow && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl ${glowColorClasses[glowColor]}`} />
      )}
      
      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
