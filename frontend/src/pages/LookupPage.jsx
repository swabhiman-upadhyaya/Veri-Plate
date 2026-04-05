import React, { useState } from 'react';
import { Search, Upload, Camera, AlertTriangle, ShieldCheck, CheckCircle2, Zap, ArrowRight, Info, History, Activity, Loader2, Lock } from 'lucide-react';
import api from '../services/api';

const BACKEND_URL = 'http://localhost:5000';
const LIVE_API_URL = `${BACKEND_URL}/api/live`;

const LookupPage = () => {
  const [plateInput, setPlateInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 1. Normal Plate Lookup
  const handleSearch = async () => {
    if (!plateInput) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/lookup', { plateNumber: plateInput });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch vehicle details');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Image Upload -> ML Detection -> Auto-fill plate -> Run lookup
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    // Step 1: Upload to ML engine
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch(`${LIVE_API_URL}/upload`, { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { id } = await uploadRes.json();

      // Step 2: Poll until detection completes
      const poll = setInterval(async () => {
        try {
          const histRes = await fetch(`${LIVE_API_URL}/history`);
          const histData = await histRes.json();
          const record = histData.find(r => r.id === id);

          if (record && record.status === 'completed') {
            clearInterval(poll);
            const detectedPlate = record.plate;
            if (!detectedPlate || detectedPlate === 'UNKNOWN') {
              setError('Could not detect a plate in the image. Try a clearer photo.');
              setIsLoading(false);
              return;
            }
            // Step 3: Auto-fill detected plate and run lookup
            setPlateInput(detectedPlate);
            try {
              const lookupRes = await api.post('/lookup', { plateNumber: detectedPlate });
              setResult(lookupRes.data.data);
            } catch (err) {
              setError(err.response?.data?.error || 'Lookup failed after detection');
            }
            setIsLoading(false);
          } else if (record && record.status === 'failed') {
            clearInterval(poll);
            setError(record.error_msg || 'ML processing failed. Try a clearer image.');
            setIsLoading(false);
          }
        } catch(e) { clearInterval(poll); setIsLoading(false); }
      }, 2000);
    } catch (err) {
      setError('Failed to connect to ML engine.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Search Section */}
      <section className="panel-card p-6 md:p-10 relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Search size={120} />
        </div>

        <div className="max-w-3xl">
          <h2 className="font-head text-2xl font-black text-white mb-2 tracking-tight">VEHICLE INTELLIGENCE</h2>
          <p className="text-text2 text-sm mb-8 font-medium">Verify registration, insurance, and compliance records in real-time.</p>
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1 relative group/input">
              <input 
                type="text"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                placeholder="MH 12 AB 3456"
                maxLength={12}
                className="w-full bg-bg3 border border-white/[0.05] rounded-2xl px-6 py-4 text-white font-mono text-xl md:text-2xl font-black tracking-[0.2em] uppercase focus:outline-none focus:border-cyan/50 focus:bg-bg3/80 transition-all placeholder:text-text3/50 shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500"></div>
            </div>
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="premium-btn btn-primary px-10 py-4 text-xs tracking-[0.2em] uppercase font-black whitespace-nowrap"
            >
              {isLoading && !plateInput ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Execute Query <Zap size={16} /></>
              )}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-3 bg-white/[0.03] border border-dashed border-white/20 rounded-xl px-5 py-3 text-text2 text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-cyan-dim hover:border-cyan/50 hover:text-cyan transition-all group">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isLoading} />
              <Upload size={14} className="group-hover:scale-110 transition-transform" />
              Scan & Verify Identification
            </label>
            <button className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-text3 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all cursor-not-allowed">
              <Camera size={14} />
              Live Cam Feed
            </button>
          </div>
        </div>
      </section>

      {/* Loading & Error States */}
      {isLoading && (
         <div className="panel-card p-20 flex flex-col items-center justify-center space-y-6 relative overflow-hidden ring-1 ring-cyan/20">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent animate-pulse"></div>
            <div className="relative">
              <div className="w-24 h-24 border-2 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-cyan rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search size={32} className="text-cyan animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-cyan font-mono text-[10px] tracking-[0.4em] font-black uppercase">Scanning Plate via ML Engine</div>
              <div className="text-text3 text-[9px] font-bold tracking-[0.2em] uppercase animate-pulse">Detecting → OCR → Looking up Registry...</div>
            </div>
         </div>
      )}

      {error && (
        <div className="bg-red/10 border border-red/20 rounded-2xl p-6 flex items-start gap-5 animate-in slide-in-from-top-4">
          <div className="w-12 h-12 bg-red/20 rounded-xl flex items-center justify-center text-red shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1">System Exception</h4>
            <p className="text-text2 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && !isLoading && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="panel-card overflow-hidden border-white/[0.05]">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 md:p-8 bg-white/[0.02] border-b border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Premium Indian Plate Design */}
                <div className="relative group">
                  <div className="bg-white text-black font-head text-2xl font-black py-3 px-8 rounded-lg tracking-[0.15em] border-2 border-zinc-300 shadow-[2px_2px_0px_#71717a] relative">
                    <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#003580] rounded-l-lg flex flex-col items-center justify-center py-1">
                      <div className="text-white text-[8px] font-bold tracking-tighter leading-none mb-0.5">IND</div>
                      <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-1/3 bg-[#FF9933]"></div>
                        <div className="w-full h-1/3 bg-white"></div>
                        <div className="w-full h-1/3 bg-[#138808]"></div>
                      </div>
                    </div>
                    <div className="ml-4">{result.vehicle.plateNumber}</div>
                  </div>
                  <div className="absolute -inset-2 bg-cyan/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div>
                  <div className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                    {result.vehicle.vehicle?.make} {result.vehicle.vehicle?.model}
                    <span className="text-[10px] bg-bg3 text-text2 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest leading-none font-black">{result.vehicle.vehicle?.type}</span>
                  </div>
                  <div className="text-text2 text-sm font-bold tracking-wide uppercase mt-1">
                    {result.vehicle.vehicle?.color} • {result.vehicle.vehicle?.year} • {result.vehicle.fuelType || 'Petrol'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-green/10 border border-green/20 px-5 py-3 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <ShieldCheck size={20} className="text-green" />
                <div className="leading-none">
                  <div className="text-green text-[10px] font-black uppercase tracking-[0.2em]">Validated</div>
                  <div className="text-white text-[11px] font-bold mt-1">Registry Match Confirmed</div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 lg:divide-x divide-white/[0.05]">
              {/* Owner Info */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-text3 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Info size={12} className="text-cyan" /> Principal Ownership
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <div className="text-text2 text-[9px] uppercase font-black tracking-widest mb-1.5 opacity-60">Registered Name</div>
                    <div className="text-white font-bold text-lg tracking-tight group-hover:text-cyan transition-colors">{result.vehicle.owner?.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-text2 text-[9px] uppercase font-black tracking-widest mb-1.5 opacity-60">License ID</div>
                      <div className="text-white font-mono text-sm group-hover:text-cyan transition-colors">{result.vehicle.owner?.licenseNumber}</div>
                    </div>
                    <div>
                      <div className="text-text2 text-[9px] uppercase font-black tracking-widest mb-1.5 opacity-60">State RTO</div>
                      <div className="text-white font-bold text-sm">{result.vehicle.stateCode}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Grid */}
              <div className="p-6 md:p-8 bg-white/[0.01]">
                <div className="flex items-center gap-2 text-text3 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                  <Activity size={12} className="text-cyan" /> Compliance Matrix
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Driving License', status: result.statuses.licenseStatus, date: result.vehicle.owner?.licenseValidity },
                    { label: 'Vehicle Insurance', status: result.statuses.insuranceStatus, date: '2026-11-20', sub: result.vehicle.insurance?.provider },
                    { label: 'Pollution (PUC)', status: result.statuses.pollutionStatus, date: result.vehicle.pollution?.dueDate }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-colors">
                      <div>
                        <div className="text-white text-xs font-bold">{item.label}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-text3 font-mono">{item.date ? new Date(item.date).toLocaleDateString() : 'Verifying...'}</span>
                          {item.sub && <span className="text-[9px] bg-bg3 text-text2 px-1 rounded uppercase font-black tracking-tighter opacity-60">{item.sub}</span>}
                        </div>
                      </div>
                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-[0.1em] ${
                        item.status === 'valid' ? 'bg-green/10 text-green border-green/20' :
                        item.status === 'expired' ? 'bg-red/10 text-red border-red/20 animate-pulse' :
                        'bg-amber/10 text-amber border-amber/20'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Section */}
              <div className="p-6 md:p-8 lg:bg-transparent bg-white/[0.01]">
                <div className="flex items-center justify-between gap-2 text-text3 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                  <div className="flex items-center gap-2"><History size={12} className="text-cyan" /> Violation History</div>
                  <span className="bg-bg3 border border-white/10 px-2.5 py-0.5 rounded-full text-[9px] text-cyan font-black">{result.vehicle.history?.length || 0} TOTAL</span>
                </div>
                
                {result.vehicle.history?.length > 0 ? (
                  <div className="space-y-5 max-h-[220px] overflow-y-auto pr-3 custom-scrollbar">
                    {result.vehicle.history.map((h, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="absolute top-0 left-1.5 bottom-0 w-px bg-white/5 md:hidden sm:block"></div>
                        <div className="w-3 h-3 rounded-full bg-red shadow-[0_0_10px_rgba(239,68,68,0.4)] shrink-0 mt-1 relative z-10 border-4 border-bg2"></div>
                        <div className="flex-1 pb-4">
                          <div className="text-[13px] font-black text-white leading-tight uppercase tracking-tight mb-1">{h.violation}</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-text3 font-bold uppercase">{new Date(h.date).toLocaleDateString()}</span>
                             <span className="text-[10px] text-red font-black uppercase">Fine: ₹{h.fineAmount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center h-[200px] border border-dashed border-white/5 rounded-3xl group">
                    <div className="w-16 h-16 bg-green-dim rounded-full flex items-center justify-center text-green mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="text-xs text-white font-black uppercase tracking-[0.1em]">Clean Record</div>
                    <div className="text-[10px] text-text3 mt-2 font-medium max-w-[150px] leading-relaxed">No registered violations detected for this vehicle ID.</div>
                  </div>
                )}
              </div>
            </div>

            <footer className="bg-bg3/30 p-4 px-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-[10px] text-text3 font-bold uppercase tracking-widest flex items-center gap-2">
                <Lock size={10} /> Data Integrity Level: SHA-256 SECURED
              </div>
              <button className="text-[10px] text-cyan hover:text-white transition-colors font-black uppercase tracking-widest flex items-center gap-2">
                Generate Official Export <ArrowRight size={12} />
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card group ring-1 ring-cyan/10">
            <div className="stat-label flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></div> Scans Processed Today</div>
            <div className="stat-num text-white">3,492</div>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-[10px] text-green font-bold uppercase">↑ 12.4% Momentum</span>
               <Activity size={12} className="text-cyan opacity-40" />
            </div>
          </div>
          <div className="stat-card group ring-1 ring-green/10">
            <div className="stat-label flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></div> Compliance Score</div>
            <div className="stat-num text-green">88.4%</div>
            <div className="mt-auto pt-4 border-t border-white/5">
               <div className="prog-bar"><div className="prog-fill bg-green" style={{ width: '88.4%' }}></div></div>
            </div>
          </div>
          <div className="stat-card group ring-1 ring-red/10">
            <div className="stat-label flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></div> Active Violations</div>
            <div className="stat-num text-red">418</div>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between font-black">
               <span className="text-[10px] text-red uppercase tracking-tighter animate-pulse">Action Required</span>
               <AlertTriangle size={12} className="text-red" />
            </div>
          </div>
          <div className="stat-card group ring-1 ring-amber/10">
            <div className="stat-label flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></div> Critical Expiry</div>
            <div className="stat-num text-amber">173</div>
            <div className="mt-auto pt-4 border-t border-white/5 text-[9px] text-text3 font-bold uppercase leading-tight">
               Automated SMS alerts dispatched to owners
            </div>
          </div>
      </div>

    </div>
  );
};

export default LookupPage;
