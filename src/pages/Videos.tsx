import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Clapperboard, MonitorPlay, Loader2, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-t-2 border-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-6 w-6 md:h-8 md:w-8 text-gold/40 animate-pulse" />
          </div>
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gold/60 animate-pulse italic">Loading Reel</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 md:pt-40 pb-20 relative overflow-hidden">
      {/* Cinematic Aura */}
      <div className="absolute top-[-5%] left-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-gold">
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Cinematography</span>
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
            Motion <span className="italic text-gold">Showcase</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium italic font-playfair text-base md:text-lg leading-relaxed px-4">
            "Capturing the rhythm of life through cinematic movement and sound."
          </p>
        </motion.div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                onClick={() => openVideo(video)}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-gold/30">
                  <img
                    src={video.thumbnail_url || 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg'}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
                    loading="lazy"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold group-hover:border-gold transition-all duration-500 shadow-2xl">
                      <Play className="text-white group-hover:text-black fill-current ml-1 transition-colors" size={24} md:size={28} />
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <div className="flex items-center gap-2 text-gold mb-1 md:mb-2">
                       <Clapperboard size={10} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Film Reel</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-playfair font-bold text-white tracking-tight">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State Design */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 md:py-32 glass-strong rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/[0.01]"
          >
            <MonitorPlay className="mx-auto text-gold/10 mb-6 animate-pulse" size={56} md:size={64} />
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-white/40 tracking-tight">The theater is currently quiet.</h3>
            <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
               <Sparkles size={14} className="text-gold/30" />
               <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">New stories in development</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
            onClick={closeVideo}
          >
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute top-6 md:top-10 right-6 md:right-10 p-3 md:p-4 bg-white/5 rounded-full text-white hover:bg-gold hover:text-black transition-all z-[110]"
            >
              <X size={20} md:size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-6xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Video Frame */}
              <div className="relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.08)] border border-white/10 bg-black group">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Video Meta Info */}
              <div className="mt-6 md:mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2 md:px-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-6 bg-gold/50" />
                    <span className="text-gold text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Official Release</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-tighter italic leading-none">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-gray-400 mt-3 md:mt-4 font-medium max-w-2xl text-xs md:text-sm leading-relaxed border-l border-white/10 pl-5">
                      {selectedVideo.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3 py-3 px-5 bg-white/5 rounded-full border border-white/5 group hover:border-gold/20 transition-colors">
                  <Film size={14} className="text-gold" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Juan Captures Original</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
