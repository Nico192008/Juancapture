import { useState, useEffect, useMemo } from 'react'; // FIXED: Added useMemo and lowercase import
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // OPTIMIZATION: useMemo prevents Hydration Mismatch errors in Vercel
  const photos = useMemo(() => {
    const totalPhotos = 10;
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000); // 8 Seconds Loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="juan-captures-final-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(40px)",
            transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* LAYER 1: PHOTOSHOT MONTAGE (Background) */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 opacity-20 pointer-events-none">
            {photos.map((src, index) => (
              <motion.div
                key={`montage-${index}`}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: [15, 0, -15],
                  scale: [0.95, 1, 1.05]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity, 
                  delay: index * 0.5,
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

          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

          {/* LAYER 2: BRAND LOGO & TEXT (Foreground) */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {/* MAIN LOGO */}
              <div className="relative mb-10">
                <div className="relative h-44 w-44 md:h-56 md:w-56 mx-auto">
                  <motion.div 
                    className="absolute inset-[-10px] rounded-full border border-gold/10 border-t-gold/60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/20 p-1.5 bg-black shadow-2xl">
                    <motion.img
                      src="/1775314217196.jpg"
                      alt="Juan Captures"
                      className="h-full w-full object-cover rounded-full"
                      animate={{
                        filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ delay: 0.8, duration: 1.5 }}
                  className="text-3xl md:text-6xl font-playfair font-black text-white uppercase"
                >
                  Juan <span className="italic text-gold">Captures</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-[1px] w-24 bg-gold/40 mb-4" />
                  <p className="text-gold font-vibes text-2xl md:text-4xl tracking-widest leading-none">
                    Creating Visual Legacies
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* LOADING BAR */}
            <div className="mt-20 flex flex-col items-center gap-3">
               <div className="w-56 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-gold"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                 PREPARING YOUR GALLERY
               </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
