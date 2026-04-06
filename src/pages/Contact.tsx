import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Facebook, MapPin, Send, Loader2, Clock, CheckCircle } from 'lucide-react';

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
    <div className="min-h-screen bg-[#050505] text-white pt-40 pb-24 relative overflow-hidden">
      {/* Aesthetic Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-6 text-gold">
            <div className="h-[1px] w-8 bg-gold/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Inquiries</span>
            <div className="h-[1px] w-8 bg-gold/40" />
          </div>
          <h1 className="text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-6">
            Get In <span className="italic text-gold">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed italic font-playfair text-lg">
            "Every masterpiece begins with a conversation. Let's start yours today."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* --- CONTACT INFO --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-8">Studio Channels</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Mail, label: 'Digital Mail', value: 'juancapture1@gmail.com', href: 'mailto:juancapture1@gmail.com' },
                  { icon: Phone, label: 'Direct Line', value: '+63 992 218 3874', href: 'tel:+639922183874' },
                  { icon: MapPin, label: 'Our Homebase', value: 'Balingasag, Misamis Oriental, PH', href: '#' },
                  { icon: Facebook, label: 'Social Presence', value: 'Juan Captures Official', href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                ].map((item, i) => (
                  <div key={i} className="glass-strong p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-gold/30 transition-all duration-500">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{item.label}</p>
                      <a href={item.href} className="text-sm font-bold text-white group-hover:text-gold transition-colors tracking-tight">{item.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Clock size={80} />
               </div>
               <h3 className="text-lg font-playfair font-bold text-white mb-6 flex items-center gap-2">
                 <Clock size={18} className="text-gold" /> Studio Hours
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                    <span className="text-gray-500">Weekdays</span>
                    <span>9:00 AM — 6:00 PM</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                    <span className="text-gray-500">Saturdays</span>
                    <span>10:00 AM — 4:00 PM</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gold">
                    <span className="font-black">Sundays</span>
                    <span className="italic">By Appointment</span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* --- CONTACT FORM --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="glass-strong p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
              <h2 className="text-3xl font-playfair font-bold text-white mb-10 tracking-tight">Send a <span className="italic text-gold">Message</span></h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Your Identity</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Contact Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 000 000 0000"
                    className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">The Inquiry</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your upcoming event or project vision..."
                    className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-medium text-sm resize-none leading-relaxed"
                  />
                </div>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gold/10 border border-gold/30 text-gold px-6 py-4 rounded-2xl flex items-center gap-3 italic font-bold text-xs uppercase tracking-widest"
                    >
                      <CheckCircle size={18} /> Message delivered successfully.
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all duration-500 hover:bg-gold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span>Dispatch Message</span>
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
