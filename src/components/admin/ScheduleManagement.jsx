import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Edit2, Save, X, AlertTriangle, Plus } from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { toast } from 'react-hot-toast';

const ScheduleManagement = () => {
  const { events, updateEvent, addEvent, loading } = useEvents();
  const [selectedDay, setSelectedDay] = useState('Day 1');
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({
    title: '',
    day: 'Day 1',
    startTime: '',
    endTime: '',
    venue: '',
    category: 'technical',
    shortDescription: '',
    participationType: 'solo',
    entryFee: 0,
    status: 'published',
    isScheduleOnly: true  // Flag to mark this as schedule-only item
  });

  // Group events by day
  const eventsByDay = events.reduce((acc, event) => {
    if (!acc[event.day]) {
      acc[event.day] = [];
    }
    acc[event.day].push(event);
    return acc;
  }, {});

  // Sort events by start time
  const sortedEvents = (eventsByDay[selectedDay] || []).sort((a, b) => {
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  // Detect conflicts
  const detectConflicts = (events) => {
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        // Check venue conflict
        if (event1.venue === event2.venue && event1.venue) {
          // Check time overlap
          const start1 = event1.startTime || '';
          const end1 = event1.endTime || '';
          const start2 = event2.startTime || '';
          const end2 = event2.endTime || '';
          
          if (start1 && end1 && start2 && end2) {
            if ((start1 < end2 && end1 > start2)) {
              conflicts.push({
                event1: event1.title,
                event2: event2.title,
                venue: event1.venue,
                time: `${start1} - ${end1}`
              });
            }
          }
        }
      }
    }
    return conflicts;
  };

  const conflicts = detectConflicts(sortedEvents);

  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setEditForm({
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      venue: event.venue || '',
      day: event.day || 'Day 1'
    });
  };

  const handleSave = async (eventId) => {
    try {
      await updateEvent(eventId, editForm);
      setEditingEvent(null);
      toast.success('Schedule updated successfully!');
    } catch (error) {
      toast.error('Failed to update schedule');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setEditForm({});
  };

  const handleAddScheduleItem = async () => {
    try {
      // Validate required fields
      if (!newScheduleItem.title || !newScheduleItem.startTime || !newScheduleItem.endTime || !newScheduleItem.venue) {
        toast.error('Please fill all required fields');
        return;
      }

      // Generate slug from title
      const slug = newScheduleItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Create event with schedule details
      const eventData = {
        ...newScheduleItem,
        slug,
        date: new Date(), // You can set proper date based on day
        maxRegistrations: 50,
        currentRegistrations: 0
      };

      await addEvent(eventData);
      
      // Reset form
      setNewScheduleItem({
        title: '',
        day: selectedDay,
        startTime: '',
        endTime: '',
        venue: '',
        category: 'technical',
        shortDescription: '',
        participationType: 'solo',
        entryFee: 0,
        status: 'published',
        isScheduleOnly: true  // Keep the flag
      });
      
      setShowAddForm(false);
      toast.success('Schedule item added successfully!');
    } catch (error) {
      toast.error('Failed to add schedule item');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Schedule Management</h2>
        <p className="text-gray-400">Manage event schedules day-wise</p>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-semibold mb-2">Schedule Conflicts Detected!</h4>
              {conflicts.map((conflict, index) => (
                <p key={index} className="text-red-300 text-sm mb-1">
                  • {conflict.event1} and {conflict.event2} overlap at {conflict.venue} ({conflict.time})
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Day Selector */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {['Day 1', 'Day 2', 'Day 3'].map((day) => {
          const dayEvents = eventsByDay[day] || [];
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <div className="text-lg font-bold">{day}</div>
              <div className="text-xs opacity-80">{dayEvents.length} events</div>
            </button>
          );
        })}
      </div>

      {/* Add Schedule Item Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setNewScheduleItem({ ...newScheduleItem, day: selectedDay });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Schedule Item to {selectedDay}
        </button>
      </div>

      {/* Add Schedule Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 glass-panel p-6 rounded-xl border border-green-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New Schedule Item</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newScheduleItem.title}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Time and Venue */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={newScheduleItem.startTime}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={newScheduleItem.endTime}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Day *
                  </label>
                  <select
                    value={newScheduleItem.day}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, day: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                    <option value="Day 3">Day 3</option>
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={newScheduleItem.venue}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, venue: e.target.value })}
                  placeholder="Enter venue"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={newScheduleItem.category}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Participation Type
                  </label>
                  <select
                    value={newScheduleItem.participationType}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, participationType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="solo">Solo</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Short Description
                </label>
                <textarea
                  value={newScheduleItem.shortDescription}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, shortDescription: e.target.value })}
                  placeholder="Brief description of the event"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Entry Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Entry Fee (₹)
                </label>
                <input
                  type="number"
                  value={newScheduleItem.entryFee}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, entryFee: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddScheduleItem}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Add Schedule Item
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl animate-pulse">
              <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-xl">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Events for {selectedDay}</h3>
          <p className="text-gray-400">Add events to this day from Event Management</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel p-6 rounded-xl border border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                    
                    {editingEvent === event._id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={editForm.startTime}
                              onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={editForm.endTime}
                              onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Day
                            </label>
                            <select
                              value={editForm.day}
                              onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="Day 1">Day 1</option>
                              <option value="Day 2">Day 2</option>
                              <option value="Day 3">Day 3</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Venue
                          </label>
                          <input
                            type="text"
                            value={editForm.venue}
                            onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                            placeholder="Enter venue"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">
                            {event.startTime || 'Not set'} - {event.endTime || 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span className="font-medium">{event.venue || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span className="font-medium">{event.day}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {editingEvent === event._id ? (
                      <>
                        <button
                          onClick={() => handleSave(event._id)}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          title="Save"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    event.category === 'cultural'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {event.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
