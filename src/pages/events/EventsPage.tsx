import { useState, useEffect, useRef } from 'react';
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

// Mock events data with realistic registration numbers and images
const mockEvents: Event[] = [
  {
    _id: '1',
    title: 'AI & Machine Learning Hackathon',
    slug: 'ai-ml-hackathon',
    shortDescription: 'Build innovative AI solutions in 48 hours. Compete with the best minds in artificial intelligence.',
    fullDescription: 'Join us for an intensive 48-hour hackathon focused on AI and Machine Learning. Teams will work on real-world problems and present their solutions to industry experts.',
    category: 'technical',
    department: 'Computer Science',
    day: 2,
    date: '2026-04-02',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    venue: 'Tech Hub Auditorium',
    participationType: 'team',
    minTeamSize: 2,
    maxTeamSize: 4,
    entryFee: 500,
    maxRegistrations: 50,
    currentRegistrations: 47,
    registrationDeadline: '2026-03-30T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['Teams of 2-4 members', 'Original code only', '48-hour time limit'],
    eligibility: 'Open to all students',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Dr. Rajesh Kumar',
    coordinatorPhone: '9876543210',
    coordinatorEmail: 'rajesh@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop',
    tags: ['AI', 'Machine Learning', 'Hackathon', 'Programming'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '2',
    title: 'Cultural Dance Competition',
    slug: 'cultural-dance-competition',
    shortDescription: 'Showcase your cultural heritage through traditional and contemporary dance forms.',
    fullDescription: 'A vibrant celebration of Indian culture through dance. Participants can perform solo or in groups representing various regional dance forms.',
    category: 'cultural',
    department: 'Cultural Committee',
    day: 1,
    date: '2026-04-01',
    startTime: '2:00 PM',
    endTime: '6:00 PM',
    venue: 'Main Auditorium',
    participationType: 'team',
    minTeamSize: 1,
    maxTeamSize: 8,
    entryFee: 200,
    maxRegistrations: 30,
    currentRegistrations: 28,
    registrationDeadline: '2026-03-29T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['Performance time: 5-8 minutes', 'Traditional or fusion allowed', 'Own music arrangement'],
    eligibility: 'All students welcome',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Prof. Meera Sharma',
    coordinatorPhone: '9876543211',
    coordinatorEmail: 'meera@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=600&fit=crop',
    tags: ['Dance', 'Cultural', 'Traditional', 'Performance'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '3',
    title: 'Robotics Championship',
    slug: 'robotics-championship',
    shortDescription: 'Design and build autonomous robots to compete in challenging tasks and obstacles.',
    fullDescription: 'The ultimate robotics challenge where teams design, build, and program robots to navigate complex courses and complete specific tasks.',
    category: 'technical',
    department: 'Mechanical Engineering',
    day: 3,
    date: '2026-04-03',
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    venue: 'Engineering Workshop',
    participationType: 'team',
    minTeamSize: 3,
    maxTeamSize: 5,
    entryFee: 800,
    maxRegistrations: 25,
    currentRegistrations: 23,
    registrationDeadline: '2026-03-31T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Robot size: max 30x30x30 cm', 'Autonomous operation only', 'No remote control'],
    eligibility: 'Engineering students only',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Dr. Amit Patel',
    coordinatorPhone: '9876543212',
    coordinatorEmail: 'amit@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop',
    tags: ['Robotics', 'Engineering', 'Automation', 'Competition'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '4',
    title: 'Photography Contest',
    slug: 'photography-contest',
    shortDescription: 'Capture the essence of technology and culture through your lens.',
    fullDescription: 'A creative photography competition with multiple categories including portrait, landscape, street, and tech photography.',
    category: 'cultural',
    department: 'Fine Arts',
    day: 1,
    date: '2026-04-01',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    venue: 'Campus Wide',
    participationType: 'solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    entryFee: 100,
    maxRegistrations: 100,
    currentRegistrations: 89,
    registrationDeadline: '2026-03-30T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Original photos only', 'Max 5 submissions per person', 'Digital format required'],
    eligibility: 'Open to all',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Ms. Priya Singh',
    coordinatorPhone: '9876543213',
    coordinatorEmail: 'priya@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=600&fit=crop',
    tags: ['Photography', 'Art', 'Creative', 'Visual'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '5',
    title: 'Startup Pitch Competition',
    slug: 'startup-pitch-competition',
    shortDescription: 'Present your innovative startup ideas to industry experts and investors.',
    fullDescription: 'An entrepreneurship competition where students pitch their startup ideas to a panel of successful entrepreneurs and investors.',
    category: 'technical',
    department: 'Business Administration',
    day: 2,
    date: '2026-04-02',
    startTime: '11:00 AM',
    endTime: '3:00 PM',
    venue: 'Business Incubator',
    participationType: 'team',
    minTeamSize: 2,
    maxTeamSize: 6,
    entryFee: 300,
    maxRegistrations: 20,
    currentRegistrations: 18,
    registrationDeadline: '2026-03-31T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['10-minute pitch + 5-minute Q&A', 'Business plan required', 'Prototype preferred'],
    eligibility: 'All students with business ideas',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Mr. Vikash Gupta',
    coordinatorPhone: '9876543214',
    coordinatorEmail: 'vikash@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop',
    tags: ['Startup', 'Entrepreneurship', 'Business', 'Innovation'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '6',
    title: 'Gaming Tournament',
    slug: 'gaming-tournament',
    shortDescription: 'Compete in popular esports titles and showcase your gaming skills.',
    fullDescription: 'Multi-game esports tournament featuring popular titles like PUBG Mobile, Free Fire, and FIFA. Solo and team competitions available.',
    category: 'technical',
    department: 'Computer Science',
    day: 3,
    date: '2026-04-03',
    startTime: '1:00 PM',
    endTime: '8:00 PM',
    venue: 'Gaming Arena',
    participationType: 'team',
    minTeamSize: 1,
    maxTeamSize: 4,
    entryFee: 150,
    maxRegistrations: 80,
    currentRegistrations: 76,
    registrationDeadline: '2026-04-01T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Own devices required', 'Fair play policy', 'Multiple game categories'],
    eligibility: 'All students',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Mr. Rohit Sharma',
    coordinatorPhone: '9876543215',
    coordinatorEmail: 'rohit@techfest.com',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    tags: ['Gaming', 'Esports', 'Competition', 'Technology'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  }
];

const EventsPage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const { getRegistrationStats, getRegistrationsByEvent } = useRegistrations();
  const { events } = useEvents();
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events as Event[];

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
      filtered = filtered.filter((event: Event) => event.day === filters.day);
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

  // Get real-time registration stats
  const registrationStats = getRegistrationStats();

  // Update events with real registration counts
  const eventsWithRealCounts = filteredEvents.map(event => {
    const eventRegistrations = getRegistrationsByEvent(event.title);
    return {
      ...event,
      currentRegistrations: eventRegistrations.length
    };
  });

  // Helper function to check if registration is available for updated events
  const canRegisterUpdated = (event: Event) => {
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    return event.currentRegistrations < event.maxRegistrations && registrationDeadline > now;
  };

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden" ref={containerRef}>
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
          <div className="max-w-6xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-400 font-medium mb-6">
                Tech Fest 2026 Events
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight"
            >
              Discover Amazing 
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Events
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              Explore our diverse collection of technical competitions, cultural performances, 
              and innovative challenges designed to showcase your talents.
            </motion.p>

            {/* Search Bar */}
            <motion.form 
              variants={fadeInUp}
              onSubmit={handleSearch} 
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative glass-panel rounded-2xl p-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by name or description..."
                  className="w-full px-6 py-4 pl-12 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{filteredEvents.length}</div>
                <div className="text-gray-400 text-sm">Total Events</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {registrationStats.total}
                </div>
                <div className="text-gray-400 text-sm">Registrations</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {filteredEvents.filter(event => event.featured).length}
                </div>
                <div className="text-gray-400 text-sm">Featured</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {eventsWithRealCounts.filter(event => canRegisterUpdated(event)).length}
                </div>
                <div className="text-gray-400 text-sm">Open</div>
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
              variants={fadeInUp}
              className="text-gray-400 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
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
          {filteredEvents.length === 0 ? (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-20"
            >
              <div className="glass-panel p-12 rounded-2xl max-w-2xl mx-auto">
                <Calendar className="w-32 h-32 text-gray-600 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-white mb-6">No Events Found</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
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
                        Day {event.day}
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

                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {event.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {event.shortDescription}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-purple-400" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-green-400" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="w-4 h-4 mr-2 text-yellow-400" />
                          <span>{event.participationType === 'team' ? 'Team Event' : 'Solo Event'}</span>
                        </div>
                      </div>

                      {/* Registration Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Registrations</span>
                          <span className="text-white font-medium">
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