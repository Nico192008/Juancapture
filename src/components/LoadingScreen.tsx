import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  const photos = useMemo(() => {
    const totalPhotos = 10;
    // Nag-generate ng array ng images mula /images/loading/load-1.jpg hanggang 10
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* --- LAYER 1: DUAL-DIRECTION SCROLLING (Background) --- */}
      <div className="absolute inset-0 flex gap-6 p-6 opacity-20 pointer-events-none">
        
        {/* COLUMN 1: SCROLL UP */}
        <motion.div
          className="flex flex-col gap-6 flex-1"
          animate={{ y: [0, -1200] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...photos, ...photos].map((src, index) => (
            <div key={`up-${index}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          ))}
        </motion.div>

        {/* COLUMN 2: SCROLL DOWN */}
        <motion.div
          className="flex flex-col gap-6 flex-1"
          initial={{ y: -1200 }}
          animate={{ y: [ -1200, 0] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...photos, ...photos].map((src, index) => (
            <div key={`down-${index}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Cinematic Blur Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* --- LAYER 2: LOGO & BRANDING (Foreground) --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* MAIN LOGO */}
          <div className="relative mb-12">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              <motion.div 
                className="absolute inset-[-15px] rounded-full border border-gold/10 border-t-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/20 p-2 bg-black shadow-[0_0_60px_rgba(0,0,0,1)]">
                <img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Logo"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.4em]">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            <div className="h-[1px] w-32 bg-gold/50 mx-auto shadow-[0_0_10px_#D4AF37]" />
            <p className="text-gold font-vibes text-2xl md:text-5xl tracking-widest pt-2">Creating Visual Legacies</p>
          </div>
        </motion.div>

        {/* PROGRESS INDICATOR */}
        <div className="mt-24 flex flex-col items-center gap-4">
           <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_15px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Initializing Gallery</span>
        </div>
      </div>
    </div>
  );
};
