import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Upload, 
  Loader2, 
  Calendar, 
  Image as ImageIcon, 
  ChevronLeft,
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Album } from '../../types';

export const ManageAlbums = () => {
  const navigate = useNavigate();
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
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
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
      alert('Upload failed. Try again.');
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
        const { error } = await supabase.from('albums').update(cleanData).eq('id', editingAlbum.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('albums').insert([cleanData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAlbums();
      resetForm();
    } catch (error) {
      alert('Error saving album');
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
    if (!confirm('This action will permanently remove this collection. Proceed?')) return;
    try {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      fetchAlbums();
    } catch (error) {
      alert('Error deleting album');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30">
      {/* BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container-custom pt-32 pb-20 px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/admin/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-gold transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60">Portfolio Manager</span>
            </div>
            <h1 className="text-6xl font-playfair font-bold tracking-tighter">Collections</h1>
          </motion.div>

          <button 
            onClick={() => openModal()} 
            className="group relative bg-white text-black px-10 py-5 rounded-2xl font-bold transition-all hover:scale-[1.02] flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Plus size={18} strokeWidth={3} /> Create Collection
            </span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {loading && !isModalOpen ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-gold w-10 h-10" strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Synchronizing Archives</p>
          </div>
        ) : (
          <div className="space-y-6">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                  {/* PREVIEW IMAGE */}
                  <div className="relative shrink-0 w-full lg:w-72 aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black">
                    <img 
                      src={album.cover_image || 'https://via.placeholder.com/800x600?text=No+Cover'} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={album.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
                            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Active Showcase</span>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Calendar size={14} className="text-gold" /> 
                            {new Date(album.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h3 className="text-4xl font-playfair font-bold text-white tracking-tight leading-tight group-hover:text-gold transition-colors">
                          {album.name}
                        </h3>

                        <div className="max-w-xl p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-gray-400 text-sm leading-relaxed italic">
                            "{album.description || "In silence, art speaks louder than words. This collection awaits its narrative."}"
                           </p>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => openModal(album)} 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all hover:text-gold group/btn"
                        >
                          <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform" /> Edit
                        </button>
                        <button 
                          onClick={() => deleteAlbum(album.id)} 
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-500/60 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {albums.length === 0 && (
              <div className="text-center py-40 bg-white/[0.02] rounded-[3.5rem] border border-dashed border-white/10">
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="text-gray-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-400">Your Archive is Silent</h3>
                <p className="text-gray-600 mt-2 text-sm font-medium">Start creating collections to showcase your vision.</p>
              </div>
            )}
          </div>
        )}

        {/* REFINED MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="relative glass-strong w-full max-w-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-playfair font-bold text-white italic">{editingAlbum ? 'Refine' : 'Begin'} <span className="text-gold">Collection</span></h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2 italic">Curating for Juan Captures Studio</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
                    <X className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* UPLOAD SECTION */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:border-gold/50 cursor-pointer transition-all bg-white/[0.02] overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    
                    {formData.cover_image && (
                      <div className="absolute inset-0">
                        <img src={formData.cover_image} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                        <div className="absolute inset-0 bg-black/60" />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center">
                      {uploading ? (
                        <div className="space-y-3">
                          <Loader2 className="mx-auto animate-spin text-gold h-10 w-10" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Uploading Masterpiece...</p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gold/10 p-5 rounded-2xl text-gold mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                          </div>
                          <p className="text-white font-bold uppercase text-xs tracking-widest">Define Cover Appearance</p>
                          <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-tighter">Click to browse or drop visual asset</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-bold group-focus-within:text-gold transition-colors">Collection Identity</label>
                      <input required type="text" placeholder="e.g. Celestial Wedding Chronicles" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold text-lg font-medium transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-bold group-focus-within:text-gold transition-colors">Capture Date</label>
                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold text-white transition-all appearance-none cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-bold">Category</label>
                        <div className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-gray-500 text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                          <Sparkles size={14} className="text-gold" /> Portfolio Main
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-bold group-focus-within:text-gold transition-colors">The Story (Description)</label>
                      <textarea rows={4} placeholder="A brief narrative of the moments captured..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold text-white transition-all resize-none leading-relaxed" />
                    </div>
                  </div>

                  <button 
                    disabled={uploading || loading} 
                    type="submit" 
                    className="group w-full bg-white hover:bg-gold text-black py-6 rounded-2xl font-bold uppercase text-xs tracking-[0.3em] shadow-2xl transition-all flex justify-center items-center gap-3 overflow-hidden relative active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <span className="flex items-center gap-2">
                        {editingAlbum ? 'Update Archive' : 'Publish to Portfolio'} <ArrowUpRight size={18} />
                      </span>
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
