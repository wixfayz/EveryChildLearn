import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VIDEO_LESSONS, type VideoLesson, type VideoScene } from '../data/learningData';
import { VIDEO_STARS } from '../utils/progression';
import { speakText, stopSpeaking } from '../utils/speech';

interface VideoSectionProps {
  watchedVideos: string[];
  onCompleteVideo: (videoId: string) => void;
}

function AnimatedLessonStage({
  scene,
  isPlaying,
}: {
  scene: VideoScene;
  isPlaying: boolean;
}) {
  const pulseTransition = isPlaying
    ? { duration: 1.8, repeat: Infinity, repeatType: 'reverse' as const }
    : { duration: 0.2 };

  switch (scene.visualType) {
    case 'vowels-intro':
    case 'vowels-five':
    case 'vowels-summary': {
      const vowels = ['A', 'E', 'I', 'O', 'U'];
      const colors = ['#E11D48', '#D97706', '#059669', '#0284C7', '#4F46E5'];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 bg-gradient-to-b from-sky-50 to-white">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {vowels.map((v, idx) => (
              <motion.div
                key={v}
                initial={{ y: 12, opacity: 0 }}
                animate={{
                  y: isPlaying ? [0, -10, 0] : 0,
                  opacity: 1,
                }}
                transition={{
                  duration: isPlaying ? 1.4 : 0.35,
                  delay: idx * 0.14,
                  repeat: isPlaying ? Infinity : 0,
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-display text-3xl sm:text-4xl font-bold text-white shadow-sm"
                style={{ backgroundColor: colors[idx] }}
              >
                {v}
              </motion.div>
            ))}
          </div>
          <p className="font-display text-lg sm:text-xl font-semibold text-slate-800 text-center">
            {scene.visualType === 'vowels-summary'
              ? '5 Vowels + 21 Consonants = 26 Letters!'
              : 'The 5 Special Vowel Letters'}
          </p>
        </div>
      );
    }

    case 'vowels-words': {
      const examples = [
        { before: 'C', vowel: 'A', after: 'T' },
        { before: 'P', vowel: 'E', after: 'N' },
        { before: 'D', vowel: 'O', after: 'G' },
        { before: 'S', vowel: 'U', after: 'N' },
      ];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 bg-gradient-to-b from-amber-50/70 to-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {examples.map((ex, i) => (
              <motion.div
                key={ex.before + ex.vowel}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 font-display text-2xl sm:text-3xl font-bold tracking-wider text-slate-800 text-center"
              >
                <span>{ex.before}</span>
                <span className="text-rose-600 underline decoration-2 underline-offset-4">
                  {ex.vowel}
                </span>
                <span>{ex.after}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-600">
            The highlighted red letter in the middle is the Vowel!
          </p>
        </div>
      );
    }

    case 'math-start':
    case 'math-combine':
    case 'math-count':
    case 'math-equation': {
      const leftApples = [1, 2];
      const rightApples = [3, 4, 5];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 bg-gradient-to-b from-rose-50/50 to-white">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {leftApples.map((n) => (
                <motion.div
                  key={n}
                  animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ ...pulseTransition, delay: n * 0.15 }}
                  className="w-12 h-12 rounded-full bg-rose-500 text-white font-display font-bold text-lg flex items-center justify-center shadow-xs"
                >
                  {scene.visualType === 'math-count' || scene.visualType === 'math-equation' ? n : ''}
                </motion.div>
              ))}
            </div>

            <span className="font-display text-3xl sm:text-4xl font-bold text-sky-700">+</span>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3">
              {rightApples.map((n) => (
                <motion.div
                  key={n}
                  animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ ...pulseTransition, delay: n * 0.15 }}
                  className="w-12 h-12 rounded-full bg-amber-500 text-white font-display font-bold text-lg flex items-center justify-center shadow-xs"
                >
                  {scene.visualType === 'math-count' || scene.visualType === 'math-equation' ? n : ''}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tabular-nums">
            {scene.visualType === 'math-start' && '2 Apples  +  3 Apples'}
            {scene.visualType === 'math-combine' && 'Putting 2 and 3 Together'}
            {scene.visualType === 'math-count' && '1 · 2 · 3 · 4 · 5 Apples!'}
            {scene.visualType === 'math-equation' && '2 + 3 = 5'}
          </div>
        </div>
      );
    }

    case 'plant-seed':
    case 'plant-water':
    case 'plant-sun':
    case 'plant-bloom': {
      const stage =
        scene.visualType === 'plant-seed'
          ? 1
          : scene.visualType === 'plant-water'
            ? 2
            : scene.visualType === 'plant-sun'
              ? 3
              : 4;
      return (
        <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-gradient-to-b from-sky-50 via-emerald-50/30 to-amber-50/40">
          <svg
            viewBox="0 0 360 200"
            className="w-full max-w-md h-48 sm:h-56"
            role="img"
            aria-label={scene.title}
          >
            {/* Sun */}
            {stage >= 3 && (
              <motion.g
                animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={pulseTransition}
                style={{ transformOrigin: '290px 44px' }}
              >
                <circle cx="290" cy="44" r="24" fill="#F59E0B" />
                <circle cx="290" cy="44" r="32" fill="#FDE68A" opacity="0.45" />
              </motion.g>
            )}

            {/* Raindrops */}
            {stage >= 2 && (
              <motion.g
                animate={isPlaying ? { y: [0, 14, 0] } : { y: 0 }}
                transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0 }}
              >
                <circle cx="135" cy="60" r="5" fill="#0284C7" />
                <circle cx="165" cy="45" r="5" fill="#0284C7" />
                <circle cx="205" cy="58" r="5" fill="#0284C7" />
              </motion.g>
            )}

            {/* Soil ground */}
            <rect x="40" y="150" width="280" height="34" rx="14" fill="#92400E" />

            {/* Seed */}
            <ellipse cx="180" cy="158" rx="12" ry="8" fill="#F59E0B" />

            {/* Roots */}
            {stage >= 2 && (
              <path
                d="M180 165 L168 178 M180 165 L180 180 M180 165 L194 178"
                stroke="#FDE68A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Growing Stem & Leaves */}
            {stage >= 3 && (
              <motion.g
                initial={{ scaleY: 0.4, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                style={{ transformOrigin: '180px 150px' }}
              >
                <path d="M180 150 L180 86" stroke="#059669" strokeWidth="7" strokeLinecap="round" />
                <ellipse cx="156" cy="116" rx="22" ry="11" fill="#10B981" transform="rotate(-20 156 116)" />
                <ellipse cx="204" cy="116" rx="22" ry="11" fill="#10B981" transform="rotate(20 204 116)" />
              </motion.g>
            )}

            {/* Blooming Flower */}
            {stage >= 4 && (
              <motion.g
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: '180px 76px' }}
              >
                <circle cx="180" cy="58" r="14" fill="#F43F5E" />
                <circle cx="198" cy="72" r="14" fill="#F43F5E" />
                <circle cx="192" cy="92" r="14" fill="#F43F5E" />
                <circle cx="168" cy="92" r="14" fill="#F43F5E" />
                <circle cx="162" cy="72" r="14" fill="#F43F5E" />
                <circle cx="180" cy="76" r="13" fill="#FBBF24" />
              </motion.g>
            )}
          </svg>
        </div>
      );
    }

    case 'shape-circle':
    case 'shape-square':
    case 'shape-triangle':
    case 'shape-world': {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 bg-gradient-to-b from-indigo-50/40 to-white">
          <svg
            viewBox="0 0 360 180"
            className="w-full max-w-md h-44 sm:h-52"
            role="img"
            aria-label={scene.title}
          >
            {scene.visualType === 'shape-circle' && (
              <motion.circle
                cx="180"
                cy="90"
                r="58"
                fill="#F59E0B"
                animate={isPlaying ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={pulseTransition}
                style={{ transformOrigin: '180px 90px' }}
              />
            )}
            {scene.visualType === 'shape-square' && (
              <motion.rect
                x="124"
                y="34"
                width="112"
                height="112"
                rx="8"
                fill="#0284C7"
                animate={isPlaying ? { rotate: [0, 3, -3, 0] } : { rotate: 0 }}
                transition={pulseTransition}
                style={{ transformOrigin: '180px 90px' }}
              />
            )}
            {scene.visualType === 'shape-triangle' && (
              <motion.polygon
                points="180,26 246,144 114,144"
                fill="#059669"
                animate={isPlaying ? { y: [0, -6, 0] } : { y: 0 }}
                transition={pulseTransition}
              />
            )}
            {scene.visualType === 'shape-world' && (
              <g>
                <circle cx="290" cy="48" r="24" fill="#F59E0B" />
                <polygon points="180,34 252,92 108,92" fill="#E11D48" />
                <rect x="122" y="92" width="116" height="72" rx="4" fill="#0284C7" />
                <rect x="166" y="122" width="28" height="42" rx="4" fill="#FDE68A" />
              </g>
            )}
          </svg>
          <p className="font-display text-lg font-semibold text-slate-800">{scene.title}</p>
        </div>
      );
    }
  }
}

export function VideoSection({ watchedVideos, onCompleteVideo }: VideoSectionProps) {
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson>(VIDEO_LESSONS[0]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const currentScene = selectedLesson.scenes[sceneIndex] ?? selectedLesson.scenes[0];
  const isWatched = watchedVideos.includes(selectedLesson.id);

  // Clean up speech on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Auto-advance scenes and narrate when playing
  useEffect(() => {
    if (!isPlaying) {
      stopSpeaking();
      return;
    }

    if (voiceEnabled) {
      speakText(`${currentScene.title}. ${currentScene.caption}`, { speed: 'normal' });
    }

    const timer = window.setTimeout(() => {
      if (sceneIndex < selectedLesson.scenes.length - 1) {
        setSceneIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        onCompleteVideo(selectedLesson.id);
      }
    }, currentScene.durationSec * 1000);

    return () => window.clearTimeout(timer);
  }, [isPlaying, sceneIndex, selectedLesson, currentScene, voiceEnabled, onCompleteVideo]);

  const handleSelectLesson = (lesson: VideoLesson) => {
    stopSpeaking();
    setSelectedLesson(lesson);
    setSceneIndex(0);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && sceneIndex === selectedLesson.scenes.length - 1) {
      setSceneIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    stopSpeaking();
    setSceneIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Simple Video Lessons</h1>
        <p className="text-slate-600 mt-1">
          Short, clear animated lessons with spoken explanations to help you understand school topics easily.
        </p>
      </div>

      {/* Main Interactive Video Player */}
      <section
        aria-label={`Video player: ${selectedLesson.title}`}
        className="bg-white border border-sky-200 rounded-2xl overflow-hidden"
      >
        {/* Top Metadata Bar */}
        <div className="px-6 py-4 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-sky-700">
              {selectedLesson.subject} · {selectedLesson.durationLabel}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {selectedLesson.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onCompleteVideo(selectedLesson.id)}
            disabled={isWatched || sceneIndex < selectedLesson.scenes.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
              isWatched
                ? 'bg-sky-50 text-sky-900 border border-sky-200 cursor-default'
                : sceneIndex < selectedLesson.scenes.length - 1
                  ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                  : 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 cursor-pointer'
            }`}
          >
            {isWatched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-sky-600" aria-hidden="true" />
                <span>Lesson Completed</span>
              </>
            ) : sceneIndex < selectedLesson.scenes.length - 1 ? (
              <span>Finish all {selectedLesson.scenes.length} scenes for +{VIDEO_STARS} ★</span>
            ) : (
              <>
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" aria-hidden="true" />
                <span>Claim +{VIDEO_STARS} Stars</span>
              </>
            )}
          </button>
        </div>

        {/* Animated Stage */}
        <div className="h-[260px] sm:h-[310px] w-full relative border-b border-sky-100">
          <AnimatedLessonStage scene={currentScene} isPlaying={isPlaying} />
        </div>

        {/* Subtitle & Controls Deck */}
        <div className="p-6 space-y-5 bg-white">
          {/* Clear Large Subtitle Caption */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl px-5 py-4 space-y-1">
            <p className="text-xs font-semibold text-sky-700 tabular-nums">
              Scene {sceneIndex + 1} of {selectedLesson.scenes.length} · {currentScene.title}
            </p>
            <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed">
              {currentScene.caption}
            </p>
          </div>

          {/* Scene Timeline Dots */}
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Lesson scenes">
            {selectedLesson.scenes.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSceneIndex(idx);
                }}
                aria-label={`Jump to scene ${idx + 1}: ${sc.title}`}
                className={`h-2.5 rounded-full transition-colors cursor-pointer ${
                  idx === sceneIndex
                    ? 'bg-sky-600'
                    : idx < sceneIndex
                      ? 'bg-yellow-400'
                      : 'bg-sky-100 hover:bg-sky-200'
                }`}
              />
            ))}
          </div>

          {/* Playback Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" aria-hidden="true" />
                    <span>Pause Lesson</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>Play Lesson</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSceneIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={sceneIndex === 0}
                aria-label="Previous scene"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-sky-900 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 cursor-pointer"
              >
                <SkipBack className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSceneIndex((prev) => Math.min(selectedLesson.scenes.length - 1, prev + 1));
                }}
                disabled={sceneIndex === selectedLesson.scenes.length - 1}
                aria-label="Next scene"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-sky-900 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <SkipForward className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-sky-900 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Replay</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) stopSpeaking();
                setVoiceEnabled((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-sky-900 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors cursor-pointer"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  <span>Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  <span>Voice Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Video Lesson Library Cards */}
      <section aria-labelledby="all-videos-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="all-videos-heading" className="font-display text-xl font-bold text-slate-900">
            All Explanatory Lessons
          </h2>
          <span className="text-sm text-sky-800 font-medium tabular-nums">
            {watchedVideos.length} of {VIDEO_LESSONS.length} watched
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VIDEO_LESSONS.map((lesson) => {
            const active = selectedLesson.id === lesson.id;
            const done = watchedVideos.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(lesson)}
                aria-pressed={active}
                className={`text-left bg-white rounded-2xl overflow-hidden border transition-all flex flex-col cursor-pointer ${
                  active
                    ? 'border-sky-600 ring-2 ring-yellow-300'
                    : 'border-sky-200 hover:border-sky-400'
                }`}
              >
                <div className="aspect-video w-full bg-sky-50 relative overflow-hidden">
                  {!imgErrors[lesson.id] ? (
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [lesson.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-700 font-display font-bold">
                      {lesson.subject}
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-sky-700">
                      {lesson.subject} · {lesson.durationLabel}
                    </p>
                    <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>

                  {done && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Watched</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
