import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Trophy, Download, Plus, Star, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DAY_INFO } from '../../constants';
import { formatDate, formatCurrency } from '../../utils';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, scaleUp, slideInLeft } from '../../lib/animations';
import LightweightBackground from '../../components/backgrounds/LightweightBackground';
import { useEvents } from '../../contexts/EventsContext';
import RegistrationModal from '../../components/modals/RegistrationModal';

// @ts-ignore - Image import
import collegeBuilding from '../../assets/images/college.png';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);  // Track which event is expanded
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);  // Registration modal state
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);  // Selected event for registration
  const { events, loading: isLoading } = useEvents();  // Use EventsContext instead of separate API call

  // Group events by day
  const allEvents = events || [];
  
  // Convert selectedDay number to "Day X" format for matching
  const dayString = `Day ${selectedDay}`;
  
  const schedule = Array.isArray(allEvents) ? allEvents.reduce((acc, event) => {
    if (!acc[event.day]) {
      acc[event.day] = [];
    }
    acc[event.day].push(event);
    return acc;
  }, {} as { [key: string]: any[] }) : {};
  
  const dayEvents = schedule[dayString] || [];

  // Sort events by start time
  const sortedEvents = [...dayEvents].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden">
      {/* Premium Animated Background */}
      <LightweightBackground />

      {/* Header with College Building */}
      <motion.section 
        className="py-24 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* College Building Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegeBuilding} 
            alt="Shri Ram Group College" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/95 to-navy-950" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-8 leading-tight tracking-tight"
              style={{
                textShadow: "4px 4px 8px rgba(0,0,0,0.9)"
              }}
            >
              SCHEDULE
            </motion.h1>
            
            <motion.div 
              variants={fadeInUp}
              className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto mb-8 rounded-full"
            />
            
            <motion.p 
              variants={fadeInUp}
              className="text-white text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-bold"
            >
              Plan your Tech Fest 2026 experience with our comprehensive schedule. 
              Three days of innovation, culture, and celebration await you.
            </motion.p>
          </div>
          
          {/* Enhanced Day Selector with Premium Design */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center mb-16"
          >
            <div className="glass-panel p-2 rounded-3xl border border-white/20 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                {Object.entries(DAY_INFO).map(([day, info], index) => (
                  <motion.button
                    key={day}
                    onClick={() => setSelectedDay(Number(day))}
                    className={`px-8 py-6 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden min-w-[200px] ${
                      selectedDay === Number(day)
                        ? 'text-white shadow-2xl'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedDay === Number(day) && (
                      <motion.div
                        layoutId="activeDay"
                        className={`absolute inset-0 bg-gradient-to-br ${
                          index === 0 ? 'from-blue-500 via-blue-600 to-cyan-500' :
                          index === 1 ? 'from-purple-500 via-purple-600 to-pink-500' :
                          'from-green-500 via-emerald-600 to-teal-500'
                        } rounded-2xl shadow-lg`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
                          animate={{
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    )}
                    <div className="relative z-10 text-center">
                      <div className="font-bold text-2xl mb-1">Day {day}</div>
                      <div className="text-sm opacity-90 font-medium">{info.title}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(info.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    </div>
                    
                    {/* Decorative corner accent */}
                    {selectedDay === Number(day) && (
                      <motion.div
                        className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Day Info Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDay}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass-panel p-10 md:p-16 rounded-3xl mb-16 text-center relative overflow-hidden border border-white/20 backdrop-blur-xl"
            >
              {/* Animated Background Gradient */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${
                  selectedDay === 1 ? 'from-blue-500/20 via-cyan-500/10 to-transparent' :
                  selectedDay === 2 ? 'from-purple-500/20 via-pink-500/10 to-transparent' :
                  'from-green-500/20 via-emerald-500/10 to-transparent'
                } rounded-3xl`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl" />
              
              <div className="relative z-10 max-w-4xl mx-auto">
                {/* Day Badge */}
                <motion.div 
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${
                    selectedDay === 1 ? 'from-blue-500 to-cyan-500' :
                    selectedDay === 2 ? 'from-purple-500 to-pink-500' :
                    'from-green-500 to-emerald-500'
                  } mb-8 shadow-2xl relative overflow-hidden`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      '0 10px 40px rgba(59,130,246,0.3)',
                      '0 10px 60px rgba(139,92,246,0.5)',
                      '0 10px 40px rgba(59,130,246,0.3)'
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                  <span className="text-white font-black text-4xl relative z-10">{selectedDay}</span>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl lg:text-5xl font-bold text-white mb-4"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)"
                  }}
                  animate={{
                    textShadow: [
                      "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
                      "2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.5)",
                      "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Day {selectedDay}: {DAY_INFO[selectedDay as keyof typeof DAY_INFO].title}
                </motion.h2>
                
                <motion.p 
                  className={`font-bold mb-6 text-2xl ${
                    selectedDay === 1 ? 'text-blue-400' :
                    selectedDay === 2 ? 'text-purple-400' :
                    'text-green-400'
                  }`}
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {DAY_INFO[selectedDay as keyof typeof DAY_INFO].theme}
                </motion.p>
                
                <div className="glass-panel px-6 py-3 rounded-xl inline-block mb-6 border border-white/20">
                  <p className="text-white font-semibold text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {formatDate(DAY_INFO[selectedDay as keyof typeof DAY_INFO].date, 'long')}
                  </p>
                </div>
                
                <p className="text-gray-100 leading-relaxed text-lg max-w-3xl mx-auto font-semibold">
                  {DAY_INFO[selectedDay as keyof typeof DAY_INFO].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Schedule Timeline */}
      <section className="pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {[...Array(5)].map((_, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="glass-panel p-8 rounded-xl animate-pulse"
                >
                  <div className="flex items-start space-x-6">
                    <div className="bg-white/10 w-24 h-20 rounded-xl" />
                    <div className="flex-1 space-y-4">
                      <div className="bg-white/10 h-6 rounded w-3/4" />
                      <div className="bg-white/10 h-4 rounded w-1/2" />
                      <div className="bg-white/10 h-4 rounded w-2/3" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : sortedEvents.length === 0 ? (
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center py-20"
            >
              <div className="glass-panel p-12 rounded-2xl max-w-2xl mx-auto">
                <Calendar className="w-32 h-32 text-gray-600 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-white mb-6">
                  No Events Scheduled
                </h3>
                <p className="text-gray-100 text-xl leading-relaxed font-semibold">
                  Events for Day {selectedDay} will be announced soon. Stay tuned for exciting updates!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Timeline Line with Gradient */}
              <div className={`absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b ${
                selectedDay === 1 ? 'from-blue-500 via-cyan-500 to-blue-500' :
                selectedDay === 2 ? 'from-purple-500 via-pink-500 to-purple-500' :
                'from-green-500 via-emerald-500 to-green-500'
              } hidden lg:block rounded-full shadow-lg`}>
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  animate={{
                    y: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>

              <div className="space-y-8">
                <AnimatePresence>
                  {sortedEvents.map((event, index) => {
                    const isExpanded = expandedEvent === event._id;
                    
                    return (
                    <motion.div
                      key={event._id}
                      variants={slideInLeft}
                      className="relative"
                    >
                      {/* Timeline Dot with Pulse Effect */}
                      <motion.div 
                        className={`absolute left-8 w-8 h-8 bg-gradient-to-br ${
                          selectedDay === 1 ? 'from-blue-500 to-cyan-500' :
                          selectedDay === 2 ? 'from-purple-500 to-pink-500' :
                          'from-green-500 to-emerald-500'
                        } rounded-full border-4 border-navy-950 hidden lg:block z-10 shadow-2xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            '0 0 20px rgba(59,130,246,0.5)',
                            '0 0 40px rgba(139,92,246,0.8)',
                            '0 0 20px rgba(59,130,246,0.5)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/30 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      </motion.div>

                      {/* Event Card - Clickable to Expand */}
                      <motion.div 
                        className="lg:ml-20 glass-panel p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden border border-white/20 backdrop-blur-xl cursor-pointer"
                        whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
                        onClick={() => setExpandedEvent(isExpanded ? null : event._id)}
                      >
                        {/* Background Gradient on Hover */}
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br ${
                            event.category === 'cultural' 
                              ? 'from-pink-500/20 via-purple-500/10 to-transparent' 
                              : 'from-blue-500/20 via-cyan-500/10 to-transparent'
                          } opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                          animate={{
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Decorative Corner Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${
                          selectedDay === 1 ? 'from-blue-500/20' :
                          selectedDay === 2 ? 'from-purple-500/20' :
                          'from-green-500/20'
                        } to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                          {/* Time with Enhanced Design */}
                          <div className="text-center lg:text-left">
                            <motion.div 
                              className={`inline-block glass-panel px-6 py-5 rounded-2xl bg-gradient-to-br ${
                                selectedDay === 1 ? 'from-blue-500/30 to-cyan-500/20 border-blue-400/40' :
                                selectedDay === 2 ? 'from-purple-500/30 to-pink-500/20 border-purple-400/40' :
                                'from-green-500/30 to-emerald-500/20 border-green-400/40'
                              } border-2 backdrop-blur-xl shadow-lg relative overflow-hidden`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/10"
                                animate={{
                                  opacity: [0, 0.2, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                              <div className={`flex items-center space-x-2 mb-2 ${
                                selectedDay === 1 ? 'text-blue-300' :
                                selectedDay === 2 ? 'text-purple-300' :
                                'text-green-300'
                              } relative z-10`}>
                                <Clock size={20} />
                                <span className="font-black text-xl">{event.startTime}</span>
                              </div>
                              <div className="text-gray-300 text-sm font-medium relative z-10">
                                to {event.endTime}
                              </div>
                            </motion.div>
                          </div>

                          {/* Event Details with Enhanced Typography */}
                          <div className="lg:col-span-4">
                            <div className="flex flex-wrap items-start gap-3 mb-5">
                              <motion.span 
                                className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg ${
                                  event.category === 'cultural' 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                }`}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                              >
                                {event.category === 'cultural' ? '🎭 Cultural' : '💻 Technical'}
                              </motion.span>
                              {event.featured && (
                                <motion.span 
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg"
                                  whileHover={{ scale: 1.1 }}
                                  animate={{
                                    boxShadow: [
                                      '0 0 20px rgba(251,191,36,0.5)',
                                      '0 0 30px rgba(251,191,36,0.8)',
                                      '0 0 20px rgba(251,191,36,0.5)'
                                    ]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity
                                  }}
                                >
                                  <Star size={16} className="mr-1" fill="currentColor" />
                                  Featured
                                </motion.span>
                              )}
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300"
                                style={{
                                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                                }}>
                              {event.title}
                            </h3>
                            
                            <p className="text-gray-300 mb-6 leading-relaxed text-base">
                              {event.shortDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                              <motion.div 
                                className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 glass-panel px-4 py-3 rounded-xl"
                                whileHover={{ scale: 1.05, x: 5 }}
                              >
                                <MapPin size={18} className="text-blue-400" />
                                <span className="font-medium">{event.venue}</span>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 glass-panel px-4 py-3 rounded-xl"
                                whileHover={{ scale: 1.05, x: 5 }}
                              >
                                <Users size={18} className="text-purple-400" />
                                <span className="font-medium">
                                  {event.participationType === 'team' ? '👥 Team Event' : '👤 Solo Event'}
                                </span>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 glass-panel px-4 py-3 rounded-xl"
                                whileHover={{ scale: 1.05, x: 5 }}
                              >
                                <Trophy size={18} className="text-yellow-400" />
                                <span className="font-medium">
                                  {event.entryFee > 0 ? `💰 ${formatCurrency(event.entryFee)}` : '🎉 Free Entry'}
                                </span>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 glass-panel px-4 py-3 rounded-xl"
                                whileHover={{ scale: 1.05, x: 5 }}
                              >
                                <Award size={18} className="text-green-400" />
                                <span className="font-medium">
                                  {event.currentRegistrations}/{event.maxRegistrations} registered
                                </span>
                              </motion.div>
                            </div>

                            {/* Expandable Details Section */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-white/20 pt-6 mt-6"
                                >
                                  {/* Full Description */}
                                  {event.fullDescription && (
                                    <div className="mb-6">
                                      <h4 className="text-xl font-bold text-white mb-3">About This Event</h4>
                                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                        {event.fullDescription}
                                      </p>
                                    </div>
                                  )}

                                  {/* Rules */}
                                  {event.rules && event.rules.length > 0 && (
                                    <div className="mb-6">
                                      <h4 className="text-xl font-bold text-white mb-3">Rules & Guidelines</h4>
                                      <ul className="space-y-2">
                                        {event.rules.map((rule: string, idx: number) => (
                                          <li key={idx} className="flex items-start space-x-3 text-gray-300">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>{rule}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Eligibility */}
                                  {event.eligibility && (
                                    <div className="mb-6">
                                      <h4 className="text-xl font-bold text-white mb-3">Eligibility</h4>
                                      <p className="text-gray-300 leading-relaxed">{event.eligibility}</p>
                                    </div>
                                  )}

                                  {/* Prize Details */}
                                  {event.prizeDetails && (
                                    <div className="mb-6">
                                      <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                                        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                                        Prize Details
                                      </h4>
                                      <p className="text-gray-300 leading-relaxed">{event.prizeDetails}</p>
                                    </div>
                                  )}

                                  {/* Coordinator Info */}
                                  {event.coordinatorName && (
                                    <div className="mb-6">
                                      <h4 className="text-xl font-bold text-white mb-3">Contact Coordinator</h4>
                                      <div className="glass-panel p-4 rounded-xl space-y-2">
                                        <p className="text-white font-semibold">{event.coordinatorName}</p>
                                        {event.coordinatorPhone && (
                                          <p className="text-gray-300">📞 {event.coordinatorPhone}</p>
                                        )}
                                        {event.coordinatorEmail && (
                                          <p className="text-gray-300">✉️ {event.coordinatorEmail}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Register Button - Only show for non-schedule-only events */}
                                  {!event.isScheduleOnly && 
                                   event.status === 'published' && 
                                   (!event.maxRegistrations || event.currentRegistrations < event.maxRegistrations) &&
                                   (!event.registrationDeadline || new Date(event.registrationDeadline) > new Date()) && (
                                    <motion.div 
                                      whileHover={{ scale: 1.05 }} 
                                      whileTap={{ scale: 0.95 }}
                                      className="mt-6"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();  // Prevent card collapse
                                          setSelectedEvent(event);
                                          setShowRegistrationModal(true);
                                        }}
                                        className={`w-full bg-gradient-to-r ${
                                          selectedDay === 1 ? 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' :
                                          selectedDay === 2 ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                                          'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                        } text-white font-bold py-4 px-8 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2`}
                                      >
                                        <Plus size={20} />
                                        <span>Register Now</span>
                                      </button>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Click to Expand Indicator */}
                            <div className="text-center mt-4">
                              <span className="text-gray-400 text-sm font-medium">
                                {isExpanded ? '▲ Click to collapse' : '▼ Click to see full details'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Download Schedule */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-display font-bold text-white mb-4">
              Take the Schedule 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> With You</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Download the complete Tech Fest 2026 schedule and never miss an event. 
              Available in multiple formats for easy viewing on any device.
            </p>
          </motion.div>
          
          <motion.div 
            variants={scaleUp}
            className="glass-panel p-8 md:p-12 rounded-2xl max-w-4xl mx-auto relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">PDF Schedule</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Complete 3-day schedule with event details, timings, and venue information in a beautifully formatted PDF.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Calendar Integration</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Add all events directly to your Google Calendar, Outlook, or Apple Calendar with automatic reminders.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Live Updates</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Get real-time notifications about schedule changes, new events, and important announcements.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={20} />
                    <span>Download PDF Schedule</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar size={20} />
                    <span>Add to Calendar</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full glass-panel border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-white/10 flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap size={20} />
                    <span>Enable Notifications</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default SchedulePage;
