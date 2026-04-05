import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, Trash2, Send, AlertCircle } from 'lucide-react';
import { Booking } from '../../types';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (status === 'confirmed') {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
          await sendConfirmationEmail(booking);
        }
      }

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking status');
    }
  };

  // FIXED: Pinatibay ang email sending logic laban sa hidden characters
  const sendConfirmationEmail = async (booking: Booking) => {
    try {
      const serviceId = "service_4n5zlku";
      const templateId = "template_z8t052n";
      const publicKey = "Jb0rUyGCKXb-bMlWt";

      /** * ULTIMATE FIX FOR "ADDRESS NOT FOUND":
       * .trim() - tinatanggal ang space sa unahan/hulihan.
       * .replace(/[^\x20-\x7E]/g, "") - tinatanggal ang lahat ng invisible/special characters.
       */
      const sanitizedEmail = booking.email.trim().replace(/[^\x20-\x7E]/g, "");

      const templateParams = {
        to_name: booking.name,
        to_email: sanitizedEmail,
        event_type: booking.event_type,
        event_date: new Date(booking.event_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        message: "Your booking has been officially confirmed by Juan Captures. We are looking forward to our session!",
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (result.status === 200) {
        alert(`Success! Juan Captures notification sent to ${sanitizedEmail}`);
      }
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      alert('Confirmed in system, but email failed: ' + (error?.text || 'Check recipient email address'));
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Manage Bookings
            </h1>
            <p className="text-gray-400">View and manage booking requests</p>
          </div>
          <Link to="/admin/dashboard" className="btn-gold-outline">
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const status = booking.status || 'pending';
            const statusConfig = {
              pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
              confirmed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
              cancelled: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
            };
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-strong p-6 rounded-lg hover:shadow-gold transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                      {booking.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <a
                        href={`mailto:${booking.email}`}
                        className="text-gold hover:text-gold-light transition-colors flex items-center space-x-1"
                      >
                        <Mail size={16} />
                        <span>{booking.email}</span>
                      </a>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${config.bg}`}>
                    <StatusIcon size={18} className={config.color} />
                    <span className={`${config.color} text-sm font-semibold`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Event Type</p>
                    <p className="text-white font-semibold">{booking.event_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Event Date</p>
                    <p className="text-gold">
                      {new Date(booking.event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {booking.phone && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Phone</p>
                      <p className="text-white">{booking.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Submitted</p>
                    <p className="text-white">
                      {booking.created_at
                        ? new Date(booking.created_at).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-xs mb-1">Message</p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {booking.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <select
                    value={status}
                    onChange={(e) => updateStatus(booking.id!, e.target.value)}
                    className="glass px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="pending" className="bg-dark-100">
                      Pending
                    </option>
                    <option value="confirmed" className="bg-dark-100">
                      Confirmed
                    </option>
                    <option value="cancelled" className="bg-dark-100">
                      Cancelled
                    </option>
                  </select>

                  {status === 'confirmed' && (
                    <button
                      onClick={() => sendConfirmationEmail(booking)}
                      className="glass px-3 py-2 rounded-lg text-gold hover:bg-white/10 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <Send size={16} />
                      <span>Send Email</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteBooking(booking.id!)}
                    className="glass px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center space-x-1 text-sm ml-auto"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No bookings yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
