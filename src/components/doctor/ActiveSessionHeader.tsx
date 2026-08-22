import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, Droplet, Heart, LogOut } from 'lucide-react';
import { WorkerUser } from '../../types';
import { Badge } from '../common/Badge';

interface ActiveSessionHeaderProps {
  patient: WorkerUser;
  formattedCountdown: string;
  onEndSession: () => void;
}

export const ActiveSessionHeader: React.FC<ActiveSessionHeaderProps> = ({
  patient,
  formattedCountdown,
  onEndSession,
}) => {
  return (
    <div className="space-y-3">
      {/* 5-minute Active Window Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                Active Clinical Consent Session
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-emerald-800">
              Verified access granted by patient {patient.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-emerald-700 font-semibold block uppercase">
              Time Remaining
            </span>
            <div className="flex items-center gap-1 font-mono-code font-bold text-base text-emerald-900">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedCountdown}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEndSession}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-800 transition cursor-pointer"
            title="End Session"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Patient Clinical Baseline Banner */}
      <div className="minimal-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <img src={patient.photo_url} alt={patient.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {patient.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono-code">
                {patient.health_id} · DOB: {patient.dob} ({patient.gender})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="emerald">{patient.status}</Badge>
            <span className="text-xs text-slate-500 font-medium">
              Vaccinated ({patient.vaccine_count} doses)
            </span>
          </div>
        </div>

        {/* Highlighted Critical Flags (Allergies & Conditions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-950">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[11px] uppercase tracking-wider text-rose-900">
                Drug Allergies:
              </strong>
              <span>{patient.allergies || 'No known drug allergies'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 flex items-start gap-2 text-sky-950">
            <Heart className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[11px] uppercase tracking-wider text-sky-900">
                Chronic Baseline &amp; Blood:
              </strong>
              <span>
                Blood: <strong>{patient.blood_group}</strong> · Conditions:{' '}
                {patient.chronic_conditions?.join(', ') || 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
