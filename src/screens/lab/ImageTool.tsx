import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { IMG_STYLES } from '@/data/content';

export const ImageTool: React.FC = () => {
  const { lang, addXp, earnBadge, showToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cartoon');
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | null>(null);

  const gen = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true); setImg(null);
    try {
      const { data } = await supabase.functions.invoke('kids-ai-chat', { body: { mode: 'image', prompt, style, lang } });
      if (data?.image) {
        setImg(data.image);
        addXp(15, 8); earnBadge('ai_artist');
        showToast(lang === 'ar' ? 'شارة فنان الذكاء! +15 XP' : 'AI Artist badge! +15 XP', '🎨');
      } else {
        showToast(lang === 'ar' ? 'حاول بوصف آخر!' : 'Try another description!', '🤔');
      }
    } catch { showToast(lang === 'ar' ? 'حاول مرة أخرى!' : 'Try again!', '🤔'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-lg">
      <p className="text-sm font-bold text-slate-600">{lang === 'ar' ? 'صف ما تريد رسمه:' : 'Describe what to draw:'}</p>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2} placeholder={lang === 'ar' ? 'قطة فضائية تطير بين النجوم...' : 'A space cat flying among stars...'} className="w-full resize-none rounded-2xl bg-slate-100 p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-fuchsia-400" />
      <div className="grid grid-cols-3 gap-2">
        {IMG_STYLES.map(s => (
          <button key={s.id} onClick={() => setStyle(s.id)} className={`rounded-2xl py-2 text-xs font-bold transition-all ${style === s.id ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow' : 'bg-slate-100 text-slate-500'}`}>
            <span className="text-lg">{s.emoji}</span><br />{s.label[lang]}
          </button>
        ))}
      </div>
      <button onClick={gen} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 py-3 font-black text-white shadow-lg active:scale-95 disabled:opacity-60">
        {loading ? <><Sparkles className="animate-spin" size={18} /> {lang === 'ar' ? 'ذكاؤبيا يرسم...' : 'Zaka2obia is drawing...'}</> : <><Wand2 size={18} /> {lang === 'ar' ? 'أنشئ الصورة' : 'Generate Image'}</>}
      </button>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-fuchsia-100">
        {img ? <img src={img} alt="generated" className="h-full w-full object-cover" /> : <p className="px-6 text-center text-sm font-bold text-indigo-300">{lang === 'ar' ? 'ستظهر صورتك السحرية هنا!' : 'Your magic image appears here!'}</p>}
      </div>
    </div>
  );
};

export default ImageTool;
