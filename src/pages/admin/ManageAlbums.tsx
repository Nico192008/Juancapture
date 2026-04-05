import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
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

      // 1. Upload to Supabase Storage Bucket 'album-covers'
      const { error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('album-covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please check your Storage settings.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sanitizing strings to prevent hidden characters
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
      console.error('Save error:', error);
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
    <div className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container-custom px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-playfair font-bold">Manage Albums</h1>
            <p className="text-gold italic mt-2">Curate your professional photography portfolio</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/dashboard" className="glass px-6 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
              Back to Dashboard
            </Link>
            <button onClick={() => openModal()} className="btn-gold flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Collection</span>
            </button>
          </div>
        </div>

        {loading && !isModalOpen ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all group"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={album.cover_image || 'https://via.placeholder.com/800x600?text=No+Cover'}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-white mb-1">{album.name}</h3>
                  <p className="text-gold text-xs font-bold tracking-widest uppercase mb-6">
                    {new Date(album.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => openModal(album)} className="flex-1 glass py-2 rounded-lg text-white hover:text-gold transition-all flex items-center justify-center gap-2 text-sm">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => deleteAlbum(album.id)} className="px-4 glass py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-strong w-full max-w-lg p-8 rounded-2xl border border-gold/20 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-playfair font-bold text-white italic">{editingAlbum ? 'Update Portfolio' : 'New Collection'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* DROPZONE / UPLOAD BOX */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-gold/50 cursor-pointer transition-all bg-white/5 overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    
                    {formData.cover_image && (
                      <div className="absolute inset-0">
                        <img src={formData.cover_image} className="w-full h-full object-cover opacity-30" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                    )}

                    <div className="relative z-10">
                      {uploading ? (
                        <Loader2 className="mx-auto animate-spin text-gold mb-3 h-8 w-8" />
                      ) : (
                        <Upload className="mx-auto text-gold mb-3 h-8 w-8 group-hover:scale-110 transition-transform" />
                      )}
                      <p className="text-white font-medium">{uploading ? 'Uploading to Storage...' : 'Click to Upload Cover Photo'}</p>
                      <p className="text-xs text-gray-400 mt-1 italic">JPG, PNG, or WEBP supported</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gold mb-1 font-bold">Album Title</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-gold text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gold mb-1 font-bold">Event Date</label>
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-gold text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gold mb-1 font-bold">Brief Description</label>
                      <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-gold text-white" />
                    </div>
                  </div>

                  <button disabled={uploading || loading} type="submit" className="w-full btn-gold py-4 rounded-xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-gold/10 hover:shadow-gold/20 flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <span>{editingAlbum ? 'Update Album' : 'Create Collection'}</span>}
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
