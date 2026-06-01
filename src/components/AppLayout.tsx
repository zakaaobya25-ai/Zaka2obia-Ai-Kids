import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/screens/HomeScreen';
import AcademyScreen from '@/screens/AcademyScreen';
import LabScreen from '@/screens/LabScreen';
import AchievementsScreen from '@/screens/AchievementsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { UI } from '@/data/content';

const Toast: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 animate-pop">
      <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-2xl ring-2 ring-yellow-300">
        <span className="text-2xl">{toast.icon}</span>
        <span className="text-sm font-black text-indigo-700">{toast.msg}</span>
      </div>
    </div>
  );
};

const Shell: React.FC = () => {
  const { lang } = useApp();
  const [tab, setTab] = useState('home');
  const [pending, setPending] = useState<{ catId: string; lessonId: string } | null>(null);

  const openLesson = (catId: string, lessonId: string) => { setPending({ catId, lessonId }); setTab('learn'); };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-600 via-purple-600 to-fuchsia-700">
      <style>{`
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .animate-bounce-slow{ animation: floaty 3s ease-in-out infinite; }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .animate-pop{ animation: pop .4s ease-out; }
      `}</style>
      <Toast />
      <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-6">
        {/* brand header */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-base font-black text-white">{UI.appName[lang]}</span>
          <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] font-black text-indigo-900">AI</span>
        </div>

        {tab === 'home' && <HomeScreen go={setTab} openLesson={openLesson} />}
        {tab === 'learn' && <AcademyScreen initial={pending} clearInitial={() => setPending(null)} />}
        {tab === 'lab' && <LabScreen />}
        {tab === 'badges' && <AchievementsScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
};

const AppLayout: React.FC = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
);

export default AppLayout;
