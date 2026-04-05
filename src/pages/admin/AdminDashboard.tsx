import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FileVideo,
  ChevronRight,
  Trash2,
  LayoutGrid
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

interface Album {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  url: string;
  album_id: string;
}

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  
  // States para sa Navigation/View
  const [activeModal, setActiveModal] = useState<'image' | 'video' | null>(null);
  const [selectedAlbumView, setSelectedAlbumView] = useState<Album | null>(null);
  
  // Data States
  const [albumsList, setAlbumsList] = useState<Album[]>([]);
  const [photosInAlbum, setPhotosInAlbum] = useState<Photo[]>([]);
  
  // Form States
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchInitialData();
  }, [user, isAdmin, navigate, authLoading]);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchAlbums()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    const [albums, videos, bookings] = await Promise.all([
      supabase.from('albums').select('id', { count: 'exact', head: true }),
      supabase.from('videos').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
    ]);
    setStats({
      albums: albums.count || 0,
      videos: videos.count || 0,
      bookings: bookings.count || 0,
    });
  };

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('id, name');
    if (data) setAlbumsList(data);
  };

  const fetchPhotos = async (albumId: string) => {
    const { data } = await supabase.from('images').select('*').eq('album_id', albumId);
    if (data) setPhotosInAlbum(data);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Pumili ng file.");
    
    setSubmitting(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucketFolder = activeModal === 'image' ? 'images' : 'videos';
      const filePath = `${bucketFolder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (activeModal === 'image') {
        const { error } = await supabase.from('images').insert([{ album_id: selectedAlbumId, url: publicUrl }]);
        if (error) throw error;
        // Automatic na i-update ang view kung ito ang kasalukuyang tinitignan
        if (selectedAlbumView?.id === selectedAlbumId) fetchPhotos(selectedAlbumId);
      } else {
        const { error } = await supabase.from('videos').insert([{ title: videoTitle, url: publicUrl }]);
        if (error) throw error;
      }

      alert("Upload Success!");
      closeModal();
      fetchStats();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePhoto = async (photoId: string, url: string) => {
    if (!confirm("Sigurado ka bang buburahin ito?")) return;
    try {
      // 1. Burahin sa Storage (Optional pero recommended para hindi puno ang storage)
      const path = url.split('portfolio/')[1];
      await supabase.storage.from('portfolio').remove([path]);
      
      // 2. Burahin sa Database
      await supabase.from('images').delete().eq('id', photoId);
      
      // 3. Refresh list
      if (selectedAlbumView) fetchPhotos(selectedAlbumView.id);
    } catch (error) {
      alert("Error deleting photo");
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedFile(null);
    setSelectedAlbumId('');
    setVideoTitle('');
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black text-white">
      <div className="container-custom px-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-playfair font-bold">Admin Panel</h1>
            <p className="text-gray-500 text-xs mt-1">MANAGEMENT & UPLOADS</p>
          </div>
          <button onClick={() => signOut()} className="btn-gold-outline flex items-center gap-2 py-2 px-4 text-sm"><LogOut size={16}/> Logout</button>
        </div>

        {/* Stats & Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Upload Buttons */}
          <div className="glass-strong p-6 rounded-2xl border border-white/5 flex flex-col justify-center gap-4">
            <button onClick={() => setActiveModal('image')} className="w-full flex items-center justify-between p-4 bg-gold text-black rounded-xl font-bold hover:bg-white transition-all">
              <span className="flex items-center gap-2"><Upload size={18}/> Add New Image</span>
              <Plus size={18}/>
            </button>
            <button onClick={() => setActiveModal('video')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
              <span className="flex items-center gap-2"><FileVideo size={18}/> Add New Video</span>
              <Plus size={18}/>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4">
            {[
              { label: 'Albums', val: stats.albums, icon: ImageIcon },
              { label: 'Videos', val: stats.videos, icon: Video },
              { label: 'Requests', val: stats.bookings, icon: Calendar },
            ].map(s => (
              <div key={s.label} className="glass-strong p-6 rounded-2xl border border-white/5">
                <s.icon className="text-gold mb-2" size={20}/>
                <div className="text-3xl font-bold">{s.val}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ALBUM EXPLORER (MGA ALBUMS MO) --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><LayoutGrid size={20} className="text-gold"/> Album Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albumsList.map(album => (
              <button 
                key={album.id}
                onClick={() => { setSelectedAlbumView(album); fetchPhotos(album.id); }}
                className={`p-4 rounded-xl border transition-all text-left ${selectedAlbumView?.id === album.id ? 'bg-gold text-black border-gold' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                <ImageIcon size={20} className="mb-2 opacity-50"/>
                <div className="font-bold text-sm truncate">{album.name}</div>
                <div className="text-[9px] uppercase opacity-60">View Content</div>
              </button>
            ))}
          </div>
        </div>

        {/* --- PHOTO PREVIEW (ANG LAMAN NG ALBUM) --- */}
        <AnimatePresence>
          {selectedAlbumView && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-playfair font-bold text-gold">Photos in: {selectedAlbumView.name}</h3>
                <button onClick={() => setSelectedAlbumView(null)} className="text-gray-500 hover:text-white flex items-center gap-1 text-sm"><X size={16}/> Close Gallery</button>
              </div>

              {photosInAlbum.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photosInAlbum.map(photo => (
                    <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => deletePhoto(photo.id, photo.url)} className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl text-gray-600">
                  <ImageIcon className="mx-auto mb-2 opacity-20" size={48}/>
                  <p>Walang litrato sa album na ito. Magsimulang mag-upload!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- UPLOAD MODALS --- */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-strong w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8 text-gold">
                  <h2 className="text-2xl font-bold uppercase tracking-widest">New {activeModal}</h2>
                  <button onClick={closeModal}><X/></button>
                </div>

                <form onSubmit={handleFileUpload} className="space-y-6">
                  {activeModal === 'image' ? (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2 ml-1">Destination Album</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" 
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="" className="bg-black text-gray-500">-- Choose Album --</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2 ml-1">Video Title</label>
                      <input required type="text" placeholder="e.g. Wedding Highlight" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
                        value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-white/10 p-8 rounded-2xl text-center hover:border-gold/50 transition-colors cursor-pointer relative">
                    <input required type="file" accept={activeModal === 'image' ? 'image/*' : 'video/*'} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <Upload className="mx-auto text-gold/50 mb-3" size={32}/>
                    <p className="text-xs text-gray-400">{selectedFile ? selectedFile.name : `Select ${activeModal} file`}</p>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full btn-gold py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-gold/20">
                    {submitting ? <Loader2 className="animate-spin" /> : <><Upload size={18}/> Confirm Upload</>}
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
