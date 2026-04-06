import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  const photos = useMemo(() => {
    const totalPhotos = 10;
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* --- LAYER 1: VERTICAL SCROLLING MONTAGE (Background) --- */}
      <div className="absolute inset-0 flex gap-4 p-4 opacity-20 pointer-events-none">
        {[0, 1, 2, 3].map((column) => (
          <motion.div
            key={`column-${column}`}
            className="flex flex-col gap-4 flex-1"
            animate={{ y: [0, -1000] }} // Scrolling effect
            transition={{ 
              duration: 20 + column * 2, // Magkakaiba ang bilis para cinematic
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...photos, ...photos].map((src, index) => (
              <div key={`${column}-${index}`} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 shadow-2xl">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Dark Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* --- LAYER 2: CENTER LOGO & TEXT --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* MAIN LOGO */}
          <div className="relative mb-10">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              <motion.div 
                className="absolute inset-[-10px] rounded-full border border-gold/10 border-t-gold/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/20 p-2 bg-black shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                <img
                  src="/1775314217196.jpg"
                  alt="Juan Captures"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.3em]">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            <div className="h-[1px] w-24 bg-gold/40 mx-auto" />
            <p className="text-gold font-vibes text-2xl md:text-5xl tracking-widest leading-none">Creating Visual Legacies</p>
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
           <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Initializing Gallery</span>
        </div>
      </div>
    </div>
  );
};
