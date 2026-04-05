import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-strong mt-20">
      <div className="container-custom px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                /* rounded-full: Makes it a circle
                   object-cover: Prevents stretching
                   border: Adds a clean outline to separate it from the dark background
                */
                className="h-16 w-16 rounded-full object-cover border-2 border-gold/40 shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-playfair font-bold text-white">
                  Juan Captures
                </h3>
                <p className="text-sm font-vibes text-gold">
                  Creating Memories
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional photography and videography services capturing your
              most precious moments with artistic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-playfair font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Videos', path: '/videos' },
                { name: 'About', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="text-lg font-playfair font-semibold text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-gold transition-colors cursor-default">Wedding Photography</li>
              <li className="hover:text-gold transition-colors cursor-default">Event Coverage</li>
              <li className="hover:text-gold transition-colors cursor-default">Portrait Sessions</li>
              <li className="hover:text-gold transition-colors cursor-default">Videography</li>
              <li className="hover:text-gold transition-colors cursor-default">Photo Editing</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-playfair font-semibold text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:juancapture1@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors text-sm"
              >
                <Mail size={16} />
                <span>juancapture1@gmail.com</span>
              </a>
              <a
                href="tel:+6309922183874"
                className="flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors text-sm"
              >
                <Phone size={16} />
                <span>+63 09922183874</span>
              </a>
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://www.facebook.com/share/18iZ3mAZ2Q/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.facebook.com/share/18iZ3mAZ2Q/" // Update this if you have a separate IG link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Juan Captures. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
