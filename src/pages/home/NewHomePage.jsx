import HeroSection from './components/NewHeroSection';
import StatsSection from './components/NewStatsSection';
import AboutSection from './components/NewAboutSection';
import FeaturedEventsSection from './components/NewFeaturedEventsSection';
import CTASection from './components/CTASection';

/**
 * HomePage Component
 * Premium home page with Three.js background and all sections
 */
const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Three.js */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* About Preview */}
      <AboutSection />
      
      {/* Featured Events */}
      <FeaturedEventsSection />
      
      {/* Final CTA */}
      <CTASection />
    </div>
  );
};

export default HomePage;
