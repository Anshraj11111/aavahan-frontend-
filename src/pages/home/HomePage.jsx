import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Phone, Mail, Instagram, Youtube, Facebook, Code, Cpu, Zap, Rocket, Lightbulb } from 'lucide-react';
import { eventsService } from '../../services/events';
import { announcementsService } from '../../services/announcements';
import { FEST_INFO } from '../../constants';

// Lazy load Three.js starfield
const StarfieldBackground = lazy(() => import('./components/StarfieldBackground'));

const HomePage = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Fetch data
  const { data: eventsData } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.getFeaturedEvents(),
  });

  const events = Array.isArray(eventsData?.data) ? eventsData.data.slice(0, 5) : [];

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-08T00:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sampleEvents = [
    { icon: Code, name: 'Hackathon', description: '24-hour coding marathon' },
    { icon: Cpu, name: 'AI Workshop', description: 'Machine Learning & AI' },
    { icon: Zap, name: 'Robotics Challenge', description: 'Build & compete' },
    { icon: Rocket, name: 'Startup Pitch', description: 'Present your ideas' },
    { icon: Lightbulb, name: 'Innovation Lab', description: 'Tech demonstrations' }
  ];

  const schedule = [
    { 
      day: 'Day 1 - April 1, 2026 (Ethnic Day)', 
      theme: 'Unity in Diversity',
      events: [
        'Traditional Dress Show',
        'Folk Dance Performances',
        'Ethnic Fashion Walk',
        'Mr. & Ms. Ethnic Shri Ram',
        'Cultural Night',
        'Award Ceremony'
      ]
    },
    { 
      day: 'Day 2 - April 2, 2026 (Technical Day)', 
      theme: 'Innovation & Technology',
      events: [
        'Hackathon',
        'Coding Competitions',
        'AI Workshop',
        'Robotics Challenge',
        'Technical Workshops'
      ]
    },
    { 
      day: 'Day 3 - April 3, 2026 (Technical Day)', 
      theme: 'Future of Technology',
      events: [
        'Startup Pitch',
        'Innovation Lab',
        'Project Presentations',
        'Live Musical Concert',
        'Closing Ceremony'
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-x-hidden">
      {/* Starfield Background */}
      <Suspense fallback={null}>
        <StarfieldBackground />
      </Suspense>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20">
        {/* Nebula Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-bold mb-4 font-orbitron">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
              TECH FEST
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-4xl font-bold text-gray-300 mb-8 tracking-[0.3em] font-orbitron">
            INNOVATION UNLEASHED
          </p>

          {/* Countdown */}
          <div className="mb-12">
            <div className="flex justify-center gap-4 text-5xl md:text-7xl font-mono font-bold">
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 min-w-[100px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                {String(countdown.days).padStart(2, '0')}
              </div>
              <span className="text-blue-400">:</span>
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 min-w-[100px] shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <span className="text-purple-400">:</span>
              <div className="bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4 min-w-[100px] shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <span className="text-pink-400">:</span>
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 min-w-[100px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                {String(countdown.seconds).padStart(2, '0')}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400 font-orbitron">
              <span>DAYS</span>
              <span>HOURS</span>
              <span>MINUTES</span>
              <span>SECONDS</span>
            </div>
          </div>

          {/* Date */}
          <div className="text-4xl md:text-6xl font-bold text-white mb-12 font-orbitron">
            APRIL 1 | 2 | 3
          </div>

          {/* CTA Button */}
          <Link
            to="/events"
            className="inline-block px-10 py-4 bg-transparent border-2 border-blue-500 text-white font-bold text-lg hover:bg-blue-500/20 transition-all duration-300 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] animate-float font-orbitron"
          >
            EVENTS ▶
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative py-32 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 font-orbitron">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OUR EVENTS
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sampleEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-orbitron">{event.name}</h3>
                  <p className="text-gray-400 mb-6">{event.description}</p>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300">
                    Register
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="relative py-32 z-20">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 font-orbitron">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EVENT SCHEDULE
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {schedule.map((day, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] transition-all duration-300"
              >
                <h3 className="text-3xl font-bold text-white mb-2 font-orbitron">{day.day}</h3>
                <p className="text-xl text-purple-400 mb-6 font-orbitron">Theme: {day.theme}</p>
                <div className="space-y-4">
                  {day.events.map((event, i) => (
                    <div key={i} className="flex items-center gap-4 text-gray-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                      <span className="text-lg">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 font-orbitron">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ABOUT TECH FEST
            </span>
          </h2>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-12 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <p className="text-xl text-gray-300 leading-relaxed text-center mb-8">
              Tech Fest 2026 is the flagship event of Shri Ram Group, Jabalpur, bringing together 
              thousands of students, innovators, and tech enthusiasts for three days of extraordinary 
              experiences. From intense coding competitions and hackathons to vibrant cultural performances 
              and networking opportunities.
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                <span className="text-white font-bold text-2xl">LOGO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concert Section */}
      <section className="relative py-32 z-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-2 border-pink-500/50 rounded-2xl p-8 text-center shadow-[0_0_80px_rgba(236,72,153,0.5)]">
              {/* Badge */}
              <div className="mb-6">
                <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-[0_0_30px_rgba(236,72,153,0.6)] font-orbitron">
                  LIVE MUSICAL CONCERT
                </span>
              </div>

              {/* Band Name */}
              <div className="text-7xl font-bold text-white mb-8 font-orbitron">
                ASTRA 13
              </div>

              {/* Date */}
              <div className="text-3xl text-gray-200 font-orbitron">
                @ April 3, 2026<br />
                <span className="text-pink-400">Stay Tuned !!!</span>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-32 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 font-orbitron">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              OUR PARTNERS
            </span>
          </h2>

          <div className="flex justify-center gap-8 flex-wrap max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-40 h-40 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl flex items-center justify-center hover:border-blue-500/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-110 transition-all duration-300"
              >
                <span className="text-white font-bold font-orbitron">Partner {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 z-20">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 font-orbitron">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CONNECT WITH US
            </span>
          </h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">Contact</h3>
              {FEST_INFO.contact.phone.map((phone, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span className="font-mono">{phone}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>{FEST_INFO.contact.email}</span>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-blue-400" />
            </div>

            {/* QR Code */}
            <div className="bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-8 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">QR</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-6 mt-12">
            {[
              { icon: Instagram, href: `https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}` },
              { icon: Youtube, href: `https://youtube.com/c/${FEST_INFO.socialMedia.youtube}` },
              { icon: Facebook, href: `https://facebook.com/${FEST_INFO.socialMedia.facebook}` }
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-110 transition-all duration-300"
                >
                  <Icon className="w-6 h-6 text-blue-400" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-black/50 border-t border-white/10 z-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 font-orbitron">
            © 2026 TECH FEST WEBSITE TEAM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
