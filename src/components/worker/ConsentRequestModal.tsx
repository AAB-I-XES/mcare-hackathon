import React from 'react';
import { ShieldCheck, Stethoscope, Building2, Check, X, AlertTriangle } from 'lucide-react';
import { AccessRequest } from '../../types';
import { useI18n } from '../../i18n';

interface ConsentRequestModalProps {
  request: AccessRequest;
  onApprove: () => void;
  onDeny: () => void;
  isResponding: boolean;
}

export const ConsentRequestModal: React.FC<ConsentRequestModalProps> = ({
  request,
  onApprove,
  onDeny,
  isResponding,
}) => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Action Required · Live Patient Consent
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            {t('consentRequestTitle')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            <strong className="text-slate-900">{request.provider_name}</strong> at{' '}
            <strong className="text-slate-900">{request.facility_name}</strong> {t('consentRequestMsg')}
          </p>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            <span>Scope of Clinical Access</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
            <li>Past clinical notes &amp; medication allergies</li>
            <li>Vaccination and laboratory records</li>
            <li>Ability to log new consultation notes</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onDeny}
            disabled={isResponding}
            className="btn-minimal-secondary border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 cursor-pointer justify-center"
          >
            <X className="w-4 h-4" />
            <span>{t('deny')}</span>
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={isResponding}
            className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer justify-center"
          >
            <Check className="w-4 h-4" />
            <span>{t('approve')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
