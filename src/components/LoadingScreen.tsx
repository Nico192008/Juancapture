import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds for a more cinematic feel

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Ambient Background Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold/20 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  y: [null, Math.random() * -100],
                  opacity: [0, 0.5, 0] 
                }}
                transition={{ 
                  duration: Math.random() * 3 + 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Logo with Aperture/Lens Reveal Effect */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ 
                duration: 1.5, 
                ease: [0.16, 1, 0.3, 1] // Custom quintic out ease
              }}
              className="relative mb-12"
            >
              <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
                {/* Rotating Gold Ring */}
                <motion.div 
                  className="absolute inset-[-10px] rounded-full border border-gold/20 border-t-gold/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/30 p-2 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                  <motion.img
                    src="/1775314217196.jpg"
                    alt="Juan Captures"
                    className="h-full w-full object-cover rounded-full shadow-2xl"
                    animate={{
                      filter: [
                        'contrast(1) brightness(1)',
                        'contrast(1.1) brightness(1.2)',
                        'contrast(1) brightness(1)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Text Reveal */}
            <div className="space-y-4 overflow-hidden">
              <motion.h1
                initial={{ y: 50, opacity: 0, letterSpacing: "0.2em" }}
                animate={{ y: 0, opacity: 1, letterSpacing: "0.5em" }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-playfair font-black text-white uppercase"
              >
                Juan Captures
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="flex flex-col items-center"
              >
                <div className="h-[1px] w-12 bg-gold/40 mb-4" />
                <p className="text-gold font-vibes text-2xl tracking-wider">
                  Creating Visual Legacies
                </p>
              </motion.div>
            </div>

            {/* Minimal Progress Line */}
            <div className="mt-16 w-48 h-[2px] bg-white/5 mx-auto relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0 bg-gold"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
