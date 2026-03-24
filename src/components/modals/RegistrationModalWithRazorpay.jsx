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
  
  // Calculate total steps: 1=Info, 2=Payment (if paid), 3=Confirm
  const totalSteps = useMemo(() => {
    return event?.entryFee > 0 ? 3 : 2;
  }, [event?.entryFee]);

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

  // Scroll management
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.style.overflow = 'hidden';
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
      
      // Create Razorpay order
      const orderResponse = await razorpayService.createOrder(
        event.entryFee,
        event._id,
        event.title
      );

      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, amount, currency } = orderResponse.data;

      // Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'Aavhaan 2026',
        description: event.title,
        order_id: orderId,
        handler: async function (response) {
          // Payment successful - verify it
          try {
            setLoadingMessage('Verifying payment...');
            
            const verifyResponse = await razorpayService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyResponse.success && verifyResponse.verified) {
              // Payment verified successfully
              setPaymentCompleted(true);
              setPaymentData(verifyResponse.data);
              setLoadingMessage('');
              
              toast.success('Payment successful! Proceeding to confirmation...', {
                duration: 3000,
                icon: '✅'
              });

              // Move to next step
              setTimeout(() => {
                setCurrentStep(currentStep + 1);
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
      
      // Open Razorpay checkout
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
          toast.error(result.message || 'This team name is already taken for this event.', {
            duration: 8000,
            style: {
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
            },
            icon: '❌'
          });
          return;
        }
      } catch (error) {
        console.error('Team name check failed:', error);
      }
    }
    
    // For free events or after payment, just move forward
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
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
    
    // Validate phone number
    if (formData.teamLeader.phone.length !== 10) {
      toast.error('Team leader phone number must be exactly 10 digits', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          fontSize: '14px',
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
            },
            icon: '❌'
          });
          return;
        }
      }
    }
    
    setIsSubmitting(true);

    try {
      setLoadingMessage('Preparing registration data...');
      
      // Prepare FormData
      const formDataToSend = new FormData();
      
      // Basic info
      formDataToSend.append('fullName', formData.teamLeader.fullName);
      formDataToSend.append('email', formData.teamLeader.email);
      formDataToSend.append('phone', formData.teamLeader.phone);
      formDataToSend.append('instituteName', formData.teamLeader.college);
      formDataToSend.append('department', formData.teamLeader.branch);
      formDataToSend.append('yearOrSemester', formData.teamLeader.semester);
      formDataToSend.append('eventId', event._id);
      
      // Team info (if team event)
      if (event?.participationType === 'team') {
        formDataToSend.append('teamName', formData.teamName);
        
        const validMembers = formData.teamMembers.filter(member => member.fullName.trim() !== '');
        const teamMembersData = validMembers.map(member => ({
          name: member.fullName,
          email: member.email || '',
          phone: member.phone || '',
          college: member.college || formData.teamLeader.college
        }));
        
        formDataToSend.append('teamMembers', JSON.stringify(teamMembersData));
      }
      
      // Payment info (if paid event and payment completed)
      if (event?.entryFee > 0 && paymentCompleted && paymentData) {
        formDataToSend.append('transactionId', paymentData.paymentId);
        formDataToSend.append('razorpayOrderId', paymentData.orderId);
        formDataToSend.append('razorpayPaymentId', paymentData.paymentId);
      }
      
      setLoadingMessage('Finalizing your registration...');
      
      // Submit to backend
      const response = await registrationsService.submitRegistration(formDataToSend);
      
      if (response.success) {
        setLoadingMessage('Registration successful!');
        setRegistrationSuccess(true);
        setRegistrationData(response.data);
        
        toast.success('Thank you for registering! You will receive confirmation via email.', {
          duration: 5000,
          icon: '✅'
        });
        
        await refreshEvents();
        
        // Auto-download receipt
        setLoadingMessage('Generating receipt...');
        try {
          const { downloadReceipt } = await import('../../utils/receiptGenerator');
          downloadReceipt(response.data, event);
        } catch (error) {
          console.error('Failed to auto-download receipt:', error);
        }
        
        setLoadingMessage('');
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        setLoadingMessage('');
        return;
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to submit registration. Please try again.';
      const errorData = error?.response?.data || error;
      
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map(e => `${e.field || e.path || 'Field'}: ${e.message || e.msg}`).join(', ');
      }
      
      toast.error(errorMessage, { 
        duration: 8000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          fontSize: '14px',
        },
        icon: '❌'
      });
      
      setIsSubmitting(false);
      setLoadingMessage('');
      return;
    }
  };

  const isTeamEvent = event?.participationType === 'team';
  const maxTeamSize = event?.maxTeamSize && event.maxTeamSize > 0 ? event.maxTeamSize : 4;

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
