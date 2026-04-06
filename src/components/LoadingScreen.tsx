import { useState, useEffect } from 'react'; // TAMA: Lowercase 'i' na ito
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kinokontrol nito ang tagal ng loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="juan-captures-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Ambient Background Particles - Inayos para sa Vercel/SSR compatibility */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold/20 rounded-full"
                style={{ 
                  left: `${(i * 7) % 100}%`, // Static distribution para iwas hydration error
                  top: `${(i * 13) % 100}%` 
                }}
                animate={{ 
                  y: [0, -100],
                  opacity: [0, 0.5, 0] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "linear" 
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-6">
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto">
                {/* Rotating Outer Ring */}
                <motion.div 
                  className="absolute inset-[-12px] rounded-full border border-gold/10 border-t-gold/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Main Logo Container */}
                <div className="h-full w-full rounded-full overflow-hidden border-2 border-gold/30 p-2 shadow-[0_0_60px_rgba(212,175,55,0.15)] bg-black">
                  <motion.img
                    src="/1775314217196.jpg"
                    alt="Juan Captures"
                    className="h-full w-full object-cover rounded-full"
                    animate={{
                      filter: [
                        'contrast(1) brightness(1)',
                        'contrast(1.1) brightness(1.2)',
                        'contrast(1) brightness(1)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Text Animations */}
            <div className="space-y-6 overflow-hidden">
              <div className="space-y-2">
                <motion.h1
                  initial={{ y: 40, opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ y: 0, opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                  className="text-3xl md:text-5xl font-playfair font-black text-white uppercase"
                >
                  Juan Captures
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-[1px] w-16 bg-gold/30 mb-4" />
                  <p className="text-gold font-vibes text-2xl md:text-3xl tracking-widest">
                    Creating Visual Legacies
                  </p>
                </motion.div>
              </div>

              {/* Progress Loading Bar */}
              <div className="mt-12 w-40 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gold/60 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
