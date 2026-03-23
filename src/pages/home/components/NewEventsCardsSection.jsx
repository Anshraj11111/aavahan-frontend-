import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Trophy, ArrowRight, Star, Zap } from 'lucide-react';
import { useEvents } from '../../../contexts/EventsContext';

const NewEventsCardsSection = () => {
  const { events } = useEvents();
  
  const featuredEvents = events.slice(0, 3);

  if (featuredEvents.length === 0) return null;

  return (
    <section className="py-20 relative bg-gradient-to-br from-[#0f1f3d] via-[#0a1628] to-[#1a2744]">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md text-cyan-400 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-blue-400/30">
            <Star className="w-4 h-4" fill="currentColor" />
            <span>POPULAR EVENTS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Explore <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Amazing Events</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full shadow-lg shadow-blue-500/50" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-3">
                {/* Event Image with Overlay */}
                <div className="relative h-52 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 overflow-hidden">
                  {event.posterImage ? (
                    <img 
                      src={event.posterImage} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-cyan-600/30">
                      <Trophy className="w-20 h-20 text-cyan-400/80" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
                      event.category === 'cultural' 
                        ? 'bg-pink-500 text-white' 
                        : event.category === 'technical'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {event.category === 'cultural' ? '🎭 Cultural' : event.category === 'technical' ? '💻 Technical' : '💡 Innovation'}
                    </div>
                  </div>

                  {/* Day Badge - Bottom Left */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-cyan-400/95 backdrop-blur-md text-slate-900 rounded-full text-xs font-bold shadow-lg">
                    {event.day}
                  </div>

                  {/* Prize Badge - Top Right */}
                  {event.prizePool && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                      ₹{event.prizePool}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-white mb-3 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-100 text-base mb-4 line-clamp-2 leading-relaxed font-semibold">{event.shortDescription}</p>
                  
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-sm text-white">
                      <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="font-bold">{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-white">
                      <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="font-bold">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-white">
                      <Users className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="font-bold">{event.currentRegistrations || 0}/{event.maxParticipants} Registered</span>
                    </div>
                  </div>

                  <Link
                    to="/events"
                    className="block text-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-blue-500/70 group-hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-blue-900/50 backdrop-blur-md hover:bg-blue-800/50 text-cyan-400 font-bold py-3 px-8 rounded-xl border-2 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewEventsCardsSection;
