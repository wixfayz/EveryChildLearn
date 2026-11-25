import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Star, Volume2 } from 'lucide-react';
import { ALPHABET_DATA, type AlphabetItem } from '../data/learningData';
import { LETTER_STARS } from '../utils/progression';
import { speakText } from '../utils/speech';

interface AlphabetSectionProps {
  practicedLetters: string[];
  onPracticeLetter: (letter: string) => void;
}

type LetterFilter = 'all' | 'vowels' | 'consonants';

export function AlphabetSection({ practicedLetters, onPracticeLetter }: AlphabetSectionProps) {
  const [filter, setFilter] = useState<LetterFilter>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [heardLetters, setHeardLetters] = useState<string[]>([]);
  const [speakingKind, setSpeakingKind] = useState<'letter' | 'word' | 'sentence' | null>(null);

  const markHeard = (letter: string) => {
    setHeardLetters((prev) => (prev.includes(letter) ? prev : [...prev, letter]));
  };

  const filteredLetters = ALPHABET_DATA.filter((item) => {
    if (filter === 'vowels') return item.isVowel;
    if (filter === 'consonants') return !item.isVowel;
    return true;
  });

  const currentItem: AlphabetItem =
    ALPHABET_DATA.find((item) => item.letter === selectedLetter) ?? ALPHABET_DATA[0];

  const currentIndex = ALPHABET_DATA.findIndex((item) => item.letter === currentItem.letter);
  const isPracticed = practicedLetters.includes(currentItem.letter);
  const hasHeardCurrent = heardLetters.includes(currentItem.letter);

  const handleSelect = (item: AlphabetItem) => {
    setSelectedLetter(item.letter);
    markHeard(item.letter);
    speakText(item.spokenSound, {
      speed: 'normal',
      onStart: () => setSpeakingKind('letter'),
      onEnd: () => setSpeakingKind(null),
    });
  };

  const handleStep = (direction: -1 | 1) => {
    const nextIdx = (currentIndex + direction + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    handleSelect(ALPHABET_DATA[nextIdx]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Alphabets A–Z</h1>
          <p className="text-slate-600 mt-1">
            Tap any letter below to hear its sound and practice an everyday word.
          </p>
        </div>

        {/* Clean segmented filter tabs */}
        <div
          role="tablist"
          aria-label="Filter letters"
          className="inline-flex items-center gap-1 p-1 bg-sky-100/80 rounded-xl self-start"
        >
          {(
            [
              { id: 'all', label: 'All 26' },
              { id: 'vowels', label: '5 Vowels' },
              { id: 'consonants', label: '21 Consonants' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => {
                setFilter(tab.id);
                const firstMatch = ALPHABET_DATA.find((l) =>
                  tab.id === 'vowels' ? l.isVowel : tab.id === 'consonants' ? !l.isVowel : true,
                );
                if (firstMatch) setSelectedLetter(firstMatch.letter);
              }}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-sky-800 hover:text-sky-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-zone Educational Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Big Interactive Letter Stage */}
        <section
          aria-label={`Letter ${currentItem.letter} details`}
          className="lg:col-span-5 bg-white border border-sky-200 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              {currentItem.isVowel ? 'Vowel' : 'Consonant'} · Letter {currentIndex + 1} of 26
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Previous letter"
                className="p-2 rounded-lg border border-sky-200 text-sky-800 hover:bg-sky-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Next letter"
                className="p-2 rounded-lg border border-sky-200 text-sky-800 hover:bg-sky-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Giant Display Letter */}
          <div className="rounded-2xl bg-sky-50/70 border border-sky-100 py-8 px-6 text-center space-y-3">
            <div className="font-display text-7xl sm:text-8xl font-bold tracking-tight text-sky-600">
              {currentItem.letter}
              <span className="ml-2 text-slate-800">{currentItem.lowercase}</span>
            </div>
            <p className="text-base font-medium text-slate-600">
              Sound: <strong className="text-slate-900">"{currentItem.soundLabel}"</strong> ·{' '}
              <strong className="text-slate-900">{currentItem.word}</strong>
            </p>
          </div>

          {/* Example Word & Mouth Tip */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-slate-900 leading-snug">
              "{currentItem.sentence}"
            </p>
            <p className="text-sm text-slate-800 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <span className="font-bold text-slate-950">Speaking tip: </span>
              {currentItem.phoneticTip}
            </p>
          </div>

          {/* Clear Voice Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                markHeard(currentItem.letter);
                speakText(currentItem.spokenSound, {
                  speed: 'slow',
                  onStart: () => setSpeakingKind('letter'),
                  onEnd: () => setSpeakingKind(null),
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{speakingKind === 'letter' ? 'Speaking...' : 'Hear Sound'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                markHeard(currentItem.letter);
                speakText(`${currentItem.word}. ${currentItem.sentence}`, {
                  speed: 'normal',
                  onStart: () => setSpeakingKind('word'),
                  onEnd: () => setSpeakingKind(null),
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-sky-900 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <span>{speakingKind === 'word' ? 'Speaking...' : 'Hear Sentence'}</span>
            </button>
          </div>

          {/* Practice Star Action */}
          <div className="pt-2 border-t border-sky-100 space-y-2">
            <button
              type="button"
              onClick={() => onPracticeLetter(currentItem.letter)}
              disabled={isPracticed || !hasHeardCurrent}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                isPracticed
                  ? 'bg-sky-50 text-sky-900 border border-sky-200 cursor-default'
                  : !hasHeardCurrent
                    ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                    : 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 cursor-pointer'
              }`}
            >
              {isPracticed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-sky-600" aria-hidden="true" />
                  <span>Practiced Letter {currentItem.letter}!</span>
                </>
              ) : !hasHeardCurrent ? (
                <span>Listen to Letter {currentItem.letter} first to earn +{LETTER_STARS} Stars</span>
              ) : (
                <>
                  <Star className="w-4 h-4 fill-slate-950 text-slate-950" aria-hidden="true" />
                  <span>
                    I Practiced Letter {currentItem.letter} (+{LETTER_STARS} Stars)
                  </span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Zone: Full Interactive A–Z Tile Grid */}
        <section aria-label="Alphabet board" className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Tap a letter tile to explore</span>
            <span className="tabular-nums font-medium text-slate-800">
              {practicedLetters.length} of 26 practiced
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {filteredLetters.map((item) => {
              const isSelected = item.letter === currentItem.letter;
              const done = practicedLetters.includes(item.letter);
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => handleSelect(item)}
                  aria-label={`Letter ${item.letter} for ${item.word}${done ? ', practiced' : ''}`}
                  aria-pressed={isSelected}
                  className={`relative rounded-2xl p-3 sm:p-4 text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : done
                        ? 'bg-yellow-50 text-slate-900 border-yellow-300 hover:border-yellow-400'
                        : 'bg-white text-slate-900 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                  }`}
                >
                  <div className="font-display text-2xl sm:text-3xl font-bold leading-none">
                    {item.letter}
                    <span
                      className={`text-lg font-medium ml-0.5 ${
                        isSelected ? 'text-yellow-200' : 'text-slate-400'
                      }`}
                    >
                      {item.lowercase}
                    </span>
                  </div>
                  <div
                    className={`mt-1.5 text-xs font-medium truncate ${
                      isSelected ? 'text-sky-100' : 'text-slate-500'
                    }`}
                  >
                    {item.word}
                  </div>
                  {done && !isSelected && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-sky-600 absolute top-2 right-2"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
