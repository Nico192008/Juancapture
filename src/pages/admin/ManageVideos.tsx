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
  AlertCircle
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
      console.error(err.message);
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
      alert(err.message);
    }
  };

  const handleDeleteVideo = async (id: string, videoUrl: string, thumbUrl: string) => {
    if (!confirm("Sigurado ka bang buburahin ang video na ito? Hindi na ito mababawi.")) return;
    
    setDeletingId(id);
    try {
      // 1. Extract file names from URLs to delete from Storage
      const videoPath = videoUrl.split('/').pop();
      const thumbPath = thumbUrl.split('/').pop();
      
      if (videoPath) await supabase.storage.from('portfolio').remove([`videos/${videoPath}`]);
      if (thumbPath) await supabase.storage.from('portfolio').remove([`thumbnails/${thumbPath}`]);

      // 2. Delete from Database
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#050505] text-white selection:bg-gold/30">
      <div className="container-custom px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 text-gold mb-3 uppercase tracking-[0.4em] text-[10px] font-bold">
              <Film size={14}/>
              <span>Video Portfolio</span>
            </div>
            <h1 className="text-6xl font-playfair font-bold tracking-tight">Manage Videos</h1>
            <p className="text-gray-500 mt-2 font-medium tracking-wide">Edit titles and organize your cinematic reels.</p>
          </motion.div>

          <Link to="/admin/dashboard" className="group flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Back to Dashboard</span>
          </Link>
        </div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-gold" size={48} />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Loading Reels...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-gold/30 transition-all flex flex-col"
                >
                  {/* Thumbnail / Video Preview Area */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-gold group-hover:text-black group-hover:scale-110 transition-all">
                        <Play fill={editingId === video.id ? "none" : "currentColor"} size={24} className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-white/[0.02]">
                    {editingId === video.id ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-gold uppercase font-bold tracking-widest ml-1">Update Title</label>
                          <input
                            autoFocus
                            className="w-full bg-white/5 border border-gold/50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-gold/20 transition-all"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateTitle(video.id)}
                            className="flex-1 bg-gold text-black py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
                          >
                            <Check size={16}/> Save Changes
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-6 py-4 bg-white/5 rounded-xl font-bold text-xs hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <X size={16}/>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Video Project</p>
                          <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-gold transition-colors">{video.title}</h3>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <span className="text-[10px] font-mono text-gray-600 uppercase">
                            ID: {video.id.slice(0, 8)}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditingId(video.id); setNewTitle(video.title); }}
                              className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-gold hover:bg-gold/10 transition-all"
                              title="Edit Title"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              disabled={deletingId === video.id}
                              onClick={() => handleDeleteVideo(video.id, video.video_url, video.thumbnail_url)}
                              className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                              title="Delete Video"
                            >
                              {deletingId === video.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* --- EMPTY STATE --- */}
            {videos.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center glass-strong rounded-[3rem] border border-dashed border-white/10"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                  <VideoIcon size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Walang Videos Na-upload</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm">Magsimula sa pamamagitan ng pag-upload ng iyong unang reel sa Admin Dashboard.</p>
                <Link to="/admin/dashboard" className="text-gold font-bold uppercase text-xs tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                  Go to Dashboard <Plus size={14}/>
                </Link>
              </motion.div>
            )}
          </div>
        )}

        {/* --- FOOTER INFO --- */}
        {!loading && videos.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            <AlertCircle size={14}/>
            <span>Tip: Deleting a video also removes its file from the storage bucket.</span>
          </div>
        )}

      </div>
    </div>
  );
};
