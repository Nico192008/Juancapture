import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Layers, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-t-2 border-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-gold/40 animate-pulse" />
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60 animate-pulse">Loading Archives</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 md:pt-40 pb-20 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-gold">
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Portfolio</span>
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-4 md:mb-6">
            The <span className="italic text-gold">Archives</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium italic font-playfair text-base md:text-lg">
            "A visual journey through moments that define a lifetime."
          </p>
        </motion.div>

        {!selectedAlbum ? (
          /* --- ALBUM GRID --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-0">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openAlbum(album)}
                className="group cursor-pointer relative"
              >
                <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] aspect-[3/4] bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-gold/30">
                  <img
                    src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg'}
                    alt={album.name}
                    className="w-full h-full object-cover grayscale-[30%] md:grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-gold mb-2 md:mb-3">
                       <Layers size={12} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">View Collection</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-1 md:mb-2 tracking-tight leading-none">
                      {album.name}
                    </h3>
                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* --- IMAGE GRID --- */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
              <div className="space-y-4 w-full">
                <button
                  onClick={closeAlbum}
                  className="group flex items-center gap-2 text-gold font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] hover:text-white transition-all"
                >
                  <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Archives
                </button>
                <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white tracking-tighter italic leading-tight">
                  {selectedAlbum.name}
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                   <span>{new Date(selectedAlbum.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                   <div className="h-1 w-1 bg-gold rounded-full" />
                   <span className="text-gold">{images.length} Captures</span>
                </div>
              </div>
              {selectedAlbum.description && (
                <p className="text-gray-400 max-w-md text-sm leading-relaxed border-l border-gold/30 pl-6 py-1 italic">
                  {selectedAlbum.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className="group cursor-pointer relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/5 border border-white/5"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery'}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <Maximize2 size={18} />
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Lightbox Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-[110]">
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                  {lightboxImage + 1} <span className="text-gold">/</span> {images.length}
               </span>
               <button onClick={closeLightbox} className="p-3 bg-white/10 rounded-full hover:bg-gold hover:text-black transition-all">
                  <X size={20} />
               </button>
            </div>

            {/* Navigation - Hidden on small mobile to avoid accidental clicks */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="hidden md:flex absolute left-8 p-4 text-white/20 hover:text-gold transition-colors z-[110]"
            >
              <ChevronLeft size={48} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="hidden md:flex absolute right-8 p-4 text-white/20 hover:text-gold transition-colors z-[110]"
            >
              <ChevronRight size={48} />
            </button>

            <motion.div
              key={lightboxImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-full max-h-full flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxImage]?.image_url}
                alt="Fullscreen"
                className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain shadow-2xl rounded-sm pointer-events-none"
              />
              {images[lightboxImage]?.caption && (
                <div className="px-6 py-2 md:px-8 md:py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                   <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gold italic text-center">
                     {images[lightboxImage].caption}
                   </p>
                </div>
              )}
              {/* Mobile Prev/Next Swipe Indicators/Buttons */}
              <div className="flex md:hidden gap-10 mt-2">
                 <button onClick={prevImage} className="p-4 bg-white/5 rounded-full"><ChevronLeft size={24}/></button>
                 <button onClick={nextImage} className="p-4 bg-white/5 rounded-full"><ChevronRight size={24}/></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
