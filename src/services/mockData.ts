// Mock data for when backend is not available
export const mockEvents = [
  {
    _id: '69bc4ddbbd29a5a9f49b151a',
    title: 'Coding Competition',
    slug: 'coding-competition',
    shortDescription: 'Test your programming skills in this exciting coding challenge.',
    fullDescription: 'Join us for an intensive coding competition where you can showcase your programming abilities and compete with the best developers.',
    category: 'technical',
    day: 1,
    date: '2026-04-01',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    venue: 'Computer Lab A',
    participationType: 'solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    entryFee: 0,
    maxRegistrations: 100,
    currentRegistrations: 45,
    registrationDeadline: '2026-03-30T23:59:59.000Z',
    status: 'published',
    featured: true,
    rules: [
      'Participants must bring their own laptops',
      'No external help allowed',
      'Time limit: 4 hours'
    ],
    eligibility: 'Open to all students',
    prizeDetails: '1st Prize: ₹10,000, 2nd Prize: ₹5,000, 3rd Prize: ₹2,500',
    coordinatorName: 'John Doe',
    coordinatorPhone: '9876543210',
    coordinatorEmail: 'john@example.com',
    bannerImage: '/images/coding-competition.jpg',
    posterImage: '/images/coding-poster.jpg'
  },
  {
    _id: '69bc4ddbbd29a5a9f49b152b',
    title: 'Web Development Workshop',
    slug: 'web-development-workshop',
    shortDescription: 'Learn modern web development techniques and frameworks.',
    fullDescription: 'A comprehensive workshop covering HTML5, CSS3, JavaScript, and popular frameworks like React and Vue.js.',
    category: 'technical',
    day: 2,
    date: '2026-04-02',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    venue: 'Seminar Hall',
    participationType: 'solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    entryFee: 500,
    maxRegistrations: 50,
    currentRegistrations: 30,
    registrationDeadline: '2026-03-31T23:59:59.000Z',
    status: 'published',
    featured: false,
    rules: [
      'Bring your own laptop',
      'Basic programming knowledge required'
    ],
    eligibility: 'Students with basic programming knowledge',
    prizeDetails: 'Certificate of completion',
    coordinatorName: 'Jane Smith',
    coordinatorPhone: '9876543211',
    coordinatorEmail: 'jane@example.com',
    bannerImage: '/images/web-workshop.jpg',
    posterImage: '/images/web-poster.jpg'
  }
];

export const mockStats = {
  totalEvents: 50,
  totalRegistrations: 2500,
  totalParticipants: 10000
};

export const getMockEventById = (id: string) => {
  return mockEvents.find(event => event._id === id) || null;
};

export const getMockEventBySlug = (slug: string) => {
  return mockEvents.find(event => event.slug === slug) || null;
};