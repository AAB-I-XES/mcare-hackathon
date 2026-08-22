import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

interface StepPersonalProps {
  fullName: string;
  setFullName: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  gender: 'Male' | 'Female' | 'Other';
  setGender: (val: 'Male' | 'Female' | 'Other') => void;
  phone: string;
  setPhone: (val: string) => void;
  onNext: () => void;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({
  fullName,
  setFullName,
  dob,
  setDob,
  gender,
  setGender,
  phone,
  setPhone,
  onNext,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Please provide your identity details to generate your Health ID
        </p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('fullName')}
          </label>
          <input
            type="text"
            placeholder="e.g. Tareq Rahman"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full minimal-input px-3.5 py-2.5"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('dob')}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full minimal-input px-3.5 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('gender')}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full minimal-input px-3.5 py-2.5 bg-white cursor-pointer"
            >
              <option value="Male">{t('male')}</option>
              <option value="Female">{t('female')}</option>
              <option value="Other">{t('other')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('phoneLabel')}
          </label>
          <input
            type="tel"
            placeholder="+65 8123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full minimal-input px-3.5 py-2.5"
            required
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="btn-minimal-primary w-full cursor-pointer mt-2"
      >
        <span>Continue to Medical Info</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
