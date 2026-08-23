import React, { useState } from 'react';
import { Smartphone, Mail, AlertCircle, Settings, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppUser, UserRole } from '../../types';
import {
  getWorkers,
  getWorkerByHealthId,
  getDemoProvider,
  getDemoEmployer,
  isSupabaseConfigured,
  signInWithGoogleOAuth,
} from '../../services';
import { Header, Footer, Badge } from '../common';
import { RoleSelector } from './RoleSelector';
import { PhoneLoginForm } from './PhoneLoginForm';
import { EmailAuthForm } from './EmailAuthForm';
import { PendingSetupUser } from '../../hooks/useAuth';

interface AuthViewProps {
  onLogin: (user: AppUser, token: string) => void;
  onShowRegister: () => void;
  onStartGoogleSetup?: (pending: PendingSetupUser) => void;
  registrationPhone: string;
  setRegistrationPhone: (phone: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onShowRegister,
  onStartGoogleSetup,
  registrationPhone,
  setRegistrationPhone,
}) => {
  const { t } = useI18n();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState(registrationPhone || '');
  const [clinicRegNo, setClinicRegNo] = useState('MCR-2018-9482');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleDemoWorkerLogin = (healthId: string) => {
    const worker = getWorkerByHealthId(healthId);
    if (worker) {
      onLogin({ ...worker, role: 'worker' }, `token_demo_${worker.id}`);
    }
  };

  const handleDemoProviderLogin = () => {
    const prov = getDemoProvider();
    onLogin(prov, `token_prov_${prov.id}`);
  };

  const handleDemoEmployerLogin = () => {
    const emp = getDemoEmployer();
    onLogin(emp, `token_emp_${emp.id}`);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone && selectedRole === 'worker') {
      setErrorMessage('Please enter a valid mobile phone number');
      return;
    }
  };

  const handleVerifyOtp = (otp: string) => {
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (otp.trim() !== '123456' && otp.trim() !== '000000' && otp.trim().length < 4) {
        setErrorMessage('Invalid verification code. Enter "123456" for demo testing.');
        return;
      }

      if (selectedRole === 'worker') {
        const workers = getWorkers();
        const existing = workers.find((w) => w.phone.includes(phone.slice(-4)) || w.phone === phone);
        if (existing) {
          onLogin({ ...existing, role: 'worker' }, `token_${existing.id}`);
        } else {
          setRegistrationPhone(phone);
          onShowRegister();
        }
      } else if (selectedRole === 'provider') {
        const prov = getDemoProvider();
        onLogin(prov, `token_${prov.id}`);
      } else {
        handleDemoEmployerLogin();
      }
    }, 350);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleSigningIn(true);

    // Check if Supabase URL and Anon Key are configured
    if (!isSupabaseConfigured()) {
      setIsGoogleSigningIn(false);
      setShowConfigModal(true);
      return;
    }

    try {
      // Real Supabase OAuth flow
      await signInWithGoogleOAuth(selectedRole || 'worker');
    } catch (err: any) {
      setIsGoogleSigningIn(false);
      setErrorMessage(
        err?.message || 'Failed to initialize Google login via Supabase. Please verify Supabase OAuth settings.'
      );
    }
  };

  const handleDevGoogleBypass = () => {
    setShowConfigModal(false);
    if (onStartGoogleSetup) {
      onStartGoogleSetup({
        id: `oauth_demo_${Date.now()}`,
        name: 'Google Auth User',
        email: 'user.oauth@gmail.com',
        role: selectedRole || 'worker',
      });
    }
  };

  const handleFallbackEmailLogin = (role: UserRole, email: string) => {
    if (role === 'worker') {
      const workers = getWorkers();
      const existing = workers[0];
      onLogin({ ...existing, role: 'worker', email }, `token_local_${existing.id}`);
    } else if (role === 'provider') {
      const prov = getDemoProvider();
      onLogin({ ...prov, email }, `token_local_${prov.id}`);
    } else {
      const emp = getDemoEmployer();
      onLogin({ ...emp, email }, `token_local_${emp.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 flex flex-col items-center justify-center">
        {!selectedRole ? (
          <RoleSelector
            onSelectRole={(role) => {
              setSelectedRole(role);
            }}
          />
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="minimal-card p-4 sm:p-7 space-y-4 sm:space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setErrorMessage('');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer flex items-center gap-1 min-h-[38px] p-1"
                >
                  ← Back to Portals
                </button>
                <Badge variant="sky">
                  {selectedRole === 'worker'
                    ? t('worker')
                    : selectedRole === 'provider'
                    ? t('doctor')
                    : t('employer')}
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedRole === 'worker'
                    ? 'Worker Access Portal'
                    : selectedRole === 'provider'
                    ? 'Clinic Provider Portal'
                    : 'Employer Verification'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole === 'worker'
                    ? 'Sign in to access your QR Health ID or grant clinic consent'
                    : selectedRole === 'provider'
                    ? 'Enter clinical credentials to request consent & scan badges'
                    : 'Verify worker health pass without accessing private notes'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Method Switcher Tabs (Phone PIN vs Email) */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setErrorMessage('');
                  }}
                  className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile PIN / OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMessage('');
                  }}
                  className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* Real Google Sign-in Button via Supabase OAuth */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn || isLoading}
                className="btn-minimal-google cursor-pointer"
                title="Continue with Google"
              >
                {isGoogleSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
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
                )}
                <span>
                  {isGoogleSigningIn ? 'Connecting to Supabase Google Auth...' : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                  {authMethod === 'phone' ? 'or with Mobile SMS' : 'or with Email & Password'}
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {authMethod === 'phone' ? (
                <PhoneLoginForm
                  role={selectedRole}
                  phone={phone}
                  setPhone={setPhone}
                  clinicRegNo={clinicRegNo}
                  setClinicRegNo={setClinicRegNo}
                  onSubmitSendOtp={handleSendOtp}
                  onSubmitVerifyOtp={handleVerifyOtp}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                />
              ) : (
                <EmailAuthForm
                  role={selectedRole}
                  onSuccess={(user, token) => onLogin(user, token)}
                  onFallbackLogin={handleFallbackEmailLogin}
                />
              )}

              {selectedRole === 'worker' && authMethod === 'phone' && (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    New migrant worker?{' '}
                    <button
                      type="button"
                      onClick={onShowRegister}
                      className="font-bold text-slate-900 hover:text-sky-600 underline cursor-pointer"
                    >
                      {t('registerBtn')}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Supabase Configuration & OAuth Information Dialog */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Supabase OAuth Setup</h3>
                  <p className="text-xs text-slate-500">Live Google Sign-In with Supabase Auth</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  The application is configured to authenticate directly with <strong>Supabase Google OAuth</strong>.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono-code text-[11px] text-slate-800 space-y-1">
                  <div>VITE_SUPABASE_URL=https://xyz.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Provide these environment variables in your project settings to enable live Google redirects and user synchronization.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="btn-minimal-secondary cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDevGoogleBypass}
                  className="btn-minimal-primary bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  Test Profile Setup →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

