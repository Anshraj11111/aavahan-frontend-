import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { FEST_INFO } from '../constants';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Have questions about Tech Fest 2026? We're here to help! 
              Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-8">
                Get in Touch
              </h2>

              <div className="space-y-6 mb-12">
                <div className="glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">Phone</h3>
                      <div className="space-y-1">
                        {FEST_INFO.contact.phone.map((phone) => (
                          <p key={phone}>
                            <a
                              href={`tel:+91${phone}`}
                              className="text-white/80 hover:text-white transition-colors duration-200"
                            >
                              +91 {phone}
                            </a>
                          </p>
                        ))}
                      </div>
                      <p className="text-white/60 text-sm mt-2">
                        Available 9:00 AM - 6:00 PM (Mon-Sat)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">Email</h3>
                      <a
                        href={`mailto:${FEST_INFO.contact.email}`}
                        className="text-white/80 hover:text-white transition-colors duration-200"
                      >
                        {FEST_INFO.contact.email}
                      </a>
                      <p className="text-white/60 text-sm mt-2">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">Address</h3>
                      <p className="text-white/80 leading-relaxed">
                        {FEST_INFO.contact.address}
                      </p>
                      <a
                        href="https://maps.google.com/?q=Shri+Ram+Group+Jabalpur"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm transition-colors duration-200 inline-block mt-2"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">Office Hours</h3>
                      <div className="space-y-1 text-white/80">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/sriramgroup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <span className="text-white font-bold">IG</span>
                  </a>
                  <a
                    href="https://facebook.com/SriRamGroupJabalpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <span className="text-white font-bold">FB</span>
                  </a>
                  <a
                    href="https://wa.me/919755042292"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <span className="text-white font-bold">WA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="form-label text-white">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="form-label text-white">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label text-white">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label className="form-label text-white">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="registration">Registration Help</option>
                    <option value="technical">Technical Support</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="media">Media & Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label className="form-label text-white">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-input resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;