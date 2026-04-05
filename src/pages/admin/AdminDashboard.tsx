import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  LayoutGrid,
  Clock,
  ChevronRight,
  FileText,
  Play
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  
  // Form Fields
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
    return () => clearInterval(timer);
  }, [user, isAdmin, navigate, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const [albums, vids, bookings] = await Promise.all([
        supabase.from('albums').select('id, name'),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ]);
      
      setAlbumsList(albums.data || []);
      setStats({
        albums: albums.data?.length || 0,
        videos: vids.count || 0,
        bookings: bookings.count || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadToBucket = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Paki-pili ng file.");
    if (postType === 'video' && !thumbnailFile) return alert("Kailangan ng thumbnail para sa video.");
    
    setSubmitting(true);
    try {
      if (postType === 'image') {
        const imageUrl = await uploadToBucket(selectedFile, 'images');
        const { error } = await supabase.from('images').insert([{
          album_id: selectedAlbumId,
          image_url: imageUrl, // Base sa database screenshot
          caption: caption
        }]);
        if (error) throw error;
      } else {
        const videoUrl = await uploadToBucket(selectedFile, 'videos');
        const thumbUrl = await uploadToBucket(thumbnailFile!, 'thumbnails');
        
        const { error } = await supabase.from('videos').insert([{
          title: title,
          video_url: videoUrl, // Base sa database screenshot
          thumbnail_url: thumbUrl // Base sa database screenshot
        }]);
        if (error) throw error;
      }

      alert("Successfully published to portfolio!");
      resetForm();
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setSelectedFile(null);
    setThumbnailFile(null);
    setSelectedAlbumId('');
    setCaption('');
    setTitle('');
  };

  if (loading || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-gold w-10 h-10" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#050505] text-white font-sans">
      <div className="container-custom px-6">
        
        {/* HEADER & REAL-TIME CLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-playfair font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 text-gold mt-2 font-mono text-sm tracking-widest uppercase">
              <Clock size={14} />
              <span>{currentTime.toLocaleTimeString()}</span>
              <span className="opacity-40">|</span>
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <button onClick={() => setShowCreateModal(true)} className="bg-gold text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-gold/20">
              <Plus size={20} /> Create Post
            </button>
            <button onClick={() => signOut()} className="glass-strong p-3 rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 transition-all border border-white/5">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Bookings', count: stats.bookings, icon: Calendar, color: 'text-blue-400', link: '/admin/bookings' },
            { label: 'Active Albums', count: stats.albums, icon: ImageIcon, color: 'text-gold', link: '/admin/albums' },
            { label: 'Video Reels', count: stats.videos, icon: Video, color: 'text-purple-400', link: '/admin/videos' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={stat.link} className="glass-strong block p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden">
                <stat.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                <div className={`${stat.color} mb-4`}><stat.icon size={28}/></div>
                <div className="text-4xl font-bold mb-1 tracking-tighter">{stat.count}</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CREATE POST MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative glass-strong w-full max-w-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gold uppercase tracking-tighter">New Portfolio Item</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button type="button" onClick={() => setPostType('image')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'image' ? 'bg-gold text-black' : 'text-gray-500'}`}>Image</button>
                    <button type="button" onClick={() => setPostType('video')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'video' ? 'bg-gold text-black' : 'text-gray-500'}`}>Video</button>
                  </div>

                  <div className="space-y-4">
                    {postType === 'image' ? (
                      <>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-2 block">Link to Album</label>
                          <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold"
                            value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                            <option value="" className="bg-black">-- Select Album --</option>
                            {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-2 block">Caption</label>
                          <input required type="text" placeholder="Write a short caption..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold"
                            value={caption} onChange={(e) => setCaption(e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-2 block">Video Title</label>
                        <input required type="text" placeholder="Enter reel title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    {/* Dynamic File Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative hover:border-gold/50 transition-all cursor-pointer">
                        <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <Upload className="mx-auto text-gold/30 mb-2" size={24} />
                        <p className="text-[10px] text-gray-500 truncate">{selectedFile ? selectedFile.name : `Upload ${postType}`}</p>
                      </div>

                      {postType === 'video' && (
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative hover:border-gold/50 transition-all cursor-pointer">
                          <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                          <ImageIcon className="mx-auto text-purple-400/30 mb-2" size={24} />
                          <p className="text-[10px] text-gray-500 truncate">{thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full btn-gold py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-gold/20 active:scale-95 transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Confirm & Publish'}
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
