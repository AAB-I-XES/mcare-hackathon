import React from 'react';
import { X, ShieldCheck, QrCode, CheckCircle2, Droplet, Heart, AlertTriangle } from 'lucide-react';
import { WorkerUser } from '../../types';
import { Badge } from '../common/Badge';

interface DigitalPassportModalProps {
  worker: WorkerUser;
  onClose: () => void;
}

export const DigitalPassportModal: React.FC<DigitalPassportModalProps> = ({
  worker,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Passport Gradient Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Digital Health Passport</h3>
              <p className="text-[11px] text-slate-400">Universal Clinical Pass Protocol</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <img src={worker.photo_url} alt={worker.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1">
              <Badge variant="emerald">{worker.status}</Badge>
              <h4 className="text-lg font-bold text-slate-900">{worker.name}</h4>
              <p className="font-mono-code font-bold text-xs text-sky-700">{worker.health_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Date of Birth</span>
              <p className="font-semibold text-slate-800">{worker.dob}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gender</span>
              <p className="font-semibold text-slate-800">{worker.gender}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Blood Type</span>
              <p className="font-semibold text-slate-800">{worker.blood_group}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Vaccine Status</span>
              <p className="font-semibold text-emerald-700">Verified ({worker.vaccine_count} Doses)</p>
            </div>
          </div>

          {worker.allergies && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <div className="flex items-center gap-1 font-bold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Drug Allergies:</span>
              </div>
              <p>{worker.allergies}</p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 text-center">
            Cryptographically signed &amp; verified by National Health Registry
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="btn-minimal-primary text-xs py-1.5 px-4 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
