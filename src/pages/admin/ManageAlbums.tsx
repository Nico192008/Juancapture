import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, CreditCard as Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Album } from '../../types';

export const ManageAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;

    try {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Error deleting album');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Manage Albums
            </h1>
            <p className="text-gray-400">Create and manage photo albums</p>
          </div>
          <Link to="/admin/dashboard" className="btn-gold-outline">
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <button className="btn-gold flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Album</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-lg overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-white mb-2">
                  {album.name}
                </h3>
                <p className="text-gold text-sm mb-4">
                  {new Date(album.date).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <button className="flex-1 glass px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-1">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteAlbum(album.id)}
                    className="flex-1 glass px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {albums.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No albums yet. Create your first album to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
