import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Facebook, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
            Get In Touch
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a question or want to discuss your project? We'd love to hear
            from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-white mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="glass-strong p-6 rounded-lg flex items-start space-x-4">
                <Mail className="text-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:info@juancaptures.com"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    juancapture1@gmail.com
                  </a>
                </div>
              </div>

              <div className="glass-strong p-6 rounded-lg flex items-start space-x-4">
                <Phone className="text-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    +639922183874
                  </a>
                </div>
              </div>

              <div className="glass-strong p-6 rounded-lg flex items-start space-x-4">
                <MapPin className="text-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-gray-400">
                    Balingasag Misamis Oriental Philippines
                  </p>
                </div>
              </div>

              <div className="glass-strong p-6 rounded-lg flex items-start space-x-4">
                <Facebook className="text-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Social Media</h3>
                  <a
                    href="https://www.facebook.com/share/18iZ3mAZ2Q/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    Follow us on Facebook
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 glass p-6 rounded-lg">
              <h3 className="text-xl font-playfair font-semibold text-white mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: By Appointment</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-strong p-8 rounded-lg">
              <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="+1 (234) 567-890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark" />
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};
