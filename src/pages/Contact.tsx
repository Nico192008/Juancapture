import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Facebook, MapPin, Send, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
      // Simulate API call - Replace with your actual contact logic if needed
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 md:pt-40 pb-20 relative overflow-hidden">
      {/* Aesthetic Orbs - Responsive Blur */}
      <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gold/5 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-gold">
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Inquiries</span>
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
            Get In <span className="italic text-gold">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed italic font-playfair text-base md:text-lg px-4">
            "Every masterpiece begins with a conversation. Let's start yours today."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* --- CONTACT INFO --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-6 md:mb-8 text-center lg:text-left">Studio Channels</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Mail, label: 'Digital Mail', value: 'juancapture1@gmail.com', href: 'mailto:juancapture1@gmail.com' },
                  { icon: Phone, label: 'Direct Line', value: '+63 992 218 3874', href: 'tel:+639922183874' },
                  { icon: MapPin, label: 'Our Homebase', value: 'Balingasag, Misamis Oriental, PH', href: '#' },
                  { icon: Facebook, label: 'Social Presence', value: 'Juan Captures Official', href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                ].map((item, i) => (
                  <div key={i} className="glass-strong p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex items-center gap-4 md:gap-6 group hover:border-gold/30 transition-all duration-500 bg-white/[0.02]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-gold/5">
                      <item.icon size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5 md:mb-1">{item.label}</p>
                      <a href={item.href} className="text-xs md:text-sm font-bold text-white group-hover:text-gold transition-colors tracking-tight block truncate">{item.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="glass-strong p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group bg-white/[0.01]">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Clock size={60} />
               </div>
               <h3 className="text-base md:text-lg font-playfair font-bold text-white mb-5 md:mb-6 flex items-center gap-2">
                 <Clock size={16} className="text-gold" /> Studio Hours
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                    <span className="text-gray-500">Weekdays</span>
                    <span>9:00 AM — 6:00 PM</span>
                 </div>
                 <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                    <span className="text-gray-500">Saturdays</span>
                    <span>10:00 AM — 4:00 PM</span>
                 </div>
                 <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-gold">
                    <span className="font-black">Sundays</span>
                    <span className="italic">By Appointment</span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* --- CONTACT FORM --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="glass-strong p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl relative bg-white/[0.01] backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-8 md:mb-10 tracking-tight text-center lg:text-left">Send a <span className="italic text-gold">Message</span></h2>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Your Identity</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Full Name"
                      className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Email Address</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="hello@example.com"
                      className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Contact Number (Optional)</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+63 900 000 0000"
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">The Inquiry</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us about your upcoming event or project vision..."
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-medium text-sm resize-none leading-relaxed"
                  />
                </div>

                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className={`px-6 py-4 rounded-xl flex items-center gap-3 border italic font-bold text-[10px] md:text-xs uppercase tracking-widest ${submitStatus === 'success' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                    >
                      {submitStatus === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      {submitStatus === 'success' ? 'Message delivered successfully.' : 'Delivery failed. Try again.'}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* --- PREMIUM GLOW SUBMIT BUTTON --- */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gold blur-[15px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl md:rounded-3xl" />
                  <button
                    type="submit" disabled={isSubmitting}
                    className="relative w-full py-5 md:py-6 bg-white text-black rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] shadow-2xl hover:bg-gold transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Dispatch Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
