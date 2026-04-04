import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Calendar, MapPin, Users, Trophy, Clock, DollarSign } from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { useRegistrations } from '../../contexts/RegistrationContext';
import toast from 'react-hot-toast';

const EventManagement = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { getRegistrationsByEvent } = useRegistrations();
  const [showModal, setShowModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', fullDescription: '', category: 'technical',
    department: '', day: 1, dates: [''], startTime: '', endTime: '', venue: '',
    participationType: 'solo', minTeamSize: 1, maxTeamSize: 1, entryFee: 0,
    maxRegistrations: '', prizeDetails: '', 
    coordinators: [{ name: '', phone: '', email: '' }],
    posterImage: '', eligibility: '', registrationDeadline: '',
    featured: false, rules: [''], tags: ['']
  });

  const handleEdit = (event) => {
    setEditingEvent(event);
    // Handle day - convert string to number, "Day 1 / Day 2" to 0
    let dayNumber = 1;
    if (event.day === 'Day 1 / Day 2' || event.day === 'Both Days') {
      dayNumber = 0;
    } else if (typeof event.day === 'string') {
      dayNumber = parseInt(event.day.replace('Day ', ''));
    } else {
      dayNumber = event.day;
    }
    
    // Handle coordinators - convert old format to new array format
    let coordinators = [{ name: '', phone: '', email: '' }];
    if (event.coordinators && Array.isArray(event.coordinators) && event.coordinators.length > 0) {
      coordinators = event.coordinators;
    } else if (event.coordinatorName || event.coordinatorPhone || event.coordinatorEmail) {
      // Convert old single coordinator format to array
      coordinators = [{
        name: event.coordinatorName || '',
        phone: event.coordinatorPhone || '',
        email: event.coordinatorEmail || ''
      }];
    }
    
    // Convert date from YYYY-MM-DD to DD/MM/YYYY for display
    let displayDates = [''];
    if (event.date) {
      // Handle both single date string and comma-separated dates
      const dateStrings = typeof event.date === 'string' ? event.date.split(',').map(d => d.trim()) : [event.date];
      displayDates = dateStrings.map(dateStr => {
        const dateObj = new Date(dateStr);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      });
    }
    
    // Convert registration deadline to DD/MM/YYYY format
    let displayDeadline = '';
    if (event.registrationDeadline) {
      const deadlineObj = new Date(event.registrationDeadline);
      const day = String(deadlineObj.getDate()).padStart(2, '0');
      const month = String(deadlineObj.getMonth() + 1).padStart(2, '0');
      const year = deadlineObj.getFullYear();
      displayDeadline = `${day}/${month}/${year}`;
    }
    
    setFormData({
      ...event, 
      day: dayNumber,
      dates: displayDates,
      posterImage: event.posterImage || event.bannerImage || '',
      registrationDeadline: displayDeadline,
      maxRegistrations: event.maxRegistrations || '',
      coordinators: coordinators,
      rules: event.rules || [''], 
      tags: event.tags || ['']
    });
    setShowModal(true);
    
    // Auto-scroll to top when modal opens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '', shortDescription: '', fullDescription: '', category: 'technical',
      department: '', day: 1, dates: [''], startTime: '', endTime: '', venue: '',
      participationType: 'solo', minTeamSize: 1, maxTeamSize: 1, entryFee: 0,
      maxRegistrations: '', prizeDetails: '', 
      coordinators: [{ name: '', phone: '', email: '' }],
      posterImage: '', eligibility: '', registrationDeadline: '',
      featured: false, rules: [''], tags: ['']
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Convert dates from DD/MM/YYYY to YYYY-MM-DD and join with comma
      let backendDate = '';
      if (formData.dates && formData.dates.length > 0) {
        const convertedDates = formData.dates
          .filter(d => d && d.trim())
          .map(dateStr => {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              return `${year}-${month}-${day}`;
            }
            return dateStr;
          });
        backendDate = convertedDates.join(', ');
      }

      // Handle registration deadline - convert DD/MM/YYYY to YYYY-MM-DD
      let deadline = '';
      if (formData.registrationDeadline && formData.registrationDeadline.trim()) {
        const parts = formData.registrationDeadline.split('/');
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          const [day, month, year] = parts;
          deadline = `${year}-${month}-${day}`;
        }
      }

      // Handle maxRegistrations - if empty or "no limit" text, set to null (unlimited)
      let maxRegs = null;
      if (formData.maxRegistrations) {
        const maxRegsStr = String(formData.maxRegistrations).toLowerCase().trim();
        if (maxRegsStr && maxRegsStr !== 'no limit' && maxRegsStr !== 'unlimited' && !isNaN(maxRegsStr)) {
          maxRegs = parseInt(maxRegsStr);
        }
      }

      const eventData = {
        title: formData.title || 'Untitled Event',
        shortDescription: formData.shortDescription || '',
        fullDescription: formData.fullDescription || '',
        category: formData.category || 'technical',
        department: formData.department || '',
        day: formData.day === 0 ? 'Day 1 / Day 2' : `Day ${formData.day}`,
        date: backendDate || '',
        startTime: formData.startTime || '09:00 AM',
        endTime: formData.endTime || '05:00 PM',
        venue: formData.venue || 'TBA',
        participationType: formData.participationType || 'solo',
        minTeamSize: formData.minTeamSize === '' ? 1 : parseInt(formData.minTeamSize) || 1,
        maxTeamSize: formData.maxTeamSize === '' ? 1 : parseInt(formData.maxTeamSize) || 1,
        entryFee: formData.entryFee === '' ? 0 : parseInt(formData.entryFee) || 0,
        maxRegistrations: maxRegs,
        prizeDetails: formData.prizeDetails || '',
        coordinators: formData.coordinators
          .filter(c => c.name || c.phone || c.email)
          .map(c => ({
            name: c.name || '',
            phone: c.phone || '',
            email: c.email || ''
          })),
        eligibility: formData.eligibility || '',
        registrationDeadline: deadline,
        featured: formData.featured || false,
        rules: formData.rules.filter(r => r && r.trim()),
        tags: formData.tags.filter(t => t && t.trim()),
        posterImage: formData.posterImage || '',
        bannerImage: formData.posterImage || '',
        status: 'published'
      };

      console.log('💾 Saving event with data:', eventData);
      console.log('   Max Registrations:', maxRegs);
      console.log('   Coordinators:', eventData.coordinators);

      if (editingEvent) {
        console.log('🔄 Updating existing event...');
        const updatedEvent = await updateEvent(editingEvent._id, eventData);
        console.log('✅ Event updated successfully:', updatedEvent);
        toast.success('Event updated successfully!');
      } else {
        console.log('➕ Creating new event...');
        const newEvent = await addEvent(eventData);
        console.log('✅ Event created successfully:', newEvent);
        toast.success('Event created successfully!');
      }

      setShowModal(false);
      setEditingEvent(null);
      
      console.log('🔄 Refreshing events from backend...');
      window.location.reload();
    } catch (error) {
      console.error('❌ Save error:', error);
      console.error('   Error details:', error.response?.data || error.message);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save event';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted!');
      } catch (error) {
        toast.error(error?.message || 'Failed to delete');
      }
    }
  };

  const handleViewEventDetails = (event) => {
    setSelectedEventForDetails(event);
    setShowEventDetailsModal(true);
  };

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (field, index, value) => setFormData(prev => ({
    ...prev, [field]: prev[field].map((item, i) => i === index ? value : item)
  }));
  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayItem = (field, index) => setFormData(prev => ({
    ...prev, [field]: prev[field].filter((_, i) => i !== index)
  }));

  // Coordinator management functions
  const handleCoordinatorChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinators: prev.coordinators.map((coord, i) => 
        i === index ? { ...coord, [field]: value } : coord
      )
    }));
  };

  const addCoordinator = () => {
    setFormData(prev => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: '', phone: '', email: '' }]
    }));
  };

  const removeCoordinator = (index) => {
    if (formData.coordinators.length > 1) {
      setFormData(prev => ({
        ...prev,
        coordinators: prev.coordinators.filter((_, i) => i !== index)
      }));
    }
  };

  // Date management functions
  const handleDateChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => i === index ? value : date)
    }));
  };

  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, '']
    }));
  };

  const removeDate = (index) => {
    if (formData.dates.length > 1) {
      setFormData(prev => ({
        ...prev,
        dates: prev.dates.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Management</h2>
          <p className="text-gray-400">Create, edit, and manage festival events</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 glass-panel rounded-xl border border-white/10">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
            <p className="text-gray-400 mb-4">Click "Add Event" to create your first event</p>
          </div>
        ) : (
          events.map((event) => {
            const regs = getRegistrationsByEvent(event.title);
            return (
              <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{event.shortDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.category === 'technical' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>{event.category}</span>
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">{event.day}</span>
                      {event.featured && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewEventDetails(event)} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg" title="View Details">
                      <Calendar size={16} />
                    </button>
                    <button onClick={() => handleEdit(event)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400"><Calendar size={14} /><span>{event.date}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><Clock size={14} /><span>{event.startTime} - {event.endTime}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><MapPin size={14} /><span>{event.venue}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><Users size={14} /><span>{regs.length}/{event.maxRegistrations}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><DollarSign size={14} /><span>₹{event.entryFee}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><Trophy size={14} /><span>Prizes</span></div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 z-50 flex flex-col h-screen w-screen"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-2 border-blue-500/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex-shrink-0 shadow-lg">
              <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-gray-900">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-[1600px] mx-auto">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-blue-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                        Basic Information
                      </h4>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Event Title</label>
                        <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter event title" />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Short Description</label>
                        <textarea value={formData.shortDescription} onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                          rows={2} className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description" />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Full Description</label>
                        <textarea value={formData.fullDescription} onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                          rows={3} className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed description" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Category</label>
                          <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                            <option value="technical">Technical</option>
                            <option value="cultural">Cultural</option>
                            <option value="games">Games</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Department</label>
                          <input type="text" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Department" />
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-purple-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                        Event Schedule
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Day</label>
                          <select value={formData.day} onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                            <option value={1}>Day 1</option>
                            <option value={2}>Day 2</option>
                            <option value={0}>Day 1 / Day 2</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-white text-sm font-medium">Date (DD/MM/YYYY)</label>
                            <button
                              type="button"
                              onClick={addDate}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                            >
                              <Plus size={14} />
                              Add Date
                            </button>
                          </div>
                          <div className="space-y-2">
                            {formData.dates.map((date, index) => (
                              <div key={index} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={date} 
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/[^0-9/]/g, '');
                                    // Auto-add slashes
                                    if (value.length === 2 && !value.includes('/')) {
                                      value = value + '/';
                                    } else if (value.length === 5 && value.split('/').length === 2) {
                                      value = value + '/';
                                    }
                                    // Limit to DD/MM/YYYY format
                                    if (value.length <= 10) {
                                      handleDateChange(index, value);
                                    }
                                  }}
                                  placeholder="DD/MM/YYYY"
                                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" 
                                />
                                {formData.dates.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeDate(index)}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Start Time</label>
                          <input type="text" value={formData.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="9:00 AM" />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">End Time</label>
                          <input type="text" value={formData.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="6:00 PM" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Venue</label>
                        <input type="text" value={formData.venue} onChange={(e) => handleInputChange('venue', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Event venue" />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Registration Deadline (Optional)</label>
                        <input 
                          type="text" 
                          value={formData.registrationDeadline} 
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9/]/g, '');
                            if (value.length === 2 && !value.includes('/')) value += '/';
                            if (value.length === 5 && value.split('/').length === 2) value += '/';
                            if (value.length <= 10) handleInputChange('registrationDeadline', value);
                          }}
                          className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="DD/MM/YYYY" />
                        <p className="text-gray-500 text-xs mt-1">Leave empty to allow registrations until event date</p>
                      </div>
                    </div>

                    {/* Participation */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-green-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                        Participation
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Type</label>
                          <select value={formData.participationType} onChange={(e) => handleInputChange('participationType', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                            <option value="solo">Solo</option>
                            <option value="team">Team</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Min Size</label>
                          <input 
                            type="text" 
                            value={formData.minTeamSize} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              handleInputChange('minTeamSize', value === '' ? '' : parseInt(value));
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" 
                            placeholder="1" />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Max Size</label>
                          <input 
                            type="text" 
                            value={formData.maxTeamSize} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              handleInputChange('maxTeamSize', value === '' ? '' : parseInt(value));
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" 
                            placeholder="1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Entry Fee (₹)</label>
                          <input 
                            type="text" 
                            value={formData.entryFee} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              handleInputChange('entryFee', value === '' ? '' : parseInt(value));
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" 
                            placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1.5">Max Registrations</label>
                          <input type="text" value={formData.maxRegistrations} onChange={(e) => handleInputChange('maxRegistrations', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter number or 'No Limit'" />
                          <p className="text-gray-500 text-xs mt-1">Leave empty or type "No Limit" for unlimited registrations</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Eligibility</label>
                        <input type="text" value={formData.eligibility} onChange={(e) => handleInputChange('eligibility', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Open to all students" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Prize & Coordinators */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-yellow-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-yellow-500 rounded-full"></div>
                        Prize & Coordinators
                      </h4>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Prize Details</label>
                        <input type="text" value={formData.prizeDetails} onChange={(e) => handleInputChange('prizeDetails', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="1st: ₹50,000, 2nd: ₹30,000" />
                      </div>
                      
                      {/* Multiple Coordinators */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-white text-sm font-medium">Event Coordinators</label>
                          <button
                            type="button"
                            onClick={addCoordinator}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Coordinator
                          </button>
                        </div>
                        
                        {formData.coordinators.map((coordinator, index) => (
                          <div key={index} className="bg-gray-700/30 p-3 rounded-lg space-y-2 relative">
                            {formData.coordinators.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCoordinator(index)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                                title="Remove Coordinator"
                              >
                                <X size={16} />
                              </button>
                            )}
                            <div className="text-white text-xs font-medium mb-2">Coordinator {index + 1}</div>
                            <input
                              type="text"
                              value={coordinator.name}
                              onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Name"
                            />
                            <input
                              type="tel"
                              value={coordinator.phone}
                              onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Phone"
                            />
                            <input
                              type="email"
                              value={coordinator.email}
                              onChange={(e) => handleCoordinatorChange(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Email"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Media & Settings */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-cyan-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-cyan-500 rounded-full"></div>
                        Media & Settings
                      </h4>
                      <div>
                        <label className="block text-white text-sm font-medium mb-1.5">Event Poster Image</label>
                        <div className="space-y-3">
                          {/* File Upload Button */}
                          <div>
                            <input 
                              type="file" 
                              id="posterImageUpload"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  console.log('📁 File selected:', file.name, file.size, 'bytes');
                                  
                                  // Check file size (max 5MB)
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error('Image too large! Please select an image under 5MB.');
                                    return;
                                  }
                                  
                                  try {
                                    // Show loading toast
                                    const loadingToast = toast.loading('Uploading image...');
                                    
                                    // Create FormData for file upload
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    
                                    // Upload to Cloudinary via backend
                                    const response = await fetch(`http://localhost:5000/api/v1/admin/events/${editingEvent._id}/image?type=poster`, {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('AUTH_TOKEN')}`
                                      },
                                      body: formData
                                    });
                                    
                                    const data = await response.json();
                                    
                                    toast.dismiss(loadingToast);
                                    
                                    console.log('📦 Upload response:', data);
                                    console.log('   Success:', data.success);
                                    console.log('   Data:', data.data);
                                    console.log('   Message:', data.message);
                                    
                                    if (data.success && data.data?.event?.posterImage) {
                                      const imageUrl = data.data.event.posterImage;
                                      console.log('✅ Image uploaded to Cloudinary:', imageUrl);
                                      handleInputChange('posterImage', imageUrl);
                                      toast.success('Image uploaded successfully!');
                                    } else {
                                      console.error('❌ Upload failed:', data);
                                      const errorMsg = data.message || data.error || 'Failed to upload image';
                                      toast.error(errorMsg);
                                    }
                                  } catch (error) {
                                    console.error('❌ Upload error:', error);
                                    toast.error('Failed to upload image. Please try again.');
                                  }
                                }
                              }}
                              className="hidden"
                            />
                            <label 
                              htmlFor="posterImageUpload"
                              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg cursor-pointer transition-all duration-300"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload Poster Image
                            </label>
                            <p className="text-gray-400 text-xs mt-1">Click to select an image file (JPG, PNG, etc.) - Max 5MB</p>
                          </div>
                          
                          {/* Preview */}
                          {formData.posterImage && formData.posterImage.trim() && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-400 mb-2">Preview:</p>
                              <div className="relative">
                                <img 
                                  src={formData.posterImage} 
                                  alt="Poster Preview" 
                                  className="w-full h-64 object-contain rounded-lg border border-gray-600 bg-gray-900" 
                                  onError={(e) => { 
                                    e.target.style.display = 'none';
                                    console.error('❌ Failed to load image:', formData.posterImage);
                                  }} 
                                  onLoad={() => console.log('✅ Image loaded successfully:', formData.posterImage)}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('posterImage', '');
                                    document.getElementById('posterImageUpload').value = '';
                                  }}
                                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium cursor-pointer">
                          <input type="checkbox" checked={formData.featured || false} onChange={(e) => handleInputChange('featured', e.target.checked)}
                            className="w-4 h-4 rounded" />
                          <span>Featured Event</span>
                        </label>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-pink-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
                        Tags
                      </h4>
                      <div className="space-y-2">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={tag} onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                              className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Tag" />
                            {formData.tags.length > 1 && (
                              <button onClick={() => removeArrayItem('tags', index)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('tags')} className="text-blue-400 hover:text-blue-300 text-sm">+ Add Tag</button>
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-orange-500/20 shadow-xl space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                        Rules
                      </h4>
                      <div className="space-y-2">
                        {formData.rules.map((rule, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={rule} onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                              className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Rule" />
                            {formData.rules.length > 1 && (
                              <button onClick={() => removeArrayItem('rules', index)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('rules')} className="text-blue-400 hover:text-blue-300 text-sm">+ Add Rule</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t-2 border-blue-500/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex-shrink-0 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-[1600px] mx-auto">
                <button 
                  onClick={handleSave} 
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 border border-blue-500/30"
                >
                  <Save size={20} /> {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg border border-gray-500/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetailsModal && selectedEventForDetails && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEventDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-2 border-blue-500/30 px-6 py-5 flex justify-between items-center sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-white">{selectedEventForDetails.title}</h3>
                <button 
                  onClick={() => setShowEventDetailsModal(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white font-semibold capitalize">{selectedEventForDetails.category}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Day</p>
                    <p className="text-white font-semibold">{selectedEventForDetails.day}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Date & Time</p>
                    <p className="text-white font-semibold">{selectedEventForDetails.date}</p>
                    <p className="text-gray-400 text-sm">{selectedEventForDetails.startTime} - {selectedEventForDetails.endTime}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Venue</p>
                    <p className="text-white font-semibold">{selectedEventForDetails.venue}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Participation Type</p>
                    <p className="text-white font-semibold capitalize">{selectedEventForDetails.participationType}</p>
                    {selectedEventForDetails.participationType === 'team' && (
                      <p className="text-gray-400 text-sm">Team Size: {selectedEventForDetails.minTeamSize}-{selectedEventForDetails.maxTeamSize}</p>
                    )}
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
                    <p className="text-white font-semibold">₹{selectedEventForDetails.entryFee}</p>
                  </div>
                </div>

                {/* Registrations */}
                <div className="bg-gray-800/50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Registrations
                  </h4>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">{getRegistrationsByEvent(selectedEventForDetails.title).length}</p>
                      <p className="text-gray-400 text-sm">Current</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-400">{selectedEventForDetails.maxRegistrations}</p>
                      <p className="text-gray-400 text-sm">Maximum</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-400">
                        {selectedEventForDetails.maxRegistrations - getRegistrationsByEvent(selectedEventForDetails.title).length}
                      </p>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  
                  {/* Registration List */}
                  {getRegistrationsByEvent(selectedEventForDetails.title).length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {getRegistrationsByEvent(selectedEventForDetails.title).map((reg, index) => (
                        <div key={index} className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{reg.fullName}</p>
                            <p className="text-gray-400 text-sm">{reg.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reg.registrationStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                            reg.registrationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {reg.registrationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No registrations yet</p>
                  )}
                </div>

                {/* Coordinator Info */}
                {selectedEventForDetails.coordinatorName && (
                  <div className="bg-gray-800/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Coordinator</h4>
                    <div className="space-y-2">
                      <p className="text-white">{selectedEventForDetails.coordinatorName}</p>
                      {selectedEventForDetails.coordinatorPhone && (
                        <p className="text-gray-400 text-sm">📞 {selectedEventForDetails.coordinatorPhone}</p>
                      )}
                      {selectedEventForDetails.coordinatorEmail && (
                        <p className="text-gray-400 text-sm">✉️ {selectedEventForDetails.coordinatorEmail}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Prize Details */}
                {selectedEventForDetails.prizeDetails && (
                  <div className="bg-gray-800/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Prize Details
                    </h4>
                    <p className="text-gray-300">{selectedEventForDetails.prizeDetails}</p>
                  </div>
                )}

                {/* Rules */}
                {selectedEventForDetails.rules && selectedEventForDetails.rules.length > 0 && (
                  <div className="bg-gray-800/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Rules</h4>
                    <ul className="space-y-2">
                      {selectedEventForDetails.rules.filter(r => r).map((rule, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {selectedEventForDetails.tags && selectedEventForDetails.tags.length > 0 && (
                  <div className="bg-gray-800/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEventForDetails.tags.filter(t => t).map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;
