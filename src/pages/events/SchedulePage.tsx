import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Users, Trophy } from 'lucide-react';
import { eventsService } from '../../services/events';
import { DAY_INFO } from '../../constants';
import { formatDate, formatCurrency } from '../../utils';
import { Link } from 'react-router-dom';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['day-schedule'],
    queryFn: () => eventsService.getDaySchedule(),
    staleTime: 5 * 60 * 1000,
  });

  // Backend returns: { success: true, data: { events: [...] } }
  const allEvents = Array.isArray(scheduleData?.data?.events) 
    ? scheduleData.data.events 
    : [];
  
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
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Event Schedule
            </h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Plan your Tech Fest 2026 experience with our comprehensive schedule. 
              Three days of innovation, culture, and celebration await you.
            </p>
          </div>

          {/* Day Selector */}
          <div className="flex justify-center mb-12">
            <div className="glass p-2 rounded-xl">
              <div className="flex space-x-2">
                {Object.entries(DAY_INFO).map(([day, info]) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(Number(day))}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedDay === Number(day)
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold">Day {day}</div>
                      <div className="text-xs opacity-80">{info.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day Info */}
          <div className="glass p-8 rounded-2xl mb-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Day {selectedDay}: {DAY_INFO[selectedDay as keyof typeof DAY_INFO].title}
              </h2>
              <p className="text-primary-400 font-semibold mb-4">
                {DAY_INFO[selectedDay as keyof typeof DAY_INFO].theme}
              </p>
              <p className="text-white/80 mb-4">
                {formatDate(DAY_INFO[selectedDay as keyof typeof DAY_INFO].date, 'long')}
              </p>
              <p className="text-white/70">
                {DAY_INFO[selectedDay as keyof typeof DAY_INFO].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Timeline */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="glass p-6 rounded-xl animate-pulse">
                  <div className="flex items-start space-x-6">
                    <div className="bg-white/20 w-20 h-16 rounded" />
                    <div className="flex-1 space-y-3">
                      <div className="bg-white/20 h-4 rounded w-3/4" />
                      <div className="bg-white/20 h-3 rounded w-1/2" />
                      <div className="bg-white/20 h-3 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-24 h-24 text-white/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No Events Scheduled
              </h3>
              <p className="text-white/70">
                Events for Day {selectedDay} will be announced soon. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-purple-500 hidden lg:block" />

              <div className="space-y-8">
                {sortedEvents.map((event, index) => (
                  <div
                    key={event._id}
                    className="relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full border-4 border-slate-900 hidden lg:block" />

                    {/* Event Card */}
                    <div className="lg:ml-16 glass p-6 rounded-xl hover:scale-[1.02] transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        {/* Time */}
                        <div className="text-center lg:text-left">
                          <div className="inline-block glass px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2 text-primary-400">
                              <Clock size={16} />
                              <span className="font-bold">{event.startTime}</span>
                            </div>
                            <div className="text-white/60 text-sm">
                              to {event.endTime}
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="lg:col-span-2">
                          <div className="flex items-start space-x-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.category === 'cultural' 
                                ? 'bg-accent-500 text-white' 
                                : 'bg-primary-500 text-white'
                            }`}>
                              {event.category === 'cultural' ? 'Cultural' : 'Technical'}
                            </span>
                            {event.featured && (
                              <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">
                            {event.title}
                          </h3>
                          
                          <p className="text-white/70 mb-4 line-clamp-2">
                            {event.shortDescription}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2 text-white/60">
                              <MapPin size={16} />
                              <span>{event.venue}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-white/60">
                              <Users size={16} />
                              <span>
                                {event.participationType === 'team' ? 'Team Event' : 'Solo Event'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-white/60">
                              <Trophy size={16} />
                              <span>
                                {event.entryFee > 0 ? formatCurrency(event.entryFee) : 'Free'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-white/60">
                              <Calendar size={16} />
                              <span>
                                {event.currentRegistrations}/{event.maxRegistrations} registered
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                          <Link
                            to={`/events/${event.slug}`}
                            className="btn-outline text-center py-2 px-4 text-sm"
                          >
                            View Details
                          </Link>
                          
                          {event.status === 'published' && 
                           event.currentRegistrations < event.maxRegistrations &&
                           new Date(event.registrationDeadline) > new Date() && (
                            <Link
                              to={`/registration/${event._id}`}
                              className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-all duration-200"
                            >
                              Register Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Download Schedule */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Take the Schedule With You
              </h3>
              <p className="text-white/70 mb-6">
                Download the complete Tech Fest 2026 schedule and never miss an event. 
                Available in PDF format for easy viewing on any device.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="btn-primary">
                  Download PDF Schedule
                </button>
                <button className="btn-outline">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;