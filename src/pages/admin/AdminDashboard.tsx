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
  ArrowUpRight,
  Trash2,
  FileImage, // Naidagdag para sa thumbnail icon
  FolderOpen // Naidagdag para sa browse icon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

interface Album {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  image_url: string;
  album_id: string;
}

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  
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
      const [albumsRes, vidsRes, bookingsRes] = await Promise.all([
        supabase.from('albums').select('id, name').order('created_at', { ascending: false }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ]);
      
      setAlbumsList(albumsRes.data || []);
      setStats({ 
        albums: albumsRes.data?.length || 0, 
        videos: vidsRes.count || 0, 
        bookings: bookingsRes.count || 0 
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally { setLoading(false); }
  };

  const openAlbumPreview = async (album: Album) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    const { data } = await supabase.from('images').select('*').eq('album_id', album.id);
    setAlbumPhotos(data || []);
    setFetchingPhotos(false);
  };

  const handleDeletePhoto = async (photoId: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this photo permanently? This cannot be undone.")) return;

    try {
      const pathParts = imageUrl.split('/portfolio/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from('portfolio').remove([filePath]);
      }

      const { error } = await supabase.from('images').delete().eq('id', photoId);
      if (error) throw error;

      setAlbumPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      alert("Error deleting photo: " + (err as Error).message);
    }
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
        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        return data.publicUrl;
      };

      if (postType === 'image') {
        const uploadPromises = selectedFiles.map(async (file) => {
          const url = await uploadFile(file, 'images');
          return { album_id: selectedAlbumId, image_url: url, caption: '' };
        });
        const results = await Promise.all(uploadPromises);
        const { error: insertError } = await supabase.from('images').insert(results);
        if (insertError) throw insertError;
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required for video");
        const [vUrl, tUrl] = await Promise.all([
          uploadFile(selectedFiles[0], 'videos'), 
          uploadFile(thumbnailFile, 'thumbnails')
        ]);
        const { error: vidError } = await supabase.from('videos').insert([{ title, video_url: vUrl, thumbnail_url: tUrl }]);
        if (vidError) throw vidError;
      }
      
      resetForm();
      fetchDashboardData();
      alert("Successfully Published!");
    } catch (err: unknown) { 
      alert(err instanceof Error ? err.message : "An error occurred"); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setSelectedFiles([]);
    setThumbnailFile(null);
    setSelectedAlbumId('');
    setTitle('');
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} />
      <p className="text-white font-mono text-xs tracking-widest uppercase">Initializing Studio...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-amber-500/30 custom-scrollbar">
      <div className="relative z-10 max-w-7xl mx-auto pt-10 md:pt-20 px-6 pb-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-2">
              Studio <span className="text-amber-500 italic">Control</span>
            </h1>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
                {currentTime.toLocaleTimeString()} — System Active
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-white text-black px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-amber-500 transition-all active:scale-95 shadow-2xl shadow-white/5"
            >
              <Plus size={18} strokeWidth={3} /> New Publication
            </button>
            <button onClick={() => signOut()} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 text-gray-400 hover:text-red-500 transition-all group">
              <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* BENTO STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link to="/admin/bookings" className="md:col-span-2 group bg-[#0d0d0d] p-10 rounded-[2.5rem] border border-white/5 hover:border-amber-500/30 transition-all min-h-[220px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar size={120} />
            </div>
            <Calendar className="text-amber-500 group-hover:scale-110 transition-transform" size={36} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Schedule</h3>
              <div className="text-7xl font-bold tracking-tighter">{stats.bookings}</div>
              <div className="mt-4 flex items-center text-[10px] text-amber-500 font-bold uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                Manage Schedule <ArrowUpRight size={12} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
              </div>
            </div>
          </Link>

          <Link to="/admin/albums" className="group bg-[#0d0d0d] p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between relative overflow-hidden">
            <ImageIcon className="text-blue-500 group-hover:scale-110 transition-transform" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Image Vault</h3>
              <div className="text-5xl font-bold tracking-tighter">{stats.albums}</div>
            </div>
          </Link>

          <Link to="/admin/videos" className="group bg-[#0d0d0d] p-10 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between relative overflow-hidden">
            <Video className="text-purple-500 group-hover:scale-110 transition-transform" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Cinema Hub</h3>
              <div className="text-5xl font-bold tracking-tighter">{stats.videos}</div>
            </div>
          </Link>
        </div>

        {/* QUICK ARCHIVES */}
        <section className="bg-[#0d0d0d] p-10 md:p-12 rounded-[3.5rem] border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10 shadow-lg shadow-amber-500/5">
                <Layers size={24} />
              </div>
              <h3 className="text-3xl font-bold tracking-tight">Recent Archives</h3>
            </div>
            <Link to="/admin/albums" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">Manage All Collections</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.slice(0, 8).map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbumPreview(album)} 
                className="group flex items-center justify-between p-6 bg-black border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all text-left"
              >
                <div className="flex items-center gap-4 overflow-hidden pr-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-amber-500 transition-colors">
                    <ImageIcon size={18} />
                  </div>
                  <span className="font-semibold truncate text-gray-300 group-hover:text-white transition-colors">{album.name}</span>
                </div>
                <ChevronRight size={18} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </section>

        {/* --- MODAL: CREATE POST --- */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#0d0d0d] w-full max-w-xl p-10 md:p-14 rounded-[3.5rem] border border-white/10 max-h-[95vh] overflow-y-auto custom-scrollbar relative">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-serif font-bold tracking-tighter">New Masterpiece</h2>
                  <button onClick={resetForm} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-white transition-colors hover:rotate-90 transition-transform"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-8">
                  <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
                    {(['image', 'video'] as const).map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => {setPostType(type); setSelectedFiles([]);}} 
                        className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${postType === type ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {type} Portfolio
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {postType === 'image' ? (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Destination Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-black text-gray-500">Choose a gallery collection...</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Film Title</label>
                        <input required type="text" placeholder="Cinematic title of your creation..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    {/* SOURCE FILE */}
                    <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center hover:border-amber-500/40 transition-all bg-white/[0.01] group cursor-pointer">
                      <input 
                        type="file" 
                        multiple={postType === 'image'} 
                        accept={postType === 'image' ? "image/*" : "video/*"} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={handleFileChange} 
                      />
                      <div className="relative z-0">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="text-amber-500" size={28} />
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          {selectedFiles.length > 0 ? `${selectedFiles.length} files indexed` : `Index ${postType} source files`}
                        </p>
                      </div>
                    </div>

                    {/* IMAGE PREVIEW */}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 p-4 bg-black/40 rounded-3xl border border-white/5">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-inner">
                            {file.type.startsWith('image') ? (
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-purple-500/10 text-purple-500 text-xs gap-1"><Video size={20} />Film</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* VIDEO THUMBNAIL UI (FIXED) */}
                    {postType === 'video' && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Film Cover Image</label>
                        
                        <div className="group relative w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-purple-500/50 transition-colors overflow-hidden">
                           <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                           
                           {/* Preview Section */}
                           <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative z-10">
                              {thumbnailFile ? (
                                <img src={URL.createObjectURL(thumbnailFile)} className="w-full h-full object-cover" alt="thumbnail" />
                              ) : (
                                <FileImage size={24} className="text-purple-400 opacity-60" />
                              )}
                           </div>
                           
                           {/* Text Section */}
                           <div className="flex flex-col flex-1 relative z-10">
                              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Required</span>
                              <span className="text-sm font-semibold text-gray-300 truncate max-w-[200px]">
                                 {thumbnailFile ? thumbnailFile.name : "Select cover artwork..."}
                              </span>
                           </div>

                           {/* Browse Icon */}
                           <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-black transition-all ml-auto relative z-10">
                              <FolderOpen size={18}/>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={submitting || selectedFiles.length === 0} 
                    type="submit" 
                    className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-amber-500/30 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale"
                  >
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : `Finalize & Publish to Portfolio`}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL: ALBUM PREVIEW (WITH DELETE) --- */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl">
              <div className="bg-[#0d0d0d] w-full max-w-6xl p-10 md:p-14 rounded-[3.5rem] border border-white/10 max-h-[92vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-4xl font-serif font-bold tracking-tighter">{selectedAlbum.name}</h2>
                    <p className="text-[10px] font-black text-amber-500/60 tracking-[0.4em] mt-1">Found {albumPhotos.length} Masterpieces</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-colors hover:rotate-90 transition-transform"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                      <Loader2 className="animate-spin text-amber-500" size={40} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Indexing Files...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albumPhotos.length === 0 && <p className="col-span-full text-center text-gray-600 py-10">No visual assets in this collection.</p>}
                      {albumPhotos.map((photo) => (
                        <div key={photo.id} className="relative aspect-square rounded-[1.8rem] overflow-hidden border border-white/5 group bg-white/[0.02]">
                          <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                          
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px] flex items-center justify-center">
                            <button 
                              onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                              className="p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-500/20"
                              title="Delete from Archive"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* CUSTOM CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.4); }
      `}</style>
    </div>
  );
};
