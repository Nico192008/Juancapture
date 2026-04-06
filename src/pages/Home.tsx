import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Award, Users, ArrowRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Album, Testimonial } from '../types';

export const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const heroPhotos = [
    '/images/loading/load-1.jpg',
    '/images/loading/load-2.jpg',
    '/images/loading/load-3.jpg',
    '/images/loading/load-4.jpg',
    '/images/loading/load-5.jpg',
    '/images/loading/load-6.jpg',
    '/images/loading/load-7.jpg',
    '/images/loading/load-8.jpg',
    '/images/loading/load-9.jpg',
    '/images/loading/load-10.jpg',
  ];

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);

    const fetchData = async () => {
      const { data: albums } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

      if (albums) setFeaturedAlbums(albums);
      if (testimonialData) setTestimonials(testimonialData);
    };

    fetchData();
    return () => clearInterval(bgTimer);
  }, [heroPhotos.length]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBgIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${heroPhotos[currentBgIndex]})`,
                filter: 'brightness(0.3)',
              }}
            />
          </AnimatePresence>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505] z-[1]" />

        <div className="relative z-10 text-center px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
               <div className="h-[1px] w-8 md:w-12 bg-gold/50" />
               <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gold/80">Premium Studio</span>
               <div className="h-[1px] w-8 md:w-12 bg-gold/50" />
            </div>

            {/* Responsive Font Sizes: text-5xl sa mobile, text-9xl sa desktop */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-playfair font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
              Juan <span className="italic font-medium text-gold">Captures</span>
            </h1>
            
            <motion.p
              className="text-lg sm:text-xl md:text-3xl font-vibes text-white mb-8 md:mb-12 tracking-widest opacity-90 px-2"
            >
              "Capturing Moments, Creating Memories"
            </motion.p>

            {/* Buttons stack on mobile, row on tablet up */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
            >
              <Link to="/gallery" className="w-full sm:w-auto group bg-white text-black px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl">
                Explore Archives <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/booking" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest border border-white/20 hover:border-gold hover:text-gold transition-all duration-500 bg-white/5 backdrop-blur-md flex justify-center">
                Reserve Session
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-10"
        >
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Scroll Down</span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-20 md:py-32 bg-[#080808] relative">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-4 tracking-tight">Crafting Your Story</h2>
            <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Our Core Services</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: 'Photography', desc: 'Transforming seconds into timeless frames of art.' },
              { icon: Video, title: 'Videography', desc: 'Cinematic storytelling with a focus on emotional depth.' },
              { icon: Award, title: 'Premium Edits', desc: 'High-end post-production for that signature look.' },
              { icon: Users, title: 'Bespoke Experience', desc: 'Tailored specifically to your vision and events.' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className="glass-strong p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all duration-500 group bg-white/[0.02]"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 text-gold group-hover:scale-110 transition-transform duration-500">
                   <service.icon size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-playfair font-bold mb-4">{service.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED WORK SECTION --- */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 tracking-tighter">Featured <span className="italic text-gold">Masterpieces</span></h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Latest archives from the studio</p>
            </div>
            <Link to="/gallery" className="text-[10px] font-black uppercase tracking-[0.4em] text-gold hover:text-white transition-colors border-b border-gold/30 pb-2">View Portfolio</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {featuredAlbums.map((album) => (
              <motion.div key={album.id} className="group relative">
                <Link to="/gallery" className="block relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] aspect-[3/4] bg-white/5 border border-white/10">
                    <img
                      src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={album.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10">
                      <p className="text-[8px] md:text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-2">Collection</p>
                      <h3 className="text-xl md:text-2xl font-playfair font-bold text-white tracking-tight">{album.name}</h3>
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-32 bg-[#080808]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-playfair font-bold tracking-tight">Studio Voices</h2>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Client Experiences</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="glass-strong p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative bg-white/[0.01]"
                >
                  <div className="flex gap-1 mb-6 md:mb-8 text-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < testimonial.rating ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-gray-400 text-base md:text-lg font-playfair italic leading-relaxed mb-8 md:mb-10">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs border border-gold/20">
                        {testimonial.client_name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-white font-bold text-xs md:text-sm tracking-tight">{testimonial.client_name}</p>
                        <p className="text-gold text-[8px] md:text-[10px] font-black uppercase tracking-widest">{testimonial.event_type}</p>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 md:py-40">
        <div className="container mx-auto px-6">
          <motion.div
            className="relative glass-strong p-10 md:p-32 rounded-[2.5rem] md:rounded-[4rem] text-center border border-white/10 overflow-hidden bg-white/[0.02]"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-7xl font-playfair font-bold text-white mb-6 md:mb-8 tracking-tighter leading-tight">
                Ready to <span className="italic text-gold">Begin?</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-lg mb-8 md:mb-12 max-w-xl mx-auto font-medium leading-relaxed px-4">
                Let's transform your vision into a cinematic reality. Reserve your preferred date today.
              </p>
              <Link to="/booking" className="w-full sm:w-auto bg-white text-black px-10 md:px-12 py-4 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 inline-block">
                Book Your Session
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
