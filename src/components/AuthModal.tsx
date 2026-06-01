import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Baby, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import Zaka2obia from '@/components/Zaka2obia';

interface Props { onClose: () => void; }

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { lang } = useApp();
  const [mode, setMode] = useState<'in' | 'up'>('up');
  const [accountType, setAccountType] = useState<'child' | 'parent'>('child');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const tt = (a: string, e: string) => (lang === 'ar' ? a : e);

  const submit = async () => {
    setErr('');
    if (!email.includes('@') || pass.length < 6) {
      setErr(tt('أدخل بريدًا صحيحًا وكلمة مرور (6 أحرف+)', 'Enter a valid email & password (6+ chars)'));
      return;
    }
    setBusy(true);
    try {
      if (mode === 'up') {
        const { error } = await supabase.auth.signUp({
          email, password: pass,
          options: { data: { child_name: name || (accountType === 'parent' ? 'Parent' : 'صديقي'), account_type: accountType } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      }
      onClose();
    } catch (e: any) {
      setErr(e?.message || tt('حدث خطأ، حاول مجددًا', 'Something went wrong'));
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-center">
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-black/30 p-1.5 text-white"><X size={18} /></button>
          <div className="flex justify-center"><Zaka2obia size={70} bubble={mode === 'up' ? tt('أهلاً بك!', 'Welcome!') : tt('عودًا حميدًا!', 'Welcome back!')} /></div>
        </div>

        <div className="p-5">
          {/* tabs */}
          <div className="mb-4 flex rounded-2xl bg-slate-100 p-1">
            <button onClick={() => setMode('up')} className={`flex-1 rounded-xl py-2 text-sm font-black ${mode === 'up' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>{tt('حساب جديد', 'Sign Up')}</button>
            <button onClick={() => setMode('in')} className={`flex-1 rounded-xl py-2 text-sm font-black ${mode === 'in' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>{tt('تسجيل الدخول', 'Sign In')}</button>
          </div>

          {mode === 'up' && (
            <>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <button onClick={() => setAccountType('child')} className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-bold ${accountType === 'child' ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow' : 'bg-slate-100 text-slate-500'}`}><Baby size={16} /> {tt('طفل', 'Child')}</button>
                <button onClick={() => setAccountType('parent')} className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-bold ${accountType === 'parent' ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow' : 'bg-slate-100 text-slate-500'}`}><Users size={16} /> {tt('ولي أمر', 'Parent')}</button>
              </div>
              <Field icon={UserIcon} value={name} set={setName} placeholder={tt('الاسم', 'Name')} />
            </>
          )}
          <Field icon={Mail} value={email} set={setEmail} placeholder={tt('البريد الإلكتروني', 'Email')} type="email" />
          <Field icon={Lock} value={pass} set={setPass} placeholder={tt('كلمة المرور', 'Password')} type="password" />

          {err && <p className="mb-2 text-center text-xs font-bold text-red-500">{err}</p>}

          <button onClick={submit} disabled={busy} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-black text-white shadow-lg active:scale-95 disabled:opacity-60">
            {busy ? tt('جارٍ...', 'Please wait...') : mode === 'up' ? tt('إنشاء الحساب', 'Create Account') : tt('دخول', 'Sign In')}
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-400">{tt('يتم حفظ تقدّمك في السحابة عبر كل الأجهزة.', 'Your progress syncs to the cloud across devices.')}</p>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ icon: any; value: string; set: (v: string) => void; placeholder: string; type?: string }> = ({ icon: Icon, value, set, placeholder, type = 'text' }) => (
  <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-100 px-3">
    <Icon size={18} className="text-slate-400" />
    <input value={value} onChange={e => set(e.target.value)} type={type} placeholder={placeholder} className="w-full bg-transparent py-3 text-sm font-medium outline-none" />
  </div>
);

export default AuthModal;
