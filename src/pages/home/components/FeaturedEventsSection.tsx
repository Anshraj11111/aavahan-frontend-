import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { eventsService } from '../../../services/events';
import { ROUTES } from '../../../constants';
import { formatDate, formatCurrency } from '../../../utils';

const FeaturedEventsSection: React.FC = () => {
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.getFeaturedEvents(),
    staleTime: 5 * 60 * 1000,
  });

  const events = featuredEvents?.data || [];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Featured Events
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Don't miss these highlight events of Tech Fest 2026. From cultural celebrations 
            to technical competitions, there's something for everyone.
          </p>
          <Link
            to={ROUTES.EVENTS}
            className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
          >
            View All Events
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="bg-white/20 h-48 rounded-lg mb-4" />
                <div className="bg-white/20 h-4 rounded mb-2" />
                <div className="bg-white/20 h-3 rounded w-3/4 mb-4" />
                <div className="bg-white/20 h-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((event, index) => (
              <div
                key={event._id}
                className="event-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Event Image */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={event.posterImage || '/images/event-placeholder.jpg'}
                    alt={event.title}
                    className="event-image w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.category === 'cultural' 
                        ? 'bg-accent-500 text-white' 
                        : 'bg-primary-500 text-white'
                    }`}>
                      {event.category === 'cultural' ? 'Cultural' : 'Technical'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      Day {event.day}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm line-clamp-2">
                    {event.shortDescription}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/60">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span>{formatDate(event.date)} at {event.startTime}</span>
                    </div>
                    
                    <div className="flex items-center text-white/60">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span>{event.venue}</span>
                    </div>
                    
                    <div className="flex items-center text-white/60">
                      <Users size={16} className="mr-2 flex-shrink-0" />
                      <span>
                        {event.participationType === 'team' ? 'Team Event' : 'Solo Event'}
                        {event.participationType === 'team' && event.minTeamSize && (
                          ` (${event.minTeamSize}-${event.maxTeamSize} members)`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Event Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-white font-semibold">
                      {event.entryFee > 0 ? formatCurrency(event.entryFee) : 'Free'}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-white/60 text-xs">
                        {event.currentRegistrations}/{event.maxRegistrations}
                      </div>
                      <div className="w-16 bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Link
                    to={`/events/${event.slug}`}
                    className="block w-full text-center bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events CTA */}
        <div className="text-center mt-12">
          <Link
            to={ROUTES.EVENTS}
            className="btn-primary text-lg px-8 py-4"
          >
            Explore All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;