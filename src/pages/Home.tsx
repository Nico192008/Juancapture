import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Video, Award, Users, ArrowRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Album, Testimonial } from '../types';

export const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: 'url(https://raw.githubusercontent.com/Nico192008/Juancapture-photos/refs/heads/main/file_000000008d9071faa08591b1e5f7ab58.png?auto=compress&cs=tinysrgb&w=1920)',
            filter: 'brightness(0.3)',
          }}
        />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-gold/5 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
               <div className="h-[1px] w-12 bg-gold/50" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gold/80">Premium Studio</span>
               <div className="h-[1px] w-12 bg-gold/50" />
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-playfair font-bold tracking-tighter mb-6">
              Juan <span className="italic font-medium text-gold">Captures</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-2xl md:text-3xl font-playfair italic text-gray-400 mb-12 tracking-wide"
            >
              "Capturing Moments, Creating Memories"
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/gallery" className="group bg-white text-black px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold transition-all duration-500 flex items-center gap-3">
                Explore Archives <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/booking" className="px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 hover:border-gold hover:text-gold transition-all duration-500 bg-white/5 backdrop-blur-sm">
                Reserve Session
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* --- SERVICES SECTION (Bento Style) --- */}
      <section className="py-32 bg-[#080808] relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 tracking-tight">Crafting Your Story</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Our Core Services</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: 'Photography', desc: 'Transforming seconds into timeless frames of art.' },
              { icon: Video, title: 'Videography', desc: 'Cinematic storytelling with a focus on emotional depth.' },
              { icon: Award, title: 'Premium Edits', desc: 'High-end post-production for that signature look.' },
              { icon: Users, title: 'Bespoke Experience', desc: 'Tailored specifically to your vision and events.' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong p-10 rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-gold group-hover:scale-110 transition-transform duration-500">
                   <service.icon size={28} />
                </div>
                <h3 className="text-xl font-playfair font-bold mb-4">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED WORK SECTION --- */}
      <section className="py-32">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-5xl font-playfair font-bold mb-4 tracking-tighter">Featured <span className="italic text-gold">Masterpieces</span></h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Latest archives from the studio</p>
            </motion.div>
            <Link to="/gallery" className="text-[10px] font-black uppercase tracking-[0.4em] text-gold hover:text-white transition-colors border-b border-gold/30 pb-2">View Portfolio</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link to="/gallery" className="block relative overflow-hidden rounded-[2.5rem] aspect-[3/4] bg-white/5 border border-white/10">
                    <img
                      src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={album.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-10">
                      <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-2">Collection</p>
                      <h3 className="text-2xl font-playfair font-bold text-white tracking-tight">
                        {album.name}
                      </h3>
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      {testimonials.length > 0 && (
        <section className="py-32 bg-[#080808]">
          <div className="container-custom">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-playfair font-bold tracking-tight">Studio Voices</h2>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Client Experiences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-strong p-10 rounded-[3rem] border border-white/5 relative"
                >
                  <div className="flex gap-1 mb-8 text-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < testimonial.rating ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-gray-400 text-lg font-playfair italic leading-relaxed mb-10">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">
                        {testimonial.client_name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-white font-bold text-sm tracking-tight">{testimonial.client_name}</p>
                        <p className="text-gold text-[10px] font-black uppercase tracking-widest">{testimonial.event_type}</p>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION --- */}
      <section className="py-40">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-strong p-20 md:p-32 rounded-[4rem] text-center border border-white/10 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-8 tracking-tighter">
                Ready to <span className="italic text-gold">Begin?</span>
              </h2>
              <p className="text-gray-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                Let's transform your vision into a cinematic reality. Reserve your preferred date today.
              </p>
              <Link to="/booking" className="bg-white text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 inline-block shadow-2xl shadow-white/5">
                Book Your Session
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
