import React from 'react';
import { Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { DEMO_PASSENGERS } from '../../constants/medicalOptions';

interface VerifyFormProps {
  healthId: string;
  setHealthId: (val: string) => void;
  onVerify: (e: React.FormEvent) => void;
  onQuickVerify: (healthId: string) => void;
  isLoading: boolean;
}

export const VerifyForm: React.FC<VerifyFormProps> = ({
  healthId,
  setHealthId,
  onVerify,
  onQuickVerify,
  isLoading,
}) => {
  const { t } = useI18n();

  return (
    <div className="minimal-card p-6 sm:p-7 space-y-4 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-slate-900">{t('employerCheckTitle')}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{t('employerCheckSubtitle')}</p>
      </div>

      <form onSubmit={onVerify} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="e.g. MC-5820-1943"
            value={healthId}
            onChange={(e) => setHealthId(e.target.value)}
            className="w-full minimal-input pl-9.5 pr-3.5 py-2.5 font-mono-code uppercase font-semibold"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-minimal-primary bg-amber-600 hover:bg-amber-700 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isLoading ? 'Verifying...' : t('checkStatusBtn')}</span>
        </button>
      </form>

      {/* Demo Workers Quick Selection */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Test Worker Passes:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_PASSENGERS.map((worker) => (
            <button
              key={worker.id}
              type="button"
              onClick={() => onQuickVerify(worker.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50/50 hover:border-amber-300 text-left transition cursor-pointer"
            >
              <p className="font-bold text-slate-900 text-xs">{worker.name}</p>
              <p className="text-[10px] text-slate-500 font-mono-code">{worker.id}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
