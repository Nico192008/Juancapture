import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Navbar background effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. FIXED: Auto-scroll logic kapag nag-load ang page na may hash
  useEffect(() => {
    if (location.hash === '/booking') {
      // Nagbibigay tayo ng kaunting delay (100ms) para siguradong render na ang DOM
      const timer = setTimeout(() => {
        const element = document.getElementById('booking-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // 3. Optimized Navigation Handler
  const handleNavClick = (e, path, name) => {
    setIsMobileMenuOpen(false); // Laging isara ang mobile menu pagka-click

    if (name === 'Book Now') {
      e.preventDefault();
      
      if (location.pathname === '/') {
        // Kung nasa Home na, scroll agad sa section
        const target = document.getElementById('booking-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Kung nasa ibang page, lipat muna sa Home na may hash
        navigate('/booking');
      }
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-lg py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo Section (Circle & Optimized) */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <motion.img
                  src="/1775314217196.jpg"
                  alt="Juan Captures"
                  className="h-12 w-12 rounded-full object-cover border-2 border-gold/50 shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold"
                  whileHover={{ rotate: 5 }}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight leading-none">
                  Juan Captures
                </h1>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-light mt-1">
                  Creating Memories
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path, link.name)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                    location.pathname === link.path && !location.hash
                      ? 'text-gold'
                      : 'text-gray-200 hover:text-gold'
                  } ${
                    link.name === 'Book Now'
                      ? 'bg-gold text-black font-bold px-7 py-2.5 rounded-full hover:bg-white transition-colors shadow-lg'
                      : 'hover:translate-y-[-2px]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gold transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full flex flex-col justify-center items-center space-y-10"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path, link.name)}
                    className={`text-3xl font-semibold tracking-wider ${
                      location.pathname === link.path
                        ? 'text-gold'
                        : 'text-white'
                    } ${
                      link.name === 'Book Now'
                        ? 'text-black bg-gold px-12 py-4 rounded-full shadow-xl shadow-gold/20'
                        : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
