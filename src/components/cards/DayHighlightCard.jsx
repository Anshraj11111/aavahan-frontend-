import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { cardHover } from '../../lib/animations';
import GlassCard from '../common/GlassCard';
import GradientBadge from '../common/GradientBadge';

/**
 * DayHighlightCard Component
 * Card for displaying day summaries and highlights
 * @param {Object} props
 * @param {Object} props.day - Day data object
 */
const DayHighlightCard = ({ day }) => {
  const { dayNumber, date, title, description, highlights = [], eventCount } = day;

  const dayColors = {
    1: 'blue',
    2: 'cyan',
    3: 'purple'
  };

  const color = dayColors[dayNumber] || 'blue';

  return (
    <motion.div variants={cardHover} whileHover="hover">
      <GlassCard padding="lg" glow hover={false} className="h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <GradientBadge variant={color} size="sm">
                Day {dayNumber}
              </GradientBadge>
              <div className="text-sm text-gray-400 mt-1">{date}</div>
            </div>
          </div>
          
          {eventCount && (
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">{eventCount}</div>
              <div className="text-xs text-gray-500">Events</div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-display font-bold gradient-text mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Highlights</span>
            </div>
            <ul className="space-y-2">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default DayHighlightCard;
