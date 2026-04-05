import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShieldX } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

const MediaViewPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const outputUrl = params.get('url');     // e.g. "outputs/12345.jpg"
  const plate     = params.get('plate');   // e.g. "MH20EE7602"
  const isValid   = params.get('valid') === 'true';
  const type      = params.get('type');    // "image" or "video"

  const mediaUrl = outputUrl ? `${BACKEND_URL}/${outputUrl}` : null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text2 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Plate Badge */}
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border font-mono font-black text-xl tracking-widest uppercase shadow-lg
          ${isValid
            ? 'bg-green/10 border-green/50 text-green shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : 'bg-red/10 border-red/50 text-red shadow-[0_0_20px_rgba(239,68,68,0.2)]'
          }`}
        >
          {isValid
            ? <ShieldCheck size={20} />
            : <ShieldX size={20} />
          }
          {plate || 'UNKNOWN'}
        </div>

        <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border
          ${isValid ? 'bg-green/10 border-green/30 text-green' : 'bg-red/10 border-red/30 text-red'}`}>
          {isValid ? '✓ Valid Plate' : '✗ Invalid Format'}
        </div>
      </header>

      {/* Full Screen Media */}
      <main className="flex-1 flex items-center justify-center p-4 bg-[#080808]">
        {mediaUrl ? (
          type === 'video' ? (
            <video
              src={mediaUrl}
              className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
              autoPlay
              loop
              controls
              style={{ border: `3px solid ${isValid ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={`ALPR Output - ${plate}`}
              className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 object-contain"
              style={{ border: `3px solid ${isValid ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` }}
            />
          )
        ) : (
          <div className="text-text3 text-sm font-mono">No media available.</div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-white/5 text-center text-[10px] text-text3 font-mono tracking-widest uppercase">
        VeriPlate ALPR Engine · Processed Output · {isValid ? 'Registry Format Confirmed' : 'Format Unrecognised'}
      </footer>
    </div>
  );
};

export default MediaViewPage;
