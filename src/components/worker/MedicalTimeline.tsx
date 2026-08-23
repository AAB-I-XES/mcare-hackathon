import React, { useState } from 'react';
import {
  FileText,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  Building2,
  Calendar,
  Camera,
  Eye,
  Paperclip,
  Maximize2,
} from 'lucide-react';
import { MedicalRecord, MedicalRecordType } from '../../types';
import { useI18n } from '../../i18n';
import { formatDate } from '../../utils/formatters';
import { Badge, BadgeVariant } from '../common/Badge';
import { DocumentViewerModal } from './DocumentViewerModal';

interface MedicalTimelineProps {
  records: MedicalRecord[];
  onOpenScanner?: () => void;
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  records,
  onOpenScanner,
}) => {
  const { t } = useI18n();
  const [filterType, setFilterType] = useState<string>('all');
  const [viewingRecord, setViewingRecord] = useState<{
    record: MedicalRecord;
    attachmentIndex: number;
  } | null>(null);

  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  const getRecordIcon = (type: MedicalRecordType) => {
    switch (type) {
      case 'visit':
        return <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />;
      case 'prescription':
        return <Pill className="w-3.5 h-3.5 text-sky-600" />;
      case 'lab_result':
        return <FlaskConical className="w-3.5 h-3.5 text-purple-600" />;
      case 'vaccination':
        return <Syringe className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600" />;
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
      {/* Top Action Bar: Horizontal Scrollable Filters + Camera Scan Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none -mx-1 px-1">
          {[
            { id: 'all', label: t('filterAll') },
            { id: 'prescription', label: t('recordType_prescription') },
            { id: 'visit', label: t('recordType_visit') },
            { id: 'vaccination', label: t('recordType_vaccination') },
            { id: 'lab_result', label: t('recordType_lab_result') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 min-h-[38px] flex items-center ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scan Health Record Button */}
        {onOpenScanner && (
          <button
            type="button"
            onClick={onOpenScanner}
            className="btn-minimal-primary bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold shadow-xs cursor-pointer shrink-0 border-sky-600 hover:border-sky-700 w-full sm:w-auto min-h-[44px]"
          >
            <Camera className="w-4 h-4" />
            <span>{t('scanRecordBtn')}</span>
          </button>
        )}
      </div>

      {/* Record Cards List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
            <Camera className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">{t('noRecords')}</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Scan physical prescriptions, lab reports, or vaccine cards with your device camera to build your verifiable digital medical passport.
            </p>
          </div>
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="btn-minimal-primary text-xs cursor-pointer inline-flex items-center gap-2 min-h-[44px]"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Medical Document</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const hasAttachments = Boolean(record.attachments && record.attachments.length > 0);

            return (
              <div
                key={record.id}
                className="minimal-card p-4 sm:p-5 space-y-3 transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {getRecordIcon(record.type)}
                    <Badge variant={getRecordBadgeVariant(record.type)}>
                      {t(`recordType_${record.type}`)}
                    </Badge>
                    {hasAttachments && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        <Camera className="w-3 h-3 text-sky-600" />
                        <span>
                          {record.attachments!.length}{' '}
                          {record.attachments!.length === 1 ? 'Scan' : 'Pages'}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 font-mono-code">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(record.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {record.notes}
                </p>

                {/* Scanned Document Thumbnails & Inspection Tray */}
                {hasAttachments && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        <span>Scanned Medical Document ({record.attachments!.length} {record.attachments!.length === 1 ? 'page' : 'pages'})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewingRecord({ record, attachmentIndex: 0 })}
                        className="text-sky-700 hover:text-sky-900 active:scale-95 text-xs font-semibold flex items-center gap-1 cursor-pointer p-1"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>{t('viewScannedDoc')}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                      {record.attachments!.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setViewingRecord({ record, attachmentIndex: idx })}
                          className="group relative w-16 sm:w-20 h-20 sm:h-24 rounded-xl overflow-hidden border border-slate-200 hover:border-sky-500 shadow-xs transition cursor-pointer shrink-0 bg-white"
                        >
                          <img
                            src={imgUrl}
                            alt={`Scanned page ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition" />
                          </div>
                          <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white text-center font-bold py-0.5">
                            P{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.facility_name}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{record.provider_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Lightbox Document Viewer */}
      {viewingRecord && (
        <DocumentViewerModal
          record={viewingRecord.record}
          initialAttachmentIndex={viewingRecord.attachmentIndex}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </div>
  );
};

