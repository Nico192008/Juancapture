import { Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export const FacebookMessenger = () => {
  const handleClick = () => {
    window.open('https://www.facebook.com/share/18iZ3mAZ2Q/', '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 1. OUTER PULSING GLOW (Para mapansin ng client) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold/30 blur-md"
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* 2. MAIN BUTTON */}
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 25px rgba(212, 175, 55, 0.6)" 
        }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="relative w-16 h-16 bg-[#0a0a0a] border border-gold/40 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden group"
        aria-label="Contact us on Facebook Messenger"
      >
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Facebook Icon - Gold Color */}
        <Facebook 
          className="text-gold group-hover:text-white transition-colors duration-300" 
          size={28} 
          strokeWidth={1.5}
        />
      </motion.button>

      {/* 3. TOOLTIP (Optional but adds premium feel) */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-20 top-1/2 -translate-y-1/2 bg-black/80 border border-gold/20 backdrop-blur-md px-4 py-2 rounded-lg pointer-events-none hidden md:block"
      >
        <p className="text-gold font-playfair text-xs uppercase tracking-widest whitespace-nowrap">
          Chat with us
        </p>
      </motion.div>
    </div>
  );
};
