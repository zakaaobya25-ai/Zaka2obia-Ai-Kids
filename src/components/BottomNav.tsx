import React from 'react';
import { Home, BookOpen, FlaskConical, Trophy, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UI } from '@/data/content';

interface Props { tab: string; setTab: (t: string) => void; }

const items = [
  { id: 'home', icon: Home, label: UI.home },
  { id: 'learn', icon: BookOpen, label: UI.learn },
  { id: 'lab', icon: FlaskConical, label: UI.lab },
  { id: 'badges', icon: Trophy, label: UI.badges },
  { id: 'profile', icon: User, label: UI.profile },
];

export const BottomNav: React.FC<Props> = ({ tab, setTab }) => {
  const { lang } = useApp();
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3 pb-3">
      <div className="flex items-center justify-around rounded-3xl bg-white/95 px-2 py-2 shadow-[0_-4px_30px_rgba(79,70,229,0.18)] backdrop-blur">
        {items.map(it => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-all ${active ? 'scale-105' : 'opacity-60'}`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${active ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-indigo-400'}`}>
                <Icon size={20} />
              </span>
              <span className={`text-[10px] font-bold ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{it.label[lang]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
