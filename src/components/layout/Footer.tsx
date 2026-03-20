import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';
import { FEST_INFO } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { name: 'My Tickets', path: '/my-tickets' },
    { name: 'Ticket Lookup', path: '/ticket-lookup' },
    { name: 'Registration Help', path: '/contact?subject=registration' },
    { name: 'Technical Support', path: '/contact?subject=technical' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: `https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}`,
      icon: '📷',
    },
    {
      name: 'Facebook',
      url: `https://facebook.com/${FEST_INFO.socialMedia.facebook}`,
      icon: '📘',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/${FEST_INFO.socialMedia.twitter.replace('@', '')}`,
      icon: '🐦',
    },
    {
      name: 'LinkedIn',
      url: `https://linkedin.com/company/${FEST_INFO.socialMedia.linkedin}`,
      icon: '💼',
    },
    {
      name: 'YouTube',
      url: `https://youtube.com/c/${FEST_INFO.socialMedia.youtube}`,
      icon: '📺',
    },
  ];

  return (
    <footer className="bg-black/50 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TF</span>
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-xl">
                  Tech Fest 2026
                </h3>
                <p className="text-white/60 text-sm">
                  {FEST_INFO.organization}
                </p>
              </div>
            </div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              {FEST_INFO.tagline}
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/70">
                <Calendar className="w-4 h-4 text-primary-400" />
                <span className="text-sm">April 1-3, 2026</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm">{FEST_INFO.venue}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Connect With Us</h4>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="w-4 h-4 text-primary-400" />
                <a
                  href={`tel:+91${FEST_INFO.contact.phone[0]}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  +91 {FEST_INFO.contact.phone[0]}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="w-4 h-4 text-primary-400" />
                <a
                  href={`mailto:${FEST_INFO.contact.email}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {FEST_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Globe className="w-4 h-4 text-primary-400" />
                <a
                  href={`https://${FEST_INFO.socialMedia.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  {FEST_INFO.socialMedia.website}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-white/70 text-sm mb-3">Follow us on social media</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-white font-semibold text-lg mb-2">
              Stay Updated
            </h4>
            <p className="text-white/70 mb-6">
              Get the latest updates about Tech Fest 2026 events, announcements, and more.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-r-none text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
              />
              <button className="btn-primary mt-3 sm:mt-0 sm:rounded-l-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm text-center md:text-left">
              <p>
                © {currentYear} {FEST_INFO.name} - {FEST_INFO.organization}. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-white/50 text-xs flex items-center justify-center">
              Made with <Heart className="w-3 h-3 mx-1 text-red-400" /> for innovation and creativity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;