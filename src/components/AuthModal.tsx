import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Coffee, 
  Key, 
  Check, 
  ArrowRight,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { SYSTEM_CREDENTIALS } from '../data/credentials';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signin') {
        const profile = await loginWithEmail(email, password);
        if (onSuccess) onSuccess(profile.role);
      } else {
        const profile = await registerWithEmail(email, password, displayName || 'Coffee Lover');
        if (onSuccess) onSuccess(profile.role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess('customer');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign in was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to fill credential into input fields for easy testing
  const handleAutofill = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#19130f] border border-[#C68B59]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C68B59]/20 border border-[#C68B59]/40 flex items-center justify-center text-[#C68B59]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Ahnaf Coffee Shop Access
              </h3>
              <p className="text-xs text-stone-400">
                Email & Password required to access your designated interface
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Credentials Reference Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#140e0b] border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C68B59] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              Verified Shop Credentials
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              Click to autofill inputs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            {/* Super Admin credential button */}
            <button
              type="button"
              onClick={() => handleAutofill('ahnaf@ahnafcoffee.com', 'Admin@123456')}
              className="p-2 rounded-xl bg-[#221812] border border-amber-500/30 hover:border-amber-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase">👑 Super Admin</span>
                <span className="text-[10px] text-stone-400 group-hover:text-amber-300">Fill ➔</span>
              </div>
              <p className="font-mono text-[11px] text-stone-200 mt-1 truncate">ahnaf@ahnafcoffee.com</p>
              <p className="font-mono text-[10px] text-amber-300/80">Admin@123456</p>
            </button>

            {/* Staff Barista credential button */}
            <button
              type="button"
              onClick={() => handleAutofill('maya@ahnafcoffee.com', 'Staff@123456')}
              className="p-2 rounded-xl bg-[#221812] border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">☕ Barista Staff</span>
                <span className="text-[10px] text-stone-400 group-hover:text-emerald-300">Fill ➔</span>
              </div>
              <p className="font-mono text-[11px] text-stone-200 mt-1 truncate">maya@ahnafcoffee.com</p>
              <p className="font-mono text-[10px] text-emerald-300/80">Staff@123456</p>
            </button>

            {/* Customer credential button */}
            <button
              type="button"
              onClick={() => handleAutofill('sofia.rahman@gmail.com', 'Customer@123456')}
              className="p-2 rounded-xl bg-[#221812] border border-stone-700 hover:border-[#C68B59] text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C68B59] uppercase">👤 Customer</span>
                <span className="text-[10px] text-stone-400 group-hover:text-[#C68B59]">Fill ➔</span>
              </div>
              <p className="font-mono text-[11px] text-stone-200 mt-1 truncate">sofia.rahman@gmail.com</p>
              <p className="font-mono text-[10px] text-stone-400">Customer@123456</p>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="mt-4 grid grid-cols-2 bg-[#130d0a] p-1 rounded-xl border border-stone-800 text-xs">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`py-2 rounded-lg font-semibold transition-all ${
              tab === 'signin' ? 'bg-[#C68B59] text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Sign In with Email & Password
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`py-2 rounded-lg font-semibold transition-all ${
              tab === 'signup' ? 'bg-[#C68B59] text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleEmailAuth} className="mt-5 space-y-4">
          
          {tab === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Arif Mahmud"
                  className="w-full bg-[#241a14] border border-stone-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-stone-400 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahnaf@ahnafcoffee.com"
                className="w-full bg-[#241a14] border border-stone-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-stone-400">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#241a14] border border-stone-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 text-rose-300 text-xs border border-rose-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white text-xs font-bold shadow-lg shadow-[#C68B59]/25 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In to Designated Interface' : 'Register & Enter Shop'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-800">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 border border-stone-700/80 hover:bg-stone-800 text-xs font-semibold text-stone-200 flex items-center justify-center gap-2.5 transition-all shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Or Sign In with Google</span>
          </button>
        </div>

      </div>
    </div>
  );
};
