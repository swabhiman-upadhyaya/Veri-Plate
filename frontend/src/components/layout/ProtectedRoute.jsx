import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * ProtectedRoute — wraps authenticated pages with Sidebar + Topbar layout.
 * Redirects to /auth if not logged in.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-cyan font-mono tracking-widest bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">Initializing System</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="flex min-h-screen bg-bg text-text font-body selection:bg-cyan/30">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden md:ml-[240px] transition-all duration-300">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
