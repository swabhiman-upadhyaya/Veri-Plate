import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Zap, ArrowRight, Activity, Globe, Lock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-cyan/30 selection:text-white overflow-x-hidden font-body">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-screen pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue/10 rounded-full blur-[120px] animate-pulse-slow font-head" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/[0.05] bg-bg/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <ShieldCheck size={24} className="text-bg" />
          </div>
          <div>
            <div className="logo-text">VERIPLATE</div>
            <div className="logo-sub">INTEL CORE v2.4</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
           <a href="#features" className="text-xs font-bold text-text2 hover:text-white transition-colors uppercase tracking-widest">Features</a>
           <a href="#compliance" className="text-xs font-bold text-text2 hover:text-white transition-colors uppercase tracking-widest">Compliance</a>
           <a href="#security" className="text-xs font-bold text-text2 hover:text-white transition-colors uppercase tracking-widest">Security</a>
        </nav>
        <Link to="/auth" className="bg-white text-bg font-head font-black text-[11px] tracking-[0.1em] px-6 py-2.5 rounded-full hover:bg-cyan transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] uppercase">
          Officer Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 relative">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-bold tracking-[0.2em] uppercase mb-8 animate-bounce">
            <Activity size={12} /> Live Processing Enabled
          </div>
          <h1 className="text-5xl md:text-8xl font-head font-black mb-8 leading-[0.9] tracking-tighter text-white">
            NEXT-GEN <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue to-cyan animate-glow-text bg-[length:200%_auto]">TRAFFIC INTEL</span>
          </h1>
          <p className="text-text2 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Real-time automatic license plate recognition, dynamic compliance checking, and instant violation alerts wrapped in a secure, enterprise-grade architecture.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
             <Link to="/auth" className="bg-cyan text-bg font-head font-black tracking-widest py-4 px-10 rounded-2xl hover:bg-white transition-all group shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 text-xs">
               ENTER SYSTEM <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <button className="bg-bg2 border border-white/[0.05] text-white font-head font-black tracking-widest py-4 px-10 rounded-2xl hover:bg-bg3 transition-all flex items-center justify-center gap-3 text-xs">
               WATCH DEMO <Zap size={16} className="text-cyan fill-cyan" />
             </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          <div className="glass-card p-10 hover:border-cyan/30 transition-all group">
            <div className="w-14 h-14 bg-cyan-dim rounded-2xl flex items-center justify-center text-cyan mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Zap size={28} />
            </div>
            <h3 className="font-head text-2xl font-bold mb-4 text-white tracking-tight">Real-Time Lookup</h3>
            <p className="text-text2 text-sm leading-relaxed font-medium">
              Scan images instantly with integrated OCR layers. Verify license details, insurance, and PUC validity dynamically in milliseconds.
            </p>
          </div>
          
          <div className="glass-card p-10 hover:border-green/30 transition-all group">
            <div className="w-14 h-14 bg-green-dim rounded-2xl flex items-center justify-center text-green mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-head text-2xl font-bold mb-4 text-white tracking-tight">Compliance Engine</h3>
            <p className="text-text2 text-sm leading-relaxed font-medium">
              Auto-compute expiry states. Highlight violations before they happen with auto-generated alerts for expiring documents on the fly.
            </p>
          </div>

          <div className="glass-card p-10 hover:border-blue/30 transition-all group sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-blue-dim rounded-2xl flex items-center justify-center text-blue mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <Search size={28} />
            </div>
            <h3 className="font-head text-2xl font-bold mb-4 text-white tracking-tight">Data Forensics</h3>
            <p className="text-text2 text-sm leading-relaxed font-medium">
              Comprehensive history tracking and activity logging. Connects massive MongoDB registries securely to the field officers' interface.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-12 glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe size={120} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center relative z-10">
             <div className="hover:-translate-y-1 transition-transform">
               <div className="font-head text-5xl font-black text-white mb-2 tracking-tighter">3.5k+</div>
               <div className="text-text3 text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span> Scans Today
               </div>
             </div>
             <div className="hover:-translate-y-1 transition-transform border-y sm:border-y-0 sm:border-x border-white/[0.05] py-8 sm:py-0">
               <div className="font-head text-5xl font-black text-green mb-2 tracking-tighter">88.4%</div>
               <div className="text-text3 text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span> Compliance
               </div>
             </div>
             <div className="hover:-translate-y-1 transition-transform">
               <div className="font-head text-5xl font-black text-red mb-2 tracking-tighter">418</div>
               <div className="text-text3 text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span> Flagged
               </div>
             </div>
          </div>
        </div>

        {/* Security Trust Section */}
        <div id="security" className="mt-32 text-center py-20 border-t border-white/[0.05]">
          <div className="flex justify-center mb-8">
            <Lock className="text-text3" size={32} />
          </div>
          <h2 className="font-head text-3xl font-bold text-white mb-6 tracking-tight uppercase">Bank-Grade Encryption</h2>
          <p className="text-text2 max-w-xl mx-auto font-medium mb-12">
            Your data is secured using SHA-256 encryption. We comply with all regional data protection regulations to ensure field officer safety and citizen privacy.
          </p>
          <div className="flex flex-wrap justify-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="font-head text-xl font-black tracking-tighter">MORTON TECH</div>
             <div className="font-head text-xl font-black tracking-tighter">SECURE.IO</div>
             <div className="font-head text-xl font-black tracking-tighter">GOV_SHIELD</div>
             <div className="font-head text-xl font-black tracking-tighter">DATA_BASE</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12 px-12 bg-bg2/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <ShieldCheck size={20} className="text-cyan" />
             <span className="font-head font-black tracking-tighter text-white">VERIPLATE</span>
          </div>
          <div className="text-text3 text-[10px] font-bold tracking-[0.1em] uppercase">
            © 2026 VeriPlate Intelligence Systems. All rights reserved.
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-text3 hover:text-cyan transition-colors text-[10px] font-bold uppercase tracking-widest">Privacy</a>
             <a href="#" className="text-text3 hover:text-cyan transition-colors text-[10px] font-bold uppercase tracking-widest">Terms</a>
             <a href="#" className="text-text3 hover:text-cyan transition-colors text-[10px] font-bold uppercase tracking-widest">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
