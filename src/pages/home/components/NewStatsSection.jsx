import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, Zap } from 'lucide-react';
import { staggerContainer } from '../../../lib/animations';
import StatCard from '../../../components/common/StatCard';
import SectionWrapper from '../../../components/common/SectionWrapper';

/**
 * StatsSection Component
 * Fest highlights strip with animated counters
 */
const StatsSection = () => {
  const stats = [
    { 
      icon: <Users size={32} />, 
      value: 10000, 
      label: 'Expected Participants',
      suffix: '+'
    },
    { 
      icon: <Trophy size={32} />, 
      value: 50, 
      label: 'Events & Competitions',
      suffix: '+'
    },
    { 
      icon: <Calendar size={32} />, 
      value: 3, 
      label: 'Days of Innovation'
    },
    { 
      icon: <Zap size={32} />, 
      value: 100, 
      label: 'Workshops & Sessions',
      suffix: '+'
    },
  ];

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
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              suffix={stat.suffix}
            />
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
