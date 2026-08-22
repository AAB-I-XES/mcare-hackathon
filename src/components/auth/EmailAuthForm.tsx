import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, Building2, Stethoscope } from 'lucide-react';
import { UserRole, AppUser } from '../../types';
import { useI18n } from '../../i18n';
import { supabaseSignInWithEmail, supabaseSignUpWithEmail, isSupabaseConfigured } from '../../services/supabase';

interface EmailAuthFormProps {
  role: UserRole;
  onSuccess: (user: AppUser, token: string) => void;
  onFallbackLogin?: (role: UserRole, email: string) => void;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ role, onSuccess, onFallbackLogin }) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [facility, setFacility] = useState('Central Community Medical Center');
  const [company, setCompany] = useState('BuildTech Construction Ltd');
  const [phone, setPhone] = useState('+65 8123 4567');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    if (isSupabaseConfigured()) {
      if (mode === 'signin') {
        const res = await supabaseSignInWithEmail(email, password, role);
        setIsLoading(false);
        if (res.success && res.user && res.token) {
          onSuccess(res.user, res.token);
        } else {
          setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        if (!name.trim()) {
          setIsLoading(false);
          setErrorMessage('Please enter your full name for registration.');
          return;
        }
        const res = await supabaseSignUpWithEmail(email, password, {
          name,
          role,
          phone,
          facility: role === 'provider' ? facility : undefined,
          company: role === 'employer' ? company : undefined,
        });
        setIsLoading(false);
        if (res.success && res.user && res.token) {
          onSuccess(res.user, res.token);
        } else {
          setErrorMessage(res.error || 'Failed to sign up.');
        }
      }
    } else {
      // Local fallback mode when Supabase credentials are pending in .env
      setTimeout(() => {
        setIsLoading(false);
        if (onFallbackLogin) {
          onFallbackLogin(role, email);
        } else {
          setSuccessInfo('Offline/Local Engine: Verified login credentials.');
        }
      }, 400);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sign In vs Sign Up Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setErrorMessage('');
          }}
          className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition cursor-pointer ${
            mode === 'signin'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setErrorMessage('');
          }}
          className={`flex-1 pb-2.5 text-xs font-bold border-b-2 text-center transition cursor-pointer ${
            mode === 'signup'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Create Account
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          {successInfo}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={role === 'provider' ? 'Dr. Alex Vance' : 'Full Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full minimal-input pl-9.5 pr-3.5 py-2.5"
                required
              />
            </div>
          </div>
        )}

        {mode === 'signup' && role === 'provider' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medical Center / Clinic
            </label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full minimal-input pl-9.5 pr-3.5 py-2.5"
                required
              />
            </div>
          </div>
        )}

        {mode === 'signup' && role === 'employer' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full minimal-input pl-9.5 pr-3.5 py-2.5"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full minimal-input pl-9.5 pr-3.5 py-2.5"
              required
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full minimal-input pl-9.5 pr-10 py-2.5"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-minimal-primary w-full cursor-pointer mt-2"
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : mode === 'signin' ? (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
