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
  Trash2,
  LayoutGrid,
  FolderPlus,
  Settings,
  Edit2
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
  
  // Modals & Selection States
  const [activeModal, setActiveModal] = useState<'image' | 'video' | 'createAlbum' | 'editPhoto' | null>(null);
  const [selectedAlbumView, setSelectedAlbumView] = useState<Album | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  
  // Data States
  const [albumsList, setAlbumsList] = useState<Album[]>([]);
  const [photosInAlbum, setPhotosInAlbum] = useState<Photo[]>([]);
  
  // Form States
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');

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
    setStats({ albums: albums.count || 0, videos: videos.count || 0, bookings: bookings.count || 0 });
  };

  const fetchAlbums = async () => {
    const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
    if (data) setAlbumsList(data);
  };

  const fetchPhotos = async (albumId: string) => {
    const { data } = await supabase.from('images').select('*').eq('album_id', albumId);
    if (data) setPhotosInAlbum(data);
  };

  // --- HANDLERS ---

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('albums').insert([{ name: newAlbumName }]);
      if (error) throw error;
      alert("Album created!");
      closeModal();
      fetchInitialData();
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Pumili ng file.");
    setSubmitting(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucketPath = activeModal === 'image' ? `images/${fileName}` : `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('portfolio').upload(bucketPath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(bucketPath);

      if (activeModal === 'image') {
        const { error } = await supabase.from('images').insert([{ album_id: selectedAlbumId, url: publicUrl }]);
        if (error) throw error;
        if (selectedAlbumView?.id === selectedAlbumId) fetchPhotos(selectedAlbumId);
      } else {
        const { error } = await supabase.from('videos').insert([{ title: videoTitle, url: publicUrl }]);
        if (error) throw error;
      }

      alert("Upload successful!");
      closeModal();
      fetchStats();
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleDeletePhoto = async (photoId: string, url: string) => {
    if (!confirm("Sigurado ka bang buburahin ang litratong ito?")) return;
    try {
      const path = url.split('portfolio/')[1];
      await supabase.storage.from('portfolio').remove([path]);
      await supabase.from('images').delete().eq('id', photoId);
      if (selectedAlbumView) fetchPhotos(selectedAlbumView.id);
    } catch (err) { alert("Error deleting photo"); }
  };

  const handleUpdatePhotoAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !selectedAlbumId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('images').update({ album_id: selectedAlbumId }).eq('id', editingPhoto.id);
      if (error) throw error;
      alert("Photo updated!");
      closeModal();
      if (selectedAlbumView) fetchPhotos(selectedAlbumView.id);
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedFile(null);
    setSelectedAlbumId('');
    setVideoTitle('');
    setNewAlbumName('');
    setEditingPhoto(null);
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-gold w-10 h-10" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black text-white">
      <div className="container-custom px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-playfair font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 text-xs">Logged in as {user?.email}</p>
          </div>
          <button onClick={() => signOut()} className="btn-gold-outline flex items-center gap-2 py-2 px-4 text-sm"><LogOut size={16}/> Sign Out</button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <button onClick={() => setActiveModal('createAlbum')} className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-gold hover:text-black transition-all group">
            <FolderPlus className="text-gold group-hover:text-black" />
            <div className="text-left font-bold"><p className="text-[10px] opacity-60">NEW</p> ALBUM</div>
          </button>
          
          <button onClick={() => setActiveModal('image')} className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-gold hover:text-black transition-all group">
            <Upload className="text-gold group-hover:text-black" />
            <div className="text-left font-bold"><p className="text-[10px] opacity-60">UPLOAD</p> IMAGE</div>
          </button>

          <Link to="/admin/bookings" className="flex items-center gap-3 p-5 bg-gold text-black rounded-2xl hover:bg-white transition-all">
            <Calendar />
            <div className="text-left font-bold"><p className="text-[10px] opacity-60">CLIENT</p> BOOKINGS</div>
          </Link>

          <Link to="/admin/albums" className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-gold transition-all group">
            <Settings className="text-gold group-hover:rotate-90 transition-transform" />
            <div className="text-left font-bold"><p className="text-[10px] opacity-60">MANAGE</p> ALBUMS</div>
          </Link>
        </div>

        {/* Album Explorer */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold"><LayoutGrid size={20}/> Manage Photos in Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albumsList.map(album => (
              <button 
                key={album.id}
                onClick={() => { setSelectedAlbumView(album); fetchPhotos(album.id); }}
                className={`p-5 rounded-2xl border transition-all text-left ${selectedAlbumView?.id === album.id ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <ImageIcon size={18} className="mb-2 opacity-50"/>
                <div className="font-bold text-sm truncate">{album.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Management Gallery */}
        <AnimatePresence>
          {selectedAlbumView && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8 rounded-3xl border border-white/10 mb-20 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Album: <span className="text-gold">{selectedAlbumView.name}</span></h3>
                <button onClick={() => setSelectedAlbumView(null)} className="text-gray-500 hover:text-white flex items-center gap-2"><X size={20}/> Close Gallery</button>
              </div>

              {photosInAlbum.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photosInAlbum.map(photo => (
                    <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                      <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => { setEditingPhoto(photo); setSelectedAlbumId(photo.album_id); setActiveModal('editPhoto'); }} className="p-3 bg-white text-black rounded-full hover:bg-gold transition-colors"><Edit2 size={18}/></button>
                        <button onClick={() => handleDeletePhoto(photo.id, photo.url)} className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl text-gray-500">Walang litrato sa album na ito.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL SYSTEM */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong w-full max-w-md p-8 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gold uppercase tracking-tighter">
                    {activeModal === 'createAlbum' && 'New Album'}
                    {activeModal === 'image' && 'Add Image'}
                    {activeModal === 'editPhoto' && 'Move Photo'}
                  </h2>
                  <button onClick={closeModal}><X/></button>
                </div>

                <form onSubmit={activeModal === 'editPhoto' ? handleUpdatePhotoAlbum : activeModal === 'createAlbum' ? handleCreateAlbum : handleFileUpload} className="space-y-6">
                  {activeModal === 'createAlbum' && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Album Name</label>
                      <input required type="text" placeholder="e.g. Wedding 2024" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold"
                        value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} />
                    </div>
                  )}

                  {(activeModal === 'image' || activeModal === 'editPhoto') && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Target Album</label>
                      <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-gold" 
                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        <option value="" className="bg-black">-- Choose Album --</option>
                        {albumsList.map(a => <option key={a.id} value={a.id} className="bg-black">{a.name}</option>)}
                      </select>
                    </div>
                  )}

                  {activeModal === 'image' && (
                    <div className="border-2 border-dashed border-white/10 p-8 rounded-2xl text-center relative hover:border-gold transition-colors">
                      <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                      <Upload className="mx-auto text-gold mb-2 opacity-50" size={32}/>
                      <p className="text-xs text-gray-500">{selectedFile ? selectedFile.name : 'Select image file'}</p>
                    </div>
                  )}

                  <button disabled={submitting} type="submit" className="w-full btn-gold py-4 rounded-2xl font-bold flex justify-center items-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Action'}
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
