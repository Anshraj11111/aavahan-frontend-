import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { eventsService } from '../services/events';
import { adminService } from '../services/admin';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Cache duration: 2 minutes
  const CACHE_DURATION = 2 * 60 * 1000;

  // Fetch events from backend MongoDB on mount
  const fetchEvents = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache - if data is fresh and not forcing refresh, skip fetch
      const now = Date.now();
      if (!forceRefresh && events.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
        console.log('✓ Using cached events data');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Don't fetch admin events if on login page
      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath.includes('/admin/login');
      
      // Check if user is admin - use admin API to get ALL events (including drafts)
      const isAdmin = (localStorage.getItem('adminToken') || localStorage.getItem('AUTH_TOKEN')) && !isOnLoginPage;
      
      console.log('🔍 EventsContext: Fetching events...');
      console.log('   Is Admin:', isAdmin);
      console.log('   Current Path:', currentPath);
      
      let response;
      if (isAdmin) {
        // Admin: fetch ALL events (including drafts) from admin API with limit=100
        console.log('   Calling: adminService.getAllEvents({ limit: 100 })');
        response = await adminService.getAllEvents({ limit: 100 });
        console.log('✓ Admin: Backend events response:', response);
      } else {
        // Public: fetch only published events
        console.log('   Calling: eventsService.getEvents()');
        response = await eventsService.getEvents();
        console.log('✓ Public: Backend events response:', response);
      }
      
      if (response && response.success) {
        const eventsData = response.data || [];
        console.log('✓ Events loaded from MongoDB:', eventsData.length);
        console.log('   Events:', eventsData);
        setEvents(eventsData);
        setLastFetchTime(Date.now());
      } else {
        console.error('❌ Backend returned success=false or invalid response');
        console.error('   Response:', response);
        setError('Failed to load events');
        setEvents([]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch events from backend:', err);
      console.error('   Error type:', err.constructor.name);
      console.error('   Error message:', err.message);
      console.error('   Error details:', err);
      
      // Check if it's a network error
      if (err.message && err.message.includes('Network Error')) {
        setError('Backend server is not running. Please start the backend server.');
        console.error('💡 Solution: Run "cd backend && npm start" in terminal');
      } else if (err.code === 'UNAUTHORIZED') {
        setError('Authentication failed. Please login again.');
        console.error('💡 Solution: Logout and login again');
      } else {
        setError(err.message || 'Failed to load events');
      }
      
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [events.length, lastFetchTime, CACHE_DURATION]); // Added dependencies

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Now safe to include fetchEvents since it's memoized

  const addEvent = useCallback(async (eventData) => {
    try {
      // Call backend API to create event in MongoDB
      const response = await adminService.createEvent(eventData);
      if (response.success && response.data) {
        // Add to local state
        setEvents(prev => [...prev, response.data]);
        console.log('Event created in MongoDB:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    try {
      console.log('🔄 EventsContext: Updating event...');
      console.log('   Event ID:', id);
      console.log('   Updates:', updates);
      console.log('   posterImage length:', updates.posterImage?.length || 0);
      console.log('   posterImage preview:', updates.posterImage?.substring(0, 100) + '...');
      
      // Call backend API to update event in MongoDB
      const response = await adminService.updateEvent(id, updates);
      
      console.log('📥 Backend response:', response);
      console.log('   Response success:', response.success);
      console.log('   Response data:', response.data);
      
      if (response.success && response.data) {
        // Update local state
        setEvents(prev => 
          prev.map(event => 
            event._id === id ? response.data : event
          )
        );
        console.log('✅ Event updated in MongoDB:', response.data);
        console.log('   Updated posterImage length:', response.data.posterImage?.length || 0);
        console.log('   Updated posterImage preview:', response.data.posterImage?.substring(0, 100) + '...');
        return response.data; // Return the updated event
      } else {
        console.error('❌ Backend returned success=false');
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('❌ Failed to update event:', error);
      console.error('   Error response:', error.response?.data);
      throw error;
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      // Call backend API to delete event from MongoDB
      await adminService.deleteEvent(id);
      // Remove from local state
      setEvents(prev => prev.filter(event => event._id !== id));
      console.log('Event deleted from MongoDB:', id);
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }, []);

  const getEventById = useCallback((id) => {
    return events.find(event => event._id === id);
  }, [events]);

  const getEventBySlug = useCallback((slug) => {
    return events.find(event => event.slug === slug);
  }, [events]);

  const getEventsByCategory = useCallback((category) => {
    return events.filter(event => event.category === category);
  }, [events]);

  const getEventsByDay = useCallback((day) => {
    return events.filter(event => event.day === day);
  }, [events]);

  const getFeaturedEvents = useCallback(() => {
    return events.filter(event => event.featured);
  }, [events]);

  const getEventStats = useCallback(() => {
    const total = events.length;
    const technical = events.filter(e => e.category === 'technical').length;
    const cultural = events.filter(e => e.category === 'cultural').length;
    const featured = events.filter(e => e.featured).length;
    const totalPrizePool = events.length * 10000;

    return {
      total,
      technical,
      cultural,
      featured,
      totalPrizePool
    };
  }, [events]);

  const value = useMemo(() => ({
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: () => fetchEvents(true), // Force refresh
    getEventById,
    getEventBySlug,
    getEventsByCategory,
    getEventsByDay,
    getFeaturedEvents,
    getEventStats
  }), [events, loading, error, addEvent, updateEvent, deleteEvent, fetchEvents, getEventById, getEventBySlug, getEventsByCategory, getEventsByDay, getFeaturedEvents, getEventStats]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
