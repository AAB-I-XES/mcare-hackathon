import React from 'react';
import { CheckCircle2, ShieldCheck, Syringe, HardHat, Lock, AlertCircle } from 'lucide-react';
import { EmployerStatusResult } from '../../types';
import { useI18n } from '../../i18n';
import { Badge } from '../common/Badge';

interface HealthPassResultCardProps {
  result: EmployerStatusResult;
}

export const HealthPassResultCard: React.FC<HealthPassResultCardProps> = ({ result }) => {
  const { t } = useI18n();

  return (
    <div className="minimal-card p-6 sm:p-7 space-y-5 border-emerald-300 bg-white shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">{result.name}</h3>
            <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Cleared
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-mono-code mt-0.5">{result.health_id}</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{result.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Fitness Clearance */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {t('statusLabel')}
          </span>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <HardHat className="w-4 h-4 text-amber-600" />
            <span>{result.status}</span>
          </div>
        </div>

        {/* Vaccination Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {t('vaccinatedLabel')}
          </span>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Syringe className="w-4 h-4 text-emerald-600" />
            <span>
              {result.vaccinated ? `${t('vaccinated')} (${result.vaccineCount} doses)` : t('notVaccinated')}
            </span>
          </div>
        </div>
      </div>

      {/* Workplace Safety Directives */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1.5">
        <strong className="block text-[11px] uppercase tracking-wider text-amber-900 font-bold">
          {t('recLabel')}
        </strong>
        <p className="leading-relaxed text-slate-700">
          {result.recommendations || 'Standard health precautions apply for assigned tasks.'}
        </p>
      </div>

      {/* Zero Data Leakage Badge */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
        <Lock className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          <strong>Privacy Enforced:</strong> Detailed medical notes, diagnoses, and drug records are completely hidden from employers.
        </span>
      </div>
    </div>
  );
};
