import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Initial events data that matches EventsPage
const initialEvents = [
  {
    _id: '1',
    title: 'AI & Machine Learning Hackathon',
    slug: 'ai-ml-hackathon',
    shortDescription: 'Build innovative AI solutions in 48 hours. Compete with the best minds in artificial intelligence.',
    fullDescription: 'Join us for an intensive 48-hour hackathon focused on AI and Machine Learning. Teams will work on real-world problems and present their solutions to industry experts.',
    category: 'technical',
    department: 'Computer Science',
    day: 2,
    date: '2026-04-02',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    venue: 'Tech Hub Auditorium',
    participationType: 'team',
    minTeamSize: 2,
    maxTeamSize: 4,
    entryFee: 500,
    maxRegistrations: 50,
    currentRegistrations: 0,
    registrationDeadline: '2026-03-30T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['Teams of 2-4 members', 'Original code only', '48-hour time limit'],
    eligibility: 'Open to all students',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Dr. Rajesh Kumar',
    coordinatorPhone: '9876543210',
    coordinatorEmail: 'rajesh@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop',
    tags: ['AI', 'Machine Learning', 'Hackathon', 'Programming'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '2',
    title: 'Cultural Dance Competition',
    slug: 'cultural-dance-competition',
    shortDescription: 'Showcase your cultural heritage through traditional and contemporary dance forms.',
    fullDescription: 'A vibrant celebration of Indian culture through dance. Participants can perform solo or in groups representing various regional dance forms.',
    category: 'cultural',
    department: 'Cultural Committee',
    day: 1,
    date: '2026-04-01',
    startTime: '2:00 PM',
    endTime: '6:00 PM',
    venue: 'Main Auditorium',
    participationType: 'team',
    minTeamSize: 1,
    maxTeamSize: 8,
    entryFee: 200,
    maxRegistrations: 30,
    currentRegistrations: 0,
    registrationDeadline: '2026-03-29T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['Performance time: 5-8 minutes', 'Traditional or fusion allowed', 'Own music arrangement'],
    eligibility: 'All students welcome',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Prof. Meera Sharma',
    coordinatorPhone: '9876543211',
    coordinatorEmail: 'meera@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=600&fit=crop',
    tags: ['Dance', 'Cultural', 'Traditional', 'Performance'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '3',
    title: 'Robotics Championship',
    slug: 'robotics-championship',
    shortDescription: 'Design and build autonomous robots to compete in challenging tasks and obstacles.',
    fullDescription: 'The ultimate robotics challenge where teams design, build, and program robots to navigate complex courses and complete specific tasks.',
    category: 'technical',
    department: 'Mechanical Engineering',
    day: 3,
    date: '2026-04-03',
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    venue: 'Engineering Workshop',
    participationType: 'team',
    minTeamSize: 3,
    maxTeamSize: 5,
    entryFee: 800,
    maxRegistrations: 25,
    currentRegistrations: 0,
    registrationDeadline: '2026-03-31T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Robot size: max 30x30x30 cm', 'Autonomous operation only', 'No remote control'],
    eligibility: 'Engineering students only',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Dr. Amit Patel',
    coordinatorPhone: '9876543212',
    coordinatorEmail: 'amit@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop',
    tags: ['Robotics', 'Engineering', 'Automation', 'Competition'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '4',
    title: 'Photography Contest',
    slug: 'photography-contest',
    shortDescription: 'Capture the essence of technology and culture through your lens.',
    fullDescription: 'A creative photography competition with multiple categories including portrait, landscape, street, and tech photography.',
    category: 'cultural',
    department: 'Fine Arts',
    day: 1,
    date: '2026-04-01',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    venue: 'Campus Wide',
    participationType: 'solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    entryFee: 100,
    maxRegistrations: 100,
    currentRegistrations: 0,
    registrationDeadline: '2026-03-30T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Original photos only', 'Max 5 submissions per person', 'Digital format required'],
    eligibility: 'Open to all',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Ms. Priya Singh',
    coordinatorPhone: '9876543213',
    coordinatorEmail: 'priya@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=600&fit=crop',
    tags: ['Photography', 'Art', 'Creative', 'Visual'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '5',
    title: 'Startup Pitch Competition',
    slug: 'startup-pitch-competition',
    shortDescription: 'Present your innovative startup ideas to industry experts and investors.',
    fullDescription: 'An entrepreneurship competition where students pitch their startup ideas to a panel of successful entrepreneurs and investors.',
    category: 'technical',
    department: 'Business Administration',
    day: 2,
    date: '2026-04-02',
    startTime: '11:00 AM',
    endTime: '3:00 PM',
    venue: 'Business Incubator',
    participationType: 'team',
    minTeamSize: 2,
    maxTeamSize: 6,
    entryFee: 300,
    maxRegistrations: 20,
    currentRegistrations: 0,
    registrationDeadline: '2026-03-31T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: ['10-minute pitch + 5-minute Q&A', 'Business plan required', 'Prototype preferred'],
    eligibility: 'All students with business ideas',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Mr. Vikash Gupta',
    coordinatorPhone: '9876543214',
    coordinatorEmail: 'vikash@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop',
    tags: ['Startup', 'Entrepreneurship', 'Business', 'Innovation'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  },
  {
    _id: '6',
    title: 'Gaming Tournament',
    slug: 'gaming-tournament',
    shortDescription: 'Compete in popular esports titles and showcase your gaming skills.',
    fullDescription: 'Multi-game esports tournament featuring popular titles like PUBG Mobile, Free Fire, and FIFA. Solo and team competitions available.',
    category: 'technical',
    department: 'Computer Science',
    day: 3,
    date: '2026-04-03',
    startTime: '1:00 PM',
    endTime: '8:00 PM',
    venue: 'Gaming Arena',
    participationType: 'team',
    minTeamSize: 1,
    maxTeamSize: 4,
    entryFee: 150,
    maxRegistrations: 80,
    currentRegistrations: 0,
    registrationDeadline: '2026-04-01T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: ['Own devices required', 'Fair play policy', 'Multiple game categories'],
    eligibility: 'All students',
    prizeDetails: '1st: ₹5,000, 2nd: ₹3,000, 3rd: ₹2,000',
    coordinatorName: 'Mr. Rohit Sharma',
    coordinatorPhone: '9876543215',
    coordinatorEmail: 'rohit@aavhaan.com',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    posterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    tags: ['Gaming', 'Esports', 'Competition', 'Technology'],
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-20T15:30:00.000Z'
  }
];

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    // Load existing events from localStorage
    const saved = localStorage.getItem('aavhaan-events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('aavhaan-events', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      _id: Date.now().toString(),
      slug: eventData.title.toLowerCase().replace(/\s+/g, '-'),
      currentRegistrations: 0,
      status: 'published',
      featured: false,
      registrationDeadline: new Date(eventData.date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      posterImage: eventData.bannerImage
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => 
      prev.map(event => 
        event._id === id 
          ? { 
              ...event, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              slug: updates.title ? updates.title.toLowerCase().replace(/\s+/g, '-') : event.slug,
              posterImage: updates.bannerImage || event.posterImage
            } 
          : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event._id !== id));
  };

  const getEventById = (id) => {
    return events.find(event => event._id === id);
  };

  const getEventBySlug = (slug) => {
    return events.find(event => event.slug === slug);
  };

  const getEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  const getEventsByDay = (day) => {
    return events.filter(event => event.day === day);
  };

  const getFeaturedEvents = () => {
    return events.filter(event => event.featured);
  };

  const getEventStats = () => {
    const total = events.length;
    const technical = events.filter(e => e.category === 'technical').length;
    const cultural = events.filter(e => e.category === 'cultural').length;
    const featured = events.filter(e => e.featured).length;
    const totalPrizePool = events.length * 10000; // ₹10K per event

    return {
      total,
      technical,
      cultural,
      featured,
      totalPrizePool
    };
  };

  const value = useMemo(() => ({
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventBySlug,
    getEventsByCategory,
    getEventsByDay,
    getFeaturedEvents,
    getEventStats
  }), [events]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;