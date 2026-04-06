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
  AlertCircle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ManageVideos = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error("Error fetching videos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async (id: string) => {
    if (!newTitle.trim()) return;
    try {
      const { error } = await supabase
        .from('videos')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;
      setVideos(prev => prev.map(v => v.id === id ? { ...v, title: newTitle } : v));
      setEditingId(null);
    } catch (err: any) {
      alert("Failed to update title: " + err.message);
    }
  };

  const handleDeleteVideo = async (id: string, videoUrl: string, thumbUrl: string) => {
    if (!confirm("Are you sure you want to permanently delete this reel?")) return;
    
    setDeletingId(id);
    try {
      const videoPath = videoUrl.split('/').pop();
      const thumbPath = thumbUrl.split('/').pop();
      
      if (videoPath) await supabase.storage.from('portfolio').remove([`videos/${videoPath}`]);
      if (thumbPath) await supabase.storage.from('portfolio').remove([`thumbnails/${thumbPath}`]);

      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      alert("Delete error: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#050505] text-white selection:bg-gold/30">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container-custom px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <span className="absolute -top-16 -left-6 text-[10rem] font-playfair font-bold text-white/[0.02] select-none pointer-events-none hidden lg:block">
              REELS
            </span>
            
            <div className="flex items-center gap-3 text-gold mb-6">
              <div className="h-[1px] w-12 bg-gold/40"></div>
              <span className="uppercase tracking-[0.5em] text-[10px] font-black italic">Cinematic Inventory</span>
            </div>
            
            <h1 className="text-7xl lg:text-8xl font-playfair font-bold tracking-tighter leading-none">
              Motion <span className="text-gold italic font-medium">Vault</span>
            </h1>
            <p className="text-gray-500 mt-8 max-w-sm font-medium leading-relaxed border-l-2 border-gold/10 pl-6 uppercase text-[10px] tracking-widest">
              Manage your high-definition video assets and cinematic sequences for the global showcase.
            </p>
          </motion.div>

          <Link to="/admin/dashboard" className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl transition-all duration-500 hover:border-gold/30 hover:bg-white/10">
            <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="font-bold text-[11px] uppercase tracking-[0.3em]">Exit to Studio</span>
          </Link>
        </div>

        {/* VIDEO GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-6">
            <Loader2 className="animate-spin text-gold" size={40} strokeWidth={1} />
            <p className="text-gray-600 font-bold text-[10px] uppercase tracking-[0.5em] animate-pulse">Syncing Motion Assets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group relative bg-white/[0.02] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-700 flex flex-col shadow-2xl"
                >
                  {/* VISUAL PREVIEW */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
                    
                    {/* TOP BADGE */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/80 italic">4K Master</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                        <Play fill="currentColor" size={28} className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* INFO AREA */}
                  <div className="p-10 flex-1 flex flex-col">
                    {editingId === video.id ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="relative">
                          <input
                            autoFocus
                            className="w-full bg-white/5 border border-gold/40 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:ring-1 ring-gold shadow-2xl"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleUpdateTitle(video.id)} className="flex-1 bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold transition-all">
                            <Check size={16} strokeWidth={3}/> Update Title
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-6 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <X size={20}/>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className="mb-10">
                          <div className="flex items-center gap-2 mb-4">
                            <Layers size={12} className="text-gold/50" />
                            <span className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Digital Asset Archive</span>
                          </div>
                          <h3 className="text-3xl font-playfair font-bold tracking-tight leading-tight group-hover:text-gold transition-colors duration-500">
                            {video.title}
                          </h3>
                        </div>
                        
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em] mb-1">UUID TAG</span>
                            <span className="text-[10px] font-mono text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded">#{video.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditingId(video.id); setNewTitle(video.title); }}
                              className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all group/btn"
                            >
                              <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                            </button>
                            <button 
                              disabled={deletingId === video.id}
                              onClick={() => handleDeleteVideo(video.id, video.video_url, video.thumbnail_url)}
                              className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group/btn"
                            >
                              {deletingId === video.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* EMPTY STATE */}
            {!loading && videos.length === 0 && (
              <div className="col-span-full py-40 text-center rounded-[3.5rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-700">
                  <VideoIcon size={40} />
                </div>
                <h3 className="text-3xl font-playfair italic mb-4 text-gray-500">No Motion Archives Found</h3>
                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-[0.4em] hover:tracking-[0.5em] transition-all bg-gold/5 px-8 py-4 rounded-full border border-gold/10">
                  Begin New Capture <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* STATUS FOOTER */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col items-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-gold/40"/>
              <span>Database Online</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-800"></div>
            <span>Storage Synced</span>
            <div className="w-1 h-1 rounded-full bg-gray-800"></div>
            <span>v2.0 Asset Manager</span>
          </div>
        </div>

      </div>
    </div>
  );
};
