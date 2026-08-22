import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
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
    <div className="minimal-card p-5 sm:p-6 shadow-xs border-slate-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* QR Code & Scan Trigger */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs relative group">
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
            <div className="absolute inset-0 bg-sky-900/5 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold bg-white/95 px-2 py-0.5 rounded shadow-xs text-slate-800">
                Live QR
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Scan at any clinic</span>
        </div>

        {/* Worker ID details */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{worker.name}</h2>
            <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {worker.status}
            </Badge>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Portable Digital Health ID
            </span>
            <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-lg bg-slate-100 border border-slate-200">
              <span className="font-mono-code font-bold text-sm text-slate-900">
                {worker.health_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-500 hover:text-slate-900 transition cursor-pointer p-0.5"
                title="Copy Health ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">DOB</span>
              <span className="font-semibold text-slate-700">{worker.dob}</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Gender</span>
              <span className="font-semibold text-slate-700">{worker.gender}</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Phone</span>
              <span className="font-semibold text-slate-700 font-mono-code text-[11px] truncate block">
                {worker.phone}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPassportModal}
            className="btn-minimal-secondary text-xs py-1.5 px-3 cursor-pointer w-full sm:w-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Full Digital Passport</span>
          </button>
        </div>
      </div>
    </div>
  );
};
