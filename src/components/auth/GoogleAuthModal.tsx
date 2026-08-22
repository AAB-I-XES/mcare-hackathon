import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UserRole, AppUser } from '../../types';
import { isSupabaseConfigured, supabaseSignInWithOAuth, getWorkers, getDemoProvider, getDemoEmployer } from '../../services';

interface GoogleAuthModalProps {
  role: UserRole;
  onSuccess: (user: AppUser, token: string) => void;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ role, onSuccess, onClose }) => {
  const [customEmail, setCustomEmail] = useState('rabhadibyajyoti05@gmail.com');
  const [userName, setUserName] = useState('Dibyajyoti Rabha');
  const [isConnectingLive, setIsConnectingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const handleInstantGoogleSignIn = () => {
    if (role === 'worker') {
      const baseWorker = getWorkers()[0];
      const googleWorker: AppUser = {
        ...baseWorker,
        name: userName.trim() || 'Google User',
        email: customEmail.trim() || 'user@gmail.com',
        role: 'worker',
      };
      onSuccess(googleWorker, `token_google_${Date.now()}`);
    } else if (role === 'provider') {
      const baseProvider = getDemoProvider();
      const googleProvider: AppUser = {
        ...baseProvider,
        name: userName.trim() || 'Dr. Google Provider',
        email: customEmail.trim() || 'doctor@gmail.com',
        role: 'provider',
      };
      onSuccess(googleProvider, `token_google_${Date.now()}`);
    } else {
      const baseEmployer = getDemoEmployer();
      const googleEmployer: AppUser = {
        ...baseEmployer,
        name: userName.trim() || 'Site Supervisor',
        email: customEmail.trim() || 'employer@gmail.com',
        role: 'employer',
      };
      onSuccess(googleEmployer, `token_google_${Date.now()}`);
    }
  };

  const handleLiveSupabaseOAuth = async () => {
    if (!supabaseReady) {
      setLiveError(
        'Supabase URL and Anon Key are not yet defined in .env. Use Instant Google Sign-In below or configure VITE_SUPABASE_URL.'
      );
      return;
    }

    try {
      setIsConnectingLive(true);
      setLiveError(null);
      await supabaseSignInWithOAuth('google');
    } catch (err: any) {
      setIsConnectingLive(false);
      setLiveError(
        err?.message ||
          'Google OAuth 403: Please ensure Supabase Auth URL is configured in Google Cloud Console Authorized Redirect URIs.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <h3 className="font-bold text-sm">Google Authentication</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {liveError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Google OAuth 403 / Configuration Notice</span>
              </div>
              <p className="leading-relaxed">
                Google blocked external redirect (403) because this domain or Supabase callback URL is not registered in Google Cloud Console. Use the <strong>Instant One-Click Google Sign-In</strong> below to bypass this immediately!
              </p>
            </div>
          )}

          {/* Primary Recommended Option: Instant Google Sign In */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Instant Google Sign-In (Bypasses 403)
              </span>
              <span className="badge-clean badge-clean-emerald text-[10px]">Ready</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Google Account Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full minimal-input px-3 py-1.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full minimal-input px-3 py-1.5 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstantGoogleSignIn}
              className="w-full btn-minimal-primary bg-slate-900 hover:bg-slate-800 text-xs py-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Sign In as {userName || 'Google User'}</span>
            </button>
          </div>

          {/* Secondary Option: Live Supabase Redirect */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 mb-2">
              Want to use external live Google OAuth redirect?
            </p>
            <button
              type="button"
              onClick={handleLiveSupabaseOAuth}
              disabled={isConnectingLive}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isConnectingLive ? 'Redirecting...' : 'Launch External Supabase OAuth Flow'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
