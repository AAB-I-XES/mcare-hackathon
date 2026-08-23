import { useState, useEffect, FC, FormEvent } from 'react';
import { Search, QrCode, ArrowRight, User } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getWorkers, subscribeToStorage } from '../../services';
import { WorkerUser } from '../../types';

interface PatientSearchSectionProps {
  healthIdInput: string;
  setHealthIdInput: (val: string) => void;
  onRequestConsent: (e: FormEvent) => void;
  onOpenScanner: () => void;
  onQuickSelect: (healthId: string) => void;
  isLoading: boolean;
}

export const PatientSearchSection: FC<PatientSearchSectionProps> = ({
  healthIdInput,
  setHealthIdInput,
  onRequestConsent,
  onOpenScanner,
  onQuickSelect,
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

      {/* Dynamic Active Registry Patients */}
      {workers.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Registered Patients on Live Database ({workers.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {workers.slice(0, 6).map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => onQuickSelect(patient.health_id)}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-xs truncate">{patient.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono-code truncate">{patient.health_id}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Blood: {patient.blood_group} · {patient.allergies || 'No known allergies'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
