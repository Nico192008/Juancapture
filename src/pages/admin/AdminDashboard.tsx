import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Video,
  Calendar,
  MessageSquare,
  LogOut,
  Plus,
  X,
  Upload,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    albums: 0,
    videos: 0,
    bookings: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data states for selection
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  const [imageForm, setImageForm] = useState({ albumId: '', url: '' });
  const [videoForm, setVideoForm] = useState({ title: '', url: '' });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchAlbums();
  }, [user, isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const [albums, videos, bookings, testimonials] = await Promise.all([
        supabase.from('albums').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
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

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('id, name');
    if (data) setAlbumsList(data);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('images').insert([{
        album_id: imageForm.albumId,
        url: imageForm.url
      }]);
      if (error) throw error;
      alert('Image added successfully!');
      setShowImageModal(false);
    } catch (error) {
      alert('Error adding image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('videos').insert([{
        title: videoForm.title,
        url: videoForm.url
      }]);
      if (error) throw error;
      alert('Video added successfully!');
      setShowVideoModal(false);
      fetchStats();
    } catch (error) {
      alert('Error adding video');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin h-12 w-12 text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container-custom px-6">
        <div className="flex items-center justify-between mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </motion.div>

          <button onClick={handleSignOut} className="btn-gold-outline flex items-center space-x-2">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Albums', count: stats.albums, icon: Image, link: '/admin/albums' },
            { title: 'Videos', count: stats.videos, icon: Video, link: '/admin/videos' },
            { title: 'Bookings', count: stats.bookings, icon: Calendar, link: '/admin/bookings' },
            { title: 'Testimonials', count: stats.testimonials, icon: MessageSquare, link: '/admin/testimonials' },
          ].map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Link to={stat.link} className="block glass-strong p-6 rounded-lg hover:shadow-gold transition-all duration-300">
                <stat.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-3xl font-bold text-white mb-1">{stat.count}</h3>
                <p className="text-gray-400">{stat.title}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MODIFIED QUICK ACTIONS */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8 rounded-lg">
            <h2 className="text-2xl font-playfair font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => setShowImageModal(true)}
                className="w-full flex items-center justify-between glass p-4 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <span>Add New Image</span>
                <Plus className="text-gold" size={20} />
              </button>
              <button 
                onClick={() => setShowVideoModal(true)}
                className="w-full flex items-center justify-between glass p-4 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <span>Add New Video</span>
                <Plus className="text-gold" size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8 rounded-lg">
            <h2 className="text-2xl font-playfair font-bold text-white mb-6">Navigation</h2>
            <div className="space-y-4">
              <Link to="/admin/albums" className="block glass p-4 rounded-lg hover:bg-white/10 transition-colors text-white">Manage Albums & Images</Link>
              <Link to="/admin/videos" className="block glass p-4 rounded-lg hover:bg-white/10 transition-colors text-white">Manage Videos</Link>
              <Link to="/admin/bookings" className="block glass p-4 rounded-lg hover:bg-white/10 transition-colors text-white">View Bookings</Link>
            </div>
          </motion.div>
        </div>

        {/* --- MODALS --- */}
        <AnimatePresence>
          {/* Add Image Modal */}
          {showImageModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowImageModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-strong w-full max-w-md p-8 rounded-2xl border border-gold/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-playfair font-bold text-white">Upload to Portfolio</h2>
                  <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleAddImage} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gold uppercase mb-1">Select Album</label>
                    <select required className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" onChange={e => setImageForm({...imageForm, albumId: e.target.value})}>
                      <option value="">-- Choose Album --</option>
                      {albumsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gold uppercase mb-1">Image URL</label>
                    <input required type="text" placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" onChange={e => setImageForm({...imageForm, url: e.target.value})} />
                  </div>
                  <button disabled={submitting} type="submit" className="w-full btn-gold py-3 rounded-lg font-bold flex justify-center items-center">
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Upload Image'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Add Video Modal */}
          {showVideoModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowVideoModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-strong w-full max-w-md p-8 rounded-2xl border border-gold/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-playfair font-bold text-white">New Video Entry</h2>
                  <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gold uppercase mb-1">Video Title</label>
                    <input required type="text" placeholder="Wedding Highlights..." className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" onChange={e => setVideoForm({...videoForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-gold uppercase mb-1">Video URL (YouTube/Vimeo)</label>
                    <input required type="text" placeholder="https://youtube.com/..." className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white" onChange={e => setVideoForm({...videoForm, url: e.target.value})} />
                  </div>
                  <button disabled={submitting} type="submit" className="w-full btn-gold py-3 rounded-lg font-bold flex justify-center items-center">
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Post Video'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
