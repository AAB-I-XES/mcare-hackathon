import React from 'react';
import { FileText, Building2, Calendar, Stethoscope, Pill, FlaskConical, Syringe } from 'lucide-react';
import { MedicalRecord, MedicalRecordType } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Badge, BadgeVariant } from '../common/Badge';

interface PatientHistorySectionProps {
  records: MedicalRecord[];
}

export const PatientHistorySection: React.FC<PatientHistorySectionProps> = ({ records }) => {
  const getRecordIcon = (type: MedicalRecordType) => {
    switch (type) {
      case 'visit':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-sky-600" />;
      case 'lab_result':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBadgeVariant = (type: MedicalRecordType): BadgeVariant => {
    switch (type) {
      case 'visit':
        return 'emerald';
      case 'prescription':
        return 'sky';
      case 'lab_result':
        return 'purple';
      case 'vaccination':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">
          Cross-Clinic Patient Medical History ({records.length})
        </h4>
        <span className="text-xs text-slate-400">Portable Universal Records</span>
      </div>

      {records.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          No prior clinical records found for this worker.
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="minimal-card p-4 space-y-2 transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getRecordIcon(rec.type)}
                  <Badge variant={getBadgeVariant(rec.type)} className="capitalize">
                    {rec.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono-code">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(rec.created_at)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed">{rec.notes}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{rec.facility_name}</span>
                </div>
                <span className="font-semibold text-slate-500">{rec.provider_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
