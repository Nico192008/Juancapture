import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Booking } from '../../types';
import { supabase } from '../../lib/supabase';

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
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking status');
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
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong p-6 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">{booking.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white">{booking.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Event Type</p>
                  <p className="text-gold">{booking.event_type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Event Date</p>
                  <p className="text-white">
                    {new Date(booking.event_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.phone && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white">{booking.phone}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Message</p>
                <p className="text-white">{booking.message}</p>
              </div>

              <div className="flex items-center space-x-4">
                <p className="text-gray-400 text-sm">Status:</p>
                <select
                  value={booking.status || 'pending'}
                  onChange={(e) => updateStatus(booking.id!, e.target.value)}
                  className="glass px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold"
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
              </div>
            </motion.div>
          ))}
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
