import React from 'react';
import { Badge } from '../common/Badge';
import { Sparkles, ArrowUpRight } from 'lucide-react';

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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-400" />
          <span>Interactive Preview Profiles</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400">1-Click Test</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onSelectWorker('MC-5820-1943')}
          className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-left transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900 text-xs">Tareq Rahman</p>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-500">Migrant Worker</p>
          </div>
          <p className="font-mono-code text-[10px] text-sky-700 font-semibold mt-1">MC-5820-1943</p>
        </button>

        <button
          type="button"
          onClick={onSelectDoctor}
          className="p-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 text-left transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-emerald-950 text-xs">Dr. Sarah Lim</p>
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            </div>
            <p className="text-[10px] text-emerald-700">Clinic Physician</p>
          </div>
          <p className="font-mono-code text-[10px] text-emerald-700 font-semibold mt-1">MCR-2024-8192</p>
        </button>

        <button
          type="button"
          onClick={onSelectEmployer}
          className="p-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 text-left transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-amber-950 text-xs">Apex Infra Ltd</p>
              <ArrowUpRight className="w-3 h-3 text-amber-600" />
            </div>
            <p className="text-[10px] text-amber-700">Safety Clearance</p>
          </div>
          <p className="text-[10px] text-amber-700 font-semibold mt-1">Site Gate #04</p>
        </button>
      </div>
    </div>
  );
};

