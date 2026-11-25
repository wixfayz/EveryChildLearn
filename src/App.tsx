/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AlphabetSection } from './components/AlphabetSection';
import { BottomNav } from './components/BottomNav';
import { DrawSection } from './components/DrawSection';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { PromotionModal } from './components/PromotionModal';
import { PronunciationSection } from './components/PronunciationSection';
import { QuizAndGamesSection } from './components/QuizAndGamesSection';
import { RewardsView } from './components/RewardsView';
import { VideoSection } from './components/VideoSection';
import type { AppSection } from './data/learningData';
import {
  canClaimDailyDrawingStar,
  DEFAULT_STATS,
  DRAWING_DAILY_STARS,
  getAwardableGameStars,
  getPromotionOnStarGain,
  getQuizStarDelta,
  getRankForStars,
  getTodayKey,
  LETTER_STARS,
  VIDEO_STARS,
  WORD_STARS,
  type LearnerStats,
  type RankTier,
} from './utils/progression';
import { stopSpeaking } from './utils/speech';

const STORAGE_KEY = 'everychildlearn_progress_v2';
const NAME_STORAGE_KEY = 'everychildlearn_name_v1';

function loadSavedStats(): LearnerStats {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Partial<LearnerStats>;
    return {
      stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
      practicedLetters: Array.isArray(parsed.practicedLetters) ? parsed.practicedLetters : [],
      practicedWords: Array.isArray(parsed.practicedWords) ? parsed.practicedWords : [],
      watchedVideos: Array.isArray(parsed.watchedVideos) ? parsed.watchedVideos : [],
      completedQuizzes: Array.isArray(parsed.completedQuizzes) ? parsed.completedQuizzes : [],
      quizBestStars:
        parsed.quizBestStars && typeof parsed.quizBestStars === 'object'
          ? parsed.quizBestStars
          : {},
      gamesWon: typeof parsed.gamesWon === 'number' ? parsed.gamesWon : 0,
      dailyGameStarsDate:
        typeof parsed.dailyGameStarsDate === 'string' ? parsed.dailyGameStarsDate : '',
      dailyGameStarsEarned:
        typeof parsed.dailyGameStarsEarned === 'number' ? parsed.dailyGameStarsEarned : 0,
      drawingsSaved: typeof parsed.drawingsSaved === 'number' ? parsed.drawingsSaved : 0,
      lastDrawingStarDate:
        typeof parsed.lastDrawingStarDate === 'string' ? parsed.lastDrawingStarDate : '',
    };
  } catch {
    return DEFAULT_STATS;
  }
}

function loadSavedName(): string {
  try {
    return window.localStorage.getItem(NAME_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [stats, setStats] = useState<LearnerStats>(loadSavedStats);
  const [learnerName, setLearnerName] = useState<string>(loadSavedName);
  const [promotedRank, setPromotedRank] = useState<RankTier | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage quota errors
    }
  }, [stats]);

  const handleUpdateName = useCallback((name: string) => {
    setLearnerName(name);
    try {
      window.localStorage.setItem(NAME_STORAGE_KEY, name);
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const handleNavigate = useCallback((section: AppSection) => {
    stopSpeaking();
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handlePracticeLetter = useCallback((letter: string) => {
    setStats((prev) => {
      if (prev.practicedLetters.includes(letter)) return prev;
      const promotion = getPromotionOnStarGain(prev.stars, LETTER_STARS);
      if (promotion) setPromotedRank(promotion);
      return {
        ...prev,
        stars: prev.stars + LETTER_STARS,
        practicedLetters: [...prev.practicedLetters, letter],
      };
    });
  }, []);

  const handlePracticeWord = useCallback((wordId: string) => {
    if (wordId.startsWith('custom-')) return;
    setStats((prev) => {
      if (prev.practicedWords.includes(wordId)) return prev;
      const promotion = getPromotionOnStarGain(prev.stars, WORD_STARS);
      if (promotion) setPromotedRank(promotion);
      return {
        ...prev,
        stars: prev.stars + WORD_STARS,
        practicedWords: [...prev.practicedWords, wordId],
      };
    });
  }, []);

  const handleCompleteVideo = useCallback((videoId: string) => {
    setStats((prev) => {
      if (prev.watchedVideos.includes(videoId)) return prev;
      const promotion = getPromotionOnStarGain(prev.stars, VIDEO_STARS);
      if (promotion) setPromotedRank(promotion);
      return {
        ...prev,
        stars: prev.stars + VIDEO_STARS,
        watchedVideos: [...prev.watchedVideos, videoId],
      };
    });
  }, []);

  const handleCompleteQuiz = useCallback(
    (quizId: string, passed: boolean, newScoreStars: number) => {
      setStats((prev) => {
        const prevBest = prev.quizBestStars[quizId] ?? 0;
        const delta = getQuizStarDelta(prevBest, newScoreStars);
        if (delta > 0) {
          const promotion = getPromotionOnStarGain(prev.stars, delta);
          if (promotion) setPromotedRank(promotion);
        }
        return {
          ...prev,
          stars: prev.stars + delta,
          completedQuizzes:
            passed && !prev.completedQuizzes.includes(quizId)
              ? [...prev.completedQuizzes, quizId]
              : prev.completedQuizzes,
          quizBestStars: {
            ...prev.quizBestStars,
            [quizId]: Math.max(prevBest, newScoreStars),
          },
        };
      });
    },
    [],
  );

  const handleWinGameRound = useCallback(
    (starsRequested: number): number => {
      const todayKey = getTodayKey();
      const { awarded } = getAwardableGameStars(stats, starsRequested, todayKey);
      setStats((prev) => {
        const res = getAwardableGameStars(prev, starsRequested, todayKey);
        if (res.awarded > 0) {
          const promotion = getPromotionOnStarGain(prev.stars, res.awarded);
          if (promotion) setPromotedRank(promotion);
        }
        return {
          ...prev,
          stars: prev.stars + res.awarded,
          gamesWon: prev.gamesWon + 1,
          dailyGameStarsDate: todayKey,
          dailyGameStarsEarned: res.nextDailyEarned,
        };
      });
      return awarded;
    },
    [stats],
  );

  const handleSaveDrawing = useCallback(
    (strokeCount: number): boolean => {
      const todayKey = getTodayKey();
      const check = canClaimDailyDrawingStar(stats.lastDrawingStarDate, strokeCount, todayKey);
      setStats((prev) => {
        const innerCheck = canClaimDailyDrawingStar(prev.lastDrawingStarDate, strokeCount, todayKey);
        if (innerCheck.eligible) {
          const promotion = getPromotionOnStarGain(prev.stars, DRAWING_DAILY_STARS);
          if (promotion) setPromotedRank(promotion);
        }
        return {
          ...prev,
          stars: innerCheck.eligible ? prev.stars + DRAWING_DAILY_STARS : prev.stars,
          drawingsSaved: prev.drawingsSaved + 1,
          lastDrawingStarDate: innerCheck.eligible ? todayKey : prev.lastDrawingStarDate,
        };
      });
      return check.eligible;
    },
    [stats.lastDrawingStarDate],
  );

  const handleResetProgress = useCallback(() => {
    setStats(DEFAULT_STATS);
    setPromotedRank(null);
  }, []);

  const currentRank = getRankForStars(stats.stars);
  const todayKey = getTodayKey();
  const todayGameStars =
    stats.dailyGameStarsDate === todayKey ? stats.dailyGameStarsEarned : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAFF] text-slate-900 pb-16">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        stars={stats.stars}
        currentRank={currentRank}
      />

      <main className="flex-1">
        {activeSection === 'home' && (
          <HomeView
            learnerName={learnerName}
            stats={stats}
            onNavigate={handleNavigate}
          />
        )}
        {activeSection === 'alphabets' && (
          <AlphabetSection
            practicedLetters={stats.practicedLetters}
            onPracticeLetter={handlePracticeLetter}
          />
        )}
        {activeSection === 'pronounce' && (
          <PronunciationSection
            practicedWords={stats.practicedWords}
            onPracticeWord={handlePracticeWord}
          />
        )}
        {activeSection === 'videos' && (
          <VideoSection
            watchedVideos={stats.watchedVideos}
            onCompleteVideo={handleCompleteVideo}
          />
        )}
        {activeSection === 'quizzes' && (
          <QuizAndGamesSection
            completedQuizzes={stats.completedQuizzes}
            quizBestStars={stats.quizBestStars}
            gamesWon={stats.gamesWon}
            dailyGameStarsEarned={todayGameStars}
            onCompleteQuiz={handleCompleteQuiz}
            onWinGameRound={handleWinGameRound}
          />
        )}
        {activeSection === 'draw' && (
          <DrawSection
            drawingsSaved={stats.drawingsSaved}
            lastDrawingStarDate={stats.lastDrawingStarDate}
            onSaveDrawing={handleSaveDrawing}
          />
        )}
        {activeSection === 'rewards' && (
          <RewardsView
            learnerName={learnerName}
            onUpdateName={handleUpdateName}
            stats={stats}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      <footer className="border-t-2 border-yellow-300 bg-sky-600 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p className="font-semibold text-white">
            EveryChildLearn — Learn at your own pace.
          </p>
          <p className="text-sky-100 text-xs sm:text-sm">
            Tap any icon below to jump straight to your lessons.
          </p>
        </div>
      </footer>

      <BottomNav activeSection={activeSection} onNavigate={handleNavigate} />

      <PromotionModal
        promotedRank={promotedRank}
        onClose={() => setPromotedRank(null)}
        onViewRewards={() => {
          setPromotedRank(null);
          handleNavigate('rewards');
        }}
      />
    </div>
  );
}
