import React from 'react';
import { ShieldAlert, Clock, Building2, UserCheck } from 'lucide-react';
import { AccessLog } from '../../types';
import { useI18n } from '../../i18n';
import { formatDateTime } from '../../utils/formatters';

interface AccessLogsTabProps {
  logs: AccessLog[];
}

export const AccessLogsTab: React.FC<AccessLogsTabProps> = ({ logs }) => {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200 text-sky-950 text-xs flex items-start gap-2.5">
        <UserCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Immutable Audit Trail:</strong> Every single provider or employer lookup is permanently recorded with full timestamp and location.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t('noLogs')}</p>
          <p className="text-xs text-slate-400">
            No medical clinics or workplace safety gates have queried your Health ID yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{log.viewer_name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {log.viewer_role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{log.facility}</span>
                  </div>
                  <span>·</span>
                  <span className="text-sky-700 font-medium">{log.access_type}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono-code shrink-0">
                <Clock className="w-3 h-3" />
                <span>{formatDateTime(log.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
