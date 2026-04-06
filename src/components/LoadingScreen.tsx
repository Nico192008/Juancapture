import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  const photos = useMemo(() => {
    const totalPhotos = 10;
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* --- LAYER 1: ORIGINAL PHOTO MONTAGE (Background) --- */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 opacity-20 pointer-events-none">
        {photos.map((src, index) => (
          <motion.div
            key={`bg-photo-${index}`}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl"
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
            <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* --- LAYER 2: LOGO & BRAND REVEAL WITH ENHANCED GLOW --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* MAIN LOGO CONTAINER */}
          <div className="relative mb-12 group">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              
              {/* 1. OUTER GLOW ORB (Dito galing yung "aura") */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gold/10 blur-[60px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* 2. ROTATING BORDER WITH GLOW */}
              <motion.div 
                className="absolute inset-[-15px] rounded-full border border-gold/5 border-t-gold/80 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              
              {/* 3. THE LOGO BOX WITH MULTIPLE GLOW LAYERS */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/40 p-2 bg-black shadow-[0_0_80px_rgba(212,175,55,0.25)] ring-1 ring-gold/20">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ 
                    filter: [
                      'brightness(1) contrast(1)', 
                      'brightness(1.3) contrast(1.1) drop-shadow(0 0 15px rgba(212,175,55,0.5))', 
                      'brightness(1) contrast(1)'
                    ] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* 4. FLARE EFFECT (Dadaan na parang kislap) */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ delay: 1, duration: 2 }}
              className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              Juan <span className="italic text-gold/90">Captures</span>
            </motion.h1>
            
            {/* GLOWING DIVIDER */}
            <motion.div 
              className="h-[1px] w-32 bg-gold/50 mx-auto mb-6"
              animate={{ boxShadow: ["0 0 5px #D4AF37", "0 0 20px #D4AF37", "0 0 5px #D4AF37"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <p className="text-gold font-vibes text-2xl md:text-5xl tracking-[0.1em] leading-none pt-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              Creating Visual Legacies
            </p>
          </div>
        </motion.div>

        {/* LOADING BAR WITH GLOW */}
        <div className="mt-24 flex flex-col items-center gap-4">
           <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_25px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mix-blend-overlay">
             Curating Your Experience
           </span>
        </div>
      </div>
    </div>
  );
};
