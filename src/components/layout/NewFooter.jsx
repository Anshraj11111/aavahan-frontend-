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
    <footer className="relative bg-navy-950 border-t border-white/10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
      <GlowBackground color="blue" position="top" size="lg" className="opacity-30" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">TF</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-lg gradient-text">
                  Tech Fest 2026
                </h3>
                <p className="text-gray-500 text-xs">
                  {FEST_INFO.organization}
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              {FEST_INFO.tagline}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>April 1-3, 2026</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{FEST_INFO.venue}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-gray-500 text-xs mb-3">Follow us</p>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 glass-panel border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300"
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
            <h4 className="text-white font-semibold text-base mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6">Events</h4>
            <ul className="space-y-3">
              {eventLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6">Contact Us</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {FEST_INFO.contact.phone.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+91${phone}`}
                      className="block text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      +91 {phone}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${FEST_INFO.contact.email}`}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors break-all"
                >
                  {FEST_INFO.contact.email}
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <a
                  href={`https://${FEST_INFO.socialMedia.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors break-all"
                >
                  {FEST_INFO.socialMedia.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              <p>
                © {currentYear} {FEST_INFO.name}. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <div className="w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                  <ArrowUp size={14} />
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-gray-600 text-xs">
              Made with passion for innovation and creativity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
