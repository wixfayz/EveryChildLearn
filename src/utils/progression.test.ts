import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DAILY_GAME_STAR_CAP,
  DEFAULT_STATS,
  calculateQuizReward,
  canClaimDailyDrawingStar,
  getAwardableGameStars,
  getNextRankProgress,
  getPromotionOnStarGain,
  getQuizStarDelta,
  getRankForStars,
  getUnlockedBadges,
  splitIntoSimpleSyllables,
} from './progression';

test('rank tiers map Beginner (0-99), Professional (100-249), and Expert (250+)', () => {
  assert.equal(getRankForStars(0).name, 'Beginner');
  assert.equal(getRankForStars(99).name, 'Beginner');
  assert.equal(getRankForStars(100).name, 'Professional');
  assert.equal(getRankForStars(249).name, 'Professional');
  assert.equal(getRankForStars(250).name, 'Expert');
  assert.equal(getRankForStars(500).name, 'Expert');
});

test('negative star inputs safely clamp to Beginner', () => {
  assert.equal(getRankForStars(-10).id, 'beginner');
  const progress = getNextRankProgress(-5);
  assert.equal(progress.starsToNext, 100);
  assert.equal(progress.percent, 0);
});

test('promotion detection fires only when crossing 100 or 250 star boundaries', () => {
  assert.equal(getPromotionOnStarGain(90, 5), null);
  assert.equal(getPromotionOnStarGain(95, 5)?.id, 'professional');
  assert.equal(getPromotionOnStarGain(100, 10), null);
  assert.equal(getPromotionOnStarGain(245, 5)?.id, 'expert');
  assert.equal(getPromotionOnStarGain(250, 10), null);
});

test('next rank progress computes percentage and remaining stars cleanly', () => {
  const beginnerMid = getNextRankProgress(50);
  assert.equal(beginnerMid.nextRank?.id, 'professional');
  assert.equal(beginnerMid.starsToNext, 50);
  assert.equal(beginnerMid.percent, 50);

  const expertMax = getNextRankProgress(300);
  assert.equal(expertMax.nextRank, null);
  assert.equal(expertMax.starsToNext, 0);
  assert.equal(expertMax.percent, 100);
});

test('daily game star cap prevents farming unlimited points in one day', () => {
  const first = getAwardableGameStars(
    { dailyGameStarsDate: '2026-11-25', dailyGameStarsEarned: 13 },
    3,
    '2026-11-25',
  );
  assert.equal(first.awarded, 2);
  assert.equal(first.nextDailyEarned, DAILY_GAME_STAR_CAP);
  assert.equal(first.remainingToday, 0);

  // Next day resets daily cap
  const nextDay = getAwardableGameStars(
    { dailyGameStarsDate: '2026-11-25', dailyGameStarsEarned: DAILY_GAME_STAR_CAP },
    2,
    '2026-11-26',
  );
  assert.equal(nextDay.awarded, 2);
  assert.equal(nextDay.remainingToday, DAILY_GAME_STAR_CAP - 2);
});

test('daily drawing reward requires minimum strokes and is capped once per day', () => {
  assert.deepEqual(canClaimDailyDrawingStar('', 2, '2026-11-25'), {
    eligible: false,
    reason: 'too-few-strokes',
  });
  assert.deepEqual(canClaimDailyDrawingStar('', 5, '2026-11-25'), {
    eligible: true,
    reason: 'ok',
  });
  assert.deepEqual(canClaimDailyDrawingStar('2026-11-25', 8, '2026-11-25'), {
    eligible: false,
    reason: 'already-claimed-today',
  });
  assert.deepEqual(canClaimDailyDrawingStar('2026-11-25', 8, '2026-11-26'), {
    eligible: true,
    reason: 'ok',
  });
});

test('quiz reward requires passing score and only awards improvement delta on retries', () => {
  const fail = calculateQuizReward(2, 5);
  assert.equal(fail.passed, false);
  assert.equal(fail.starsEarned, 0);

  const pass = calculateQuizReward(3, 5);
  assert.equal(pass.passed, true);
  assert.equal(pass.starsEarned, 3);

  const perfect = calculateQuizReward(5, 5);
  assert.equal(perfect.passed, true);
  assert.equal(perfect.starsEarned, 10);

  // Improvement delta stops repeat farming
  assert.equal(getQuizStarDelta(3, 3), 0);
  assert.equal(getQuizStarDelta(3, 10), 7);
  assert.equal(getQuizStarDelta(10, 10), 0);
});

test('badge unlocking responds to tougher milestones', () => {
  assert.equal(getUnlockedBadges(DEFAULT_STATS).length, 0);

  const activeStats = {
    ...DEFAULT_STATS,
    stars: 105,
    practicedLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    practicedWords: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    watchedVideos: ['vowels', 'addition', 'plants'],
    completedQuizzes: ['alphabets-reading', 'simple-math'],
    gamesWon: 10,
    drawingsSaved: 2,
  };

  assert.equal(getUnlockedBadges(activeStats).length, 8);
});

test('simple syllable splitter handles short, compound, and custom words', () => {
  assert.deepEqual(splitIntoSimpleSyllables('cat'), ['cat']);
  assert.deepEqual(splitIntoSimpleSyllables('rainbow'), ['rain', 'bow']);
  assert.deepEqual(splitIntoSimpleSyllables('  '), []);
  assert.ok(splitIntoSimpleSyllables('elephant').length >= 2);
});
