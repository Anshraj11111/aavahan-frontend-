import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, User } from 'lucide-react';

const NewContactSection = () => {
  const coordinators = [
    { name: 'Coordinator 1', role: 'Technical Head', image: null },
    { name: 'Coordinator 2', role: 'Cultural Head', image: null },
    { name: 'Coordinator 3', role: 'Operations Head', image: null }
  ];

  return (
    <section className="py-20 relative bg-gradient-to-br from-[#0f1f3d] via-[#0a1628] to-[#1a2744]">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get In <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full shadow-lg shadow-blue-500/50" />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Phone</h3>
              <p className="text-gray-100 text-base font-bold">+91 XXXXX XXXXX</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Email</h3>
              <p className="text-gray-100 text-base font-bold">techfest@srgc.edu</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Address</h3>
              <p className="text-gray-100 text-base font-bold">Shri Ram Group, Muzaffarnagar</p>
            </motion.div>
          </div>

          {/* Coordinators */}
          <div>
            <h3 className="text-3xl font-black text-white text-center mb-8">Meet Our Team</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {coordinators.map((coord, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-400/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-center group"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-blue-400/30 shadow-lg group-hover:scale-110 transition-transform">
                    <User className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{coord.name}</h3>
                  <p className="text-gray-100 text-base font-bold">{coord.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewContactSection;
