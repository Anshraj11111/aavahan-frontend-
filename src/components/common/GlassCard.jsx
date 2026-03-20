import { motion } from 'framer-motion';
import { cardHover } from '../../lib/animations';

/**
 * GlassCard Component
 * Glassmorphism card with hover effects and glow
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hover - Enable hover animation
 * @param {boolean} props.glow - Enable glow effect
 * @param {string} props.padding - Padding size: none, sm, md, lg, xl
 * @param {string} props.className - Additional classes
 */
const GlassCard = ({
  children,
  hover = true,
  glow = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = 'glass-panel rounded-xl border border-white/10 transition-all duration-300';
  const glowClasses = glow ? 'glow-border' : '';
  const classes = `${baseClasses} ${glowClasses} ${paddingClasses[padding]} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={classes}
        variants={cardHover}
        whileHover="hover"
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
