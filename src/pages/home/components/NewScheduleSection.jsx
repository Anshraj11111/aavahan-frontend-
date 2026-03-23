import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useEvents } from '../../../contexts/EventsContext';

const NewScheduleSection = () => {
  const { events } = useEvents();
  
  // Get first 2 events for preview
  const schedulePreview = events.slice(0, 2);

  if (schedulePreview.length === 0) return null;

  return (
    <section className="py-16 relative bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a2744]">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2">
              Schedule
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50" />
          </div>
          <Link
            to="/schedule"
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors"
          >
            View Full Schedule →
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {schedulePreview.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-900/30 backdrop-blur-md rounded-xl p-6 border border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Day Badge */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-3 shadow-md shadow-blue-500/50 flex-shrink-0">
                  <div className="text-xs text-white font-bold uppercase mb-1">{event.day}</div>
                  <div className="text-2xl font-black text-white">{event.day?.replace('Day ', '')}</div>
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-base text-white font-bold">
                      {event.startTime} — {event.endTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-2">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1.5 bg-blue-500/40 backdrop-blur-md rounded-md text-sm font-black text-white border-2 border-blue-400/40">
                      {event.category === 'technical' ? '💻 Coding' : event.category === 'cultural' ? '🎭 Cultural' : '💡 Innovation'}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-500/40 backdrop-blur-md rounded-md text-sm font-black text-white border-2 border-blue-400/40">
                      {event.eventType === 'team' ? '👥 Team' : '👤 Solo'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white font-bold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.currentRegistrations || 0}/{event.maxParticipants}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewScheduleSection;
