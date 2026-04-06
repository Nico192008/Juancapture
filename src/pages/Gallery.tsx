import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Album, Image as ImageType } from '../types';

export const Gallery = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
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

  const fetchAlbumImages = async (albumId: string) => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('album_id', albumId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    fetchAlbumImages(album.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setImages([]);
  };

  const openLightbox = (index: number) => setLightboxImage(index);
  const closeLightbox = () => setLightboxImage(null);

  const nextImage = () => {
    if (lightboxImage !== null) setLightboxImage((lightboxImage + 1) % images.length);
  };

  const prevImage = () => {
    if (lightboxImage !== null) setLightboxImage((lightboxImage - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-2 border-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 bg-gold/20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-40 pb-24 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-6 text-gold">
            <div className="h-[1px] w-8 bg-gold/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Portfolio</span>
            <div className="h-[1px] w-8 bg-gold/40" />
          </div>
          <h1 className="text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-6">
            The <span className="italic text-gold">Archives</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium italic font-playfair text-lg">
            "A visual journey through moments that define a lifetime."
          </p>
        </motion.div>

        {!selectedAlbum ? (
          /* --- ALBUM GRID --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                onClick={() => openAlbum(album)}
                className="group cursor-pointer relative"
              >
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[3/4] bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-2xl group-hover:shadow-gold/5">
                  <img
                    src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={album.name}
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-gold mb-3 overflow-hidden">
                       <Layers size={14} />
                       <span className="text-[9px] font-black uppercase tracking-[0.3em]">View Collection</span>
                    </div>
                    <h3 className="text-3xl font-playfair font-bold text-white mb-2 tracking-tight leading-none">
                      {album.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* --- IMAGE GRID --- */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4">
                <button
                  onClick={closeAlbum}
                  className="group flex items-center gap-2 text-gold font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Return to Archives
                </button>
                <h2 className="text-5xl md:text-6xl font-playfair font-bold text-white tracking-tighter italic">
                  {selectedAlbum.name}
                </h2>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                   <span>{new Date(selectedAlbum.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                   <div className="h-1 w-1 bg-gold rounded-full" />
                   <span className="text-gold">{images.length} Captures</span>
                </div>
              </div>
              {selectedAlbum.description && (
                <p className="text-gray-400 max-w-md text-sm font-medium leading-relaxed border-l border-gold/30 pl-6 py-2">
                  {selectedAlbum.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className="group cursor-pointer relative aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/5"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery'}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                     <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Maximize2 size={20} />
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={closeLightbox}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                  {lightboxImage + 1} <span className="text-gold">/</span> {images.length}
               </span>
               <button onClick={closeLightbox} className="p-3 bg-white/5 rounded-full hover:bg-gold hover:text-black transition-all">
                  <X size={24} />
               </button>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-8 p-4 text-white/20 hover:text-gold transition-colors z-20"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-8 p-4 text-white/20 hover:text-gold transition-colors z-20"
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              key={lightboxImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxImage]?.image_url}
                alt="Fullscreen"
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
              />
              {images[lightboxImage]?.caption && (
                <div className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold italic">
                     {images[lightboxImage].caption}
                   </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
