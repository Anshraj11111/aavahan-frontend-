import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/animations';
import PremiumButton from '../common/PremiumButton';

/**
 * EmptyState Component
 * Display when no data is available
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.title - Title text
 * @param {string} props.message - Message text
 * @param {string} props.ctaText - Optional CTA button text
 * @param {Function} props.onCtaClick - Optional CTA click handler
 */
const EmptyState = ({
  icon,
  title,
  message,
  ctaText,
  onCtaClick
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {icon && (
        <div className="w-20 h-20 rounded-full bg-navy-800/50 flex items-center justify-center mb-6 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-2xl font-display font-bold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 max-w-md mb-6">
        {message}
      </p>
      
      {ctaText && onCtaClick && (
        <PremiumButton onClick={onCtaClick}>
          {ctaText}
        </PremiumButton>
      )}
    </motion.div>
  );
};

export default EmptyState;
