import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, Users, CreditCard, FileImage } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { eventsService } from '../../services/events';
import { registrationsService } from '../../services/registrations';
import { RegistrationFormData } from '../../types';
import { DEPARTMENTS, YEAR_SEMESTER_OPTIONS, GENDER_OPTIONS } from '../../constants';

// Validation schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  instituteName: z.string().min(2, 'Institute name is required'),
  department: z.string().min(1, 'Department is required'),
  yearOrSemester: z.string().min(1, 'Year/Semester is required'),
  city: z.string().min(2, 'City is required'),
  gender: z.enum(['male', 'female', 'other']),
});

const teamInfoSchema = z.object({
  participationType: z.enum(['solo', 'team']),
  teamName: z.string().optional(),
  teamMembers: z.array(z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    instituteName: z.string().min(2, 'Institute name is required'),
    department: z.string().min(1, 'Department is required'),
    yearOrSemester: z.string().min(1, 'Year/Semester is required'),
  })).optional(),
});

const paymentSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  paymentScreenshot: z.instanceof(File).optional(),
});

const RegistrationPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  // Fetch event details with optimized caching
  const { data: event, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsService.getEventById(eventId!),
    enabled: !!eventId,
    retry: 1,
    staleTime: 30 * 60 * 1000, // 30 minutes cache (increased from 10)
    gcTime: 60 * 60 * 1000, // Keep in cache for 60 minutes (increased from 15)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  // Form for each step
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      instituteName: formData.instituteName || '',
      department: formData.department || '',
      yearOrSemester: formData.yearOrSemester || '',
      city: formData.city || '',
      gender: formData.gender || undefined,
    },
  });

  const teamForm = useForm<z.infer<typeof teamInfoSchema>>({
    resolver: zodResolver(teamInfoSchema),
    defaultValues: {
      participationType: 'solo',
      teamMembers: [],
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
  });

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // Prepare FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Add all registration fields
      Object.keys(data).forEach(key => {
        if (key === 'teamMembers' && data[key]) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'paymentScreenshot' && paymentFile) {
          formData.append('screenshot', paymentFile);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, String(data[key]));
        }
      });

      return registrationsService.submitRegistration(formData);
    },
    onSuccess: (response) => {
      toast.success('Registration submitted successfully! Check your email for confirmation.');
      navigate('/my-tickets');
    },
    onError: (error: any) => {
      // Handle specific error cases
      if (error.error && error.error.includes('transaction ID')) {
        toast.error('This transaction ID has already been used. Please verify your transaction ID.');
      } else if (error.error && error.error.includes('duplicate')) {
        toast.error('You have already registered for this event.');
      } else {
        toast.error(error.error || 'Registration failed. Please try again.');
      }
    },
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Team Details', icon: Users },
    { id: 3, title: 'Payment', icon: CreditCard },
  ];

  const handleNextStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await personalForm.trigger();
        if (isValid) {
          setFormData(prev => ({ ...prev, ...personalForm.getValues() }));
        }
        break;
      case 2:
        isValid = await teamForm.trigger();
        if (isValid) {
          setFormData(prev => ({ ...prev, ...teamForm.getValues() }));
        }
        break;
      case 3:
        // Validate payment form before submission
        isValid = await paymentForm.trigger();
        if (isValid) {
          handleSubmit();
        }
        return;
    }

    if (isValid) {
      setCurrentStep(prev => prev + 1);
      // Smooth scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    const finalData: RegistrationFormData = {
      ...formData,
      ...personalForm.getValues(),
      ...teamForm.getValues(),
      ...paymentForm.getValues(), // Include transaction ID from payment form
      eventId: eventId!, // Ensure eventId is included
    } as RegistrationFormData;

    registrationMutation.mutate(finalData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      setPaymentFile(file);
      toast.success('Payment screenshot selected');
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-navy-950 via-slate-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-lg">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-navy-950 via-slate-900 to-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Event</h1>
            <p className="text-white/80 mb-6">
              The backend server might not be running. Please check the development guide for setup instructions.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary w-full"
              >
                Retry
              </button>
              <Link to="/events" className="btn-secondary w-full">
                Back to Events
              </Link>
            </div>
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Developer Note:</strong> Run <code>npm run dev</code> in the backend folder to start the API server.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-navy-950 via-slate-900 to-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Link to="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-navy-950 via-slate-900 to-black relative overflow-hidden">
      {/* Lightweight Background - No Heavy Animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Event Details
        </Link>
      </div>

      {/* Header */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Register for {event.title}
            </h1>
            <p className="text-white/80 mb-8">
              Complete the registration process to secure your spot
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'border-primary-400 bg-primary-400/10 text-primary-400'
                        : 'border-white/30 text-white/50'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`ml-3 font-medium ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-xl">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Full Name *</label>
                      <input
                        {...personalForm.register('fullName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter your full name"
                      />
                      {personalForm.formState.errors.fullName && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Email *</label>
                      <input
                        {...personalForm.register('email')}
                        type="email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter your email"
                      />
                      {personalForm.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number *</label>
                      <input
                        {...personalForm.register('phone')}
                        type="tel"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter 10-digit phone number"
                      />
                      {personalForm.formState.errors.phone && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Gender *</label>
                      <select
                        {...personalForm.register('gender')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                      >
                        <option value="">Select Gender</option>
                        {GENDER_OPTIONS.map(option => (
                          <option key={option.value} value={option.value} className="bg-slate-800">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {personalForm.formState.errors.gender && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Institute Name *</label>
                      <input
                        {...personalForm.register('instituteName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter your institute name"
                      />
                      {personalForm.formState.errors.instituteName && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.instituteName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Department *</label>
                      <select
                        {...personalForm.register('department')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept} className="bg-slate-800">
                            {dept}
                          </option>
                        ))}
                      </select>
                      {personalForm.formState.errors.department && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.department.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Year/Semester *</label>
                      <select
                        {...personalForm.register('yearOrSemester')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                      >
                        <option value="">Select Year/Semester</option>
                        {YEAR_SEMESTER_OPTIONS.map(option => (
                          <option key={option} value={option} className="bg-slate-800">
                            {option}
                          </option>
                        ))}
                      </select>
                      {personalForm.formState.errors.yearOrSemester && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.yearOrSemester.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">City *</label>
                      <input
                        {...personalForm.register('city')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter your city"
                      />
                      {personalForm.formState.errors.city && (
                        <p className="text-red-400 text-sm mt-1">
                          {personalForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Team Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Team Details</h2>
                  
                  <div>
                    <label className="block text-white font-medium mb-3">Participation Type *</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => teamForm.setValue('participationType', 'solo')}
                        className={`p-4 rounded-lg border transition-colors ${
                          teamForm.watch('participationType') === 'solo'
                            ? 'border-primary-400 bg-primary-400/10 text-primary-400'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2" />
                        Solo Participation
                      </button>
                      <button
                        type="button"
                        onClick={() => teamForm.setValue('participationType', 'team')}
                        className={`p-4 rounded-lg border transition-colors ${
                          teamForm.watch('participationType') === 'team'
                            ? 'border-primary-400 bg-primary-400/10 text-primary-400'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <Users className="w-6 h-6 mx-auto mb-2" />
                        Team Participation
                      </button>
                    </div>
                  </div>

                  {teamForm.watch('participationType') === 'team' && (
                    <div>
                      <label className="block text-white font-medium mb-2">Team Name *</label>
                      <input
                        {...teamForm.register('teamName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                        placeholder="Enter your team name"
                      />
                    </div>
                  )}

                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Event Information</h3>
                    <div className="space-y-2 text-sm text-white/70">
                      <p><span className="text-white/90">Entry Fee:</span> ₹{event.entryFee}</p>
                      <p><span className="text-white/90">Participation:</span> {event.participationType}</p>
                      {event.participationType === 'team' && (
                        <>
                          <p><span className="text-white/90">Min Team Size:</span> {event.minTeamSize}</p>
                          <p><span className="text-white/90">Max Team Size:</span> {event.maxTeamSize}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
                  
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-medium mb-4">Payment Details</h3>
                    <div className="space-y-3 text-white/80">
                      <p><span className="text-white">Amount to Pay:</span> ₹{event.entryFee}</p>
                      <p><span className="text-white">Event:</span> {event.title}</p>
                      <p><span className="text-white">Participant:</span> {formData.fullName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Transaction ID *</label>
                    <input
                      {...paymentForm.register('transactionId')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                      placeholder="Enter transaction ID (Required)"
                    />
                    {paymentForm.formState.errors.transactionId && (
                      <p className="text-red-400 text-sm mt-1">
                        {paymentForm.formState.errors.transactionId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Payment Screenshot (Optional)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="payment-screenshot"
                      />
                      <label htmlFor="payment-screenshot" className="cursor-pointer">
                        <FileImage className="w-12 h-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 mb-2">
                          {paymentFile ? paymentFile.name : 'Click to upload payment screenshot'}
                        </p>
                        <p className="text-white/50 text-sm">
                          Supports JPEG, PNG, WebP (Max 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      <strong>Important:</strong> Transaction ID is mandatory for registration. Please complete the payment 
                      and enter your transaction ID to proceed. Payment screenshot is optional but recommended for faster verification.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="btn-outline flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={registrationMutation.isPending}
                  className="btn-primary flex items-center"
                >
                  {currentStep === 3 ? (
                    registrationMutation.isPending ? (
                      'Submitting...'
                    ) : (
                      'Submit Registration'
                    )
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;