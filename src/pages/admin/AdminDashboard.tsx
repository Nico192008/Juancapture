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
  Play,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  // States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  
  // Form States
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
    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Pumili ng file.");
    setSubmitting(true);
    try {
      if (postType === 'image') {
        const url = await uploadToBucket(selectedFile, 'images');
        const { error } = await supabase.from('images').insert([{
          album_id: selectedAlbumId,
          image_url: url, // MATCHED TO YOUR DB
          caption: caption
        }]);
        if (error) throw error;
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail is required for videos.");
        const vUrl = await uploadToBucket(selectedFile, 'videos');
        const tUrl = await uploadToBucket(thumbnailFile, 'thumbnails');
        const { error } = await supabase.from('videos').insert([{
          title: title,
          video_url: vUrl, // MATCHED TO YOUR DB
          thumbnail_url: tUrl // MATCHED TO YOUR DB
        }]);
        if (error) throw error;
      }
      alert("Published successfully!");
      resetForm();
      fetchDashboardData();
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
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
    <div className="min-h-screen pt-24 pb-20 bg-[#050505] text-white">
      <div className="container-custom px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-gold text-xs font-mono tracking-[0.3em] uppercase mb-2 block">Control Center</span>
            <h1 className="text-6xl font-playfair font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-4 font-mono text-sm">
              <Clock size={14} className="text-gold"/>
              <span>{currentTime.toLocaleTimeString()}</span>
              <span className="mx-2 opacity-20">|</span>
              <span>{currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <button onClick={() => setShowCreateModal(true)} className="bg-gold text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-gold/10">
              <Plus size={20} /> Create New Post
            </button>
            <button onClick={() => signOut()} className="glass-strong p-4 rounded-2xl text-gray-500 hover:text-red-500 border border-white/5 transition-all">
              <LogOut size={22} />
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Bookings', count: stats.bookings, icon: Calendar, color: 'text-blue-400', link: '/admin/bookings', bg: 'bg-blue-400/5' },
            { label: 'Photo Albums', count: stats.albums, icon: ImageIcon, color: 'text-gold', link: '/admin/albums', bg: 'bg-gold/5' },
            { label: 'Video Reels', count: stats.videos, icon: Video, color: 'text-purple-400', link: '/admin/videos', bg: 'bg-purple-400/5' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={stat.link} className="glass-strong block p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
                <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={26} />
                </div>
                <div className="text-5xl font-bold mb-1 tracking-tighter">{stat.count}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                  {stat.label} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* --- MAIN CONTENT ARRANGEMENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Nav (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3"><Layers className="text-gold" size={20}/> Recent Albums</h3>
                <Link to="/admin/albums" className="text-xs text-gold hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {albumsList.slice(0, 4).map(album => (
                  <div key={album.id} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><ImageIcon size={18}/></div>
                      <span className="font-semibold tracking-tight">{album.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-700 group-hover:text-gold transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel (Right) */}
          <div className="space-y-6">
            <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-gold/10 to-transparent">
              <FileText className="text-gold mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Review Bookings</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Mayroon kang {stats.bookings} na pending at confirmed bookings na kailangang i-manage.</p>
              <Link to="/admin/bookings" className="block w-full bg-white text-black text-center py-4 rounded-2xl font-bold hover:bg-gold transition-all">Manage Clients</Link>
            </div>
          </div>

        </div>

        {/* --- CREATE POST MODAL --- */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative glass-strong w-full max-w-2xl p-10 rounded-[3rem] border border-white/10">
                
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-playfair font-bold">New Portfolio Post</h2>
                  <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-8">
                  {/* Type Switcher */}
                  <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
                    <button type="button" onClick={() => setPostType('image')} className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${postType === 'image' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500'}`}><ImageIcon size={18}/> Image</button>
                    <button type="button" onClick={() => setPostType('video')} className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${postType === 'video' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500'}`}><Video size={18}/> Video</button>
                  </div>

                  <div className="space-y-6">
                    {postType === 'image' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-2 block tracking-widest">Target Album</label>
                            <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all"
                              value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                              <option value="" className="bg-black">-- Select Destination --</option>
                              {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-2 block tracking-widest">Caption</label>
                            <input required type="text" placeholder="Short description..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all"
                              value={caption} onChange={(e) => setCaption(e.target.value)} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-2 block tracking-widest">Video Title</label>
                          <input required type="text" placeholder="e.g. Wedding Cinematic Reel" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all"
                            value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                      </div>
                    )}

                    {/* Multi-File Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center relative hover:border-gold transition-all group">
                        <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <div className="bg-gold/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold group-hover:scale-110 transition-transform">
                          {postType === 'image' ? <ImageIcon size={24}/> : <Play size={24}/>}
                        </div>
                        <p className="text-[10px] font-mono text-gray-500 truncate px-4">{selectedFile ? selectedFile.name : `Select ${postType}`}</p>
                      </div>

                      {postType === 'video' && (
                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center relative hover:border-gold transition-all group">
                          <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                          <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform"><ImageIcon size={24}/></div>
                          <p className="text-[10px] font-mono text-gray-500 truncate px-4">{thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full bg-gold text-black py-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all">
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
