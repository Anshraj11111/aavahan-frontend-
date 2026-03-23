import { motion } from 'framer-motion';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { scaleUp } from '../../lib/animations';

/**
 * StatCard Component
 * Displays animated statistics with icons
 */
const StatCard = ({ value, label, icon, suffix = '', prefix = '', decimals = 0, duration = 2.5 }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div 
      ref={ref} 
      variants={scaleUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="glass-panel rounded-2xl border-2 border-white/30 backdrop-blur-xl p-8 text-center group hover:scale-105 transition-all duration-300 hover:border-white/50"
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <div className="text-4xl font-black text-white mb-2">
        {prefix}
        {inView && <CountUp end={value} duration={duration} decimals={decimals} separator="," />}
        {!inView && '0'}
        {suffix}
      </div>
      <div className="text-base text-white font-black uppercase tracking-wide">{label}</div>
    </motion.div>
  );
};

export default StatCard;
