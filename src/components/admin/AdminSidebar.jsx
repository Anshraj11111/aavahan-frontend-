import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ activeView, setActiveView, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-400'
    },
    {
      id: 'events',
      label: 'Manage Events',
      icon: Calendar,
      color: 'text-purple-400'
    },
    {
      id: 'registrations',
      label: 'View Registrations',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-yellow-400'
    },
    {
      id: 'notifications',
      label: 'Send Notifications',
      icon: Mail,
      color: 'text-orange-400'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-400'
    }
  ];

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-gray-900 border-r border-gray-700 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-white">Tech Fest</h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-white' : item.color}
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-700">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;