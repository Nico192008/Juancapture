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
  Phone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  // Real-time states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  
  // Modal & Content states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{id: string, name: string} | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  
  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [title, setTitle] = useState('');

  // --- DATA FETCHING LOGIC ---
  const fetchDashboardData = useCallback(async () => {
    try {
      // Kunin lahat ng kailangang data sa isang bagsakan
      const [albumsRes, videosRes, bookingsRes] = await Promise.all([
        supabase.from('albums').select('id, name').order('created_at', { ascending: false }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ]);

      if (albumsRes.error) throw albumsRes.error;

      setAlbumsList(albumsRes.data || []);
      setStats({ 
        albums: albumsRes.data?.length || 0, 
        videos: videosRes.count || 0, 
        bookings: bookingsRes.count || 0 
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
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

  // --- ACTIONS ---
  const openAlbum = async (album: {id: string, name: string}) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('album_id', album.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAlbumPhotos(data || []);
    } finally {
      setFetchingPhotos(false);
    }
  };

  const deletePhoto = async (id: string, url: string) => {
    if(!confirm("Warning: Mabubura ito sa Bucket at Database. Ituloy?")) return;
    try {
      // 1. Linisin ang Storage Bucket
      const urlParts = url.split('/portfolio/');
      const filePath = urlParts[1];
      if (filePath) {
        await supabase.storage.from('portfolio').remove([filePath]);
      }

      // 2. Burahin sa Database
      await supabase.from('images').delete().eq('id', id);
      
      // 3. Update UI
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
      fetchDashboardData(); // Refresh counts
    } catch (err) {
      alert("Delete failed.");
    }
  };

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
        const url = await uploadFile(selectedFile, 'images');
        await supabase.from('images').insert([{ 
          album_id: selectedAlbumId, 
          image_url: url, 
          caption: title || 'Untitled' 
        }]);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required");
        const [vUrl, tUrl] = await Promise.all([
          uploadFile(selectedFile, 'videos'),
          uploadFile(thumbnailFile, 'thumbnails')
        ]);
        await supabase.from('videos').insert([{ title, video_url: vUrl, thumbnail_url: tUrl }]);
      }

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
    setTitle('');
  };

  // --- RENDER ---
  if (loading || authLoading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-gold w-12 h-12" />
      <p className="text-[10px] uppercase tracking-[0.5em] text-gold/50 font-black">Syncing Studio Data</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30 pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto pt-24 md:pt-32 px-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tighter">
              Studio <span className="text-gold italic">Control</span>
            </h1>
            <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">
              <div className="flex h-2 w-2 relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-gold"></div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString()} — Live Status
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex-1 md:flex-none bg-white text-black px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> New Work
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 group glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <Calendar className="text-gold mb-6" size={32} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Bookings</h3>
            <div className="text-6xl font-bold tracking-tighter">{stats.bookings}</div>
          </div>
          <div className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <ImageIcon className="text-blue-400 mb-6" size={28} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Albums</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.albums}</div>
          </div>
          <div className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <Video className="text-purple-400 mb-6" size={28} />
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Videos</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.videos}</div>
          </div>
        </div>

        {/* Albums List Section */}
        <section className="glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4 mb-8">
            <Layers className="text-gold" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">Portfolio Manager</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.length > 0 ? albumsList.map((album) => (
              <button 
                key={album.id}
                onClick={() => openAlbum(album)} 
                className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-gold/50 transition-all text-left"
              >
                <span className="font-bold text-sm tracking-tight truncate pr-4">{album.name}</span>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gold shrink-0" />
              </button>
            )) : (
              <p className="text-gray-600 text-xs uppercase tracking-widest">No albums found.</p>
            )}
          </div>
        </section>

        {/* --- MODAL: ALBUM PHOTOS --- */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/90">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-strong w-full max-w-6xl h-[85vh] flex flex-col p-6 md:p-10 rounded-[3rem] border border-white/10 bg-[#080808]"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-playfair font-bold text-gold italic">{selectedAlbum.name}</h2>
                  <button onClick={() => setSelectedAlbum(null)} className="p-3 bg-white/5 rounded-full hover:bg-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                          <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => deletePhoto(photo.id, photo.image_url)} className="p-3 bg-red-500 rounded-xl hover:scale-110 transition-transform">
                              <Trash2 size={18} />
                            </button>
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
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                className="relative glass-strong w-full max-w-lg p-8 md:p-12 rounded-[3rem] border border-white/10 bg-[#080808]"
              >
                <button onClick={resetForm} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24} /></button>
                <h2 className="text-3xl font-playfair font-bold mb-8 text-center">Upload Content</h2>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1 bg-white/5 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button 
                        key={type} type="button" onClick={() => setPostType(type as any)} 
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${postType === type ? 'bg-gold text-black' : 'text-gray-500'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {postType === 'image' ? (
                    <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
                      value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                      <option value="" className="bg-black">Select Album</option>
                      {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                    </select>
                  ) : (
                    <input required type="text" placeholder="Video Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  )}

                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center relative hover:border-gold/40 transition-all bg-white/[0.01]">
                    <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <Upload className="mx-auto text-gold/40 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                      {selectedFile ? selectedFile.name : `Choose ${postType}`}
                    </p>
                  </div>

                  {postType === 'video' && (
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative bg-white/[0.01]">
                      <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                        {thumbnailFile ? thumbnailFile.name : 'Choose Video Thumbnail'}
                      </p>
                    </div>
                  )}

                  <button 
                    disabled={submitting} type="submit" 
                    className="w-full bg-gold text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/10 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Publish Masterpiece'}
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
