import { useMemo } from 'react'; 
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  // Stable array for Vercel hydration safety
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
      
      {/* --- LAYER 1: FLOATING PHOTO TILES (Background) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {photos.map((src, index) => (
          <motion.div
            key={`tile-${index}`}
            className="absolute overflow-hidden border border-white/10 shadow-2xl rounded-2xl"
            style={{
              // Malalapit na tiles, portrait orientation parang polaroid
              width: index % 2 === 0 ? '140px' : '200px',
              height: index % 2 === 0 ? '180px' : '260px',
              // Dynamic but stable positioning
              left: `${(index * 12) % 85}%`,
              top: `${(index * 18) % 75}%`,
              zIndex: index,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: [0, 0.35, 0], 
              scale: [0.9, 1, 0.95],
              y: [-10, -120], // Dahan-dahang pag-angat
              rotate: index % 2 === 0 ? [-2, 2, -2] : [2, -2, 2] // Slight tilt for natural look
            }}
            transition={{ 
              duration: 10 + (index % 4),
              repeat: Infinity, 
              delay: index * 0.6,
              ease: "easeInOut" 
            }}
          >
            <img 
              src={src} 
              alt="" 
              className="w-full h-full object-cover grayscale-[40%] contrast-125 blur-[0.5px]" 
            />
            {/* Subtle Golden Tint Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gold/10" />
          </motion.div>
        ))}
      </div>

      {/* Cinematic Dark Overlay with stronger Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[2px]" />

      {/* --- LAYER 2: CENTER LOGO & BRANDING --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* LOGO WITH PREMIUM GLOW */}
          <div className="relative mb-12">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              {/* Outer Glow Aura */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gold/20 blur-[50px]"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Rotating Gold Ring */}
              <motion.div 
                className="absolute inset-[-15px] rounded-full border border-gold/10 border-t-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.25)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              {/* Image Circle */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/40 p-2 bg-black shadow-[0_0_80px_rgba(0,0,0,1)]">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* BRAND NAME */}
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.3em]">
              Juan <span className="italic text-gold/90">Captures</span>
            </h1>
            
            {/* GLOWING DIVIDER */}
            <motion.div 
              className="h-[1px] w-36 bg-gold/50 mx-auto"
              animate={{ boxShadow: ["0 0 5px #D4AF37", "0 0 15px #D4AF37", "0 0 5px #D4AF37"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* MOTTO FROM HOME PAGE */}
            <p className="text-gold font-vibes text-2xl md:text-5xl tracking-[0.1em] leading-none pt-2 opacity-90">
              Capturing Moments, Creating Memories
            </p>
          </div>
        </motion.div>

        {/* GLOWING LOADING BAR */}
        <div className="mt-24 flex flex-col items-center gap-4">
           <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_20px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mix-blend-overlay">
             Polishing Memories
           </span>
        </div>
      </div>
    </div>
  );
};
