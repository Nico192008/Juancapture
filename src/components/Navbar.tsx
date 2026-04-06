import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Instagram, Facebook, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Optimized Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      // Mas sensitive na trigger para sa mobile (10px instead of 20px)
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Body Lock & Orientation Change
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Iwas 'bounce' sa iOS Safari kapag naka-open ang menu
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
  }, [isMobileMenuOpen]);

  // Reset menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'py-3 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl'
            : 'py-5 md:py-8 bg-transparent'
        }`}
        // Support para sa mga phones na may "Notch" o "Dynamic Island"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="container mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between">
            
            {/* --- LOGO SECTION --- */}
            <Link to="/" className="group flex items-center gap-3 md:gap-4 outline-none">
              <div className="relative h-10 w-10 md:h-12 md:w-12 p-[1px] rounded-full bg-gradient-to-tr from-yellow-500/50 to-transparent">
                <div className="h-full w-full rounded-full overflow-hidden border border-white/10 bg-zinc-900">
                  <img
                    src="/1775314217196.jpg" 
                    alt="Juan Captures Logo"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-white tracking-tight leading-none group-hover:text-yellow-500 transition-colors">
                  Juan<span className="italic text-yellow-500/90">Captures</span>
                </span>
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-yellow-500/60 mt-1">
                  Est. 2018
                </span>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION --- */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-lg">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="relative group py-1">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      location.pathname === link.path ? 'text-yellow-500' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {link.name}
                    </span>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </nav>

              <Link
                to="/booking"
                className="group relative overflow-hidden px-6 py-2.5 bg-yellow-500 rounded-full transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                <div className="relative z-10 flex items-center gap-2">
                   <Sparkles size={14} className="text-black" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-black">Book Now</span>
                </div>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
              className="lg:hidden relative z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* --- MOBILE OVERLAY MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[55] lg:hidden bg-zinc-950 flex flex-col"
            style={{ 
              height: '100dvh', // Dynamic Viewport Height para sa mobile browsers
              paddingTop: 'calc(80px + env(safe-area-inset-top))',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* Aesthetic Background Grain/Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="flex flex-col h-full px-8 pb-10 relative z-10 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500/40 mb-2">Menu</p>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`text-4xl font-bold tracking-tighter block py-2 transition-all ${
                        location.pathname === link.path ? 'text-yellow-500 italic' : 'text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto space-y-4"
              >
                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/10">
                  <Link
                    to="/booking"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-yellow-500 text-black rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg active:scale-[0.98] transition-transform"
                  >
                    <Sparkles size={16} />
                    Book Now
                  </Link>
                  
                  <a
                    href="tel:+639922183874"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[11px] tracking-widest active:scale-[0.98] transition-transform"
                  >
                    <Phone size={16} className="text-yellow-500" />
                    Contact Us
                  </a>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <div className="flex gap-6 text-gray-400">
                      <a href="#" className="active:text-yellow-500"><Facebook size={20} /></a>
                      <a href="#" className="active:text-yellow-500"><Instagram size={20} /></a>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Misamis Oriental, PH</p>
                   </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
