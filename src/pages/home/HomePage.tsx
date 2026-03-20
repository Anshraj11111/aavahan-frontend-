import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-01T00:00:00').getTime();
    
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
    { icon: Users, value: '10,000+', label: 'Expected Participants' },
    { icon: Trophy, value: '50+', label: 'Events & Competitions' },
    { icon: Calendar, value: '3', label: 'Days of Innovation' },
    { icon: MapPin, value: '1', label: 'Epic Venue' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Technical Excellence',
      description: 'Cutting-edge competitions, hackathons, and workshops led by industry experts.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Cultural Diversity',
      description: 'Celebrate unity in diversity with traditional performances and cultural events.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Innovation Hub',
      description: 'Network with like-minded innovators and showcase your groundbreaking projects.',
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-bounce" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-ping" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Organization */}
            <div className="mb-6 animate-fade-in">
              <p className="text-white/80 text-lg font-medium tracking-wide">
                Shri Ram Group, Jabalpur Presents
              </p>
            </div>

            {/* Main Title */}
            <h1 className="hero-text text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight animate-slide-up">
              Tech Fest 2026
            </h1>

            {/* Tagline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              CODE IT. BUILD IT. BREAK LIMITS.
            </h2>

            {/* Description */}
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Experience the ultimate celebration of technology, innovation, and creativity. 
              Join us for three days of competitions, workshops, cultural events, and networking.
            </p>

            {/* Event Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="glass p-4 rounded-lg hover:scale-105 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <p className="text-white font-semibold">April 1-3, 2026</p>
                <p className="text-white/70 text-sm">3 Days</p>
              </div>
              <div className="glass p-4 rounded-lg hover:scale-105 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Jabalpur</p>
                <p className="text-white/70 text-sm">Shri Ram Group</p>
              </div>
              <div className="glass p-4 rounded-lg hover:scale-105 transition-transform duration-300">
                <Users className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <p className="text-white font-semibold">10,000+</p>
                <p className="text-white/70 text-sm">Expected Participants</p>
              </div>
              <div className="glass p-4 rounded-lg hover:scale-105 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">50+</p>
                <p className="text-white/70 text-sm">Events & Competitions</p>
              </div>
            </div>

            {/* Countdown Timer */}
            {!timeLeft.isExpired && (
              <div className="mb-12 animate-scale-in" style={{ animationDelay: '0.8s' }}>
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
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up" style={{ animationDelay: '1s' }}>
              <Link
                to="/events"
                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto group"
              >
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/schedule"
                className="btn-outline text-lg px-8 py-4 w-full sm:w-auto"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Why Tech Fest 2026?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Experience innovation like never before with cutting-edge technology, 
              diverse culture, and endless opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="glass p-8 rounded-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              By The Numbers
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of innovators in this epic celebration
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="glass p-8 rounded-2xl hover:scale-105 transition-all duration-300">
                    <Icon className="w-12 h-12 text-primary-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/70 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Don't miss out on the biggest tech festival of 2026. 
            Register now and be part of something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/events"
              className="btn-primary text-lg px-8 py-4 group"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="btn-outline text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;