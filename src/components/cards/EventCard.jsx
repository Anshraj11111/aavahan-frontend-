import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardHover } from '../../lib/animations';
import GlassCard from '../common/GlassCard';
import GradientBadge from '../common/GradientBadge';

/**
 * EventCard Component
 * Card for displaying event information
 * @param {Object} props
 * @param {Object} props.event - Event data object
 * @param {boolean} props.featured - Featured variant with larger styling
 */
const EventCard = ({ event, featured = false }) => {
  const {
    _id,
    title,
    category,
    day,
    startTime,
    endTime,
    venue,
    teamSize,
    registrationFee,
    prizePool,
    description,
    registrationCount = 0,
    maxParticipants
  } = event;

  const categoryColors = {
    'Technical': 'blue',
    'Cultural': 'purple',
    'Sports': 'cyan',
    'Workshop': 'gold'
  };

  const dayColors = {
    'Day 1': 'blue',
    'Day 2': 'cyan',
    'Day 3': 'purple'
  };

  return (
    <Link to={`/events/${_id}`}>
      <motion.div variants={cardHover} whileHover="hover">
        <GlassCard 
          padding={featured ? 'lg' : 'md'} 
          glow={featured}
          hover={false}
          className="h-full group"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <GradientBadge variant={categoryColors[category] || 'blue'} size="sm">
                {category}
              </GradientBadge>
              <GradientBadge variant={dayColors[day] || 'blue'} size="sm">
                {day}
              </GradientBadge>
            </div>
            
            {prizePool && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">₹{prizePool.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-display font-bold gradient-text mb-3 group-hover:text-blue-300 transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Meta info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{startTime} - {endTime}</span>
            </div>
            
            {venue && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{venue}</span>
              </div>
            )}
            
            {teamSize && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Team Size: {teamSize.min === teamSize.max ? teamSize.min : `${teamSize.min}-${teamSize.max}`}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-sm">
              <span className="text-gray-400">Fee: </span>
              <span className="text-white font-semibold">₹{registrationFee}</span>
            </div>
            
            {maxParticipants && (
              <div className="text-sm">
                <span className="text-gray-400">{registrationCount}/{maxParticipants} </span>
                <span className="text-gray-500">registered</span>
              </div>
            )}
          </div>

          {/* Hover indicator */}
          <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View Details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
};

export default EventCard;
