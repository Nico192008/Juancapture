import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload, Loader2, Calendar, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Album } from '../../types';

export const ManageAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    cover_image: '',
    description: ''
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanData = {
        name: formData.name.trim(),
        date: formData.date,
        cover_image: formData.cover_image,
        description: formData.description.trim()
      };

      if (editingAlbum) {
        const { error } = await supabase
          .from('albums')
          .update(cleanData)
          .eq('id', editingAlbum.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('albums')
          .insert([cleanData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAlbums();
      resetForm();
    } catch (error) {
      alert('Error saving album details');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingAlbum(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      cover_image: '',
      description: ''
    });
  };

  const openModal = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        name: album.name,
        date: album.date,
        cover_image: album.cover_image || '',
        description: (album as any).description || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;
    try {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      fetchAlbums();
    } catch (error) {
      alert('Error deleting album');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black text-white font-sans">
      <div className="container-custom px-6">
        {/* HEADER - Styled like Manage Bookings */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white">Manage Portfolio</h1>
            <p className="text-gray-400 mt-2">Curate and organize your professional photography collections</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all">
              <ChevronLeft size={16} /> Back
            </Link>
            <button 
              onClick={() => openModal()} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gold hover:bg-gold/80 text-black px-6 py-3 rounded-full font-bold transition-all"
            >
              <Plus size={20} /> Add Collection
            </button>
          </div>
        </div>

        {loading && !isModalOpen ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin h-12 w-12 text-gold mb-4" />
            <p className="text-gray-500 italic">Loading your masterpieces...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-strong p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden border border-white/10">
                    <img 
                      src={album.cover_image || 'https://via.placeholder.com/800x600?text=No+Cover'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={album.name} 
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-playfair font-bold text-white mb-2">{album.name}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1 text-gold">
                            <Calendar size={14} /> {new Date(album.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <ImageIcon size={14} /> Portfolio Collection
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => openModal(album)} 
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => deleteAlbum(album.id)} 
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Description</p>
                       <p className="text-gray-400 text-sm italic">
                        {album.description || "No description provided for this collection."}
                       </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {albums.length === 0 && (
              <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <ImageIcon className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 text-lg">Your portfolio is empty. Time to showcase your work!</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL - Same look as Manage Bookings */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-strong w-full max-w-xl p-8 rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-playfair font-bold text-white italic">{editingAlbum ? 'Update Portfolio' : 'New Collection'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* UPLOAD BOX */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-gold/50 cursor-pointer transition-all bg-white/5 overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    
                    {formData.cover_image && (
                      <div className="absolute inset-0">
                        <img src={formData.cover_image} className="w-full h-full object-cover opacity-20" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                    )}

                    <div className="relative z-10">
                      {uploading ? (
                        <Loader2 className="mx-auto animate-spin text-gold mb-3 h-10 w-10" />
                      ) : (
                        <Upload className="mx-auto text-gold/50 group-hover:text-gold mb-3 h-10 w-10 transition-colors" />
                      )}
                      <p className="text-white font-medium">{uploading ? 'Processing Image...' : 'Drop Cover Photo or Click'}</p>
                      <p className="text-xs text-gray-500 mt-2">Recommended: 1600x1000px</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 font-bold">Album Title</label>
                      <input required type="text" placeholder="e.g. Wedding of Mark & Sarah" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-gold text-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 font-bold">Event Date</label>
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-gold text-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 font-bold">Category</label>
                      <div className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-gray-400 text-sm">Portfolio Collection</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 font-bold">Brief Description</label>
                      <textarea rows={3} placeholder="Tell a short story about this shoot..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-gold text-white transition-all resize-none" />
                    </div>
                  </div>

                  <button 
                    disabled={uploading || loading} 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold/80 text-black py-4 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl transition-all flex justify-center items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <span>{editingAlbum ? 'Update Collection' : 'Publish Collection'}</span>}
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
