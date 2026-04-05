import React, { useState, useEffect } from 'react';
import { ShieldAlert, BellRing, CheckCircle2, ShieldX, Clock, Filter, Trash2, Zap } from 'lucide-react';
import api from '../services/api';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/alerts');
        setAlerts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-head text-2xl font-black text-white tracking-tight flex items-center gap-3 underline decoration-amber/30 decoration-4 underline-offset-8 uppercase">
            <BellRing size={24} className="text-amber animate-pulse" /> SYSTEM ALERTS
          </h2>
          <p className="text-text2 text-xs font-bold uppercase tracking-[0.2em] mt-4">Critical Compliance Monitoring</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="premium-btn px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
          <button className="premium-btn btn-primary px-8 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Acknowledge All
          </button>
        </div>
      </div>
      
      <div className="panel-card overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-6">
             <div className="relative">
                <div className="w-16 h-16 border-2 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-amber rounded-full border-t-transparent animate-spin"></div>
             </div>
             <div className="text-amber font-mono text-[10px] tracking-[0.4em] font-black uppercase">Intercepting Secure Packets...</div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-24 flex flex-col items-center justify-center text-center group">
            <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center text-green/40 mb-6 group-hover:scale-110 transition-transform duration-500 border border-green/5">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-2">Zero Threats Detected</h3>
            <p className="text-text3 text-[11px] font-medium max-w-[250px] leading-relaxed uppercase tracking-wider opacity-60">All monitored vehicles are currently within regulatory compliance standards.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {alerts.map((alert) => (
              <div key={alert._id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-6 md:p-8 hover:bg-white/[0.01] transition-all group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-amber transition-colors"></div>
                
                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    alert.alertType.includes('Expiry') ? 'bg-red/10 text-red border border-red/20' :
                    alert.alertType.includes('Due') ? 'bg-amber/10 text-amber border border-amber/20' : 
                    'bg-cyan/10 text-cyan border border-cyan/20'
                  }`}>
                    {alert.alertType.includes('Expiry') ? <ShieldX size={20} /> : <Zap size={20} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-head text-lg font-black text-white tracking-widest uppercase">{alert.plateNumber}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                        alert.alertType.includes('Expiry') ? 'bg-red/10 text-red border-red/20' :
                        alert.alertType.includes('Due') ? 'bg-amber/10 text-amber border-amber/20' : 
                        'bg-cyan/10 text-cyan border-cyan/20'
                      }`}>
                        {alert.alertType}
                      </span>
                    </div>
                    <div className="text-xs text-text2 font-bold tracking-tight mb-2 uppercase opacity-80">{alert.message}</div>
                    <div className="flex items-center gap-4 text-[10px] text-text3 font-black uppercase tracking-widest leading-none">
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-cyan/40" /> 2m ago</span>
                      <span className="flex items-center gap-1.5 px-3 border-l border-white/5"><div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div> Active Session</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:pl-8 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0">
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-bg border border-white/10 text-text2 text-[10px] font-black uppercase tracking-widest hover:text-cyan hover:border-cyan transition-all">
                    Acknowledge
                  </button>
                  <button className="px-3 py-2.5 rounded-xl bg-bg border border-white/10 text-text3 hover:text-red hover:border-red transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="stat-card ring-1 ring-red/10 group overflow-hidden">
            <div className="stat-label">Critical Vulnerabilities</div>
            <div className="stat-num text-red">{alerts.filter(a => a.alertType.includes('Expiry')).length}</div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-5 scale-[2] pointer-events-none group-hover:opacity-10 transition-opacity">
               <ShieldX size={100} />
            </div>
         </div>
         <div className="stat-card ring-1 ring-amber/10 group overflow-hidden">
            <div className="stat-label">Pending Verifications</div>
            <div className="stat-num text-amber">{alerts.filter(a => a.alertType.includes('Due')).length}</div>
             <div className="absolute right-[-10%] bottom-[-10%] opacity-5 scale-[2] pointer-events-none group-hover:opacity-10 transition-opacity">
               <Zap size={100} />
            </div>
         </div>
         <div className="stat-card ring-1 ring-cyan/10 group overflow-hidden">
            <div className="stat-label">Alert Clearance Rate</div>
            <div className="stat-num text-white">94%</div>
            <div className="prog-bar mt-4"><div className="prog-fill bg-cyan" style={{ width: '94%' }}></div></div>
         </div>
      </div>
    </div>
  );
};

export default AlertsPage;
