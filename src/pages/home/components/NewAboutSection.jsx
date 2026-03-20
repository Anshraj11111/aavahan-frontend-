import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Users } from 'lucide-react';
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from '../../../lib/animations';
import SectionWrapper from '../../../components/common/SectionWrapper';
import SectionHeading from '../../../components/common/SectionHeading';
import PremiumButton from '../../../components/common/PremiumButton';
import GlassCard from '../../../components/common/GlassCard';

/**
 * AboutSection Component
 * About preview with two-column layout
 */
const AboutSection = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'Innovation First',
      description: 'Cutting-edge competitions and workshops led by industry experts'
    },
    {
      icon: <Target size={24} />,
      title: 'Skill Development',
      description: 'Hands-on learning experiences to enhance your technical prowess'
    },
    {
      icon: <Users size={24} />,
      title: 'Networking',
      description: 'Connect with like-minded innovators and industry professionals'
    }
  ];

  return (
    <SectionWrapper showGrid showGlow glowColor="cyan">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Heading */}
          <div className="text-center mb-16">
            <SectionHeading
              badge="About Tech Fest"
              title="Where Innovation Meets Creativity"
              subtitle="Join us for the most anticipated technology festival of 2026, celebrating innovation, diversity, and technical excellence."
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div variants={slideInLeft}>
              <h3 className="text-3xl font-display font-bold gradient-text mb-6">
                CODE IT. BUILD IT. BREAK LIMITS.
              </h3>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Tech Fest 2026 is the flagship event of Shri Ram Group, Jabalpur, bringing together 
                thousands of students, innovators, and tech enthusiasts for three days of 
                extraordinary experiences.
              </p>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                From intense coding competitions and hackathons to vibrant cultural performances 
                and networking opportunities, Tech Fest 2026 is your gateway to innovation, 
                learning, and unforgettable memories.
              </p>

              <Link to="/about">
                <PremiumButton 
                  variant="secondary" 
                  size="lg"
                  icon={<ArrowRight size={20} />}
                  iconRight
                >
                  Learn More About Us
                </PremiumButton>
              </Link>
            </motion.div>

            {/* Right: Features */}
            <motion.div variants={slideInRight} className="space-y-4">
              {features.map((feature, index) => (
                <GlassCard key={index} padding="md" hover>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
