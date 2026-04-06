import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  const photos = useMemo(() => {
    const totalPhotos = 10;
    return Array.from({ length: totalPhotos }, (_, i) => `/images/loading/load-${i + 1}.jpg`);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Montage */}
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
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.4, ease: "easeInOut" }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Main Content Reveal */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* LOGO */}
          <div className="relative mb-12">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              <motion.div 
                className="absolute inset-[-12px] rounded-full border border-gold/20 border-t-gold/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/30 p-2 bg-black">
                <img src="/1775314217196.jpg" alt="Logo" className="h-full w-full object-cover rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.4em]">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            <p className="text-gold font-vibes text-2xl md:text-5xl tracking-widest leading-none">Creating Visual Legacies</p>
          </div>
        </motion.div>

        {/* LOADING BAR */}
        <div className="mt-24 flex flex-col items-center gap-4">
           <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gold"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};
