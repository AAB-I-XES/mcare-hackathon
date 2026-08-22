import React from 'react';
import { ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Locale } from '../../i18n';

interface StepPreferencesProps {
  preferredLang: Locale;
  setPreferredLang: (lang: Locale) => void;
  emergencyContact: string;
  setEmergencyContact: (val: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  preferredLang,
  setPreferredLang,
  emergencyContact,
  setEmergencyContact,
  isSubmitting,
  onBack,
  onSubmit,
}) => {
  const { t } = useI18n();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Final Confirmation</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Set language preferences and emergency details
        </p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Preferred Language for Medical Notes
          </label>
          <select
            value={preferredLang}
            onChange={(e) => setPreferredLang(e.target.value as Locale)}
            className="w-full minimal-input px-3.5 py-2.5 bg-white cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español (Spanish)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Emergency Contact (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Next of Kin Name & Phone Number"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="w-full minimal-input px-3.5 py-2.5"
          />
        </div>

        {/* Consent & Privacy Notice */}
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Zero Data Leakage Guarantee</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Clinics cannot view your past notes without your active QR scan &amp; 5-minute approval. Employers can only view non-clinical fitness clearance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-minimal-secondary cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
        >
          <span>{isSubmitting ? 'Generating...' : t('registerBtn')}</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
