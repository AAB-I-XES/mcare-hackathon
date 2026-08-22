import React, { useState } from 'react';
import { Sparkles, Smartphone, Mail, Database, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppUser, UserRole } from '../../types';
import {
  getWorkers,
  getWorkerByHealthId,
  getDemoProvider,
  getDemoEmployer,
  isSupabaseConfigured,
  supabaseSignInWithGoogle,
} from '../../services';
import { Header, Footer, Badge } from '../common';
import { RoleSelector } from './RoleSelector';
import { PhoneLoginForm } from './PhoneLoginForm';
import { EmailAuthForm } from './EmailAuthForm';

interface AuthViewProps {
  onLogin: (user: AppUser, token: string) => void;
  onShowRegister: () => void;
  registrationPhone: string;
  setRegistrationPhone: (phone: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onShowRegister,
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

  const supabaseReady = isSupabaseConfigured();

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
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error(
          'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are required to initiate Google OAuth with Supabase.'
        );
      }
      await supabaseSignInWithGoogle(selectedRole || 'worker');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Google Auth through Supabase encountered an error.');
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        {/* Backend Connectivity Status Badge */}
        <div className="mb-4 flex items-center gap-2">
          {supabaseReady ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Live Auth Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <Sparkles className="w-3 h-3 text-sky-600" />
              Local Cloud Registry (Offline-Ready)
            </span>
          )}
        </div>

        {!selectedRole ? (
          <RoleSelector
            onSelectRole={(role) => {
              setSelectedRole(role);
            }}
            onDemoWorker={handleDemoWorkerLogin}
            onDemoDoctor={handleDemoProviderLogin}
            onDemoEmployer={handleDemoEmployerLogin}
          />
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="minimal-card p-6 sm:p-8 space-y-5 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setErrorMessage('');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer flex items-center gap-1"
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

              {/* Method Switcher Tabs (Phone PIN vs Supabase Email) */}
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
                  <span>Supabase Email</span>
                </button>
              </div>

              {/* Google Sign-in Button powered directly by Supabase Auth */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="btn-minimal-google cursor-pointer"
                title="Authenticate with Google via Supabase OAuth"
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
                <span>{isLoading ? 'Connecting to Supabase...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                  {authMethod === 'phone' ? 'or with Mobile SMS' : 'or with Supabase Credentials'}
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
      </main>

      <Footer />
    </div>
  );
};
