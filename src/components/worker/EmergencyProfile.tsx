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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Blood Group Card */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div className="flex items-center gap-1.5 text-rose-600">
          <Droplet className="w-4 h-4" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('bloodTitle')}
          </span>
        </div>
        <p className="text-xl font-mono-code font-extrabold text-slate-900">
          {worker.blood_group || 'O+'}
        </p>
        <span className="text-[10px] text-slate-400 block">Verified clinical marker</span>
      </div>

      {/* Allergies Card */}
      <div className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
        worker.allergies
          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-1.5 text-amber-600">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
            {t('allergiesTitle')}
          </span>
        </div>
        <p className="text-xs font-bold leading-snug">
          {worker.allergies || 'No known drug allergies reported'}
        </p>
        <span className="text-[10px] text-rose-700/80 block">Critical emergency flag</span>
      </div>

      {/* Chronic Conditions Card */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div className="flex items-center gap-1.5 text-sky-600">
          <Heart className="w-4 h-4" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('conditionsTitle')}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug">
          {worker.chronic_conditions && worker.chronic_conditions.length > 0
            ? worker.chronic_conditions.join(', ')
            : 'None reported'}
        </p>
        <span className="text-[10px] text-slate-400 block">Baseline conditions</span>
      </div>

      {/* Emergency Contact */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Phone className="w-4 h-4" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Emergency Contact
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug truncate">
          {worker.emergency_contact || 'Contact on file'}
        </p>
        <span className="text-[10px] text-slate-400 block">Next-of-kin notification</span>
      </div>
    </div>
  );
};
