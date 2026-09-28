import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingAIChat from './components/ai/FloatingAIChat';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import FarmerAdvisoryPage from './pages/FarmerAdvisoryPage';
import RiskMapPage from './pages/RiskMapPage';
import ForecastDetailPage from './pages/ForecastDetailPage';
import AIChatPage from './pages/AIChatPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import AlertsPage from './pages/AlertsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import MarketplacePage from './pages/MarketplacePage';
import MarketIntelligencePage from './pages/MarketIntelligencePage';
import SatelliteMonitorPage from './pages/SatelliteMonitorPage';
import SoilIntelligencePage from './pages/SoilIntelligencePage';
import CropDoctorPage from './pages/CropDoctorPage';
import ImpactSimulatorPage from './pages/ImpactSimulatorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import MobileBottomNav from './components/common/MobileBottomNav';

// Public pages — accessible without login
const PUBLIC_PATHS = ['/', '/login', '/register'];

// Protected Route Wrapper — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Loading KisanAI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Initializing KisanAI Platform...</p>
        </div>
      </div>
    );
  }

  // 1. Public Landing Page — always accessible, no sidebar/navbar
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-agri-50/60 via-slate-50 to-white flex flex-col selection:bg-agri-200">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    );
  }

  // 2. Auth pages (login / register) — full-screen, no chrome
  if (isAuthPage) {
    // Already logged in → go to dashboard
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return (
      <div className="min-h-screen bg-gradient-to-b from-agri-50/60 via-slate-50 to-white flex flex-col justify-between selection:bg-agri-200">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <div className="py-4 text-center text-xs text-slate-400">
          🌾 KisanAI • Hyperlocal Agricultural Intelligence &amp; Weather Advisory Platform
        </div>
      </div>
    );
  }

  // 3. All other pages — full app layout with sidebar + navbar (protected)
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-agri-200 selection:text-agri-950">

      {/* Left Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* Top Header */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-grow pb-16 lg:pb-0">
          <Routes>
            <Route path="/dashboard"          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/farmer-advisory"    element={<ProtectedRoute><FarmerAdvisoryPage /></ProtectedRoute>} />
            <Route path="/risk-map"           element={<ProtectedRoute><RiskMapPage /></ProtectedRoute>} />
            <Route path="/forecast"           element={<ProtectedRoute><ForecastDetailPage /></ProtectedRoute>} />
            <Route path="/ai-chat"            element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
            <Route path="/crop-advisory"      element={<ProtectedRoute><CropAdvisoryPage /></ProtectedRoute>} />
            <Route path="/satellite-monitor"  element={<ProtectedRoute><SatelliteMonitorPage /></ProtectedRoute>} />
            <Route path="/soil-intelligence"  element={<ProtectedRoute><SoilIntelligencePage /></ProtectedRoute>} />
            <Route path="/crop-doctor"        element={<ProtectedRoute><CropDoctorPage /></ProtectedRoute>} />
            <Route path="/impact-simulator"   element={<ProtectedRoute><ImpactSimulatorPage /></ProtectedRoute>} />
            <Route path="/simulator"          element={<Navigate to="/impact-simulator" replace />} />
            <Route path="/alerts"             element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/marketplace"        element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
            <Route path="/marketplace/:tab"   element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
            <Route path="/market-intelligence" element={<ProtectedRoute><MarketIntelligencePage /></ProtectedRoute>} />
            <Route path="/marketing"          element={<Navigate to="/market-intelligence" replace />} />
            <Route path="/about"              element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/admin"              element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/profile"            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*"                   element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

      </div>

      {/* Global Floating AI Assistant Widget */}
      <FloatingAIChat />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
