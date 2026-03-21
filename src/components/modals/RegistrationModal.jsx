import { useState, useEffect, useRef, useMemo } from 'react';
import { X, User, Users, Upload, QrCode, CheckCircle, AlertCircle, CreditCard, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRegistrations } from '../../contexts/RegistrationContext';
import { paymentService } from '../../services/payment';

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const { addRegistration } = useRegistrations();
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
    transactionId: '',
    extractedOcrText: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = event?.entryFee > 0 ? 3 : 2;

  // Fetch payment config from backend
  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        const response = await paymentService.getPaymentConfig();
        if (response.success && response.data?.config) {
          setPaymentConfig(response.data.config);
          console.log('Payment config loaded:', response.data.config);
        }
      } catch (error) {
        console.error('Failed to fetch payment config:', error);
      }
    };

    if (isOpen && event?.entryFee > 0) {
      fetchPaymentConfig();
    }
  }, [isOpen, event?.entryFee]);

  // Memoize QR code URL to prevent regeneration on every render
  const qrCodeUrl = useMemo(() => {
    if (!event?.entryFee || !paymentConfig) return '';
    
    try {
      const upiId = paymentConfig.upiId || '8839076135@ybl';
      const merchantName = paymentConfig.payeeName || 'Aavhaan 2026';
      
      // Create UPI payment string
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&cu=INR&am=${event.entryFee}`;
      
      // Use QR code API with proper encoding
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&format=png`;
      
      console.log('QR Code URL generated:', qrUrl);
      console.log('UPI String:', upiString);
      
      return qrUrl;
    } catch (error) {
      console.error('QR code generation error:', error);
      return '';
    }
  }, [event?.entryFee, paymentConfig]);

  const upiDetails = useMemo(() => {
    if (!paymentConfig) {
      return {
        upiId: '8839076135@ybl',
        phone: '8839076135'
      };
    }
    return {
      upiId: paymentConfig.upiId || '8839076135@ybl',
      phone: paymentConfig.upiId?.split('@')[0] || '8839076135'
    };
  }, [paymentConfig]);

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
        transactionId: '',
        extractedOcrText: ''
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
      e.target.value = ''; // Reset input
      return;
    }
    
    // Immediately set the file
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file,
      extractedOcrText: '' // Will be populated by OCR
    }));
    
    toast.success('Payment screenshot uploaded!');
    
    // Run OCR in background (non-blocking)
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Image = event.target.result.split(',')[1];
          
          const formData = new FormData();
          formData.append('base64Image', base64Image);
          formData.append('language', 'eng');
          formData.append('isOverlayRequired', 'false');
          
          const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
              'apikey': 'K87899142388957'
            },
            body: formData
          });
          
          const ocrData = await ocrResponse.json();
          
          if (!ocrData.IsErroredOnProcessing && ocrData.ParsedResults?.[0]?.ParsedText) {
            const extractedText = ocrData.ParsedResults[0].ParsedText;
            setFormData(prev => ({
              ...prev,
              extractedOcrText: extractedText
            }));
            console.log('OCR extracted text:', extractedText);
          }
        } catch (error) {
          console.error('OCR Error:', error);
          // OCR failure doesn't block upload
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      // File read error doesn't block upload
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for paid events - STRICT ENFORCEMENT
    if (event?.entryFee > 0) {
      if (!formData.transactionId || !formData.transactionId.trim()) {
        toast.error('Transaction ID is required. Please enter your transaction ID to proceed.');
        setIsSubmitting(false);
        return;
      }
      if (!formData.paymentScreenshot) {
        toast.error('Payment screenshot is required. Please upload your payment screenshot.');
        setIsSubmitting(false);
        return;
      }
      
      // Verify transaction ID matches the screenshot (OCR validation)
      if (formData.extractedOcrText) {
        const enteredId = formData.transactionId.trim().toLowerCase();
        const extractedText = formData.extractedOcrText.toLowerCase();
        
        // Check if the entered transaction ID exists in the extracted text
        if (!extractedText.includes(enteredId)) {
          toast.error('Transaction ID does not match the payment screenshot. Please verify and try again.');
          setIsSubmitting(false);
          return;
        }
      }
    }
    
    setIsSubmitting(true);

    try {
      
      // Prepare registration data for context
      const registrationData = {
        fullName: formData.teamLeader.fullName,
        email: formData.teamLeader.email,
        phone: formData.teamLeader.phone,
        instituteName: formData.teamLeader.college,
        department: formData.teamLeader.branch,
        yearOrSemester: formData.teamLeader.semester,
        city: 'Not specified', // Could be added to form later
        eventTitle: event?.title,
        eventDay: event?.day,
        participationType: event?.participationType === 'team' ? 'team' : 'solo',
        teamName: formData.teamName || null,
        teamMembers: formData.teamMembers
          .filter(member => member.fullName.trim() !== '')
          .map(member => ({
            name: member.fullName,
            email: member.email,
            phone: member.phone
          })),
        amountExpected: event?.entryFee || 0,
        amountPaid: event?.entryFee || 0,
        paymentScreenshot: formData.paymentScreenshot?.name || null,
        transactionId: formData.transactionId
      };

      // Add registration to context
      const newRegistration = addRegistration(registrationData);
      
      console.log('Registration submitted:', newRegistration);
      
      // Show success message based on payment verification
      if (newRegistration.paymentStatus === 'paid') {
        toast.success('Registration submitted and payment automatically verified! You will receive a confirmation email shortly.');
      } else {
        toast.success('Registration submitted successfully! Payment verification may take 24-48 hours.');
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeamEvent = event?.participationType === 'team';
  const maxTeamSize = event?.maxTeamSize || 4;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="modal-backdrop absolute inset-0 bg-black/80"
          onClick={onClose}
        />

        <motion.div
          ref={modalContentRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="registration-modal-content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-400" />
                Event Registration
              </h2>
              {event && (
                <p className="text-gray-400 mt-1 text-lg">{event.title}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
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
                
                <div className="glass-panel p-6 rounded-xl text-center">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-white mb-2">Entry Fee</h4>
                    <div className="text-3xl font-bold text-green-400">₹{event.entryFee}</div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                      <QrCode className="w-5 h-5 mr-2 text-blue-400" />
                      Scan QR Code to Pay
                    </h4>
                    <div className="bg-white p-4 rounded-xl inline-block relative qr-code-container">
                      {!qrLoaded && qrCodeUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl z-10">
                          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                      )}
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Payment QR Code"
                          className="w-56 h-56 object-contain"
                          onLoad={() => {
                            console.log('QR code loaded successfully');
                            setQrLoaded(true);
                          }}
                          onError={(e) => {
                            console.error('QR code load error');
                            setQrLoaded(true);
                            // Show fallback icon instead
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.qr-fallback').style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="qr-fallback w-56 h-56 hidden items-center justify-center bg-gray-100 rounded">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">QR Code</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      UPI ID: {upiDetails.upiId} | Phone: {upiDetails.phone}
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
                        Enter the transaction ID from your UPI payment app (e.g., 123456789012). This must match your screenshot.
                      </p>
                      {!formData.transactionId && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Transaction ID is mandatory for registration
                        </p>
                      )}
                      {formData.transactionId && formData.extractedOcrText && (
                        formData.extractedOcrText.toLowerCase().includes(formData.transactionId.trim().toLowerCase()) ? (
                          <p className="text-green-400 text-sm mt-1 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Transaction ID verified in screenshot
                          </p>
                        ) : (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Transaction ID not found in screenshot. Please verify.
                          </p>
                        )
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