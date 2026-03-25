import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Clock, Trophy, Star, Zap, Award, Eye, UserPlus, Sparkles, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, EventFilters } from '../../types';
import { fadeInUp, staggerContainer, scaleUp } from '../../lib/animations';
import { useRegistrations } from '../../contexts/RegistrationContext';
import { useEvents } from '../../contexts/EventsContext';
import toast from 'react-hot-toast';

// Lazy load heavy components
const RegistrationModal = lazy(() => import('../../components/modals/RegistrationModal'));

// @ts-ignore - Image import
import collegeBuilding from '../../assets/images/college.png';

const EventsPage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  // Remove filteredEvents state - now using useMemo
  // const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const { getRegistrationStats, getRegistrationsByEvent } = useRegistrations();
  const { events, loading } = useEvents();
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize filtered events to prevent unnecessary re-renders
  const filteredEvents = useMemo(() => {
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

    return filtered;
  }, [searchQuery, filters, events]);

  // Remove the old useEffect for filtering
  // useEffect(() => { ... }, [searchQuery, filters, events]);

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
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    } else {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getEventStatusText = (event: Event) => {
    const now = new Date();
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'Full';
    } else if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
      return 'Closed';
    } else {
      return 'Open';
    }
  };

  const canRegister = (event: Event) => {
    const now = new Date();
    // If no registration deadline, allow registration
    if (!event.registrationDeadline) {
      return event.currentRegistrations < event.maxRegistrations;
    }
    const registrationDeadline = new Date(event.registrationDeadline);
    return event.currentRegistrations < event.maxRegistrations && registrationDeadline > now;
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleViewDetailsClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
    // Scroll to top immediately when modal opens
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  // Close modal handler
  const handleCloseEventDetailsModal = () => {
    setShowEventDetailsModal(false);
    setSelectedEvent(null);
    // Unlock body scroll
    document.body.style.overflow = 'unset';
  };

  // Download event details as HTML
  const handleDownloadEventDetails = (event: Event) => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${event.title} - Event Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 900px; margin: 0 auto; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 30px; }
            h2 { color: #1e40af; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #1e40af; padding-left: 15px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
            .header h1 { color: white; border: none; margin: 0; }
            .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-right: 10px; margin-bottom: 10px; }
            .badge-cultural { background: #ec4899; color: white; }
            .badge-technical { background: #3b82f6; color: white; }
            .badge-games { background: #10b981; color: white; }
            .badge-featured { background: #f59e0b; color: white; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; }
            .info-label { font-weight: bold; color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .info-value { color: #1f2937; font-size: 16px; font-weight: 600; }
            .section { background: #f9fafb; padding: 25px; border-radius: 10px; margin: 20px 0; }
            .rules-list { list-style: none; padding: 0; }
            .rules-list li { padding: 12px; margin: 10px 0; background: white; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
            .progress-fill { background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${event.title}</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">${event.shortDescription}</p>
            <div style="margin-top: 15px;">
              <span class="badge badge-${event.category}">${event.category === 'cultural' ? '🎭 Cultural' : event.category === 'games' ? '🎮 Games' : '💻 Technical'}</span>
              <span class="badge" style="background: rgba(255,255,255,0.2);">${typeof event.day === 'string' ? event.day : `Day ${event.day}`}</span>
              ${event.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
            </div>
          </div>

          <h2>📅 Event Information</h2>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Date</div>
              <div class="info-value">${new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Time</div>
              <div class="info-value">${event.startTime} - ${event.endTime}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Venue</div>
              <div class="info-value">${event.venue}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Entry Fee</div>
              <div class="info-value">₹${event.entryFee === 0 ? 'Free' : event.entryFee}</div>
            </div>
          </div>

          ${event.fullDescription ? `
          <h2>📝 About This Event</h2>
          <div class="section">
            <p style="line-height: 1.8; margin: 0;">${event.fullDescription}</p>
          </div>
          ` : ''}

          <h2>👥 Participation Details</h2>
          <div class="section">
            <div class="info-grid">
              <div>
                <div class="info-label">Participation Type</div>
                <div class="info-value" style="text-transform: capitalize;">${event.participationType}</div>
              </div>
              ${event.participationType === 'team' ? `
              <div>
                <div class="info-label">Team Size</div>
                <div class="info-value">${event.minTeamSize} - ${event.maxTeamSize} members</div>
              </div>
              ` : ''}
              ${event.eligibility ? `
              <div>
                <div class="info-label">Eligibility</div>
                <div class="info-value">${event.eligibility}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <h2>📊 Registration Status</h2>
          <div class="section">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: bold;">Current Registrations:</span>
              <span style="font-weight: bold; font-size: 18px;">${event.currentRegistrations} / ${event.maxRegistrations}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%">
                ${Math.round((event.currentRegistrations / event.maxRegistrations) * 100)}%
              </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: ${
              event.currentRegistrations >= event.maxRegistrations ? '#fee2e2' : 
              new Date(event.registrationDeadline) < new Date() ? '#fef3c7' : '#dcfce7'
            }; border-radius: 8px; text-align: center; font-weight: bold; color: ${
              event.currentRegistrations >= event.maxRegistrations ? '#991b1b' : 
              new Date(event.registrationDeadline) < new Date() ? '#92400e' : '#166534'
            };">
              Status: ${
                event.currentRegistrations >= event.maxRegistrations ? 'FULL' : 
                new Date(event.registrationDeadline) < new Date() ? 'CLOSED' : 'OPEN'
              }
            </div>
          </div>

          ${event.rules && event.rules.length > 0 ? `
          <h2>⚡ Rules & Guidelines</h2>
          <div class="section">
            <ul class="rules-list">
              ${event.rules.filter((r: string) => r).map((rule: string, index: number) => `
                <li><strong>${index + 1}.</strong> ${rule}</li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${event.prizeDetails ? `
          <h2>🏆 Prize Details</h2>
          <div class="section">
            <p style="font-size: 18px; font-weight: 600; margin: 0; color: #1e40af;">${event.prizeDetails}</p>
          </div>
          ` : ''}

          ${event.coordinatorName ? `
          <h2>📞 Event Coordinator</h2>
          <div class="section">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">
                ${event.coordinatorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 5px;">${event.coordinatorName}</div>
                ${event.coordinatorPhone ? `<div style="color: #6b7280; margin: 5px 0;">📞 +91 ${event.coordinatorPhone}</div>` : ''}
                ${event.coordinatorEmail ? `<div style="color: #6b7280; margin: 5px 0;">✉️ ${event.coordinatorEmail}</div>` : ''}
              </div>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p><strong>Aavhaan 2026</strong> - Technical & Cultural Festival</p>
            <p>Shri Ram Group of Colleges</p>
            <p>Downloaded on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_')}_Details.html`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Event details downloaded successfully!');
    } catch (error) {
      console.error('Failed to download event details:', error);
      toast.error('Failed to download event details');
    }
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 relative overflow-hidden" ref={containerRef}>
      {/* Simple gradient background - no heavy animations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-navy-950 to-navy-950" />
      
      {/* Header with College Building - Poster Style */}
      <motion.section className="py-24 relative z-10">
        {/* College Building Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegeBuilding} 
            alt="Shri Ram Group College" 
            className="w-full h-full object-cover opacity-15"
            loading="eager"
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
                  <option value="games" className="bg-navy-900">Games</option>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    className="glass-panel rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative"
                  >
                    {/* Event Image */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                      {event.posterImage ? (
                        <img
                          src={event.posterImage}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                          <Trophy className="w-20 h-20 text-white/50" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Featured Badge */}
                      {event.featured && (
                        <motion.div 
                          className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium flex items-center space-x-1"
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
                            : event.category === 'games'
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {event.category === 'cultural' ? 'Cultural' : event.category === 'games' ? 'Games' : 'Technical'}
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
                        {event.prizeDetails && (
                          <div className="flex items-center text-yellow-300 text-base font-bold">
                            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                            <span>{event.prizeDetails}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetailsClick(event)}
                          className="flex-1 glass-panel px-4 py-3 text-center text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center space-x-2 group"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>View Details</span>
                        </button>
                        
                        <button
                          onClick={() => handleRegisterClick(event)}
                          className={`flex-1 bg-gradient-to-r ${
                            event.category === 'cultural' 
                              ? 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                              : event.category === 'games'
                              ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                              : 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                          } text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group`}
                        >
                          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Register</span>
                        </button>
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
      <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      </Suspense>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetailsModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] overflow-y-auto pt-20"
            onClick={handleCloseEventDetailsModal}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="min-h-screen flex items-start justify-center p-4 pb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-navy-900 rounded-2xl max-w-5xl w-full border-2 border-white/20 shadow-2xl my-8 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
              {/* Header with Event Image */}
              <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
                {selectedEvent.posterImage ? (
                  <img
                    src={selectedEvent.posterImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                    <Trophy className="w-32 h-32 text-white/50" />
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={handleCloseEventDetailsModal}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Download Button */}
                <button
                  onClick={() => handleDownloadEventDetails(selectedEvent)}
                  className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 backdrop-blur-sm text-white rounded-full transition-colors flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Download Details</span>
                  <span className="sm:hidden">Download</span>
                </button>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                    <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                      selectedEvent.category === 'cultural' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                        : selectedEvent.category === 'games'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      {selectedEvent.category === 'cultural' ? '🎭 Cultural' : selectedEvent.category === 'games' ? '🎮 Games' : '💻 Technical'}
                    </span>
                    <span className="px-2 sm:px-4 py-1 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-bold">
                      {typeof selectedEvent.day === 'string' ? selectedEvent.day : `Day ${selectedEvent.day}`}
                    </span>
                    {selectedEvent.featured && (
                      <span className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs sm:text-sm font-bold flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2">{selectedEvent.title}</h2>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg font-semibold">{selectedEvent.shortDescription}</p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Date</p>
                        <p className="text-white font-bold">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Time</p>
                        <p className="text-white font-bold text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Venue</p>
                        <p className="text-white font-bold">{selectedEvent.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Entry Fee</p>
                        <p className="text-white font-bold">₹{selectedEvent.entryFee === 0 ? 'Free' : selectedEvent.entryFee}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                {selectedEvent.fullDescription && (
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-400" />
                      About This Event
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base">{selectedEvent.fullDescription}</p>
                  </div>
                )}

                {/* Participation & Registration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Participation
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Type</p>
                        <p className="text-white font-bold capitalize">{selectedEvent.participationType}</p>
                      </div>
                      {selectedEvent.participationType === 'team' && (
                        <div>
                          <p className="text-gray-400 text-sm">Team Size</p>
                          <p className="text-white font-bold">{selectedEvent.minTeamSize} - {selectedEvent.maxTeamSize} members</p>
                        </div>
                      )}
                      {selectedEvent.eligibility && (
                        <div>
                          <p className="text-gray-400 text-sm">Eligibility</p>
                          <p className="text-white font-semibold">{selectedEvent.eligibility}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Registration Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current / Maximum</span>
                        <span className="text-white font-bold text-lg">{selectedEvent.currentRegistrations} / {selectedEvent.maxRegistrations}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedEvent.category === 'cultural' 
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                              : selectedEvent.category === 'games'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          style={{ width: `${Math.min((selectedEvent.currentRegistrations / selectedEvent.maxRegistrations) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Rules & Guidelines
                    </h3>
                    <ul className="space-y-3">
                      {selectedEvent.rules.filter(r => r).map((rule, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-gray-300 font-semibold">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prize Details */}
                {selectedEvent.prizeDetails && (
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-yellow-400" />
                      Prize Details
                    </h3>
                    <p className="text-gray-300 font-semibold text-lg">{selectedEvent.prizeDetails}</p>
                  </div>
                )}

                {/* Coordinator Info */}
                {selectedEvent.coordinatorName && (
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-white mb-4">Event Coordinator</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{selectedEvent.coordinatorName}</p>
                        {selectedEvent.coordinatorPhone && (
                          <p className="text-gray-400">📞 +91 {selectedEvent.coordinatorPhone}</p>
                        )}
                        {selectedEvent.coordinatorEmail && (
                          <p className="text-gray-400">✉️ {selectedEvent.coordinatorEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    onClick={() => {
                      handleCloseEventDetailsModal();
                      handleRegisterClick(selectedEvent);
                    }}
                    className={`flex-1 bg-gradient-to-r ${
                      selectedEvent.category === 'cultural' 
                        ? 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                        : selectedEvent.category === 'games'
                        ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    } text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base`}
                  >
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Register Now</span>
                  </button>
                  <button
                    onClick={handleCloseEventDetailsModal}
                    className="px-6 sm:px-8 py-3 sm:py-4 glass-panel text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;