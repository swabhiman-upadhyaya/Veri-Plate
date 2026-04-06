import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Shield, Radio } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const [time, setTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('lookup')) return 'Plate Lookup';
    if (path.includes('live')) return 'Live Feed';
    if (path.includes('alerts')) return 'Activity Alerts';
    if (path.includes('history')) return 'Scan History';
    return 'Dashboard Overview';
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-bg2/80 backdrop-blur-xl border-b border-border sticky top-0 z-[100]">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-text2 hover:text-text transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="page-title hidden sm:block">{getPageTitle()}</div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-bg3/60 border border-border px-3 py-1.5 rounded-xl">
           <Search size={14} className="text-text3" />
           <input 
             type="text" 
             placeholder="Search records..." 
             className="bg-transparent border-none outline-none text-[12px] text-text2 placeholder:text-text3 w-[150px]"
           />
        </div>

        <div className="flex items-center gap-4 bg-bg3/60 border border-border px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-2 border-r border-border pr-3">
            <div className="relative">
              <Radio size={14} className="text-green animate-pulse" />
              <div className="absolute inset-0 bg-green/20 blur-sm rounded-full animate-ping"></div>
            </div>
            <span className="text-[10px] font-mono font-bold text-green tracking-wider uppercase">Live</span>
          </div>
          <div className="text-[11px] text-text2 font-mono font-medium min-w-[70px] text-center">
            {time || '--:--:--'}
          </div>
        </div>

        <button className="relative p-2 text-text2 hover:text-text transition-colors lg:hidden">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full border-2 border-bg"></span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
