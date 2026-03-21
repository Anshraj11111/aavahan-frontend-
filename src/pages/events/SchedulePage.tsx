import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Users, Trophy, Download, Plus, Star, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsService } from '../../services/events';
import { DAY_INFO } from '../../constants';
import { formatDate, formatCurrency } from '../../utils';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, scaleUp, slideInLeft } from '../../lib/animations';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['day-schedule'],
    queryFn: () => eventsService.getDaySchedule(),
    staleTime: 5 * 60 * 1000,
  });

  // Group events by day
  const allEvents = scheduleData?.data || [];
  const schedule = Array.isArray(allEvents) ? allEvents.reduce((acc, event) => {
    if (!acc[event.day]) {
      acc[event.day] = [];
    }
    acc[event.day].push(event);
    return acc;
  }, {} as { [key: number]: any[] }) : {};
  
  const dayEvents = schedule[selectedDay] || [];

  // Sort events by start time
  const sortedEvents = [...dayEvents].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-32 left-20 w-96 h-96 bg-blue-500 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-64 right-32 w-80 h-80 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-cyan-500 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-400 font-medium mb-6">
                Tech Fest 2026 Schedule
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight"
            >
              Event 
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Schedule
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed"
            >
              Plan your Tech Fest 2026 experience with our comprehensive schedule. 
              Three days of innovation, culture, and celebration await you.
            </motion.p>
          </div>
          {/* Day Selector */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center mb-16"
          >
            <div className="glass-panel p-3 rounded-2xl">
              <div className="flex space-x-3">
                {Object.entries(DAY_INFO).map(([day, info], index) => (
                  <motion.button
                    key={day}
                    onClick={() => setSelectedDay(Number(day))}
                    className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                      selectedDay === Number(day)
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedDay === Number(day) && (
                      <motion.div
                        layoutId="activeDay"
                        className={`absolute inset-0 bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-cyan-500' :
                          index === 1 ? 'from-purple-500 to-pink-500' :
                          'from-green-500 to-emerald-500'
                        } rounded-xl`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 text-center">
                      <div className="font-bold text-lg">Day {day}</div>
                      <div className="text-sm opacity-80">{info.title}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Day Info */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDay}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass-panel p-8 md:p-12 rounded-2xl mb-16 text-center relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className={`absolute inset-0 bg-gradient-to-r ${
                selectedDay === 1 ? 'from-blue-500/10 to-cyan-500/10' :
                selectedDay === 2 ? 'from-purple-500/10 to-pink-500/10' :
                'from-green-500/10 to-emerald-500/10'
              } rounded-2xl`} />
              
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${
                  selectedDay === 1 ? 'from-blue-500 to-cyan-500' :
                  selectedDay === 2 ? 'from-purple-500 to-pink-500' :
                  'from-green-500 to-emerald-500'
                } mb-6`}>
                  <span className="text-white font-bold text-2xl">{selectedDay}</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Day {selectedDay}: {DAY_INFO[selectedDay as keyof typeof DAY_INFO].title}
                </h2>
                
                <p className={`font-semibold mb-4 text-lg ${
                  selectedDay === 1 ? 'text-blue-400' :
                  selectedDay === 2 ? 'text-purple-400' :
                  'text-green-400'
                }`}>
                  {DAY_INFO[selectedDay as keyof typeof DAY_INFO].theme}
                </p>
                
                <p className="text-gray-300 mb-6 text-lg">
                  {formatDate(DAY_INFO[selectedDay as keyof typeof DAY_INFO].date, 'long')}
                </p>
                
                <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
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
                <h3 className="text-3xl font-bold text-white mb-6">
                  No Events Scheduled
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
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
              {/* Timeline Line */}
              <div className={`absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b ${
                selectedDay === 1 ? 'from-blue-500 to-cyan-500' :
                selectedDay === 2 ? 'from-purple-500 to-pink-500' :
                'from-green-500 to-emerald-500'
              } hidden lg:block rounded-full`} />

              <div className="space-y-8">
                <AnimatePresence>
                  {sortedEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      variants={slideInLeft}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-8 w-8 h-8 bg-gradient-to-r ${
                        selectedDay === 1 ? 'from-blue-500 to-cyan-500' :
                        selectedDay === 2 ? 'from-purple-500 to-pink-500' :
                        'from-green-500 to-emerald-500'
                      } rounded-full border-4 border-navy-950 hidden lg:block z-10 shadow-lg`} />

                      {/* Event Card */}
                      <motion.div 
                        className="lg:ml-20 glass-panel p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                        whileHover={{ y: -5 }}
                      >
                        {/* Background Gradient on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${
                          event.category === 'cultural' 
                            ? 'from-pink-500/10 to-purple-500/10' 
                            : 'from-blue-500/10 to-cyan-500/10'
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                          {/* Time */}
                          <div className="text-center lg:text-left">
                            <div className={`inline-block glass-panel px-6 py-4 rounded-xl bg-gradient-to-r ${
                              selectedDay === 1 ? 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' :
                              selectedDay === 2 ? 'from-purple-500/20 to-pink-500/20 border-purple-500/30' :
                              'from-green-500/20 to-emerald-500/20 border-green-500/30'
                            } border`}>
                              <div className={`flex items-center space-x-2 mb-2 ${
                                selectedDay === 1 ? 'text-blue-400' :
                                selectedDay === 2 ? 'text-purple-400' :
                                'text-green-400'
                              }`}>
                                <Clock size={18} />
                                <span className="font-bold text-lg">{event.startTime}</span>
                              </div>
                              <div className="text-gray-400 text-sm">
                                to {event.endTime}
                              </div>
                            </div>
                          </div>
                          {/* Event Details */}
                          <div className="lg:col-span-3">
                            <div className="flex items-start space-x-3 mb-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                event.category === 'cultural' 
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              }`}>
                                {event.category === 'cultural' ? 'Cultural' : 'Technical'}
                              </span>
                              {event.featured && (
                                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center">
                                  <Star size={14} className="mr-1" />
                                  Featured
                                </span>
                              )}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors duration-300">
                              {event.title}
                            </h3>
                            
                            <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed">
                              {event.shortDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                <MapPin size={18} className="text-blue-400" />
                                <span>{event.venue}</span>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                <Users size={18} className="text-purple-400" />
                                <span>
                                  {event.participationType === 'team' ? 'Team Event' : 'Solo Event'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                <Trophy size={18} className="text-yellow-400" />
                                <span>
                                  {event.entryFee > 0 ? formatCurrency(event.entryFee) : 'Free Entry'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                <Award size={18} className="text-green-400" />
                                <span>
                                  {event.currentRegistrations}/{event.maxRegistrations} registered
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-4">
                            <Link
                              to={`/events/${event.slug}`}
                              className="glass-panel px-6 py-3 text-center text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40"
                            >
                              View Details
                            </Link>
                            
                            {event.status === 'published' && 
                             event.currentRegistrations < event.maxRegistrations &&
                             new Date(event.registrationDeadline) > new Date() && (
                              <Link
                                to={`/registration/${event._id}`}
                                className={`bg-gradient-to-r ${
                                  selectedDay === 1 ? 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' :
                                  selectedDay === 2 ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                                  'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                } text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
                              >
                                <Plus size={16} />
                                <span>Register Now</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
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
    </div>
  );
};

export default SchedulePage;