import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, Trash2, Send, AlertCircle, XCircle, Phone } from 'lucide-react';
import { Booking } from '../../types';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // EmailJS Config - Palitan ang 'template_REJECTION_ID' ng actual ID mo sa EmailJS
  const EMAILJS_SERVICE_ID = "service_4n5zlku";
  const EMAILJS_PUBLIC_KEY = "Jb0rUyGCKXb-bMlWt";
  const CONFIRMATION_TEMPLATE_ID = "template_z8t052n";
  const REJECTION_TEMPLATE_ID = "template_REJECTION_ID"; // <--- ILAGAY DITO ANG REJECTION TEMPLATE ID

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
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      const booking = bookings.find(b => b.id === id);
      if (booking) {
        if (status === 'confirmed') {
          await sendConfirmationEmail(booking);
        } else if (status === 'rejected') {
          await sendRejectionEmail(booking);
        }
      }

      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status.');
    }
  };

  // Helper to clean hidden characters from email strings
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
      alert(`Success: Confirmation sent to ${cleanEmail}`);
    } catch (error) {
      console.error('Confirmation Email Error:', error);
      alert('Confirmed in system, but email failed to send.');
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
        message: "We regret to inform you that we cannot cater your request for this date as we are already fully booked. Thank you for your interest!",
      };

      await emailjs.send(EMAILJS_SERVICE_ID, REJECTION_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      alert(`Success: Rejection notice sent to ${cleanEmail}`);
    } catch (error) {
      console.error('Rejection Email Error:', error);
      alert('Rejected in system, but email failed to send.');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container-custom px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-playfair font-bold mb-2 text-white">Manage Bookings</h1>
            <p className="text-gray-400">Review and update client photography requests</p>
          </div>
          <Link to="/admin/dashboard" className="btn-gold-outline px-6 py-2 rounded-full border border-gold text-gold hover:bg-gold hover:text-black transition-all">
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking, index) => {
            const status = (booking.status || 'pending').toLowerCase();
            const statusConfig = {
              pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
              confirmed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
              rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
              cancelled: { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' },
            };
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-strong p-6 rounded-xl border ${config.border} hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-playfair font-bold text-white">{booking.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${config.bg} ${config.color}`}>
                        <StatusIcon size={12} /> {status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <a href={`mailto:${booking.email}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                        <Mail size={14} /> {booking.email}
                      </a>
                      {booking.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {booking.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                    <div>
                      <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Event Type</p>
                      <p className="font-semibold text-white">{booking.event_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Event Date</p>
                      <p className="font-semibold text-gold">{new Date(booking.event_date).toDateString()}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Created At</p>
                      <p className="text-white">{new Date(booking.created_at!).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Client Message</p>
                  <p className="text-gray-300 italic text-sm">"{booking.message}"</p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium uppercase">Change Status:</span>
                    <select
                      value={status}
                      onChange={(e) => updateStatus(booking.id!, e.target.value)}
                      className="bg-black/50 border border-white/20 text-white text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-gold outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm (Send Email)</option>
                      <option value="rejected">Reject (Fully Booked)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'confirmed' && (
                      <button onClick={() => sendConfirmationEmail(booking)} className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 px-3 py-2 bg-green-400/5 rounded-lg transition-all">
                        <Send size={14} /> Resend Confirmation
                      </button>
                    )}
                    {status === 'rejected' && (
                      <button onClick={() => sendRejectionEmail(booking)} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 bg-red-400/5 rounded-lg transition-all">
                        <Send size={14} /> Resend Rejection
                      </button>
                    )}
                  </div>

                  <button onClick={() => deleteBooking(booking.id!)} className="ml-auto text-gray-500 hover:text-red-500 transition-all flex items-center gap-1 text-xs">
                    <Trash2 size={14} /> Delete Record
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Clock className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg">No booking requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
