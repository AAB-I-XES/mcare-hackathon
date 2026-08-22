import React, { useState } from 'react';
import { AlertCircle, Building2 } from 'lucide-react';
import { EmployerUser, EmployerStatusResult } from '../../types';
import { useI18n } from '../../i18n';
import { getEmployerStatus } from '../../services';
import { Header, Footer } from '../common';
import { VerifyForm } from './VerifyForm';
import { HealthPassResultCard } from './HealthPassResultCard';

interface EmployerDashboardProps {
  user: EmployerUser;
  onLogout: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  const [healthId, setHealthId] = useState('');
  const [result, setResult] = useState<EmployerStatusResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e?: React.FormEvent, directHealthId?: string) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setResult(null);

    const targetId = (directHealthId || healthId).trim();
    if (!targetId) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = getEmployerStatus(targetId);
      if (!res.success) {
        setErrorMessage(t('idNotFound'));
      } else {
        setResult(res);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
            Workplace Gate Protocol
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workplace Health Pass Verification
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Instantly check worker physical fitness and vaccine compliance without exposing private clinical notes.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <VerifyForm
          healthId={healthId}
          setHealthId={setHealthId}
          onVerify={handleVerify}
          onQuickVerify={(id) => {
            setHealthId(id);
            handleVerify(undefined, id);
          }}
          isLoading={isLoading}
        />

        {result && <HealthPassResultCard result={result} />}
      </main>

      <Footer />
    </div>
  );
};
