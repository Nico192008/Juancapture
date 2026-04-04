import { Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export const FacebookMessenger = () => {
  const handleClick = () => {
    window.open('https://m.me/your-facebook-page', '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-gold-lg hover:shadow-gold transition-all duration-300"
      aria-label="Contact us on Facebook Messenger"
    >
      <Facebook className="text-white" size={28} />
    </motion.button>
  );
};
