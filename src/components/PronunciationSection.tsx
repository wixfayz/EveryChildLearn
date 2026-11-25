import { useState, type FormEvent } from 'react';
import { CheckCircle2, Search, Snail, Star, Volume2 } from 'lucide-react';
import { PRONUNCIATION_WORDS, type PronunciationWord } from '../data/learningData';
import { splitIntoSimpleSyllables, WORD_STARS, type RankId } from '../utils/progression';
import { speakText, type DictionAccent } from '../utils/speech';

interface PronunciationSectionProps {
  practicedWords: string[];
  onPracticeWord: (wordId: string) => void;
}

type LevelFilter = 'all' | RankId;

export function PronunciationSection({
  practicedWords,
  onPracticeWord,
}: PronunciationSectionProps) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [accent, setAccent] = useState<DictionAccent>('en-GB');
  const [selectedWord, setSelectedWord] = useState<PronunciationWord>(PRONUNCIATION_WORDS[0]);
  const [heardWordIds, setHeardWordIds] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const visibleWords = PRONUNCIATION_WORDS.filter((item) =>
    levelFilter === 'all' ? true : item.level === levelFilter,
  );

  const playWordWithDiction = (word: PronunciationWord, speed: 'normal' | 'slow') => {
    setIsSpeaking(true);
    setHeardWordIds((prev) => (prev.includes(word.id) ? prev : [...prev, word.id]));

    // Highlight syllables step by step in slow mode so children can follow along
    if (speed === 'slow' && word.syllables.length > 1) {
      word.syllables.forEach((_, idx) => {
        setTimeout(() => {
          setActiveSyllableIndex(idx);
        }, idx * 420);
      });
    } else {
      setActiveSyllableIndex(null);
    }

    speakText(word.word, {
      speed,
      accent,
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSyllableIndex(null);
      },
    });
  };

  const handleCustomSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) {
      setCustomError('Type any word from your school lesson to hear it.');
      return;
    }
    if (!/[a-zA-Z]/.test(trimmed)) {
      setCustomError('Please enter letters to pronounce a word.');
      return;
    }

    setCustomError('');
    const existing = PRONUNCIATION_WORDS.find(
      (item) => item.word.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      setSelectedWord(existing);
      playWordWithDiction(existing, 'slow');
      return;
    }

    const syllables = splitIntoSimpleSyllables(trimmed);
    const customWord: PronunciationWord = {
      id: `custom-${trimmed.toLowerCase()}`,
      word: trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(),
      level: 'beginner',
      category: 'School',
      syllables: syllables.length > 0 ? syllables : [trimmed.toLowerCase()],
      phonetic: syllables.join('-').toUpperCase(),
      meaning: 'Your own school homework word! Listen slowly and repeat each part clearly.',
      example: `Practice saying "${trimmed}" out loud two times.`,
      dictionTip: 'Tap Slow & Clear first, then try saying the whole word at normal speed.',
    };

    setSelectedWord(customWord);
    playWordWithDiction(customWord, 'slow');
  };

  const isPracticed = practicedWords.includes(selectedWord.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Accent Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Word Pronunciation & Diction
          </h1>
          <p className="text-slate-600 mt-1">
            Listen to words spoken clearly, follow the syllables, or type any homework word.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="diction-accent-select" className="text-sm font-medium text-slate-600">
            Voice diction:
          </label>
          <select
            id="diction-accent-select"
            value={accent}
            onChange={(e) => setAccent(e.target.value as DictionAccent)}
            className="px-3 py-2 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-800 cursor-pointer"
          >
            <option value="en-GB">British English (Clear)</option>
            <option value="en-US">American English (Clear)</option>
          </select>
        </div>
      </div>

      {/* Try Your Own Homework Word Bar */}
      <form
        onSubmit={handleCustomSubmit}
        className="bg-white border border-sky-200 rounded-2xl p-5 space-y-2"
      >
        <label htmlFor="custom-word-input" className="block text-sm font-semibold text-slate-800">
          Struggling with a word from your homework? Type it here:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="custom-word-input"
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (customError) setCustomError('');
              }}
              placeholder="e.g. rainbow, notebook, butterfly..."
              className="w-full pl-10 pr-4 py-2.5 text-base bg-sky-50/50 border border-sky-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-950 bg-yellow-400 rounded-xl hover:bg-yellow-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>Pronounce Word</span>
          </button>
        </div>
        {customError && (
          <p role="alert" className="text-sm text-rose-700 font-medium">
            {customError}
          </p>
        )}
      </form>

      {/* Two-zone Diction Stage + Word Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Diction Card */}
        <section
          aria-label={`Pronunciation guide for ${selectedWord.word}`}
          className="lg:col-span-5 bg-white border border-sky-200 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="capitalize">
              {selectedWord.level} level · {selectedWord.category}
            </span>
            <span>{selectedWord.syllables.length} syllable{selectedWord.syllables.length === 1 ? '' : 's'}</span>
          </div>

          {/* Big Word + Syllable Chunks */}
          <div className="rounded-2xl bg-sky-50/70 border border-sky-100 p-6 text-center space-y-4">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              {selectedWord.word}
            </h2>

            {/* Syllable Breakdown */}
            <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Syllable breakdown">
              {selectedWord.syllables.map((part, idx) => (
                <span key={`${part}-${idx}`} className="inline-flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-lg font-semibold transition-colors ${
                      activeSyllableIndex === idx
                        ? 'bg-yellow-400 text-slate-950'
                        : 'bg-white border border-sky-200 text-sky-950'
                    }`}
                  >
                    {part}
                  </span>
                  {idx < selectedWord.syllables.length - 1 && (
                    <span className="text-sky-400 font-bold" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            <p className="text-sm font-medium text-sky-800">
              Say it like: <span className="font-bold tracking-wide">{selectedWord.phonetic}</span>
            </p>
          </div>

          {/* Meaning & Example */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500">Meaning</p>
              <p className="text-base text-slate-800 mt-0.5">{selectedWord.meaning}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">In a sentence</p>
              <p className="text-sm text-slate-700 mt-0.5">"{selectedWord.example}"</p>
            </div>
            <p className="text-sm text-slate-800 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <span className="font-bold text-slate-950">Diction tip: </span>
              {selectedWord.dictionTip}
            </p>
          </div>

          {/* Playback Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => playWordWithDiction(selectedWord, 'normal')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{isSpeaking ? 'Listening...' : 'Normal Diction'}</span>
            </button>

            <button
              type="button"
              onClick={() => playWordWithDiction(selectedWord, 'slow')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-sky-900 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Snail className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <span>Slow & Clear</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              speakText(selectedWord.example, {
                speed: 'normal',
                accent,
              })
            }
            className="w-full py-2.5 px-4 text-sm font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors cursor-pointer"
          >
            Hear the full example sentence
          </button>

          {/* Mark Practiced */}
          <div className="pt-2 border-t border-sky-100">
            {selectedWord.id.startsWith('custom-') ? (
              <p className="text-center text-xs font-medium text-sky-800 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
                Free homework practice! Practice words from the school list on the right to earn +{WORD_STARS} Stars each.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => onPracticeWord(selectedWord.id)}
                disabled={isPracticed || !heardWordIds.includes(selectedWord.id)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                  isPracticed
                    ? 'bg-sky-50 text-sky-900 border border-sky-200 cursor-default'
                    : !heardWordIds.includes(selectedWord.id)
                      ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                      : 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 cursor-pointer'
                }`}
              >
                {isPracticed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sky-600" aria-hidden="true" />
                    <span>You Practiced "{selectedWord.word}"!</span>
                  </>
                ) : !heardWordIds.includes(selectedWord.id) ? (
                  <span>Listen to "{selectedWord.word}" first to earn +{WORD_STARS} Stars</span>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-slate-950 text-slate-950" aria-hidden="true" />
                    <span>
                      I Said "{selectedWord.word}" Clearly! (+{WORD_STARS} Stars)
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Right: Filterable Word List by Rank Level */}
        <section aria-label="Word practice list" className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Filter words by difficulty level"
              className="inline-flex items-center gap-1 p-1 bg-sky-100/80 rounded-xl"
            >
              {(
                [
                  { id: 'all', label: 'All Words' },
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'professional', label: 'Professional' },
                  { id: 'expert', label: 'Expert' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={levelFilter === tab.id}
                  onClick={() => setLevelFilter(tab.id)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    levelFilter === tab.id
                      ? 'bg-white text-sky-900 shadow-xs'
                      : 'text-sky-800 hover:text-sky-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-sm text-sky-800 font-medium tabular-nums">
              {practicedWords.length} words practiced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleWords.map((item) => {
              const isSelected = selectedWord.id === item.id;
              const done = practicedWords.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedWord(item);
                    playWordWithDiction(item, 'normal');
                  }}
                  aria-pressed={isSelected}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600'
                      : done
                        ? 'bg-yellow-50 text-slate-900 border-yellow-300 hover:border-yellow-400'
                        : 'bg-white text-slate-900 border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold truncate">{item.word}</div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        isSelected ? 'text-sky-100' : 'text-slate-500'
                      }`}
                    >
                      {item.syllables.join(' · ')} — {item.level}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {done && !isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-sky-600" aria-hidden="true" />
                    ) : (
                      <Volume2
                        className={`w-5 h-5 ${isSelected ? 'text-yellow-300' : 'text-sky-600'}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
