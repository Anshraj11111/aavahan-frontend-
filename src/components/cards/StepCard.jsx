import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cardHover } from '../../lib/animations';
import GlassCard from '../common/GlassCard';

/**
 * StepCard Component
 * Card for displaying registration/process steps
 * @param {Object} props
 * @param {number} props.stepNumber - Step number
 * @param {string} props.title - Step title
 * @param {string} props.description - Step description
 * @param {React.ReactNode} props.icon - Step icon
 * @param {boolean} props.completed - Whether step is completed
 * @param {boolean} props.active - Whether step is active
 */
const StepCard = ({
  stepNumber,
  title,
  description,
  icon,
  completed = false,
  active = false
}) => {
  return (
    <motion.div variants={cardHover} whileHover="hover">
      <GlassCard 
        padding="lg" 
        hover={false}
        className={`relative h-full ${active ? 'border-blue-500/50 shadow-glow' : ''}`}
      >
        {/* Step number badge */}
        <div className="absolute -top-4 -left-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            completed 
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' 
              : active
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
              : 'bg-navy-800 text-gray-400 border border-white/10'
          }`}>
            {completed ? <Check className="w-6 h-6" /> : stepNumber}
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div className="mb-4 mt-2">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
              active 
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400' 
                : 'bg-navy-800/50 text-gray-400'
            }`}>
              {icon}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className={`text-xl font-display font-bold mb-2 ${
          active ? 'gradient-text' : 'text-white'
        }`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>

        {/* Active indicator */}
        {active && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Current Step</span>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default StepCard;
