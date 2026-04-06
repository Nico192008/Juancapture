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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] overflow-hidden">
      
      {/* --- LAYER 1: CINEMATIC FLOATING TILES (Background) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {photos.map((src, index) => (
          <motion.div
            key={`smooth-tile-${index}`}
            className="absolute rounded-3xl overflow-hidden shadow-2xl border border-white/[0.03]"
            style={{
              // Magkakaibang sukat para sa "Depth of Field" effect
              width: index % 3 === 0 ? '160px' : index % 3 === 1 ? '220px' : '130px',
              height: index % 3 === 0 ? '220px' : index % 3 === 1 ? '300px' : '180px',
              left: `${(index * 14) % 85}%`,
              top: `${(index * 22) % 80}%`,
              zIndex: index % 3, // Mas malaki, mas nasa harap
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ 
              opacity: [0, 0.25, 0], 
              y: [-20, -100], // Mas mahaba at mas mabagal na float
              x: index % 2 === 0 ? [0, 20, 0] : [0, -20, 0], // Soft swaying
              rotate: index % 2 === 0 ? [-3, 3] : [3, -3]
            }}
            transition={{ 
              duration: 12 + (index % 6), // Sobrang bagal para sa cinematic feel
              repeat: Infinity, 
              delay: index * 0.7,
              ease: "linear" // Linear para walang biglang hinto
            }}
          >
            <img 
              src={src} 
              alt="" 
              className="w-full h-full object-cover grayscale-[60%] contrast-110 blur-[2px]" 
            />
            {/* Darker gradient mask per tile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Cinematic Vignette & Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-radial from-transparent via-[#050505]/60 to-[#050505] backdrop-blur-[3px]" />

      {/* --- LAYER 2: LOGO & BRANDING --- */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} // Custom "Expo" ease for smoothness
        >
          {/* LOGO WITH BREATHING GLOW */}
          <div className="relative mb-14">
            <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
              {/* Soft Pulsing Aura */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gold/15 blur-[60px]"
                animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Spinning Thin Ring */}
              <motion.div 
                className="absolute inset-[-18px] rounded-full border border-gold/10 border-t-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              {/* Main Logo Image */}
              <div className="relative h-full w-full rounded-full overflow-hidden border border-gold/30 p-2 bg-black shadow-[0_0_80px_rgba(0,0,0,1)]">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures Official Logo"
                  className="h-full w-full object-cover rounded-full"
                  animate={{ filter: ['brightness(1) contrast(1)', 'brightness(1.15) contrast(1.05)', 'brightness(1) contrast(1)'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Juan <span className="italic text-gold/90">Captures</span>
            </h1>
            
            <motion.div 
              className="h-[1px] w-32 bg-gold/40 mx-auto"
              animate={{ width: [100, 160, 100], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <p className="text-gold font-vibes text-3xl md:text-5xl tracking-widest pt-2 opacity-80 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              Capturing Moments, Creating Memories
            </p>
          </div>
        </motion.div>

        {/* ULTRA-SMOOTH PROGRESS BAR */}
        <div className="mt-28 flex flex-col items-center gap-5">
           <div className="w-64 h-[1.5px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold shadow-[0_0_20px_#D4AF37]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 8, // Mas matagal na load para sa cinematic feel
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
           </div>
           <span className="text-[9px] font-black uppercase tracking-[0.8em] text-white/20">
             Curating Your Story
           </span>
        </div>
      </div>
    </div>
  );
};
