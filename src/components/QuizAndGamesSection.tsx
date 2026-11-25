import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Star,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  MISSING_LETTER_PUZZLES,
  QUIZ_TOPICS,
  type QuizTopic,
} from '../data/learningData';
import {
  calculateQuizReward,
  DAILY_GAME_STAR_CAP,
  getQuizStarDelta,
} from '../utils/progression';
import { speakText } from '../utils/speech';

interface QuizAndGamesSectionProps {
  completedQuizzes: string[];
  quizBestStars: Record<string, number>;
  gamesWon: number;
  dailyGameStarsEarned: number;
  onCompleteQuiz: (quizId: string, passed: boolean, newScoreStars: number) => void;
  onWinGameRound: (starsRequested: number) => number;
}

type HubTab = 'quizzes' | 'games';
type ActiveGame = 'missing-letter' | 'star-math';

interface MathRound {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
  choices: number[];
}

function createMathRound(seed: number): MathRound {
  const presets: { a: number; b: number; operator: '+' | '-' }[] = [
    { a: 2, b: 3, operator: '+' },
    { a: 4, b: 2, operator: '+' },
    { a: 7, b: 3, operator: '-' },
    { a: 5, b: 4, operator: '+' },
    { a: 8, b: 2, operator: '-' },
    { a: 6, b: 3, operator: '+' },
    { a: 9, b: 4, operator: '-' },
    { a: 3, b: 5, operator: '+' },
  ];
  const item = presets[seed % presets.length];
  const answer = item.operator === '+' ? item.a + item.b : item.a - item.b;
  const candidateSet = new Set<number>([answer]);
  const offsets = [-2, -1, 1, 2, 3];
  for (const offset of offsets) {
    if (candidateSet.size >= 4) break;
    const candidate = answer + offset;
    if (candidate >= 0) candidateSet.add(candidate);
  }
  const choices = Array.from(candidateSet).sort((x, y) => x - y);
  return { ...item, answer, choices };
}

export function QuizAndGamesSection({
  completedQuizzes,
  quizBestStars,
  gamesWon,
  dailyGameStarsEarned,
  onCompleteQuiz,
  onWinGameRound,
}: QuizAndGamesSectionProps) {
  const [hubTab, setHubTab] = useState<HubTab>('quizzes');

  // Quiz state
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic>(QUIZ_TOPICS[0]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [lastQuizDeltaStars, setLastQuizDeltaStars] = useState(0);

  // Games state
  const [activeGame, setActiveGame] = useState<ActiveGame>('missing-letter');
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [letterFeedback, setLetterFeedback] = useState<'idle' | 'correct' | 'try-again'>('idle');
  const [mathSeed, setMathSeed] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'idle' | 'correct' | 'try-again'>('idle');
  const [sessionStreak, setSessionStreak] = useState(0);
  const [lastGameAward, setLastGameAward] = useState(0);

  const currentQuestion = selectedTopic.questions[questionIdx];
  const currentPuzzle = MISSING_LETTER_PUZZLES[puzzleIdx % MISSING_LETTER_PUZZLES.length];
  const currentMath = createMathRound(mathSeed);
  const remainingDailyGameStars = Math.max(0, DAILY_GAME_STAR_CAP - dailyGameStarsEarned);

  const startTopic = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setQuestionIdx(0);
    setSelectedOption(null);
    setShowHint(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setLastQuizDeltaStars(0);
  };

  const handleChooseQuizOption = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    if (optionIndex === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (questionIdx < selectedTopic.questions.length - 1) {
      setQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      const reward = calculateQuizReward(correctCount, selectedTopic.questions.length);
      const delta = getQuizStarDelta(quizBestStars[selectedTopic.id], reward.starsEarned);
      setLastQuizDeltaStars(delta);
      setQuizFinished(true);
      onCompleteQuiz(selectedTopic.id, reward.passed, reward.starsEarned);
    }
  };

  const handleChooseMissingLetter = (letter: string) => {
    if (letterFeedback === 'correct') return;
    const expected = currentPuzzle.word[currentPuzzle.missingIndex];
    if (letter === expected) {
      const nextStreak = sessionStreak + 1;
      const requested = nextStreak % 3 === 0 ? 3 : 1;
      setLetterFeedback('correct');
      setSessionStreak(nextStreak);
      const awarded = onWinGameRound(requested);
      setLastGameAward(awarded);
      speakText(currentPuzzle.word, { speed: 'normal' });
    } else {
      setLetterFeedback('try-again');
      setSessionStreak(0);
    }
  };

  const handleNextLetterPuzzle = () => {
    setPuzzleIdx((prev) => (prev + 1) % MISSING_LETTER_PUZZLES.length);
    setLetterFeedback('idle');
  };

  const handleChooseMathAnswer = (choice: number) => {
    if (mathFeedback === 'correct') return;
    if (choice === currentMath.answer) {
      const nextStreak = sessionStreak + 1;
      const requested = nextStreak % 3 === 0 ? 3 : 1;
      setMathFeedback('correct');
      setSessionStreak(nextStreak);
      const awarded = onWinGameRound(requested);
      setLastGameAward(awarded);
    } else {
      setMathFeedback('try-again');
      setSessionStreak(0);
    }
  };

  const handleNextMathRound = () => {
    setMathSeed((prev) => prev + 1);
    setMathFeedback('idle');
  };

  const quizSummary = calculateQuizReward(correctCount, selectedTopic.questions.length);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header + Segmented Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Interactive Quizzes & Games
          </h1>
          <p className="text-slate-600 mt-1">
            Practice what you learned with friendly quizzes and fun educational puzzles.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Choose Quizzes or Educational Games"
          className="inline-flex items-center gap-1 p-1 bg-sky-100/80 rounded-xl self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={hubTab === 'quizzes'}
            onClick={() => setHubTab('quizzes')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              hubTab === 'quizzes'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-sky-800 hover:text-sky-950'
            }`}
          >
            School Quizzes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={hubTab === 'games'}
            onClick={() => setHubTab('games')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              hubTab === 'games'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-sky-800 hover:text-sky-950'
            }`}
          >
            Educational Games
          </button>
        </div>
      </div>

      {/* QUIZZES TAB */}
      {hubTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topic Selector */}
          <aside aria-label="Quiz subjects" className="lg:col-span-4 space-y-3">
            {QUIZ_TOPICS.map((topic) => {
              const active = selectedTopic.id === topic.id;
              const completed = completedQuizzes.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => startTopic(topic)}
                  aria-pressed={active}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    active
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-900 border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={active ? 'text-sky-100' : 'text-sky-700 font-medium'}>
                      {topic.subject} · {topic.questions.length} questions
                    </span>
                    {completed && (
                      <CheckCircle2
                        className={`w-4 h-4 ${active ? 'text-yellow-300' : 'text-sky-600'}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="font-display text-lg font-bold">{topic.title}</div>
                  <p className={`text-xs ${active ? 'text-sky-100' : 'text-slate-600'}`}>
                    {topic.description}
                  </p>
                </button>
              );
            })}
          </aside>

          {/* Active Quiz Card */}
          <section
            aria-label={`Quiz: ${selectedTopic.title}`}
            className="lg:col-span-8 bg-white border border-sky-200 rounded-2xl p-6 sm:p-8"
          >
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold text-sky-900">{selectedTopic.title}</span>
                  <span className="tabular-nums">
                    Question {questionIdx + 1} of {selectedTopic.questions.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full bg-sky-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((questionIdx + 1) / selectedTopic.questions.length) * 100)}%`,
                    }}
                  />
                </div>

                {/* Question Prompt */}
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-slate-900 leading-snug">
                    {currentQuestion.prompt}
                  </h2>
                  {currentQuestion.visualCue && (
                    <p className="text-sm font-medium text-sky-700 bg-sky-50/70 inline-block px-3.5 py-1.5 rounded-lg">
                      {currentQuestion.visualCue}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const answered = selectedOption !== null;

                    let styleClass =
                      'bg-white border-slate-200 text-slate-900 hover:border-sky-400 hover:bg-sky-50/40';
                    if (answered && isCorrect) {
                      styleClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                    } else if (answered && isPicked && !isCorrect) {
                      styleClass = 'bg-rose-50 border-rose-400 text-rose-950';
                    } else if (answered) {
                      styleClass = 'bg-slate-50 border-slate-200 text-slate-500';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChooseQuizOption(idx)}
                        disabled={answered}
                        className={`p-4 rounded-xl border text-left text-base font-medium transition-all flex items-center justify-between gap-3 ${styleClass} ${
                          answered ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                        )}
                        {answered && isPicked && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Gentle Hint Button before answering */}
                {selectedOption === null && (
                  <div>
                    {!showHint ? (
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-sky-700 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4" aria-hidden="true" />
                        <span>Need a helpful hint?</span>
                      </button>
                    ) : (
                      <p className="text-sm text-amber-900 bg-amber-50 rounded-xl px-4 py-3">
                        <strong>Hint: </strong>
                        {currentQuestion.hint}
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback after answering */}
                {selectedOption !== null && (
                  <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-bold ${
                          selectedOption === currentQuestion.correctIndex
                            ? 'text-emerald-700'
                            : 'text-slate-800'
                        }`}
                      >
                        {selectedOption === currentQuestion.correctIndex
                          ? 'Correct! Well done!'
                          : 'Good try — here is the answer:'}
                      </p>
                      <p className="text-sm text-slate-700">{currentQuestion.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>
                        {questionIdx < selectedTopic.questions.length - 1
                          ? 'Next Question'
                          : 'See My Score'}
                      </span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Results Screen */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-9 h-9 fill-amber-400 text-amber-500" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="font-display text-3xl font-bold text-slate-900">
                    Quiz Complete!
                  </h2>
                  <p className="text-base text-slate-600">{quizSummary.message}</p>
                </div>

                <div className="inline-flex items-center gap-6 px-6 py-4 bg-sky-50 border border-sky-200 rounded-2xl text-left">
                  <div>
                    <p className="text-xs text-slate-500">Score</p>
                    <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                      {correctCount} / {selectedTopic.questions.length} ({quizSummary.percentage}%)
                    </p>
                  </div>
                  <div className="h-8 w-px bg-sky-200" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-500">New Stars Earned</p>
                    <p className="font-display text-2xl font-bold text-sky-800 tabular-nums">
                      +{lastQuizDeltaStars} ★
                    </p>
                  </div>
                </div>
                {quizSummary.passed && lastQuizDeltaStars === 0 && (
                  <p className="text-xs font-medium text-slate-500">
                    You already earned your best score stars on this quiz. Try another topic or beat your high score!
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => startTopic(selectedTopic)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Try Quiz Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHubTab('games')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <span>Play Educational Games</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* EDUCATIONAL GAMES TAB */}
      {hubTab === 'games' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1 p-1 bg-sky-100/80 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveGame('missing-letter')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeGame === 'missing-letter'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
              >
                Missing Letter Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveGame('star-math')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeGame === 'star-math'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
              >
                Star Math Match
              </button>
            </div>

            <div className="text-sm text-slate-600 tabular-nums">
              Game stars today:{' '}
              <strong className="text-sky-900">
                {dailyGameStarsEarned}/{DAILY_GAME_STAR_CAP} ★
              </strong>{' '}
              · Streak: <strong className="text-sky-800">{sessionStreak}</strong>
              {remainingDailyGameStars === 0 && ' · Daily limit reached (practice freely!)'}
            </div>
          </div>

          {activeGame === 'missing-letter' ? (
            <section
              aria-label="Missing Letter Builder game"
              className="bg-white border border-sky-200 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-sky-700">
                  Word Puzzle {(puzzleIdx % MISSING_LETTER_PUZZLES.length) + 1} of{' '}
                  {MISSING_LETTER_PUZZLES.length}
                </p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Fill in the Missing Letter
                </h2>
                <p className="text-slate-600 text-base">Clue: {currentPuzzle.clue}</p>
              </div>

              {/* Letter Tiles */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                {currentPuzzle.word.split('').map((char, idx) => {
                  const isMissing = idx === currentPuzzle.missingIndex;
                  const revealed = !isMissing || letterFeedback === 'correct';
                  return (
                    <div
                      key={`${currentPuzzle.id}-${idx}`}
                      className={`w-13 h-15 sm:w-16 sm:h-18 rounded-2xl flex items-center justify-center font-display text-3xl sm:text-4xl font-bold border-2 ${
                        isMissing && letterFeedback === 'correct'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : isMissing
                            ? 'bg-sky-50 border-dashed border-sky-400 text-sky-600'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      {revealed ? char : '?'}
                    </div>
                  );
                })}
              </div>

              {/* Choice Buttons */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {currentPuzzle.choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleChooseMissingLetter(choice)}
                    disabled={letterFeedback === 'correct'}
                    className="py-4 rounded-xl bg-white border border-slate-200 font-display text-2xl font-bold text-slate-900 hover:border-sky-400 hover:bg-sky-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {letterFeedback === 'try-again' && (
                <p role="status" className="text-sm font-medium text-rose-700">
                  Almost! Read the clue again and try another letter.
                </p>
              )}

              {letterFeedback === 'correct' && (
                <div
                  role="status"
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    <span>
                      Awesome! You spelled {currentPuzzle.word}!{' '}
                      {lastGameAward > 0
                        ? `(+${lastGameAward} ${lastGameAward > 1 ? 'Streak Bonus Stars!' : 'Star'})`
                        : '(Daily game stars complete — great practice!)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(currentPuzzle.word, { speed: 'slow' })}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-800 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                      <span>Hear</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextLetterPuzzle}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer"
                    >
                      <span>Next Word</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section
              aria-label="Star Math Match game"
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-sky-700">Visual Counting & Math</p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Solve the Star Math Problem
                </h2>
              </div>

              {/* Visual Equation with Star Groups */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <div className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tabular-nums">
                  {currentMath.a} {currentMath.operator} {currentMath.b} ={' '}
                  <span className="text-sky-600">
                    {mathFeedback === 'correct' ? currentMath.answer : '?'}
                  </span>
                </div>

                {/* Visual Dots Helper */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1" aria-label={`${currentMath.a} stars`}>
                    {Array.from({ length: currentMath.a }).map((_, i) => (
                      <Star
                        key={`a-${i}`}
                        className="w-5 h-5 text-amber-500 fill-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">
                    {currentMath.operator === '+' ? 'plus' : 'take away'}
                  </span>
                  <div className="flex items-center gap-1" aria-label={`${currentMath.b} stars`}>
                    {Array.from({ length: currentMath.b }).map((_, i) => (
                      <Star
                        key={`b-${i}`}
                        className={`w-5 h-5 ${
                          currentMath.operator === '+'
                            ? 'text-sky-500 fill-sky-400'
                            : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Answer Choices */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {currentMath.choices.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChooseMathAnswer(num)}
                    disabled={mathFeedback === 'correct'}
                    className="py-4 rounded-xl bg-white border border-slate-200 font-display text-2xl font-bold text-slate-900 tabular-nums hover:border-sky-400 hover:bg-sky-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>

              {mathFeedback === 'try-again' && (
                <p role="status" className="text-sm font-medium text-rose-700">
                  Not quite — count the stars slowly and try again!
                </p>
              )}

              {mathFeedback === 'correct' && (
                <div
                  role="status"
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    <span>
                      Spot on! {currentMath.a} {currentMath.operator} {currentMath.b} ={' '}
                      {currentMath.answer}!{' '}
                      {lastGameAward > 0
                        ? `(+${lastGameAward} ${lastGameAward > 1 ? 'Streak Bonus Stars!' : 'Star'})`
                        : '(Daily game stars complete — great practice!)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMathRound}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    <span>Next Problem</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
