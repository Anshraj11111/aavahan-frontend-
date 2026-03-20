import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass p-12 rounded-2xl">
            {/* 404 Animation */}
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-display font-bold text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text mb-4">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto rounded-full"></div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Page Not Found
            </h1>
            
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn.
            </p>

            <div className="space-y-4 text-white/70 mb-8">
              <p className="flex items-center justify-center">
                <Search className="w-4 h-4 mr-2" />
                The page might have been moved or deleted
              </p>
              <p>Or you might have typed the URL incorrectly</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/" 
                className="btn-primary flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="btn-outline flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Or explore these popular pages:</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/events" 
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Events
                </Link>
                <span className="text-white/30">•</span>
                <Link 
                  to="/schedule" 
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Schedule
                </Link>
                <span className="text-white/30">•</span>
                <Link 
                  to="/about" 
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  About
                </Link>
                <span className="text-white/30">•</span>
                <Link 
                  to="/contact" 
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;