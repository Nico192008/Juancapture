import { motion } from 'framer-motion';
import { Camera, Heart, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
            About Us
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mb-6" />
          <p className="text-xl font-vibes text-gold">
            Capturing Moments, Creating Memories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-strong rounded-lg overflow-hidden"
          >
            <img
              src="https://raw.githubusercontent.com/Nico192008/Juancapture/refs/heads/main/public/FB_IMG_1775411020911.jpg?auto=compress&cs=tinysrgb&w=800"
              alt="Photographer"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl font-playfair font-bold text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Welcome to Juan Captures, where every moment tells a story and
                every story deserves to be beautifully preserved. Founded with a
                passion for visual storytelling, we specialize in capturing the
                essence of life's most precious moments.
              </p>
              <p>
                With years of experience in both photography and videography, we
                bring a unique artistic vision to every project. Our approach
                combines technical excellence with creative innovation, ensuring
                that each image and video we create is not just a memory, but a
                work of art.
              </p>
              <p>
                From intimate portraits to grand celebrations, from corporate
                events to personal milestones, we are dedicated to delivering
                exceptional visual content that exceeds expectations. We believe
                that every client deserves personalized attention and a final
                product that truly reflects their unique story.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-playfair font-bold text-white text-center mb-12">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: 'Professional Equipment',
                description:
                  'State-of-the-art cameras and equipment for stunning quality',
              },
              {
                icon: Heart,
                title: 'Passionate Team',
                description:
                  'Dedicated professionals who love what they do',
              },
              {
                icon: Award,
                title: 'Award Winning',
                description:
                  'Recognized for excellence in photography and videography',
              },
              {
                icon: Users,
                title: 'Client Focused',
                description:
                  'Personalized service tailored to your unique needs',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-strong p-8 rounded-lg text-center"
              >
                <item.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong p-12 rounded-lg"
        >
          <h2 className="text-4xl font-playfair font-bold text-white text-center mb-6">
            Our Mission
          </h2>
          <p className="text-gray-300 text-center text-lg leading-relaxed max-w-4xl mx-auto">
            Our mission is to create timeless visual narratives that preserve
            life's most meaningful moments. We strive to deliver exceptional
            quality, creativity, and service in every project we undertake. By
            combining technical expertise with artistic vision, we aim to exceed
            our clients' expectations and create memories that last a lifetime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-dark-100 p-12 rounded-lg text-center"
        >
          <h2 className="text-3xl font-playfair font-bold text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-gray-400 mb-8">
            Ready to capture your special moments? Get in touch with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-gold">
              Contact Us
            </a>
            <a href="/booking" className="btn-gold-outline">
              Book a Session
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
