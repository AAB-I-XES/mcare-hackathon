import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, Lock, Sparkles, Smartphone } from 'lucide-react';
import { WorkerUser } from '../../types';
import { copyToClipboard } from '../../utils/helpers';
import { Badge } from '../common/Badge';

interface HealthIdCardProps {
  worker: WorkerUser;
  onOpenPassportModal: () => void;
}

export const HealthIdCard: React.FC<HealthIdCardProps> = ({
  worker,
  onOpenPassportModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    const success = await copyToClipboard(worker.health_id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="minimal-card p-4 sm:p-6 shadow-xs border-slate-200 bg-white relative overflow-hidden">
      {/* Top identification status bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 tracking-wider uppercase">
            Active Digital Health Pass
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span className="hidden xs:inline">Patient-Consent Protected</span>
          <span className="xs:hidden">Protected</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        {/* QR Code & High-Contrast Frame */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative group w-full max-w-[200px] sm:max-w-none flex flex-col items-center justify-center">
            {/* Generate SVG QR Code visually matching user ID */}
            <svg
              className="w-36 h-36 sm:w-36 sm:h-36 aspect-square"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Outer border markers */}
              <rect x="10" y="10" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="14" y="14" width="18" height="18" fill="white" rx="2" />
              <rect x="18" y="18" width="10" height="10" fill="#0f172a" rx="1" />

              <rect x="64" y="10" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="68" y="14" width="18" height="18" fill="white" rx="2" />
              <rect x="72" y="18" width="10" height="10" fill="#0f172a" rx="1" />

              <rect x="10" y="64" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="14" y="68" width="18" height="18" fill="white" rx="2" />
              <rect x="18" y="72" width="10" height="10" fill="#0f172a" rx="1" />

              {/* Data matrix dots */}
              <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="14" width="6" height="6" fill="#0f172a" />
              <rect x="42" y="24" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="30" width="6" height="6" fill="#0f172a" />

              <rect x="14" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="24" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="30" y="52" width="6" height="6" fill="#0f172a" />

              <rect x="44" y="44" width="12" height="12" fill="#0284c7" rx="2" />
              <rect x="64" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="76" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="84" y="52" width="6" height="6" fill="#0f172a" />

              <rect x="44" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="54" y="74" width="6" height="6" fill="#0f172a" />
              <rect x="64" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="74" y="74" width="6" height="6" fill="#0f172a" />
              <rect x="84" y="84" width="6" height="6" fill="#0f172a" />
            </svg>
            <div className="w-full flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
              <QrCode className="w-3 h-3 text-slate-400" />
              <span>Present at clinic</span>
            </div>
          </div>
        </div>

        {/* Worker ID details */}
        <div className="flex-1 text-center sm:text-left space-y-3.5 w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{worker.name}</h2>
            <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {worker.status}
            </Badge>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Universal Health ID
            </span>
            <div className="inline-flex items-center justify-between sm:justify-start gap-2 p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 w-full sm:w-auto">
              <span className="font-mono-code font-bold text-sm sm:text-base text-slate-900 tracking-wider">
                {worker.health_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-500 hover:text-slate-900 active:scale-95 transition cursor-pointer p-1.5 rounded-md hover:bg-slate-200/60"
                title="Copy Health ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block uppercase tracking-wider">DOB</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">{worker.dob}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gender</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">{worker.gender}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Phone</span>
              <span className="font-semibold text-slate-800 font-mono-code text-xs truncate block">
                {worker.phone}
              </span>
            </div>
          </div>

          <div className="pt-1.5 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onOpenPassportModal}
              className="btn-minimal-secondary text-xs py-2.5 px-4 cursor-pointer w-full sm:w-auto font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Inspect Full Certified Passport</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

