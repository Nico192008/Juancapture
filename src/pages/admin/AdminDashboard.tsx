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
  FileText
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
    if(!confirm("Sigurado ka bang buburahin ito?")) return;
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
        setSelectedFiles([filesArray[0]]); // Isang video lang pag video type
      } else {
        setSelectedFiles(prev => [...prev, ...filesArray]); // Accumulate pag images
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
        // MULTIPLE UPLOAD LOGIC
        const uploadPromises = selectedFiles.map(async (file) => {
          const url = await uploadFile(file, 'images');
          return { album_id: selectedAlbumId, image_url: url, caption: '' };
        });
        const results = await Promise.all(uploadPromises);
        await supabase.from('images').insert(results);
      } else {
        // VIDEO LOGIC (Single upload + Thumbnail)
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 pb-10">
      {/* BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-10 md:pt-24 px-4 sm:px-6">
        
        {/* HEADER - Mobile Responsive */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-2">
              Studio <span className="text-amber-500 italic">Control</span>
            </h1>
            <div className="flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {currentTime.toLocaleTimeString()} — System Active
              </span>
            </div>
          </motion.div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all"
            >
              <Plus size={18} /> New Post
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* STATS GRID - 1 column on mobile, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <Link to="/admin/bookings" className="sm:col-span-2 group bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all">
            <Calendar className="text-amber-500 mb-4" size={28} />
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Bookings</h3>
            <div className="text-5xl font-bold">{stats.bookings}</div>
          </Link>
          <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/5">
            <ImageIcon className="text-blue-400 mb-4" size={24} />
            <div className="text-3xl font-bold">{stats.albums}</div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Albums</p>
          </div>
          <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/5">
            <Video className="text-purple-400 mb-4" size={24} />
            <div className="text-3xl font-bold">{stats.videos}</div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Videos</p>
          </div>
        </div>

        {/* ALBUMS SECTION */}
        <section className="bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Layers className="text-amber-500" size={24} />
            <h3 className="text-xl font-bold">Recent Archives</h3>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
            {albumsList.map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbum(album)} 
                className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left"
              >
                <span className="font-medium truncate pr-2 text-sm">{album.name}</span>
                <ChevronRight size={16} className="text-gray-600 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* MODAL: PHOTO LIST (View Album) */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-md">
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }}
                className="bg-[#0a0a0a] w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col p-6 md:p-10 rounded-t-[2.5rem] md:rounded-[3rem] border-t md:border border-white/10 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter">{selectedAlbum.name}</h2>
                  <button onClick={() => setSelectedAlbum(null)} className="p-3 bg-white/5 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {fetchingPhotos ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" /></div> : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={photo.image_url} className="w-full h-full object-cover" alt="" />
                          <button 
                            onClick={() => deletePhoto(photo.id, photo.image_url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg md:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CREATE (With Multiple Upload) */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d0d0d] w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">New Content</h2>
                  <button onClick={resetForm} className="text-gray-500"><X /></button>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  {/* Selector Type */}
                  <div className="flex p-1 bg-white/5 rounded-xl">
                    {['image', 'video'].map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => {setPostType(type as any); setSelectedFiles([]);}} 
                        className={`flex-1 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-amber-500 text-black' : 'text-gray-500'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Inputs */}
                  {postType === 'image' ? (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2 block">Destination Album</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-amber-500"
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="">Select an album</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2 block">Video Title</label>
                      <input required type="text" placeholder="Title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-amber-500"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                  )}

                  {/* FILE UPLOAD ZONE (Multiple Support) */}
                  <div className="space-y-4">
                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/50 transition-all bg-white/5">
                      <input 
                        type="file" 
                        multiple={postType === 'image'} 
                        accept={postType === 'image' ? "image/*" : "video/*"} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                      />
                      <Upload className="mx-auto text-amber-500 mb-2" size={24} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {postType === 'image' ? "Click to add images (Multiple)" : "Select Video File"}
                      </p>
                    </div>

                    {/* PREVIEW OF SELECTED FILES */}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-black/20 rounded-xl">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="relative aspect-square bg-white/5 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                            {file.type.startsWith('image') ? (
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <FileText size={16} className="text-amber-500" />
                            )}
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* VIDEO THUMBNAIL INPUT */}
                    {postType === 'video' && (
                      <div className="border border-white/10 rounded-xl p-4 bg-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <ImageIcon size={16} className="text-purple-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              {thumbnailFile ? thumbnailFile.name : "Cover Image"}
                            </span>
                         </div>
                         <input 
                          type="file" 
                          accept="image/*" 
                          className="w-20 text-[10px]" 
                          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} 
                         />
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={submitting || selectedFiles.length === 0} 
                    type="submit" 
                    className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Publish Now"}
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
