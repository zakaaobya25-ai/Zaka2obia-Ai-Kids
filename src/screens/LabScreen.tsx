import React, { useState } from 'react';
import { MessageCircle, Image as ImageIcon, Puzzle, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CHALLENGES } from '@/data/content';
import Zaka2obia from '@/components/Zaka2obia';
import ChatTool from '@/screens/lab/ChatTool';
import ImageTool from '@/screens/lab/ImageTool';
import PromptGame from '@/screens/lab/PromptGame';

export const LabScreen: React.FC = () => {
  const { lang, addXp, showToast, earnBadge } = useApp();
  const [tool, setTool] = useState('chat');
  const [doneChallenges, setDone] = useState<string[]>([]);

  const tools = [
    { id: 'chat', icon: MessageCircle, label: { ar: 'محادثة ذكاؤبيا', en: 'Zaka2obia Chat' }, c: 'from-indigo-500 to-purple-600' },
    { id: 'image', icon: ImageIcon, label: { ar: 'رسم بالذكاء', en: 'AI Drawing' }, c: 'from-fuchsia-500 to-pink-600' },
    { id: 'prompt', icon: Puzzle, label: { ar: 'لعبة الأوامر', en: 'Prompt Game' }, c: 'from-teal-500 to-cyan-600' },
    { id: 'challenge', icon: Target, label: { ar: 'التحديات', en: 'Challenges' }, c: 'from-orange-500 to-red-600' },
  ];

  const doChallenge = (id: string, xp: number, coins: number) => {
    if (doneChallenges.includes(id)) return;
    setDone(d => [...d, id]);
    addXp(xp, coins); earnBadge('challenger');
    showToast((lang === 'ar' ? 'تحدٍّ مكتمل! +' : 'Challenge done! +') + xp + ' XP', '🎯');
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <Zaka2obia size={56} float={false} />
        <div>
          <h2 className="text-xl font-black text-white">{lang === 'ar' ? 'مختبر التجارب' : 'Practice Lab'}</h2>
          <p className="text-xs text-white/70">{lang === 'ar' ? 'جرّب الذكاء الاصطناعي بأمان' : 'Try AI safely'}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tools.map(tl => {
          const Icon = tl.icon; const a = tool === tl.id;
          return (
            <button key={tl.id} onClick={() => setTool(tl.id)} className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition-all ${a ? 'bg-white shadow-lg' : 'bg-white/15'}`}>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${tl.c} text-white`}><Icon size={18} /></span>
              <span className={`text-center text-[9px] font-bold leading-tight ${a ? 'text-slate-700' : 'text-white'}`}>{tl.label[lang]}</span>
            </button>
          );
        })}
      </div>

      {tool === 'chat' && <ChatTool />}
      {tool === 'image' && <ImageTool />}
      {tool === 'prompt' && <PromptGame />}
      {tool === 'challenge' && (
        <div className="space-y-3">
          {CHALLENGES.map(ch => {
            const dn = doneChallenges.includes(ch.id);
            return (
              <div key={ch.id} className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-2xl">{ch.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">{ch.title[lang]}</p>
                  <p className="text-[11px] text-slate-400">{ch.desc[lang]}</p>
                  <p className="text-[11px] font-bold text-amber-500">+{ch.xp} XP · +{ch.coins} 🪙</p>
                </div>
                <button onClick={() => doChallenge(ch.id, ch.xp, ch.coins)} disabled={dn} className={`rounded-2xl px-4 py-2 text-xs font-black text-white ${dn ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-600 active:scale-95'}`}>
                  {dn ? (lang === 'ar' ? 'تم ✓' : 'Done ✓') : (lang === 'ar' ? 'ابدأ' : 'Start')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LabScreen;
