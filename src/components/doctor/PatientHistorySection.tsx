import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Syringe,
  Paperclip,
  Camera,
  Eye,
  Maximize2,
} from 'lucide-react';
import { MedicalRecord, MedicalRecordType } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Badge, BadgeVariant } from '../common/Badge';
import { DocumentViewerModal } from '../worker/DocumentViewerModal';

interface PatientHistorySectionProps {
  records: MedicalRecord[];
}

export const PatientHistorySection: React.FC<PatientHistorySectionProps> = ({ records }) => {
  const [viewingRecord, setViewingRecord] = useState<{
    record: MedicalRecord;
    attachmentIndex: number;
  } | null>(null);

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
          {records.map((rec) => {
            const hasAttachments = Boolean(rec.attachments && rec.attachments.length > 0);

            return (
              <div
                key={rec.id}
                className="minimal-card p-4 space-y-2.5 transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getRecordIcon(rec.type)}
                    <Badge variant={getBadgeVariant(rec.type)} className="capitalize">
                      {rec.type.replace('_', ' ')}
                    </Badge>
                    {hasAttachments && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <Camera className="w-3 h-3 text-sky-600" />
                        <span>
                          {rec.attachments!.length}{' '}
                          {rec.attachments!.length === 1 ? 'Scan' : 'Pages'}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono-code">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(rec.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{rec.notes}</p>

                {/* Scanned Document Thumbnails for Doctor inspection */}
                {hasAttachments && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600 font-semibold">
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        <span>Attached Document Scans</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewingRecord({ record: rec, attachmentIndex: 0 })}
                        className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Inspect Document</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                      {rec.attachments!.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setViewingRecord({ record: rec, attachmentIndex: idx })}
                          className="group relative w-12 h-16 rounded overflow-hidden border border-slate-200 hover:border-sky-500 transition cursor-pointer shrink-0 bg-white"
                        >
                          <img
                            src={imgUrl}
                            alt={`Scanned page ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-white text-center font-bold">
                            P{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{rec.facility_name}</span>
                  </div>
                  <span className="font-semibold text-slate-500">{rec.provider_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Viewer */}
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
