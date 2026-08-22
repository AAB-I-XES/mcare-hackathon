import React from 'react';
import { Search, QrCode, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { DEMO_PASSENGERS } from '../../constants/medicalOptions';

interface PatientSearchSectionProps {
  healthIdInput: string;
  setHealthIdInput: (val: string) => void;
  onRequestConsent: (e: React.FormEvent) => void;
  onOpenScanner: () => void;
  onQuickSelect: (healthId: string) => void;
  isLoading: boolean;
}

export const PatientSearchSection: React.FC<PatientSearchSectionProps> = ({
  healthIdInput,
  setHealthIdInput,
  onRequestConsent,
  onOpenScanner,
  onQuickSelect,
  isLoading,
}) => {
  const { t } = useI18n();

  return (
    <div className="minimal-card p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">{t('scanTitle')}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{t('healthIdSubtitle')}</p>
      </div>

      <form onSubmit={onRequestConsent} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t('scanPlaceholder')}
            value={healthIdInput}
            onChange={(e) => setHealthIdInput(e.target.value)}
            className="w-full minimal-input pl-9.5 pr-3.5 py-2.5 font-mono-code uppercase font-semibold"
            required
            autoFocus
          />
        </div>

        <button
          type="button"
          onClick={onOpenScanner}
          className="btn-minimal-secondary cursor-pointer"
          title="Open camera viewfinder"
        >
          <QrCode className="w-4 h-4 text-slate-700" />
          <span>Scan QR</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
        >
          <span>{isLoading ? 'Requesting...' : t('requestAccessBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Patient Fast Selection Chips */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Demo Patients on Registry:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_PASSENGERS.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onQuickSelect(patient.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-xs">{patient.name}</p>
                <span className="text-[10px] text-slate-400 font-mono-code">{patient.id}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{patient.detail}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
