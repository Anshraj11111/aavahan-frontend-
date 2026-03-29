import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, ArrowRight, Sparkles, Zap, Target, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
    { icon: Users, value: '10,000+', label: 'Expected Participants' },
    { icon: Trophy, value: '50+', label: 'Events & Competitions' },
    { icon: Calendar, value: '2', label: 'Days of Innovation' },
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
        {/* Background with College Building */}
        <div className="absolute inset-0 z-0">
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/90 to-navy-950" />
          
          {/* Animated gradient orbs - larger and more vibrant */}
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Organization */}
            <div className="mb-8 animate-fade-in">
              <p className="text-white/90 text-lg md:text-xl font-bold tracking-wide">
                Shri Ram Group, Jabalpur Presents
              </p>
            </div>

            {/* Aavhaan Logo & Title */}
            <div className="mb-6 animate-slide-up">
              {/* Main Aavhaan Title with Premium Effects */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 blur-3xl opacity-50 animate-pulse" />
                  
                  {/* Main Hindi Title */}
                  <h1 className="relative text-7xl sm:text-8xl lg:text-9xl font-display font-black leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-shift">
                      आव्हान
                    </span>
                  </h1>
                  
                  {/* Year badge */}
                  <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 blur-xl opacity-60 animate-pulse" />
                      <span className="relative text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                        2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* English subtitle with premium styling */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 blur-2xl opacity-40 animate-pulse" />
                <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                  AAVHAAN 2026
                </h2>
              </div>
            </div>

            {/* Tagline */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              CODE IT. BUILD IT. BREAK LIMITS.
            </h3>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mx-auto mb-8 rounded-full animate-shimmer" style={{ animationDelay: '0.3s' }} />

            {/* Description */}
            <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Experience the ultimate celebration of technology, innovation, and creativity. 
              Join us for two days of competitions, workshops, cultural events, and networking.
            </p>

            {/* Countdown Timer */}
            {!timeLeft.isExpired && (
              <div className="mb-12 animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <h4 className="text-white text-xl font-semibold mb-6">Event Starts In</h4>
                <div className="flex justify-center gap-4">
                  <div className="glass-panel px-6 py-4 rounded-2xl border-2 border-cyan-500/50 min-w-[100px]">
                    <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-white text-sm font-bold uppercase tracking-wider">Days</div>
                  </div>
                  <div className="glass-panel px-6 py-4 rounded-2xl border-2 border-purple-500/50 min-w-[100px]">
                    <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-white text-sm font-bold uppercase tracking-wider">Hours</div>
                  </div>
                  <div className="glass-panel px-6 py-4 rounded-2xl border-2 border-blue-500/50 min-w-[100px]">
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-white text-sm font-bold uppercase tracking-wider">Minutes</div>
                  </div>
                  <div className="glass-panel px-6 py-4 rounded-2xl border-2 border-orange-500/50 min-w-[100px]">
                    <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-white text-sm font-bold uppercase tracking-wider">Seconds</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/events"
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 w-full sm:w-auto group inline-flex items-center justify-center"
              >
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/schedule"
                className="glass-panel border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-flex items-center justify-center backdrop-blur-xl"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-4">
              Why Aavhaan 2026?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mx-auto mb-6 rounded-full" />
            <p className="text-white text-lg max-w-2xl mx-auto font-medium">
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
                  className="glass-panel p-8 rounded-2xl hover:scale-105 transition-all duration-300 group border-2 border-white/20 hover:border-white/40 backdrop-blur-xl"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-4">
              By The Numbers
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mx-auto mb-6 rounded-full" />
            <p className="text-white text-lg font-medium">
              Join thousands of innovators in this epic celebration
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="glass-panel p-8 rounded-2xl text-center group hover:scale-110 transition-all duration-300 border-2 border-white/30 hover:border-cyan-400/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-cyan-500/20"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white text-base font-black uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QR Code Section - Schedule Access */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Smartphone className="w-10 h-10 text-cyan-400 animate-bounce" />
              <h2 className="text-4xl lg:text-5xl font-display font-black text-white">
                Quick Schedule Access
              </h2>
              <QrCode className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-6 rounded-full" />
            <p className="text-white text-lg max-w-2xl mx-auto font-medium">
              Scan the QR code with your phone to instantly access the complete 2-day event schedule
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="glass-panel p-8 md:p-12 rounded-3xl border-2 border-white/30 backdrop-blur-xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
                    
                    {/* QR Code Container */}
                    <div className="relative bg-white p-6 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <QRCodeSVG
                        value={`${window.location.origin}/schedule`}
                        size={280}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: "/logo.png",
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-white font-bold text-lg mb-2">Scan to View Schedule</p>
                    <p className="text-white/70 text-sm">Works with any QR scanner app</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white font-black text-xl">1</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">Open Camera</h3>
                      <p className="text-white/80 leading-relaxed">Open your phone's camera or any QR code scanner app</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white font-black text-xl">2</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">Scan QR Code</h3>
                      <p className="text-white/80 leading-relaxed">Point your camera at the QR code above</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white font-black text-xl">3</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">View Schedule</h3>
                      <p className="text-white/80 leading-relaxed">Instantly access the complete day-wise event schedule</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-cyan-400" />
                      <h4 className="text-white font-bold text-lg">What You'll See:</h4>
                    </div>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                        Day 1: Cultural Day - Traditional Events
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        Day 2: Technical Day - Competitions & Workshops
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alternative Link */}
              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm mb-4">Or access directly from your browser</p>
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-300 group"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  View Schedule Online
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-pink-600/20 to-purple-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-panel p-12 rounded-3xl border-2 border-white/30 backdrop-blur-xl max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Don't miss out on the biggest tech festival of 2026. 
              Register now and be part of something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/events"
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 w-full sm:w-auto group inline-flex items-center justify-center"
              >
                Register Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="glass-panel border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-flex items-center justify-center backdrop-blur-xl"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;