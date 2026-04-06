import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { AuthProvider } from './contexts/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FacebookMessenger } from './components/FacebookMessenger';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { Videos } from './pages/Videos';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Booking } from './pages/Booking';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageAlbums } from './pages/admin/ManageAlbums';
import { ManageVideos } from './pages/admin/ManageVideos';
import { ManageBookings } from './pages/admin/ManageBookings';
import { ManageTestimonials } from './pages/admin/ManageTestimonials';


function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FacebookMessenger />}
    </>
  );
}

function AppContent() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // SAKTONG 8 SECONDS MASTER TIMER
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatePresence mode="wait">
        {appLoading ? (
          <motion.div
            key="dual-scroll-loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 1.5, ease: "easeInOut" } // SMOOTH FADE
            }}
            className="fixed inset-0 z-[100]"
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="main-home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }} // GENTLE FADE IN
          >
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/albums" element={<ProtectedRoute><ManageAlbums /></ProtectedRoute>} />
                <Route path="/admin/videos" element={<ProtectedRoute><ManageVideos /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
                <Route path="/admin/testimonials" element={<ProtectedRoute><ManageTestimonials /></ProtectedRoute>} />
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
