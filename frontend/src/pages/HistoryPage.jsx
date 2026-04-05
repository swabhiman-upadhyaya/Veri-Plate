import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, Filter, Calendar, ArrowUpRight, History, MoreHorizontal } from 'lucide-react';
import api from '../services/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        setHistory(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="font-head text-2xl font-black text-white tracking-tight flex items-center gap-3 underline decoration-cyan/30 decoration-4 underline-offset-8 uppercase">
            <History size={24} className="text-cyan" /> VIOLATION ARCHIVE
          </h2>
          <p className="text-text2 text-xs font-bold uppercase tracking-[0.2em] mt-4">Historical Compliance Records</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group/search">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text3 group-focus-within/search:text-cyan transition-colors" />
            <input 
              type="text" 
              placeholder="PLATE_SEARCH" 
              className="bg-bg2 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-black text-white placeholder:text-text3/50 focus:outline-none focus:border-cyan/50 focus:bg-bg3/50 transition-all uppercase tracking-widest min-w-[200px]" 
            />
          </div>
          <button className="premium-btn px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download size={14} /> CSV
          </button>
          <button className="premium-btn btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
            <FileText size={14} /> REPORT
          </button>
        </div>
      </div>

      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em]">Identification</th>
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em]">Principal Name</th>
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em]">Violation Class</th>
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em] text-right">Fine Amount</th>
                <th className="px-8 py-5 border-b border-white/5 text-[9px] font-black text-text3 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
                      <span className="text-cyan font-mono text-[9px] font-black uppercase tracking-[0.3em]">Querying Archive Database...</span>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <FileText size={40} className="text-text3" />
                      <span className="text-text3 font-black text-[10px] uppercase tracking-widest">No matching records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record, i) => (
                  <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-white text-[11px] font-bold tracking-tight">{new Date(record.date).toLocaleDateString()}</span>
                        <span className="text-text3 text-[9px] font-mono mt-1 uppercase">{new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                         <span className="text-cyan font-head text-[13px] font-black tracking-[0.1em] uppercase">{record.plateNumber}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-text2 text-[11px] font-black uppercase tracking-tight">{record.ownerName || 'CLASSIFIED'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red/60"></span>
                        <span className="text-white text-[11px] font-bold uppercase tracking-tighter">{record.violation}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-red font-mono text-sm font-black tracking-tight">₹{record.fineAmount}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                         <button className="p-2 rounded-lg bg-bg3 border border-white/5 text-text3 hover:text-cyan transition-colors">
                           <ArrowUpRight size={14} />
                         </button>
                         <button className="p-2 rounded-lg bg-bg3 border border-white/5 text-text3 hover:text-white transition-colors">
                           <MoreHorizontal size={14} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && history.length > 0 && (
          <footer className="p-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
            <div className="text-[10px] text-text3 font-black uppercase tracking-widest leading-none">
              Showing <span className="text-white">{history.length}</span> individual Violation Records
            </div>
            <div className="flex items-center gap-1">
               <button className="px-3 py-1 text-[10px] bg-bg3 border border-white/10 text-white font-black rounded-lg opacity-50 cursor-not-allowed">PREV</button>
               <button className="px-3 py-1 text-[10px] bg-bg3 border border-white/10 text-white font-black rounded-lg">NEXT</button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
