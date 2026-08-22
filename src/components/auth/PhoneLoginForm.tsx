import React, { useState } from 'react';
import { Phone, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { UserRole } from '../../types';

interface PhoneLoginFormProps {
  role: UserRole;
  phone: string;
  setPhone: (val: string) => void;
  clinicRegNo: string;
  setClinicRegNo: (val: string) => void;
  onSubmitSendOtp: (e: React.FormEvent) => void;
  onSubmitVerifyOtp: (otp: string) => void;
  isLoading: boolean;
  errorMessage: string;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({
  role,
  phone,
  setPhone,
  clinicRegNo,
  setClinicRegNo,
  onSubmitSendOtp,
  onSubmitVerifyOtp,
  isLoading,
  errorMessage,
}) => {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSendOtp(e);
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitVerifyOtp(otp);
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSend} className="space-y-4">
          {role === 'worker' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+65 8123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full minimal-input pl-9.5 pr-3.5 py-2.5"
                  required
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('regNoLabel')}
              </label>
              <input
                type="text"
                placeholder="MCR-2018-9482"
                value={clinicRegNo}
                onChange={(e) => setClinicRegNo(e.target.value)}
                className="w-full minimal-input px-3.5 py-2.5 font-mono-code"
                required
                autoFocus
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-minimal-primary w-full cursor-pointer"
          >
            <span>{isLoading ? 'Sending...' : t('getOtp')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            {t('demoHint')}
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {t('otpLabel')}
              </label>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-sky-600 hover:underline cursor-pointer"
              >
                Change number
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full minimal-input pl-9.5 pr-3.5 py-2.5 tracking-widest font-mono-code font-bold text-center text-lg"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-minimal-primary w-full cursor-pointer"
          >
            <span>{isLoading ? 'Verifying...' : t('verifyOtp')}</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Enter code <strong className="text-slate-700">123456</strong> for testing
          </p>
        </form>
      )}
    </div>
  );
};
