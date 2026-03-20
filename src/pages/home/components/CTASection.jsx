import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../../lib/animations';
import PremiumButton from '../../../components/common/PremiumButton';
import GlowBackground from '../../../components/common/GlowBackground';

/**
 * CTASection Component
 * Final call-to-action band with strong background
 */
const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-purple-950/50 to-cyan-950/50" />
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
      <GlowBackground color="purple" position="center" size="xl" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Limited Spots Available</span>
            </div>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold gradient-text mb-6"
          >
            Ready to Join the Revolution?
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed"
          >
            Don't miss out on the biggest tech festival of 2026. 
            Register now and be part of something extraordinary.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/events">
              <PremiumButton 
                variant="primary" 
                size="xl"
                icon={<Sparkles size={20} />}
              >
                Register Now
              </PremiumButton>
            </Link>
            <Link to="/about">
              <PremiumButton 
                variant="glass" 
                size="xl"
                icon={<ArrowRight size={20} />}
                iconRight
              >
                Learn More
              </PremiumButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
