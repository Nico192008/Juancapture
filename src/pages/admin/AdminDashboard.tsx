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
      console.error("Error fetching data:", err);
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
    if(!confirm("Are you sure you want to delete this?")) return;
    try {
      const path = url.split('/').pop();
      await supabase.storage.from('portfolio').remove([`images/${path}`]);
      await supabase.from('images').delete().eq('id', id);
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert("Delete failed"); }
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

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
    } catch (err: any) { 
      alert(err.message); 
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
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-bold">Initializing Studio</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 pb-20">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-10 md:pt-24 px-4 sm:px-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-2">
              Studio <span className="text-amber-500 italic">Control</span>
            </h1>
            <div className="bg-white/5 border border-white/10 px-4 py-1 rounded-full w-fit">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
                {currentTime.toLocaleTimeString()} — Online
              </span>
            </div>
          </motion.div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> New Entry
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* BENTO STATS GRID - FIXED CLICKABLE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* BOOKINGS CARD */}
          <Link to="/admin/bookings" className="sm:col-span-2 group relative overflow-hidden bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/30 transition-all duration-500">
            <Calendar className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Schedule</h3>
            <div className="text-6xl font-bold tracking-tighter">{stats.bookings}</div>
            <div className="mt-6 flex items-center text-[10px] uppercase font-bold text-gray-500 group-hover:text-amber-500 transition-colors">
              Manage Bookings <ArrowUpRight size={14} className="ml-1" />
            </div>
          </Link>

          {/* ALBUMS CARD - FIXED LINK */}
          <Link to="/admin/albums" className="group bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-400/30 transition-all duration-500">
            <ImageIcon className="text-blue-400 mb-6 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Gallery</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.albums}</div>
            <p className="text-[10px] mt-4 text-gray-600 uppercase font-bold group-hover:text-blue-400">View Albums</p>
          </Link>

          {/* VIDEOS CARD - FIXED LINK */}
          <Link to="/admin/videos" className="group bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500">
            <Video className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Cinema</h3>
            <div className="text-4xl font-bold tracking-tighter">{stats.videos}</div>
            <p className="text-[10px] mt-4 text-gray-600 uppercase font-bold group-hover:text-purple-400">View Videos</p>
          </Link>
        </div>

        {/* QUICK ACCESS: ALBUM LIST */}
        <section className="bg-white/5 p-8 md:p-10 rounded-[3rem] border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Layers className="text-amber-500" size={24} />
              <h3 className="text-2xl font-bold tracking-tight">Recent Projects</h3>
            </div>
            <Link to="/admin/albums" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Manage All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.slice(0, 8).map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbum(album)} 
                className="group flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left"
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

        {/* MODAL: ALBUM VIEWER (MOBILE RESPONSIVE) */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl">
              <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 100, opacity: 0 }}
                className="bg-[#0a0a0a] w-full max-w-6xl h-[90vh] md:h-[85vh] flex flex-col p-6 md:p-10 rounded-t-[3rem] md:rounded-[3.5rem] border-t md:border border-white/10"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold uppercase italic tracking-tighter">{selectedAlbum.name}</h2>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">Collection Gallery</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <X size={20}/>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <Loader2 className="animate-spin text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Loading Assets...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5">
                          <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => deletePhoto(photo.id, photo.image_url)}
                              className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform shadow-xl"
                            >
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

        {/* MODAL: CREATE NEW (MULTIPLE UPLOAD) */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d0d0d] w-full max-w-xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 max-h-[95vh] overflow-y-auto relative custom-scrollbar">
                <button onClick={resetForm} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X /></button>
                
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif font-bold mb-2 text-white">New Archive</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Add to your professional portfolio</p>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-8">
                  {/* TYPE SWITCHER */}
                  <div className="flex p-1.5 bg-white/5 rounded-2xl">
                    {(['image', 'video'] as const).map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => {setPostType(type); setSelectedFiles([]);}} 
                        className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* FORM FIELDS */}
                  <div className="space-y-4">
                    {postType === 'image' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Select Target Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-black">Choose Destination...</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Production Title</label>
                        <input required type="text" placeholder="Title of the cinematic..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    {/* DROPZONE */}
                    <div className="relative border-2 border-dashed border-white/10 rounded-[2rem] p-10 text-center hover:border-amber-500/50 transition-all bg-white/[0.02] group">
                      <input 
                        type="file" 
                        multiple={postType === 'image'} 
                        accept={postType === 'image' ? "image/*" : "video/*"} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                      />
                      <Upload className="mx-auto text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {postType === 'image' ? "Select Images (Multiple)" : "Select Video File"}
                      </p>
                    </div>

                    {/* PREVIEW OF MULTIPLE FILES */}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                            {file.type.startsWith('image') ? (
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/5"><Video size={16}/></div>
                            )}
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:scale-110"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* VIDEO THUMBNAIL */}
                    {postType === 'video' && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <FileImage size={20} className="text-purple-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              {thumbnailFile ? thumbnailFile.name : "Cover Image Required"}
                            </span>
                         </div>
                         <label className="cursor-pointer bg-white/10 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-white/20">
                           Browse
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                         </label>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button 
                    disabled={submitting || selectedFiles.length === 0} 
                    type="submit" 
                    className="w-full bg-amber-500 text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Uploading Files...</span>
                      </div>
                    ) : (
                      "Publish To Portfolio"
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
