import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Dagdag para sa smooth reveal
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


function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {/* Ginawa nating motion.div para mag-fade in ang home pagkatapos ng loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FacebookMessenger />}
    </>
  );
}

function AppContent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // GINAWANG 8000ms (8 SECONDS) PARA MAG-MATCH SA LOADING SCREEN
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 8000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isInitialLoading ? (
        // Pakita ang LoadingScreen hanggang matapos ang 8 seconds
        <LoadingScreen key="loader" />
      ) : (
        // Pagkatapos ng 8 seconds, ilalabas na ang Layout at Routes
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
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
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/albums"
                element={
                  <ProtectedRoute>
                    <ManageAlbums />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/videos"
                element={
                  <ProtectedRoute>
                    <ManageVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <ManageBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <ManageTestimonials />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
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
