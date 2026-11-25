import { Award, Star, Trophy, X } from 'lucide-react';
import type { RankTier } from '../utils/progression';

interface PromotionModalProps {
  promotedRank: RankTier | null;
  onClose: () => void;
  onViewRewards: () => void;
}

export function PromotionModal({ promotedRank, onClose, onViewRewards }: PromotionModalProps) {
  if (!promotedRank) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="bg-white border-2 border-sky-200 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 relative shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close promotion message"
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-sky-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-400 text-sky-950 flex items-center justify-center">
          {promotedRank.id === 'expert' ? (
            <Trophy className="w-9 h-9" aria-hidden="true" />
          ) : (
            <Award className="w-9 h-9" aria-hidden="true" />
          )}
        </div>

        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" aria-hidden="true" />
            <span>Congratulations! You Got Promoted!</span>
          </p>
          <h2
            id="promotion-modal-title"
            className="font-display text-3xl font-bold text-slate-900"
          >
            You Are Now a {promotedRank.name}!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{promotedRank.tagline}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onViewRewards}
            className="flex-1 py-3 px-4 text-sm font-bold text-slate-950 bg-yellow-400 rounded-xl hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            View My Rewards
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
          >
            Keep Learning
          </button>
        </div>
      </div>
    </div>
  );
}
