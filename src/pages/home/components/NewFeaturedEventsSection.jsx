import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staggerContainer, staggerChildren } from '../../../lib/animations';
import SectionWrapper from '../../../components/common/SectionWrapper';
import SectionHeading from '../../../components/common/SectionHeading';
import EventCard from '../../../components/cards/EventCard';
import SkeletonCard from '../../../components/ui/SkeletonCard';
import EmptyState from '../../../components/ui/EmptyState';
import PremiumButton from '../../../components/common/PremiumButton';
import { eventsService } from '../../../services/events';

/**
 * FeaturedEventsSection Component
 * Displays featured events in a grid
 */
const FeaturedEventsSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.getFeaturedEvents(),
  });

  // Safely extract events array from response
  // Backend returns: { success: true, data: [...] }
  const events = Array.isArray(data?.data) ? data.data : [];
  const displayEvents = events.slice(0, 6); // Show max 6 events

  return (
    <SectionWrapper showGrid showGlow glowColor="purple" className="bg-navy-900/20">
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
              badge="Featured Events"
              badgeVariant="purple"
              title="Explore Our Signature Events"
              subtitle="From intense coding competitions to vibrant cultural performances, discover what makes Tech Fest 2026 extraordinary."
            />
          </div>

          {/* Events Grid */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard variant="event" count={6} />
            </div>
          )}

          {error && (
            <EmptyState
              icon={<AlertCircle size={48} />}
              title="Failed to Load Events"
              message="We couldn't load the featured events. Please try again later."
            />
          )}

          {!isLoading && !error && displayEvents.length === 0 && (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No Featured Events Yet"
              message="Check back soon for exciting events!"
            />
          )}

          {!isLoading && !error && displayEvents.length > 0 && (
            <>
              <motion.div 
                variants={staggerChildren(0.1)}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {displayEvents.map((event) => (
                  <motion.div key={event._id} variants={staggerChildren()}>
                    <EventCard event={event} featured />
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Button */}
              <div className="text-center">
                <Link to="/events">
                  <PremiumButton 
                    variant="secondary" 
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconRight
                  >
                    View All Events
                  </PremiumButton>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default FeaturedEventsSection;
