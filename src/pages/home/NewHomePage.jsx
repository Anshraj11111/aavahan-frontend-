import NewHeroSection from './components/NewHeroSection';
import NewAboutSection from './components/NewAboutSection';
import NewEventsCardsSection from './components/NewEventsCardsSection';
import NewFeaturedEventsSection from './components/NewFeaturedEventsSection';
import NewScheduleSection from './components/NewScheduleSection';
import NewContactSection from './components/NewContactSection';
import FloatingActionButton from '../../components/ui/FloatingActionButton';

const NewHomePage = () => {
  return (
    <div className="min-h-screen">
      <NewHeroSection />
      <NewAboutSection />
      <NewEventsCardsSection />
      <NewFeaturedEventsSection />
      <NewScheduleSection />
      <NewContactSection />
      <FloatingActionButton />
    </div>
  );
};

export default NewHomePage;
