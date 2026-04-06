import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Clapperboard, MonitorPlay, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Video as VideoType } from '../types';

export const Videos = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (video: VideoType) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-gold animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/50">Loading Reel</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-40 pb-24 relative overflow-hidden">
      {/* Cinematic Lighting */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-custom px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-6 text-gold">
            <div className="h-[1px] w-8 bg-gold/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Cinematography</span>
            <div className="h-[1px] w-8 bg-gold/40" />
          </div>
          <h1 className="text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-6">
            Motion <span className="italic text-gold">Showcase</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium italic font-playfair text-lg leading-relaxed">
            "Capturing the rhythm of life through cinematic movement and sound."
          </p>
        </motion.div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                onClick={() => openVideo(video)}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-2xl group-hover:shadow-gold/10">
                  <img
                    src={video.thumbnail_url || 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    loading="lazy"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                      <Play className="text-white group-hover:text-black fill-current ml-1 transition-colors" size={28} />
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <div className="flex items-center gap-2 text-gold mb-2">
                       <Clapperboard size={12} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Film Reel</span>
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-white tracking-tight">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass-strong rounded-[4rem] border border-white/5"
          >
            <MonitorPlay className="mx-auto text-gold/20 mb-6" size={64} />
            <h3 className="text-2xl font-playfair font-bold text-white/50">Our theater is currently empty.</h3>
            <p className="text-gray-600 text-sm mt-2 uppercase tracking-widest font-bold">New stories coming soon</p>
          </motion.div>
        )}
      </div>

      {/* --- VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={closeVideo}
          >
            <button
              onClick={closeVideo}
              className="absolute top-8 right-8 p-4 bg-white/5 rounded-full text-white hover:bg-gold hover:text-black transition-all z-20"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-6xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-white/10 bg-black">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-playfair font-bold text-white tracking-tighter italic">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-gray-400 mt-2 font-medium max-w-2xl">{selectedVideo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gold/50">
                  <Film size={16} />
                  <span>Juan Captures Original</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
