import React from 'react';
import { Flame, Coins, Star, Play, BookOpen, FlaskConical, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UI, CATEGORIES, IMAGES } from '@/data/content';
import Zaka2obia from '@/components/Zaka2obia';

interface Props { go: (t: string) => void; openLesson: (catId: string, lessonId: string) => void; }

export const HomeScreen: React.FC<Props> = ({ go, openLesson }) => {
  const { lang, toggleLang, xp, coins, streak, childName, completed, levelInfo } = useApp();
  const { current, next, progress } = levelInfo();
  const hour = new Date().getHours();
  const greet = lang === 'ar'
    ? (hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء النور')
    : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

  // find next incomplete lesson
  let cont: { cat: typeof CATEGORIES[0]; lesson: typeof CATEGORIES[0]['lessons'][0] } | null = null;
  for (const c of CATEGORIES) {
    const l = c.lessons.find(ls => !completed.includes(ls.id));
    if (l) { cont = { cat: c, lesson: l }; break; }
  }

  return (
    <div className="space-y-5 pb-4">
      {/* top bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-semibold text-white/80">{greet} 👋</p>
          <h1 className="text-2xl font-black text-white">{childName}</h1>
        </div>
        <button onClick={toggleLang} className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
          <Globe size={16} /> {lang === 'ar' ? 'EN' : 'ع'}
        </button>
      </div>

      {/* level card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/15 p-4 backdrop-blur-md ring-1 ring-white/20">
        <div className="flex items-center gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${current.color} text-3xl shadow-lg`}>{current.emoji}</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-white/80">{UI.level[lang]} {current.lvl} · {current.name[lang]}</p>
            <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-black/20">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-white/70">
              {next ? `${xp} / ${next.xp} XP → ${next.name[lang]}` : `${xp} XP · MAX`}
            </p>
          </div>
        </div>
      </div>

      {/* stat chips */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Flame, val: streak, label: UI.streak[lang], c: 'from-orange-400 to-red-500' },
          { icon: Coins, val: coins, label: UI.coins[lang], c: 'from-yellow-400 to-amber-500' },
          { icon: Star, val: completed.length, label: UI.lessonsDone[lang], c: 'from-sky-400 to-blue-500' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl bg-white p-3 text-center shadow-lg">
              <div className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.c} text-white`}><Icon size={18} /></div>
              <p className="text-lg font-black text-slate-800">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Zaka2obia greeting */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 shadow-xl">
        <Zaka2obia size={70} bubble={lang === 'ar' ? `أهلاً ${childName}! جاهز لمغامرة جديدة؟` : `Hi ${childName}! Ready for an adventure?`} />
      </div>

      {/* continue learning */}
      {cont && (
        <button onClick={() => openLesson(cont!.cat.id, cont!.lesson.id)} className="flex w-full items-center gap-3 rounded-3xl bg-white p-3 text-start shadow-lg active:scale-[0.98]">
          <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${cont.cat.color}`}>
            <img src={cont.cat.img} alt="" className="h-full w-full object-cover opacity-90" />
            <span className="absolute inset-0 flex items-center justify-center"><Play className="text-white drop-shadow" fill="white" size={26} /></span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-indigo-400">{UI.continueLearning[lang]}</p>
            <p className="text-sm font-black text-slate-800">{cont.lesson.title[lang]}</p>
            <p className="text-[11px] text-slate-400">{cont.cat.title[lang]} · {cont.lesson.mins} min</p>
          </div>
        </button>
      )}

      {/* main buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => go('learn')} className="rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-start text-white shadow-xl active:scale-95">
          <BookOpen size={30} />
          <p className="mt-2 text-base font-black">{UI.startLearning[lang]}</p>
          <p className="text-xs text-white/80">{lang === 'ar' ? 'دروس فيديو ممتعة' : 'Fun video lessons'}</p>
        </button>
        <button onClick={() => go('lab')} className="rounded-3xl bg-gradient-to-br from-fuchsia-500 to-purple-700 p-4 text-start text-white shadow-xl active:scale-95">
          <FlaskConical size={30} />
          <p className="mt-2 text-base font-black">{UI.practiceLab[lang]}</p>
          <p className="text-xs text-white/80">{lang === 'ar' ? 'جرّب الذكاء الاصطناعي' : 'Try AI tools'}</p>
        </button>
      </div>

      {/* hero strip */}
      <div className="overflow-hidden rounded-3xl shadow-xl">
        <img src={IMAGES.hero} alt="hero" className="h-32 w-full object-cover" />
      </div>
    </div>
  );
};

export default HomeScreen;
