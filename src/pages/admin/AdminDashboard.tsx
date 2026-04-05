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
  Check
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
  
  // Create Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  
  // Album View Modal States (Para sa Edit/Delete Photos)
  const [selectedAlbum, setSelectedAlbum] = useState<{id: string, name: string} | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');

  // Form States
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
      setStats({ albums: albums.data?.length || 0, videos: vids.count || 0, bookings: bookings.count || 0 });
    } finally { setLoading(false); }
  };

  // --- Photo Management Logic ---
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
      // 1. Delete sa Storage
      const path = url.split('/').pop();
      await supabase.storage.from('portfolio').remove([`images/${path}`]);
      // 2. Delete sa Database
      await supabase.from('images').delete().eq('id', id);
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert("Error deleting photo"); }
  };

  const updateCaption = async (id: string) => {
    await supabase.from('images').update({ caption: newCaption }).eq('id', id);
    setAlbumPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: newCaption } : p));
    setEditingPhotoId(null);
  };

  // --- Create Post Logic ---
  const uploadToBucket = async (file: File, folder: string) => {
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Pumili ng file.");
    setSubmitting(true);
    try {
      if (postType === 'image') {
        const url = await uploadToBucket(selectedFile, 'images');
        await supabase.from('images').insert([{ album_id: selectedAlbumId, image_url: url, caption: '' }]);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required");
        const [vUrl, tUrl] = await Promise.all([uploadToBucket(selectedFile, 'videos'), uploadToBucket(thumbnailFile, 'thumbnails')]);
        await supabase.from('videos').insert([{ title, video_url: vUrl, thumbnail_url: tUrl }]);
      }
      alert("Published!");
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

  if (loading || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-gold w-10 h-10" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#050505] text-white">
      <div className="container-custom px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-playfair font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2 font-mono text-xs uppercase tracking-widest">
              <Clock size={12} className="text-gold"/>
              <span>{currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreateModal(true)} className="bg-gold text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-gold/10">
              <Plus size={18} /> Create Post
            </button>
            <button onClick={() => signOut()} className="glass-strong p-3 rounded-xl text-gray-500 hover:text-white border border-white/5"><LogOut size={20} /></button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Bookings', count: stats.bookings, icon: Calendar, color: 'text-blue-400', link: '/admin/bookings' },
            { label: 'Albums', count: stats.albums, icon: ImageIcon, color: 'text-gold', link: '/admin/albums' },
            { label: 'Videos', count: stats.videos, icon: Video, color: 'text-purple-400', link: '/admin/videos' },
          ].map((stat) => (
            <Link key={stat.label} to={stat.link} className="glass-strong p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <div className={`${stat.color} mb-4 bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform`}><stat.icon size={22}/></div>
              <div className="text-4xl font-bold tracking-tighter">{stat.count}</div>
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
            </Link>
          ))}
        </div>

        {/* RECENT ALBUMS SECTION */}
        <div className="glass-strong p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3"><Layers className="text-gold" size={20}/> Recent Albums</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {albumsList.map(album => (
              <button key={album.id} onClick={() => openAlbum(album)} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><ImageIcon size={18}/></div>
                  <span className="font-semibold">{album.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gold" />
              </button>
            ))}
          </div>
        </div>

        {/* ALBUM PHOTO VIEWER MODAL */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlbum(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative glass-strong w-full max-w-5xl h-[80vh] flex flex-col p-8 rounded-[3rem] border border-white/10 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-gold uppercase">{selectedAlbum.name} <span className="text-gray-500 text-sm ml-2">({albumPhotos.length} photos)</span></h2>
                  <button onClick={() => setSelectedAlbum(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {fetchingPhotos ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={40}/></div> : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                          <img src={photo.image_url} alt="" className="w-full h-40 object-cover" />
                          <div className="p-3">
                            {editingPhotoId === photo.id ? (
                              <div className="flex gap-2">
                                <input autoFocus className="bg-black/50 border border-gold/50 rounded px-2 py-1 text-xs w-full outline-none" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} />
                                <button onClick={() => updateCaption(photo.id)} className="text-emerald-400"><Check size={16}/></button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] text-gray-400 truncate pr-2">{photo.caption || "No caption"}</p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingPhotoId(photo.id); setNewCaption(photo.caption || ''); }} className="text-gold"><Edit2 size={14}/></button>
                                  <button onClick={() => deletePhoto(photo.id, photo.image_url)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                              </div>
                            )}
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

        {/* CREATE POST MODAL */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative glass-strong w-full max-w-xl p-10 rounded-[3rem] border border-white/10">
                <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-tighter text-gold">Create Portfolio Post</h2>
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="flex p-1 bg-white/5 rounded-2xl">
                    <button type="button" onClick={() => setPostType('image')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'image' ? 'bg-gold text-black' : 'text-gray-500'}`}>Photo</button>
                    <button type="button" onClick={() => setPostType('video')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${postType === 'video' ? 'bg-gold text-black' : 'text-gray-500'}`}>Video</button>
                  </div>

                  {postType === 'image' ? (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-2 block tracking-widest">Select Album</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold"
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="" className="bg-black">-- Choose Album --</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-2 block tracking-widest">Video Title</label>
                      <input required type="text" placeholder="Title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative hover:border-gold transition-all">
                      <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                      <Upload className="mx-auto text-gold/30 mb-2" size={24} />
                      <p className="text-[10px] text-gray-500 truncate">{selectedFile ? selectedFile.name : `Select ${postType}`}</p>
                    </div>
                    {postType === 'video' && (
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center relative hover:border-gold transition-all">
                        <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                        <ImageIcon className="mx-auto text-purple-400/30 mb-2" size={24} />
                        <p className="text-[10px] text-gray-500 truncate">{thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail'}</p>
                      </div>
                    )}
                  </div>

                  <button disabled={submitting} type="submit" className="w-full bg-gold text-black py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-gold/20 active:scale-95 transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Publish to Portfolio'}
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
