import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Video, Award, Users } from 'lucide-react';
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
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://ubsnydvhhrqvbymjbtop.supabase.co/storage/v1/object/public/juancapture1's/file_000000008d9071faa08591b1e5f7ab58.png?auto=compress&cs=tinysrgb&w=1920)',
            filter: 'brightness(0.4)',
          }}
        />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6">
              Juan Captures
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-4xl font-vibes text-gold mb-8"
            >
              Capturing Moments, Creating Memories
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Professional photography and videography services that transform
              your special moments into timeless art
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/gallery" className="btn-gold">
                View Gallery
              </Link>
              <Link to="/booking" className="btn-gold-outline">
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-gold rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="section-padding bg-dark-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: 'Photography',
                description:
                  'Professional photography for weddings, events, and portraits',
              },
              {
                icon: Video,
                title: 'Videography',
                description:
                  'Cinematic video coverage for all your special occasions',
              },
              {
                icon: Award,
                title: 'Premium Quality',
                description:
                  'High-end equipment and expert editing for stunning results',
              },
              {
                icon: Users,
                title: 'Personalized Service',
                description:
                  'Tailored packages to meet your unique needs and vision',
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-strong p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300"
              >
                <service.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Featured Work
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our latest projects and see how we bring stories to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  to={`/gallery`}
                  className="group block glass rounded-lg overflow-hidden hover:shadow-gold-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={album.cover_image || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-playfair font-semibold text-white mb-1">
                        {album.name}
                      </h3>
                      <p className="text-sm text-gold">
                        {new Date(album.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link to="/gallery" className="btn-gold">
              View All Work
            </Link>
          </motion.div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-padding bg-dark-100">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
                Client Testimonials
              </h2>
              <div className="w-20 h-1 bg-gold mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-strong p-8 rounded-lg"
                >
                  <div className="flex text-gold mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">
                    "{testimonial.message}"
                  </p>
                  <div>
                    <p className="text-white font-semibold">
                      {testimonial.client_name}
                    </p>
                    <p className="text-gold text-sm">{testimonial.event_type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong p-12 md:p-16 rounded-lg text-center"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
              Ready to Capture Your Moments?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's create something beautiful together. Book your session today
              and let us tell your story.
            </p>
            <Link to="/booking" className="btn-gold">
              Book a Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
