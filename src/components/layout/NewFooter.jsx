import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const NewFooter = () => {
  return (
    <footer className="bg-navy-950/95 backdrop-blur-md text-white py-16 border-t border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* About */}
          <div>
            <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AAVHAAN 2026
            </h3>
            <p className="text-blue-200 text-base leading-relaxed font-semibold">
              Aavhaan 2026 at Shri Ram Group of Colleges - Where innovation meets excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-blue-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent text-base font-bold transition-all duration-300 hover:translate-x-1 inline-block">→ Home</Link></li>
              <li><Link to="/events" className="text-blue-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent text-base font-bold transition-all duration-300 hover:translate-x-1 inline-block">→ Events</Link></li>
              <li><Link to="/schedule" className="text-blue-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent text-base font-bold transition-all duration-300 hover:translate-x-1 inline-block">→ Schedule</Link></li>
              <li><Link to="/about" className="text-blue-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent text-base font-bold transition-all duration-300 hover:translate-x-1 inline-block">→ About</Link></li>
              <li><Link to="/contact" className="text-blue-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent text-base font-bold transition-all duration-300 hover:translate-x-1 inline-block">→ Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-black mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-blue-200 text-base font-bold">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-base font-bold">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span>techfest@srgc.edu</span>
              </li>
              <li className="flex items-start gap-3 text-blue-200 text-base font-bold">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span>Shri Ram Group of Colleges, Jabalpur</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-black mb-4 text-white">Follow Us</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="#" className="glass-panel hover:bg-white/10 border border-white/20 hover:border-blue-400/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-sm">FB</span>
                </div>
                <span className="text-blue-200 text-xs font-bold">Facebook</span>
              </a>
              <a href="#" className="glass-panel hover:bg-white/10 border border-white/20 hover:border-blue-400/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30 group">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/30">
                  <span className="text-white font-bold text-sm">TW</span>
                </div>
                <span className="text-blue-200 text-xs font-bold">Twitter</span>
              </a>
              <a href="https://www.instagram.com/shri_ram_group_of_institutions?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="glass-panel hover:bg-white/10 border border-white/20 hover:border-purple-400/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                  <span className="text-white font-bold text-sm">IG</span>
                </div>
                <span className="text-blue-200 text-xs font-bold">Instagram</span>
              </a>
              <a href="#" className="glass-panel hover:bg-white/10 border border-white/20 hover:border-blue-400/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-sm">LI</span>
                </div>
                <span className="text-blue-200 text-xs font-bold">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white text-base font-bold">
            © 2026 Shri Ram Group of Colleges. All rights reserved.
          </p>
          <p className="text-blue-300 text-sm font-semibold mt-2">
            Built with ❤️ for Aavhaan 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
