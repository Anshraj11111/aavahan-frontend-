import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Phone, Mail, Clock, Star, Award, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { eventsService } from '../../services/events';
import { formatDate, formatCurrency, getRelativeTime } from '../../utils';
import { fadeInUp, staggerContainer, scaleUp } from '../../lib/animations';
import LightweightBackground from '../../components/backgrounds/LightweightBackground';

// @ts-ignore - Image import
import collegeBuilding from '../../assets/images/college.png';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: eventResponse, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsService.getEventBySlug(slug!),
    enabled: !!slug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const event = eventResponse?.data;

  const canRegister = () => {
    if (!event) return false;
    const now = new Date();
    // If no registration deadline, allow registration
    if (!event.registrationDeadline) {
      return (event.currentRegistrations || 0) < (event.maxRegistrations || 0);
    }
    const registrationDeadline = new Date(event.registrationDeadline);
    return (event.currentRegistrations || 0) < (event.maxRegistrations || 0) && registrationDeadline > now;
  };

  const getStatusIcon = () => {
    if (!event) return null;
    const now = new Date();
    
    if ((event.currentRegistrations || 0) >= (event.maxRegistrations || 0)) {
      return <XCircle className="w-6 h-6 text-red-400" />;
    } else if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
      return <AlertCircle className="w-6 h-6 text-yellow-400" />;
    } else {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
  };

  const getStatusText = () => {
    if (!event) return '';
    const now = new Date();
    
    if ((event.currentRegistrations || 0) >= (event.maxRegistrations || 0)) {
      return 'Registration Full';
    } else if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
      return 'Registration Closed';
    } else {
      return 'Registration Open';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    navigate('/events');
    return null;
  }

  const isRegistrationOpen = canRegister();

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Lightweight Background */}
      <LightweightBackground />

      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Link
          to="/events"
          className="inline-flex items-center bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:border-blue-500 text-slate-800 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>
      </div>

      {/* Hero Section with College Building */}
      <motion.section 
        className="py-16 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* College Building Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegeBuilding} 
            alt="Shri Ram Group College" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-blue-50/95 to-cyan-50/90" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Event Image */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-blue-300 shadow-2xl">
                <img
                  src={event?.posterImage || event?.bannerImage || '/images/event-placeholder.jpg'}
                  alt={event?.title || 'Event'}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    event?.category === 'cultural' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {event?.category === 'cultural' ? '🎭 Cultural' : '💻 Technical'}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-300">
                    Day {event?.day || 'TBD'}
                  </span>
                </div>
                {event?.featured && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <Star className="w-4 h-4 mr-1" fill="currentColor" />
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4 leading-tight">
                {event?.title || 'Event Title'}
              </h1>
              
              <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold">
                {event?.shortDescription || 'Event description not available.'}
              </p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-bold">Date & Time</p>
                      <p className="text-slate-800 font-black text-base">
                        {event?.date ? formatDate(event.date, 'long') : 'Date TBD'}
                      </p>
                      <p className="text-slate-700 text-sm font-semibold">
                        {event?.startTime && event?.endTime ? `${event.startTime} - ${event.endTime}` : 'Time TBD'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-bold">Venue</p>
                      <p className="text-slate-800 font-black text-base">{event?.venue || 'Venue TBD'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-bold">Participation</p>
                      <p className="text-slate-800 font-black text-base">
                        {event?.participationType === 'team' ? 'Team Event' : 'Solo Event'}
                      </p>
                      {event?.participationType === 'team' && (
                        <p className="text-slate-700 text-sm font-semibold">
                          {event?.minTeamSize}-{event?.maxTeamSize} members
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-bold">Entry Fee</p>
                      <p className="text-slate-800 font-black text-base">
                        {event?.entryFee > 0 ? formatCurrency(event.entryFee) : 'Free'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl mb-6 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div>
                      <p className="text-slate-800 font-black text-base">{getStatusText()}</p>
                      <p className="text-slate-600 text-sm font-semibold">
                        {event?.currentRegistrations || 0} / {event?.maxRegistrations || 0} registered
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 text-sm font-bold">Closes</p>
                    <p className="text-slate-800 font-black text-sm">
                      {event?.registrationDeadline ? getRelativeTime(event.registrationDeadline) : 'TBD'}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((event?.currentRegistrations || 0) / (event?.maxRegistrations || 1)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Registration Button */}
              <Link
                to={`/registration/${event?._id}`}
                className="block text-center bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 mb-4"
              >
                Register Now →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Event Description */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-black text-slate-800 mb-8 text-center"
            >
              About This <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Event</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl mb-8 border-2 border-blue-200 shadow-xl"
            >
              <p className="text-slate-700 leading-relaxed text-lg font-semibold">
                {event?.fullDescription || 'Full description not available.'}
              </p>
            </motion.div>

            {/* Rules and Eligibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rules */}
              {event?.rules && event.rules.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border-2 border-blue-200 shadow-lg"
                >
                  <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    Rules & Guidelines
                  </h3>
                  <ul className="space-y-3">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-slate-700 font-semibold">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Eligibility & Prizes */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border-2 border-blue-200 shadow-lg"
                >
                  <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    Eligibility
                  </h3>
                  <p className="text-slate-700 font-semibold">{event?.eligibility || 'Eligibility criteria not specified.'}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border-2 border-blue-200 shadow-lg"
                >
                  <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Prizes
                  </h3>
                  <p className="text-slate-700 font-semibold">{event?.prizeDetails || 'Prize details not available.'}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinator Info */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-black text-slate-800 mb-8 text-center"
            >
              Event <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Coordinator</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl text-center border-2 border-blue-200 shadow-xl"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-6">
                {event?.coordinatorName || 'Event Coordinator'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 bg-slate-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <a
                    href={`tel:+91${event?.coordinatorPhone || ''}`}
                    className="text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors duration-200"
                  >
                    +91 {event?.coordinatorPhone || 'N/A'}
                  </a>
                </div>
                
                <div className="flex items-center justify-center space-x-3 bg-slate-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <a
                    href={`mailto:${event?.coordinatorEmail || ''}`}
                    className="text-purple-600 hover:text-purple-700 font-bold text-lg transition-colors duration-200"
                  >
                    {event?.coordinatorEmail || 'N/A'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
