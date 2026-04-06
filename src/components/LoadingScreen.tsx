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
      
      {/* --- LAYER 1: VIVID FLOATING TILES (Malinaw na Background) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {photos.map((src, index) => (
          <motion.div
            key={`vivid-tile-${index}`}
            className="absolute rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10"
            style={{
              width: index % 3 === 0 ? '180px' : index % 3 === 1 ? '240px' : '150px',
              height: index % 3 === 0 ? '240px' : index % 3 === 1 ? '320px' : '200px',
              left: `${(index * 14) % 85}%`,
              top: `${(index * 22) % 80}%`,
              zIndex: index % 3,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ 
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
              className="w-full h-full object-cover brightness-[0.85] contrast-125 blur-[0.2px]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 backdrop-blur-[1px]" />

      {/* --- LAYER 2: LOGO & BRANDING WITH INTENSE GLOW --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* LOGO CONTAINER */}
          <div className="relative mb-12">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              {/* CORE GLOW BLOOM */}
              <motion.div 
                className="absolute inset-[-25px] rounded-full bg-gold/25 blur-[50px]"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* SPINNING OUTER RING */}
              <motion.div 
                className="absolute inset-[-14px] rounded-full border-2 border-gold/20 border-t-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* LOGO IMAGE BOX */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/50 p-2 bg-black shadow-[0_0_80px_rgba(0,0,0,1)]">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ 
                    filter: [
                      'brightness(1) drop-shadow(0 0 5px rgba(212,175,55,0))', 
                      'brightness(1.3) drop-shadow(0 0 25px rgba(212,175,55,0.8))', 
                      'brightness(1) drop-shadow(0 0 5px rgba(212,175,55,0))'
                    ] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* BRANDING SECTION */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            
            <motion.div 
              className="h-[1px] w-28 bg-gold/60 mx-auto shadow-[0_0_10px_#D4AF37]"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* MOTTO: Pinalitan ng White at binawasan ang Size */}
            <p className="text-white font-vibes text-2xl md:text-4xl tracking-widest pt-2 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Capturing Moments, Creating Memories
            </p>
          </div>
        </motion.div>

        {/* PROGRESS BAR */}
        <div className="mt-24 flex flex-col items-center gap-5">
           <div className="w-64 h-[1.5px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_20px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">
             Developing Your Experience
           </span>
        </div>
      </div>
    </div>
  );
};
