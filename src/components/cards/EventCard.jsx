import { motion } from 'framer-motion';
import { Clock, Users, MapPin, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardHover } from '../../lib/animations';

/**
 * EventCard Component - Poster Style Design
 * Card for displaying event information with glass morphism
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
    posterImage,
    bannerImage,
    featured: isFeatured
  } = event;

  // Use posterImage if available, fallback to bannerImage for backward compatibility
  const eventImage = posterImage || bannerImage;

  const registrationPercentage = maxRegistrations ? (currentRegistrations / maxRegistrations) * 100 : 0;

  return (
    <Link to={`/events/${_id}`}>
      <motion.div 
        variants={cardHover} 
        whileHover="hover"
        className="h-full"
      >
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/20 h-full group hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 hover:border-white/40 hover:shadow-glow-lg">
          {/* Event Image */}
          {eventImage && (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={eventImage} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              {isFeatured && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Featured
                  </div>
                </div>
              )}
              
              {/* Category and Day Badges */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                  category === 'cultural' 
                    ? 'bg-pink-500/80 text-white' 
                    : 'bg-blue-500/80 text-white'
                }`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-bold">
                  Day {day}
                </div>
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="p-6">
            {/* Header - Only show badges if no image */}
            {!eventImage && (
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    category === 'cultural' 
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                  <div className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold border border-white/20">
                    Day {day}
                  </div>
                </div>
                
                {isFeatured && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" fill="currentColor" />
                    <span className="text-sm font-semibold">Featured</span>
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className={`font-display font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 ${featured ? 'text-2xl' : 'text-xl'}`}>
              {title}
            </h3>

            {/* Description */}
            {shortDescription && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
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
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;
