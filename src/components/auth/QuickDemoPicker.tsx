import React from 'react';
import { Badge } from '../common/Badge';

interface QuickDemoPickerProps {
  onSelectWorker: (healthId: string) => void;
  onSelectDoctor: () => void;
  onSelectEmployer: () => void;
}

export const QuickDemoPicker: React.FC<QuickDemoPickerProps> = ({
  onSelectWorker,
  onSelectDoctor,
  onSelectEmployer,
}) => {
  return (
    <div className="pt-3 border-t border-slate-100 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Quick Demo Access
        </span>
        <Badge variant="emerald" className="text-[10px]">
          Instant Test
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onSelectWorker('MC-5820-1943')}
          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition cursor-pointer"
        >
          <p className="font-semibold text-slate-800 text-[11px]">Tareq R.</p>
          <p className="font-mono-code text-[10px] text-slate-500">MC-5820-1943</p>
        </button>
        <button
          type="button"
          onClick={onSelectDoctor}
          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-left transition cursor-pointer"
        >
          <p className="font-semibold text-emerald-800 text-[11px]">Dr. Sarah Lim</p>
          <p className="text-[10px] text-emerald-600">Clinic Doctor</p>
        </button>
        <button
          type="button"
          onClick={onSelectEmployer}
          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-left transition cursor-pointer"
        >
          <p className="font-semibold text-amber-800 text-[11px]">Apex Infra</p>
          <p className="text-[10px] text-amber-600">Safety Pass</p>
        </button>
      </div>
    </div>
  );
};
