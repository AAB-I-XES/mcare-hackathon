import React from 'react';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { WorkerUser } from '../../types';

interface PendingApprovalCardProps {
  patient: WorkerUser;
  onSimulateWorkerApproval: () => void;
  onCancel: () => void;
}

export const PendingApprovalCard: React.FC<PendingApprovalCardProps> = ({
  patient,
  onSimulateWorkerApproval,
  onCancel,
}) => {
  const { t } = useI18n();

  return (
    <div className="minimal-card p-6 border-amber-200 bg-amber-50/40 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="badge-clean badge-clean-amber text-[10px] uppercase font-bold">
              Consent Request Dispatched
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              {t('waitingApproval')}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {t('approvalInstruction')} A push consent notification was delivered to{' '}
        <strong className="text-slate-900">{patient.name}</strong> ({patient.health_id}).
      </p>

      <div className="p-3 bg-white rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-slate-700 font-medium">
            Demo helper: simulate worker tapping &quot;Approve&quot; on mobile
          </span>
        </div>
        <button
          type="button"
          onClick={onSimulateWorkerApproval}
          className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 text-xs py-1.5 px-3 cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approve Consent as Worker</span>
        </button>
      </div>
    </div>
  );
};
