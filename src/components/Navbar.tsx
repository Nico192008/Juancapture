import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Navbar Background Change on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Auto-close Mobile Menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // 3. Smart Scroll Function for ALL Buttons
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // Convert name to ID format (e.g., "Book Now" -> "booking")
    const id = targetId === '/' ? 'home' : targetId.replace('/', '');

    if (location.pathname === '/') {
      // Kung nasa Home page, smooth scroll agad
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Kung nasa ibang page, balik sa Home tapos scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Konting delay para maka-load ang Home component
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Gallery', path: 'gallery' },
    { name: 'Videos', path: 'videos' },
    { name: 'About', path: 'about' },
    { name: 'Contact', path: 'contact' },
    { name: 'Book Now', path: 'booking' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong py-3 shadow-lg'
            : 'bg-gradient-to-b from-black/70 to-transparent py-5'
        }`}
      >
        <div className="container-custom px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo - Auto scroll to Top/Home */}
            <Link 
              to="/" 
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center space-x-3 group"
            >
              <motion.img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                className="h-12 w-12 object-cover rounded-full border-2 border-gold/50 transition-transform duration-300 group-hover:scale-110"
                whileHover={{ rotate: 5 }}
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-playfair font-bold text-white tracking-widest uppercase">
                  Juan Captures
                </h1>
                <p className="text-[10px] font-medium text-gold uppercase tracking-[0.2em]">
                  Creating Memories
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.path}`}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                    link.name === 'Book Now'
                      ? 'btn-gold-outline !py-2 !px-6 bg-gold/5 hover:bg-gold hover:text-black'
                      : 'text-white/80 hover:text-gold'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gold transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Links */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0a0a0a] border-l border-gold/20 flex flex-col pt-24 px-8"
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={`#${link.path}`}
                  onClick={(e) => handleNavClick(e, link.path)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`block py-5 text-lg font-medium tracking-widest uppercase border-b border-white/5 transition-colors ${
                    link.name === 'Book Now' ? 'text-gold' : 'text-white/70 hover:text-gold'
                  }`}
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
