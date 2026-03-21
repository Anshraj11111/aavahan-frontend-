import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  BarChart3,
  UserCheck,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import RegistrationsList from '../../components/admin/RegistrationsList';
import EventManagement from '../../components/admin/EventManagement';
import AdminSettings from '../../components/admin/AdminSettings';
import { useRegistrations } from '../../contexts/RegistrationContext';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const { getRegistrationStats, registrations, getRegistrationsByEvent } = useRegistrations();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || token !== 'admin-authenticated') {
      navigate('/admin/login');
      return;
    }

    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Get real-time stats from context
  const registrationStats = getRegistrationStats();

  const stats = [
    {
      title: 'Total Registrations',
      value: registrationStats.total.toString(),
      change: '+18%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Events',
      value: '6',
      change: '+2',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Revenue Generated',
      value: `₹${registrationStats.totalRevenue.toLocaleString()}`,
      change: '+24%',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Pending Approvals',
      value: registrationStats.pending.toString(),
      change: '-8',
      icon: UserCheck,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivities = registrations.length > 0 
    ? registrations
        .slice(0, 6)
        .map((reg, index) => ({
          id: reg._id,
          action: reg.registrationStatus === 'approved' ? 'Registration approved' : 'New registration',
          user: reg.fullName,
          event: reg.eventTitle,
          time: `${Math.floor(Math.random() * 60) + 1} minutes ago`,
          amount: `₹${reg.amountPaid}`
        }))
    : [
        { id: 1, action: 'No recent activities', user: 'System', event: 'Welcome to Tech Fest 2026', time: 'Just now', amount: '₹0' }
      ];

  const eventRegistrations = [
    { event: 'AI & ML Hackathon', registered: getRegistrationsByEvent('AI & Machine Learning Hackathon').length, total: 50, percentage: Math.round((getRegistrationsByEvent('AI & Machine Learning Hackathon').length / 50) * 100) },
    { event: 'Cultural Dance Competition', registered: getRegistrationsByEvent('Cultural Dance Competition').length, total: 30, percentage: Math.round((getRegistrationsByEvent('Cultural Dance Competition').length / 30) * 100) },
    { event: 'Photography Contest', registered: getRegistrationsByEvent('Photography Contest').length, total: 100, percentage: Math.round((getRegistrationsByEvent('Photography Contest').length / 100) * 100) },
    { event: 'Gaming Tournament', registered: getRegistrationsByEvent('Gaming Tournament').length, total: 80, percentage: Math.round((getRegistrationsByEvent('Gaming Tournament').length / 80) * 100) },
    { event: 'Robotics Championship', registered: getRegistrationsByEvent('Robotics Championship').length, total: 25, percentage: Math.round((getRegistrationsByEvent('Robotics Championship').length / 25) * 100) },
    { event: 'Startup Pitch Competition', registered: getRegistrationsByEvent('Startup Pitch Competition').length, total: 20, percentage: Math.round((getRegistrationsByEvent('Startup Pitch Competition').length / 20) * 100) },
  ];

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <AdminSidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeView === 'dashboard' ? 'Dashboard' : 
               activeView === 'registrations' ? 'Registrations' : 
               activeView === 'events' ? 'Event Management' : 
               activeView === 'settings' ? 'Admin Settings' :
               activeView === 'analytics' ? 'Analytics' :
               activeView === 'notifications' ? 'Send Notifications' : 'Dashboard'}
            </h1>
            <p className="text-gray-400">Welcome back, {adminUser.email}</p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
        {activeView === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.action}</span> by {activity.user}
                        </p>
                        <p className="text-gray-400 text-xs">{activity.event}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                          <span className="text-green-400 text-xs font-medium">{activity.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Event Registrations Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold text-white mb-6">Event Registration Status</h2>
                <div className="space-y-4">
                  {eventRegistrations.map((event, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium truncate">{event.event}</span>
                        <span className="text-gray-400 text-xs">{event.registered}/{event.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            event.percentage >= 95 ? 'bg-red-500' :
                            event.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${event.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${
                          event.percentage >= 95 ? 'text-red-400' :
                          event.percentage >= 80 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {event.percentage}% filled
                        </span>
                        <span className="text-gray-500 text-xs">
                          {event.total - event.registered} spots left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setActiveView('events')}
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-left"
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium block">Manage Events</span>
                    <span className="text-xs text-blue-200">Create, edit, delete events</span>
                  </button>
                  <button 
                    onClick={() => setActiveView('registrations')}
                    className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors text-left"
                  >
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium block">View Registrations</span>
                    <span className="text-xs text-green-200">Check participant details</span>
                  </button>
                  <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors text-left">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium block">Analytics</span>
                    <span className="text-xs text-purple-200">View detailed reports</span>
                  </button>
                  <button className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors text-left">
                    <Mail className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium block">Send Notifications</span>
                    <span className="text-xs text-orange-200">Email participants</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Registration Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-6">Registration Trends & Prize Pool</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Chart Placeholder */}
                <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Daily Registrations</p>
                    <p className="text-gray-500 text-sm">Peak: 156 registrations on Day 1</p>
                    <div className="mt-4 flex justify-center space-x-4 text-xs">
                      <span className="text-blue-400">• Day 1: 156</span>
                      <span className="text-green-400">• Day 2: 142</span>
                      <span className="text-purple-400">• Day 3: 98</span>
                    </div>
                  </div>
                </div>
                
                {/* Prize Pool Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Prize Pool Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">AI & ML Hackathon</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Robotics Championship</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Gaming Tournament</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Photography Contest</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Cultural Dance</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Startup Pitch</span>
                      <span className="text-green-400 font-medium">₹10,000</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Prize Pool</span>
                      <span className="text-green-400">₹60,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeView === 'registrations' && <RegistrationsList />}
        {activeView === 'events' && <EventManagement />}
        {activeView === 'settings' && <AdminSettings />}
        {activeView === 'analytics' && (
          <div className="text-center py-20">
            <BarChart3 className="w-32 h-32 text-gray-600 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-white mb-6">Analytics Coming Soon</h3>
            <p className="text-gray-400 text-lg">Advanced analytics and reporting features will be available soon.</p>
          </div>
        )}
        {activeView === 'notifications' && (
          <div className="text-center py-20">
            <Mail className="w-32 h-32 text-gray-600 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-white mb-6">Notifications Coming Soon</h3>
            <p className="text-gray-400 text-lg">Email notification system will be available soon.</p>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;