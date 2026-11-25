import { useState, type FormEvent } from 'react';
import { Award, CheckCircle2, Lock, RotateCcw, Star, Trophy } from 'lucide-react';
import {
  BADGES,
  getNextRankProgress,
  RANK_TIERS,
  type LearnerStats,
} from '../utils/progression';

interface RewardsViewProps {
  learnerName: string;
  onUpdateName: (name: string) => void;
  stats: LearnerStats;
  onResetProgress: () => void;
}

export function RewardsView({
  learnerName,
  onUpdateName,
  stats,
  onResetProgress,
}: RewardsViewProps) {
  const [nameInput, setNameInput] = useState(learnerName);
  const [nameSaved, setNameSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const progress = getNextRankProgress(stats.stars);
  const unlockedCount = BADGES.filter((b) => b.isUnlocked(stats)).length;

  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    onUpdateName(nameInput.trim());
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Your Ranks & Rewards
          </h1>
          <p className="text-slate-600 mt-1">
            Earn stars as you learn to get promoted from Beginner to Professional to Expert!
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-lg font-display font-bold text-sky-900 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-xl tabular-nums">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" aria-hidden="true" />
          <span>{stats.stars} Total Stars</span>
        </div>
      </div>

      {/* 3 Promotion Tiers: Beginner -> Professional -> Expert */}
      <section aria-labelledby="promotion-levels-heading" className="space-y-4">
        <h2
          id="promotion-levels-heading"
          className="font-display text-2xl font-bold text-slate-900"
        >
          Promotion Levels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RANK_TIERS.map((tier, idx) => {
            const unlocked = stats.stars >= tier.minStars;
            const isCurrent = progress.currentRank.id === tier.id;
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 border space-y-4 ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-400'
                    : unlocked
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-white border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-800">
                    Level {idx + 1} · {tier.minStars}+ Stars
                  </span>
                  {isCurrent ? (
                    <span className="text-xs font-bold text-sky-700">Current Rank</span>
                  ) : unlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-sky-600" aria-hidden="true" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      unlocked ? 'bg-yellow-400 text-sky-950' : 'bg-sky-50 text-sky-400'
                    }`}
                  >
                    {idx === 2 ? (
                      <Trophy className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Award className="w-6 h-6" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">{tier.name}</h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{tier.tagline}</p>

                <p className="text-xs font-medium text-slate-600 pt-2 border-t border-sky-200/70">
                  {unlocked
                    ? isCurrent
                      ? tier.nextHint
                      : 'Completed!'
                    : `Need ${Math.max(0, tier.minStars - stats.stars)} more stars to unlock`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning Activity Summary */}
      <section aria-label="Learning activity counts" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Letters Practiced', value: `${stats.practicedLetters.length}/26` },
          { label: 'Words Pronounced', value: String(stats.practicedWords.length) },
          { label: 'Videos Watched', value: `${stats.watchedVideos.length}/4` },
          { label: 'Quizzes Done', value: `${stats.completedQuizzes.length}/3` },
          { label: 'Games Won', value: String(stats.gamesWon) },
          { label: 'Drawings Saved', value: String(stats.drawingsSaved) },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white border border-sky-200 rounded-2xl p-4 space-y-1"
          >
            <p className="text-xs text-slate-500">{metric.label}</p>
            <p className="font-display text-2xl font-bold text-sky-950 tabular-nums">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      {/* Reward Badges Grid */}
      <section aria-labelledby="badges-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="badges-heading" className="font-display text-2xl font-bold text-slate-900">
            Achievement Badges
          </h2>
          <span className="text-sm text-sky-800 font-medium tabular-nums">
            {unlockedCount} of {BADGES.length} earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = badge.isUnlocked(stats);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border space-y-2 ${
                  unlocked
                    ? 'bg-white border-yellow-400'
                    : 'bg-white/70 border-sky-100 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      unlocked ? 'bg-yellow-400 text-sky-950' : 'bg-sky-50 text-sky-400'
                    }`}
                  >
                    {unlocked ? (
                      <Star className="w-5 h-5 fill-sky-950 text-sky-950" aria-hidden="true" />
                    ) : (
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      unlocked ? 'text-sky-700' : 'text-slate-500'
                    }`}
                  >
                    {unlocked ? 'Earned' : badge.goalLabel}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">{badge.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learner Name & Reset */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <form onSubmit={handleSaveName} className="space-y-2 flex-1 max-w-md">
          <label htmlFor="learner-name-input" className="block text-sm font-semibold text-slate-800">
            Student Name (optional)
          </label>
          <div className="flex gap-2">
            <input
              id="learner-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your first name"
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 cursor-pointer"
            >
              Save
            </button>
          </div>
          {nameSaved && (
            <p role="status" className="text-xs font-medium text-emerald-700">
              Name saved!
            </p>
          )}
        </form>

        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Start Fresh</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">Reset all stars?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
