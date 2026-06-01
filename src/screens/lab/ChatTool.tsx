import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { IMAGES } from '@/data/content';

interface Msg { role: 'user' | 'Zaka2obia'; text: string; }

export const ChatTool: React.FC = () => {
  const { lang, addXp, bumpQuestions, earnBadge, showToast } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'Zaka2obia', text: lang === 'ar' ? 'مرحبًا! أنا ذكاؤبيا. اسألني أي شيء عن الذكاء الاصطناعي!' : "Hi! I'm Zaka2obia. Ask me anything about AI!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput(''); setLoading(true);
    bumpQuestions(); earnBadge('first_prompt');
    try {
      const { data } = await supabase.functions.invoke('kids-ai-chat', { body: { mode: 'chat', message: text, lang } });
      setMsgs(m => [...m, { role: 'Zaka2obia', text: data?.reply || '...' }]);
      addXp(5, 2);
      if (/story|قصة/i.test(text)) { earnBadge('story_creator'); showToast(lang === 'ar' ? 'شارة كاتب القصص!' : 'Story Creator badge!', '📖'); }
    } catch {
      setMsgs(m => [...m, { role: 'Zaka2obia', text: lang === 'ar' ? 'حاول مرة أخرى!' : 'Try again!' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-[460px] flex-col rounded-3xl bg-white p-3 shadow-lg">
      <div className="flex-1 space-y-3 overflow-y-auto p-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'Zaka2obia' && <img src={IMAGES.Zaka2obia} className="h-8 w-8 shrink-0" alt="" />}
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm font-medium ${m.role === 'user' ? 'rounded-br-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'rounded-bl-none bg-slate-100 text-slate-700'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2"><img src={IMAGES.Zaka2obia} className="h-8 w-8" alt="" /><div className="rounded-2xl rounded-bl-none bg-slate-100 px-4 py-3"><span className="flex gap-1"><i className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" /><i className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '.15s' }} /><i className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '.3s' }} /></span></div></div>}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={lang === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-400" />
        <button onClick={send} disabled={loading} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg active:scale-90 disabled:opacity-50"><Send size={18} className={lang === 'ar' ? 'scale-x-[-1]' : ''} /></button>
      </div>
    </div>
  );
};

export default ChatTool;
