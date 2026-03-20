import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { generalService } from '../../services/general';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await generalService.healthCheck();
        setStatus(response.success ? 'online' : 'offline');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'online') {
    return null; // Don't show anything when backend is working
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking backend status...';
      case 'online':
        return 'Backend is online';
      case 'offline':
        return 'Backend is offline - Using mock data';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'online':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'offline':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <div 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
      
      {showDetails && status === 'offline' && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
          <h3 className="text-white font-medium mb-2">Backend Server Status</h3>
          <p className="text-gray-300 text-sm mb-3">
            The backend server is not running. The app is using mock data for demonstration.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 text-sm font-medium mb-1">To start the backend:</p>
            <code className="text-blue-300 text-xs block bg-blue-900/20 p-2 rounded">
              cd backend<br />
              npm run dev
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;