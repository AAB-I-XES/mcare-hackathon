import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  Building2,
  ArrowRight,
  QrCode,
  Lock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Activity,
  ChevronRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { UserRole } from '../../types';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  onDemoWorker?: (healthId: string) => void;
  onDemoDoctor?: () => void;
  onDemoEmployer?: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  onDemoWorker,
  onDemoDoctor,
  onDemoEmployer,
}) => {
  const { t } = useI18n();
  const [activeMobileRole, setActiveMobileRole] = useState<UserRole>('worker');

  const roleDetails = {
    worker: {
      title: `${t('worker')} Portal`,
      tag: 'Personal Pass',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: User,
      description: 'Your portable digital health record, QR emergency pass, and consent manager.',
      features: ['Digital QR Health Card', 'One-Tap Consent Approvals', 'Camera Document Scanner'],
      actionText: 'Enter Worker Portal',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    provider: {
      title: `${t('doctor')} / Clinic EMR`,
      tag: 'Clinical Access',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Stethoscope,
      description: 'Request consent-gated patient records, verify immunizations, and log clinical notes.',
      features: ['Real-time QR Patient Scanner', 'Encrypted Timeline History', 'Add Diagnoses & Rx'],
      actionText: 'Enter Clinic Provider Portal',
      btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    employer: {
      title: `${t('employer')} Gate Terminal`,
      tag: 'Workplace Safety',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Building2,
      description: 'Zero-knowledge verification of duty fitness and vaccination compliance without medical leakage.',
      features: ['Fit-to-Work Clearance Pass', 'Vaccine Verification', 'Zero Diagnosis Privacy Firewall'],
      actionText: 'Enter Employer Safety Terminal',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  };

  const currentRoleData = roleDetails[activeMobileRole];
  const CurrentIcon = currentRoleData.icon;

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. MOBILE-FIRST DEDICATED VIEW (Shown on small screens: block md:hidden)   */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-4">
        {/* Top Status & Brand Chip */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Digital Health Passport</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Network Active</span>
          </div>
        </div>

        {/* Mobile Hero Typography */}
        <div className="space-y-1 pt-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Universal Health Identity for Migrant Workers
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consent-governed medical records and cryptographic clearance passes across clinics and job sites.
          </p>
        </div>

        {/* Mobile Segmented Role Switcher */}
        <div className="p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 grid grid-cols-3 gap-1 shadow-inner">
          {(['worker', 'provider', 'employer'] as UserRole[]).map((roleKey) => {
            const roleItem = roleDetails[roleKey];
            const IconComponent = roleItem.icon;
            const isSelected = activeMobileRole === roleKey;
            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => setActiveMobileRole(roleKey)}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 min-h-[44px] justify-center ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="truncate max-w-full text-[11px]">
                  {roleKey === 'worker' ? 'Worker' : roleKey === 'provider' ? 'Doctor EMR' : 'Employer'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Role Showcase Card */}
        <div className="minimal-card p-4 sm:p-5 space-y-4 border-slate-200 bg-white shadow-xs relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${currentRoleData.iconBg} shadow-xs`}>
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {currentRoleData.title}
                </h2>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold border mt-0.5 ${currentRoleData.badgeColor}`}>
                  {currentRoleData.tag}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentRoleData.description}
          </p>

          {/* Key Capabilities Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Core Capabilities
            </span>
            <div className="space-y-1.5">
              {currentRoleData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[11px]">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => onSelectRole(activeMobileRole)}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer min-h-[48px] active:scale-[0.98] ${currentRoleData.btnColor}`}
          >
            <span>{currentRoleData.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo One-Tap Access Strip */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Test Personas (1-Tap Entry)
            </span>
            <span className="text-[10px] text-slate-400 font-mono-code font-bold">No PIN Required</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onDemoWorker?.('MIG-2024-8841')}
              className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 active:scale-95 text-left transition cursor-pointer flex flex-col justify-between min-h-[64px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-800 uppercase">Worker</span>
                <User className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs truncate">Ramesh K.</p>
                <p className="text-[10px] text-slate-500 truncate">O+ · 2 Doses</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onDemoDoctor?.()}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 active:scale-95 text-left transition cursor-pointer flex flex-col justify-between min-h-[64px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Doctor</span>
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs truncate">Dr. Roy</p>
                <p className="text-[10px] text-slate-500 truncate">City Clinic</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onDemoEmployer?.()}
              className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 active:scale-95 text-left transition cursor-pointer flex flex-col justify-between min-h-[64px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Gate</span>
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs truncate">Safety Supv.</p>
                <p className="text-[10px] text-slate-500 truncate">Site Terminal</p>
              </div>
            </button>
          </div>
        </div>

        {/* Security Highlights Horizontal Cards */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-sky-700">
              <QrCode className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold text-slate-900">QR Passport</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Cryptographically verified clinical badges & vaccine proof.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold text-slate-900">Zero Leakage</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Employers only see clearance pass, never confidential diagnoses.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP AUTHORITATIVE INSTITUTIONAL VIEW (Shown on md: and up)        */}
      {/* ========================================================================= */}
      <div className="hidden md:grid grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Institutional Value & Security Guarantees */}
        <div className="col-span-6 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Universal Digital Health Identity</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Consent-governed health records for migrant workers.
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
            A portable, zero-knowledge clinical passport ensuring complete patient data sovereignty across borders, clinics, and work sites.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-xs text-left">
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

            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-xs text-left">
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

          {/* Quick Demo Access Bar on Desktop */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              One-Click Demo Switcher:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDemoWorker?.('MIG-2024-8841')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
              >
                Demo Worker (Ramesh)
              </button>
              <button
                type="button"
                onClick={() => onDemoDoctor?.()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                Demo Doctor (Dr. Roy)
              </button>
              <button
                type="button"
                onClick={() => onDemoEmployer?.()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
              >
                Demo Gate Terminal
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Choice Cards */}
        <div className="col-span-6 w-full max-w-md mx-auto">
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
          </div>
        </div>
      </div>
    </div>
  );
};


