import { Calendar, MapPin, Users, Trophy, Clock, Phone, Mail, Globe } from 'lucide-react';
import { FEST_INFO, DAY_INFO } from '../constants';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-900/20 to-secondary-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              About {FEST_INFO.name}
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              {FEST_INFO.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/70">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>April 1-3, 2026</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{FEST_INFO.venue}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{FEST_INFO.organization}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-2xl mb-12">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Welcome to Tech Fest 2026
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed mb-6">
                  Tech Fest 2026 is the premier technology festival organized by Shri Ram Group, Jabalpur. 
                  This three-day extravaganza celebrates the perfect blend of cultural diversity and 
                  technological innovation, bringing together students from across the region to showcase 
                  their talents and compete in various events.
                </p>
                <p className="text-white/80 leading-relaxed mb-6">
                  Our festival embodies the theme "Unity in Diversity," highlighting how technology 
                  can bridge cultural gaps and create meaningful connections. From traditional cultural 
                  performances to cutting-edge technical competitions, Tech Fest 2026 offers something 
                  for everyone.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Join us for an unforgettable experience filled with learning, networking, entertainment, 
                  and the opportunity to showcase your skills on a prestigious platform.
                </p>
              </div>
            </div>

            {/* Day-wise Information */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {Object.entries(DAY_INFO).map(([day, info]) => (
                <div key={day} className="glass p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Day {day}</h3>
                      <p className="text-white/60 text-sm">{info.date}</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                  <p className="text-white/70 text-sm mb-4">{info.description}</p>
                  <div className="space-y-2">
                    {info.events.slice(0, 3).map((event, index) => (
                      <div key={index} className="flex items-center text-white/60 text-sm">
                        <Trophy className="w-3 h-3 mr-2 text-primary-400" />
                        <span>{event}</span>
                      </div>
                    ))}
                    {info.events.length > 3 && (
                      <p className="text-white/50 text-xs">
                        +{info.events.length - 3} more events
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <div className="glass p-8 rounded-2xl mb-12">
              <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
                Why Attend Tech Fest 2026?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Trophy className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Competitive Events</h3>
                      <p className="text-white/70">
                        Participate in coding competitions, hackathons, cultural performances, 
                        and technical challenges with exciting prizes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-secondary-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Users className="w-5 h-5 text-secondary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Networking</h3>
                      <p className="text-white/70">
                        Connect with like-minded students, industry professionals, 
                        and potential collaborators from various institutions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Clock className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Learning Opportunities</h3>
                      <p className="text-white/70">
                        Attend workshops, technical talks, and cultural performances 
                        to expand your knowledge and skills.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <MapPin className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Premium Venue</h3>
                      <p className="text-white/70">
                        Experience the festival at the state-of-the-art Shri Ram Group campus 
                        with modern facilities and infrastructure.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-secondary-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Calendar className="w-5 h-5 text-secondary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Cultural Celebration</h3>
                      <p className="text-white/70">
                        Celebrate India's rich cultural diversity through traditional 
                        performances, ethnic fashion, and folk dances.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Trophy className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Recognition</h3>
                      <p className="text-white/70">
                        Gain recognition for your talents and achievements on a 
                        prestigious platform with certificates and awards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
                Get in Touch
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Phone</p>
                        <p className="text-white/70">{FEST_INFO.contact.phone.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-white/70">{FEST_INFO.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-primary-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Website</p>
                        <p className="text-white/70">{FEST_INFO.socialMedia.website}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary-400 mr-3 mt-1" />
                      <div>
                        <p className="text-white font-medium">Address</p>
                        <p className="text-white/70">{FEST_INFO.contact.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={`https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-pink-400 text-sm font-bold">IG</span>
                      </div>
                      <span className="text-white/80">Instagram</span>
                    </a>
                    <a
                      href={`https://facebook.com/${FEST_INFO.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-400 text-sm font-bold">FB</span>
                      </div>
                      <span className="text-white/80">Facebook</span>
                    </a>
                    <a
                      href={`https://twitter.com/${FEST_INFO.socialMedia.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sky-400 text-sm font-bold">TW</span>
                      </div>
                      <span className="text-white/80">Twitter</span>
                    </a>
                    <a
                      href={`https://linkedin.com/company/${FEST_INFO.socialMedia.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-400 text-sm font-bold">LI</span>
                      </div>
                      <span className="text-white/80">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;