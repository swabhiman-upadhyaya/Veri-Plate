import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileVideo, Image as ImageIcon, AlertCircle, Loader2, CheckCircle, Maximize2, Radio, Link as LinkIcon } from 'lucide-react';

const LiveCamerasPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [historyInterval, setHistoryInterval] = useState(null);

  const fileInputRef = useRef(null);

  const BACKEND_URL = 'http://localhost:5000';
  const ALPR_API_URL = `${BACKEND_URL}/api/live`;

  // Handle polling for specific record
  const pollResult = (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${ALPR_API_URL}/history`);
        const data = await response.json();
        const record = data.find((item) => item.id === id);
        
        if (record && record.status === 'completed') {
          setResult(record);
          setIsProcessing(false);
          clearInterval(interval);
        } else if (record && record.status === 'failed') {
          setError(record.error_msg || 'Processing failed. Please try a different media file.');
          setIsProcessing(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling history:", err);
      }
    }, 2000); // Check every 2 seconds
    
    setHistoryInterval(interval);
  };

  useEffect(() => {
    return () => clearInterval(historyInterval);
  }, [historyInterval]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setError('');
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  // Auto-scan feature to immediately process when file is dropped
  useEffect(() => {
    if (file && !isProcessing && !result && !error) {
      handleUpload();
    }
  }, [file]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setError('');
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${ALPR_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      pollResult(data.id);
      
    } catch (err) {
      console.error(err);
      setError('Failed to reach Node Backend ALPR hook.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-head text-2xl font-black text-white tracking-tight flex items-center gap-3 underline decoration-cyan/30 decoration-4 underline-offset-8">
            <Radio size={24} className="text-cyan animate-pulse" /> ALPR ENGINE
          </h2>
          <p className="text-text2 text-xs font-bold uppercase tracking-[0.2em] mt-4">Automated Media Analysis Hub</p>
        </div>
        <div className="flex items-center gap-4 bg-bg2 border border-white/5 rounded-2xl px-5 py-3 shadow-xl">
           <div className="flex items-center gap-2 pr-4 justify-center">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber animate-pulse' : 'bg-green animate-pulse'}`}></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{isProcessing ? 'Neural Scan Active' : 'System Ready'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="panel-card lg:col-span-1 border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_0%,transparent_100%)]"></div>
            
            <input 
              type="file" 
              accept="video/mp4,video/avi,video/quicktime,video/x-matroska,image/jpeg,image/png,image/webp" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />

            <div 
              className={`w-full aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative z-10 
              ${dragActive ? 'border-cyan bg-cyan/5 scale-105' : 'border-white/10 hover:border-cyan/30 hover:bg-white/[0.01]'}
              ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  {file.type.startsWith('video') ? <FileVideo size={48} className="text-cyan" /> : <ImageIcon size={48} className="text-cyan" />}
                  <div>
                    <p className="text-white font-bold text-sm tracking-tight truncate max-w-[200px]">{file.name}</p>
                    <p className="text-text3 text-xs uppercase mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  {!isProcessing && (
                     <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase text-text2 hover:text-white transition-colors">
                       Change File
                     </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan/20 to-blue/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <UploadCloud size={28} className="text-cyan" />
                  </div>
                  <h3 className="text-white font-black text-sm uppercase tracking-[0.15em] mb-2">Upload Target Media</h3>
                  <p className="text-text3 text-[11px] font-medium leading-relaxed max-w-[80%] mx-auto">
                    Drag and drop your video or image feed here, or click to browse files.
                  </p>
                  <p className="text-text3/50 text-[9px] font-bold mt-6 uppercase tracking-widest">
                    Supports MP4, AVI, JPG, PNG
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-6 w-full flex items-center gap-2 p-3 rounded-lg bg-red/10 border border-red/20 text-red text-xs font-bold font-mono text-left leading-relaxed">
                <AlertCircle size={14} className="shrink-0" /> 
                <span>{error}</span>
              </div>
            )}

            {file && file.size > 50 * 1024 * 1024 && !error && (
              <div className="mt-4 w-full flex items-center gap-2 p-3 rounded-lg bg-amber/10 border border-amber/20 text-amber text-[10px] font-bold font-mono text-left leading-relaxed animate-pulse">
                <AlertCircle size={14} className="shrink-0" /> 
                <span>Warning: 50MB+ File. CPU Neural processing will take several minutes.</span>
              </div>
            )}

            <button 
              className={`mt-6 w-full premium-btn btn-primary py-3.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 ${
                (!file || isProcessing) && 'opacity-50 pointer-events-none'
              }`}
              onClick={handleUpload}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={16} /> Processing...</>
              ) : (
                <><Radio size={16} /> Initiate Scan</>
              )}
            </button>
        </div>

        {/* Output Panel */}
        <div className="panel-card lg:col-span-2 border-white/5 relative overflow-hidden flex flex-col bg-black/60 rounded-3xl">
          {/* Top Bar for Output */}
           <div className="px-6 py-4 bg-bg2/50 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.05] z-10 backdrop-blur-md gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black text-text2 uppercase tracking-[0.2em]">Node / Processing Output</span>
                {result && <span className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mt-1"><CheckCircle size={14} className="text-green"/> Scan Complete</span>}
              </div>
               <div className="flex items-center gap-3">
                 <button
                   onClick={() => result && navigate(`/media-view?url=${encodeURIComponent(result.output_url)}&plate=${result.plate}&valid=${result.is_valid}&type=${result.type}`)}
                   className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text3 hover:text-cyan hover:bg-cyan/10 transition-colors" title="Open in Fullscreen View">
                   <LinkIcon size={14} />
                 </button>
                 <button
                   onClick={() => result && window.open(`${BACKEND_URL}/${result.output_url}`, '_blank')}
                   className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text3 hover:text-cyan hover:bg-cyan/10 transition-colors" title="Open Raw Output">
                   <Maximize2 size={14} />
                 </button>
               </div>
           </div>

           <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-[400px]">
              
              {!file && !result && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                  <Radio size={48} className="text-cyan/20 animate-pulse-slow mb-4" />
                  <div className="text-[10px] font-mono text-cyan/60 font-black tracking-[0.4em] uppercase">Awaiting Visual Input</div>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                </div>
              )}

              {/* Processing State visually overlaying the input file */}
              {isProcessing && file && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                   <div className="w-24 h-24 relative mb-6">
                     <div className="absolute inset-0 border-t-2 border-r-2 border-cyan rounded-full animate-spin"></div>
                     <div className="absolute inset-4 border-b-2 border-l-2 border-amber rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                     <Radio size={24} className="absolute inset-0 m-auto text-cyan animate-pulse" />
                   </div>
                   <div className="text-cyan font-mono text-sm tracking-[0.3em] font-black uppercase">Executing Neural Scan</div>
                   <div className="text-text3 font-mono text-[9px] tracking-widest mt-2 bg-black/50 px-3 py-1 rounded-full">Correlating frames with YOLOv8 Engine...</div>
                </div>
              )}

              {/* If we have a result, show it */}
              {result && result.output_url ? (
                <div className="w-full h-full relative p-2 bg-black">
                  {result.type === 'video' ? (
                     <video 
                       src={`${BACKEND_URL}/${result.output_url}`}
                       className="w-full h-full object-contain rounded-xl overflow-hidden shadow-2xl"
                       autoPlay
                       loop
                       controls
                       muted
                     />
                  ) : (
                     <img 
                       src={`${BACKEND_URL}/${result.output_url}`}
                       alt="Processed Output"
                       className="w-full h-full object-contain rounded-xl overflow-hidden shadow-2xl"
                     />
                  )}
                  
                  {/* Plate Metadata Overlay */}
                  <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 ${result.is_valid ? 'border-green/50' : 'border-red/50'}`}>
                     <div className="flex flex-col items-center pl-2 relative">
                        {result.is_valid ? (
                           <div className="absolute -top-3 -right-3 bg-green text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-[0_0_10px_rgba(16,185,129,0.5)]"><CheckCircle size={10} className="mr-1"/> Valid</div>
                        ) : (
                           <div className="absolute -top-3 -right-3 bg-red text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-[0_0_10px_rgba(239,68,68,0.5)]"><AlertCircle size={10} className="mr-1"/> Invalid Format</div>
                        )}
                        <span className={`text-[10px] uppercase font-black tracking-[0.2em] mb-1.5 ${result.is_valid ? 'text-green' : 'text-red'}`}>Detected Plate</span>
                        <div className="bg-white/5 px-6 py-2 rounded-xl border border-white/10 shadow-inner">
                        <span className={`font-head text-3xl font-black tracking-widest uppercase drop-shadow-md ${result.is_valid ? 'text-green' : 'text-red'}`}>{result.plate}</span>
                        </div>
                     </div>
                     <div className="hidden sm:block h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                     <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 px-2 min-w-[240px]">
                        <div className="text-[10px] font-mono text-text3 flex justify-between items-center bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.02]">
                          <span>VEHICLE:</span><span className="text-white font-bold ml-4 truncate uppercase">{result.details?.vehicle?.make} {result.details?.vehicle?.model}</span>
                        </div>
                        <div className="text-[10px] font-mono text-text3 flex justify-between items-center bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.02]">
                          <span>RTO ZONE:</span><span className="text-amber font-bold ml-4 uppercase">{result.details?.stateCode || 'Unknown'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-text3 flex justify-between items-center bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.02]">
                          <span>OWNER INFO:</span><span className="text-cyan font-bold ml-4 uppercase">{result.details?.owner?.name || 'Pending'}</span>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                 /* Preview of uploaded local file before/during processing */
                 file && (
                   <div className="w-full h-full p-2 bg-black">
                     {file.type.startsWith('video') ? (
                       <video src={URL.createObjectURL(file)} className="w-full h-full object-contain rounded-xl shadow-2xl" autoPlay loop controls muted />
                     ) : (
                       <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-2xl" />
                     )}
                   </div>
                 )
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCamerasPage;
