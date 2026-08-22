import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
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
    <div className="minimal-card p-5 sm:p-6 shadow-xs border-slate-200 bg-white relative overflow-hidden">
      {/* Top subtle identification bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-900 tracking-wider uppercase">
            Active Digital Health Pass
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Patient-Consent Protected</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* QR Code & Scan Trigger */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs relative group">
            {/* Generate SVG QR Code visually matching user ID */}
            <svg
              className="w-32 h-32 sm:w-36 sm:h-36"
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
          </div>
          <span className="text-[11px] font-medium text-slate-500">Scan at any verified clinic</span>
        </div>

        {/* Worker ID details */}
        <div className="flex-1 text-center sm:text-left space-y-3.5 w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{worker.name}</h2>
            <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {worker.status}
            </Badge>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Universal Health ID
            </span>
            <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono-code font-bold text-sm text-slate-900 tracking-wider">
                {worker.health_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-400 hover:text-slate-900 transition cursor-pointer p-0.5"
                title="Copy Health ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">DOB</span>
              <span className="font-semibold text-slate-800">{worker.dob}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gender</span>
              <span className="font-semibold text-slate-800">{worker.gender}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Phone</span>
              <span className="font-semibold text-slate-800 font-mono-code text-[11px] truncate block">
                {worker.phone}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenPassportModal}
              className="btn-minimal-secondary text-xs py-2 px-3.5 cursor-pointer w-full sm:w-auto"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Inspect Full Certified Passport</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

