import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, Trophy, ArrowRight, Clock, Sparkles, Zap, Star, MapPin, Award
} from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import collegeBuilding from '../../assets/images/college.png';

const PosterStyleHomePage = () => {
  const { events } = useEvents();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  });

  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + (event.currentRegistrations || 0), 0);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-08T00:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      icon: Users, 
      value: `${totalRegistrations}+`, 
      label: 'Participants', 
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Trophy, 
      value: `${totalEvents}`, 
      label: 'Events', 
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Award, 
      value: '₹60K+', 
      label: 'Prize Pool', 
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Calendar, 
      value: '3', 
      label: 'Days', 
      color: 'from-orange-500 to-red-500'
    },
  ];

  const featuredEvents = events.filter(e => e.featured).slice(0, 3);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section - Clean Poster Style with College Building */}
      <section className="relative min-h-screen flex items-center z-10">
        {/* College Building Background - More Prominent */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegeBuilding} 
            alt="Shri Ram Group College" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          {/* Lighter gradient overlay for better photo visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/80 to-cyan-50/75" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Top Section - Title Only (No Logo) */}
            <div className="text-center mb-10">
              {/* Main Title - Professional Size */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  AAVHAAN TECH FEST
                </h1>
                <div className="text-xl md:text-2xl font-semibold mb-3 text-slate-700">
                  Code It. Build It. Break Limits.
                </div>
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  2026
                </div>
              </motion.div>
            </div>

            {/* Stats Grid - Professional Size */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/95 backdrop-blur-sm p-5 rounded-xl text-center border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                  <div className="text-slate-600 text-xs font-semibold uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Countdown Timer - Professional Size */}
            {!timeLeft.isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-10"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                    Event Starts In
                  </h3>
                </div>
                <div className="flex gap-3 justify-center max-w-2xl mx-auto">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Minutes' },
                    { value: timeLeft.seconds, label: 'Seconds' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/95 backdrop-blur-sm px-4 py-4 rounded-xl border-2 border-blue-300 flex-1 max-w-[120px] shadow-lg">
                      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Buttons - Professional Size */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/events"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-blue-500/30 hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/schedule"
                className="bg-white/95 backdrop-blur-sm border-2 border-blue-300 hover:border-blue-500 text-slate-800 font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>View Schedule</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Categories Section - Professional Size */}
      <section className="py-16 relative z-10 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
              Event <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 rounded-full" />
            <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
              Explore diverse competitions across multiple domains
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Technical', icon: '💻', color: 'from-blue-500 to-cyan-500', count: events.filter(e => e.category === 'technical').length, desc: 'Coding & Tech' },
              { title: 'Cultural', icon: '🎭', color: 'from-pink-500 to-purple-500', count: events.filter(e => e.category === 'cultural').length, desc: 'Arts & Culture' },
              { title: 'Innovation', icon: '💡', color: 'from-green-500 to-emerald-500', count: events.filter(e => e.category === 'innovation').length, desc: 'Ideas & Projects' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-200 text-center group cursor-pointer hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-wide">{cat.title}</h3>
                <div className={`text-4xl font-black bg-gradient-to-r ${cat.color} bg-clip-text text-transparent mb-2`}>
                  {cat.count}
                </div>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events - Professional Size */}
      {featuredEvents.length > 0 && (
        <section className="py-16 relative z-10 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Events</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 rounded-full" />
              <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
                Don't miss these highlighted competitions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-blue-200 group hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    {event.posterImage ? (
                      <img 
                        src={event.posterImage} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                        event.category === 'cultural' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-blue-500 text-white'
                      } shadow-lg`}>
                        {event.category === 'cultural' ? '🎭 Cultural' : '💻 Technical'}
                      </div>
                    </div>

                    {/* Day Badge */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 rounded-full text-xs font-bold shadow-lg">
                      Day {event.day}
                    </div>

                    {/* Featured Star */}
                    <div className="absolute top-3 right-3">
                      <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.shortDescription}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                        {event.venue}
                      </div>
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="block text-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section - Professional Size with College Building */}
      <section className="py-16 relative z-10 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
              About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Tech Fest</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </motion.div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-blue-200 max-w-7xl mx-auto shadow-2xl">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left - College Building Photo - LARGER (3 columns) */}
              <div className="relative md:col-span-3 h-[400px] md:h-auto">
                <img 
                  src={collegeBuilding} 
                  alt="Shri Ram Group College" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60" />
                
                {/* Overlay Text on Image */}
                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      Shri Ram Group of Colleges
                    </h3>
                    <p className="text-slate-600 text-sm font-medium">
                      Muzaffarnagar's Premier Technical Institution
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Right - Content (2 columns) */}
              <div className="md:col-span-2 p-8 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-white">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-slate-700 leading-relaxed mb-6 text-base font-medium">
                    Tech Fest 2026 brings together <span className="text-blue-600 font-bold">innovation</span>, <span className="text-purple-600 font-bold">creativity</span>, and <span className="text-cyan-600 font-bold">technical excellence</span> at Shri Ram Group of Colleges.
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                    Join us for three days of intense competitions, hands-on workshops, and networking opportunities with industry leaders.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm mb-1">Cutting-Edge Competitions</h4>
                        <p className="text-slate-600 text-xs">Challenge yourself in technical and cultural events</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm mb-1">Expert Workshops</h4>
                        <p className="text-slate-600 text-xs">Learn from industry professionals and mentors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm mb-1">₹60,000+ Prize Pool</h4>
                        <p className="text-slate-600 text-xs">Compete for exciting prizes and recognition</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Professional Size with College Building */}
      <section className="py-20 relative z-10">
        {/* College Building Background for CTA */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegeBuilding} 
            alt="Shri Ram Group College" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/95 via-white/90 to-cyan-50/95" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              Ready to <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Compete?</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto mb-6 rounded-full" />
            <p className="text-slate-700 text-base md:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Register now and be part of the most exciting tech fest of 2026. 
              Compete, learn, and win amazing prizes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-blue-500/30 hover:scale-105"
              >
                <span>Browse All Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center space-x-2 bg-white/95 backdrop-blur-sm border-2 border-blue-300 hover:border-blue-500 text-slate-800 font-bold text-base py-4 px-10 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FloatingActionButton />
    </div>
  );
};

export default PosterStyleHomePage;
