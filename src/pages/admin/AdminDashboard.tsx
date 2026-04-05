import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Calendar,
  LogOut,
  Plus,
  X,
  Upload,
  Loader2,
  FileVideo
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [activeModal, setActiveModal] = useState<'image' | 'video' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  
  // File States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchAlbums();
  }, [user, isAdmin, navigate, authLoading]);

  const fetchStats = async () => {
    try {
      const [albums, videos, bookings] = await Promise.all([
        supabase.from('albums').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        albums: albums.count || 0,
        videos: videos.count || 0,
        bookings: bookings.count || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('id, name');
    if (data) setAlbumsList(data);
  };

  // HANDLER PARA SA UPLOAD (IMAGE O VIDEO)
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Paki-pili muna ng file.");
    
    setSubmitting(true);
    try {
      // 1. I-upload ang file sa Supabase Storage Bucket (Pangalan: 'portfolio')
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${activeModal === 'image' ? 'images' : 'videos'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Kunin ang Public URL ng inupload na file
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      // 3. I-save ang URL sa tamang Table (images o videos)
      if (activeModal === 'image') {
        const { error: dbError } = await supabase.from('images').insert([
          { album_id: selectedAlbumId, url: publicUrl }
        ]);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('videos').insert([
          { title: videoTitle, url: publicUrl }
        ]);
        if (dbError) throw dbError;
      }

      alert(`${activeModal === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
      closeModal();
      fetchStats();
    } catch (error: any) {
      alert(error.message || "Error uploading file");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedFile(null);
    setVideoTitle('');
    setSelectedAlbumId('');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gold">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container-custom px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-playfair font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Active Session: {user?.email}</p>
          </div>
          <button onClick={() => signOut()} className="btn-gold-outline flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Albums', count: stats.albums, icon: ImageIcon, link: '/admin/albums' },
            { title: 'Videos', count: stats.videos, icon: Video, link: '/admin/videos' },
            { title: 'Bookings', count: stats.bookings, icon: Calendar, link: '/admin/bookings' },
          ].map((stat) => (
            <Link key={stat.title} to={stat.link} className="glass-strong p-8 rounded-2xl hover:border-gold/40 transition-all group">
              <stat.icon className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-4xl font-bold">{stat.count}</h3>
              <p className="text-gray-500 uppercase text-xs tracking-tighter font-bold">{stat.title}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-strong p-8 rounded-2xl">
            <h2 className="text-2xl font-playfair font-bold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button onClick={() => setActiveModal('image')} className="w-full flex items-center justify-between glass p-5 rounded-xl hover:bg-gold hover:text-black transition-all group font-bold">
                <span className="flex items-center gap-3"><Upload size={20}/> Upload New Image</span>
                <Plus size={20} />
              </button>
              <button onClick={() => setActiveModal('video')} className="w-full flex items-center justify-between glass p-5 rounded-xl hover:bg-white/10 transition-all group font-bold">
                <span className="flex items-center gap-3"><FileVideo size={20}/> Upload New Video</span>
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="glass-strong p-8 rounded-2xl">
            <h2 className="text-2xl font-playfair font-bold mb-6">Navigation</h2>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <Link to="/admin/albums" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">Manage Portfolio & Collections</Link>
              <Link to="/admin/videos" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">Video Gallery Management</Link>
              <Link to="/admin/bookings" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">Review Client Bookings</Link>
            </div>
          </div>
        </div>

        {/* --- UPLOAD MODAL --- */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative glass-strong w-full max-w-md p-8 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Upload {activeModal === 'image' ? 'Image' : 'Video'}</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
                </div>

                <form onSubmit={handleFileUpload} className="space-y-5">
                  {activeModal === 'image' && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gold mb-2 block font-bold">Target Album</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" 
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="" className="bg-black">-- Select Album --</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  )}

                  {activeModal === 'video' && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-gold mb-2 block font-bold">Video Title</label>
                      <input required type="text" placeholder="e.g. Wedding Cinematic" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
                        value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold mb-2 block font-bold">Select File</label>
                    <input required type="file" accept={activeModal === 'image' ? 'image/*' : 'video/*'} 
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-white transition-all"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  </div>

                  <button disabled={submitting} type="submit" className="w-full btn-gold py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 shadow-lg shadow-gold/10">
                    {submitting ? <Loader2 className="animate-spin" size={20}/> : <><Upload size={20}/> Start Upload</>}
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
