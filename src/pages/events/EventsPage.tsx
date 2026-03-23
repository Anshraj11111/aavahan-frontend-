import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, Trophy, Star, Zap, Award, Eye, UserPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../../services/events';
import { Event, EventFilters } from '../../types';
import { EVENT_CATEGORIES, DAY_INFO, DEPARTMENTS } from '../../constants';
import { fadeInUp, staggerContainer, scaleUp, slideInLeft, slideInRight } from '../../lib/animations';
import RegistrationModal from '../../components/modals/RegistrationModal';
import { useRegistrations } from '../../contexts/RegistrationContext';
import { useEvents } from '../../contexts/EventsContext';
import LightweightBackground from '../../components/backgrounds/LightweightBackground';

// @ts-ignore - Image import
import collegeBuilding from '../../assets/images/college.png';

const EventsPage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const { getRegistrationStats, getRegistrationsByEvent } = useRegistrations();
  const { events, loading } = useEvents();
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events as Event[];

    // Exclude schedule-only items from Events page
    filtered = filtered.filter((event: Event) => !event.isScheduleOnly);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((event: Event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((event: Event) => event.category === filters.category);
    }

    // Day filter
    if (filters.day) {
      const dayString = `Day ${filters.day}`;
      filtered = filtered.filter((event: Event) => event.day === dayString || event.day === filters.day);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filters, events]);

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getEventStatusColor = (event: Event) => {
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else if (registrationDeadline < now) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    } else {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getEventStatusText = (event: Event) => {
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'Full';
    } else if (registrationDeadline < now) {
      return 'Closed';
    } else {
      return 'Open';
    }
  };

  const canRegister = (event: Event) => {
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    return event.currentRegistrations < event.maxRegistrations && registrationDeadline > now;
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  // Get real-time registration stats from backend events (MongoDB)
  const registrationStats = useMemo(() => {
    const total = events.reduce((sum: number, event: Event) => sum + (event.currentRegistrations || 0), 0);
    return { total };
  }, [events]);

  // Events already have currentRegistrations from backend, no need to override
  const eventsWithRealCounts = filteredEvents;

  // Helper function to check if registration is available for updated events
  const canRegisterUpdated = (event: Event) => {
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    return event.currentRegistrations < event.maxRegistrations && registrationDeadline > now;
  };

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden" ref={containerRef}>
      {/* Premium Animated Background */}
      <LightweightBackground />

      {/* Header with College Building - Poster Style */}
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
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/95 to-navy-950" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Title Section - Poster Style */}
            <div className="text-center mb-16">
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-display font-black text-white mb-6 leading-tight tracking-tight"
                style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}
              >
                ALL EVENTS
              </motion.h1>
              
              <motion.div 
                variants={fadeInUp}
                className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto mb-8 rounded-full"
              />
              
              <motion.p 
                variants={fadeInUp}
                className="text-white text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-bold"
              >
                Explore competitions, cultural performances, and innovative challenges
              </motion.p>
            </div>

            {/* Search Bar - Poster Style */}
            <motion.form 
              variants={fadeInUp}
              onSubmit={handleSearch} 
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="glass-panel rounded-2xl p-2 border-2 border-white/30 backdrop-blur-xl">
                {/* Desktop Layout - Side by side */}
                <div className="hidden md:flex items-center relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events by name or description..."
                    className="w-full px-6 py-5 pl-14 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <motion.button
                    type="submit"
                    className="absolute right-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Search
                  </motion.button>
                </div>

                {/* Mobile Layout - Stacked */}
                <div className="md:hidden space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search events by name or description..."
                      className="w-full px-6 py-4 pl-12 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    Search
                  </motion.button>
                </div>
              </div>
            </motion.form>

            {/* Quick Stats - Poster Style */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-panel p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300 border-2 border-white/30 backdrop-blur-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {loading ? (
                    <div className="h-10 bg-white/10 rounded w-16 mx-auto animate-pulse" />
                  ) : (
                    filteredEvents.length
                  )}
                </div>
                <div className="text-white text-base font-black uppercase tracking-wide">Total Events</div>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300 border-2 border-white/30 backdrop-blur-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {loading ? (
                    <div className="h-10 bg-white/10 rounded w-16 mx-auto animate-pulse" />
                  ) : (
                    filteredEvents.filter(event => event.featured).length
                  )}
                </div>
                <div className="text-white text-base font-black uppercase tracking-wide">Featured</div>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300 border-2 border-white/30 backdrop-blur-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {loading ? (
                    <div className="h-10 bg-white/10 rounded w-16 mx-auto animate-pulse" />
                  ) : (
                    eventsWithRealCounts.filter(event => canRegisterUpdated(event)).length
                  )}
                </div>
                <div className="text-white text-base font-black uppercase tracking-wide">Open</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Filters */}
      <motion.section 
        className="py-8 border-b border-white/10 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <motion.button
              variants={fadeInUp}
              onClick={() => setShowFilters(!showFilters)}
              className="glass-panel px-6 py-3 rounded-xl flex items-center lg:hidden hover:scale-105 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-white">Filters</span>
            </motion.button>

            <motion.div 
              variants={fadeInUp}
              className={`${showFilters ? 'block' : 'hidden'} lg:block`}
            >
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.day || ''}
                  onChange={(e) => handleFilterChange('day', e.target.value ? parseInt(e.target.value) : '')}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                >
                  <option value="" className="bg-navy-900">All Days</option>
                  <option value="1" className="bg-navy-900">Day 1 - Cultural Day</option>
                  <option value="2" className="bg-navy-900">Day 2 - Technical Day</option>
                  <option value="3" className="bg-navy-900">Day 3 - Innovation Day</option>
                </select>

                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                >
                  <option value="" className="bg-navy-900">All Categories</option>
                  <option value="cultural" className="bg-navy-900">Cultural</option>
                  <option value="technical" className="bg-navy-900">Technical</option>
                </select>

                <motion.button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white flex items-center space-x-2 font-bold text-base"
            >
              <Sparkles className="w-5 h-5" />
              <span>{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Events Grid */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading Skeleton
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-white/10" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-8 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                    </div>
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-white/10 rounded-xl" />
                      <div className="flex-1 h-12 bg-white/10 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-20"
            >
              <div className="glass-panel p-12 rounded-2xl max-w-2xl mx-auto">
                <Calendar className="w-32 h-32 text-gray-600 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-white mb-6">No Events Found</h3>
                <p className="text-gray-100 text-xl leading-relaxed mb-8 font-semibold">
                  Try adjusting your filters or search criteria to discover amazing events.
                </p>
                <motion.button 
                  onClick={clearFilters} 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {eventsWithRealCounts.map((event, index) => (
                  <motion.div
                    key={event._id}
                    variants={scaleUp}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 relative"
                    whileHover={{ y: -8 }}
                  >
                    {/* Event Image */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                      {event.posterImage ? (
                        <img
                          src={event.posterImage}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                          <Trophy className="w-20 h-20 text-white/50" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getEventStatusColor(event)}`}>
                        {getEventStatusText(event)}
                      </div>

                      {/* Featured Badge */}
                      {event.featured && (
                        <motion.div 
                          className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium flex items-center space-x-1"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-3 h-3" />
                          <span>Featured</span>
                        </motion.div>
                      )}

                      {/* Day Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                        {typeof event.day === 'string' ? event.day : `Day ${event.day}`}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          event.category === 'cultural' 
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {event.category === 'cultural' ? 'Cultural' : 'Technical'}
                        </span>
                        <div className="text-gray-400 text-sm">
                          ₹{event.entryFee === 0 ? 'Free' : event.entryFee}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {event.title}
                      </h3>

                      <p className="text-gray-100 text-base mb-4 line-clamp-2 leading-relaxed font-semibold">
                        {event.shortDescription}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-white text-base font-semibold">
                          <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-white text-base font-semibold">
                          <Clock className="w-5 h-5 mr-2 text-purple-400" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center text-white text-base font-semibold">
                          <MapPin className="w-5 h-5 mr-2 text-green-400" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center text-white text-base font-semibold">
                          <Users className="w-5 h-5 mr-2 text-yellow-400" />
                          <span>{event.participationType === 'team' ? 'Team Event' : 'Solo Event'}</span>
                        </div>
                      </div>

                      {/* Registration Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-base mb-2">
                          <span className="text-white font-bold">Registrations</span>
                          <span className="text-white font-black">
                            {event.currentRegistrations}/{event.maxRegistrations}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full ${
                              event.category === 'cultural' 
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%` 
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Link
                          to={`/events/${event.slug}`}
                          className="flex-1 glass-panel px-4 py-3 text-center text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center space-x-2 group"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>View Details</span>
                        </Link>
                        
                        {canRegisterUpdated(event) ? (
                          <motion.button
                            onClick={() => handleRegisterClick(event)}
                            className={`flex-1 bg-gradient-to-r ${
                              event.category === 'cultural' 
                                ? 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                                : 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                            } text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span>Register</span>
                          </motion.button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 bg-gray-600/50 text-gray-400 font-medium py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            <span>Unavailable</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
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

export default EventsPage;