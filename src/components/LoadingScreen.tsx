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
      
      {/* --- LAYER 1: VIVID FLOATING TILES (Responsive & Optimized) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {photos.map((src, index) => (
          <motion.div
            key={`vivid-tile-${index}`}
            className="absolute rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10"
            style={{
              // Responsive sizes: Mas maliit sa mobile, tama ang laki sa desktop
              width: index % 2 === 0 ? 'clamp(100px, 15vw, 180px)' : 'clamp(130px, 20vw, 240px)',
              height: index % 2 === 0 ? 'clamp(140px, 20vw, 240px)' : 'clamp(180px, 28vw, 320px)',
              left: `${(index * 14) % 85}%`,
              top: `${(index * 22) % 80}%`,
              zIndex: index % 3,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ 
              opacity: [0, 0.6, 0], 
              y: [-10, -180], // Mabilis na float para sa 5s cycle
              x: index % 2 === 0 ? [0, 20, 0] : [0, -20, 0],
              rotate: index % 2 === 0 ? [-3, 3] : [3, -3]
            }}
            transition={{ 
              duration: 5, // 5 SECONDS EXACT
              repeat: Infinity, 
              delay: index * 0.4,
              ease: "easeInOut" 
            }}
          >
            <img 
              src={src} 
              alt="" 
              className="w-full h-full object-cover brightness-[0.9] contrast-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Dark Overlay with subtle blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 backdrop-blur-[0.5px]" />

      {/* --- LAYER 2: LOGO & BRANDING WITH ENHANCED GLOW --- */}
      <div className="relative z-10 text-center px-6 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* LOGO CONTAINER */}
          <div className="relative mb-8 md:mb-12">
            <div className="relative h-40 w-40 md:h-64 md:w-64 mx-auto">
              
              {/* FIXED INTENSE GLOW (Mas matingkad na ngayon) */}
              <motion.div 
                className="absolute inset-[-30px] rounded-full bg-gold/40 blur-[60px]"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* SPINNING OUTER RING */}
              <motion.div 
                className="absolute inset-[-12px] rounded-full border-2 border-gold/30 border-t-gold shadow-[0_0_50px_rgba(212,175,55,0.5)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              
              {/* LOGO IMAGE BOX */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-gold/60 p-1.5 md:p-2 bg-black shadow-[0_0_100px_rgba(212,175,55,0.4)]">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ 
                    filter: [
                      'brightness(1) drop-shadow(0 0 10px rgba(212,175,55,0.2))', 
                      'brightness(1.4) drop-shadow(0 0(35px rgba(212,175,55,1))', 
                      'brightness(1) drop-shadow(0 0 10px rgba(212,175,55,0.2))'
                    ] 
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* BRANDING SECTION */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em] drop-shadow-2xl">
              Juan <span className="italic text-gold">Captures</span>
            </h1>
            
            <motion.div 
              className="h-[1.5px] w-20 md:w-32 bg-gold mx-auto shadow-[0_0_20px_#D4AF37]"
              animate={{ opacity: [0.5, 1, 0.5], width: ['60px', '120px', '60px'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            
            <p className="text-white font-vibes text-xl md:text-4xl tracking-widest pt-2 opacity-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Capturing Moments, Creating Memories
            </p>
          </div>
        </motion.div>

        {/* PROGRESS BAR (Synced to 5s) */}
        <div className="mt-16 md:mt-24 flex flex-col items-center gap-4">
           <div className="w-56 md:w-72 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_25px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
           </div>
           <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30">
             Ready in 5 Seconds
           </span>
        </div>
      </div>
    </div>
  );
};
