import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Edit2, 
  Play, 
  X, 
  Check, 
  Loader2, 
  ChevronLeft,
  Video as VideoIcon,
  Film,
  AlertCircle,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error("Error fetching videos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async (id) => {
    if (!newTitle.trim()) return;
    try {
      const { error } = await supabase
        .from('videos')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;
      setVideos(prev => prev.map(v => v.id === id ? { ...v, title: newTitle } : v));
      setEditingId(null);
    } catch (err) {
      alert("Hindi ma-update ang title: " + err.message);
    }
  };

  const handleDeleteVideo = async (id, videoUrl, thumbUrl) => {
    if (!confirm("Sigurado ka bang buburahin ang video na ito?")) return;
    
    setDeletingId(id);
    try {
      const videoPath = videoUrl.split('/').pop();
      const thumbPath = thumbUrl.split('/').pop();
      
      if (videoPath) await supabase.storage.from('portfolio').remove([`videos/${videoPath}`]);
      if (thumbPath) await supabase.storage.from('portfolio').remove([`thumbnails/${thumbPath}`]);

      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert("Error sa pag-delete: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#050505] text-white selection:bg-gold/30">
      <div className="container-custom px-6">
        
        {/* --- AESTHETIC HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Background Decorative Text */}
            <span className="absolute -top-12 -left-4 text-[8rem] font-bold text-white/[0.02] select-none pointer-events-none hidden lg:block">
              STUDIO
            </span>
            
            <div className="flex items-center gap-3 text-gold mb-4">
              <span className="h-[1px] w-8 bg-gold/50"></span>
              <span className="uppercase tracking-[0.5em] text-[10px] font-black">Curated Archives</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-playfair italic font-medium tracking-tight leading-none">
              Manage <span className="text-gold not-italic font-bold font-sans">REELS</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-md font-light leading-relaxed border-l border-gold/20 pl-6">
              Refine your digital gallery. Edit titles, organize sequences, or remove content from your cinematic showcase.
            </p>
          </motion.div>

          <Link to="/admin/dashboard" className="group relative overflow-hidden bg-white/5 border border-white/10 px-10 py-5 rounded-full transition-all duration-500 hover:border-gold/50">
            <div className="relative z-10 flex items-center gap-3">
              <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-300" />
              <span className="font-bold text-[11px] uppercase tracking-[0.3em]">Control Center</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* --- VIDEO LIST AREA --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-gold" size={48} strokeWidth={1} />
              <div className="absolute inset-0 blur-xl bg-gold/20 animate-pulse"></div>
            </div>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em]">Synchronizing Vault...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="group relative bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden hover:border-gold/40 transition-all duration-700 flex flex-col h-full shadow-2xl"
                >
                  {/* Thumbnail Preview with Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[9px] font-bold tracking-widest uppercase">HD Master</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        <Play fill="currentColor" size={24} className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    {editingId === video.id ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="relative">
                          <input
                            autoFocus
                            className="w-full bg-white/5 border border-gold/50 rounded-xl px-5 py-4 text-sm outline-none focus:ring-1 ring-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateTitle(video.id)} className="flex-1 bg-gold text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all">
                            <Check size={14}/> Confirm
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <X size={16}/>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-3">
                            <Layers size={10} className="text-gold" />
                            <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Project Name</span>
                          </div>
                          <h3 className="text-2xl font-playfair font-semibold tracking-tight leading-snug group-hover:text-gold transition-colors duration-500">
                            {video.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Digital Asset ID</span>
                            <span className="text-[10px] font-mono text-gray-400">#{video.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => { setEditingId(video.id); setNewTitle(video.title); }}
                              className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              disabled={deletingId === video.id}
                              onClick={() => handleDeleteVideo(video.id, video.video_url, video.thumbnail_url)}
                              className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                            >
                              {deletingId === video.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {!loading && videos.length === 0 && (
              <div className="col-span-full py-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <VideoIcon className="text-gray-600" size={32} />
                </div>
                <h3 className="text-2xl font-playfair italic mb-3 text-gray-400">The vault is empty</h3>
                <Link to="/admin/dashboard" className="text-gold text-[10px] uppercase tracking-[0.3em] font-black hover:tracking-[0.4em] transition-all">
                  + Initiate New Upload
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-24 py-10 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-gray-600 text-[9px] font-bold uppercase tracking-[0.4em]">
            <AlertCircle size={12} className="text-gold/50"/>
            <span>Cloud Storage Synced</span>
            <span className="w-1 h-1 rounded-full bg-gray-800"></span>
            <span>Real-time Updates</span>
          </div>
        </div>

      </div>
    </div>
  );
};
