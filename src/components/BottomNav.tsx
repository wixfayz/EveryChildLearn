import {
  BookOpen,
  Gamepad2,
  Home,
  Palette,
  PlayCircle,
  Volume2,
} from 'lucide-react';
import type { AppSection } from '../data/learningData';

interface BottomNavProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const BOTTOM_TABS: { id: AppSection; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'alphabets', label: 'Alphabets', icon: BookOpen },
  { id: 'pronounce', label: 'Pronounce', icon: Volume2 },
  { id: 'videos', label: 'Videos', icon: PlayCircle },
  { id: 'quizzes', label: 'Quizzes', icon: Gamepad2 },
  { id: 'draw', label: 'Draw', icon: Palette },
];

export function BottomNav({ activeSection, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom quick navigation"
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-sky-200 shadow-[0_-2px_10px_rgba(2,132,199,0.08)]"
    >
      <div className="max-w-3xl mx-auto px-2 h-16 grid grid-cols-6 items-center">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-sky-700'
                  : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0.5 w-6 h-1 rounded-full bg-yellow-400"
                />
              )}
              <span
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-sky-100 text-sky-700' : ''
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <span
                className={`text-[11px] leading-none whitespace-nowrap ${
                  isActive ? 'font-bold text-sky-900' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
