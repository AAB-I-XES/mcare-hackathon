import { useState, useEffect, FC, FormEvent } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getWorkers, subscribeToStorage } from '../../services';
import { WorkerUser } from '../../types';

interface VerifyFormProps {
  healthId: string;
  setHealthId: (val: string) => void;
  onVerify: (e: FormEvent) => void;
  onQuickVerify: (healthId: string) => void;
  isLoading: boolean;
}

export const VerifyForm: FC<VerifyFormProps> = ({
  healthId,
  setHealthId,
  onVerify,
  onQuickVerify,
  isLoading,
}) => {
  const { t } = useI18n();
  const [workers, setWorkers] = useState<WorkerUser[]>([]);

  useEffect(() => {
    const load = () => {
      setWorkers(getWorkers());
    };
    load();
    const unsub = subscribeToStorage(load);
    return () => unsub();
  }, []);

  return (
    <div className="minimal-card p-4 sm:p-6 space-y-4 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900">{t('employerCheckTitle')}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{t('employerCheckSubtitle')}</p>
      </div>

      <form onSubmit={onVerify} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder={t('scanPlaceholder')}
            value={healthId}
            onChange={(e) => setHealthId(e.target.value)}
            className="w-full minimal-input pl-9.5 pr-3.5 py-2.5 font-mono-code uppercase font-semibold text-xs sm:text-sm min-h-[44px]"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-minimal-primary bg-amber-600 hover:bg-amber-700 cursor-pointer min-h-[44px] flex items-center justify-center gap-2 font-bold text-xs sm:text-sm shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isLoading ? 'Verifying...' : t('checkStatusBtn')}</span>
        </button>
      </form>

      {/* Quick Access Worker Passes */}
      {workers.length > 0 && (
        <div className="pt-2.5 border-t border-slate-100 space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Quick Verify Worker Passes ({workers.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {workers.slice(0, 6).map((worker) => (
              <button
                key={worker.id}
                type="button"
                onClick={() => onQuickVerify(worker.health_id)}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/50 hover:border-amber-300 text-left transition cursor-pointer active:scale-[0.98] min-h-[44px]"
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="font-bold text-slate-900 text-xs truncate">{worker.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono-code shrink-0">{worker.health_id}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {worker.status} · {worker.vaccinated ? `${worker.vaccine_count} Doses` : 'Unvaccinated'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
