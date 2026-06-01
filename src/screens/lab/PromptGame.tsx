import React, { useState } from 'react';
import { Star, Send, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { PROMPT_BLOCKS } from '@/data/content';

export const PromptGame: React.FC = () => {
  const { lang, addXp, earnBadge, showToast } = useApp();
  const blocks = PROMPT_BLOCKS[lang];
  const [chosen, setChosen] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stars: number; feedback: string; improved: string } | null>(null);

  const add = (w: string) => setChosen(c => [...c, w]);
  const reset = () => { setChosen([]); setResult(null); };

  const submit = async () => {
    if (!chosen.length || loading) return;
    setLoading(true); setResult(null);
    const prompt = chosen.join(' ');
    try {
      const { data } = await supabase.functions.invoke('kids-ai-chat', { body: { mode: 'score', prompt, lang } });
      const stars = Math.min(5, Math.max(1, data?.stars || 3));
      setResult({ stars, feedback: data?.feedback || '', improved: data?.improved || prompt });
      addXp(stars * 4, stars * 2);
      earnBadge('first_prompt');
      if (stars >= 5) { earnBadge('prompt_master'); showToast(lang === 'ar' ? 'سيد الأوامر! ⭐⭐⭐⭐⭐' : 'Prompt Master!', '🏆'); }
      else showToast((lang === 'ar' ? '+' : '+') + (stars * 4) + ' XP', '⭐');
    } catch { showToast(lang === 'ar' ? 'حاول مرة أخرى!' : 'Try again!', '🤔'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-lg">
      <p className="text-sm font-bold text-slate-600">{lang === 'ar' ? 'اضغط على الكلمات لبناء أمر رائع:' : 'Tap words to build a great prompt:'}</p>
      <div className="flex flex-wrap gap-2">
        {blocks.map((w, i) => (
          <button key={i} onClick={() => add(w)} className="rounded-xl bg-teal-100 px-3 py-1.5 text-sm font-bold text-teal-700 active:scale-90">{w}</button>
        ))}
      </div>
      <div className="min-h-[56px] rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50 p-3 text-sm font-bold text-teal-800">
        {chosen.length ? chosen.join(' ') : <span className="text-teal-300">{lang === 'ar' ? 'أمرك سيظهر هنا...' : 'Your prompt appears here...'}</span>}
      </div>
      <div className="flex gap-2">
        <button onClick={reset} className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500"><RotateCcw size={16} /></button>
        <button onClick={submit} disabled={loading || !chosen.length} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3 font-black text-white shadow-lg active:scale-95 disabled:opacity-50">
          <Send size={16} /> {loading ? (lang === 'ar' ? 'تقييم...' : 'Scoring...') : (lang === 'ar' ? 'قيّم أمري' : 'Score My Prompt')}
        </button>
      </div>
      {result && (
        <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-3">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={26} className={s <= result.stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />)}
          </div>
          <p className="mt-2 text-center text-sm font-bold text-slate-700">{result.feedback}</p>
          <p className="mt-2 rounded-xl bg-white p-2 text-xs text-slate-500"><b className="text-teal-600">{lang === 'ar' ? 'نصيحة ذكاؤبيا: ' : "Zaka2obia's tip: "}</b>{result.improved}</p>
        </div>
      )}
    </div>
  );
};

export default PromptGame;
