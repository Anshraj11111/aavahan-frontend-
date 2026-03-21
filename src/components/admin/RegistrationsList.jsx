import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { adminService } from '../../services/admin';

const RegistrationsList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [viewingScreenshot, setViewingScreenshot] = useState(null);

  // Fetch registrations from backend
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        console.log('Fetching registrations from backend...');
        const response = await adminService.getAllRegistrations();
        console.log('Admin registrations full response:', response);
        console.log('Response data:', response.data);
        console.log('Registrations array:', response.data?.registrations);
        
        const regs = response.data?.registrations || [];
        console.log('Setting registrations count:', regs.length);
        
        // If backend returns empty, try localStorage as fallback
        if (regs.length === 0) {
          console.log('Backend returned 0 registrations, checking localStorage...');
          const localData = localStorage.getItem('aavhaan-registrations');
          if (localData) {
            const localRegs = JSON.parse(localData);
            console.log('Found registrations in localStorage:', localRegs.length);
            setRegistrations(localRegs);
            toast.error('Showing localStorage data. Backend returned empty. Check if registrations are in MongoDB Atlas.');
          } else {
            setRegistrations([]);
          }
        } else {
          setRegistrations(regs);
        }
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Fallback to localStorage on error
        const localData = localStorage.getItem('aavhaan-registrations');
        if (localData) {
          const localRegs = JSON.parse(localData);
          console.log('Using localStorage fallback:', localRegs.length);
          setRegistrations(localRegs);
          toast.error('Failed to load from backend. Showing localStorage data.');
        } else {
          toast.error('Failed to load registrations from backend');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.uniqueRegistrationId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.registrationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20';
      case 'pending_verification': return 'text-yellow-400 bg-yellow-500/20';
      case 'pending': return 'text-orange-400 bg-orange-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleApproveRegistration = async (registrationId) => {
    try {
      await adminService.approveRegistration(registrationId);
      // Refresh the list
      const response = await adminService.getAllRegistrations();
      setRegistrations(response.data?.registrations || []);
      toast.success('Registration approved successfully!');
      setSelectedRegistration(null);
    } catch (error) {
      console.error('Failed to approve registration:', error);
      toast.error('Failed to approve registration');
    }
  };

  const handleVerifyPayment = async (registrationId) => {
    try {
      await adminService.editRegistration(registrationId, {
        paymentStatus: 'paid',
        verifiedAt: new Date().toISOString()
      });
      // Refresh the list
      const response = await adminService.getAllRegistrations();
      setRegistrations(response.data?.registrations || []);
      toast.success('Payment verified successfully!');
    } catch (error) {
      console.error('Failed to verify payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    try {
      await adminService.rejectRegistration(registrationId);
      // Refresh the list
      const response = await adminService.getAllRegistrations();
      setRegistrations(response.data?.registrations || []);
      toast.success('Registration rejected');
      setSelectedRegistration(null);
    } catch (error) {
      console.error('Failed to reject registration:', error);
      toast.error('Failed to reject registration');
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Registrations</h2>
          <p className="text-gray-400">Manage event registrations and participant details</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, event, or registration ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{registrations.length}</p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{registrations.filter(r => r.registrationStatus === 'approved').length}</p>
              <p className="text-gray-400 text-sm">Approved</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{registrations.filter(r => r.registrationStatus === 'pending').length}</p>
              <p className="text-gray-400 text-sm">Pending</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 font-bold text-sm">₹</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{registrations.reduce((sum, r) => sum + r.amountPaid, 0).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Participant</th>
                <th className="text-left p-4 text-gray-300 font-medium">Event</th>
                <th className="text-left p-4 text-gray-300 font-medium">Registration</th>
                <th className="text-left p-4 text-gray-300 font-medium">Payment</th>
                <th className="text-left p-4 text-gray-300 font-medium">Transaction</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration, index) => (
                <tr
                  key={registration._id}
                  className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{registration.fullName}</p>
                      <p className="text-gray-400 text-sm">{registration.email}</p>
                      <p className="text-gray-500 text-xs">{registration.phone}</p>
                      <p className="text-gray-500 text-xs">{registration.instituteName}</p>
                      <p className="text-gray-500 text-xs">{registration.department} - {registration.yearOrSemester}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{registration.eventTitle}</p>
                      <p className="text-gray-400 text-sm">Day {registration.eventDay}</p>
                      <p className="text-gray-500 text-xs capitalize">{registration.participationType}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{registration.uniqueRegistrationId}</p>
                      <p className="text-gray-400 text-sm">{new Date(registration.createdAt).toLocaleDateString()}</p>
                      {registration.teamName && (
                        <p className="text-blue-400 text-xs">Team: {registration.teamName}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">₹{registration.amountPaid}/{registration.amountExpected}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(registration.paymentStatus)}`}>
                        {registration.paymentStatus.replace('_', ' ')}
                      </span>
                      {registration.verifiedAt && (
                        <p className="text-green-400 text-xs mt-1">
                          Verified: {new Date(registration.verifiedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      {registration.transactionId ? (
                        <>
                          <p className="text-white font-medium text-sm">{registration.transactionId}</p>
                          <p className="text-green-400 text-xs">Transaction ID provided</p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">No transaction ID</p>
                      )}
                      {registration.paymentScreenshotUrl && (
                        <button
                          onClick={() => setViewingScreenshot(registration.paymentScreenshotUrl)}
                          className="flex items-center gap-1 mt-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                        >
                          <ImageIcon size={12} />
                          View Screenshot
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.registrationStatus)}`}>
                      {registration.registrationStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedRegistration(registration)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">Registration Details</h3>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Participant Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Participant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Name</p>
                      <p className="text-white">{selectedRegistration.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{selectedRegistration.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{selectedRegistration.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-sm">City</p>
                      <p className="text-white">{selectedRegistration.city}</p>
                    </div>
                  </div>
                </div>
                
                {/* Academic Information */}
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
                  <h5 className="text-white font-medium mb-2">Academic Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Institution</p>
                      <p className="text-white">{selectedRegistration.instituteName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Department</p>
                      <p className="text-white">{selectedRegistration.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Year/Semester</p>
                      <p className="text-white">{selectedRegistration.yearOrSemester}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Team Members</h4>
                  <div className="space-y-3">
                    {selectedRegistration.teamMembers.map((member, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                        <p className="text-gray-500 text-xs">{member.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Event Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Event</p>
                      <p className="text-white">{selectedRegistration.eventTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Day</p>
                      <p className="text-white">Day {selectedRegistration.eventDay}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Payment Information</h4>
                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-white font-medium">₹{selectedRegistration.amountPaid} / ₹{selectedRegistration.amountExpected}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Payment Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedRegistration.paymentStatus)}`}>
                        {selectedRegistration.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {selectedRegistration.transactionId && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm">Transaction ID</p>
                      <p className="text-white font-mono bg-gray-700 px-3 py-2 rounded text-sm">
                        {selectedRegistration.transactionId}
                      </p>
                    </div>
                  )}
                  
                  {selectedRegistration.paymentScreenshotUrl && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Payment Screenshot</p>
                      <div 
                        onClick={() => setViewingScreenshot(selectedRegistration.paymentScreenshotUrl)}
                        className="relative w-full max-w-xs cursor-pointer group"
                      >
                        <img 
                          src={selectedRegistration.paymentScreenshotUrl} 
                          alt="Payment Screenshot"
                          className="w-full h-auto rounded-lg border border-gray-600 group-hover:border-blue-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">Click to view full size</p>
                    </div>
                  )}
                  
                  {selectedRegistration.verifiedAt && (
                    <div>
                      <p className="text-gray-400 text-sm">Verified At</p>
                      <p className="text-green-400 text-sm">
                        {new Date(selectedRegistration.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                {selectedRegistration.paymentStatus !== 'paid' && (
                  <button 
                    onClick={() => handleVerifyPayment(selectedRegistration._id)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Verify Payment
                  </button>
                )}
                <button 
                  onClick={() => handleApproveRegistration(selectedRegistration._id)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {selectedRegistration.registrationStatus === 'approved' ? 'Already Approved' : 'Approve Registration'}
                </button>
                <button 
                  onClick={() => handleRejectRegistration(selectedRegistration._id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reject Registration
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Screenshot Viewer Modal */}
      {viewingScreenshot && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingScreenshot(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingScreenshot(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
            >
              <X size={24} />
              <span>Close</span>
            </button>
            <img 
              src={viewingScreenshot} 
              alt="Payment Screenshot Full Size"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default RegistrationsList;