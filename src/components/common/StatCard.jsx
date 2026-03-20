<<<<<<< HEAD
﻿import { motion } from 'framer-motion';
=======
import { motion } from 'framer-motion';
>>>>>>> 2287bebb3c1abbf60dd8d9ef2c40fa3a3262f433
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { scaleUp } from '../../lib/animations';

<<<<<<< HEAD
=======
/**
 * StatCard Component
 * Displays animated statistics with icons
 */
>>>>>>> 2287bebb3c1abbf60dd8d9ef2c40fa3a3262f433
const StatCard = ({ value, label, icon, suffix = '', prefix = '', decimals = 0, duration = 2.5 }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div 
      ref={ref} 
      variants={scaleUp}
<<<<<<< HEAD
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
=======
>>>>>>> 2287bebb3c1abbf60dd8d9ef2c40fa3a3262f433
      className="glass-panel rounded-xl border border-white/10 glow-border p-8 text-center transition-all duration-300"
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
        {prefix}
<<<<<<< HEAD
        {inView && <CountUp end={value} duration={duration} decimals={decimals} separator="," />}
        {!inView && '0'}
=======
        {inView ? (
          <CountUp end={value} duration={duration} decimals={decimals} separator="," />
        ) : (
          <span>0</span>
        )}
>>>>>>> 2287bebb3c1abbf60dd8d9ef2c40fa3a3262f433
        {suffix}
      </div>
      <div className="text-sm md:text-base text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
};

export default StatCard;
