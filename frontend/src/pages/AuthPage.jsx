import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, KeyRound, Loader2, ShieldAlert, Lock, Fingerprint } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your official email address');
    setError(''); setMsg(''); setIsLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { email });
      setMsg(res.data.data?.message || 'OTP sent successfully!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the 6-digit OTP');
    setError(''); setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      const { user, token } = res.data.data;
      login(user, token);
      navigate('/app/lookup'); // Redirecting to Lookup App after login
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-body">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-blue/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-md w-full relative group">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent"></div>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
        
        <div className="bg-bg2/80 backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-cyan/20">
          {/* Internal Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan/10 rounded-full blur-[50px]"></div>

          <header className="text-center mb-10 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-bg3 border border-white/[0.05] rounded-2xl flex items-center justify-center text-cyan shadow-xl relative group-hover:scale-110 transition-transform duration-500">
                <Fingerprint size={40} className="relative z-10" />
                <div className="absolute inset-0 bg-cyan/20 blur-xl rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="logo-text text-3xl mb-1 tracking-tighter">VERIPLATE</div>
            <div className="text-[10px] text-text3 font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              <Lock size={10} className="text-cyan" /> Secure Portal Access
            </div>
          </header>

          <div className="relative z-10 min-h-[300px] flex flex-col justify-center">
            {error && (
              <div className="bg-red/10 border border-red/20 text-red text-xs px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert size={16} />
                <span className="font-bold">{error}</span>
              </div>
            )}
            
            {msg && (
              <div className="bg-green/10 border border-green/20 text-green text-xs px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert size={16} />
                <span className="font-bold">{msg}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-8">
                <div>
                  <label className="block text-[10px] text-text3 uppercase tracking-[0.15em] font-black mb-3 ml-1">Personnel Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text3 group-focus-within:text-cyan transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="field.officer@veriplate.gov"
                      className="w-full bg-bg3 border border-white/[0.05] text-white font-body rounded-2xl py-4 pl-14 pr-5 focus:outline-none focus:border-cyan/50 focus:bg-bg3/80 transition-all placeholder:text-text3 text-sm font-medium"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="premium-btn btn-primary w-full py-4 uppercase text-xs tracking-[0.2em] font-black group shadow-xl"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      Verify Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-text3 text-center font-bold tracking-wide uppercase leading-relaxed px-4">
                  Authorized access only. All sessions are logged and monitored under gov protocols.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <label className="block text-[10px] text-text3 uppercase tracking-[0.15em] font-black mb-3 ml-1">Authentication Token</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text3 group-focus-within:text-cyan transition-colors">
                      <KeyRound size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="0 0 0  0 0 0"
                      maxLength={6}
                      className="w-full bg-bg3 border border-white/[0.05] text-cyan font-head text-2xl text-center rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-cyan/50 focus:bg-bg3/80 transition-all placeholder:text-text3/50 tracking-[0.5em] font-black disabled:opacity-50"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-5 px-1">
                    <span className="text-[11px] text-text3 font-medium">Verify <span className="text-white font-bold">{email}</span></span>
                    <button type="button" onClick={() => setStep(1)} className="text-[11px] text-cyan hover:text-white transition-colors bg-transparent border-none cursor-pointer font-black uppercase tracking-widest flex items-center gap-1.5">
                      <ArrowLeft size={12} /> Change
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="premium-btn btn-primary w-full py-4 uppercase text-xs tracking-[0.2em] font-black group shadow-xl"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      Confirm Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={isLoading}
                    className="text-[10px] text-text3 hover:text-cyan transition-colors bg-transparent border-none cursor-pointer tracking-[0.1em] font-black uppercase"
                  >
                    Resend Token Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Footer info inside the group */}
        <div className="mt-8 text-center text-text3 text-[10px] uppercase font-black tracking-[0.2em] opacity-40 group-hover:opacity-70 transition-opacity">
          Security Level 04: Classified Traffic Data
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
