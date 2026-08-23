import { useState, useEffect, FC } from 'react';
import { X, Camera } from 'lucide-react';
import { getWorkers, subscribeToStorage } from '../../services';
import { WorkerUser } from '../../types';

interface ScannerModalProps {
  onScan: (healthId: string) => void;
  onClose: () => void;
}

export const ScannerModal: FC<ScannerModalProps> = ({ onScan, onClose }) => {
  const [workers, setWorkers] = useState<WorkerUser[]>([]);

  useEffect(() => {
    const load = () => {
      setWorkers(getWorkers());
    };
    load();
    const unsub = subscribeToStorage(load);
    return () => unsub();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm">Scan Health ID QR Code</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          {/* Viewfinder simulation */}
          <div className="relative w-56 h-56 mx-auto bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500/40 flex items-center justify-center">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Corner Target Markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

            {/* Scanning line animation */}
            <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />

            <div className="absolute bottom-3 text-[10px] font-mono-code text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded">
              scanning thr qr please wait...
            </div>
          </div>

          {workers.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Or Select Patient From Active Registry to Simulate Scan:
              </span>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {workers.slice(0, 5).map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => onScan(patient.health_id)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{patient.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono-code">{patient.health_id}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">Simulate Scan →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
