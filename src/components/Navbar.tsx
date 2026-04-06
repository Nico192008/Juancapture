import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  }, [location]);

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
            ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'py-8 bg-transparent'
        }`}
      >
        <div className="container-custom px-6">
          <div className="flex items-center justify-between">
            {/* --- LOGO SECTION --- */}
            <Link to="/" className="group flex items-center gap-4">
              <div className="relative h-14 w-14 p-[2px] rounded-full bg-gradient-to-tr from-gold/40 to-transparent group-hover:from-gold transition-all duration-700">
                <div className="h-full w-full rounded-full overflow-hidden border border-white/10">
                  <motion.img
                    src="/1775314217196.jpg"
                    alt="Juan Captures Logo"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-6"
                  />
                </div>
                <div className="absolute inset-0 rounded-full group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-playfair font-black text-white tracking-tighter leading-none group-hover:text-gold transition-colors">
                  Juan<span className="italic">Captures</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/60 mt-1">
                  Est. 2026
                </span>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION --- */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 px-8 py-3 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative group"
                  >
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                      location.pathname === link.path ? 'text-gold' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {link.name}
                    </span>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </div>

              <Link
                to="/booking"
                className="group relative overflow-hidden px-8 py-3 bg-gold rounded-full transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-2">
                   <Sparkles size={14} className="text-black" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-black">Reserve Date</span>
                </div>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10 text-white"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={24} />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] lg:hidden bg-black/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full pt-40 px-10 pb-12">
              <div className="space-y-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`text-5xl font-playfair font-bold tracking-tighter transition-all ${
                        location.pathname === link.path ? 'text-gold italic pl-4' : 'text-white'
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
                transition={{ delay: 0.6 }}
                className="mt-auto space-y-10"
              >
                <Link
                  to="/booking"
                  className="block w-full py-6 bg-gold text-black rounded-3xl font-black uppercase text-xs tracking-[0.3em] text-center"
                >
                  Start Your Story
                </Link>

                <div className="flex items-center justify-between border-t border-white/10 pt-10">
                   <div className="flex gap-6 text-gray-500">
                      <Facebook size={20} className="hover:text-gold cursor-pointer" />
                      <Instagram size={20} className="hover:text-gold cursor-pointer" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                      Based in Philippines
                   </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
