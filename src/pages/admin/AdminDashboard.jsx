import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  LogOut, 
  Settings,
  Bell,
  BarChart3,
  UserCheck,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
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

  const stats = [
    {
      title: 'Total Registrations',
      value: '2,547',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Events',
      value: '48',
      change: '+3',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Revenue',
      value: '₹1,25,000',
      change: '+8%',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-5',
      icon: UserCheck,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New registration', user: 'John Doe', event: 'Coding Competition', time: '2 minutes ago' },
    { id: 2, action: 'Payment verified', user: 'Jane Smith', event: 'Web Development Workshop', time: '5 minutes ago' },
    { id: 3, action: 'Event created', user: 'Admin', event: 'AI/ML Seminar', time: '1 hour ago' },
    { id: 4, action: 'Registration approved', user: 'Mike Johnson', event: 'Hackathon', time: '2 hours ago' },
  ];

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Admin Navigation */}
      <AdminNavbar />
      
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {adminUser.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.action}</span> by {activity.user}
                    </p>
                    <p className="text-gray-400 text-xs">{activity.event}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Events</span>
              </button>
              <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">View Registrations</span>
              </button>
              <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors">
                <Mail className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Send Notifications</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 glass-panel rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-6">Registration Trends</h2>
          <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Chart visualization would go here</p>
              <p className="text-gray-500 text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;