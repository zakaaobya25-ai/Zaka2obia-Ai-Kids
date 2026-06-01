import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { LEVELS, Lang } from '@/data/content';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AppState {
  lang: Lang;
  toggleLang: () => void;
  xp: number;
  coins: number;
  streak: number;
  childName: string;
  setChildName: (n: string) => void;
  completed: string[];
  earnedBadges: string[];
  questionsAsked: number;
  addXp: (amount: number, coins?: number) => void;
  completeLesson: (id: string) => void;
  earnBadge: (id: string) => void;
  bumpQuestions: () => void;
  levelInfo: () => { current: typeof LEVELS[0]; next: typeof LEVELS[0] | null; progress: number };
  toast: { msg: string; icon: string } | null;
  showToast: (msg: string, icon?: string) => void;
  // auth
  user: User | null;
  accountType: string;
  authReady: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);
export const useApp = () => useContext(Ctx)!;

const load = (k: string, d: any) => {
  try { const v = localStorage.getItem('zk_' + k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const save = (k: string, v: any) => { try { localStorage.setItem('zk_' + k, JSON.stringify(v)); } catch {} };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => load('lang', 'ar'));
  const [xp, setXp] = useState<number>(() => load('xp', 60));
  const [coins, setCoins] = useState<number>(() => load('coins', 30));
  const [streak, setStreak] = useState<number>(() => load('streak', 3));
  const [childName, setChildNameS] = useState<string>(() => load('name', 'أحمد'));
  const [completed, setCompleted] = useState<string[]>(() => load('completed', ['b1']));
  const [earnedBadges, setEarned] = useState<string[]>(() => load('badges', ['first_lesson']));
  const [questionsAsked, setQ] = useState<number>(() => load('q', 0));
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string>('child');
  const [authReady, setAuthReady] = useState(false);
  const hydrating = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { save('lang', lang); document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
  useEffect(() => save('xp', xp), [xp]);
  useEffect(() => save('coins', coins), [coins]);
  useEffect(() => save('streak', streak), [streak]);
  useEffect(() => save('name', childName), [childName]);
  useEffect(() => save('completed', completed), [completed]);
  useEffect(() => save('badges', earnedBadges), [earnedBadges]);
  useEffect(() => save('q', questionsAsked), [questionsAsked]);

  // hydrate progress from cloud profile
  const hydrateFromProfile = useCallback((p: any) => {
    if (!p) return;
    hydrating.current = true;
    setChildNameS(p.child_name ?? 'صديقي');
    setAccountType(p.account_type ?? 'child');
    setXp(p.xp ?? 0);
    setCoins(p.coins ?? 0);
    setCompleted(Array.isArray(p.completed) ? p.completed : []);
    setEarned(Array.isArray(p.earned_badges) ? p.earned_badges : []);
    setQ(p.questions_asked ?? 0);
    // daily streak logic
    const today = new Date().toISOString().slice(0, 10);
    const last = p.last_active;
    let s = p.streak ?? 1;
    if (last !== today) {
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s = last === y ? s + 1 : 1;
    }
    setStreak(s);
    setTimeout(() => { hydrating.current = false; }, 50);
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (data) hydrateFromProfile(data);
  }, [hydrateFromProfile]);

  // auth bootstrap
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id).finally(() => setAuthReady(true));
      else setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id);
      else { setAccountType('child'); }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // sync to cloud (debounced) whenever progress changes and logged in
  useEffect(() => {
    if (!user || hydrating.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      supabase.from('profiles').upsert({
        id: user.id,
        child_name: childName,
        account_type: accountType,
        xp, coins, streak,
        completed,
        earned_badges: earnedBadges,
        questions_asked: questionsAsked,
        last_active: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      });
    }, 700);
  }, [user, xp, coins, streak, childName, completed, earnedBadges, questionsAsked, accountType]);

  const showToast = useCallback((msg: string, icon = '🎉') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const earnBadge = useCallback((id: string) => {
    setEarned(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const addXp = useCallback((amount: number, c = 0) => {
    setXp(prev => {
      const oldLevel = LEVELS.filter(l => prev >= l.xp).length;
      const next = prev + amount;
      const newLevel = LEVELS.filter(l => next >= l.xp).length;
      if (newLevel > oldLevel) {
        setTimeout(() => showToast((lang === 'ar' ? 'مستوى جديد! ' : 'Level Up! ') + LEVELS[newLevel - 1].name[lang], LEVELS[newLevel - 1].emoji), 300);
        if (newLevel >= 2) earnBadge('explorer');
        if (newLevel >= 3) earnBadge('inventor');
      }
      return next;
    });
    if (c) setCoins(p => p + c);
  }, [lang, showToast, earnBadge]);

  const completeLesson = useCallback((id: string) => {
    setCompleted(prev => (prev.includes(id) ? prev : [...prev, id]));
    earnBadge('first_lesson');
  }, [earnBadge]);

  const bumpQuestions = useCallback(() => {
    setQ(prev => {
      const n = prev + 1;
      if (n >= 10) earnBadge('curious');
      return n;
    });
  }, [earnBadge]);

  const toggleLang = useCallback(() => setLang(l => (l === 'ar' ? 'en' : 'ar')), []);
  const setChildName = useCallback((n: string) => setChildNameS(n), []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const levelInfo = useCallback(() => {
    const idx = LEVELS.filter(l => xp >= l.xp).length - 1;
    const current = LEVELS[Math.max(0, idx)];
    const next = LEVELS[idx + 1] || null;
    const progress = next ? Math.min(100, ((xp - current.xp) / (next.xp - current.xp)) * 100) : 100;
    return { current, next, progress };
  }, [xp]);

  return (
    <Ctx.Provider value={{ lang, toggleLang, xp, coins, streak, childName, setChildName, completed, earnedBadges, questionsAsked, addXp, completeLesson, earnBadge, bumpQuestions, levelInfo, toast, showToast, user, accountType, authReady, signOut }}>
      {children}
    </Ctx.Provider>
  );
};
