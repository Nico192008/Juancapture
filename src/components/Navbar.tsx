import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Book Now', path: '/booking' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong py-4'
            : 'bg-gradient-to-b from-black/50 to-transparent py-6'
        }`}
      >
        <div className="container-custom px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                whileHover={{ rotate: 5 }}
              />
              <div>
                <h1 className="text-2xl font-playfair font-bold text-white">
                  Juan Captures
                </h1>
                <p className="text-xs font-vibes text-gold">
                  Creating Memories
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-gold'
                      : 'text-white hover:text-gold'
                  } ${
                    link.name === 'Book Now'
                      ? 'btn-gold-outline !py-2 !px-6'
                      : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a href="/admin/login" className="btn-gold-outline !py-2 !px-6">
                Admin
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gold transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm glass-strong"
            >
              <div className="flex flex-col h-full pt-24 px-8 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-4 text-lg font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'text-gold'
                          : 'text-white hover:text-gold'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-white/10"
                >
                  <a href="/admin/login" className="block btn-gold text-center">
                    Admin Login
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
