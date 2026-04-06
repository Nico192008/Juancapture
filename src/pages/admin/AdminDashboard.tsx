import { useState, useEffect, useCallback } from 'react';
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
  ChevronRight,
  Trash2,
  Layers,
  ArrowUpRight,
  Sparkles,
  Play,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  // -- SYSTEM STATES --
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  
  // -- DATA LISTS --
  const [albumsList, setAlbumsList] = useState<any[]>([]);
  const [videosList, setVideosList] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  
  // -- UI CONTROL --
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  
  // -- FORM STATES --
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [title, setTitle] = useState('');

  // --- 1. DATA FETCHING (Dito ibinabalik ang Album at Video functions) ---
  const fetchDashboardData = useCallback(async () => {
    try {
      const [albumsRes, videosRes, bookingsRes] = await Promise.all([
        supabase.from('albums').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (albumsRes.error) throw albumsRes.error;
      if (videosRes.error) throw videosRes.error;

      setAlbumsList(albumsRes.data || []);
      setVideosList(videosRes.data || []);
      setRecentBookings(bookingsRes.data || []);
      
      setStats({ 
        albums: albumsRes.data?.length || 0, 
        videos: videosRes.data?.length || 0, 
        bookings: bookingsRes.count || 0 
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (!authLoading) {
      if (!user || !isAdmin) {
        navigate('/admin/login');
      } else {
        fetchDashboardData();
      }
    }
    return () => clearInterval(timer);
  }, [user, isAdmin, navigate, authLoading, fetchDashboardData]);

  // --- 2. ALBUM & PHOTO ACTIONS ---
  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    try {
      const { data } = await supabase.from('images').select('*').eq('album_id', album.id).order('created_at', { ascending: false });
      setAlbumPhotos(data || []);
    } finally {
      setFetchingPhotos(false);
    }
  };

  const deletePhoto = async (id: string, url: string) => {
    if(!confirm("Permanteng buburahin ang file sa Storage at Database. Ituloy?")) return;
    try {
      const path = url.split('/portfolio/')[1];
      if (path) await supabase.storage.from('portfolio').remove([path]);
      await supabase.from('images').delete().eq('id', id);
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
      fetchDashboardData();
    } catch (err) { alert("Delete failed."); }
  };

  const deleteVideo = async (id: string, vUrl: string, tUrl: string) => {
    if(!confirm("Buburahin ang video na ito. Ituloy?")) return;
    try {
      const vPath = vUrl.split('/portfolio/')[1];
      const tPath = tUrl.split('/portfolio/')[1];
      if (vPath) await supabase.storage.from('portfolio').remove([vPath]);
      if (tPath) await supabase.storage.from('portfolio').remove([tPath]);
      await supabase.from('videos').delete().eq('id', id);
      fetchDashboardData();
    } catch (err) { alert("Video delete failed."); }
  };

  // --- 3. UPLOAD LOGIC ---
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setSubmitting(true);

    try {
      const uploadFile = async (file: File, folder: string) => {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const path = `${folder}/${fileName}`;
        const { error } = await supabase.storage.from('portfolio').upload(path, file);
        if (error) throw error;
        return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
      };

      if (postType === 'image') {
        if (!selectedAlbumId) throw new Error("Pumili ng Album.");
        const url = await uploadFile(selectedFile, 'images');
        await supabase.from('images').insert([{ album_id: selectedAlbumId, image_url: url, caption: title || 'Untitled' }]);
      } else {
        if (!thumbnailFile) throw new Error("Kailangan ng Cover Image para sa Video.");
        const [vUrl, tUrl] = await Promise.all([
          uploadFile(selectedFile, 'videos'),
          uploadFile(thumbnailFile, 'thumbnails')
        ]);
        await supabase.from('videos').insert([{ title, video_url: vUrl, thumbnail_url: tUrl }]);
      }
      resetForm();
      fetchDashboardData();
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setSelectedFile(null);
    setThumbnailFile(null);
    setSelectedAlbumId('');
    setTitle('');
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-gold w-12 h-12" />
      <p className="text-[10px] uppercase tracking-[0.5em] text-gold/50 font-black">Juan Captures Engine Syncing...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto pt-24 px-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tighter">
              Studio <span className="text-gold italic">Control</span>
            </h1>
            <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString()} — ADMIN CONNECTED
              </span>
            </div>
          </motion.div>

          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold transition-all active:scale-95 flex items-center justify-center gap-2">
              <Plus size={16} strokeWidth={3} /> New Content
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-red-500 transition-all"><LogOut size={20}/></button>
          </div>
        </header>

        {/* --- BENTO GRID STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link to="/admin/bookings" className="md:col-span-2 group glass-strong p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:border-gold/30 transition-all">
            <Calendar className="text-gold mb-6" size={32} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Schedule</h3>
            <div className="text-7xl font-bold tracking-tighter">{stats.bookings}</div>
            <p className="mt-4 text-xs font-bold text-gray-400 group-hover:text-gold transition-colors flex items-center gap-2">Manage Bookings <ChevronRight size={14}/></p>
          </Link>
          <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:border-blue-400/30 transition-all">
            <ImageIcon className="text-blue-400 mb-6" size={28} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Albums</h3>
            <div className="text-5xl font-bold tracking-tighter">{stats.albums}</div>
          </div>
          <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:border-purple-400/30 transition-all">
            <Video className="text-purple-400 mb-6" size={28} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Cinematics</h3>
            <div className="text-5xl font-bold tracking-tighter">{stats.videos}</div>
          </div>
        </div>

        {/* --- CONTENT MANAGER (Albums & Videos) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Album List */}
          <section className="lg:col-span-2 glass-strong p-8 md:p-12 rounded-[3.5rem] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-10">
              <Layers className="text-gold" size={24} />
              <h2 className="text-2xl font-bold">Album Archives</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {albumsList.map((album) => (
                <button key={album.id} onClick={() => openAlbum(album)} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-gold/50 transition-all text-left">
                  <div className="flex items-center gap-4 truncate">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><LayoutGrid size={18}/></div>
                    <span className="font-bold text-sm truncate">{album.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-gold" />
                </button>
              ))}
            </div>
          </section>

          {/* Video Manager Sidebar */}
          <section className="glass-strong p-8 rounded-[3rem] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-8">
              <Video className="text-purple-400" size={22} />
              <h2 className="text-xl font-bold">Recent Videos</h2>
            </div>
            <div className="space-y-4">
              {videosList.slice(0, 4).map((vid) => (
                <div key={vid.id} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5">
                  <img src={vid.thumbnail_url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                    <button onClick={() => deleteVideo(vid.id, vid.video_url, vid.thumbnail_url)} className="p-3 bg-red-500 rounded-xl hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 truncate text-[10px] font-black uppercase tracking-widest text-white">{vid.title}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* --- MODAL: ALBUM VIEW --- */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl bg-black/80">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-strong w-full max-w-7xl h-[90vh] flex flex-col p-6 md:p-12 rounded-[3.5rem] border border-white/10 bg-[#080808]">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-4xl font-playfair font-bold italic">{selectedAlbum.name}</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">{albumPhotos.length} Masterpieces Found</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all"><X size={24}/></button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold"/></div> : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                          <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => deletePhoto(photo.id, photo.image_url)} className="p-4 bg-red-500 rounded-2xl hover:scale-110 transition-transform"><Trash2 size={20}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL: UPLOAD --- */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                className="relative glass-strong w-full max-w-lg p-10 md:p-14 rounded-[3.5rem] border border-white/10 bg-[#080808]">
                <button onClick={resetForm} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={24}/></button>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-playfair font-bold">Studio Uploader</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold/50 mt-1">Add to Portfolio</p>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1.5 bg-white/5 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button key={type} type="button" onClick={() => setPostType(type as any)} 
                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-gold text-black' : 'text-gray-500'}`}>{type}</button>
                    ))}
                  </div>
                  {postType === 'image' ? (
                    <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-gold"
                      value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                      <option value="" className="bg-black">Target Album</option>
                      {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                    </select>
                  ) : (
                    <input required type="text" placeholder="Video Title" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-gold"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  )}
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center relative hover:border-gold/40 transition-all bg-white/[0.01]">
                    <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <Upload className="mx-auto text-gold/40 mb-3" size={32} />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{selectedFile ? selectedFile.name : `Choose ${postType} File`}</p>
                  </div>
                  {postType === 'video' && (
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative bg-white/[0.01]">
                      <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{thumbnailFile ? thumbnailFile.name : 'Choose Video Thumbnail'}</p>
                    </div>
                  )}
                  <button disabled={submitting} type="submit" 
                    className="w-full bg-gold text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-gold/20 active:scale-95 transition-all">
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Publish to Portfolio'}
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
