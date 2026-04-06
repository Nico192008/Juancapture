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
  Trash2 
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
    if (!window.confirm("Are you sure you want to delete this photo permanently?")) return;

    try {
      // 1. Delete from Supabase Storage
      const pathParts = imageUrl.split('/portfolio/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from('portfolio').remove([filePath]);
      }

      // 2. Delete from Database
      const { error } = await supabase.from('images').delete().eq('id', photoId);
      if (error) throw error;

      // 3. UI Update
      setAlbumPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      alert("Error: " + (err as Error).message);
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
      alert("Success!");
    } catch (err: unknown) { 
      alert(err instanceof Error ? err.message : "Error occurred"); 
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
      <p className="text-white font-mono text-xs tracking-widest uppercase">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto pt-10 md:pt-20 px-6 pb-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-2">
              Studio <span className="text-amber-500 italic">Control</span>
            </h1>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
              {currentTime.toLocaleTimeString()} — Status: <span className="text-green-500">Active</span>
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
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

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/admin/bookings" className="md:col-span-2 group bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between min-h-[200px]">
            <Calendar className="text-amber-500" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Bookings</h3>
              <div className="text-6xl font-bold tracking-tighter">{stats.bookings}</div>
            </div>
          </Link>

          <Link to="/admin/albums" className="bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between">
            <ImageIcon className="text-blue-500" size={32} />
            <div className="text-4xl font-bold">{stats.albums}</div>
          </Link>

          <Link to="/admin/videos" className="bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between">
            <Video className="text-purple-500" size={32} />
            <div className="text-4xl font-bold">{stats.videos}</div>
          </Link>
        </div>

        {/* RECENT LIST */}
        <section className="bg-[#0d0d0d] p-6 md:p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Recent Archives</h3>
            <Link to="/admin/albums" className="text-[10px] font-bold uppercase text-gray-500">View All</Link>
          </div>
          
          <div className="space-y-3">
            {albumsList.slice(0, 5).map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbumPreview(album)} 
                className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
              >
                <span className="text-sm font-medium">{album.name}</span>
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            ))}
          </div>
        </section>

        {/* CREATE POST MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0d0d0d] w-full max-w-lg p-8 rounded-[2.5rem] border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">New Post</h2>
                  <button onClick={resetForm}><X /></button>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1 bg-white/5 rounded-xl">
                    {['image', 'video'].map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => setPostType(type as any)} 
                        className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-amber-500 text-black' : 'text-gray-500'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {postType === 'image' ? (
                    <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none"
                      value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                      <option value="" className="bg-black">Select Album</option>
                      {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                    </select>
                  ) : (
                    <input required type="text" placeholder="Video Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  )}

                  <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-10 text-center bg-white/5">
                    <input type="file" multiple={postType === 'image'} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <Upload className="mx-auto text-amber-500 mb-2" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Click to upload files</p>
                  </div>

                  {postType === 'video' && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Video Thumbnail</p>
                      <input type="file" accept="image/*" className="text-xs" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                    </div>
                  )}

                  <button 
                    disabled={submitting || selectedFiles.length === 0} 
                    type="submit" 
                    className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold uppercase text-xs tracking-widest disabled:opacity-20"
                  >
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Publish"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ALBUM PREVIEW MODAL (WITH TRASH ICON) */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <div className="bg-[#0d0d0d] w-full max-w-5xl p-8 rounded-[2.5rem] border border-white/10 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedAlbum.name}</h2>
                  <button onClick={() => setSelectedAlbum(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" /></div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albumPhotos.length === 0 && <p className="text-gray-600 col-span-full text-center py-10">Album is empty.</p>}
                      {albumPhotos.map((photo) => (
                        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-white/5 group">
                          <img src={photo.image_url} className="w-full h-full object-cover" alt="" />
                          
                          {/* TRASH BUTTON - ALWAYS VISIBLE ON TOP */}
                          <button 
                            onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                            className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 active:scale-90 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* DARK OVERLAY ON HOVER */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
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
    </div>
  );
};
