import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { AuthProvider } from './contexts/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
// ... import other pages (Gallery, Videos, etc.)

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function AppContent() {
  const [appIsLoading, setAppIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppIsLoading(false);
    }, 8000); // 8 Seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatePresence mode="wait">
        {appIsLoading ? (
          <motion.div
            key="loading-zoom-out"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, // GINAWANG ZOOM OUT (Paliit)
              filter: "blur(20px)",
              transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } 
            }}
            className="fixed inset-0 z-[100]"
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="home-zoom-in"
            initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }} // GINAWANG ZOOM IN (Mula malaki papuntang normal)
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* I-paste dito ang lahat ng dating Routes mo */}
              </Routes>
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
