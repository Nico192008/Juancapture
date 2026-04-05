import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Album } from '../../types';

export const ManageAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States para sa Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  
  // Form States
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

  const handleOpenModal = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        name: album.name,
        date: album.date,
        cover_image: album.cover_image || '',
        description: (album as any).description || ''
      });
    } else {
      setEditingAlbum(null);
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        cover_image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAlbum) {
        // UPDATE Logic
        const { error } = await supabase
          .from('albums')
          .update(formData)
          .eq('id', editingAlbum.id);
        if (error) throw error;
        alert('Album updated successfully!');
      } else {
        // CREATE Logic
        const { error } = await supabase
          .from('albums')
          .insert([formData]);
        if (error) throw error;
        alert('New album created!');
      }
      
      setIsModalOpen(false);
      fetchAlbums();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Error saving album details');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album? This cannot be undone.')) return;

    try {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Error deleting album');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container-custom px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Manage Albums
            </h1>
            <p className="text-gray-400 font-light italic">Juan Captures Gallery Control</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/dashboard" className="btn-gold-outline text-sm">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <button 
            onClick={() => handleOpenModal()}
            className="btn-gold flex items-center space-x-2 px-6 py-3"
          >
            <Plus size={20} />
            <span className="font-bold uppercase tracking-wider text-sm">Create New Album</span>
          </button>
        </div>

        {loading && !isModalOpen ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-strong rounded-xl overflow-hidden border border-white/5 group hover:border-gold/30 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-white mb-1">
                    {album.name}
                  </h3>
                  <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">
                    {new Date(album.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleOpenModal(album)}
                      className="flex-1 glass py-2 rounded-lg text-white hover:text-gold hover:bg-white/10 transition-all flex items-center justify-center space-x-2 text-sm"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteAlbum(album.id)}
                      className="glass py-2 px-4 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* MODAL PARA SA ADD/EDIT */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-strong w-full max-w-lg p-8 rounded-2xl border border-gold/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-playfair font-bold text-white">
                    {editingAlbum ? 'Edit Album' : 'New Album'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Album Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="e.g. Wedding of Juan & Maria"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Event Date</label>
                      <input 
                        required
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={formData.cover_image}
                        onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Description (Optional)</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="Tell a story about this album..."
                    />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full btn-gold py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
                  >
                    {loading ? <div className="animate-spin h-5 w-5 border-t-2 border-black rounded-full" /> : <span>{editingAlbum ? 'Update Album' : 'Create Album'}</span>}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {albums.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">
              The gallery is empty. Let's capture some memories!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
