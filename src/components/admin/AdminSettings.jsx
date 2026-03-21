import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  User,
  AlertCircle,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentService } from '../../services/payment';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    paymentQR: {
      upiId: '',
      phoneNumber: '',
      merchantName: ''
    },
    adminInfo: {
      name: 'Admin',
      email: 'admin@techfest.com',
      phone: '9876543210'
    }
  });
  const [configId, setConfigId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch payment config from backend on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await paymentService.getAdminPaymentConfig();
        if (response.success && response.data?.config) {
          const config = response.data.config;
          setConfigId(config._id);
          setSettings(prev => ({
            ...prev,
            paymentQR: {
              upiId: config.upiId || '',
              phoneNumber: config.upiId?.split('@')[0] || '',
              merchantName: config.payeeName || ''
            }
          }));
          console.log('Payment config loaded from backend:', config);
        }
      } catch (error) {
        console.error('Failed to fetch payment config:', error);
        toast.error('Failed to load payment settings');
      } finally {
        setIsFetching(false);
      }
    };

    fetchConfig();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generateQRCodeUrl = (upiId, merchantName, amount = '') => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: merchantName,
      cu: 'INR'
    });
    
    if (amount) {
      params.append('am', amount);
    }
    
    const upiString = `upi://pay?${params.toString()}`;
    // Using QR Server API to generate QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        upiId: settings.paymentQR.upiId,
        payeeName: settings.paymentQR.merchantName,
        note: 'Pay registration fee via UPI',
        active: true
      };

      if (configId) {
        // Update existing config
        await paymentService.updatePaymentConfig(configId, updateData);
        toast.success('Payment settings updated successfully!');
      } else {
        // Create new config
        const response = await paymentService.createPaymentConfig(updateData);
        if (response.success && response.data?.config) {
          setConfigId(response.data.config._id);
        }
        toast.success('Payment settings created successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      paymentQR: {
        upiId: 'techfest2026@paytm',
        phoneNumber: '9876543210',
        merchantName: 'Tech Fest 2026'
      },
      adminInfo: {
        name: 'Admin',
        email: 'admin@techfest.com',
        phone: '9876543210'
      }
    };
    setSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  const qrCodeUrl = generateQRCodeUrl(settings.paymentQR.upiId, settings.paymentQR.merchantName);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
          <p className="text-gray-400">Configure payment UPI and admin information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment UPI Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-blue-400" />
            Payment UPI Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">UPI ID *</label>
              <input
                type="text"
                value={settings.paymentQR.upiId}
                onChange={(e) => handleInputChange('paymentQR', 'upiId', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter UPI ID (e.g., yourname@paytm)"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.paymentQR.phoneNumber}
                onChange={(e) => handleInputChange('paymentQR', 'phoneNumber', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Merchant Name</label>
              <input
                type="text"
                value={settings.paymentQR.merchantName}
                onChange={(e) => handleInputChange('paymentQR', 'merchantName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter merchant name"
              />
            </div>

            {/* Auto-generated QR Code Preview */}
            <div className="mt-6">
              <label className="block text-white font-medium mb-2">Auto-Generated QR Code</label>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img
                  src={qrCodeUrl}
                  alt="Auto-generated Payment QR Code"
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBWMTMwTTcwIDEwMEgxMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                  }}
                />
              </div>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                QR Code automatically generated from UPI ID
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-400 text-sm">
                <p className="font-medium mb-1">Auto QR Generation:</p>
                <p>QR code is automatically generated from your UPI ID. Students can scan this to make payments directly to your UPI account.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-3 text-purple-400" />
            Admin Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Admin Name</label>
              <input
                type="text"
                value={settings.adminInfo.name}
                onChange={(e) => handleInputChange('adminInfo', 'name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin name"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.adminInfo.email}
                onChange={(e) => handleInputChange('adminInfo', 'email', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Admin Phone</label>
              <input
                type="tel"
                value={settings.adminInfo.phone}
                onChange={(e) => handleInputChange('adminInfo', 'phone', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin phone"
              />
            </div>
          </div>

          {/* Current Settings Preview */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-3">Current Settings Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">UPI ID:</span>
                <span className="text-white">{settings.paymentQR.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{settings.paymentQR.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Merchant:</span>
                <span className="text-white">{settings.paymentQR.merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">QR Status:</span>
                <span className="text-green-400">Auto-Generated</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-xl border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-3 text-green-400" />
          How It Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Auto QR Generation</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• QR code automatically generated from UPI ID</li>
              <li>• Students scan to make direct UPI payments</li>
              <li>• No need to upload QR code images</li>
              <li>• Updates automatically when UPI ID changes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Payment Process</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Students see QR in registration form</li>
              <li>• Direct payment to your UPI account</li>
              <li>• Payment screenshot upload for verification</li>
              <li>• Admin can verify payments manually</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;