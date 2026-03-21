import { useState, useEffect, useRef, useMemo } from 'react';
import { X, User, Users, Upload, QrCode, CheckCircle, AlertCircle, CreditCard, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { paymentService } from '../../services/payment';
import { registrationsService } from '../../services/registrations';

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const modalContentRef = useRef(null);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: {
      fullName: '',
      email: '',
      phone: '',
      college: '',
      branch: '',
      semester: '',
    },
    teamMembers: [
      { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' },
      { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' },
      { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' }
    ],
    paymentScreenshot: null,
    transactionId: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = event?.entryFee > 0 ? 3 : 2;

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      // Immediately scroll page to top
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Scroll modal content to top
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Fetch payment config from backend
  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        console.log('Fetching payment config from backend...');
        const response = await paymentService.getPaymentConfig();
        console.log('Payment config response:', response);
        
        if (response.success && response.data?.config) {
          setPaymentConfig(response.data.config);
          console.log('Payment config loaded:', response.data.config);
          console.log('UPI ID:', response.data.config.upiId);
          console.log('Payee Name:', response.data.config.payeeName);
        } else {
          console.warn('No payment config found in response');
        }
      } catch (error) {
        console.error('Failed to fetch payment config:', error);
      }
    };

    if (isOpen && event?.entryFee > 0) {
      fetchPaymentConfig();
    }
  }, [isOpen, event?.entryFee]);

  // Generate QR code URL - uses backend config or fallback to defaults
  const qrCodeUrl = useMemo(() => {
    if (!event?.entryFee) return '';
    
    const upiId = paymentConfig?.upiId || '8269858259@ybl';
    const merchantName = paymentConfig?.payeeName || 'Aavhaan 2026';
    
    const params = new URLSearchParams({
      pa: upiId,
      pn: merchantName,
      cu: 'INR',
      am: event.entryFee.toString()
    });
    
    const upiString = `upi://pay?${params.toString()}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    console.log('Generated QR URL:', url);
    return url;
  }, [event?.entryFee, paymentConfig]);

  const upiDetails = {
    upiId: paymentConfig?.upiId || '8269858259@ybl',
    phone: paymentConfig?.upiId?.split('@')[0] || '8269858259'
  };

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setQrLoaded(false);
      setFormData({
        teamName: '',
        teamLeader: {
          fullName: '',
          email: '',
          phone: '',
          college: '',
          branch: '',
          semester: '',
        },
        teamMembers: [
          { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' },
          { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' },
          { fullName: '', email: '', phone: '', college: '', branch: '', semester: '' }
        ],
        paymentScreenshot: null,
        transactionId: ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (section === 'teamLeader') {
        return {
          ...prev,
          teamLeader: {
            ...prev.teamLeader,
            [name]: value
          }
        };
      } else if (section === 'teamMembers' && index !== null) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.map((member, i) => 
            i === index ? { ...member, [name]: value } : member
          )
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      e.target.value = '';
      return;
    }
    
    // Set the file - backend will handle OCR verification
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file
    }));
    
    toast.success('Payment screenshot uploaded!');
  };

  const handleNext = async () => {
    // If moving from payment step (step 2) to confirmation (step 3), verify payment first
    if (currentStep === 2 && event?.entryFee > 0) {
      // Validate transaction ID and screenshot are present
      if (!formData.transactionId || !formData.transactionId.trim()) {
        toast.error('Please enter transaction ID before proceeding');
        return;
      }
      
      if (!formData.paymentScreenshot) {
        toast.error('Please upload payment screenshot before proceeding');
        return;
      }
      
      // Show loading toast
      const loadingToast = toast.loading('Verifying payment details... This may take 10-15 seconds.');
      
      try {
        // Prepare FormData for verification
        const verificationData = new FormData();
        verificationData.append('transactionId', formData.transactionId.trim());
        verificationData.append('screenshot', formData.paymentScreenshot);
        
        // Call backend OCR verification API with longer timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/registrations/verify-payment`, {
          method: 'POST',
          body: verificationData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const result = await response.json();
        
        toast.dismiss(loadingToast);
        
        if (!response.ok || !result.success) {
          toast.error(result.message || 'Payment verification failed. Transaction ID does not match screenshot.', {
            duration: 6000
          });
          return;
        }
        
        // Verification successful
        toast.success('Payment verified successfully!');
        setCurrentStep(currentStep + 1);
        
        // Auto scroll to top after step change
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
        
      } catch (error) {
        toast.dismiss(loadingToast);
        
        if (error.name === 'AbortError') {
          toast.error('Verification timeout. Please try again with a clearer screenshot.', {
            duration: 6000
          });
        } else {
          console.error('Payment verification error:', error);
          toast.error('Failed to verify payment. Please check your details and try again.', {
            duration: 6000
          });
        }
        return;
      }
    } else {
      // For other steps, just move forward
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        
        // Auto scroll to top after step change
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare FormData for backend API
      const formDataToSend = new FormData();
      
      // Basic info
      formDataToSend.append('fullName', formData.teamLeader.fullName);
      formDataToSend.append('email', formData.teamLeader.email);
      formDataToSend.append('phone', formData.teamLeader.phone);
      formDataToSend.append('instituteName', formData.teamLeader.college);
      formDataToSend.append('department', formData.teamLeader.branch);
      formDataToSend.append('yearOrSemester', formData.teamLeader.semester);
      formDataToSend.append('city', 'Not specified');
      formDataToSend.append('gender', 'Not specified');
      formDataToSend.append('eventId', event._id);
      
      // Team info (if team event)
      if (event?.participationType === 'team') {
        formDataToSend.append('teamName', formData.teamName);
        
        // Add team members (only non-empty ones)
        const validMembers = formData.teamMembers.filter(member => member.fullName.trim() !== '');
        formDataToSend.append('teamMembers', JSON.stringify(validMembers.map(member => ({
          fullName: member.fullName,
          email: member.email,
          phone: member.phone,
          college: member.college || formData.teamLeader.college,
          branch: member.branch || formData.teamLeader.branch,
          semester: member.semester || formData.teamLeader.semester
        }))));
      }
      
      // Payment info (if paid event)
      if (event?.entryFee > 0) {
        if (!formData.transactionId || !formData.transactionId.trim()) {
          toast.error('Transaction ID is required for paid events');
          setIsSubmitting(false);
          return;
        }
        
        if (!formData.paymentScreenshot) {
          toast.error('Payment screenshot is required for paid events');
          setIsSubmitting(false);
          return;
        }
        
        formDataToSend.append('transactionId', formData.transactionId.trim());
        formDataToSend.append('screenshot', formData.paymentScreenshot);
      }
      
      // Submit to backend API
      const response = await registrationsService.submitRegistration(formDataToSend);
      
      if (response.success) {
        toast.success('Thank you for registering! You will receive more information via email shortly.', {
          duration: 5000,
          icon: '✅'
        });
        onClose();
      } else {
        // Backend returned error in response
        toast.error(response.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show specific error message from backend
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit registration. Please try again.';
      toast.error(errorMessage, { duration: 6000 });
      setIsSubmitting(false);
      
      // Don't close modal or proceed - stay on current step so user can fix the issue
      return;
    }
  };

  const isTeamEvent = event?.participationType === 'team';
  const maxTeamSize = event?.maxTeamSize || 4;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24 sm:pt-28 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="modal-backdrop fixed inset-0 bg-black/80"
          onClick={onClose}
        />

        <motion.div
          ref={modalContentRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="registration-modal-content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-xl md:rounded-2xl border border-white/20 shadow-2xl mx-2 md:mx-0 z-10 my-4"
        >
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-3xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-blue-400 flex-shrink-0" />
                <span className="truncate">Event Registration</span>
              </h2>
              {event && (
                <p className="text-gray-400 mt-1 text-sm md:text-lg truncate">{event.title}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex-shrink-0 ml-2"
            >
              <X size={20} className="md:hidden" />
              <X size={24} className="hidden md:block" />
            </button>
          </div>

          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs md:text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 md:h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            {/* Step 1: Team/Participant Information */}
            {currentStep === 1 && (
              <div className="modal-form-section space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-purple-400" />
                  {isTeamEvent ? 'Team Information' : 'Participant Information'}
                </h3>
                
                {isTeamEvent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your team name"
                    />
                  </div>
                )}

                <div className="glass-panel p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    {isTeamEvent ? 'Team Leader Details' : 'Your Details'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.teamLeader.fullName}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.teamLeader.email}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.teamLeader.phone}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        College *
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.teamLeader.college}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter college name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Branch *
                      </label>
                      <select
                        name="branch"
                        value={formData.teamLeader.branch}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="" className="bg-navy-900">Select Branch</option>
                        <option value="Computer Science" className="bg-navy-900">Computer Science</option>
                        <option value="Information Technology" className="bg-navy-900">Information Technology</option>
                        <option value="Electronics & Communication" className="bg-navy-900">Electronics & Communication</option>
                        <option value="Electrical Engineering" className="bg-navy-900">Electrical Engineering</option>
                        <option value="Mechanical Engineering" className="bg-navy-900">Mechanical Engineering</option>
                        <option value="Civil Engineering" className="bg-navy-900">Civil Engineering</option>
                        <option value="Other" className="bg-navy-900">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Semester *
                      </label>
                      <select
                        name="semester"
                        value={formData.teamLeader.semester}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="" className="bg-navy-900">Select Semester</option>
                        <option value="1st" className="bg-navy-900">1st Semester</option>
                        <option value="2nd" className="bg-navy-900">2nd Semester</option>
                        <option value="3rd" className="bg-navy-900">3rd Semester</option>
                        <option value="4th" className="bg-navy-900">4th Semester</option>
                        <option value="5th" className="bg-navy-900">5th Semester</option>
                        <option value="6th" className="bg-navy-900">6th Semester</option>
                        <option value="7th" className="bg-navy-900">7th Semester</option>
                        <option value="8th" className="bg-navy-900">8th Semester</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isTeamEvent && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-400" />
                      Team Members (Optional - Max {maxTeamSize - 1} additional)
                    </h4>
                    
                    {formData.teamMembers.slice(0, maxTeamSize - 1).map((member, index) => (
                      <div key={index} className="glass-panel p-4 rounded-xl">
                        <h5 className="text-md font-medium text-white mb-3">
                          Member {index + 1} (Optional)
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            name="fullName"
                            value={member.fullName}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Full Name"
                          />
                          <input
                            type="email"
                            name="email"
                            value={member.email}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={member.phone}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Phone"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && event?.entryFee > 0 && (
              <div className="modal-form-section space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-yellow-400" />
                  Payment Information
                </h3>
                
                <div className="glass-panel p-4 md:p-6 rounded-xl text-center">
                  <div className="mb-4 md:mb-6">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2">Entry Fee</h4>
                    <div className="text-2xl md:text-3xl font-bold text-green-400">₹{event.entryFee}</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center justify-center">
                      <QrCode className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-400" />
                      Scan QR Code to Pay
                    </h4>
                    
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-48 h-48 object-contain"
                        onLoad={() => {
                          console.log('QR Code loaded successfully:', qrCodeUrl);
                          setQrLoaded(true);
                        }}
                        onError={(e) => {
                          console.error('QR Code failed to load:', qrCodeUrl);
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBWMTMwTTcwIDEwMEgxMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      UPI ID: {upiDetails.upiId} | Phone: {upiDetails.phone}
                    </p>
                    <p className="text-green-400 text-xs mt-2 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      QR Code automatically generated from UPI ID
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                      <Upload className="w-5 h-5 mr-2 text-purple-400" />
                      Payment Details
                    </h4>
                    
                    {/* Transaction ID Field - REQUIRED */}
                    <div className="mb-6">
                      <label className="block text-white font-medium mb-2 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                        Transaction ID / Reference Number *
                      </label>
                      <input
                        type="text"
                        value={formData.transactionId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter UPI transaction ID or reference number"
                        required
                        minLength={1}
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Enter the transaction ID from your UPI payment app (e.g., 123456789012). Backend will verify it matches your screenshot.
                      </p>
                      {!formData.transactionId && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Transaction ID is mandatory for registration
                        </p>
                      )}
                    </div>

                    {/* Payment Screenshot Upload - REQUIRED */}
                    <div>
                      <label className="block text-white font-medium mb-2 flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-purple-400" />
                        Payment Screenshot *
                      </label>
                      
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="payment-screenshot"
                          required
                        />
                        <label
                          htmlFor="payment-screenshot"
                          className="cursor-pointer block w-full p-6 border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 transition-colors duration-300"
                        >
                          {formData.paymentScreenshot ? (
                            <div className="flex items-center justify-center space-x-3 text-green-400">
                              <CheckCircle className="w-6 h-6" />
                              <span className="font-medium">{formData.paymentScreenshot.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-3">
                              <Camera className="w-12 h-12 text-gray-400" />
                              <div className="text-center">
                                <p className="text-white font-medium">Click to upload screenshot *</p>
                                <p className="text-gray-400 text-sm">PNG, JPG up to 5MB (Required)</p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                      {!formData.paymentScreenshot && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Payment screenshot is required for registration
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === totalSteps && (
              <div className="modal-form-section space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                  Confirm Registration
                </h3>
                
                <div className="glass-panel p-6 rounded-xl space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Registration Summary</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Event:</span>
                      <span className="text-white ml-2 font-medium">{event?.title}</span>
                    </div>
                    {isTeamEvent && (
                      <div>
                        <span className="text-gray-400">Team Name:</span>
                        <span className="text-white ml-2 font-medium">{formData.teamName}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">{isTeamEvent ? 'Team Leader:' : 'Name:'}</span>
                      <span className="text-white ml-2 font-medium">{formData.teamLeader.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2 font-medium">{formData.teamLeader.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white ml-2 font-medium">{formData.teamLeader.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">College:</span>
                      <span className="text-white ml-2 font-medium">{formData.teamLeader.college}</span>
                    </div>
                    {isTeamEvent && (
                      <div>
                        <span className="text-gray-400">Team Size:</span>
                        <span className="text-white ml-2 font-medium">
                          {1 + formData.teamMembers.filter(member => member.fullName.trim() !== '').length} members
                        </span>
                      </div>
                    )}
                    {event?.entryFee > 0 && (
                      <>
                        <div>
                          <span className="text-gray-400">Entry Fee:</span>
                          <span className="text-green-400 ml-2 font-medium">₹{event.entryFee}</span>
                        </div>
                        {formData.transactionId && (
                          <div>
                            <span className="text-gray-400">Transaction ID:</span>
                            <span className="text-blue-400 ml-2 font-medium">{formData.transactionId}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-blue-400 text-sm">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Registration confirmation will be sent to your email</li>
                        <li>• Transaction ID must be unique and is mandatory for registration</li>
                        <li>• Payment screenshot is required for verification</li>
                        <li>• Follow event rules and guidelines</li>
                        <li>• Bring valid ID proof on event day</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    // Disable Next button on payment step if transaction ID or screenshot is missing
                    currentStep === 2 && event?.entryFee > 0 && 
                    (!formData.transactionId || !formData.transactionId.trim() || !formData.paymentScreenshot)
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || (event?.entryFee > 0 && (!formData.transactionId || !formData.transactionId.trim() || !formData.paymentScreenshot))}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Registration</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;