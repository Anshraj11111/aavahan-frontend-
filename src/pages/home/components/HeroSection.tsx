import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { ROUTES, FEST_INFO } from '../../../constants';
import { getTimeUntilEvent } from '../../../utils';

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilEvent(FEST_INFO.dates.start));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilEvent(FEST_INFO.dates.start));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
        <div className="absolute inset-0 bg-mesh opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-bounce-slow" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent-500/20 rounded-full blur-xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Organization */}
          <div className="mb-6">
            <p className="text-white/80 text-lg font-medium tracking-wide">
              {FEST_INFO.organization}
            </p>
          </div>

          {/* Main Title */}
          <h1 className="hero-text text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Tech Fest 2026
          </h1>

          {/* Tagline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
            {FEST_INFO.tagline}
          </h2>

          {/* Description */}
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the ultimate celebration of technology, innovation, and creativity. 
            Join us for three days of competitions, workshops, cultural events, and networking.
          </p>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="glass p-4 rounded-lg">
              <Calendar className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <p className="text-white font-semibold">April 1-3, 2026</p>
              <p className="text-white/70 text-sm">3 Days</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <MapPin className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Jabalpur</p>
              <p className="text-white/70 text-sm">Shri Ram Group</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <Users className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <p className="text-white font-semibold">10,000+</p>
              <p className="text-white/70 text-sm">Expected Participants</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">50+</p>
              <p className="text-white/70 text-sm">Events & Competitions</p>
            </div>
          </div>

          {/* Countdown Timer */}
          {!timeLeft.isExpired && (
            <div className="mb-12">
              <h3 className="text-white text-xl font-semibold mb-6">Event Starts In</h3>
              <div className="flex justify-center space-x-4">
                <div className="countdown-item">
                  <div className="countdown-number">{timeLeft.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{timeLeft.hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{timeLeft.minutes}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{timeLeft.seconds}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to={ROUTES.EVENTS}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Explore Events
            </Link>
            <Link
              to={ROUTES.SCHEDULE}
              className="btn-outline text-lg px-8 py-4 w-full sm:w-auto"
            >
              View Schedule
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;