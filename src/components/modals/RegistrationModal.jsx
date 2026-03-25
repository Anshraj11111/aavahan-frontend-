import { useState, useEffect, useRef, useMemo } from 'react';
import { X, User, Users, CheckCircle, AlertCircle, CreditCard, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { registrationsService } from '../../services/registrations';
import { razorpayService } from '../../services/razorpay';
import { useEvents } from '../../contexts/EventsContext';

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const { refreshEvents } = useEvents();
  const modalContentRef = useRef(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
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
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  
  // Calculate total steps based on entry fee
  const totalSteps = useMemo(() => {
    return event?.entryFee > 0 ? 3 : 2; // 3 steps for paid, 2 for free
  }, [event?.entryFee]);

  // Scroll to top when modal opens and lock body scroll
  useEffect(() => {
    if (isOpen) {
      // IMMEDIATELY scroll to top - no smooth behavior to ensure instant positioning
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Lock body scroll after scrolling
      document.body.style.overflow = 'hidden';
      
      // Reset modal content scroll position
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    } else {
      // Unlock body scroll when modal closes
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup: unlock scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fetch Razorpay Key ID
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await razorpayService.getKeyId();
        if (response.success && response.data?.keyId) {
          setRazorpayKeyId(response.data.keyId);
          console.log('Razorpay Key ID loaded:', response.data.keyId);
        }
      } catch (error) {
        console.error('Failed to fetch Razorpay key:', error);
      }
    };

    if (isOpen && event?.entryFee > 0) {
      fetchRazorpayKey();
    }
  }, [isOpen, event?.entryFee]);

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
      setPaymentCompleted(false);
      setPaymentData(null);
      setRegistrationSuccess(false);
      setRegistrationData(null);
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

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      setLoadingMessage('Creating payment order...');
      
      const orderResponse = await razorpayService.createOrder(
        event.entryFee,
        event._id,
        event.title
      );

      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'Aavhaan 2026',
        description: event.title,
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoadingMessage('Verifying payment...');
            
            const verifyResponse = await razorpayService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyResponse.success && verifyResponse.verified) {
              setPaymentCompleted(true);
              setPaymentData(verifyResponse.data);
              setLoadingMessage('');
              
              toast.success('Payment successful! Proceeding to confirmation...', {
                duration: 3000,
                icon: '✅'
              });

              setTimeout(() => {
                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (modalContentRef.current) {
                  modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 1000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.', {
              duration: 8000,
              style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14px',
              },
            });
            setLoadingMessage('');
          }
        },
        prefill: {
          name: formData.teamLeader.fullName,
          email: formData.teamLeader.email,
          contact: formData.teamLeader.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setLoadingMessage('');
            toast.error('Payment cancelled', {
              duration: 3000,
            });
          }
        }
      };

      setLoadingMessage('');
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setLoadingMessage('');
      toast.error('Failed to initiate payment. Please try again.', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          fontSize: '14px',
        },
      });
    }
  };

  const handleNext = async () => {
    // Step 1 → Step 2: Validate team name for team events
    if (currentStep === 1 && isTeamEvent) {
      if (!formData.teamName || !formData.teamName.trim()) {
        toast.error('Please enter a team name before proceeding', {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '12px',
          },
          icon: '❌'
        });
        return;
      }
      
      // Check if team name is already taken
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/registrations/check-team-name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: event._id,
            teamName: formData.teamName.trim()
          })
        });
        
        const result = await response.json();
        
        if (!result.data?.available) {
          toast.error(result.message || 'This team name is already taken for this event. Please choose a different name.', {
            duration: 8000,
            style: {
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              padding: '16px',
              borderRadius: '12px',
            },
            icon: '❌'
          });
          return;
        }
      } catch (error) {
        console.error('Team name check failed:', error);
        // Don't block on network error - let backend handle it at final submission
      }
    }
    
    // For paid events, payment is handled by Razorpay button in Step 2
    // Just move forward to next step
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
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const { downloadReceipt } = await import('../../utils/receiptGenerator');
      downloadReceipt(registrationData, event);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('Failed to download receipt. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submission
    if (formData.teamLeader.phone.length !== 10) {
      toast.error('Team leader phone number must be exactly 10 digits', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '❌'
      });
      return;
    }
    
    // Validate team member phone numbers if provided
    if (isTeamEvent) {
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const member = formData.teamMembers[i];
        if (member.phone && member.phone.length > 0 && member.phone.length !== 10) {
          toast.error(`Team member ${i + 1} phone number must be exactly 10 digits`, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              padding: '16px',
              borderRadius: '12px',
            },
            icon: '❌'
          });
          return;
        }
      }
    }
    
    setIsSubmitting(true);

    try {
      // Step 1: Preparing data
      setLoadingMessage('Preparing registration data...');
      
      // Prepare FormData for backend API
      const formDataToSend = new FormData();
      
      // Basic info
      formDataToSend.append('fullName', formData.teamLeader.fullName);
      formDataToSend.append('email', formData.teamLeader.email);
      formDataToSend.append('phone', formData.teamLeader.phone);
      formDataToSend.append('instituteName', formData.teamLeader.college);
      formDataToSend.append('department', formData.teamLeader.branch);
      formDataToSend.append('yearOrSemester', formData.teamLeader.semester);
      formDataToSend.append('eventId', event._id);
      
      // Log what we're sending
      console.log('Submitting registration with data:', {
        fullName: formData.teamLeader.fullName,
        email: formData.teamLeader.email,
        phone: formData.teamLeader.phone,
        instituteName: formData.teamLeader.college,
        department: formData.teamLeader.branch,
        yearOrSemester: formData.teamLeader.semester,
        eventId: event._id,
        eventIdType: typeof event._id,
        isTeamEvent: event?.participationType === 'team',
        entryFee: event?.entryFee
      });
      
      // Team info (if team event)
      if (event?.participationType === 'team') {
        formDataToSend.append('teamName', formData.teamName);
        
        // Add team members (only non-empty ones)
        const validMembers = formData.teamMembers.filter(member => member.fullName.trim() !== '');
        const teamMembersData = validMembers.map(member => ({
          name: member.fullName, // Backend expects 'name', not 'fullName'
          email: member.email || '',
          phone: member.phone || '',
          college: member.college || formData.teamLeader.college // Use team leader's college as fallback
        }));
        
        console.log('Team members being sent:', teamMembersData);
        formDataToSend.append('teamMembers', JSON.stringify(teamMembersData));
      }
      
      // Payment info (if paid event and payment completed via Razorpay)
      if (event?.entryFee > 0 && paymentCompleted && paymentData) {
        formDataToSend.append('transactionId', paymentData.paymentId);
        formDataToSend.append('razorpayOrderId', paymentData.orderId);
        formDataToSend.append('razorpayPaymentId', paymentData.paymentId);
        console.log('Razorpay payment info added - Payment ID:', paymentData.paymentId);
      }
      
      // Finalizing registration
      setLoadingMessage('Finalizing your registration...');
      setLoadingMessage('Finalizing your registration...');
      
      // Submit to backend API
      const response = await registrationsService.submitRegistration(formDataToSend);
      
      if (response.success) {
        setLoadingMessage('Registration successful!');
        setRegistrationSuccess(true);
        setRegistrationData(response.data);
        
        toast.success('Thank you for registering! You will receive more information via email shortly.', {
          duration: 5000,
          icon: '✅'
        });
        
        // Refresh events to update currentRegistrations count
        await refreshEvents();
        
        // Auto-download receipt
        setLoadingMessage('Generating receipt...');
        try {
          const { downloadReceipt } = await import('../../utils/receiptGenerator');
          downloadReceipt(response.data, event);
          console.log('Receipt auto-downloaded successfully');
        } catch (error) {
          console.error('Failed to auto-download receipt:', error);
          // Don't block the flow if receipt download fails
        }
        
        setLoadingMessage('');
        // Don't close modal immediately - show success message with download button
        // onClose();
      } else {
        // Backend returned error in response
        toast.error(response.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        setLoadingMessage('');
        return;
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', error ? Object.keys(error) : 'null');
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Show specific error message from backend
      let errorMessage = 'Failed to submit registration. Please try again.';
      
      // Backend error response format: { success: false, message: "error text", errors: [...] }
      // Axios wraps errors, so check response.data first
      const errorData = error?.response?.data || error;
      
      console.log('Extracted error data:', errorData);
      
      if (errorData?.message) {
        // Direct error message from backend
        errorMessage = errorData.message;
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Validation errors array
        console.error('Validation errors:', errorData.errors);
        errorMessage = errorData.errors.map(e => `${e.field || e.path || 'Field'}: ${e.message || e.msg}`).join(', ');
      } else if (errorData?.error) {
        // Generic error field
        errorMessage = errorData.error;
      } else if (error?.message) {
        // Axios error message
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // String error
        errorMessage = error;
      }
      
      console.log('Final error message to show:', errorMessage);
      
      // Show error toast with longer duration for important messages
      toast.error(errorMessage, { 
        duration: 8000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '❌'
      });
      
      setIsSubmitting(false);
      setLoadingMessage('');
      
      // Don't close modal or proceed - stay on current step so user can fix the issue
      return;
    }
  };

  const isTeamEvent = event?.participationType === 'team';
  const maxTeamSize = event?.maxTeamSize && event.maxTeamSize > 0 ? event.maxTeamSize : 4;
  
  // Debug log
  console.log('Event data for registration modal:', { 
    eventId: event?._id,
    title: event?.title,
    participationType: event?.participationType, 
    maxTeamSize: event?.maxTeamSize,
    minTeamSize: event?.minTeamSize,
    calculatedMaxTeamSize: maxTeamSize,
    isTeamEvent,
    teamMembersToShow: maxTeamSize - 1
  });

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
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
          className="registration-modal-content relative w-full max-w-4xl max-h-[80vh] overflow-y-auto glass-panel rounded-xl md:rounded-2xl border border-white/20 shadow-2xl mx-2 md:mx-0 z-10 mt-24 mb-6"
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
                        Phone Number * (10 digits)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.teamLeader.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only digits
                          if (value.length <= 10) {
                            handleInputChange({ target: { name: 'phone', value } }, 'teamLeader');
                          }
                        }}
                        required
                        pattern="[0-9]{10}"
                        minLength="10"
                        maxLength="10"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter 10 digit phone number"
                      />
                      {formData.teamLeader.phone && formData.teamLeader.phone.length !== 10 && (
                        <p className="text-red-400 text-xs mt-1">Phone number must be exactly 10 digits</p>
                      )}
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
                      <input
                        type="text"
                        name="branch"
                        value={formData.teamLeader.branch}
                        onChange={(e) => handleInputChange(e, 'teamLeader')}
                        required
                        placeholder="e.g., B.Tech (CSE), M.Tech (IT)"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          <div>
                            <input
                              type="tel"
                              name="phone"
                              value={member.phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Only digits
                                if (value.length <= 10) {
                                  handleInputChange({ target: { name: 'phone', value } }, 'teamMembers', index);
                                }
                              }}
                              pattern="[0-9]{10}"
                              minLength="10"
                              maxLength="10"
                              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm w-full"
                              placeholder="Phone (10 digits)"
                            />
                            {member.phone && member.phone.length > 0 && member.phone.length !== 10 && (
                              <p className="text-red-400 text-xs mt-1">Must be 10 digits</p>
                            )}
                          </div>
                          <input
                            type="text"
                            name="college"
                            value={member.college}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="College Name"
                          />
                          <input
                            type="text"
                            name="branch"
                            value={member.branch}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Branch (e.g., B.Tech CSE)"
                          />
                          <input
                            type="text"
                            name="semester"
                            value={member.semester}
                            onChange={(e) => handleInputChange(e, 'teamMembers', index)}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Semester (e.g., 5th Sem)"
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
                
                <div className="glass-panel p-6 rounded-xl text-center space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Entry Fee</h4>
                    <div className="text-4xl font-bold text-green-400">₹{event.entryFee}</div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Complete Payment to Continue
                    </h4>
                    
                    {paymentCompleted ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-center space-x-3 text-green-400 mb-4">
                          <CheckCircle className="w-8 h-8" />
                          <span className="text-xl font-semibold">Payment Successful!</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Payment ID: {paymentData?.paymentId}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          Amount: ₹{paymentData?.amount} • Method: {paymentData?.method}
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          disabled={!razorpayKeyId || loadingMessage}
                          className="w-full max-w-md mx-auto py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
                        >
                          {loadingMessage ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{loadingMessage}</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-6 h-6" />
                              <span>Pay Now with Razorpay</span>
                            </>
                          )}
                        </button>
                        
                        <div className="mt-6 space-y-2">
                          <p className="text-gray-400 text-sm">
                            Secure payment via Razorpay
                          </p>
                          <p className="text-gray-500 text-xs">
                            Supports UPI, Cards, NetBanking, and Wallets
                          </p>
                        </div>

                        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-blue-400 text-sm text-left">
                              <p className="font-medium mb-1">Payment Instructions:</p>
                              <ul className="space-y-1 text-xs">
                                <li>• Click "Pay Now" to open Razorpay payment gateway</li>
                                <li>• Choose your preferred payment method (UPI/Card/NetBanking)</li>
                                <li>• Complete the payment securely</li>
                                <li>• Payment will be verified automatically</li>
                                <li>• You'll be redirected to confirmation page</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === totalSteps && (
              <div className="modal-form-section space-y-6">
                {registrationSuccess ? (
                  // Success State - Show after successful registration
                  <>
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-12 h-12 text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Registration Successful!</h3>
                      <p className="text-gray-300 text-lg">
                        Your registration has been submitted successfully.
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4 text-center">Registration Details</h4>
                      
                      {registrationData?.uniqueRegistrationId && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                          <p className="text-gray-400 text-sm mb-2">Registration ID</p>
                          <p className="text-2xl font-bold text-blue-400 tracking-wider">
                            {registrationData.uniqueRegistrationId}
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Event:</span>
                          <span className="text-white ml-2 font-medium">{event?.title}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white ml-2 font-medium">{registrationData?.fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white ml-2 font-medium">{registrationData?.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className="text-yellow-400 ml-2 font-medium">
                            {event?.entryFee > 0 ? 'Pending Verification' : 'Approved'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="text-green-400 text-sm">
                          <p className="font-medium mb-1">What's Next?</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Check your email for confirmation and further details</li>
                            <li>• Save your Registration ID for future reference</li>
                            <li>• Download your receipt using the button below</li>
                            {event?.entryFee > 0 && (
                              <li>• Payment will be verified within 24-48 hours</li>
                            )}
                            <li>• Bring valid ID proof on event day</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Download Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  // Confirmation State - Show before submission
                  <>
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
                  </>
                )}
              </div>
            )}

            {!registrationSuccess && (
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
                        <span className="text-sm md:text-base">{loadingMessage || 'Processing...'}</span>
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
            )}
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;