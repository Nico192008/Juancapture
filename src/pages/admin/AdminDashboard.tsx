import { useState, useEffect } from 'react';
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
  ExternalLink,
  Sparkles
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
  
  // UI & Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{id: string, name: string} | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  
  // File States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
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
        supabase.from('albums').select('id, name').order('created_at', { ascending: false }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ]);
      setAlbumsList(albums.data || []);
      setStats({ 
        albums: albums.data?.length || 0, 
        videos: vids.count || 0, 
        bookings: bookings.count || 0 
      });
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally { 
      setLoading(false); 
    }
  };

  const openAlbum = async (album: {id: string, name: string}) => {
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
    if(!confirm("Permanteng mabubura ang masterpiece na ito. Ituloy?")) return;
    try {
      // 1. Kunin ang filename mula sa URL
      const path = url.split('/').pop();
      if (path) {
        await supabase.storage.from('portfolio').remove([`images/${path}`]);
      }
      // 2. Burahin sa database
      const { error } = await supabase.from('images').delete().eq('id', id);
      if (error) throw error;

      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) { 
      alert("System Error: Hindi mabura ang file."); 
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setSubmitting(true);

    try {
      const uploadToBucket = async (file: File, folder: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        return data.publicUrl;
      };

      if (postType === 'image') {
        const url = await uploadToBucket(selectedFile, 'images');
        await supabase.from('images').insert([{ 
          album_id: selectedAlbumId, 
          image_url: url, 
          caption: title || 'Untitled' 
        }]);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail is required for videos.");
        const [vUrl, tUrl] = await Promise.all([
          uploadToBucket(selectedFile, 'videos'), 
          uploadToBucket(thumbnailFile, 'thumbnails')
        ]);
        await supabase.from('videos').insert([{ 
          title, 
          video_url: vUrl, 
          thumbnail_url: tUrl 
        }]);
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

  if (loading || authLoading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-gold w-12 h-12" />
        <div className="absolute inset-0 blur-xl bg-gold/20 animate-pulse" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.5em] text-gold/50 font-black animate-pulse">Synchronizing Studio</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30">
      {/* AMBIENT LIGHTING */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto pt-32 pb-20 px-6">
        
        {/* DASHBOARD HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
               <div className="h-[1px] w-8 bg-gold/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Admin Console</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tighter">
              Studio <span className="text-gold italic">Control</span>
            </h1>
            <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">
              <div className="flex h-2 w-2 relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-gold"></div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString()} — System Online
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all hover:pr-14 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <Plus size={16} strokeWidth={3} /> Upload Masterpiece
              </span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                <ArrowUpRight size={18} />
              </div>
            </button>
            <button 
              onClick={() => signOut()} 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 text-gray-500 hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* ANALYTICS BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Link to="/admin/bookings" className="md:col-span-2 group glass-strong p-10 rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all relative overflow-hidden bg-white/[0.01]">
            <div className="relative z-10">
              <div className="bg-gold/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-gold group-hover:scale-110 transition-transform duration-500">
                <Calendar size={32} />
              </div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Schedule</h3>
              <div className="text-7xl font-bold tracking-tighter">{stats.bookings}</div>
              <p className="text-gray-400 text-sm mt-6 font-medium group-hover:text-gold transition-colors flex items-center gap-2">
                Manage sessions <ChevronRight size={16} />
              </p>
            </div>
            <Calendar className="absolute top-[-10%] right-[-5%] text-white/5 w-64 h-64 -rotate-12 pointer-events-none" />
          </Link>

          <div className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:border-blue-500/30 transition-all">
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-400">
              <ImageIcon size={22} />
            </div>
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Albums</h3>
            <div className="text-5xl font-bold tracking-tighter">{stats.albums}</div>
          </div>

          <div className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:border-purple-500/30 transition-all">
            <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-purple-400">
              <Video size={22} />
            </div>
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Cinematics</h3>
            <div className="text-5xl font-bold tracking-tighter">{stats.videos}</div>
          </div>
        </div>

        {/* QUICK ACCESS ARCHIVES */}
        <section className="glass-strong p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.01]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Layers className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Active Portfolio</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Select an album to manage content</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <Link to="/gallery" className="flex-1 md:flex-none text-center px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    Public View
                </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.map((album, idx) => (
              <motion.button 
                key={album.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => openAlbum(album)} 
                className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-gold/40 hover:bg-gold/[0.02] transition-all text-left"
              >
                <div className="flex items-center gap-4 truncate">
                  <div className="shrink-0 w-10 h-10 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <LayoutGrid size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight truncate">{album.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gold transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* MODAL: ALBUM VIEWER */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/80">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative glass-strong w-full max-w-7xl h-[90vh] flex flex-col p-6 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl bg-[#080808]"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gold mb-2">
                       <Sparkles size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Archive Manager</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tighter italic">{selectedAlbum.name}</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                      Collection contains {albumPhotos.length} assets
                    </p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-4 bg-white/5 hover:bg-red-500 hover:text-white rounded-full transition-all group">
                    <X className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-gold w-10 h-10" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Scanning Database...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {albumPhotos.length > 0 ? albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative bg-white/[0.02] rounded-2xl overflow-hidden border border-white/5 aspect-square shadow-lg">
                          <img src={photo.image_url} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <button 
                              onClick={() => deletePhoto(photo.id, photo.image_url)} 
                              className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                            >
                              <Trash2 size={20}/>
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Delete Permanent</span>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No assets found in this album</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: UPLOAD CENTER */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
              <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 50, opacity: 0 }}
                className="relative glass-strong w-full max-w-xl p-8 md:p-12 rounded-[3rem] border border-white/10 bg-[#080808]"
              >
                <button onClick={resetForm} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-playfair font-bold mb-2">Publish Content</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/50 italic">Juan Captures Studio Engine</p>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  {/* TYPE SWITCHER */}
                  <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => { setPostType(type as any); setSelectedFile(null); }} 
                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-white'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {postType === 'image' ? (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-[#050505]">Select Target Portfolio</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-[#050505]">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Cinematic Title</label>
                        <input required type="text" placeholder="Enter production title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-gold transition-all"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    {/* DROPZONE: MAIN FILE */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Source File</label>
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center relative hover:border-gold/40 transition-all bg-white/[0.01] group/upload">
                            <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                            <Upload className="mx-auto text-gold/40 group-hover/upload:text-gold transition-colors mb-3" size={28} />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[250px] mx-auto">
                                {selectedFile ? selectedFile.name : `Select ${postType} file`}
                            </p>
                        </div>
                    </div>
                    
                    {/* DROPZONE: THUMBNAIL (For Video Only) */}
                    {postType === 'video' && (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Video Thumbnail (Cover)</label>
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative hover:border-purple-500/40 transition-all bg-white/[0.01]">
                                <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                                <div className="flex items-center justify-center gap-3">
                                    <ImageIcon className="text-purple-400/50" size={18} />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[200px]">
                                        {thumbnailFile ? thumbnailFile.name : 'Upload Cover Image'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>

                  <button 
                    disabled={submitting} 
                    type="submit" 
                    className="w-full bg-gold text-black py-4 rounded-xl font-black flex justify-center items-center gap-3 shadow-xl shadow-gold/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
                  >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span className="text-[10px] uppercase tracking-widest">Uploading Asset...</span>
                        </>
                    ) : (
                        <span className="flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            Finalize & Publish <ArrowUpRight size={14}/>
                        </span>
                    )}
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
