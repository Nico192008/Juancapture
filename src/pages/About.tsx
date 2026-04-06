import { motion } from 'framer-motion';
import { Camera, Heart, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 md:pt-40 pb-24 overflow-hidden relative">
      {/* Background Accents - Optimized Blur */}
      <div className="absolute top-[10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gold/5 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-gold">
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">The Studio</span>
            <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
            Our <span className="italic text-gold">Philosophy</span>
          </h1>
          <p className="text-lg md:text-xl font-playfair italic text-gray-400 max-w-2xl mx-auto px-4">
            "Preserving the beauty of today for the memories of tomorrow."
          </p>
        </motion.div>

        {/* --- STORY SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-24 md:mb-32 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative group px-4 md:px-0"
          >
            {/* Decorative Frame */}
            <div className="absolute -inset-2 md:-inset-4 border border-gold/20 rounded-[2rem] md:rounded-[3rem] -z-10 group-hover:inset-0 transition-all duration-700" />
            <div className="aspect-[4/5] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <img
                src="https://raw.githubusercontent.com/Nico192008/Juancapture/refs/heads/main/public/FB_IMG_1775411020911.jpg"
                alt="Juan Captures Studio"
                className="w-full h-full object-cover grayscale-[20%] md:grayscale-[30%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                loading="lazy"
              />
            </div>
            {/* EST Badge - Adjusted for Mobile */}
            <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-gold p-5 md:p-8 rounded-xl md:rounded-2xl shadow-2xl">
               <span className="text-black font-black text-2xl md:text-4xl font-mono tracking-tighter">EST.</span>
               <p className="text-black font-bold text-sm md:text-lg mt-0 md:mt-1 text-center">2024</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left px-2"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-4">Our Narrative</h2>
            <h3 className="text-3xl md:text-5xl font-playfair font-bold mb-6 md:mb-8 leading-tight">Every Frame Tells a <span className="italic">Profound Story</span></h3>
            
            <div className="space-y-4 md:space-y-6 text-gray-400 text-base md:text-lg leading-relaxed font-medium">
              <p>
                Welcome to <span className="text-white font-bold">Juan Captures</span>, where every moment tells a story and
                every story deserves to be beautifully preserved. Founded with a
                passion for visual storytelling, we specialize in capturing the
                essence of life's pinaka-precious moments.
              </p>
              <p>
                Ang aming approach combines technical excellence with creative innovation, ensuring
                na bawat image at video na ginagawa namin ay hindi lang alaala, kundi isang
                work of art.
              </p>
              <p className="hidden md:block">
                We believe that every client deserves personalized attention and a final
                product that truly reflects their unique journey. Our dedication to craftsmanship ensures your milestones remain timeless.
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- FEATURES GRID --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 md:mb-32"
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 tracking-tight">The Excellence Standard</h2>
            <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Why Discerning Clients Choose Us</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Camera, title: 'Cine-Grade Tech', desc: 'Utilizing top-tier industry equipment for unrivaled visual clarity.' },
              { icon: Heart, title: 'Visionary Passion', desc: 'A team driven by the art of the frame and the depth of the story.' },
              { icon: Award, title: 'Signature Style', desc: 'Recognized for a distinct aesthetic that blends luxury and emotion.' },
              { icon: Users, title: 'Bespoke Service', desc: 'Tailored photography experiences designed around your unique persona.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-gold/30 transition-all duration-500 group bg-white/[0.02]"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 text-gold group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-gold/5">
                   <item.icon size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-playfair font-bold mb-3 md:mb-4">{item.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- MISSION BOX --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-strong p-10 md:p-24 rounded-[2.5rem] md:rounded-[4rem] text-center border border-white/10 overflow-hidden bg-white/[0.01]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gold mb-4 md:mb-6">Our Mission</h2>
            <h3 className="text-2xl md:text-5xl font-playfair font-bold mb-6 md:mb-8 tracking-tighter italic leading-snug">
              "To immortalize the fleeting beauty of life through the lens of art."
            </h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium px-2">
              We strive to deliver exceptional quality, creativity, and service in every project. 
              By combining technical expertise with artistic vision, we aim to exceed 
              expectations.
            </p>
          </div>
        </motion.div>

        {/* --- CTA SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-8 tracking-tight">Ready to Write Your Story?</h2>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
            <Link to="/contact" className="w-full sm:w-auto group bg-white text-black px-10 md:px-12 py-5 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl">
              Get in Touch <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/booking" className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] border border-white/20 hover:border-gold hover:text-gold transition-all duration-500 bg-white/5 backdrop-blur-md">
              Book a Session
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
