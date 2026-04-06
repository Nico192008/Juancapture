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
  Play,
  Layers,
  Edit2,
  Check,
  Settings,
  ArrowUpRight
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
  
  // Modal & Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{id: string, name: string} | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');
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
    } finally { setLoading(false); }
  };

  const openAlbum = async (album: {id: string, name: string}) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    const { data } = await supabase.from('images').select('*').eq('album_id', album.id);
    setAlbumPhotos(data || []);
    setFetchingPhotos(false);
  };

  const deletePhoto = async (id: string, url: string) => {
    if(!confirm("Are you sure you want to delete this memory?")) return;
    try {
      const path = url.split('/').pop();
      await supabase.storage.from('portfolio').remove([`images/${path}`]);
      await supabase.from('images').delete().eq('id', id);
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setSubmitting(true);
    try {
      const uploadToBucket = async (file: File, folder: string) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `${folder}/${fileName}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) throw error;
        return supabase.storage.from('portfolio').getPublicUrl(filePath).data.publicUrl;
      };

      if (postType === 'image') {
        const url = await uploadToBucket(selectedFile, 'images');
        await supabase.from('images').insert([{ album_id: selectedAlbumId, image_url: url, caption: '' }]);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required");
        const [vUrl, tUrl] = await Promise.all([
          uploadToBucket(selectedFile, 'videos'), 
          uploadToBucket(thumbnailFile, 'thumbnails')
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
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold w-8 h-8" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-bold">Initializing Studio</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30">
      {/* BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container-custom pt-32 pb-20 px-6">
        
        {/* TOP NAVIGATION BAR-LIKE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-playfair font-bold tracking-tighter mb-2">
              Studio <span className="text-gold italic">Control</span>
            </h1>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} — System Active
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4">
            <button onClick={() => setShowCreateModal(true)} className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all hover:pr-12">
              <span className="relative z-10 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Plus size={16} strokeWidth={3} /> New Masterpiece
              </span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                <ArrowUpRight size={18} />
              </div>
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 text-gray-400 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </motion.div>
        </header>

        {/* BENTO GRID STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Link to="/admin/bookings" className="md:col-span-2 group glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform duration-500">
                <Calendar size={28} />
              </div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Upcoming Schedule</h3>
              <div className="text-6xl font-bold tracking-tighter">{stats.bookings}</div>
              <p className="text-gray-600 text-sm mt-4 font-medium group-hover:text-gray-400 transition-colors">Manage all photography sessions & clients →</p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar size={120} />
            </div>
          </Link>

          <Link to="/admin/albums" className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all">
            <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-400">
              <ImageIcon size={22} />
            </div>
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Albums</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.albums}</div>
          </Link>

          <Link to="/admin/videos" className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all">
            <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-purple-400">
              <Video size={22} />
            </div>
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Cinematics</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.videos}</div>
          </Link>
        </div>

        {/* RECENT WORK SECTION */}
        <section className="glass-strong p-10 rounded-[3rem] border border-white/5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                <Layers className="text-gold" size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Recent Archives</h3>
            </div>
            <Link to="/admin/albums" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gold transition-colors">View All Projects</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.slice(0, 8).map((album, idx) => (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={album.id} 
                onClick={() => openAlbum(album)} 
                className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-white/[0.08] hover:border-gold/20 transition-all text-left"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="shrink-0 w-10 h-10 bg-black rounded-lg border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <ImageIcon size={18} />
                  </div>
                  <span className="font-semibold truncate">{album.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gold transition-colors" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* MODALS - Cleaned up with better spacing and contrast */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-strong w-full max-w-6xl h-[85vh] flex flex-col p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">{selectedAlbum.name}</h2>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Found {albumPhotos.length} Masterpieces in this collection</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
                    <X className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {fetchingPhotos ? <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="animate-spin text-gold" /><p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Retrieving Files...</p></div> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative bg-white/[0.02] rounded-[1.5rem] overflow-hidden border border-white/5 aspect-square">
                          <img src={photo.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => deletePhoto(photo.id, photo.image_url)} className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                            </div>
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

        {/* CREATE POST MODAL - Refined */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative glass-strong w-full max-w-xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
                <button onClick={resetForm} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
                <h2 className="text-3xl font-playfair font-bold mb-10 text-center">New Content</h2>
                
                <form onSubmit={handleCreatePost} className="space-y-8">
                  <div className="flex p-1.5 bg-black/40 border border-white/5 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button key={type} type="button" onClick={() => setPostType(type as any)} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{type}</button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {postType === 'image' ? (
                      <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 mb-2 block tracking-widest group-focus-within:text-gold transition-colors">Target Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-[#050505]">Select Destination</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-[#050505]">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 mb-2 block tracking-widest group-focus-within:text-gold transition-colors">Production Title</label>
                        <input required type="text" placeholder="Cinematic Title..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 text-center relative hover:border-gold/50 transition-all bg-white/[0.02] group/upload">
                        <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <Upload className="mx-auto text-gold mb-4 group-hover/upload:scale-110 transition-transform" size={32} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {selectedFile ? selectedFile.name : `Drop ${postType} file`}
                        </p>
                      </div>
                      
                      {postType === 'video' && (
                        <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center relative hover:border-purple-500/50 transition-all bg-white/[0.02]">
                          <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                          <div className="flex items-center justify-center gap-3">
                            <ImageIcon className="text-purple-400" size={20} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {thumbnailFile ? thumbnailFile.name : 'Choose Cover Image'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full bg-gold text-black py-5 rounded-2xl font-bold flex justify-center items-center gap-3 shadow-2xl shadow-gold/20 active:scale-95 transition-all disabled:opacity-50 group">
                    {submitting ? <Loader2 className="animate-spin" /> : (
                      <span className="flex items-center gap-2 uppercase text-xs tracking-widest">Publish to Portfolio <ArrowUpRight size={16}/></span>
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
