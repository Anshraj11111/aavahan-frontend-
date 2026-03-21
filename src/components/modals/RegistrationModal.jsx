import { useState } from 'react';
import { X, User, Mail, Phone, Users, Upload, QrCode, CheckCircle, AlertCircle, CreditCard, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRegistrations } from '../../contexts/RegistrationContext';

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const { addRegistration } = useRegistrations();
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
    paymentScreenshot: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = event?.entryFee > 0 ? 3 : 2;

  const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    
    if (section === 'teamLeader') {
      setFormData(prev => ({
        ...prev,
        teamLeader: {
          ...prev.teamLeader,
          [name]: value
        }
      }));
    } else if (section === 'teamMembers' && index !== null) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map((member, i) => 
          i === index ? { ...member, [name]: value } : member
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        paymentScreenshot: file
      }));
      toast.success('Payment screenshot uploaded successfully!');
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
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        paymentScreenshot: formData.paymentScreenshot?.name || null
      };

      // Add registration to context
      const newRegistration = addRegistration(registrationData);
      
      console.log('Registration submitted:', newRegistration);
      toast.success('Registration submitted successfully! You will receive a confirmation email shortly.');
      onClose();
    } catch (error) {
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeamEvent = event?.participationType === 'team';
  const maxTeamSize = event?.maxTeamSize || 4;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/20 shadow-2xl"
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
            {currentStep === 1 && (
              <div className="space-y-6">
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

            {currentStep === 2 && event?.entryFee > 0 && (
              <div className="space-y-6">
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
                    <div className="bg-white p-4 rounded-xl inline-block">
                      {(() => {
                        const adminSettings = JSON.parse(localStorage.getItem('admin-settings') || '{}');
                        const upiId = adminSettings.paymentQR?.upiId || 'techfest2026@paytm';
                        const merchantName = adminSettings.paymentQR?.merchantName || 'Tech Fest 2026';
                        
                        // Generate QR code URL from UPI ID
                        const generateQRCodeUrl = (upiId, merchantName, amount) => {
                          const params = new URLSearchParams({
                            pa: upiId,
                            pn: merchantName,
                            cu: 'INR',
                            am: amount.toString()
                          });
                          const upiString = `upi://pay?${params.toString()}`;
                          return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
                        };
                        
                        const qrCodeUrl = generateQRCodeUrl(upiId, merchantName, event.entryFee);
                        
                        return (
                          <img
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            className="w-48 h-48 object-contain"
                            onError={(e) => {
                              // Fallback to generic QR if API fails
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBWMTMwTTcwIDEwMEgxMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                            }}
                          />
                        );
                      })()}
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      {(() => {
                        const adminSettings = JSON.parse(localStorage.getItem('admin-settings') || '{}');
                        const upiId = adminSettings.paymentQR?.upiId || 'techfest2026@paytm';
                        const phone = adminSettings.paymentQR?.phoneNumber || '9876543210';
                        return `UPI ID: ${upiId} | Phone: ${phone}`;
                      })()}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                      <Upload className="w-5 h-5 mr-2 text-purple-400" />
                      Upload Payment Screenshot
                    </h4>
                    
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
                              <p className="text-white font-medium">Click to upload screenshot</p>
                              <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === totalSteps && (
              <div className="space-y-6">
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
                      <div>
                        <span className="text-gray-400">Entry Fee:</span>
                        <span className="text-green-400 ml-2 font-medium">₹{event.entryFee}</span>
                      </div>
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
                        <li>• Payment verification may take 24-48 hours</li>
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
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
    </AnimatePresence>
  );
};

export default RegistrationModal;