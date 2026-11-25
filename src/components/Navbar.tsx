import { Award, Star } from 'lucide-react';
import type { AppSection } from '../data/learningData';
import type { RankTier } from '../utils/progression';

interface NavbarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  stars: number;
  currentRank: RankTier;
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'alphabets', label: 'Alphabets' },
  { id: 'pronounce', label: 'Pronounce' },
  { id: 'videos', label: 'Videos' },
  { id: 'quizzes', label: 'Quizzes' },
  { id: 'draw', label: 'Draw' },
];

export function Navbar({ activeSection, onNavigate, stars, currentRank }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-sky-600 border-b border-sky-700 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single brand element with sunny yellow star mark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-yellow-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span
            className="w-7 h-7 rounded-lg bg-yellow-400 text-sky-900 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2.5l2.4 5 5.6.7-4.1 3.9 1 5.5L12 15l-4.9 2.6 1-5.5L4 8.2l5.6-.7L12 2.5z" />
            </svg>
          </span>
          <span>EveryChildLearn</span>
        </button>

        {/* Zone 2: 5 clean single-line text navigation links (desktop) */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-yellow-300 border-yellow-300'
                    : 'text-white/95 border-transparent hover:text-yellow-200 hover:border-yellow-200/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Rank & Rewards) in Sunny Yellow */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('rewards')}
            aria-label={`Open Rewards and Rank — ${currentRank.name}, ${stars} stars`}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'rewards'
                ? 'bg-white text-sky-800'
                : 'bg-yellow-400 text-slate-950 hover:bg-yellow-300'
            }`}
          >
            <Award className="w-4 h-4 shrink-0 text-sky-800" aria-hidden="true" />
            <span>{currentRank.name}</span>
            <span className="inline-flex items-center gap-1 tabular-nums text-sky-950">
              <Star className="w-3.5 h-3.5 fill-sky-800 text-sky-800" aria-hidden="true" />
              {stars}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
