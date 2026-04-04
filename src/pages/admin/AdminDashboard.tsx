import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Video,
  Calendar,
  MessageSquare,
  LogOut,
  Plus,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, signOut } = useAuthContext(); // ❌ removed isAdmin (we will verify manually)
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    albums: 0,
    videos: 0,
    bookings: 0,
    testimonials: 0,
  });

  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // ✅ VERIFY ADMIN FROM DATABASE
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !admin) {
        console.error('Not an admin:', error);
        navigate('/admin/login');
        return;
      }

      // ✅ IF ADMIN → LOAD DATA
      await fetchStats();
    } catch (err) {
      console.error('Auth error:', err);
      navigate('/admin/login');
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [albums, videos, bookings, testimonials] = await Promise.all([
        supabase.from('albums').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase
          .from('testimonials')
          .select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        albums: albums.count || 0,
        videos: videos.count || 0,
        bookings: bookings.count || 0,
        testimonials: testimonials.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ✅ LOADING WHILE CHECKING ADMIN
  if (checkingAdmin || loading) {
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleSignOut}
            className="btn-gold-outline flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: 'Albums',
              count: stats.albums,
              icon: Image,
              link: '/admin/albums',
            },
            {
              title: 'Videos',
              count: stats.videos,
              icon: Video,
              link: '/admin/videos',
            },
            {
              title: 'Bookings',
              count: stats.bookings,
              icon: Calendar,
              link: '/admin/bookings',
            },
            {
              title: 'Testimonials',
              count: stats.testimonials,
              icon: MessageSquare,
              link: '/admin/testimonials',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link
                to={stat.link}
                className="block glass-strong p-6 rounded-lg hover:shadow-gold transition-all duration-300"
              >
                <stat.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-3xl font-bold text-white mb-1">
                  {stat.count}
                </h3>
                <p className="text-gray-400">{stat.title}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-strong p-8 rounded-lg"
          >
            <h2 className="text-2xl font-playfair font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                to="/admin/albums/new"
                className="flex items-center justify-between glass p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-white">Create New Album</span>
                <Plus className="text-gold" size={20} />
              </Link>
              <Link
                to="/admin/videos/new"
                className="flex items-center justify-between glass p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-white">Add New Video</span>
                <Plus className="text-gold" size={20} />
              </Link>
              <Link
                to="/admin/testimonials/new"
                className="flex items-center justify-between glass p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-white">Add Testimonial</span>
                <Plus className="text-gold" size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="glass-strong p-8 rounded-lg"
          >
            <h2 className="text-2xl font-playfair font-bold text-white mb-6">
              Navigation
            </h2>
            <div className="space-y-4">
              <Link to="/admin/albums" className="block glass p-4 rounded-lg hover:bg-white/10 text-white">
                Manage Albums & Images
              </Link>
              <Link to="/admin/videos" className="block glass p-4 rounded-lg hover:bg-white/10 text-white">
                Manage Videos
              </Link>
              <Link to="/admin/bookings" className="block glass p-4 rounded-lg hover:bg-white/10 text-white">
                View Bookings
              </Link>
              <Link to="/admin/testimonials" className="block glass p-4 rounded-lg hover:bg-white/10 text-white">
                Manage Testimonials
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
