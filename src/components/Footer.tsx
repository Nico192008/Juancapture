import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'About', path: '/about' },
    { name: 'Booking', path: '/booking' },
  ];

  const services = [
    'Wedding Photography',
    'Event Coverage',
    'Portrait Sessions',
    'Cinematic Videography',
    'High-End Editing',
  ];

  return (
    <footer className="relative bg-[#050505] pt-16 md:pt-24 border-t border-white/5 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gold/5 rounded-full blur-[80px] md:blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-6 pb-8 md:pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column - Full width on mobile, half on tablet, 4-cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-4 group justify-center sm:justify-start">
              <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden border border-gold/30 p-1 transition-all duration-500 group-hover:border-gold shadow-lg shadow-gold/5">
                <img
                  src="/1775314217196.jpg" 
                  alt="Juan Captures"
                  className="h-full w-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="text-left">
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-white tracking-tight leading-none mb-1">
                  Juan <span className="italic text-gold/90">Captures</span>
                </h3>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">
                  Est. 2018
                </p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium italic text-center sm:text-left mx-auto sm:mx-0">
              "We don't just take photos; we preserve the soul of your most cherished moments through artistic excellence and cinematic storytelling."
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 border-b border-white/5 pb-2 inline-block sm:block">Explore</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center justify-center sm:justify-start gap-2 text-gray-500 hover:text-gold transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest"
                  >
                    <ArrowRight size={10} className="hidden sm:block opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-gold" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 text-center sm:text-left">
            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 border-b border-white/5 pb-2 inline-block sm:block">Expertise</h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service} className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-white transition-colors cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 text-center sm:text-left">
            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 border-b border-white/5 pb-2 inline-block sm:block">Connect</h4>
            <div className="space-y-5">
              <a
                href="mailto:juancapture1@gmail.com"
                className="flex items-center justify-center sm:justify-start gap-3 text-gray-500 hover:text-gold transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/20 group-hover:text-gold transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-[11px] md:text-xs font-bold tracking-tight">juancapture1@gmail.com</span>
              </a>
              <a
                href="tel:+639922183874"
                className="flex items-center justify-center sm:justify-start gap-3 text-gray-500 hover:text-gold transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/20 group-hover:text-gold transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-[11px] md:text-xs font-bold tracking-tight">+63 992 218 3874</span>
              </a>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span className="text-[11px] md:text-xs font-bold tracking-tight">Balingasag, Misamis Oriental</span>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center sm:justify-start space-x-4 pt-4">
                {[
                  { icon: Facebook, href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                  { icon: Instagram, href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all bg-white/[0.02]"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 mt-16 md:mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-center md:text-left">
            &copy; {currentYear} <span className="text-gold/50">Juan Captures Studio.</span> Crafted with Passion.
          </p>
          <div className="flex gap-6 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-700">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
