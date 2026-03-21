import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { registrationsService } from '../services/registrations';

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
    const saved = localStorage.getItem('aavhaan-registrations');
    return saved ? JSON.parse(saved) : initialRegistrations;
  });

  // Save to localStorage whenever registrations change
  useEffect(() => {
    localStorage.setItem('aavhaan-registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addRegistration = useCallback(async (registrationData) => {
    try {
      // Prepare FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Add all registration fields
      Object.keys(registrationData).forEach(key => {
        if (key === 'teamMembers' && registrationData[key]) {
          // Stringify team members array
          formData.append(key, JSON.stringify(registrationData[key]));
        } else if (key === 'screenshot' && registrationData[key]) {
          // Add screenshot file if present
          formData.append(key, registrationData[key]);
        } else if (registrationData[key] !== undefined && registrationData[key] !== null) {
          formData.append(key, registrationData[key]);
        }
      });

      // Submit to backend API
      const response = await registrationsService.submitRegistration(formData);

      // Backend returns the created registration
      const newRegistration = response.data;

      // Also save to localStorage as cache/fallback
      setRegistrations(prev => [newRegistration, ...prev]);
      
      return newRegistration;
    } catch (error) {
      console.error('Failed to submit registration to backend:', error);
      
      // Fallback to localStorage only if backend fails
      const paymentStatus = registrationData.transactionId && registrationData.transactionId.trim() 
        ? 'paid' 
        : 'pending_verification';
      
      const registrationStatus = paymentStatus === 'paid' ? 'approved' : 'pending';

      const newRegistration = {
        ...registrationData,
        _id: Date.now().toString(),
        uniqueRegistrationId: `TF2026-${String(registrations.length + 1).padStart(3, '0')}`,
        paymentStatus,
        registrationStatus,
        createdAt: new Date().toISOString(),
        verifiedAt: paymentStatus === 'paid' ? new Date().toISOString() : null
      };

      setRegistrations(prev => [newRegistration, ...prev]);
      
      // Re-throw error so UI can handle it
      throw error;
    }
  }, [registrations]);

  const updateRegistration = useCallback((id, updates) => {
    setRegistrations(prev => 
      prev.map(reg => reg._id === id ? { ...reg, ...updates } : reg)
    );
  }, []);

  const deleteRegistration = useCallback((id) => {
    setRegistrations(prev => prev.filter(reg => reg._id !== id));
  }, []);

  const getRegistrationsByEvent = useCallback((eventTitle) => {
    return registrations.filter(reg => reg.eventTitle === eventTitle);
  }, [registrations]);

  const getRegistrationStats = useCallback(() => {
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
  }, [registrations]);

  const addSampleData = useCallback(() => {
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
  }, [addRegistration]);

  const value = useMemo(() => ({
    registrations,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    getRegistrationsByEvent,
    getRegistrationStats,
    addSampleData
  }), [registrations, addRegistration, updateRegistration, deleteRegistration, getRegistrationsByEvent, getRegistrationStats, addSampleData]);

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationContext;