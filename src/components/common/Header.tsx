import { FC } from 'react';
import { ShieldCheck, LogOut, Stethoscope, Building2, User } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppUser } from '../../types';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  user?: AppUser | null;
  onLogout?: () => void;
}

export const Header: FC<HeaderProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  return (
    <header className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_1px_2px_0_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {!user ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-sky-400" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                MigrantCare
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                Health ID
              </span>
            </div>
          </div>
        ) : user.role === 'worker' ? (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
              <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                  {user.name}
                </span>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 shrink-0">
                  Pass
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono-code font-semibold block truncate">
                {user.health_id}
              </span>
            </div>
          </div>
        ) : user.role === 'provider' ? (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs border border-slate-800 shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                  {user.name}
                </span>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  EMR
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 truncate block">
                {user.facility || 'Clinic Station'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs border border-slate-800 shrink-0">
              <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                  {user.company || 'Worksite Safety'}
                </span>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  Gate
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 truncate block">Clearance Terminal</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <LanguageToggle />

        {user && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 transition cursor-pointer shadow-xs min-h-[38px] sm:min-h-[40px]"
            title="Switch Dashboard or Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Switch Portal</span>
          </button>
        )}
      </div>
    </header>
  );
};
