import { motion } from 'framer-motion';
import { fadeUp, slideInLeft } from '../../lib/animations';
import GradientBadge from './GradientBadge';

/**
 * SectionHeading Component
 * Premium section heading with badge, title, subtitle, and decorative elements
 * @param {Object} props
 * @param {string} props.badge - Optional badge text
 * @param {string} props.badgeVariant - Badge color variant
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Optional subtitle text
 * @param {string} props.align - Text alignment: left, center, right
 * @param {boolean} props.showDecorator - Show decorative line
 * @param {string} props.className - Additional classes
 */
const SectionHeading = ({
  badge,
  badgeVariant = 'blue',
  title,
  subtitle,
  align = 'center',
  showDecorator = true,
  className = ''
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <div className={`flex flex-col gap-4 ${alignClasses[align]} ${className}`}>
      {badge && (
        <motion.div variants={fadeUp}>
          <GradientBadge variant={badgeVariant}>
            {badge}
          </GradientBadge>
        </motion.div>
      )}
      
      <div className="relative">
        {showDecorator && align === 'center' && (
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            variants={slideInLeft}
          />
        )}
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-display font-bold gradient-text"
          variants={fadeUp}
        >
          {title}
        </motion.h2>
      </div>
      
      {subtitle && (
        <motion.p 
          className="text-base md:text-lg text-gray-400 max-w-2xl"
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
