import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Users, Globe, Sparkles, Zap, Heart, Star, CheckCircle, AlertCircle, Loader2, ArrowRight, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEST_INFO } from '../constants';
import { fadeInUp, staggerContainer, scaleUp, slideInLeft, slideInRight, fadeIn } from '../lib/animations';
import toast from 'react-hot-toast';
import LightweightBackground from '../components/backgrounds/LightweightBackground';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Real-time form validation
  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = { ...formErrors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'subject':
        if (!value) {
          errors.subject = 'Please select a subject';
        } else {
          delete errors.subject;
        }
        break;
      case 'message':
        if (!value.trim()) {
          errors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          errors.message = 'Message must be at least 10 characters';
        } else {
          delete errors.message;
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.keys(formData).every(key => 
      validateField(key, formData[key as keyof typeof formData])
    );
    
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setFormErrors({});
      
      // Hide success animation after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    validateField(name, value);
  };

  return (
    <div className="min-h-screen pt-20 bg-navy-950 relative overflow-hidden">
      {/* Premium Animated Background */}
      <LightweightBackground />

      {/* Interactive Mouse Follower */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, null],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-2xl text-white text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={64} className="mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-green-100">We'll get back to you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.section 
        className="py-20 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 font-medium mb-6">
                Get in Touch
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight"
            >
              Contact 
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Tech Fest 2026
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              Have questions about Tech Fest 2026? We're here to help! 
              Reach out to us through any of the channels below or send us a message.
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">24h</div>
                <div className="text-gray-400 text-sm">Response Time</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">5+</div>
                <div className="text-gray-400 text-sm">Channels</div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Content */}
      <motion.section 
        className="pb-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div variants={slideInLeft}>
              <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                    Get in 
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Touch</span>
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    We're here to help make your Tech Fest 2026 experience amazing. 
                    Choose your preferred way to connect with us.
                  </p>

                  <div className="space-y-6 mb-12">
                    <motion.div 
                      className="glass-panel p-6 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden cursor-pointer"
                      whileHover={{ y: -2, rotateY: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ padding: '1px' }}
                      >
                        <div className="w-full h-full bg-navy-900/90 rounded-xl" />
                      </motion.div>
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <motion.div 
                          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Phone className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">Phone</h3>
                          <div className="space-y-1">
                            {FEST_INFO.contact.phone.map((phone, index) => (
                              <motion.p 
                                key={phone}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <a
                                  href={`tel:+91${phone}`}
                                  className="text-gray-300 hover:text-white transition-colors duration-200 font-mono hover:underline"
                                >
                                  +91 {phone}
                                </a>
                              </motion.p>
                            ))}
                          </div>
                          <motion.p 
                            className="text-gray-500 text-sm mt-2 flex items-center"
                            whileHover={{ x: 5 }}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Available 9:00 AM - 6:00 PM (Mon-Sat)
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="glass-panel p-6 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden cursor-pointer"
                      whileHover={{ y: -2, rotateY: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ padding: '1px' }}
                      >
                        <div className="w-full h-full bg-navy-900/90 rounded-xl" />
                      </motion.div>
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <motion.div 
                          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Mail className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">Email</h3>
                          <motion.a
                            href={`mailto:${FEST_INFO.contact.email}`}
                            className="text-gray-300 hover:text-white transition-colors duration-200 break-all hover:underline"
                            whileHover={{ x: 5 }}
                          >
                            {FEST_INFO.contact.email}
                          </motion.a>
                          <motion.p 
                            className="text-gray-500 text-sm mt-2 flex items-center"
                            whileHover={{ x: 5 }}
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            We'll respond within 24 hours
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="glass-panel p-6 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ y: -2 }}
                    >
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">Address</h3>
                          <p className="text-gray-300 leading-relaxed mb-3">
                            {FEST_INFO.contact.address}
                          </p>
                          <a
                            href="https://maps.google.com/?q=Shri+Ram+Group+Jabalpur"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 font-medium"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            View on Google Maps →
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="glass-panel p-6 rounded-xl group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ y: -2 }}
                    >
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">Office Hours</h3>
                          <div className="space-y-1 text-gray-300">
                            <p className="flex justify-between">
                              <span>Monday - Friday:</span>
                              <span className="font-mono">9:00 AM - 6:00 PM</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Saturday:</span>
                              <span className="font-mono">9:00 AM - 4:00 PM</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Sunday:</span>
                              <span className="text-red-400 font-mono">Closed</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <motion.h3 
                      className="text-white font-bold text-xl mb-6 flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
                      </motion.div>
                      Follow Us
                    </motion.h3>
                    <div className="grid grid-cols-3 gap-4">
                      <motion.a
                        href={`https://instagram.com/${FEST_INFO.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel p-4 rounded-xl hover:scale-105 transition-all duration-300 group text-center relative overflow-hidden"
                        whileHover={{ y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="relative z-10">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                          >
                            <span className="text-white font-bold">IG</span>
                          </motion.div>
                          <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">Instagram</p>
                        </div>
                      </motion.a>
                      
                      <motion.a
                        href={`https://facebook.com/${FEST_INFO.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel p-4 rounded-xl hover:scale-105 transition-all duration-300 group text-center relative overflow-hidden"
                        whileHover={{ y: -3, rotateZ: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="relative z-10">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: [0, 5, -5, 0] }}
                          >
                            <span className="text-white font-bold">FB</span>
                          </motion.div>
                          <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">Facebook</p>
                        </div>
                      </motion.a>
                      
                      <motion.a
                        href={`https://twitter.com/${FEST_INFO.socialMedia.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel p-4 rounded-xl hover:scale-105 transition-all duration-300 group text-center relative overflow-hidden"
                        whileHover={{ y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="relative z-10">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                          >
                            <span className="text-white font-bold">TW</span>
                          </motion.div>
                          <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">Twitter</p>
                        </div>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={slideInRight}>
              <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                    Send us a 
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Message</span>
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Fill out the form below and we'll get back to you as soon as possible. 
                    We're excited to hear from you!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <motion.div
                        className="group relative"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <label className="block text-white font-medium mb-2">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-white/30 ${
                              formErrors.name 
                                ? 'border-red-500 focus:ring-red-500' 
                                : formData.name && !formErrors.name
                                ? 'border-green-500 focus:ring-green-500'
                                : 'border-white/20 focus:ring-blue-500'
                            }`}
                            placeholder="Your full name"
                          />
                          {formData.name && !formErrors.name && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle size={20} className="text-green-500" />
                            </motion.div>
                          )}
                        </div>
                        <AnimatePresence>
                          {formErrors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-400 text-sm mt-1 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-1" />
                              {formErrors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      <motion.div
                        className="group relative"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <label className="block text-white font-medium mb-2">Phone</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-white/30 ${
                              formErrors.phone 
                                ? 'border-red-500 focus:ring-red-500' 
                                : formData.phone && !formErrors.phone
                                ? 'border-green-500 focus:ring-green-500'
                                : 'border-white/20 focus:ring-purple-500'
                            }`}
                            placeholder="Your phone number"
                          />
                          {formData.phone && !formErrors.phone && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle size={20} className="text-green-500" />
                            </motion.div>
                          )}
                        </div>
                        <AnimatePresence>
                          {formErrors.phone && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-400 text-sm mt-1 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-1" />
                              {formErrors.phone}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <motion.div
                      className="group relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label className="block text-white font-medium mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-white/30 ${
                            formErrors.email 
                              ? 'border-red-500 focus:ring-red-500' 
                              : formData.email && !formErrors.email
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-white/20 focus:ring-cyan-500'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {formData.email && !formErrors.email && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle size={20} className="text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {formErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm mt-1 flex items-center"
                          >
                            <AlertCircle size={16} className="mr-1" />
                            {formErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      className="group relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label className="block text-white font-medium mb-2">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 group-hover:border-white/30 ${
                            formErrors.subject 
                              ? 'border-red-500 focus:ring-red-500' 
                              : formData.subject && !formErrors.subject
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-white/20 focus:ring-green-500'
                          }`}
                        >
                          <option value="" className="bg-navy-900 text-gray-300">Select a subject</option>
                          <option value="general" className="bg-navy-900 text-white">General Inquiry</option>
                          <option value="registration" className="bg-navy-900 text-white">Registration Help</option>
                          <option value="technical" className="bg-navy-900 text-white">Technical Support</option>
                          <option value="sponsorship" className="bg-navy-900 text-white">Sponsorship</option>
                          <option value="media" className="bg-navy-900 text-white">Media & Press</option>
                          <option value="other" className="bg-navy-900 text-white">Other</option>
                        </select>
                        {formData.subject && !formErrors.subject && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle size={20} className="text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {formErrors.subject && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm mt-1 flex items-center"
                          >
                            <AlertCircle size={16} className="mr-1" />
                            {formErrors.subject}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      className="group relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label className="block text-white font-medium mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 resize-none group-hover:border-white/30 ${
                            formErrors.message 
                              ? 'border-red-500 focus:ring-red-500' 
                              : formData.message && !formErrors.message
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-white/20 focus:ring-yellow-500'
                          }`}
                          placeholder="Tell us how we can help you..."
                        />
                        {formData.message && !formErrors.message && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute right-3 top-3"
                          >
                            <CheckCircle size={20} className="text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <AnimatePresence>
                          {formErrors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-400 text-sm flex items-center"
                            >
                              <AlertCircle size={16} className="mr-1" />
                              {formErrors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        <span className={`text-sm ${
                          formData.message.length < 10 ? 'text-gray-500' : 
                          formData.message.length < 50 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {formData.message.length}/500
                        </span>
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || Object.keys(formErrors).length > 0}
                      className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group relative overflow-hidden ${
                        isSubmitting || Object.keys(formErrors).length > 0
                          ? 'bg-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                      whileHover={{ scale: isSubmitting || Object.keys(formErrors).length > 0 ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting || Object.keys(formErrors).length > 0 ? 1 : 0.95 }}
                    >
                      {/* Button Background Animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={isSubmitting ? { x: ['-100%', '100%'] } : {}}
                        transition={isSubmitting ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : {}}
                      />
                      
                      <div className="relative z-10 flex items-center space-x-3">
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Sending Message...</span>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles size={16} className="text-yellow-300" />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <Send size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                            <span>Send Message</span>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Heart size={16} className="text-pink-300" />
                            </motion.div>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </motion.button>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-gray-500 text-sm mb-2">
                        By sending this message, you agree to our terms of service and privacy policy.
                      </p>
                      <motion.div
                        className="flex items-center justify-center space-x-2 text-gray-400 text-xs"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MousePointer2 size={14} />
                        <span>Secure & encrypted communication</span>
                        <Sparkles size={14} className="text-yellow-400" />
                      </motion.div>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;