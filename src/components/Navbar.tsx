import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Instagram, Facebook, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// PAALALA: Siguraduhing walang "import { supabase } from ..." dito 
// kung hindi naman ginagamit ang supabase sa Navbar.

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

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
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled
            ? 'py-3 md:py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="group flex items-center gap-3 md:gap-4">
              <div className="relative h-12 w-12 md:h-14 md:w-14 p-[2px] rounded-full bg-gradient-to-tr from-amber-500/40 to-transparent group-hover:from-amber-500 transition-all duration-700">
                <div className="h-full w-full rounded-full overflow-hidden border border-white/10 bg-black">
                  <img
                    src="/1775314217196.jpg"
                    alt="Logo"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-125"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-black text-white tracking-tighter leading-none group-hover:text-amber-500 transition-colors">
                  Juan<span className="italic text-amber-500/90">Captures</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/60 mt-1">
                  Est. 2018
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 px-8 py-3 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="relative group">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                      location.pathname === link.path ? 'text-amber-500' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {link.name}
                    </span>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </div>

              <Link
                to="/booking"
                className="group relative overflow-hidden px-8 py-3 bg-amber-500 rounded-full transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-2">
                   <Sparkles size={14} className="text-black" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-black">Reserve Date</span>
                </div>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden relative z-[70] w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white active:scale-90 transition-all"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] lg:hidden bg-black flex flex-col pt-32 px-10 pb-12"
          >
            <div className="flex flex-col h-full space-y-8 relative z-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/40">Navigation</span>
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`text-5xl font-serif font-bold tracking-tighter transition-all block ${
                          location.pathname === link.path ? 'text-amber-500 italic pl-4' : 'text-white'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Link
                  to="/booking"
                  className="flex items-center justify-center gap-3 w-full py-5 bg-amber-500 text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em]"
                >
                  <Sparkles size={16} />
                  Start Your Story
                </Link>
                <div className="flex gap-5 justify-center pt-4 text-gray-400">
                   <Instagram size={22} />
                   <Facebook size={22} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
