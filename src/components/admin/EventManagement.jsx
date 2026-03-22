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
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', fullDescription: '', category: 'technical',
    department: '', day: 1, date: '', startTime: '', endTime: '', venue: '',
    participationType: 'solo', minTeamSize: 1, maxTeamSize: 1, entryFee: 0,
    maxRegistrations: 50, prizeDetails: '', coordinatorName: '', coordinatorPhone: '',
    coordinatorEmail: '', bannerImage: '', eligibility: '', registrationDeadline: '',
    featured: false, rules: [''], tags: ['']
  });

  const handleEdit = (event) => {
    setEditingEvent(event);
    const dayNumber = typeof event.day === 'string' ? parseInt(event.day.replace('Day ', '')) : event.day;
    setFormData({
      ...event, day: dayNumber,
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
      rules: event.rules || [''], tags: event.tags || ['']
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '', shortDescription: '', fullDescription: '', category: 'technical',
      department: '', day: 1, date: '', startTime: '', endTime: '', venue: '',
      participationType: 'solo', minTeamSize: 1, maxTeamSize: 1, entryFee: 0,
      maxRegistrations: 50, prizeDetails: '', coordinatorName: '', coordinatorPhone: '',
      coordinatorEmail: '', bannerImage: '', eligibility: '', registrationDeadline: '',
      featured: false, rules: [''], tags: ['']
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.category || !formData.day || !formData.date || !formData.participationType) {
        toast.error('Please fill all required fields');
        return;
      }

      // Set default registration deadline to 1 day before event if not provided
      let deadline = formData.registrationDeadline;
      if (!deadline && formData.date) {
        const eventDate = new Date(formData.date);
        eventDate.setDate(eventDate.getDate() - 1);
        deadline = eventDate.toISOString();
      }

      const eventData = {
        ...formData,
        day: `Day ${formData.day}`,
        registrationDeadline: deadline,
        rules: formData.rules.filter(r => r.trim()),
        tags: formData.tags.filter(t => t.trim()),
        status: 'published'
      };

      if (editingEvent) {
        await updateEvent(editingEvent._id, eventData);
        toast.success('Event updated!');
      } else {
        await addEvent(eventData);
        toast.success('Event created!');
      }

      setShowModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.message || 'Failed to save');
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

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (field, index, value) => setFormData(prev => ({
    ...prev, [field]: prev[field].map((item, i) => i === index ? value : item)
  }));
  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayItem = (field, index) => setFormData(prev => ({
    ...prev, [field]: prev[field].filter((_, i) => i !== index)
  }));

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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 rounded-xl border border-white/10 w-full max-w-7xl my-8 shadow-2xl">
                
                <div className="sticky top-0 bg-gray-900 z-10 px-8 pt-8 pb-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                  </div>
                </div>

                <div className="px-8 py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                      <div>
                        <label className="block text-white font-medium mb-2">Event Title *</label>
                        <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter event title" required />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Short Description</label>
                        <textarea value={formData.shortDescription} onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                          rows={2} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description" />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Full Description</label>
                        <textarea value={formData.fullDescription} onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                          rows={4} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed description" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Category *</label>
                          <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" required>
                            <option value="technical">Technical</option>
                            <option value="cultural">Cultural</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Department</label>
                          <input type="text" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Department" />
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Event Schedule</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Day *</label>
                          <select value={formData.day} onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" required>
                            <option value={1}>Day 1</option>
                            <option value={2}>Day 2</option>
                            <option value={3}>Day 3</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-white font-medium mb-2">Date *</label>
                          <input type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Start Time</label>
                          <input type="text" value={formData.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="9:00 AM" />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">End Time</label>
                          <input type="text" value={formData.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="6:00 PM" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Venue</label>
                        <input type="text" value={formData.venue} onChange={(e) => handleInputChange('venue', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Event venue" />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Registration Deadline</label>
                        <input type="datetime-local" value={formData.registrationDeadline} onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
                        <p className="text-gray-500 text-xs mt-1">Leave empty to auto-set 1 day before event</p>
                      </div>
                    </div>

                    {/* Participation */}
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Participation</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Type *</label>
                          <select value={formData.participationType} onChange={(e) => handleInputChange('participationType', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" required>
                            <option value="solo">Solo</option>
                            <option value="team">Team</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Min Size</label>
                          <input type="number" value={formData.minTeamSize} onChange={(e) => handleInputChange('minTeamSize', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" min="1" />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Max Size</label>
                          <input type="number" value={formData.maxTeamSize} onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" min="1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Entry Fee (₹)</label>
                          <input type="number" value={formData.entryFee} onChange={(e) => handleInputChange('entryFee', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" min="0" />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Max Registrations</label>
                          <input type="number" value={formData.maxRegistrations} onChange={(e) => handleInputChange('maxRegistrations', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" min="1" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Eligibility</label>
                        <input type="text" value={formData.eligibility} onChange={(e) => handleInputChange('eligibility', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Open to all students" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Prize & Coordinator */}
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Prize & Coordinator</h4>
                      <div>
                        <label className="block text-white font-medium mb-2">Prize Details</label>
                        <input type="text" value={formData.prizeDetails} onChange={(e) => handleInputChange('prizeDetails', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="1st: ₹50,000, 2nd: ₹30,000" />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Coordinator Name</label>
                        <input type="text" value={formData.coordinatorName} onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Name" />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Coordinator Phone</label>
                        <input type="tel" value={formData.coordinatorPhone} onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Phone" />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Coordinator Email</label>
                        <input type="email" value={formData.coordinatorEmail} onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Email" />
                      </div>
                    </div>

                    {/* Media & Settings */}
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Media & Settings</h4>
                      <div>
                        <label className="block text-white font-medium mb-2">Banner Image URL</label>
                        <input type="url" value={formData.bannerImage} onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/image.jpg" />
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
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
                      <div className="space-y-2">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={tag} onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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
                    <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Rules</h4>
                      <div className="space-y-2">
                        {formData.rules.map((rule, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={rule} onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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

                <div className="sticky bottom-0 bg-gray-900 z-10 px-8 py-6 border-t border-gray-700">
                  <div className="flex gap-4">
                    <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                      <Save size={16} /> {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;
