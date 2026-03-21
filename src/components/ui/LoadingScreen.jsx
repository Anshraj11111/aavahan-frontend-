import { motion } from 'framer-motion';
import { Code, Zap, Rocket } from 'lucide-react';

const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Code className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold text-white mb-4"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tech Fest 2026
          </span>
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/70 text-lg mb-8"
        >
          Loading the future of technology...
        </motion.p>

        {/* Loading Icons */}
        <div className="flex justify-center space-x-4">
          {[Code, Zap, Rocket].map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + index * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 1
              }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, delay: 1 }}
          className="w-64 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-8"
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;