import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../../services/events';
import { formatDate, formatCurrency, getRelativeTime } from '../../utils';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: eventResponse, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsService.getEventBySlug(slug!),
    enabled: !!slug,
  });

  const event = eventResponse?.data;

  const getEventStatusColor = () => {
    if (!event) return '';
    
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

  const getEventStatusText = () => {
    if (!event) return '';
    
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'Registration Full';
    } else if (registrationDeadline < now) {
      return 'Registration Closed';
    } else {
      return 'Registration Open';
    }
  };

  const canRegister = () => {
    if (!event) return false;
    
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    return event.currentRegistrations < event.maxRegistrations && registrationDeadline > now;
  };

  const getStatusIcon = () => {
    if (!event) return null;
    
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    } else if (registrationDeadline < now) {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    } else {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getStatusText = () => {
    if (!event) return '';
    
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (event.currentRegistrations >= event.maxRegistrations) {
      return 'Registration Full';
    } else if (registrationDeadline < now) {
      return 'Registration Closed';
    } else {
      return 'Registration Open';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">Failed to load event details</p>
          <button 
            onClick={() => navigate('/events')}
            className="btn-primary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-white/60 mb-4">Event not found</p>
          <button 
            onClick={() => navigate('/events')}
            className="btn-primary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = canRegister();

  return (
    <div className="min-h-screen pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/events"
          className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>
      </div>

      {/* Event Header */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Event Image */}
            <div className="relative">
              <img
                src={event.bannerImage || event.posterImage || '/images/event-placeholder.jpg'}
                alt={event.title}
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute top-6 left-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  event.category === 'cultural' 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-primary-500 text-white'
                }`}>
                  {event.category === 'cultural' ? 'Cultural Event' : 'Technical Event'}
                </span>
              </div>
              <div className="absolute top-6 right-6">
                <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm">
                  Day {event.day}
                </span>
              </div>
              {event.featured && (
                <div className="absolute bottom-6 left-6">
                  <span className="bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-medium">
                    ⭐ Featured Event
                  </span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                {event.title}
              </h1>
              
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                {event.shortDescription}
              </p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-white/60 text-sm">Date & Time</p>
                      <p className="text-white font-medium">
                        {formatDate(event.date, 'long')}
                      </p>
                      <p className="text-white/80 text-sm">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-secondary-400" />
                    <div>
                      <p className="text-white/60 text-sm">Venue</p>
                      <p className="text-white font-medium">{event.venue}</p>
                    </div>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-accent-400" />
                    <div>
                      <p className="text-white/60 text-sm">Participation</p>
                      <p className="text-white font-medium">
                        {event.participationType === 'team' ? 'Team Event' : 'Solo Event'}
                      </p>
                      {event.participationType === 'team' && (
                        <p className="text-white/80 text-sm">
                          {event.minTeamSize}-{event.maxTeamSize} members
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white/60 text-sm">Entry Fee</p>
                      <p className="text-white font-medium">
                        {event.entryFee > 0 ? formatCurrency(event.entryFee) : 'Free'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              <div className="glass p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div>
                      <p className="text-white font-medium">{getStatusText()}</p>
                      <p className="text-white/60 text-sm">
                        {event.currentRegistrations} / {event.maxRegistrations} registered
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Registration closes</p>
                    <p className="text-white font-medium">
                      {getRelativeTime(event.registrationDeadline)}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              {isRegistrationOpen ? (
                <Link
                  to={`/registration/${event._id}`}
                  className="btn-primary w-full text-center text-lg py-4 mb-4"
                >
                  Register Now
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-300 font-medium py-4 px-6 rounded-lg cursor-not-allowed mb-4"
                >
                  Registration Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-8">
              About This Event
            </h2>
            
            <div className="glass p-8 rounded-2xl mb-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed text-lg">
                  {event.fullDescription}
                </p>
              </div>
            </div>

            {/* Rules and Eligibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rules */}
              {event.rules && event.rules.length > 0 && (
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">Rules & Guidelines</h3>
                  <ul className="space-y-2">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-white/80">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Eligibility & Prizes */}
              <div className="space-y-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">Eligibility</h3>
                  <p className="text-white/80">{event.eligibility}</p>
                </div>

                <div className="glass p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">Prizes</h3>
                  <p className="text-white/80">{event.prizeDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinator Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-8 text-center">
              Event Coordinator
            </h2>
            
            <div className="glass p-8 rounded-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {event.coordinatorName}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-4 h-4 text-white/60" />
                  <a
                    href={`tel:+91${event.coordinatorPhone}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    +91 {event.coordinatorPhone}
                  </a>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-4 h-4 text-white/60" />
                  <a
                    href={`mailto:${event.coordinatorEmail}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    {event.coordinatorEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;