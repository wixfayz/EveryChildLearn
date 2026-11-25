import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Palette,
  PlayCircle,
  Star,
  Volume2,
} from 'lucide-react';
import { HERO_IMAGE, VIDEO_LESSONS, type AppSection } from '../data/learningData';
import { getNextRankProgress, RANK_TIERS, type LearnerStats } from '../utils/progression';

interface HomeViewProps {
  learnerName: string;
  stats: LearnerStats;
  onNavigate: (section: AppSection) => void;
}

interface HeroSlide {
  id: string;
  target: AppSection;
  kicker: string;
  title: string;
  caption: string;
  image: string;
  imageAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-alphabets',
    target: 'alphabets',
    kicker: 'Alphabets & Reading',
    title: 'Master A–Z sounds step by step',
    caption: 'Tap any letter to hear clear phonics and practice everyday words.',
    image: HERO_IMAGE,
    imageAlt: 'A sunny wooden desk with colorful blocks, pencils, and an open storybook',
  },
  {
    id: 'slide-pronounce',
    target: 'pronounce',
    kicker: 'Clear Diction Lab',
    title: 'Hear any school word clearly',
    caption: 'Switch between normal and slow syllables, or type your own homework word.',
    image: VIDEO_LESSONS[0].thumbnail,
    imageAlt: 'An open picture book with colorful paper stars and speech bubbles',
  },
  {
    id: 'slide-videos',
    target: 'videos',
    kicker: 'Animated Video Lessons',
    title: 'Short visual explanations that stick',
    caption: 'Watch bite-sized lessons on vowels, simple addition, plants, and shapes.',
    image: VIDEO_LESSONS[1].thumbnail,
    imageAlt: 'Bright red apples and a wooden counting abacus on a warm desk',
  },
  {
    id: 'slide-draw',
    target: 'draw',
    kicker: 'Draw & Colour Studio',
    title: 'Colour pictures and express yourself',
    caption: 'Pick fun picture templates, paint with bright crayons, and save your artwork.',
    image: VIDEO_LESSONS[3].thumbnail,
    imageAlt: 'Colorful wooden geometric shapes arranged like a house and sailboat',
  },
];

const LEARNING_CARDS: {
  id: AppSection;
  title: string;
  subtitle: string;
  actionLabel: string;
  icon: typeof BookOpen;
  accentBg: string;
  accentText: string;
}[] = [
  {
    id: 'alphabets',
    title: 'Alphabets A–Z',
    subtitle: 'Hear clear letter sounds and practice A through Z.',
    actionLabel: 'Practice Letters',
    icon: BookOpen,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-700',
  },
  {
    id: 'pronounce',
    title: 'Word Pronunciation',
    subtitle: 'Listen to clear diction or type any homework word.',
    actionLabel: 'Hear Words',
    icon: Volume2,
    accentBg: 'bg-yellow-100',
    accentText: 'text-sky-900',
  },
  {
    id: 'videos',
    title: 'Simple Video Lessons',
    subtitle: 'Short animated lessons for English, Math, and Science.',
    actionLabel: 'Watch Lessons',
    icon: PlayCircle,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-700',
  },
  {
    id: 'quizzes',
    title: 'Quizzes & Games',
    subtitle: 'Pass subject quizzes and solve word & math puzzles.',
    actionLabel: 'Play & Quiz',
    icon: Gamepad2,
    accentBg: 'bg-yellow-100',
    accentText: 'text-sky-900',
  },
  {
    id: 'draw',
    title: 'Draw & Colour Studio',
    subtitle: 'Colour fun templates or draw freely and save your art.',
    actionLabel: 'Start Drawing',
    icon: Palette,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-700',
  },
];

export function HomeView({ learnerName, stats, onNavigate }: HomeViewProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const progress = getNextRankProgress(stats.stars);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[slideIndex];

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Compact App-Style Header + Interactive Feature Slide + Two Primary Buttons */}
      <section aria-label="Featured learning highlights" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            {learnerName && (
              <p className="text-sm font-semibold text-sky-700">Welcome back, {learnerName}</p>
            )}
            <h1
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
              style={{ textWrap: 'balance' }}
            >
              Learn at your own pace
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="p-2 rounded-xl bg-white border border-sky-200 text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="p-2 rounded-xl bg-white border border-sky-200 text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Slide Card */}
        <div
          data-testid="home-hero-slide"
          data-slide-id={activeSlide.id}
          className="bg-white border-2 border-sky-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
        >
          {/* Slide Artwork */}
          <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:min-h-[290px] bg-sky-50 overflow-hidden">
            {!imgErrors[activeSlide.id] ? (
              <img
                src={activeSlide.image}
                alt={activeSlide.imageAlt}
                referrerPolicy="no-referrer"
                onError={() =>
                  setImgErrors((prev) => ({ ...prev, [activeSlide.id]: true }))
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-700 font-display text-lg font-bold">
                {activeSlide.kicker}
              </div>
            )}
          </div>

          {/* Slide Content + Dots */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-sky-700">
                {activeSlide.kicker} · Slide {slideIndex + 1} of {HERO_SLIDES.length}
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900 leading-snug">
                {activeSlide.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeSlide.caption}
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => onNavigate(activeSlide.target)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
              >
                <span>Open {activeSlide.kicker}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Slide Indicator Dots */}
              <div className="flex items-center gap-2" role="group" aria-label="Select slide">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                    aria-current={idx === slideIndex ? 'true' : undefined}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === slideIndex
                        ? 'w-8 bg-sky-600'
                        : 'w-2.5 bg-sky-200 hover:bg-sky-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Primary Action Buttons underneath the slide */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('alphabets')}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-slate-950 bg-yellow-400 rounded-xl hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('videos')}
            className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold text-sky-800 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-sky-600" aria-hidden="true" />
            <span>Watch a Lesson</span>
          </button>
        </div>
      </section>

      {/* Rank Promotion Strip */}
      <section
        aria-label="Your learning rank progress"
        className="bg-white border border-sky-200 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Current Promotion Rank</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-sky-700">
                {stats.stars} Stars Earned
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {progress.currentRank.name} Learner
            </h2>
            <p className="text-sm text-slate-600">
              {progress.nextRank
                ? `Earn ${progress.starsToNext} more stars across lessons to get promoted to ${progress.nextRank.name}.`
                : 'You reached the top Expert level! Keep exploring and helping others.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('rewards')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors self-start md:self-center whitespace-nowrap cursor-pointer"
          >
            <Award className="w-4 h-4 text-sky-600" aria-hidden="true" />
            <span>View All Ranks & Rewards</span>
          </button>
        </div>

        {/* 3-Step Promotion Track: Beginner -> Professional -> Expert */}
        <div className="mt-5">
          <div
            className="h-3.5 w-full bg-sky-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress toward next promotion rank"
          >
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progress.percent, stats.stars > 0 ? 5 : 2)}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            {RANK_TIERS.map((tier) => {
              const reached = stats.stars >= tier.minStars;
              const isCurrent = progress.currentRank.id === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border ${
                    isCurrent
                      ? 'border-sky-400 bg-sky-50 text-sky-950 font-semibold'
                      : reached
                        ? 'border-yellow-300 bg-yellow-50 text-slate-900 font-medium'
                        : 'border-sky-100 bg-white text-slate-500'
                  }`}
                >
                  <span className="truncate">{tier.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs tabular-nums shrink-0 text-slate-700">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" aria-hidden="true" />
                    {tier.minStars}+
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 5 Learning Rooms */}
      <section aria-labelledby="choose-activity-heading" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="choose-activity-heading"
              className="font-display text-2xl font-bold text-slate-900"
            >
              Choose What to Learn Today
            </h2>
          </div>
          <p className="text-sm text-sky-800 font-medium tabular-nums">
            {stats.practicedLetters.length}/26 letters · {stats.watchedVideos.length}/4 videos ·{' '}
            {stats.completedQuizzes.length}/3 quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className="group text-left bg-white border border-sky-200 rounded-2xl p-5 hover:border-sky-400 hover:shadow-sm transition-all flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${card.accentBg} ${card.accentText} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{card.subtitle}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700">
                  <span>{card.actionLabel}</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
