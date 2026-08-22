import React, { useState } from 'react';
import {
  FileText,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  Building2,
  Calendar,
} from 'lucide-react';
import { MedicalRecord, MedicalRecordType } from '../../types';
import { useI18n } from '../../i18n';
import { formatDate } from '../../utils/formatters';
import { Badge, BadgeVariant } from '../common/Badge';

interface MedicalTimelineProps {
  records: MedicalRecord[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records }) => {
  const { t } = useI18n();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

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

  const getRecordBadgeVariant = (type: MedicalRecordType): BadgeVariant => {
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
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t('filterAll') },
          { id: 'visit', label: t('recordType_visit') },
          { id: 'prescription', label: t('recordType_prescription') },
          { id: 'vaccination', label: t('recordType_vaccination') },
          { id: 'lab_result', label: t('recordType_lab_result') },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterType === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Record Cards List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t('noRecords')}</p>
          <p className="text-xs text-slate-400">
            Records added by authorized clinics will automatically appear in your timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="minimal-card p-4 sm:p-5 space-y-2.5 transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getRecordIcon(record.type)}
                  <Badge variant={getRecordBadgeVariant(record.type)}>
                    {t(`recordType_${record.type}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono-code">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(record.created_at)}</span>
                </div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {record.notes}
              </p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{record.facility_name}</span>
                </div>
                <span className="text-slate-400 font-semibold">{record.provider_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
