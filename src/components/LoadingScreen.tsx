import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  const photos = useMemo(() => [
    '/images/loading/load-1.jpg',
    '/images/loading/load-2.jpg',
    '/images/loading/load-3.jpg',
    '/images/loading/load-4.jpg',
    '/images/loading/load-5.jpg',
    '/images/loading/load-6.jpg',
    '/images/loading/load-7.jpg',
    '/images/loading/load-8.jpg',
    '/images/loading/load-9.jpg',
    '/images/loading/load-10.jpg',
  ], []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Montage */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 opacity-20 pointer-events-none">
        {photos.map((src, index) => (
          <motion.div
            key={`bg-photo-${index}`}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [15, 0, -15] }}
            transition={{ duration: 5, repeat: Infinity, delay: index * 0.2 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Luxury Logo Glow Section */}
      <div className="relative z-10 text-center px-6">
        <div className="relative mb-12">
          <div className="relative h-44 w-44 md:h-60 md:w-60 mx-auto">
            {/* Glow Aura */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gold/20 blur-[50px]"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Rotating Ring */}
            <motion.div 
              className="absolute inset-[-12px] rounded-full border border-gold/10 border-t-gold/60"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {/* Logo Image */}
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/30 p-2 bg-black shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              <motion.img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                className="h-full w-full object-cover rounded-full"
                animate={{ filter: ['brightness(1)', 'brightness(1.2) drop-shadow(0 0 10px #D4AF37)', 'brightness(1)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.3em]">
            Juan <span className="italic text-gold/90">Captures</span>
          </h1>
          <div className="h-[1px] w-28 bg-gold/40 mx-auto shadow-[0_0_10px_#D4AF37]" />
          <p className="text-gold font-vibes text-2xl md:text-5xl tracking-widest pt-2">Creating Visual Legacies</p>
        </div>

        {/* Glowing Progress Bar */}
        <div className="mt-20 flex flex-col items-center gap-4">
           <div className="w-56 h-[1.5px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_15px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};
