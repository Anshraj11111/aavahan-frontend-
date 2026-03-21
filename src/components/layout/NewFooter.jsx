import { Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, Mail, Globe, ArrowUp, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { FEST_INFO } from '../../constants';
import GlowBackground from '../common/GlowBackground';

/**
 * Footer Component
 * Premium 4-column footer with dark navy background and dot grid overlay
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const eventLinks = [
    { name: 'All Events', path: '/events' },
    { name: 'Technical Events', path: '/events?category=technical' },
    { name: 'Cultural Events', path: '/events?category=cultural' },
    { name: 'Workshops', path: '/events?category=workshop' },
  ];

  const supportLinks = [
    { name: 'My Tickets', path: '/my-tickets' },
    { name: 'Ticket Lookup', path: '/ticket-lookup' },
    { name: 'Registration Help', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: `https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}`,
      icon: Instagram,
    },
    {
      name: 'Facebook',
      url: `https://facebook.com/${FEST_INFO.socialMedia.facebook}`,
      icon: Facebook,
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/${FEST_INFO.socialMedia.twitter.replace('@', '')}`,
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      url: `https://linkedin.com/company/${FEST_INFO.socialMedia.linkedin}`,
      icon: Linkedin,
    },
    {
      name: 'YouTube',
      url: `https://youtube.com/c/${FEST_INFO.socialMedia.youtube}`,
      icon: Youtube,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-navy-950 via-slate-900 to-black border-t border-white/10 overflow-hidden">
      {/* Enhanced Background elements with gradients */}
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
      
      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-blue-900/10" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <span className="text-white font-bold text-xl">TF</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Tech Fest 2026
                </h3>
                <p className="text-gray-400 text-xs">
                  {FEST_INFO.organization}
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              {FEST_INFO.tagline}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span>April 1-3, 2026</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300 text-sm group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>{FEST_INFO.venue}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-gray-400 text-xs mb-3 font-medium">Follow us</p>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  const gradients = [
                    'from-pink-500 to-rose-500',
                    'from-blue-600 to-blue-500',
                    'from-sky-500 to-blue-500',
                    'from-blue-700 to-blue-600',
                    'from-red-600 to-red-500'
                  ];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 bg-gradient-to-r ${gradients[index]} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      title={social.name}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-150 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-150 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Events</h4>
            <ul className="space-y-3">
              {eventLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-150 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Contact Us</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  {FEST_INFO.contact.phone.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+91${phone}`}
                      className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      +91 {phone}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a
                  href={`mailto:${FEST_INFO.contact.email}`}
                  className="text-sm text-gray-300 hover:text-purple-400 transition-colors break-all"
                >
                  {FEST_INFO.contact.email}
                </a>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <a
                  href={`https://${FEST_INFO.socialMedia.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-green-400 transition-colors break-all"
                >
                  {FEST_INFO.socialMedia.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-r from-blue-950/30 via-purple-950/30 to-cyan-950/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>
                © {currentYear} <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">{FEST_INFO.name}</span>. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300 hover:underline">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-purple-400 transition-colors duration-300 hover:underline">
                Terms
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-all shadow-lg group-hover:shadow-blue-500/50">
                  <ArrowUp size={14} className="text-white" />
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs">
              Made with <span className="text-red-400">❤</span> for innovation and creativity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
