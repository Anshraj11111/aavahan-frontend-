import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Trophy, Users, Award, Target, ArrowRight } from 'lucide-react';

const NewAboutSection = () => {
  const features = [
    { icon: Sparkles, title: 'Innovation', desc: 'Cutting-edge tech competitions', color: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, title: 'Prizes', desc: '₹60,000+ prize pool', color: 'from-yellow-500 to-orange-500' },
    { icon: Users, title: 'Networking', desc: 'Connect with industry leaders', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, title: 'Workshops', desc: 'Hands-on learning sessions', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <section className="py-20 relative bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a2744]">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tech Fest 2026</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-6 rounded-full shadow-lg shadow-blue-500/50" />
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-bold">
            Tech Fest 2026 brings together <span className="text-cyan-400 font-black">innovation</span>, <span className="text-blue-400 font-black">creativity</span>, and <span className="text-purple-400 font-black">technical excellence</span> at Shri Ram Group of Colleges.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{feature.title}</h3>
              <p className="text-base text-gray-100 font-semibold">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-base transition-colors group"
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewAboutSection;
