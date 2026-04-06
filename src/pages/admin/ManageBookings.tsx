import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Send, 
  AlertCircle, 
  XCircle, 
  Phone, 
  ChevronLeft,
  User,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Booking } from '../../types';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const EMAILJS_SERVICE_ID = "service_4n5zlku";
  const EMAILJS_PUBLIC_KEY = "Jb0rUyGCKXb-bMlWt";
  const CONFIRMATION_TEMPLATE_ID = "template_z8t052n";
  const REJECTION_TEMPLATE_ID = "template_8wjwei8";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBookings(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;

      const booking = bookings.find(b => b.id === id);
      if (booking) {
        if (status === 'confirmed') await sendConfirmationEmail(booking);
        else if (status === 'rejected') await sendRejectionEmail(booking);
      }
      fetchBookings();
    } catch (error) {
      alert('Update failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const sanitizeEmail = (email: string) => email.trim().replace(/[^\x20-\x7E]/g, "");

  const sendConfirmationEmail = async (booking: Booking) => {
    try {
      const cleanEmail = sanitizeEmail(booking.email);
      const templateParams = {
        to_name: booking.name,
        to_email: cleanEmail,
        event_type: booking.event_type,
        event_date: new Date(booking.event_date).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        }),
        message: "Your booking has been officially confirmed by Juan Captures. We've reserved the date for you!",
      };
      await emailjs.send(EMAILJS_SERVICE_ID, CONFIRMATION_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('Email failed');
    }
  };

  const sendRejectionEmail = async (booking: Booking) => {
    try {
      const cleanEmail = sanitizeEmail(booking.email);
      const templateParams = {
        to_name: booking.name,
        to_email: cleanEmail,
        event_type: booking.event_type,
        event_date: new Date(booking.event_date).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        }),
        message: "We regret to inform you that we cannot cater your request for this date as we are already fully booked.",
      };
      await emailjs.send(EMAILJS_SERVICE_ID, REJECTION_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('Email failed');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Remove this booking from records?')) return;
    try {
      await supabase.from('bookings').delete().eq('id', id);
      fetchBookings();
    } catch (error) {
      console.error('Delete error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold w-8 h-8" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-bold">Accessing Client Logs</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container-custom pt-32 pb-20 px-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/admin/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-gold transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60">Booking Inquiry System</span>
            </div>
            <h1 className="text-6xl font-playfair font-bold tracking-tighter italic">Schedule</h1>
          </motion.div>

          <div className="glass-strong px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Requests</p>
              <p className="text-2xl font-bold font-mono">{bookings.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">New Pending</p>
              <p className="text-2xl font-bold font-mono">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            const status = (booking.status || 'pending').toLowerCase();
            const statusConfig = {
              pending: { icon: Clock, color: 'text-amber-400', border: 'border-amber-400/20', glow: 'shadow-amber-400/5' },
              confirmed: { icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-400/20', glow: 'shadow-emerald-400/5' },
              rejected: { icon: XCircle, color: 'text-red-400', border: 'border-red-400/20', glow: 'shadow-red-400/5' },
              cancelled: { icon: AlertCircle, color: 'text-gray-500', border: 'border-white/10', glow: 'shadow-transparent' },
            };
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group glass-strong p-8 rounded-[2.5rem] border ${config.border} ${config.glow} hover:border-white/20 transition-all duration-500 relative overflow-hidden`}
              >
                {/* STATUS INDICATOR BAR */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-12 rounded-r-full ${config.color.replace('text', 'bg')}`} />

                <div className="flex flex-col xl:flex-row justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 border border-white/10 group-hover:border-gold/30 transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-playfair font-bold text-white tracking-tight">{booking.name}</h3>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${config.color} mt-1`}>
                            <StatusIcon size={12} /> {status}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                      <a href={`mailto:${booking.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail size={14} /></div>
                        {booking.email}
                      </a>
                      {booking.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Phone size={14} /></div>
                          {booking.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] font-bold tracking-widest mb-2 flex items-center gap-2">
                        <ArrowUpRight size={12} className="text-gold" /> Service
                      </p>
                      <p className="font-bold text-white text-sm">{booking.event_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] font-bold tracking-widest mb-2 flex items-center gap-2">
                        <Calendar size={12} className="text-gold" /> Event Date
                      </p>
                      <p className="font-bold text-white text-sm">{new Date(booking.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-gray-500 uppercase text-[9px] font-bold tracking-widest mb-2 flex items-center gap-2">
                        <Clock size={12} className="text-gold" /> Logged
                      </p>
                      <p className="text-gray-400 text-sm">{new Date(booking.created_at!).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* MESSAGE BOX */}
                <div className="mt-8 flex gap-4">
                  <div className="shrink-0 pt-1 text-gold/30"><MessageSquare size={18} /></div>
                  <div className="flex-1 p-5 bg-black/40 rounded-2xl border border-white/5 relative">
                    <p className="text-gray-400 text-sm leading-relaxed italic">
                      "{booking.message || "No specific instructions provided."}"
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Update Status</span>
                    <div className="relative group/select">
                      <select
                        disabled={actionLoading === booking.id}
                        value={status}
                        onChange={(e) => updateStatus(booking.id!, e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-3 focus:border-gold outline-none cursor-pointer hover:bg-white/10 transition-all appearance-none pr-10"
                      >
                        <option value="pending" className="bg-[#050505]">Pending Inquiry</option>
                        <option value="confirmed" className="bg-[#050505]">Confirm & Send Email</option>
                        <option value="rejected" className="bg-[#050505]">Reject (Full Booked)</option>
                        <option value="cancelled" className="bg-[#050505]">Mark Cancelled</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><ArrowUpRight size={14} className="rotate-90" /></div>
                    </div>

                    {actionLoading === booking.id && <Loader2 className="animate-spin text-gold" size={18} />}
                  </div>

                  <div className="flex items-center gap-3">
                    {status === 'confirmed' && (
                      <button onClick={() => sendConfirmationEmail(booking)} className="group/btn flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-400/10 px-4 py-2.5 rounded-full border border-emerald-400/10 transition-all">
                        <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" /> Resend Confirmation
                      </button>
                    )}
                    {status === 'rejected' && (
                      <button onClick={() => sendRejectionEmail(booking)} className="group/btn flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 px-4 py-2.5 rounded-full border border-red-400/10 transition-all">
                        <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" /> Resend Rejection
                      </button>
                    )}
                    <button onClick={() => deleteBooking(booking.id!)} className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all" title="Delete Record">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-40 bg-white/[0.02] rounded-[3.5rem] border border-dashed border-white/10">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-gray-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-400">The Schedule is Open</h3>
            <p className="text-gray-600 mt-2 text-sm font-medium">Wait for inquiries to appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
