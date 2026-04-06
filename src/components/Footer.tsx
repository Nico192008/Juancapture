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
    <footer className="relative bg-[#050505] pt-24 border-t border-white/5 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gold/30 p-1 transition-all duration-500 group-hover:border-gold">
                <img
                  src="/1775314217196.jpg"
                  alt="Juan Captures"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold text-white tracking-tight">
                  Juan <span className="italic">Captures</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">
                  Est. 2026
                </p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium italic">
              "We don't just take photos; we preserve the soul of your most cherished moments through artistic excellence and cinematic storytelling."
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-500 hover:text-gold transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <ArrowRight size={10} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6">Expertise</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6">Connect</h4>
            <div className="space-y-4">
              <a
                href="mailto:juancapture1@gmail.com"
                className="flex items-center gap-3 text-gray-500 hover:text-gold transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10">
                  <Mail size={14} />
                </div>
                <span className="text-xs font-bold tracking-tight">juancapture1@gmail.com</span>
              </a>
              <a
                href="tel:+639922183874"
                className="flex items-center gap-3 text-gray-500 hover:text-gold transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10">
                  <Phone size={14} />
                </div>
                <span className="text-xs font-bold tracking-tight">+63 992 218 3874</span>
              </a>
              <div className="flex items-center gap-3 text-gray-500 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span className="text-xs font-bold tracking-tight">Balingasag, Misamis Oriental</span>
              </div>

              <div className="flex space-x-3 pt-4">
                {[
                  { icon: Facebook, href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                  { icon: Instagram, href: 'https://www.facebook.com/share/18iZ3mAZ2Q/' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            &copy; {currentYear} Juan Captures Studio. Crafted with Passion.
          </p>
          <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-gray-600">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
