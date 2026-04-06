import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, AlertCircle, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user, isAdmin, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('All credentials are required to access the vault.');
      }

      await signIn(email, password);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Access Denied: Invalid Credentials';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gold w-10 h-10" strokeWidth={1} />
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/50 font-bold">Verifying Session</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass-strong p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-12">
            <motion.div 
              className="relative inline-block mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full" />
              <img
                src="/1775314217196.jpg"
                alt="Juan Captures"
                className="h-24 w-24 object-cover rounded-full relative z-10 border-2 border-gold/40 shadow-2xl"
              />
            </motion.div>
            
            <h1 className="text-4xl font-playfair font-bold text-white tracking-tight">
              Studio <span className="text-gold italic">Vault</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mt-3">Admin Portal Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-black ml-1">Identity (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50"
                placeholder="admin@juancaptures.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-black ml-1">Access Key (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50"
                placeholder="••••••••••••"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 overflow-hidden"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-white hover:bg-gold text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span>Authenticate Access</span>
                </>
              )}
            </button>
          </form>

          {/* FOOTER LOG */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck size={14} className="text-gold/40" />
                <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encryption Active</span>
             </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <a href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-all text-[10px] font-bold uppercase tracking-widest">
            <ChevronLeft size={14} /> Back to Gallery
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
