import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Video, Clock, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `nav-item ${isActive ? 'active' : ''}`;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      <aside className={`w-[240px] bg-bg2 border-r border-border flex flex-col fixed top-0 bottom-0 z-[120] shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pb-5 border-b border-white/[0.03] flex items-center justify-between">
          <div>
            <div className="logo-text">VERIPLATE</div>
            <div className="logo-sub">SECURE ACCESS v2.4</div>
          </div>
          <button onClick={onClose} className="md:hidden text-text2 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <div className="nav-section">Operations</div>
          <NavLink to="/app/lookup" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <Search className="nav-icon" /> Plate Lookup
          </NavLink>
          <NavLink to="/app/live" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <Video className="nav-icon" /> Live Feed
          </NavLink>
          <div className="nav-section mt-4">Intelligence</div>
          <NavLink to="/app/history" className={navLinkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <Clock className="nav-icon" /> Scan History
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-white/[0.03] bg-white/[0.01]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group" onClick={handleLogout} title="Logout">
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-xl bg-cyan-dim border border-cyan/20 flex items-center justify-center text-[13px] font-bold text-cyan shrink-0 transition-transform group-hover:scale-105">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="max-w-[110px]">
                <div className="text-[12px] font-bold text-white truncate">{user?.email || 'System User'}</div>
                <div className="text-[10px] text-text3 font-medium uppercase tracking-[0.05em]">{user?.role || 'Field Officer'}</div>
              </div>
            </div>
            <LogOut size={16} className="text-text3 group-hover:text-red transition-all" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
