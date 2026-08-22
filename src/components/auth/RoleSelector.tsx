import React from 'react';
import { User, Stethoscope, Building2, ArrowRight, QrCode, Lock } from 'lucide-react';
import { useI18n } from '../../i18n';
import { UserRole } from '../../types';
import { QuickDemoPicker } from './QuickDemoPicker';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  onDemoWorker: (healthId: string) => void;
  onDemoDoctor: () => void;
  onDemoEmployer: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  onDemoWorker,
  onDemoDoctor,
  onDemoEmployer,
}) => {
  const { t } = useI18n();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Left Column: Hero & Key Features */}
      <div className="md:col-span-6 space-y-4 text-center md:text-left">
        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800">
          Digital Health Pass
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Secure health identity, everywhere you work.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
          Portable medical passport with real-time patient consent, rapid clinic access, and zero data leakage.
        </p>

        <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 text-sky-600 mb-0.5">
              <QrCode className="w-3.5 h-3.5" />
              <p className="text-xs font-bold text-slate-800">QR Code Passport</p>
            </div>
            <p className="text-[11px] text-slate-500">Accessible at any verified clinic</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
              <Lock className="w-3.5 h-3.5" />
              <p className="text-xs font-bold text-slate-800">Time-Limited Consent</p>
            </div>
            <p className="text-[11px] text-slate-500">5-minute active access window</p>
          </div>
        </div>
      </div>

      {/* Right Column: Portal Choice Cards */}
      <div className="md:col-span-6 w-full max-w-md mx-auto">
        <div className="minimal-card p-6 sm:p-7 space-y-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t('roleSelection')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your portal type to access health records or verify pass
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Worker Button */}
            <button
              type="button"
              onClick={() => onSelectRole('worker')}
              className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-sky-900">
                    {t('worker')}
                  </p>
                  <p className="text-xs text-slate-500">
                    View Health ID, approve doctor requests & history
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
            </button>

            {/* Doctor Button */}
            <button
              type="button"
              onClick={() => onSelectRole('provider')}
              className="w-full p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                    {t('doctor')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Scan patient QR, view records & log treatment
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </button>

            {/* Employer Button */}
            <button
              type="button"
              onClick={() => onSelectRole('employer')}
              className="w-full p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-amber-900">
                    {t('employer')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Verify workplace clearance pass & vaccine status
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </button>
          </div>

          <QuickDemoPicker
            onSelectWorker={onDemoWorker}
            onSelectDoctor={onDemoDoctor}
            onSelectEmployer={onDemoEmployer}
          />
        </div>
      </div>
    </div>
  );
};
