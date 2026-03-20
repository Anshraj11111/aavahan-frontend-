import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../../services/events';
import { Event, EventFilters } from '../../types';
import { EVENT_CATEGORIES, DAY_INFO, DEPARTMENTS } from '../../constants';

const EventsPage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsService.getEvents(filters),
  });

  const events = eventsResponse?.data || [];

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchQuery);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-purple-950 pt-20">
      {/* Header */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EVENTS
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Discover amazing events across cultural and technical categories
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full px-6 py-4 pl-12 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-white/50 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-white/10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-xl text-white hover:bg-white/10 transition-all flex items-center lg:hidden font-orbitron"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.day || ''}
                  onChange={(e) => handleFilterChange('day', e.target.value ? parseInt(e.target.value) : '')}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:border-blue-500/60 font-orbitron"
                >
                  <option value="">All Days</option>
                  <option value="1">Day 1 - Ethnic Day</option>
                  <option value="2">Day 2 - Technical</option>
                  <option value="3">Day 3 - Technical</option>
                </select>

                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:border-blue-500/60 font-orbitron"
                >
                  <option value="">All Categories</option>
                  <option value="cultural">Cultural</option>
                  <option value="technical">Technical</option>
                </select>

                <select
                  value={filters.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:border-blue-500/60 font-orbitron"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.slice(0, 8).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-orbitron"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="text-gray-400 font-orbitron">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass p-6 rounded-xl animate-pulse">
                  <div className="w-full h-48 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-white/70 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event._id} className="group bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-blue-500/60 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all duration-300 hover:-translate-y-2">
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                    {event.posterImage ? (
                      <img
                        src={event.posterImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getEventStatusColor(event)} font-orbitron`}>
                      {getEventStatusText(event)}
                    </div>

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-sm font-medium backdrop-blur-sm font-orbitron">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium font-orbitron ${
                        event.category === 'cultural' 
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {event.category}
                      </span>
                      <span className="text-gray-400 text-sm font-orbitron">{event.day}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 font-orbitron">
                      {event.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-purple-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2 text-cyan-400" />
                        <span>{event.participationType} • ₹{event.entryFee}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-gray-400 text-sm font-orbitron">
                        {event.currentRegistrations}/{event.maxRegistrations} registered
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/events/${event.slug}`}
                          className="px-4 py-2 bg-white/5 border border-blue-500/30 text-white text-sm rounded-lg hover:bg-white/10 hover:border-blue-500/60 transition-all font-orbitron"
                        >
                          View
                        </Link>
                        {getEventStatusText(event) === 'Open' && (
                          <Link
                            to={`/registration/${event._id}`}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all font-orbitron"
                          >
                            Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;