import { createContext, useContext, useState, useEffect } from 'react';

// Initial registration data that matches what's in RegistrationsList
const initialRegistrations = [];

const RegistrationContext = createContext();

export const useRegistrations = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistrations must be used within a RegistrationProvider');
  }
  return context;
};

export const RegistrationProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState(() => {
    // Load existing registrations from localStorage
    const saved = localStorage.getItem('techfest-registrations');
    return saved ? JSON.parse(saved) : initialRegistrations;
  });

  // Save to localStorage whenever registrations change
  useEffect(() => {
    localStorage.setItem('techfest-registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addRegistration = (registrationData) => {
    const newRegistration = {
      ...registrationData,
      _id: Date.now().toString(),
      uniqueRegistrationId: `TF2026-${String(registrations.length + 1).padStart(3, '0')}`,
      paymentStatus: 'pending_verification',
      registrationStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    setRegistrations(prev => [newRegistration, ...prev]);
    return newRegistration;
  };

  const updateRegistration = (id, updates) => {
    setRegistrations(prev => 
      prev.map(reg => reg._id === id ? { ...reg, ...updates } : reg)
    );
  };

  const deleteRegistration = (id) => {
    setRegistrations(prev => prev.filter(reg => reg._id !== id));
  };

  const getRegistrationsByEvent = (eventTitle) => {
    return registrations.filter(reg => reg.eventTitle === eventTitle);
  };

  const getRegistrationStats = () => {
    const total = registrations.length;
    const approved = registrations.filter(r => r.registrationStatus === 'approved').length;
    const pending = registrations.filter(r => r.registrationStatus === 'pending').length;
    const totalRevenue = registrations.reduce((sum, r) => sum + r.amountPaid, 0);

    return {
      total,
      approved,
      pending,
      totalRevenue
    };
  };

  const addSampleData = () => {
    const sampleRegistrations = [
      {
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '9876543210',
        instituteName: 'IIT Delhi',
        department: 'Computer Science',
        yearOrSemester: '3rd Year',
        city: 'Delhi',
        eventTitle: 'AI & Machine Learning Hackathon',
        eventDay: 2,
        participationType: 'team',
        teamName: 'Code Warriors',
        teamMembers: [
          { name: 'Priya Patel', email: 'priya@gmail.com', phone: '9876543211' },
          { name: 'Amit Kumar', email: 'amit@gmail.com', phone: '9876543212' }
        ],
        amountExpected: 500,
        amountPaid: 500,
      },
      {
        fullName: 'Sneha Singh',
        email: 'sneha.singh@gmail.com',
        phone: '9876543213',
        instituteName: 'NIT Jabalpur',
        department: 'Electronics',
        yearOrSemester: '2nd Year',
        city: 'Jabalpur',
        eventTitle: 'Photography Contest',
        eventDay: 1,
        participationType: 'solo',
        amountExpected: 100,
        amountPaid: 100,
      }
    ];

    sampleRegistrations.forEach(data => addRegistration(data));
  };

  const value = {
    registrations,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    getRegistrationsByEvent,
    getRegistrationStats,
    addSampleData
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationContext;