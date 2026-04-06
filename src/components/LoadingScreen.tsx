import { useState, useEffect, useMemo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Ginamit ang useMemo para iwas Hydration Error sa Vercel
  const photos = useMemo(() => {
    const totalPhotos = 10;
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  useEffect(() => {
    // Saktong 8 seconds (8000ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="juan-captures-8s-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1, // "Zoom-in" effect papasok sa home
            filter: "blur(40px)", // Smooth melting effect
            transition: { 
              duration: 1.8, // Mas mahabang transition para sa smoothness
              ease: [0.65, 0, 0.35, 1] 
            } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* --- LAYER 1: PORTFOLIO MONTAGE (Background) --- */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 opacity-20 pointer-events-none">
            {photos.map((src, index) => (
              <motion.div
                key={`bg-photo-${index}`}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: [20, 0, -20],
                  scale: [0.95, 1, 1.05]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity, 
                  repeatDelay: 0.5,
                  delay: index * 0.4,
                  ease: "easeInOut" 
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Cinematic Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

          {/* --- LAYER 2: LOGO & BRAND REVEAL (Foreground) --- */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* MAIN LOGO */}
              <div className="relative mb-12">
                <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
                  {/* Rotating Gold Ring */}
                  <motion.div 
                    className="absolute inset-[-12px] rounded-full border border-gold/10 border-t-gold/60 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Image Container */}
                  <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/30 p-2 bg-black shadow-[0_0_60px_rgba(212,175,55,0.2)]">
                    <motion.img
                      src="/1775314217196.jpg"
                      alt="Juan Captures Official Logo"
                      className="h-full w-full object-cover rounded-full"
                      animate={{
                        filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* BRAND TEXT */}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
                  className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-tighter"
                >
                  Juan <span className="italic text-gold/90">Captures</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-[1px] w-32 bg-gold/50 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                  <p className="text-gold font-vibes text-2xl md:text-5xl tracking-[0.1em] leading-none">
                    Creating Visual Legacies
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* PREMIUM LOADING BAR */}
            <div className="mt-24 flex flex-col items-center gap-4">
               <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-gold shadow-[0_0_20px_#D4AF37]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 5, // Mas mabagal na bar para sa 8s loading
                      repeat: Infinity, 
                      ease: "linear" 
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
