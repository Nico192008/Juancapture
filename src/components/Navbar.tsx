import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Scroll Effect for Navbar Background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close Mobile Menu on Route Change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Smooth Scroll Function
  const handleNavClick = (e, path, name) => {
    if (name === 'Book Now' && location.pathname === '/') {
      e.preventDefault();
      const target = document.getElementById('booking-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsMobileMenuOpen(false);
    } 
    else if (name === 'Book Now' && location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById('booking-section');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Book Now', path: '#booking-section' },
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
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                /* UPDATED CLASSES BELOW: rounded-full and object-cover */
                className="h-12 w-12 rounded-full object-cover border-2 border-gold/30 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-gold"
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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path, link.name)}
                  className={`font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-gold'
                      : 'text-white hover:text-gold'
                  } ${
                    link.name === 'Book Now'
                      ? 'btn-gold-outline !py-2 !px-6 bg-gold/10'
                      : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gold transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={(e) => handleNavClick(e, link.path, link.name)}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
