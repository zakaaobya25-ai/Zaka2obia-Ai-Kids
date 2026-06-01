import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BADGES, LEVELS } from '@/data/content';
import Zaka2obia from '@/components/Zaka2obia';

export const AchievementsScreen: React.FC = () => {
  const { lang, earnedBadges, levelInfo, xp } = useApp();
  const { current } = levelInfo();

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <Zaka2obia size={56} float={false} bubble={lang === 'ar' ? 'أحسنت!' : 'Great job!'} />
      </div>

      {/* level ladder */}
      <div className="rounded-3xl bg-white p-4 shadow-lg">
        <h3 className="mb-3 text-sm font-black text-slate-700">{lang === 'ar' ? 'سلّم المستويات' : 'Level Ladder'}</h3>
        <div className="flex justify-between">
          {LEVELS.map(l => {
            const reached = xp >= l.xp;
            return (
              <div key={l.lvl} className="flex flex-col items-center gap-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all ${reached ? l.color + ' shadow-lg' : 'bg-slate-100 opacity-50'} ${current.lvl === l.lvl ? 'ring-4 ring-yellow-300' : ''}`}>
                  {reached ? l.emoji : <Lock size={16} className="text-slate-400" />}
                </div>
                <span className={`text-[8px] font-bold ${reached ? 'text-slate-600' : 'text-slate-300'}`}>{l.name[lang]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* badges */}
      <div>
        <h3 className="mb-2 px-1 text-sm font-black text-white">{lang === 'ar' ? 'الشارات' : 'Badges'} ({earnedBadges.length}/{BADGES.length})</h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(b => {
            const got = earnedBadges.includes(b.id);
            return (
              <div key={b.id} className={`rounded-2xl p-3 text-center shadow-lg transition-all ${got ? 'bg-white' : 'bg-white/10'}`}>
                <div className={`mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-2xl text-3xl ${got ? 'bg-gradient-to-br from-yellow-300 to-amber-400' : 'bg-white/10 grayscale'}`}>
                  {got ? b.icon : <Lock size={18} className="text-white/40" />}
                </div>
                <p className={`text-[10px] font-black leading-tight ${got ? 'text-slate-700' : 'text-white/50'}`}>{b.name[lang]}</p>
                <p className={`mt-0.5 text-[8px] leading-tight ${got ? 'text-slate-400' : 'text-white/30'}`}>{b.desc[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsScreen;
