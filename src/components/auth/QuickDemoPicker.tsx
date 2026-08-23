import { useEffect, useState, FC } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { getWorkers, getProviders, getEmployers, subscribeToStorage } from '../../services';
import { WorkerUser, ProviderUser, EmployerUser } from '../../types';

interface QuickDemoPickerProps {
  onSelectWorker: (healthId: string) => void;
  onSelectDoctor: () => void;
  onSelectEmployer: () => void;
}

export const QuickDemoPicker: FC<QuickDemoPickerProps> = ({
  onSelectWorker,
  onSelectDoctor,
  onSelectEmployer,
}) => {
  const [workers, setWorkers] = useState<WorkerUser[]>([]);
  const [provider, setProvider] = useState<ProviderUser | null>(null);
  const [employer, setEmployer] = useState<EmployerUser | null>(null);

  useEffect(() => {
    const load = () => {
      const w = getWorkers();
      const p = getProviders();
      const e = getEmployers();
      setWorkers(w);
      setProvider(p[0] || null);
      setEmployer(e[0] || null);
    };

    load();
    const unsub = subscribeToStorage(load);
    return () => unsub();
  }, []);

  const firstWorker = workers[0];

  return (
    <div className="pt-3 border-t border-slate-100 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-400" />
          <span>Active Registry Profiles</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400">1-Click Test</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {firstWorker ? (
          <button
            type="button"
            onClick={() => onSelectWorker(firstWorker.health_id)}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-xs truncate">{firstWorker.name}</p>
                <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-500">Migrant Worker</p>
            </div>
            <p className="font-mono-code text-[10px] text-sky-700 font-semibold mt-1 truncate">
              {firstWorker.health_id}
            </p>
          </button>
        ) : (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-left flex flex-col justify-between opacity-60">
            <p className="text-[11px] font-medium text-slate-600">Register First Worker</p>
            <p className="text-[10px] text-slate-400">Database Empty</p>
          </div>
        )}

        {provider ? (
          <button
            type="button"
            onClick={onSelectDoctor}
            className="p-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-emerald-950 text-xs truncate">Clinic Physician</p>
                <ArrowUpRight className="w-3 h-3 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[10px] text-emerald-700 truncate">{provider.facility || 'Clinical Station'}</p>
            </div>
            <p className="font-mono-code text-[10px] text-emerald-700 font-semibold mt-1 truncate">
              {provider.reg_no}
            </p>
          </button>
        ) : (
          <div className="p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-200 text-left flex flex-col justify-between opacity-60">
            <p className="text-[11px] font-medium text-emerald-800">Clinic Physician</p>
            <p className="text-[10px] text-emerald-600">Provider Station</p>
          </div>
        )}

        {employer ? (
          <button
            type="button"
            onClick={onSelectEmployer}
            className="p-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-amber-950 text-xs truncate">{employer.name}</p>
                <ArrowUpRight className="w-3 h-3 text-amber-600 shrink-0" />
              </div>
              <p className="text-[10px] text-amber-700 truncate">{employer.company}</p>
            </div>
            <p className="text-[10px] text-amber-700 font-semibold mt-1">Site Gate Clearance</p>
          </button>
        ) : (
          <div className="p-2.5 rounded-lg bg-amber-50/30 border border-amber-200 text-left flex flex-col justify-between opacity-60">
            <p className="text-[11px] font-medium text-amber-800">Site Safety Officer</p>
            <p className="text-[10px] text-amber-600">Gate Verification</p>
          </div>
        )}
      </div>
    </div>
  );
};
