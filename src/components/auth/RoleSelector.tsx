import React from 'react';
import { User, Stethoscope, Building2, ArrowRight, QrCode, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Left Column: Institutional Value & Security Guarantees */}
      <div className="md:col-span-6 space-y-5 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Universal Digital Health Identity</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Consent-governed health records for migrant workers.
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
          A portable, zero-knowledge clinical passport ensuring complete patient data sovereignty across borders, clinics, and work sites.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.03)] text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">QR Health ID</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Instant clinical scanning with cryptographic proof
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.03)] text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Zero Leakage</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Employers never see private consultation notes
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Portal Choice Cards */}
      <div className="md:col-span-6 w-full max-w-md mx-auto">
        <div className="minimal-card p-6 sm:p-7 space-y-4 shadow-sm border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {t('roleSelection')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your portal role to continue
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Worker Button */}
            <button
              type="button"
              onClick={() => onSelectRole('worker')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center shrink-0 border border-sky-100 group-hover:scale-105 transition">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">
                      {t('worker')} Portal
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                      Personal Pass
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Access your QR pass, approve doctor requests & scans
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Doctor Button */}
            <button
              type="button"
              onClick={() => onSelectRole('provider')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">
                      {t('doctor')} / Clinic EMR
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Clinical
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan patient QR, view health history & log diagnoses
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Employer Button */}
            <button
              type="button"
              onClick={() => onSelectRole('employer')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">
                      {t('employer')} Gate Terminal
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                      Workplace
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify duty clearance pass & vaccination compliance
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
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

