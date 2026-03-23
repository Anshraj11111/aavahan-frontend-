import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useEvents } from '../../../contexts/EventsContext';
import collegeBuilding from '../../../assets/images/college.png';

const NewFeaturedEventsSection = () => {
  const { events } = useEvents();
  
  // Get events grouped by day
  const day1Events = events.filter(e => e.day === 'Day 1').slice(0, 2);
  const day2Events = events.filter(e => e.day === 'Day 2').slice(0, 2);
  const day3Events = events.filter(e => e.day === 'Day 3').slice(0, 2);
  
  const allDayEvents = [
    { day: 'DAY', dayNum: '1', date: 'April 1', events: day1Events },
    { day: 'DAY', dayNum: '2', date: 'April 2', events: day2Events },
    { day: 'DAY', dayNum: '3', date: 'April 3', events: day3Events }
  ].filter(d => d.events.length > 0);

  if (allDayEvents.length === 0) return null;

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

      {/* College Building Background - Very Subtle */}
      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 opacity-5 pointer-events-none">
        <img 
          src={collegeBuilding} 
          alt="College Building" 
          className="w-full h-full object-contain object-bottom"
        />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md text-purple-400 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-purple-400/30">
              <Sparkles className="w-4 h-4" />
              <span>FEATURED EVENTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Event <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Timeline</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 shadow-lg shadow-purple-500/50" />
          </div>
          <Link
            to="/events"
            className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm transition-colors group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {allDayEvents.map((dayGroup, dayIndex) => (
            <div key={dayIndex}>
              {dayGroup.events.map((event, eventIndex) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-blue-900/30 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
                >
                  <div className="grid md:grid-cols-12 gap-0">
                    {/* Left - Day Badge with Gradient */}
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-6 flex flex-col items-center justify-center text-white relative overflow-hidden">
                      {/* Decorative Circle */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                      
                      <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">{dayGroup.day}</div>
                        <div className="text-5xl font-black mb-1">{dayGroup.dayNum}</div>
                        <div className="text-xs font-semibold opacity-90">{dayGroup.date}</div>
                      </div>
                    </div>

                    {/* Middle - Event Details */}
                    <div className="md:col-span-7 p-6 bg-blue-900/40 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 bg-blue-500/30 backdrop-blur-md text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
                              <Clock className="w-3 h-3" />
                              <span>{event.startTime} — {event.endTime}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-black text-white mb-2 hover:text-cyan-400 transition-colors">
                            {event.title}
                          </h3>
                          
                          <p className="text-gray-100 text-base mb-4 line-clamp-2 leading-relaxed font-semibold">
                            {event.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Category Tag */}
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-black shadow-md">
                          {event.category === 'technical' ? '💻 Coding' : event.category === 'cultural' ? '🎭 Cultural' : '💡 Innovation'}
                        </span>
                        
                        {/* Event Type */}
                        <span className="px-3 py-1.5 bg-purple-500/40 backdrop-blur-md text-white rounded-lg text-sm font-black border-2 border-purple-400/40">
                          {event.eventType === 'team' ? '👥 Team Event' : '👤 Solo Event'}
                        </span>

                        {/* Venue */}
                        <div className="flex items-center gap-1 text-sm text-white bg-blue-900/50 backdrop-blur-md px-3 py-1.5 rounded-lg border-2 border-blue-400/40">
                          <MapPin className="w-4 h-4" />
                          <span className="font-bold">{event.venue}</span>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center gap-1 text-sm text-white bg-blue-900/50 backdrop-blur-md px-3 py-1.5 rounded-lg border-2 border-blue-400/40">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">{event.currentRegistrations || 0}/{event.maxParticipants}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right - Register Button */}
                    <div className="md:col-span-3 p-6 flex items-center justify-center bg-blue-900/20 backdrop-blur-sm">
                      <Link
                        to={`/events/${event.slug}`}
                        className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 hover:scale-105 w-full text-center"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewFeaturedEventsSection;
