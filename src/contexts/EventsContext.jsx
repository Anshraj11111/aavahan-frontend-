import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

  // Fetch events from backend MongoDB on mount
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is admin - use admin API to get ALL events (including drafts)
      const isAdmin = localStorage.getItem('adminToken') || localStorage.getItem('AUTH_TOKEN');
      
      let response;
      if (isAdmin) {
        // Admin: fetch ALL events (including drafts) from admin API
        response = await adminService.getAllEvents();
        console.log('Admin: Backend events response:', response);
      } else {
        // Public: fetch only published events
        response = await eventsService.getEvents();
        console.log('Public: Backend events response:', response);
      }
      
      if (response.success) {
        const eventsData = response.data || [];
        setEvents(eventsData);
        console.log('Events loaded from MongoDB:', eventsData.length);
      } else {
        console.error('Backend returned success=false');
        setError('Failed to load events');
      }
    } catch (err) {
      console.error('Failed to fetch events from backend:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  const addEvent = async (eventData) => {
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
  };

  const updateEvent = async (id, updates) => {
    try {
      // Call backend API to update event in MongoDB
      const response = await adminService.updateEvent(id, updates);
      if (response.success && response.data) {
        // Update local state
        setEvents(prev => 
          prev.map(event => 
            event._id === id ? response.data : event
          )
        );
        console.log('Event updated in MongoDB:', response.data);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id) => {
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
    const totalPrizePool = events.length * 10000;

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
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
    getEventById,
    getEventBySlug,
    getEventsByCategory,
    getEventsByDay,
    getFeaturedEvents,
    getEventStats
  }), [events, loading, error]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;
