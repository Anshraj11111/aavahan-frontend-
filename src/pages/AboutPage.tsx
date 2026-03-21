import { Calendar, MapPin, Users, Trophy, Phone, Mail, Globe, Star, Zap, Heart, Award, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEST_INFO, DAY_INFO } from '../constants';
import { fadeInUp, staggerContainer, scaleUp } from '../lib/animations';

const AboutPage = () => {
  const stats = [
    { icon: Users, label: "Expected Participants", value: "5000+", color: "from-blue-500 to-cyan-500" },
    { icon: Trophy, label: "Events & Competitions", value: "50+", color: "from-purple-500 to-pink-500" },
    { icon: Award, label: "Prize Pool", value: "₹5L+", color: "from-green-500 to-emerald-500" },
    { icon: Star, label: "Days of Celebration", value: "3", color: "from-yellow-500 to-orange-500" }
  ];

  const features = [
    {
      icon: Trophy,
      title: "Competitive Events",
      description: "Participate in coding competitions, hackathons, cultural performances, and technical challenges with exciting prizes.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Networking Opportunities",
      description: "Connect with like-minded students, industry professionals, and potential collaborators from various institutions.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Learning & Workshops",
      description: "Attend workshops, technical talks, and cultural performances to expand your knowledge and skills.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Cultural Celebration",
      description: "Celebrate India's rich cultural diversity through traditional performances, ethnic fashion, and folk dances.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Premium Venue",
      description: "Experience the festival at the state-of-the-art Shri Ram Group campus with modern facilities.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Sparkles,
      title: "Recognition & Awards",
      description: "Gain recognition for your talents and achievements on a prestigious platform with certificates and awards.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 font-medium mb-6">
                About Tech Fest 2026
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight"
            >
              Where Innovation Meets
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Celebration
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              {FEST_INFO.description}
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-8 text-gray-300"
            >
              <div className="flex items-center glass-panel px-6 py-3 rounded-full">
                <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                <span className="font-medium">April 1-3, 2026</span>
              </div>
              <div className="flex items-center glass-panel px-6 py-3 rounded-full">
                <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                <span className="font-medium">{FEST_INFO.venue}</span>
              </div>
              <div className="flex items-center glass-panel px-6 py-3 rounded-full">
                <Users className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="font-medium">{FEST_INFO.organization}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleUp}
                  className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* About Content */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="glass-panel p-8 md:p-12 rounded-2xl mb-16 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 text-center">
                  Welcome to 
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Tech Fest 2026
                  </span>
                </h2>
                
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  <p className="text-gray-300 leading-relaxed text-lg text-center mb-8">
                    Tech Fest 2026 is the premier technology festival organized by Shri Ram Group, Jabalpur. 
                    This three-day extravaganza celebrates the perfect blend of cultural diversity and 
                    technological innovation, bringing together students from across the region to showcase 
                    their talents and compete in various events.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
                        Our Vision
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Our festival embodies the theme "Unity in Diversity," highlighting how technology 
                        can bridge cultural gaps and create meaningful connections. From traditional cultural 
                        performances to cutting-edge technical competitions, Tech Fest 2026 offers something 
                        for everyone.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Target className="w-6 h-6 mr-3 text-blue-400" />
                        Our Mission
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Join us for an unforgettable experience filled with learning, networking, entertainment, 
                        and the opportunity to showcase your skills on a prestigious platform. We aim to inspire 
                        the next generation of innovators and creators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day-wise Information */}
            <motion.div 
              variants={staggerContainer}
              className="mb-20"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-display font-bold text-white mb-12 text-center"
              >
                Three Days of 
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Excellence</span>
              </motion.h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {Object.entries(DAY_INFO).map(([day, info], index) => (
                  <motion.div 
                    key={day} 
                    variants={scaleUp}
                    className="glass-panel p-8 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Day Number Background */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-300">
                      {day}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-cyan-500' :
                          index === 1 ? 'from-purple-500 to-pink-500' :
                          'from-green-500 to-emerald-500'
                        } rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Day {day}</h3>
                          <p className="text-gray-400 text-sm">{info.date}</p>
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-semibold text-white mb-3">{info.title}</h4>
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed">{info.description}</p>
                      
                      <div className="space-y-3">
                        {info.events.slice(0, 4).map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-center text-gray-300 text-sm group-hover:text-white transition-colors duration-300">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              index === 0 ? 'bg-blue-400' :
                              index === 1 ? 'bg-purple-400' :
                              'bg-green-400'
                            }`} />
                            <span>{event}</span>
                          </div>
                        ))}
                        {info.events.length > 4 && (
                          <p className="text-gray-500 text-xs ml-5">
                            +{info.events.length - 4} more events
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div 
              variants={staggerContainer}
              className="mb-20"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-display font-bold text-white mb-4 text-center"
              >
                Why Attend 
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tech Fest 2026?</span>
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
              >
                Discover endless opportunities for growth, learning, and celebration at India's most innovative tech festival
              </motion.p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={scaleUp}
                      className="glass-panel p-8 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              variants={fadeInUp}
              className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold text-white mb-4 text-center">
                  Get in 
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Touch</span>
                </h2>
                <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                  Have questions? Want to collaborate? We'd love to hear from you. Reach out to us through any of these channels.
                </p>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <Phone className="w-6 h-6 mr-3 text-blue-400" />
                      Contact Details
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Phone</p>
                          <div className="space-y-1">
                            {FEST_INFO.contact.phone.map((phone, index) => (
                              <p key={index} className="text-gray-300 font-mono">{phone}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Email</p>
                          <p className="text-gray-300">{FEST_INFO.contact.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Website</p>
                          <p className="text-gray-300">{FEST_INFO.socialMedia.website}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">Address</p>
                          <p className="text-gray-300 leading-relaxed">{FEST_INFO.contact.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
                      Follow Us
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <a
                        href={`https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 glass-panel rounded-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold">IG</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Instagram</p>
                          <p className="text-gray-400 text-sm">{FEST_INFO.socialMedia.instagram}</p>
                        </div>
                      </a>
                      
                      <a
                        href={`https://facebook.com/${FEST_INFO.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 glass-panel rounded-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold">FB</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Facebook</p>
                          <p className="text-gray-400 text-sm">{FEST_INFO.socialMedia.facebook}</p>
                        </div>
                      </a>
                      
                      <a
                        href={`https://twitter.com/${FEST_INFO.socialMedia.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 glass-panel rounded-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold">TW</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Twitter</p>
                          <p className="text-gray-400 text-sm">{FEST_INFO.socialMedia.twitter}</p>
                        </div>
                      </a>
                      
                      <a
                        href={`https://linkedin.com/company/${FEST_INFO.socialMedia.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 glass-panel rounded-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold">LI</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">LinkedIn</p>
                          <p className="text-gray-400 text-sm">{FEST_INFO.socialMedia.linkedin}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;