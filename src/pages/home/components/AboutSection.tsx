import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Calendar, MapPin } from 'lucide-react';
import { ROUTES, FEST_INFO, DAY_INFO } from '../../../constants';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
              About Tech Fest 2026
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                Tech Fest 2026 is the flagship annual technology festival organized by 
                {' '}{FEST_INFO.organization}. This three-day extravaganza brings together 
                students, professionals, and technology enthusiasts from across the region 
                to celebrate innovation, creativity, and technical excellence.
              </p>
              <p>
                Our festival combines the best of both worlds - cutting-edge technology 
                competitions and rich cultural celebrations. From hackathons and coding 
                contests to traditional dance performances and ethnic fashion shows, 
                Tech Fest 2026 offers something for everyone.
              </p>
              <p>
                Join us in this celebration of talent, culture, and innovation as we 
                explore the future of technology while honoring our diverse heritage.
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Learn More About Us
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Right Content - Key Features */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-accent-400 mr-3" />
                <h3 className="text-white font-semibold text-lg">Excellence in Innovation</h3>
              </div>
              <p className="text-white/70">
                Showcase your projects, compete with the best minds, and win exciting prizes 
                in our technical competitions and hackathons.
              </p>
            </div>

            <div className="glass p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-secondary-400 mr-3" />
                <h3 className="text-white font-semibold text-lg">Cultural Diversity</h3>
              </div>
              <p className="text-white/70">
                Experience the theme "Unity in Diversity" through traditional performances, 
                ethnic fashion shows, and cultural celebrations.
              </p>
            </div>

            <div className="glass p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 text-primary-400 mr-3" />
                <h3 className="text-white font-semibold text-lg">Networking Opportunities</h3>
              </div>
              <p className="text-white/70">
                Connect with industry professionals, fellow students, and potential 
                collaborators from across the region.
              </p>
            </div>
          </div>
        </div>

        {/* Day-wise Schedule Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">
              Three Days of Innovation & Culture
            </h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Each day of Tech Fest 2026 offers unique experiences and opportunities 
              to learn, compete, and celebrate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(DAY_INFO).map(([day, info]) => (
              <div key={day} className="card text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                
                <h4 className="text-white font-bold text-xl mb-2">
                  Day {day}
                </h4>
                
                <h5 className="text-primary-400 font-semibold mb-2">
                  {info.title}
                </h5>
                
                <p className="text-white/60 text-sm mb-4">
                  {info.date}
                </p>
                
                <p className="text-white/80 text-sm mb-4">
                  {info.description}
                </p>
                
                <div className="space-y-1">
                  {info.events.slice(0, 3).map((event, index) => (
                    <div key={index} className="text-white/60 text-xs">
                      • {event}
                    </div>
                  ))}
                  {info.events.length > 3 && (
                    <div className="text-primary-400 text-xs">
                      +{info.events.length - 3} more events
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass p-8 lg:p-12 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">
              Ready to Join the Celebration?
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Don't miss out on the biggest technology festival in Central India. 
              Register now and be part of this incredible journey of innovation and culture.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to={ROUTES.EVENTS}
                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
              >
                Register for Events
              </Link>
              <Link
                to={ROUTES.SCHEDULE}
                className="btn-outline text-lg px-8 py-4 w-full sm:w-auto"
              >
                View Full Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;