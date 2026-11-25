export type RankId = 'beginner' | 'professional' | 'expert';

export interface RankTier {
  id: RankId;
  name: string;
  minStars: number;
  maxStars: number | null;
  tagline: string;
  nextHint: string;
}

export interface LearnerStats {
  stars: number;
  practicedLetters: string[];
  practicedWords: string[];
  watchedVideos: string[];
  completedQuizzes: string[];
  quizBestStars: Record<string, number>;
  gamesWon: number;
  dailyGameStarsDate: string;
  dailyGameStarsEarned: number;
  drawingsSaved: number;
  lastDrawingStarDate: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  goalLabel: string;
  isUnlocked: (stats: LearnerStats) => boolean;
}

export const DAILY_GAME_STAR_CAP = 15;
export const DRAWING_MIN_STROKES = 5;
export const DRAWING_DAILY_STARS = 5;
export const LETTER_STARS = 2;
export const WORD_STARS = 2;
export const VIDEO_STARS = 5;

export const RANK_TIERS: RankTier[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    minStars: 0,
    maxStars: 99,
    tagline: 'Building strong daily learning habits step by step',
    nextHint: 'Earn 100 stars across lessons to reach Professional',
  },
  {
    id: 'professional',
    name: 'Professional',
    minStars: 100,
    maxStars: 249,
    tagline: 'Dedicated learner mastering reading, math, and diction',
    nextHint: 'Earn 250 stars over multiple days to become an Expert',
  },
  {
    id: 'expert',
    name: 'Expert',
    minStars: 250,
    maxStars: null,
    tagline: 'True champion learner ready to inspire classmates',
    nextHint: 'You reached the highest promotion rank!',
  },
];

export const DEFAULT_STATS: LearnerStats = {
  stars: 0,
  practicedLetters: [],
  practicedWords: [],
  watchedVideos: [],
  completedQuizzes: [],
  quizBestStars: {},
  gamesWon: 0,
  dailyGameStarsDate: '',
  dailyGameStarsEarned: 0,
  drawingsSaved: 0,
  lastDrawingStarDate: '',
};

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-star',
    title: 'First Step',
    description: 'Earned your first 10 stars through real practice.',
    goalLabel: 'Earn 10 stars',
    isUnlocked: (s) => s.stars >= 10,
  },
  {
    id: 'alphabet-friend',
    title: 'Alphabet Explorer',
    description: 'Listened to and practiced at least 10 letters of the alphabet.',
    goalLabel: 'Practice 10 letters',
    isUnlocked: (s) => s.practicedLetters.length >= 10,
  },
  {
    id: 'clear-speaker',
    title: 'Clear Speaker',
    description: 'Practiced pronouncing 8 or more school words clearly.',
    goalLabel: 'Pronounce 8 words',
    isUnlocked: (s) => s.practicedWords.length >= 8,
  },
  {
    id: 'video-watcher',
    title: 'Focused Watcher',
    description: 'Watched all scenes in 3 explanatory video lessons.',
    goalLabel: 'Finish 3 lessons',
    isUnlocked: (s) => s.watchedVideos.length >= 3,
  },
  {
    id: 'quiz-champion',
    title: 'Quiz Achiever',
    description: 'Passed 2 interactive school quizzes with 60% or higher.',
    goalLabel: 'Pass 2 quizzes',
    isUnlocked: (s) => s.completedQuizzes.length >= 2,
  },
  {
    id: 'young-artist',
    title: 'Young Artist',
    description: 'Completed and saved 2 artworks in the Draw & Colour studio.',
    goalLabel: 'Save 2 drawings',
    isUnlocked: (s) => s.drawingsSaved >= 2,
  },
  {
    id: 'game-winner',
    title: 'Puzzle Thinker',
    description: 'Solved 10 educational game challenges.',
    goalLabel: 'Win 10 game rounds',
    isUnlocked: (s) => s.gamesWon >= 10,
  },
  {
    id: 'professional-rank',
    title: 'Professional Rank',
    description: 'Earned promotion from Beginner to Professional learner.',
    goalLabel: 'Reach 100 stars',
    isUnlocked: (s) => s.stars >= 100,
  },
];

export function getTodayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getRankForStars(stars: number): RankTier {
  const safeStars = Math.max(0, Math.floor(stars));
  if (safeStars >= 250) return RANK_TIERS[2];
  if (safeStars >= 100) return RANK_TIERS[1];
  return RANK_TIERS[0];
}

export function getNextRankProgress(stars: number): {
  currentRank: RankTier;
  nextRank: RankTier | null;
  starsToNext: number;
  percent: number;
} {
  const safeStars = Math.max(0, Math.floor(stars));
  const currentRank = getRankForStars(safeStars);

  if (currentRank.id === 'expert') {
    return {
      currentRank,
      nextRank: null,
      starsToNext: 0,
      percent: 100,
    };
  }

  const nextRank = currentRank.id === 'beginner' ? RANK_TIERS[1] : RANK_TIERS[2];
  const span = nextRank.minStars - currentRank.minStars;
  const gainedInTier = safeStars - currentRank.minStars;
  const percent = Math.min(100, Math.max(0, Math.round((gainedInTier / span) * 100)));

  return {
    currentRank,
    nextRank,
    starsToNext: Math.max(0, nextRank.minStars - safeStars),
    percent,
  };
}

export function getPromotionOnStarGain(previousStars: number, addedStars: number): RankTier | null {
  if (addedStars <= 0) return null;
  const before = getRankForStars(previousStars);
  const after = getRankForStars(previousStars + addedStars);
  if (before.id !== after.id) {
    return after;
  }
  return null;
}

export function getUnlockedBadges(stats: LearnerStats): BadgeDefinition[] {
  return BADGES.filter((badge) => badge.isUnlocked(stats));
}

export function getAwardableGameStars(
  stats: Pick<LearnerStats, 'dailyGameStarsDate' | 'dailyGameStarsEarned'>,
  requestedStars: number,
  todayKey: string,
): { awarded: number; nextDailyEarned: number; remainingToday: number } {
  const currentEarned = stats.dailyGameStarsDate === todayKey ? stats.dailyGameStarsEarned : 0;
  const remainingBefore = Math.max(0, DAILY_GAME_STAR_CAP - currentEarned);
  const awarded = Math.max(0, Math.min(requestedStars, remainingBefore));
  const nextDailyEarned = currentEarned + awarded;
  return {
    awarded,
    nextDailyEarned,
    remainingToday: Math.max(0, DAILY_GAME_STAR_CAP - nextDailyEarned),
  };
}

export function canClaimDailyDrawingStar(
  lastDrawingStarDate: string,
  strokeCount: number,
  todayKey: string,
): { eligible: boolean; reason: 'ok' | 'too-few-strokes' | 'already-claimed-today' } {
  if (strokeCount < DRAWING_MIN_STROKES) {
    return { eligible: false, reason: 'too-few-strokes' };
  }
  if (lastDrawingStarDate === todayKey) {
    return { eligible: false, reason: 'already-claimed-today' };
  }
  return { eligible: true, reason: 'ok' };
}

/**
 * Splits an arbitrary English word into friendly readable syllable chunks
 * so children typing custom homework words can see bite-sized parts.
 */
export function splitIntoSimpleSyllables(rawWord: string): string[] {
  const clean = rawWord.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return [];
  if (clean.length <= 3) return [clean];

  const matches = clean.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))?/g);
  if (!matches || matches.length === 0) {
    return [clean];
  }

  const result: string[] = [];
  for (const chunk of matches) {
    if (result.length > 0 && !/[aeiouy]/.test(chunk)) {
      result[result.length - 1] += chunk;
    } else {
      result.push(chunk);
    }
  }

  const joined = result.join('');
  if (joined.length < clean.length) {
    result[result.length - 1] += clean.slice(joined.length);
  }

  return result;
}

/**
 * Stricter quiz reward: requires at least 60% correct to pass and earn stars.
 * Perfect 100% earns +5 bonus (up to 10 stars for a 5-question quiz).
 */
export function calculateQuizReward(correctCount: number, totalQuestions: number): {
  starsEarned: number;
  percentage: number;
  passed: boolean;
  message: string;
} {
  if (totalQuestions <= 0) {
    return {
      starsEarned: 0,
      percentage: 0,
      passed: false,
      message: 'Try answering the questions first.',
    };
  }
  const safeCorrect = Math.max(0, Math.min(correctCount, totalQuestions));
  const percentage = Math.round((safeCorrect / totalQuestions) * 100);
  const passed = percentage >= 60;

  if (!passed) {
    return {
      starsEarned: 0,
      percentage,
      passed: false,
      message: 'Keep practicing! Score at least 60% to pass this quiz and earn stars.',
    };
  }

  const perfectBonus = safeCorrect === totalQuestions ? 5 : 0;
  const starsEarned = safeCorrect + perfectBonus;

  if (percentage === 100) {
    return {
      starsEarned,
      percentage,
      passed: true,
      message: 'Outstanding! Perfect score — you mastered every question.',
    };
  }

  return {
    starsEarned,
    percentage,
    passed: true,
    message: 'Well done! You passed. Score 100% next time to unlock the full bonus stars.',
  };
}

/**
 * Prevents farming the same quiz repeatedly: only awards improvement over previous best score.
 */
export function getQuizStarDelta(
  previousBestStars: number | undefined,
  newScoreStars: number,
): number {
  const best = Math.max(0, previousBestStars ?? 0);
  return Math.max(0, newScoreStars - best);
}
