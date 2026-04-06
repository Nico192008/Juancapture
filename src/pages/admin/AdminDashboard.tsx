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
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

// Define explicit types para sa Album at Photo
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
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(errorMessage); 
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
      <p className="text-white font-mono text-xs tracking-widest uppercase text-center">System Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-amber-500/30">
      <div className="relative z-10 max-w-7xl mx-auto pt-10 md:pt-20 px-6 pb-20">
        
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
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95"
            >
              <Plus size={18} /> New Post
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Link to="/admin/bookings" className="md:col-span-2 group bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all min-h-[200px] flex flex-col justify-between">
            <Calendar className="text-amber-500" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Bookings</h3>
              <div className="text-6xl font-bold tracking-tighter">{stats.bookings}</div>
              <div className="mt-2 flex items-center text-[10px] text-amber-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Manage Schedule <ArrowUpRight size={12} className="ml-1"/>
              </div>
            </div>
          </Link>

          <Link to="/admin/albums" className="group bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all min-h-[200px] flex flex-col justify-between">
            <ImageIcon className="text-blue-500" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Albums</h3>
              <div className="text-6xl font-bold tracking-tighter">{stats.albums}</div>
            </div>
          </Link>

          <Link to="/admin/videos" className="group bg-[#0d0d0d] p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all min-h-[200px] flex flex-col justify-between">
            <Video className="text-purple-500" size={32} />
            <div>
              <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Videos</h3>
              <div className="text-6xl font-bold tracking-tighter">{stats.videos}</div>
            </div>
          </Link>
        </div>

        {/* RECENT ARCHIVES */}
        <section className="bg-[#0d0d0d] p-6 md:p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Layers className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold tracking-tight">Recent Archives</h3>
            </div>
            <Link to="/admin/albums" className="text-[10px] font-bold uppercase text-gray-400 hover:text-white transition-colors">See All</Link>
          </div>
          
          <div className="space-y-3">
            {albumsList.slice(0, 5).map((album) => (
              <button 
                key={album.id} 
                onClick={() => openAlbumPreview(album)} 
                className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left group"
              >
                <span className="font-medium text-sm text-gray-300 group-hover:text-white">{album.name}</span>
                <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        {/* CREATE MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d0d0d] w-full max-w-lg p-8 rounded-[2.5rem] border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">New Post</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors"><X /></button>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1 bg-white/5 rounded-xl">
                    {(['image', 'video'] as const).map((type) => (
                      <button 
                        key={type} 
                        type="button" 
                        onClick={() => {setPostType(type); setSelectedFiles([]);}} 
                        className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${postType === type ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {postType === 'image' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Album Destination</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-amber-500 transition-all appearance-none"
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="" className="bg-black">Select an album</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Video Title</label>
                      <input required type="text" placeholder="Cinematic Title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-amber-500"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                  )}

                  <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-amber-500/50 transition-all bg-white/5 group">
                    <input 
                      type="file" 
                      multiple={postType === 'image'} 
                      accept={postType === 'image' ? "image/*" : "video/*"} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileChange} 
                    />
                    <Upload className="mx-auto text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {postType === 'image' ? "Upload Images (Multiple)" : "Upload Video File"}
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/5">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                          {file.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Video size={16} /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {postType === 'video' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-gray-500 uppercase truncate max-w-[150px]">
                         {thumbnailFile ? thumbnailFile.name : "Cover Image"}
                       </span>
                       <input type="file" accept="image/*" className="w-24 text-[10px]" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                    </div>
                  )}

                  <button 
                    disabled={submitting || selectedFiles.length === 0} 
                    type="submit" 
                    className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Publish to Portfolio"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ALBUM PREVIEW MODAL */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
              <div className="bg-[#0d0d0d] w-full max-w-4xl p-8 rounded-[2.5rem] border border-white/10 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedAlbum.name}</h2>
                  <button onClick={() => setSelectedAlbum(null)} className="text-gray-500 hover:text-white"><X /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {fetchingPhotos ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" /></div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {albumPhotos.map((photo) => (
                        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                          <img src={photo.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
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
