export type DictionAccent = 'en-GB' | 'en-US';
export type SpeechSpeed = 'normal' | 'slow';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore browser speech cancellation quirks
  }
}

function pickBestEnglishVoice(accent: DictionAccent): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const exactLang = voices.filter((v) => v.lang.toLowerCase() === accent.toLowerCase());
  if (exactLang.length > 0) {
    const preferred = exactLang.find((v) => /natural|google|samantha|daniel|serena|aria/i.test(v.name));
    return preferred ?? exactLang[0];
  }

  const anyEnglish = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  if (anyEnglish.length > 0) {
    return anyEnglish[0];
  }

  return voices[0];
}

export function speakText(
  text: string,
  options?: {
    speed?: SpeechSpeed;
    accent?: DictionAccent;
    onEnd?: () => void;
    onStart?: () => void;
  },
): void {
  const cleaned = text.trim();
  if (!cleaned) return;

  if (!isSpeechSupported()) {
    options?.onStart?.();
    setTimeout(() => options?.onEnd?.(), 600);
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(cleaned);
  const accent = options?.accent ?? 'en-GB';
  const voice = pickBestEnglishVoice(accent);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = accent;
  }

  utterance.rate = options?.speed === 'slow' ? 0.65 : 0.92;
  utterance.pitch = 1.02;
  utterance.volume = 1;

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => options?.onEnd?.();

  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
}
