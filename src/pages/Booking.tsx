import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Booking as BookingType } from '../types';

export const Booking = () => {
  const [formData, setFormData] = useState<BookingType>({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const eventTypes = [
    'Wedding',
    'Birthday Party',
    'Corporate Event',
    'Portrait Session',
    'Engagement',
    'Anniversary',
    'Graduation',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          event_type: formData.event_type,
          event_date: formData.event_date,
          message: formData.message,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        message: '',
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date().toISOString().split('T')[0];

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
            Book Your Session
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to capture your special moments? Fill out the form below and
            we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-strong p-8 md:p-12 rounded-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-white mb-2">
                    Phone Number
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
                  <label htmlFor="event_type" className="block text-white mb-2">
                    Event Type *
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="" className="bg-dark-100">
                      Select an event type
                    </option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type} className="bg-dark-100">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="event_date" className="block text-white mb-2">
                  <Calendar className="inline mr-2" size={20} />
                  Event Date *
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white mb-2">
                  Additional Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Tell us more about your event, your vision, any special requirements..."
                />
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg"
                >
                  <strong>Success!</strong> Your booking request has been
                  submitted. We'll contact you within 24 hours to confirm the
                  details.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg"
                >
                  <strong>Error!</strong> Something went wrong. Please try again
                  or contact us directly.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Booking Request</span>
                  </>
                )}
              </button>

              <p className="text-gray-400 text-sm text-center">
                By submitting this form, you agree to be contacted regarding your
                booking request.
              </p>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Quick Response',
                description: 'We respond to all inquiries within 24 hours',
              },
              {
                title: 'Flexible Packages',
                description: 'Customizable options to fit your budget and needs',
              },
              {
                title: 'Professional Service',
                description: 'Experience and quality you can trust',
              },
            ].map((item) => (
              <div key={item.title} className="glass p-6 rounded-lg text-center">
                <h3 className="text-lg font-playfair font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
