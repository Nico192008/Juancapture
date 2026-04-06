import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Send, Loader2, CheckCircle2, AlertCircle, Sparkles, Clock, ShieldCheck } from 'lucide-react';
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

      // Optional: Email Notification Trigger
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-booking-confirmation`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            eventType: formData.event_type,
            eventDate: formData.event_date,
            message: formData.message,
          }),
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', event_type: '', event_date: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 md:pt-40 pb-20 relative overflow-hidden">
      {/* Background Orbs - Adjusted for mobile performance */}
      <div className="absolute top-[-5%] left-[-10%] w-[300px] md:w-[40%] h-[300px] md:h-[40%] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[300px] md:w-[40%] h-[300px] md:h-[40%] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-gold">
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Reservation</span>
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-playfair font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
            Secure Your <span className="italic text-gold">Date</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed text-sm md:text-base px-4">
            Let's turn your vision into a visual legacy. Fill out the details below 
            and aming studio will reach out to you within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl relative bg-white/[0.01] backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              {/* Row 1: Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2.5">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Client Name</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Email Address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              {/* Row 2: Event & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2.5">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Contact Number</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                    placeholder="+63 000 000 0000"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">Nature of Event</label>
                  <div className="relative">
                    <select
                      name="event_type" value={formData.event_type} onChange={handleChange} required
                      className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white focus:outline-none focus:border-gold/50 appearance-none font-bold text-sm cursor-pointer"
                    >
                      <option value="" className="bg-[#0a0a0a]">Select occasion...</option>
                      {eventTypes.map((type) => <option key={type} value={type} className="bg-[#0a0a0a]">{type}</option>)}
                    </select>
                    <Sparkles size={14} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Date */}
              <div className="space-y-2.5">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2 flex items-center gap-2">
                  <Calendar size={14} /> Preferred Session Date
                </label>
                <input
                  type="date" name="event_date" value={formData.event_date} onChange={handleChange} min={today} required
                  className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white focus:outline-none focus:border-gold/50 transition-all font-bold text-sm cursor-pointer invert-calendar-icon"
                />
              </div>

              {/* Row 4: Message */}
              <div className="space-y-2.5">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gold/80 ml-2">The Vision</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange} required rows={4}
                  className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all font-medium text-sm resize-none"
                  placeholder="Tell us about the vibe and specific moments you want us to highlight..."
                />
              </div>

              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`px-6 py-4 rounded-2xl flex items-center gap-3 border ${submitStatus === 'success' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                  >
                    {submitStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                      {submitStatus === 'success' ? 'Success! Request is in the vault.' : 'Action failed. Please verify details.'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- GLOWING SUBMIT BUTTON --- */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold blur-[15px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl" />
                <button
                  type="submit" disabled={isSubmitting}
                  className="relative w-full py-5 md:py-6 bg-white text-black rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] shadow-xl hover:bg-gold transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" size={16} /><span>Processing...</span></div>
                  ) : (
                    <div className="flex items-center justify-center gap-3"><Send size={16} /><span>Submit Reservation</span></div>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Info Cards */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 px-2">
            {[
              { icon: Clock, title: 'Swift Response', desc: 'Confirmations within 24 business hours.' },
              { icon: Sparkles, title: 'Bespoke Art', desc: 'Customizable packages for your vision.' },
              { icon: ShieldCheck, title: 'Secure Date', desc: 'Professional handling to delivery.' },
            ].map((item) => (
              <div key={item.title} className="glass-strong p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 text-center group hover:border-gold/20 transition-all bg-white/[0.02]">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform"><item.icon size={16} /></div>
                <h3 className="text-[10px] md:text-xs font-bold text-white mb-1 uppercase tracking-widest">{item.title}</h3>
                <p className="text-gray-500 text-[10px] md:text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
