import React, { useState } from 'react';
import { Play, Check, ChevronRight, X, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, UI, Category, Lesson } from '@/data/content';
import Zaka2obia from '@/components/Zaka2obia';

interface Props { initial?: { catId: string; lessonId: string } | null; clearInitial: () => void; }

export const AcademyScreen: React.FC<Props> = ({ initial, clearInitial }) => {
  const { lang, completed, completeLesson, addXp, showToast, earnBadge } = useApp();
  const [openCat, setOpenCat] = useState<Category | null>(
    initial ? CATEGORIES.find(c => c.id === initial.catId) || null : null
  );
  const [player, setPlayer] = useState<{ cat: Category; lesson: Lesson } | null>(
    initial ? (() => { const c = CATEGORIES.find(x => x.id === initial.catId); const l = c?.lessons.find(x => x.id === initial.lessonId); return c && l ? { cat: c, lesson: l } : null; })() : null
  );
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (!player) return;
    setProgress(0);
    const iv = setInterval(() => setProgress(p => (p >= 100 ? 100 : p + 4)), 220);
    return () => clearInterval(iv);
  }, [player]);

  const finish = (cat: Category, lesson: Lesson) => {
    if (!completed.includes(lesson.id)) {
      completeLesson(lesson.id);
      addXp(10, 5);
      showToast((lang === 'ar' ? '+10 نقطة خبرة!' : '+10 XP!'), '⭐');
      const allDone = cat.lessons.every(l => l.id === lesson.id || completed.includes(l.id));
      if (allDone) { earnBadge('graduate'); }
    }
    setPlayer(null);
    clearInitial();
  };

  const catProgress = (c: Category) => c.lessons.filter(l => completed.includes(l.id)).length;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <Zaka2obia size={56} float={false} />
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'ar' ? 'أكاديمية الذكاء' : 'AI Academy'}</h2>
          <p className="text-xs text-white/70">{lang === 'ar' ? 'اختر فئة وابدأ التعلّم' : 'Pick a category & learn'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(cat => {
          const done = catProgress(cat);
          const pct = (done / cat.lessons.length) * 100;
          const isOpen = openCat?.id === cat.id;
          return (
            <div key={cat.id} className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <button onClick={() => setOpenCat(isOpen ? null : cat)} className="flex w-full items-center gap-3 p-3 text-start">
                <div className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${cat.color}`}>
                  <img src={cat.img} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">{cat.title[lang]}</p>
                  <p className="text-[11px] text-slate-400">{cat.desc[lang]}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${cat.color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{done}/{cat.lessons.length}</span>
                  </div>
                </div>
                <ChevronRight className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''} ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="space-y-1.5 border-t border-slate-100 bg-slate-50 p-2">
                  {cat.lessons.map((l, i) => {
                    const dn = completed.includes(l.id);
                    return (
                      <button key={l.id} onClick={() => setPlayer({ cat, lesson: l })} className="flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-start shadow-sm active:scale-[0.98]">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${dn ? 'bg-emerald-500' : 'bg-gradient-to-br ' + cat.color}`}>
                          {dn ? <Check size={18} /> : <Play size={16} fill="white" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700">{i + 1}. {l.title[lang]}</p>
                          <p className="text-[10px] text-slate-400">{l.mins} min{dn ? ' · ' + UI.completed[lang] : ''}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* video player modal */}
      {player && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl">
            <div className="relative aspect-video bg-gradient-to-br from-indigo-700 to-purple-800">
              <button onClick={() => { setPlayer(null); clearInitial(); }} className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white"><X size={18} /></button>
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Zaka2obia size={90} bubble={lang === 'ar' ? 'انتبه جيدًا!' : 'Watch closely!'} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                <div className="h-full bg-yellow-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold text-indigo-400">{player.cat.title[lang]}</p>
              <h3 className="text-lg font-black text-slate-800">{player.lesson.title[lang]}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {lang === 'ar' ? 'في هذا الدرس يشرح ذكاؤبياالمفهوم بطريقة ممتعة وسهلة مع أمثلة من حياتك اليومية.' : 'In this lesson Zaka2obia explains the concept in a fun, easy way with everyday examples.'}
              </p>
              <button
                onClick={() => finish(player.cat, player.lesson)}
                disabled={progress < 100}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-black text-white shadow-lg transition-all ${progress < 100 ? 'bg-slate-300' : 'bg-gradient-to-r from-emerald-500 to-green-600 active:scale-95'}`}
              >
                {progress < 100 ? <>{lang === 'ar' ? 'جارٍ المشاهدة...' : 'Watching...'} {progress}%</> : <><Award size={18} /> {UI.markDone[lang]} (+10 XP)</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyScreen;
