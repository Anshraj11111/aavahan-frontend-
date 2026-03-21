import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Trophy, Star } from 'lucide-react';
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
    entryFee,
    prizeDetails,
    shortDescription,
    currentRegistrations = 0,
    maxRegistrations,
    bannerImage,
    featured: isFeatured
  } = event;

  const categoryColors = {
    'technical': 'blue',
    'cultural': 'purple',
    'sports': 'cyan',
    'workshop': 'gold'
  };

  const dayColors = {
    1: 'blue',
    2: 'cyan', 
    3: 'purple'
  };

  // Calculate registration percentage
  const registrationPercentage = maxRegistrations ? (currentRegistrations / maxRegistrations) * 100 : 0;

  return (
    <Link to={`/events/${_id}`}>
      <motion.div variants={cardHover} whileHover="hover">
        <GlassCard 
          padding={featured ? 'lg' : 'md'} 
          glow={featured || isFeatured}
          hover={false}
          className="h-full group overflow-hidden"
        >
          {/* Event Image */}
          {bannerImage && (
            <div className="relative mb-4 -mx-6 -mt-6 overflow-hidden">
              <img 
                src={bannerImage} 
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              {isFeatured && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/90 text-yellow-900 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                </div>
              )}
              
              {/* Category and Day Badges */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <GradientBadge variant={categoryColors[category] || 'blue'} size="sm">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </GradientBadge>
                <GradientBadge variant={dayColors[day] || 'blue'} size="sm">
                  Day {day}
                </GradientBadge>
              </div>
            </div>
          )}

          {/* Header - Only show badges if no image */}
          {!bannerImage && (
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex flex-wrap gap-2">
                <GradientBadge variant={categoryColors[category] || 'blue'} size="sm">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </GradientBadge>
                <GradientBadge variant={dayColors[day] || 'blue'} size="sm">
                  Day {day}
                </GradientBadge>
              </div>
              
              {isFeatured && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-semibold">Featured</span>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={`font-display font-bold gradient-text mb-3 group-hover:text-blue-300 transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h3>

          {/* Description */}
          {shortDescription && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {shortDescription}
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

          {/* Registration Progress */}
          {maxRegistrations && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Registrations</span>
                <span className="text-sm text-white font-medium">{currentRegistrations}/{maxRegistrations}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    registrationPercentage >= 90 ? 'bg-red-500' :
                    registrationPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${registrationPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-sm">
              <span className="text-gray-400">Entry Fee: </span>
              <span className="text-white font-semibold">₹{entryFee}</span>
            </div>
            
            {prizeDetails && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">Prizes</span>
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
