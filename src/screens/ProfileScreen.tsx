import React, { useState } from 'react';
import { Shield, Clock, BookCheck, TrendingUp, Mail, Lock, ArrowLeft, Check, LogIn, LogOut, Cloud, CloudOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UI, CATEGORIES, BADGES } from '@/data/content';
import Zaka2obia from '@/components/Zaka2obia';
import AuthModal from '@/components/AuthModal';

export const ProfileScreen: React.FC = () => {
  const { lang, childName, setChildName, xp, coins, streak, completed, earnedBadges, levelInfo, user, signOut } = useApp();
  const { current } = levelInfo();
  const [parent, setParent] = useState(false);
  const [gate, setGate] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);
  const [limit, setLimit] = useState(60);
  const [filter, setFilter] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const totalLessons = CATEGORIES.reduce((a, c) => a + c.lessons.length, 0);

  const subscribe = async () => {
    if (!email.includes('@')) return;
    try {
      await fetch('https://famous.ai/api/crm/6a1cb2fbde81a3610fd00d6d/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'parent-dashboard', tags: ['parent', 'weekly-report'] }),
      });
    } catch {}
    setSubbed(true);
  };

  if (parent && !unlocked) {
    // simple parent gate (math) 
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pb-4 text-center">
        <Zaka2obia size={80} bubble={lang === 'ar' ? 'للكبار فقط!' : 'Grown-ups only!'} />
        <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-xl">
          <Lock className="mx-auto text-indigo-500" size={28} />
          <p className="mt-2 text-sm font-bold text-slate-600">{lang === 'ar' ? 'حل المسألة للدخول: 7 × 8 = ؟' : 'Solve to enter: 7 × 8 = ?'}</p>
          <input value={gate} onChange={e => setGate(e.target.value)} className="mt-3 w-full rounded-2xl bg-slate-100 p-3 text-center text-lg font-black outline-none focus:ring-2 focus:ring-indigo-400" />
          <button onClick={() => { if (gate.trim() === '56') setUnlocked(true); }} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-black text-white">{lang === 'ar' ? 'دخول' : 'Enter'}</button>
          <button onClick={() => setParent(false)} className="mt-2 text-xs font-bold text-slate-400">{UI.backToKid[lang]}</button>
        </div>
      </div>
    );
  }

  if (parent && unlocked) {
    const stats = [
      { icon: Clock, label: { ar: 'وقت التعلّم', en: 'Learn time' }, val: (completed.length * 5) + ' min', c: 'from-sky-400 to-blue-500' },
      { icon: BookCheck, label: { ar: 'دروس مكتملة', en: 'Lessons done' }, val: `${completed.length}/${totalLessons}`, c: 'from-emerald-400 to-green-500' },
      { icon: TrendingUp, label: { ar: 'نقاط الخبرة', en: 'Total XP' }, val: xp, c: 'from-fuchsia-400 to-purple-500' },
      { icon: Shield, label: { ar: 'الشارات', en: 'Badges' }, val: `${earnedBadges.length}/${BADGES.length}`, c: 'from-amber-400 to-orange-500' },
    ];
    return (
      <div className="space-y-4 pb-4">
        <button onClick={() => { setParent(false); setUnlocked(false); setGate(''); }} className="flex items-center gap-1 text-sm font-bold text-white"><ArrowLeft size={16} className={lang === 'ar' ? 'scale-x-[-1]' : ''} /> {UI.backToKid[lang]}</button>
        <h2 className="text-xl font-black text-white">{UI.parentZone[lang]}</h2>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => { const Icon = s.icon; return (
            <div key={i} className="rounded-3xl bg-white p-4 shadow-lg">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.c} text-white`}><Icon size={18} /></div>
              <p className="text-2xl font-black text-slate-800">{s.val}</p>
              <p className="text-[11px] font-bold text-slate-400">{s.label[lang]}</p>
            </div>
          ); })}
        </div>

        {/* per category progress */}
        <div className="rounded-3xl bg-white p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-black text-slate-700">{lang === 'ar' ? 'التقدّم في الدورات' : 'Course Progress'}</h3>
          <div className="space-y-2.5">
            {CATEGORIES.map(c => { const d = c.lessons.filter(l => completed.includes(l.id)).length; const p = (d / c.lessons.length) * 100; return (
              <div key={c.id}>
                <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{c.title[lang]}</span><span>{d}/{c.lessons.length}</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${p}%` }} /></div>
              </div>
            ); })}
          </div>
        </div>

        {/* screen time */}
        <div className="rounded-3xl bg-white p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-black text-slate-700">{lang === 'ar' ? 'إعدادات الأمان' : 'Safety Settings'}</h3>
          <div className="mb-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{lang === 'ar' ? 'حد وقت الشاشة اليومي' : 'Daily screen limit'}</span><span>{limit} min</span></div>
            <input type="range" min={15} max={180} step={15} value={limit} onChange={e => setLimit(+e.target.value)} className="mt-2 w-full accent-indigo-500" />
          </div>
          <button onClick={() => setFilter(f => !f)} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3">
            <span className="text-sm font-bold text-slate-600">{lang === 'ar' ? 'فلتر المحتوى الآمن' : 'Safe content filter'}</span>
            <span className={`relative h-6 w-11 rounded-full transition-all ${filter ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${filter ? 'left-5' : 'left-0.5'}`} /></span>
          </button>
        </div>

        {/* weekly report signup */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-lg">
          <h3 className="flex items-center gap-2 text-sm font-black"><Mail size={16} /> {lang === 'ar' ? 'تقرير أسبوعي بالبريد' : 'Weekly email report'}</h3>
          {subbed ? <p className="mt-2 flex items-center gap-1 text-sm font-bold"><Check size={16} /> {lang === 'ar' ? 'تم الاشتراك! سنرسل لك التقارير.' : "Subscribed! We'll send reports."}</p> : (
            <div className="mt-2 flex gap-2">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="parent@email.com" className="flex-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none" />
              <button onClick={subscribe} className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-indigo-900">{lang === 'ar' ? 'اشترك' : 'Join'}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="rounded-3xl bg-white p-5 text-center shadow-lg">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${current.color} text-4xl shadow-lg`}>{current.emoji}</div>
        <input value={childName} onChange={e => setChildName(e.target.value)} className="mt-3 w-full rounded-xl bg-slate-50 text-center text-xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-300" />
        <p className="text-sm font-bold text-indigo-500">{UI.level[lang]} {current.lvl} · {current.name[lang]}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[[xp, 'XP'], [coins, lang === 'ar' ? 'عملة' : 'Coins'], [streak, lang === 'ar' ? 'يوم' : 'Days']].map((s, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 p-2"><p className="text-lg font-black text-slate-800">{s[0]}</p><p className="text-[10px] font-bold text-slate-400">{s[1]}</p></div>
          ))}
        </div>
      </div>

      {/* cloud account card */}
      {user ? (
        <div className="rounded-3xl bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white"><Cloud size={20} /></span>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-800">{lang === 'ar' ? 'متصل بالسحابة' : 'Synced to cloud'}</p>
              <p className="truncate text-[11px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <button onClick={signOut} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-2.5 text-sm font-bold text-slate-500 active:scale-95">
            <LogOut size={16} /> {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
          </button>
        </div>
      ) : (
        <button onClick={() => setShowAuth(true)} className="flex w-full items-center gap-3 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-start text-white shadow-lg active:scale-[0.98]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25"><CloudOff size={22} /></span>
          <div className="flex-1">
            <p className="text-sm font-black">{lang === 'ar' ? 'سجّل الدخول لحفظ تقدّمك' : 'Sign in to save progress'}</p>
            <p className="text-[11px] text-white/85">{lang === 'ar' ? 'زامن نقاطك وشاراتك عبر الأجهزة' : 'Sync XP & badges across devices'}</p>
          </div>
          <LogIn size={20} />
        </button>
      )}

      <button onClick={() => setParent(true)} className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-start shadow-lg active:scale-[0.98]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white"><Shield size={22} /></span>
        <div className="flex-1"><p className="text-sm font-black text-slate-800">{UI.parentZone[lang]}</p><p className="text-[11px] text-slate-400">{lang === 'ar' ? 'تتبّع التقدّم والوقت' : 'Track progress & time'}</p></div>
        <Lock size={18} className="text-slate-300" />
      </button>

      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4">
        <Zaka2obia size={64} bubble={lang === 'ar' ? 'استمر في التعلّم كل يوم!' : 'Keep learning every day!'} />
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default ProfileScreen;
