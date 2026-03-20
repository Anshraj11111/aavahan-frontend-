import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, Zap } from 'lucide-react';
import { staggerContainer } from '../../../lib/animations';
import SectionWrapper from '../../../components/common/SectionWrapper';

/**
 * StatsSection Component
 * Fest highlights strip with animated counters
 */
const StatsSection = () => {
  const stats = [
    { 
      icon: 'Users', 
      value: 10000, 
      label: 'Expected Participants',
      suffix: '+'
    },
    { 
      icon: 'Trophy', 
      value: 50, 
      label: 'Events & Competitions',
      suffix: '+'
    },
    { 
      icon: 'Calendar', 
      value: 3, 
      label: 'Days of Innovation'
    },
    { 
      icon: 'Zap', 
      value: 100, 
      label: 'Workshops & Sessions',
      suffix: '+'
    },
  ];

  const getIcon = (iconName) => {
    const icons = {
      Users: <Users size={32} />,
      Trophy: <Trophy size={32} />,
      Calendar: <Calendar size={32} />,
      Zap: <Zap size={32} />
    };
    return icons[iconName] || null;
  };

  return (
    <SectionWrapper showGlow glowColor="blue" className="bg-navy-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-panel rounded-xl border border-white/10 glow-border p-8 text-center transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
                {getIcon(stat.icon)}
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                {stat.value.toLocaleString()}{stat.suffix || ''}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
