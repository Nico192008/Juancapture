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
  Layers,
  ChevronRight,
  Trash2,
  ArrowUpRight,
  FileImage
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
  
  // MULTIPLE FILES STATE
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const openAlbumPreview = async (album: {id: string, name: string}) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    const { data } = await supabase.from('images').select('*').eq('album_id', album.id);
    setAlbumPhotos(data || []);
    setFetchingPhotos(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (postType === 'video') {
        setSelectedFiles([filesArray[0]]); 
      } else {
        setSelectedFiles(prev => [...prev, ...filesArray]);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    setSubmitting(true);
    try {
      const uploadFile = async (file: File, folder: string) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `${folder}/${fileName}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) throw error;
        return supabase.storage.from('portfolio').getPublicUrl(filePath).data.publicUrl;
      };

      if (postType === 'image') {
        const uploadPromises = selectedFiles.map(async (file) => {
          const url = await uploadFile(file, 'images');
          return { album_id: selectedAlbumId, image_url: url, caption: '' };
        });
        const results = await Promise.all(uploadPromises);
        await supabase.from('images').insert(results);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required");
        const [vUrl, tUrl] = await Promise.all([
          uploadFile(selectedFiles[0], 'videos'), 
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
    setSelectedFiles([]);
    setThumbnailFile(null);
    setSelectedAlbumId('');
    setTitle('');
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-bold">Initializing System</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 pb-20 overflow-x-hidden">
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.05)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto pt-10 md:pt-20 px-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4">
              Studio <span className="text-amber-500 italic">Control</span>
            </h1>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString()} — Live Session
              </span>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <Plus size={20} strokeWidth={3} /> Create Masterpiece
            </button>
            <button onClick={() => signOut()} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all group">
              <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* BENTO GRID - FIXED REDIRECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          
          {/* BOOKINGS - 2 Columns */}
          <Link to="/admin/bookings" className="md:col-span-2 group bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:border-amber-500/40 transition-all relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <Calendar className="text-amber-500 mb-8" size={36} />
              <div>
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Bookings & Schedules</h3>
                <div className="text-7xl font-bold tracking-tighter mb-4">{stats.bookings}</div>
                <div className="flex items-center text-[10px] font-black uppercase text-amber-500 gap-2">Manage Requests <ArrowUpRight size={14}/></div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 text-white/5 group-hover:text-amber-500/10 transition-colors">
              <Calendar size={220} />
            </div>
          </Link>

          {/* ALBUMS - FIXED CLICKABLE */}
          <Link to="/admin/albums" className="group bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:border-blue-400/40 transition-all relative overflow-hidden block">
            <div className="relative z-10">
              <ImageIcon className="text-blue-400 mb-8 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Image Vault</h3>
              <div className="text-5xl font-bold tracking-tighter mb-4">{stats.albums}</div>
              <p className="text-[10px] font-black uppercase text-blue-400/60 group-hover:text-blue-400 transition-colors">Enter Gallery →</p>
            </div>
          </Link>

          {/* VIDEOS - FIXED CLICKABLE */}
          <Link to="/admin/videos" className="group bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/40 transition-all relative overflow-hidden block">
            <div className="relative z-10">
              <Video className="text-purple-400 mb-8 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Cinema Hub</h3>
              <div className="text-5xl font-bold tracking-tighter mb-4">{stats.videos}</div>
              <p className="text-[10px] font-black uppercase text-purple-400/60 group-hover:text-purple-400 transition-colors">Enter Cinema →</p>
            </div>
          </Link>

        </div>

        {/* QUICK ARCHIVE LIST */}
        <section className="bg-white/5 p-10 rounded-[4rem] border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Layers size={24} />
              </div>
              <h3 className="text-3xl font-bold tracking-tight">Recent Archives</h3>
            </div>
            <Link to="/admin/albums" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-all">View Full Database</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.slice(0, 8).map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbumPreview(album)} 
                className="group flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-[1.8rem] hover:bg-white/10 transition-all text-left"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:text-amber-500 transition-colors">
                    <ImageIcon size={18} />
                  </div>
                  <span className="font-semibold truncate text-sm">{album.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        {/* MODAL: ALBUM QUICK PREVIEW */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0a0a0a] w-full max-w-6xl h-[90vh] flex flex-col p-8 md:p-12 rounded-[4rem] border border-white/10 shadow-3xl"
              >
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-4xl font-serif font-bold uppercase italic tracking-tighter">{selectedAlbum.name}</h2>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em] mt-2">Quick Preview Mode</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-5 bg-white/5 rounded-full hover:rotate-90 transition-all duration-500"><X /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albumPhotos.map(p => (
                        <div key={p.id} className="aspect-square rounded-3xl overflow-hidden border border-white/5 group relative">
                          <img src={p.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CREATE (MULTIPLE UPLOAD) */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d0d0d] w-full max-w-xl p-10 md:p-14 rounded-[4rem] border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-serif font-black">Upload Content</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-white"><X /></button>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-8">
                  <div className="flex p-1.5 bg-white/5 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button key={type} type="button" onClick={() => {setPostType(type as any); setSelectedFiles([]);}} 
                        className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}>{type}</button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {postType === 'image' ? (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Target Gallery</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-black text-gray-500">Select an album...</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Cinematic Title</label>
                        <input required type="text" placeholder="Title of the cinematic..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center hover:border-amber-500/50 transition-all bg-white/[0.02] group">
                      <input type="file" multiple={postType === 'image'} accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                      <Upload className="mx-auto text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {postType === 'image' ? "Select Multiple Images" : "Select Video Source"}
                      </p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 p-4 bg-black rounded-3xl border border-white/5">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {postType === 'video' && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{thumbnailFile ? thumbnailFile.name : "Choose Thumbnail"}</span>
                         <input type="file" accept="image/*" className="w-20 text-[10px]" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                      </div>
                    )}
                  </div>

                  <button disabled={submitting || selectedFiles.length === 0} type="submit" 
                    className="w-full bg-amber-500 text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] shadow-3xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-20">
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Deploy to Portfolio"}
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
