import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Bilang ng photos na nilagay mo sa /public/images/loading/
  const totalPhotos = 10; 
  const photos = Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);

  useEffect(() => {
    // 4.5 seconds para malasap ng client ang inyong portfolio montage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="juan-captures-cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* --- LAYER 1: ACTUAL PHOTOSHOOT MONTAGE GRID --- */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4 opacity-30 pointer-events-none">
            {photos.map((src, index) => (
              <motion.div
                key={index}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0.9, 1, 1.1],
                  y: [20, 0, -20]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  delay: index * 0.3, // Staggered reveal ng photos
                  ease: "easeInOut" 
                }}
              >
                <img
                  src={src}
                  alt="Juan Captures Portfolio Montage"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Subtle Vignette sa bawat photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />

          {/* --- LAYER 2: BRAND REVEAL --- */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated Lens/Aperture Icon */}
              <div className="relative w-20 h-20 mx-auto mb-10">
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-gold/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-t-2 border-gold"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-4 rounded-full border border-gold/40 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]" />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                  className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-tighter"
                >
                  Juan <span className="italic text-gold/90">Captures</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-[1px] w-20 bg-gold/50 mb-4 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  <p className="text-gold font-vibes text-2xl md:text-4xl tracking-widest leading-none">
                    Creating Visual Legacies
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Premium Loading Indicator */}
            <div className="mt-20 flex flex-col items-center gap-3">
               <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-gold shadow-[0_0_15px_#D4AF37]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
                 Initializing Gallery
               </span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
