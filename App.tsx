
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import MapPage from './pages/MapPage';
import EducationPage from './pages/EducationPage';
import ProfilePage from './pages/ProfilePage';
import ScanResultPage from './pages/ScanResultPage';
import AddRecyclerPage from './pages/AddRecyclerPage';
import { User, AuthState, ScanResult } from './types';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);

  // Mock persistence for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('snapUser');
    if (savedUser) {
      setAuthState({ user: JSON.parse(savedUser), isAuthenticated: true });
    }
    const savedHistory = localStorage.getItem('snapHistory');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  const login = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    localStorage.setItem('snapUser', JSON.stringify(user));
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('snapUser');
  };

  const addScan = (result: ScanResult) => {
    const updatedHistory = [result, ...scanHistory];
    setScanHistory(updatedHistory);
    setLastResult(result);
    localStorage.setItem('snapHistory', JSON.stringify(updatedHistory));
    
    // Update eco score
    if (authState.user) {
      const updatedUser = { 
        ...authState.user, 
        ecoScore: authState.user.ecoScore + (result.isRecyclable ? 10 : 2),
        scanCount: authState.user.scanCount + 1
      };
      login(updatedUser);
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar user={authState.user} onLogout={logout} />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!authState.isAuthenticated ? <LoginPage onLogin={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!authState.isAuthenticated ? <SignupPage onLogin={login} /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={authState.isAuthenticated ? <DashboardPage user={authState.user!} history={scanHistory} /> : <Navigate to="/login" />} />
            <Route path="/scanner" element={authState.isAuthenticated ? <ScannerPage onScanComplete={addScan} /> : <Navigate to="/login" />} />
            <Route path="/result" element={authState.isAuthenticated ? <ScanResultPage result={lastResult} /> : <Navigate to="/login" />} />
            <Route path="/map" element={authState.isAuthenticated ? <MapPage /> : <Navigate to="/login" />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/profile" element={authState.isAuthenticated ? <ProfilePage user={authState.user!} onLogout={logout} /> : <Navigate to="/login" />} />
            <Route path="/add-recycler" element={authState.isAuthenticated ? <AddRecyclerPage /> : <Navigate to="/login" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* Mobile Persistent Nav */}
        <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 glass-effect z-50">
          <MobileNavItem icon="fa-house" label="Home" path="/" />
          <MobileNavItem icon="fa-qrcode" label="Scan" path="/scanner" primary />
          <MobileNavItem icon="fa-map-location-dot" label="Map" path="/map" />
          <MobileNavItem icon="fa-chart-simple" label="Stats" path="/dashboard" />
        </div>
      </div>
    </HashRouter>
  );
};

const MobileNavItem: React.FC<{ icon: string; label: string; path: string; primary?: boolean }> = ({ icon, label, path, primary }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <a 
      href={`#${path}`} 
      className={`flex flex-col items-center gap-1 transition-all ${
        primary ? ' -translate-y-6' : ''
      }`}
    >
      <div className={`${
        primary 
          ? 'w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-stone-50' 
          : isActive ? 'text-emerald-600' : 'text-slate-400'
      }`}>
        <i className={`fa-solid ${icon} ${primary ? 'text-xl' : 'text-lg'}`}></i>
      </div>
      {!primary && <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>}
    </a>
  );
};

export default App;
