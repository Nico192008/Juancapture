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
      
      {/* --- LAYER 1: VIVID FLOATING TILES (Pinilinaw na Background) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {photos.map((src, index) => (
          <motion.div
            key={`vivid-tile-${index}`}
            className="absolute rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10"
            style={{
              width: index % 3 === 0 ? '180px' : index % 3 === 1 ? '240px' : '150px',
              height: index % 3 === 0 ? '240px' : index % 3 === 1 ? '320px' : '200px',
              left: `${(index * 14) % 85}%`,
              top: `${(index * 22) % 80}%`,
              zIndex: index % 3,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ 
              // Pinataas ang opacity mula 0.25 patungong 0.5 para mas malinaw
              opacity: [0, 0.5, 0], 
              y: [-10, -150], 
              x: index % 2 === 0 ? [0, 25, 0] : [0, -25, 0],
              rotate: index % 2 === 0 ? [-2, 2] : [2, -2]
            }}
            transition={{ 
              duration: 12 + (index % 5),
              repeat: Infinity, 
              delay: index * 0.5,
              ease: "easeInOut" 
            }}
          >
            <img 
              src={src} 
              alt="" 
              className="w-full h-full object-cover brightness-[0.8] contrast-125 blur-[0.2px]" 
            />
            {/* Subtle Gradient overlay para magmukhang cinematic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Cinematic Vignette (Reduced blur para mas malinaw ang background) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 backdrop-blur-[1px]" />

      {/* --- LAYER 2: LOGO & BRANDING WITH INTENSE GLOW --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* LOGO CONTAINER WITH FIXED GLOW */}
          <div className="relative mb-14">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              
              {/* 1. INTENSE CORE GLOW (The "Bloom" effect) */}
              <motion.div 
                className="absolute inset-[-20px] rounded-full bg-gold/30 blur-[45px]"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* 2. GLOWING OUTER RING */}
              <motion.div 
                className="absolute inset-[-12px] rounded-full border-2 border-gold/20 border-t-gold shadow-[0_0_35px_rgba(212,175,55,0.4)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* 3. MAIN LOGO BOX */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/50 p-2 bg-black shadow-[0_0_100px_rgba(212,175,55,0.3)]">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ 
                    filter: [
                      'brightness(1) drop-shadow(0 0 5px rgba(212,175,55,0))', 
                      'brightness(1.3) drop-shadow(0 0 20px rgba(212,175,55,0.8))', 
                      'brightness(1) drop-shadow(0 0 5px rgba(212,175,55,0))'
                    ] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* TEXT SECTION */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            
            <motion.div 
              className="h-[1.5px] w-36 bg-gold mx-auto shadow-[0_0_15px_#D4AF37]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <p className="text-gold font-vibes text-3xl md:text-6xl tracking-widest pt-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
              Capturing Moments, Creating Memories
            </p>
          </div>
        </motion.div>

        {/* PROGRESS BAR */}
        <div className="mt-28 flex flex-col items-center gap-5">
           <div className="w-72 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_25px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30">
             Developing Your Experience
           </span>
        </div>
      </div>
    </div>
  );
};
