import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO
} from 'date-fns';
import {
  Image as ImageIcon,
  Video,
  Calendar as CalendarIcon,
  LogOut,
  Plus,
  X,
  Upload,
  Loader2,
  ChevronRight,
  Trash2,
  Layers,
  ArrowUpRight,
  ChevronLeft,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ albums: 0, videos: 0, bookings: 0 });
  const [albumsList, setAlbumsList] = useState<{id: string, name: string}[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal & Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{id: string, name: string} | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
    return () => clearInterval(timer);
  }, [user, isAdmin, navigate, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const [albums, vids, bookingsData] = await Promise.all([
        supabase.from('albums').select('id, name').order('created_at', { ascending: false }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        // Kinuha natin lahat pero i-fifilter natin sa UI ang display
        supabase.from('bookings').select('*').order('date', { ascending: true }),
      ]);

      const allBookings = bookingsData.data || [];
      const approvedOnly = allBookings.filter(b => b.status === 'approved');

      setAlbumsList(albums.data || []);
      setBookings(allBookings);
      setStats({ 
        albums: albums.data?.length || 0, 
        videos: vids.count || 0, 
        bookings: approvedOnly.length // Bilang lang ng approved ang nasa main stat
      });
    } finally { setLoading(false); }
  };

  // --- CALENDAR RENDER LOGIC ---
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      <div className="flex flex-col">
        <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">Studio Scheduler</span>
        <h2 className="text-2xl font-playfair font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white"><ChevronLeft size={20}/></button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white"><ChevronRight size={20}/></button>
      </div>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        // DITO ANG FILTER: Magpakita lang ng dot kung APPROVED ang status
        const hasApprovedBooking = bookings.some(b => 
          isSameDay(parseISO(b.date), cloneDay) && b.status === 'approved'
        );
        
        days.push(
          <div
            key={day.toString()}
            className={`relative h-14 flex items-center justify-center cursor-pointer transition-all rounded-xl border border-transparent
              ${!isSameMonth(day, monthStart) ? 'text-gray-800' : 'text-white'}
              ${isSameDay(day, selectedDate) ? 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'hover:bg-white/5'}
            `}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-xs font-bold font-mono">{format(day, 'd')}</span>
            {hasApprovedBooking && (
              <span className="absolute bottom-2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,1)]" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  // AGENDA FILTER: Ipakita lang ang approved clients sa sidebar
  const selectedDayBookings = bookings.filter(b => 
    isSameDay(parseISO(b.date), selectedDate) && b.status === 'approved'
  );

  // --- CORE FUNCTIONS (Uploads/Modals) ---
  const openAlbum = async (album: {id: string, name: string}) => {
    setSelectedAlbum(album);
    setFetchingPhotos(true);
    const { data } = await supabase.from('images').select('*').eq('album_id', album.id);
    setAlbumPhotos(data || []);
    setFetchingPhotos(false);
  };

  const deletePhoto = async (id: string, url: string) => {
    if(!confirm("Delete this masterpiece?")) return;
    try {
      const path = url.split('/').pop();
      await supabase.storage.from('portfolio').remove([`images/${path}`]);
      await supabase.from('images').delete().eq('id', id);
      setAlbumPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert("Action failed"); }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setSubmitting(true);
    try {
      const uploadToBucket = async (file: File, folder: string) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `${folder}/${fileName}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) throw error;
        return supabase.storage.from('portfolio').getPublicUrl(filePath).data.publicUrl;
      };

      if (postType === 'image') {
        const url = await uploadToBucket(selectedFile, 'images');
        await supabase.from('images').insert([{ album_id: selectedAlbumId, image_url: url, caption: '' }]);
      } else {
        if (!thumbnailFile) throw new Error("Thumbnail required");
        const [vUrl, tUrl] = await Promise.all([
          uploadToBucket(selectedFile, 'videos'), 
          uploadToBucket(thumbnailFile, 'thumbnails')
        ]);
        await supabase.from('videos').insert([{ title, video_url: vUrl, thumbnail_url: tUrl }]);
      }
      resetForm();
      fetchDashboardData();
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setSelectedFile(null);
    setThumbnailFile(null);
    setSelectedAlbumId('');
    setTitle('');
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold w-8 h-8" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-bold italic">Loading Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container-custom pt-32 pb-20 px-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-7xl font-playfair font-bold tracking-tighter mb-2">
              Studio <span className="text-gold italic">Control</span>
            </h1>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {format(currentTime, 'hh:mm:ss a')} — Active Terminal
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowCreateModal(true)} className="group bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gold transition-all flex items-center gap-2 shadow-xl shadow-white/5">
              <Plus size={16} strokeWidth={3} /> New Archive
            </button>
            <button onClick={() => signOut()} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:text-red-500 transition-all hover:bg-red-500/10">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* --- MAIN BENTO SECTION --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          
          {/* CALENDAR BENTO BOX */}
          <div className="xl:col-span-2 glass-strong p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
              <div className="flex-1">
                {renderHeader()}
                <div className="grid grid-cols-7 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-600">{day}</div>
                  ))}
                </div>
                {renderCells()}
              </div>

              {/* Day Agenda Details (Approved Only) */}
              <div className="w-full lg:w-80 pt-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                <div className="mb-8">
                  <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                    <CheckCircle2 size={12}/> Confirmed Sessions
                  </h4>
                  <p className="text-2xl font-bold tracking-tight">{format(selectedDate, 'MMM dd, yyyy')}</p>
                </div>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedDayBookings.length > 0 ? (
                    selectedDayBookings.map((b, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        key={b.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/40 transition-all shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-3 text-white">
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <User size={14}/>
                          </div>
                          <span className="font-bold text-sm truncate">{b.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                             <Clock size={12}/>
                             <span>Reserved</span>
                           </div>
                           <span className="text-[9px] bg-gold/10 text-gold px-2 py-1 rounded-md font-bold uppercase tracking-widest italic">Approved</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center gap-4 opacity-40">
                      <CalendarIcon size={32} className="text-gray-600" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Confirmed Events</p>
                    </div>
                  )}
                </div>

                <Link to="/admin/bookings" className="mt-8 flex items-center justify-center gap-2 w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  Open Master Schedule <ArrowUpRight size={14}/>
                </Link>
              </div>
            </div>
          </div>

          {/* SIDE STATS */}
          <div className="flex flex-col gap-6">
             <Link to="/admin/albums" className="flex-1 glass-strong p-10 rounded-[3rem] border border-white/5 flex flex-col justify-between group hover:border-blue-400/30 transition-all">
                <div className="relative">
                  <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                    <ImageIcon size={26}/>
                  </div>
                  <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Gallery Vault</h3>
                  <div className="text-6xl font-bold tracking-tighter font-mono">{stats.albums}</div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2 group-hover:text-blue-400 transition-colors">Manage Collection <ChevronRight size={12}/></span>
             </Link>

             <Link to="/admin/videos" className="flex-1 glass-strong p-10 rounded-[3rem] border border-white/5 flex flex-col justify-between group hover:border-purple-400/30 transition-all">
                <div className="relative">
                  <div className="w-14 h-14 bg-purple-400/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                    <Video size={26}/>
                  </div>
                  <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Motion Reels</h3>
                  <div className="text-6xl font-bold tracking-tighter font-mono">{stats.videos}</div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2 group-hover:text-purple-400 transition-colors">Manage Portfolio <ChevronRight size={12}/></span>
             </Link>
          </div>
        </div>

        {/* RECENT ALBUMS */}
        <section className="glass-strong p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-12 px-2">
            <h3 className="text-3xl font-playfair font-bold flex items-center gap-4">
              <Layers className="text-gold" size={24} /> Recent <span className="italic text-gold">Masterpieces</span>
            </h3>
            <Link to="/admin/albums" className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 hover:text-white transition-all">View All Archives</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albumsList.slice(0, 4).map(album => (
              <button key={album.id} onClick={() => openAlbum(album)} className="flex items-center gap-5 p-6 bg-white/[0.02] border border-white/10 rounded-3xl hover:border-gold/50 hover:bg-white/[0.05] transition-all text-left shadow-lg group">
                <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><ImageIcon size={20}/></div>
                <span className="font-bold truncate text-sm uppercase tracking-tight">{album.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* --- MODALS (IMAGE VIEWER & CREATOR) --- */}
        <AnimatePresence>
          {selectedAlbum && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-strong w-full max-w-7xl h-[88vh] flex flex-col p-12 rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-playfair font-bold tracking-tighter text-white italic">{selectedAlbum.name}</h2>
                    <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mt-2">Archive contains {albumPhotos.length} Masterpieces</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="p-5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all group">
                    <X className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {fetchingPhotos ? <div className="flex flex-col items-center justify-center py-48 gap-6"><Loader2 className="animate-spin text-gold w-10 h-10" /><p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Synchronizing Vault...</p></div> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {albumPhotos.map(photo => (
                        <div key={photo.id} className="group relative bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/5 aspect-square shadow-xl">
                          <img src={photo.image_url} alt="" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                            <button onClick={() => deletePhoto(photo.id, photo.image_url)} className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all ml-auto shadow-2xl">
                              <Trash2 size={20}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative glass-strong w-full max-w-xl p-14 rounded-[4rem] border border-white/10 shadow-2xl">
                <button onClick={resetForm} className="absolute top-10 right-10 text-gray-500 hover:text-white p-2 transition-colors"><X size={24}/></button>
                <div className="text-center mb-12">
                   <h2 className="text-4xl font-playfair font-bold mb-3 italic">New Entry</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Portfolio Expansion</p>
                </div>
                
                <form onSubmit={handleCreatePost} className="space-y-8">
                  <div className="flex p-2 bg-black/60 border border-white/10 rounded-2xl">
                    {['image', 'video'].map((type) => (
                      <button key={type} type="button" onClick={() => setPostType(type as any)} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${postType === type ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-gray-300'}`}>{type}</button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {postType === 'image' ? (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gold uppercase ml-2 tracking-widest">Select Destination Album</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-gold transition-all appearance-none cursor-pointer font-bold text-sm"
                          value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                          <option value="" className="bg-[#050505]">Choose Album...</option>
                          {albumsList.map(a => <option key={a.id} value={a.id} className="bg-[#050505]">{a.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gold uppercase ml-2 tracking-widest">Production Label</label>
                        <input required type="text" placeholder="e.g., Wedding Highlight 2026" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-gold transition-all font-bold text-sm"
                          value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                      <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center relative hover:border-gold/40 transition-all bg-white/[0.01] group/upload">
                        <input required type="file" accept={postType === 'image' ? "image/*" : "video/*"} className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <Upload className="mx-auto text-gold/40 mb-4 group-hover/upload:scale-110 group-hover/upload:text-gold transition-all duration-500" size={40} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">
                          {selectedFile ? <span className="text-gold">{selectedFile.name}</span> : `Drag & Drop ${postType} asset here`}
                        </p>
                      </div>
                      
                      {postType === 'video' && (
                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center relative hover:border-purple-500/40 transition-all bg-white/[0.01]">
                          <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                          <div className="flex items-center justify-center gap-4">
                            <ImageIcon className="text-purple-400/50" size={24} />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              {thumbnailFile ? <span className="text-purple-400">{thumbnailFile.name}</span> : 'Assign Cover Poster'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button disabled={submitting} type="submit" className="w-full bg-white hover:bg-gold text-black py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all duration-500 active:scale-95 disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : (
                      <span className="flex items-center justify-center gap-3">Publish Masterpiece <ArrowUpRight size={18}/></span>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
