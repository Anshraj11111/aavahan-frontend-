import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Clock,
  DollarSign
} from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { useRegistrations } from '../../contexts/RegistrationContext';
import toast from 'react-hot-toast';

const EventManagement = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { getRegistrationsByEvent } = useRegistrations();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'technical',
    department: '',
    day: 1,
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    participationType: 'solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    entryFee: 0,
    maxRegistrations: 50,
    prizeDetails: '',
    coordinatorName: '',
    coordinatorPhone: '',
    coordinatorEmail: '',
    bannerImage: '',
    eligibility: '',
    rules: [''],
    tags: ['']
  });

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      ...event,
      rules: event.rules || [''],
      tags: event.tags || ['']
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: 'technical',
      department: '',
      day: 1,
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      participationType: 'solo',
      minTeamSize: 1,
      maxTeamSize: 1,
      entryFee: 0,
      maxRegistrations: 50,
      prizeDetails: '',
      coordinatorName: '',
      coordinatorPhone: '',
      coordinatorEmail: '',
      bannerImage: '',
      eligibility: '',
      rules: [''],
      tags: ['']
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const eventData = {
      ...formData,
      rules: formData.rules.filter(rule => rule.trim() !== ''),
      tags: formData.tags.filter(tag => tag.trim() !== '')
    };

    if (editingEvent) {
      updateEvent(editingEvent._id, eventData);
      toast.success('Event updated successfully!');
    } else {
      addEvent(eventData);
      toast.success('Event created successfully!');
    }

    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully!');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Management</h2>
          <p className="text-gray-400">Create, edit, and manage festival events</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => {
          // Get real registration count for this event
          const eventRegistrations = getRegistrationsByEvent(event.title);
          const realRegistrationCount = eventRegistrations.length;
          
          return (
            <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{event.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.category === 'technical' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {event.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                    Day {event.day}
                  </span>
                  {event.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={14} />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={14} />
                <span>{realRegistrationCount}/{event.maxRegistrations}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign size={14} />
                <span>₹{event.entryFee}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy size={14} />
                <span>Prizes Available</span>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Basic Information</h4>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Event Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Short Description</label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description for cards"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Full Description</label>
                    <textarea
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed event description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="technical">Technical</option>
                        <option value="cultural">Cultural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Organizing department"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Event Details</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Day</label>
                      <select
                        value={formData.day}
                        onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>Day 1</option>
                        <option value={2}>Day 2</option>
                        <option value={3}>Day 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Venue</label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Event venue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Start Time</label>
                      <input
                        type="text"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 9:00 AM"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">End Time</label>
                      <input
                        type="text"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 6:00 PM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Participation</label>
                      <select
                        value={formData.participationType}
                        onChange={(e) => handleInputChange('participationType', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="solo">Solo</option>
                        <option value="team">Team</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Min Team Size</label>
                      <input
                        type="number"
                        value={formData.minTeamSize}
                        onChange={(e) => handleInputChange('minTeamSize', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Max Team Size</label>
                      <input
                        type="number"
                        value={formData.maxTeamSize}
                        onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Entry Fee (₹)</label>
                      <input
                        type="number"
                        value={formData.entryFee}
                        onChange={(e) => handleInputChange('entryFee', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Max Registrations</label>
                      <input
                        type="number"
                        value={formData.maxRegistrations}
                        onChange={(e) => handleInputChange('maxRegistrations', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Prize Details</label>
                  <input
                    type="text"
                    value={formData.prizeDetails}
                    onChange={(e) => handleInputChange('prizeDetails', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1st: ₹50,000, 2nd: ₹30,000, 3rd: ₹15,000"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Banner Image URL</label>
                  <input
                    type="url"
                    value={formData.bannerImage}
                    onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Coordinator Name</label>
                    <input
                      type="text"
                      value={formData.coordinatorName}
                      onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Coordinator name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Coordinator Phone</label>
                    <input
                      type="tel"
                      value={formData.coordinatorPhone}
                      onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Coordinator Email</label>
                    <input
                      type="email"
                      value={formData.coordinatorEmail}
                      onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;