import React from 'react';
import { AlertTriangle, Droplet, Heart, Phone } from 'lucide-react';
import { WorkerUser } from '../../types';
import { useI18n } from '../../i18n';

interface EmergencyProfileProps {
  worker: WorkerUser;
}

export const EmergencyProfile: React.FC<EmergencyProfileProps> = ({ worker }) => {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {/* Blood Group Card */}
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-1">
        <div className="flex items-center gap-1.5 text-rose-600">
          <Droplet className="w-3.5 h-3.5" />
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {t('bloodTitle')}
          </span>
        </div>
        <p className="text-lg sm:text-xl font-mono-code font-bold text-slate-900">
          {worker.blood_group || 'O+'}
        </p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium truncate">Verified clinical marker</span>
      </div>

      {/* Allergies Card */}
      <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border shadow-xs space-y-1 ${
        worker.allergies
          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
          : 'bg-white border-slate-200/90 text-slate-900'
      }`}>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className={`w-3.5 h-3.5 ${worker.allergies ? 'text-rose-600' : 'text-slate-400'}`} />
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${worker.allergies ? 'text-rose-900' : 'text-slate-500'}`}>
            {t('allergiesTitle')}
          </span>
        </div>
        <p className="text-xs font-bold leading-snug truncate">
          {worker.allergies || 'No known allergies'}
        </p>
        <span className={`text-[9px] sm:text-[10px] font-medium block truncate ${worker.allergies ? 'text-rose-700' : 'text-slate-400'}`}>
          {worker.allergies ? 'Critical emergency flag' : 'Zero reported flags'}
        </span>
      </div>

      {/* Chronic Conditions Card */}
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-1">
        <div className="flex items-center gap-1.5 text-sky-600">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {t('conditionsTitle')}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug truncate">
          {worker.chronic_conditions && worker.chronic_conditions.length > 0
            ? worker.chronic_conditions.join(', ')
            : 'None reported'}
        </p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium truncate">Baseline conditions</span>
      </div>

      {/* Emergency Contact */}
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Phone className="w-3.5 h-3.5" />
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Emergency Contact
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug truncate font-mono-code">
          {worker.emergency_contact || 'Contact on file'}
        </p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium truncate">Next-of-kin notification</span>
      </div>
    </div>
  );
};

