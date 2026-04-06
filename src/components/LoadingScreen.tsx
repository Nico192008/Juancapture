import { useState, useEffect } from 'react'; // FIXED: Lowercase 'i'
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Gamit ang 10 photos mula sa /public/images/loading/
  const totalPhotos = 10; 
  const photos = Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);

  useEffect(() => {
    // GINAWANG 8 SECONDS (8000ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

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
            filter: "blur(40px)", // Mas malakas na blur sa exit para sa 8s reveal
            transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* --- LAYER 1: ACTUAL PHOTOSHOOT MONTAGE GRID --- */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 opacity-30 pointer-events-none">
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
                  duration: 4, // Mas mabagal na transition para sa 8s loading
                  repeat: Infinity, 
                  repeatDelay: 0.5,
                  delay: index * 0.4, // Staggered reveal
                  ease: "easeInOut" 
                }}
              >
                <img
                  src={src}
                  alt="Juan Captures Portfolio Montage"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Cinematic Overlay - Mas madilim para litaw ang text */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

          {/* --- LAYER 2: BRAND REVEAL --- */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated Lens Icon */}
              <div className="relative w-24 h-24 mx-auto mb-10">
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-gold/10"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-t-2 border-gold"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-5 rounded-full border border-gold/30 flex items-center justify-center">
                  <motion.div 
                    className="w-2 h-2 bg-gold rounded-full shadow-[0_0_15px_#D4AF37]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.5em" }}
                  transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
                  className="text-4xl md:text-8xl font-playfair font-black text-white uppercase tracking-tighter"
                >
                  Juan <span className="italic text-gold/90">Captures</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-[1px] w-32 bg-gold/50 mb-6 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  <p className="text-gold font-vibes text-2xl md:text-5xl tracking-[0.1em] leading-none">
                    Creating Visual Legacies
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Premium Loading Indicator - Adjusted for 8 seconds */}
            <div className="mt-24 flex flex-col items-center gap-4">
               <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-gold shadow-[0_0_20px_#D4AF37]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 4, // Mas mabagal na bar para mag-match sa 8s
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
               </div>
               <motion.span 
                 animate={{ opacity: [0.2, 0.5, 0.2] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40"
               >
                 Curating Your Experience
               </motion.span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
