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
  Trash2,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Data States
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  
  // Upload Fields
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Clock Timer
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Paki-pili ng file.");
    
    setSubmitting(true);
    try {
      // 1. Upload sa Storage Bucket ('portfolio')
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${postType === 'image' ? 'images' : 'videos'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Kunin ang Public URL
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

      // 3. Insert sa Database depende sa type
      if (postType === 'image') {
        const { error } = await supabase.from('images').insert([{
          album_id: selectedAlbumId,
          url: publicUrl,
          caption: caption // Image caption
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('videos').insert([{
          title: title,
          url: publicUrl
        }]);
        if (error) throw error;
      }

      alert("Post created successfully!");
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
    setSelectedAlbumId('');
    setCaption('');
    setTitle('');
  };

  if (loading || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-gold w-10 h-10" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#050505] text-white font-sans">
      <div className="container-custom px-6">
        
        {/* --- AESTHETIC HEADER & CLOCK --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-playfair font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Management
            </h1>
            <div className="flex items-center gap-2 text-gold mt-2 font-mono text-sm tracking-widest">
              <Clock size={14} />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="opacity-40">|</span>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <button onClick={() => setShowCreateModal(true)} className="bg-gold text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-gold/20">
              <Plus size={20} /> Create Post
            </button>
            <button onClick={() => signOut()} className="glass-strong p-3 rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 transition-all border border-white/5">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* --- ANALYTICS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Event Bookings', count: stats.bookings, icon: Calendar, color: 'text-blue-400', link: '/admin/bookings' },
            { label: 'Photo Albums', count: stats.albums, icon: ImageIcon, color: 'text-gold', link: '/admin/albums' },
            { label: 'Video Reels', count: stats.videos, icon: Video, color: 'text-purple-400', link: '/admin/videos' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={stat.link} className="glass-strong block p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden">
                <stat.icon className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
                <div className={`${stat.color} mb-4`}><stat.icon size={28}/></div>
                <div className="text-4xl font-bold mb-1 tracking-tighter">{stat.count}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest font-bold">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* --- QUICK NAVIGATION SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-strong p-8 rounded-[2rem] border border-white/5">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><LayoutGrid size={20} className="text-gold"/> Recent Collections</h3>
             <div className="space-y-3">
                {albumsList.slice(0, 4).map(album => (
                  <div key={album.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 cursor-default">
                    <span className="font-medium">{album.name}</span>
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                ))}
                <Link to="/admin/albums" className="block text-center text-xs text-gold mt-4 hover:underline">Manage All Albums</Link>
             </div>
          </div>

          <div className="glass-strong p-8 rounded-[2rem] border border-white/5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-4">
                <FileText size={32} />
             </div>
             <h3 className="text-xl font-bold mb-2">Need to check Bookings?</h3>
             <p className="text-gray-500 text-sm mb-6 max-w-[250px]">Check the latest photography and video requests from your clients.</p>
             <Link to="/admin/bookings" className="btn-gold-outline w-full py-4 rounded-2xl">View Client List</Link>
          </div>
        </div>

        {/* --- DYNAMIC CREATE POST MODAL --- */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative glass-strong w-full max-w-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-playfair font-bold">New Post</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors"><X size={28}/></button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-6">
                  {/* Toggle Post Type */}
                  <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button type="button" onClick={() => setPostType('image')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'image' ? 'bg-gold text-black' : 'text-gray-500'}`}>Image</button>
                    <button type="button" onClick={() => setPostType('video')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'video' ? 'bg-gold text-black' : 'text-gray-500'}`}>Video</button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Album Selection for Images */}
                    {postType === 'image' && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-2 block">Link to Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold transition-all"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-black">-- Select Album --</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Content Details */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-2 block">{postType === 'image' ? 'Caption' : 'Video Title'}</label>
                      <input 
                        required 
                        type="text" 
                        placeholder={postType === 'image' ? "Write a short caption..." : "Enter reel title..."}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold transition-all"
                        value={postType === 'image' ? caption : title}
                        onChange={(e) => postType === 'image' ? setCaption(e.target.value) : setTitle(e.target.value)}
                      />
                    </div>

                    {/* File Picker */}
                    <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 text-center hover:border-gold/50 transition-all group relative cursor-pointer">
                      <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                      <Upload className="mx-auto text-gold/30 group-hover:text-gold group-hover:scale-110 transition-all mb-4" size={48} />
                      <p className="text-sm text-gray-400 font-mono">{selectedFile ? selectedFile.name : `Drop ${postType} here or click to browse`}</p>
                    </div>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full btn-gold py-5 rounded-2xl font-bold flex justify-center items-center gap-3 shadow-xl shadow-gold/20 active:scale-[0.98] transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : <><Plus size={20}/> Post to Portfolio</>}
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
