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
      className="glass-panel rounded-xl border border-white/10 glow-border p-8 text-center transition-all duration-300"
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
        {prefix}
        {inView && <CountUp end={value} duration={duration} decimals={decimals} separator="," />}
        {!inView && '0'}
        {suffix}
      </div>
      <div className="text-sm md:text-base text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
};

export default StatCard;
