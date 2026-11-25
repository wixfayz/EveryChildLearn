import type { RankId } from '../utils/progression';

export type AppSection = 'home' | 'alphabets' | 'pronounce' | 'videos' | 'quizzes' | 'draw' | 'rewards';

export interface AlphabetItem {
  letter: string;
  lowercase: string;
  isVowel: boolean;
  soundLabel: string;
  spokenSound: string;
  word: string;
  sentence: string;
  phoneticTip: string;
  accentHex: string;
}

export interface PronunciationWord {
  id: string;
  word: string;
  level: RankId;
  category: 'Everyday' | 'School' | 'Science' | 'Tricky';
  syllables: string[];
  phonetic: string;
  meaning: string;
  example: string;
  dictionTip: string;
}

export interface VideoScene {
  id: string;
  title: string;
  caption: string;
  durationSec: number;
  visualType:
    | 'vowels-intro'
    | 'vowels-five'
    | 'vowels-words'
    | 'vowels-summary'
    | 'math-start'
    | 'math-combine'
    | 'math-count'
    | 'math-equation'
    | 'plant-seed'
    | 'plant-water'
    | 'plant-sun'
    | 'plant-bloom'
    | 'shape-circle'
    | 'shape-square'
    | 'shape-triangle'
    | 'shape-world';
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  level: RankId;
  durationLabel: string;
  summary: string;
  thumbnail: string;
  scenes: VideoScene[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  visualCue?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  subject: string;
  level: RankId;
  description: string;
  questions: QuizQuestion[];
}

export interface MissingLetterPuzzle {
  id: string;
  word: string;
  missingIndex: number;
  clue: string;
  choices: string[];
}

export const HERO_IMAGE = '/src/assets/images/hero_learning_desk_1795604160064.jpg';

export const ALPHABET_DATA: AlphabetItem[] = [
  { letter: 'A', lowercase: 'a', isVowel: true, soundLabel: 'ah', spokenSound: 'A says ah, like Apple', word: 'Apple', sentence: 'A crisp red apple is a healthy snack.', phoneticTip: 'Open your mouth wide and say "ah".', accentHex: '#E11D48' },
  { letter: 'B', lowercase: 'b', isVowel: false, soundLabel: 'buh', spokenSound: 'B says buh, like Ball', word: 'Ball', sentence: 'Bounce the big blue ball in the yard.', phoneticTip: 'Press both lips together softly, then pop them open.', accentHex: '#0284C7' },
  { letter: 'C', lowercase: 'c', isVowel: false, soundLabel: 'kuh', spokenSound: 'C says kuh, like Cat', word: 'Cat', sentence: 'The friendly cat naps on the mat.', phoneticTip: 'Make a short gentle sound at the back of your mouth.', accentHex: '#D97706' },
  { letter: 'D', lowercase: 'd', isVowel: false, soundLabel: 'duh', spokenSound: 'D says duh, like Drum', word: 'Drum', sentence: 'Tap a steady beat on the drum.', phoneticTip: 'Tap the tip of your tongue right behind your top teeth.', accentHex: '#059669' },
  { letter: 'E', lowercase: 'e', isVowel: true, soundLabel: 'eh', spokenSound: 'E says eh, like Egg', word: 'Egg', sentence: 'A little brown egg sits in the nest.', phoneticTip: 'Smile slightly and say a short "eh".', accentHex: '#E11D48' },
  { letter: 'F', lowercase: 'f', isVowel: false, soundLabel: 'fff', spokenSound: 'F says fff, like Fish', word: 'Fish', sentence: 'The orange fish swims through clear water.', phoneticTip: 'Rest your top teeth gently on your bottom lip and blow air.', accentHex: '#0284C7' },
  { letter: 'G', lowercase: 'g', isVowel: false, soundLabel: 'guh', spokenSound: 'G says guh, like Goat', word: 'Goat', sentence: 'The happy goat eats green grass.', phoneticTip: 'Lift the back of your tongue and use your voice.', accentHex: '#059669' },
  { letter: 'H', lowercase: 'h', isVowel: false, soundLabel: 'hhh', spokenSound: 'H says hhh, like Hat', word: 'Hat', sentence: 'Wear a warm hat when it is chilly.', phoneticTip: 'Breathe out gently like warming your hands.', accentHex: '#D97706' },
  { letter: 'I', lowercase: 'i', isVowel: true, soundLabel: 'ih', spokenSound: 'I says ih, like Igloo', word: 'Igloo', sentence: 'An igloo is a dome house built from snow.', phoneticTip: 'Make a quick bright "ih" sound.', accentHex: '#E11D48' },
  { letter: 'J', lowercase: 'j', isVowel: false, soundLabel: 'juh', spokenSound: 'J says juh, like Jug', word: 'Jug', sentence: 'Pour cool water from the jug.', phoneticTip: 'Push your lips slightly forward and say "juh".', accentHex: '#0284C7' },
  { letter: 'K', lowercase: 'k', isVowel: false, soundLabel: 'kuh', spokenSound: 'K says kuh, like Kite', word: 'Kite', sentence: 'The colorful kite flies high in the breeze.', phoneticTip: 'Make a crisp "k" puff from the back of your tongue.', accentHex: '#D97706' },
  { letter: 'L', lowercase: 'l', isVowel: false, soundLabel: 'lll', spokenSound: 'L says lll, like Leaf', word: 'Leaf', sentence: 'A green leaf grows on the tall tree.', phoneticTip: 'Touch the tip of your tongue behind your upper teeth.', accentHex: '#059669' },
  { letter: 'M', lowercase: 'm', isVowel: false, soundLabel: 'mmm', spokenSound: 'M says mmm, like Moon', word: 'Moon', sentence: 'The bright moon shines in the night sky.', phoneticTip: 'Close your lips gently and hum "mmm".', accentHex: '#0284C7' },
  { letter: 'N', lowercase: 'n', isVowel: false, soundLabel: 'nnn', spokenSound: 'N says nnn, like Nest', word: 'Nest', sentence: 'Two small birds built a cozy nest.', phoneticTip: 'Keep your lips open slightly and hum through your nose.', accentHex: '#D97706' },
  { letter: 'O', lowercase: 'o', isVowel: true, soundLabel: 'oh', spokenSound: 'O says aw, like Orange', word: 'Orange', sentence: 'Peel a sweet orange for lunch.', phoneticTip: 'Make a round circle shape with your lips.', accentHex: '#E11D48' },
  { letter: 'P', lowercase: 'p', isVowel: false, soundLabel: 'puh', spokenSound: 'P says puh, like Pencil', word: 'Pencil', sentence: 'Hold your yellow pencil to write neatly.', phoneticTip: 'Press lips together and release a light puff of air.', accentHex: '#0284C7' },
  { letter: 'Q', lowercase: 'q', isVowel: false, soundLabel: 'kwuh', spokenSound: 'Q says kwuh, like Queen', word: 'Queen', sentence: 'The kind queen reads stories to children.', phoneticTip: 'Say "k" and "w" smoothly together: "kwuh".', accentHex: '#059669' },
  { letter: 'R', lowercase: 'r', isVowel: false, soundLabel: 'rrr', spokenSound: 'R says rrr, like Rain', word: 'Rain', sentence: 'Soft rain helps the garden flowers drink.', phoneticTip: 'Curl your tongue slightly back without touching the roof.', accentHex: '#0284C7' },
  { letter: 'S', lowercase: 's', isVowel: false, soundLabel: 'sss', spokenSound: 'S says sss, like Sun', word: 'Sun', sentence: 'The warm sun rises every morning.', phoneticTip: 'Keep teeth close together and let air hiss gently.', accentHex: '#D97706' },
  { letter: 'T', lowercase: 't', isVowel: false, soundLabel: 'tuh', spokenSound: 'T says tuh, like Table', word: 'Table', sentence: 'Put your notebooks neatly on the table.', phoneticTip: 'Tap your tongue tip crisply behind your top teeth.', accentHex: '#059669' },
  { letter: 'U', lowercase: 'u', isVowel: true, soundLabel: 'uh', spokenSound: 'U says uh, like Umbrella', word: 'Umbrella', sentence: 'Open an umbrella to stay dry in the rain.', phoneticTip: 'Relax your mouth and say a short clear "uh".', accentHex: '#E11D48' },
  { letter: 'V', lowercase: 'v', isVowel: false, soundLabel: 'vvv', spokenSound: 'V says vvv, like Violin', word: 'Violin', sentence: 'A violin plays gentle musical notes.', phoneticTip: 'Like F, rest top teeth on bottom lip and turn on your voice.', accentHex: '#0284C7' },
  { letter: 'W', lowercase: 'w', isVowel: false, soundLabel: 'wuh', spokenSound: 'W says wuh, like Water', word: 'Water', sentence: 'Drink clean water to stay strong and focused.', phoneticTip: 'Round your lips like blowing a whistle, then open.', accentHex: '#059669' },
  { letter: 'X', lowercase: 'x', isVowel: false, soundLabel: 'ks', spokenSound: 'X says ks, like Box', word: 'Box', sentence: 'Pack the crayons inside the wooden box.', phoneticTip: 'Blend "k" and "s" quickly together: "ks".', accentHex: '#D97706' },
  { letter: 'Y', lowercase: 'y', isVowel: false, soundLabel: 'yuh', spokenSound: 'Y says yuh, like Yellow', word: 'Yellow', sentence: 'Paint the shining star bright yellow.', phoneticTip: 'Lift the middle of your tongue and glide smoothly.', accentHex: '#0284C7' },
  { letter: 'Z', lowercase: 'z', isVowel: false, soundLabel: 'zzz', spokenSound: 'Z says zzz, like Zebra', word: 'Zebra', sentence: 'The zebra has neat black and white stripes.', phoneticTip: 'Make the S sound while buzzing your voice gently.', accentHex: '#059669' },
];

export const PRONUNCIATION_WORDS: PronunciationWord[] = [
  // Beginner
  {
    id: 'apple',
    word: 'Apple',
    level: 'beginner',
    category: 'Everyday',
    syllables: ['ap', 'ple'],
    phonetic: 'AP-uhl',
    meaning: 'A sweet, round fruit that grows on trees.',
    example: 'I ate a fresh apple after school.',
    dictionTip: 'Stress the first part "AP" and keep the ending soft.',
  },
  {
    id: 'water',
    word: 'Water',
    level: 'beginner',
    category: 'Everyday',
    syllables: ['wa', 'ter'],
    phonetic: 'WAW-tuh',
    meaning: 'Clear liquid that people, animals, and plants need to live.',
    example: 'Please drink a cup of clean water.',
    dictionTip: 'Round your lips clearly on "WAW", then finish with "tuh".',
  },
  {
    id: 'school',
    word: 'School',
    level: 'beginner',
    category: 'School',
    syllables: ['school'],
    phonetic: 'SKOOL',
    meaning: 'A place where children go to learn new things every day.',
    example: 'We learn reading and math at school.',
    dictionTip: 'The "ch" sounds like a crisp "k", not "sh".',
  },
  {
    id: 'pencil',
    word: 'Pencil',
    level: 'beginner',
    category: 'School',
    syllables: ['pen', 'cil'],
    phonetic: 'PEN-suhl',
    meaning: 'A wooden tool used for writing and drawing.',
    example: 'Sharpen your pencil before starting the quiz.',
    dictionTip: 'Here the letter "c" makes a soft "s" sound.',
  },
  {
    id: 'flower',
    word: 'Flower',
    level: 'beginner',
    category: 'Science',
    syllables: ['flow', 'er'],
    phonetic: 'FLOU-uh',
    meaning: 'The colorful blooming part of a plant.',
    example: 'A bright yellow flower grew in the garden.',
    dictionTip: 'Blend "f" and "l" smoothly without adding a pause.',
  },
  {
    id: 'friend',
    word: 'Friend',
    level: 'beginner',
    category: 'Tricky',
    syllables: ['friend'],
    phonetic: 'FREND',
    meaning: 'Someone you like, trust, and enjoy learning with.',
    example: 'My friend helped me read the story.',
    dictionTip: 'The letter "i" is silent — say "frend" cleanly in one beat.',
  },
  // Professional
  {
    id: 'elephant',
    word: 'Elephant',
    level: 'professional',
    category: 'Everyday',
    syllables: ['el', 'e', 'phant'],
    phonetic: 'EL-uh-fuhnt',
    meaning: 'A very large, gentle animal with a long trunk.',
    example: 'The elephant used its trunk to spray water.',
    dictionTip: 'Remember that "ph" together sounds like "f".',
  },
  {
    id: 'library',
    word: 'Library',
    level: 'professional',
    category: 'School',
    syllables: ['li', 'bra', 'ry'],
    phonetic: 'LY-bruh-ree',
    meaning: 'A quiet room or building filled with books to read.',
    example: 'We borrowed two picture books from the library.',
    dictionTip: 'Pronounce both "r" sounds clearly: "li-bra-ry".',
  },
  {
    id: 'subtract',
    word: 'Subtract',
    level: 'professional',
    category: 'School',
    syllables: ['sub', 'tract'],
    phonetic: 'suhb-TRAKT',
    meaning: 'To take away one number from another number.',
    example: 'When you subtract two from five, you get three.',
    dictionTip: 'Put stronger energy on the second part "TRAKT" and finish the "t".',
  },
  {
    id: 'planet',
    word: 'Planet',
    level: 'professional',
    category: 'Science',
    syllables: ['plan', 'et'],
    phonetic: 'PLAN-it',
    meaning: 'A large round world that travels around a star like the Sun.',
    example: 'Earth is our home planet in the solar system.',
    dictionTip: 'Keep the first syllable crisp ("PLAN") and finish lightly with "it".',
  },
  {
    id: 'Wednesday',
    word: 'Wednesday',
    level: 'professional',
    category: 'Tricky',
    syllables: ['Wednes', 'day'],
    phonetic: 'WENZ-day',
    meaning: 'The middle day of the school week, after Tuesday.',
    example: 'We have our drawing class every Wednesday.',
    dictionTip: 'The first "d" is silent — say "WENZ-day" smoothly.',
  },
  {
    id: 'beautiful',
    word: 'Beautiful',
    level: 'professional',
    category: 'Everyday',
    syllables: ['beau', 'ti', 'ful'],
    phonetic: 'BYOO-tih-fuhl',
    meaning: 'Very pleasing and lovely to look at or hear.',
    example: 'You painted a beautiful rainbow today.',
    dictionTip: 'Start with a clear "BYOO" sound, followed by "tih-fuhl".',
  },
  // Expert
  {
    id: 'understand',
    word: 'Understand',
    level: 'expert',
    category: 'School',
    syllables: ['un', 'der', 'stand'],
    phonetic: 'uhn-duh-STAND',
    meaning: 'To know clearly what something means or how it works.',
    example: 'Taking my time helps me understand every lesson.',
    dictionTip: 'Break it into three clear beats and land strongly on "STAND".',
  },
  {
    id: 'pronunciation',
    word: 'Pronunciation',
    level: 'expert',
    category: 'Tricky',
    syllables: ['pro', 'nun', 'ci', 'a', 'tion'],
    phonetic: 'pruh-NUN-see-AY-shuhn',
    meaning: 'The clear and correct way to speak a word aloud.',
    example: 'Good pronunciation makes our speaking easy to hear.',
    dictionTip: 'Say "nun" (not "noun") in the middle, and "shuhn" at the end.',
  },
  {
    id: 'photosynthesis',
    word: 'Photosynthesis',
    level: 'expert',
    category: 'Science',
    syllables: ['pho', 'to', 'syn', 'the', 'sis'],
    phonetic: 'FOH-toh-SIN-thuh-sis',
    meaning: 'How green plants use sunlight, water, and air to make food.',
    example: 'Leaves make food for the tree through photosynthesis.',
    dictionTip: 'Tap your fingers on the desk for each of the five neat beats.',
  },
  {
    id: 'multiplication',
    word: 'Multiplication',
    level: 'expert',
    category: 'School',
    syllables: ['mul', 'ti', 'pli', 'ca', 'tion'],
    phonetic: 'muhl-tih-plih-KAY-shuhn',
    meaning: 'Adding the same equal group of numbers together quickly.',
    example: 'Multiplication turns 3 + 3 + 3 into 3 times 3.',
    dictionTip: 'Lift your voice gently on "KAY" before finishing with "shuhn".',
  },
  {
    id: 'knowledge',
    word: 'Knowledge',
    level: 'expert',
    category: 'Tricky',
    syllables: ['knowl', 'edge'],
    phonetic: 'NOL-ij',
    meaning: 'All the helpful facts and skills you learn and remember.',
    example: 'Every book we read adds to our knowledge.',
    dictionTip: 'The opening letter "k" is silent — begin directly with "NOL".',
  },
  {
    id: 'environment',
    word: 'Environment',
    level: 'expert',
    category: 'Science',
    syllables: ['en', 'vi', 'ron', 'ment'],
    phonetic: 'in-VY-ruhn-muhnt',
    meaning: 'The air, water, land, and living things all around us.',
    example: 'Planting trees keeps our environment clean and green.',
    dictionTip: 'Keep the "n" and "r" gently sounded across four smooth beats.',
  },
];

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vowels',
    title: 'Meet the 5 Vowels',
    subject: 'Reading & English',
    level: 'beginner',
    durationLabel: '4 scenes · ~35s',
    summary: 'Learn the 5 special letters (A, E, I, O, U) that help hold every word together.',
    thumbnail: '/src/assets/images/thumb_reading_lesson_1795604163390.jpg',
    scenes: [
      {
        id: 'v1',
        title: 'What Are Vowels?',
        caption: 'Out of 26 alphabet letters, 5 special letters are called Vowels. Almost every word needs at least one!',
        durationSec: 7,
        visualType: 'vowels-intro',
      },
      {
        id: 'v2',
        title: 'Say Them Together: A, E, I, O, U',
        caption: 'The five vowels are A, E, I, O, and U. Notice how your mouth stays open when you say each one clearly.',
        durationSec: 8,
        visualType: 'vowels-five',
      },
      {
        id: 'v3',
        title: 'Spot the Vowels Inside Words',
        caption: 'Look at C-A-T, P-E-N, S-U-N, and D-O-G. The vowel sits right in the middle and gives the word its voice!',
        durationSec: 8,
        visualType: 'vowels-words',
      },
      {
        id: 'v4',
        title: 'Great Job! You Know the Vowels',
        caption: 'All the other 21 letters are called Consonants. Together, vowels and consonants build every story we read.',
        durationSec: 7,
        visualType: 'vowels-summary',
      },
    ],
  },
  {
    id: 'addition',
    title: 'How Addition Works',
    subject: 'Simple Math',
    level: 'beginner',
    durationLabel: '4 scenes · ~35s',
    summary: 'See how putting two groups together makes addition easy and visual.',
    thumbnail: '/src/assets/images/thumb_math_lesson_1795604161595.jpg',
    scenes: [
      {
        id: 'm1',
        title: 'Addition Means Putting Together',
        caption: 'Addition simply means joining two groups together to find out how many we have in total.',
        durationSec: 7,
        visualType: 'math-start',
      },
      {
        id: 'm2',
        title: 'Start with 2 Apples, Add 3 More',
        caption: 'Imagine you have 2 bright red apples on your desk. Then a friend shares 3 more apples with you.',
        durationSec: 8,
        visualType: 'math-combine',
      },
      {
        id: 'm3',
        title: 'Count All of Them Slowly',
        caption: 'Let us count every apple together: one, two, three, four, five! Counting carefully makes math easy.',
        durationSec: 8,
        visualType: 'math-count',
      },
      {
        id: 'm4',
        title: 'Write It as 2 + 3 = 5',
        caption: 'The plus sign means join together, and the equals sign shows the total. Two plus three equals five!',
        durationSec: 7,
        visualType: 'math-equation',
      },
    ],
  },
  {
    id: 'plants',
    title: 'How a Little Plant Grows',
    subject: 'Everyday Science',
    level: 'professional',
    durationLabel: '4 scenes · ~35s',
    summary: 'Follow a tiny seed step by step as soil, water, and sunlight help it bloom.',
    thumbnail: '/src/assets/images/thumb_science_lesson_1795604162547.jpg',
    scenes: [
      {
        id: 'p1',
        title: 'Step 1: A Tiny Seed in Soil',
        caption: 'Every tall tree or bright flower begins as a tiny seed tucked safely inside rich dark soil.',
        durationSec: 7,
        visualType: 'plant-seed',
      },
      {
        id: 'p2',
        title: 'Step 2: Rain Gives It a Drink',
        caption: 'Gentle water softens the seed so little roots can grow downward and drink nutrients from the soil.',
        durationSec: 8,
        visualType: 'plant-water',
      },
      {
        id: 'p3',
        title: 'Step 3: Warm Sunlight Helps It Sprout',
        caption: 'A green stem pushes upward toward the warm sunlight. Sunlight gives the leaves energy to make food.',
        durationSec: 8,
        visualType: 'plant-sun',
      },
      {
        id: 'p4',
        title: 'Step 4: A Healthy Flower Blooms',
        caption: 'With soil, water, air, and sunlight, the little sprout grows strong leaves and blooms into a flower!',
        durationSec: 7,
        visualType: 'plant-bloom',
      },
    ],
  },
  {
    id: 'shapes',
    title: 'Shapes All Around Us',
    subject: 'Geometry',
    level: 'beginner',
    durationLabel: '4 scenes · ~35s',
    summary: 'Discover circles, squares, and triangles hiding in everyday things at home and school.',
    thumbnail: '/src/assets/images/thumb_shapes_lesson_1795604162792.jpg',
    scenes: [
      {
        id: 's1',
        title: 'Meet the Circle',
        caption: 'A circle is completely round with zero sharp corners — just like a wall clock, a wheel, or the bright sun.',
        durationSec: 7,
        visualType: 'shape-circle',
      },
      {
        id: 's2',
        title: 'Meet the Square',
        caption: 'A square has 4 straight equal sides and 4 neat corners — just like a window pane or a wooden block.',
        durationSec: 7,
        visualType: 'shape-square',
      },
      {
        id: 's3',
        title: 'Meet the Triangle',
        caption: 'A triangle has 3 straight sides and 3 pointed corners — like a sailboat sail or the roof of a house.',
        durationSec: 8,
        visualType: 'shape-triangle',
      },
      {
        id: 's4',
        title: 'Combine Shapes to Build Anything',
        caption: 'Put a triangle roof on top of a square wall and add a circle sun — shapes build the whole world around us!',
        durationSec: 7,
        visualType: 'shape-world',
      },
    ],
  },
];

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: 'alphabets-reading',
    title: 'Alphabets & Reading',
    subject: 'English',
    level: 'beginner',
    description: 'Practice vowels, starting letters, and simple words.',
    questions: [
      {
        id: 'q-eng-1',
        prompt: 'Which of these letters is a VOWEL?',
        visualCue: 'Remember the 5 special vowels: A, E, I, O, U',
        options: ['B', 'E', 'M', 'T'],
        correctIndex: 1,
        hint: 'Look for one of A, E, I, O, or U.',
        explanation: 'E is a vowel! B, M, and T are consonants.',
      },
      {
        id: 'q-eng-2',
        prompt: 'Which word starts with the letter "P"?',
        visualCue: 'Listen to the opening "puh" sound',
        options: ['Apple', 'Pencil', 'Zebra', 'Drum'],
        correctIndex: 1,
        hint: 'Think of the tool you write with at school.',
        explanation: 'Pencil starts with P — "puh" as in Pencil.',
      },
      {
        id: 'q-eng-3',
        prompt: 'How many letters are in the English alphabet?',
        visualCue: 'From A all the way to Z',
        options: ['20', '24', '26', '30'],
        correctIndex: 2,
        hint: 'There are 5 vowels and 21 consonants (5 + 21).',
        explanation: 'There are 26 letters in the English alphabet from A to Z.',
      },
      {
        id: 'q-eng-4',
        prompt: 'Which letter comes right after "M" in the alphabet?',
        visualCue: 'K, L, M, ___ , O',
        options: ['L', 'N', 'P', 'R'],
        correctIndex: 1,
        hint: 'Sing it slowly: K, L, M, ...',
        explanation: 'N comes right after M!',
      },
      {
        id: 'q-eng-5',
        prompt: 'In the word "Elephant", what sound do the letters "ph" make?',
        visualCue: 'EL - uh - ph - uhnt',
        options: ['Like "P"', 'Like "F"', 'Like "S"', 'Like "H"'],
        correctIndex: 1,
        hint: 'Say "elephant" slowly out loud.',
        explanation: '"ph" makes the "f" sound, just like in phone and photo!',
      },
    ],
  },
  {
    id: 'simple-math',
    title: 'Everyday Simple Math',
    subject: 'Math',
    level: 'beginner',
    description: 'Gentle counting, addition, subtraction, and shapes.',
    questions: [
      {
        id: 'q-math-1',
        prompt: 'You have 3 red apples and get 4 more. How many apples do you have now?',
        visualCue: '3 + 4 = ?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
        hint: 'Start at 3 and count up 4 steps: 4, 5, 6, ...',
        explanation: '3 + 4 equals 7 apples in total!',
      },
      {
        id: 'q-math-2',
        prompt: 'How many sides does a triangle have?',
        visualCue: 'Think of a roof or sailboat sail',
        options: ['2 sides', '3 sides', '4 sides', '5 sides'],
        correctIndex: 1,
        hint: '"Tri" means three, like a tricycle with 3 wheels.',
        explanation: 'Every triangle has 3 straight sides and 3 corners.',
      },
      {
        id: 'q-math-3',
        prompt: 'There are 9 pencils in a box. You give 2 to a friend. How many are left?',
        visualCue: '9 − 2 = ?',
        options: ['6', '7', '8', '11'],
        correctIndex: 1,
        hint: 'Count backwards 2 steps from 9: 8, 7.',
        explanation: '9 minus 2 leaves 7 pencils.',
      },
      {
        id: 'q-math-4',
        prompt: 'Which shape is completely round with zero corners?',
        visualCue: 'Like a clock face or a wheel',
        options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
        correctIndex: 2,
        hint: 'It rolls smoothly with no straight edges.',
        explanation: 'A circle is completely round with no corners.',
      },
      {
        id: 'q-math-5',
        prompt: 'What is 5 + 5?',
        visualCue: 'Count all the fingers on both hands!',
        options: ['8', '9', '10', '12'],
        correctIndex: 2,
        hint: 'Hold up 5 fingers on one hand and 5 on the other.',
        explanation: '5 + 5 = 10!',
      },
    ],
  },
  {
    id: 'everyday-science',
    title: 'Nature & Everyday Science',
    subject: 'Science',
    level: 'professional',
    description: 'Plants, weather, planets, and healthy habits.',
    questions: [
      {
        id: 'q-sci-1',
        prompt: 'What do green plants need along with water and air to make food?',
        visualCue: 'It shines warmly in the sky during the day',
        options: ['Sunlight', 'Rocks', 'Plastic', 'Shoes'],
        correctIndex: 0,
        hint: 'Plants grow toward the bright sky.',
        explanation: 'Plants use sunlight, water, and air to make food in their leaves.',
      },
      {
        id: 'q-sci-2',
        prompt: 'Which part of a plant grows under the soil to drink water?',
        visualCue: 'Hidden safely underneath the stem',
        options: ['Petals', 'Roots', 'Branches', 'Seeds'],
        correctIndex: 1,
        hint: 'They hold the plant steady in the ground.',
        explanation: 'Roots soak up water and nutrients from the soil.',
      },
      {
        id: 'q-sci-3',
        prompt: 'What is the name of the home planet we live on?',
        visualCue: 'The blue and green world in our solar system',
        options: ['Mars', 'Saturn', 'Earth', 'Venus'],
        correctIndex: 2,
        hint: 'It starts with the letter E.',
        explanation: 'Earth is our home planet!',
      },
      {
        id: 'q-sci-4',
        prompt: 'Which sense do we use with our ears to hear word pronunciation?',
        visualCue: 'Listening carefully to a voice',
        options: ['Sight', 'Hearing', 'Smell', 'Taste'],
        correctIndex: 1,
        hint: 'Our ears help us listen to sounds and music.',
        explanation: 'We use our sense of hearing with our ears.',
      },
      {
        id: 'q-sci-5',
        prompt: 'When water freezes in very cold weather, what does it turn into?',
        visualCue: 'Hard, cold, and clear',
        options: ['Steam', 'Ice', 'Sand', 'Soil'],
        correctIndex: 1,
        hint: 'You see cubes of it in cold drinks.',
        explanation: 'Liquid water freezes into solid ice when it gets very cold.',
      },
    ],
  },
];

export const MISSING_LETTER_PUZZLES: MissingLetterPuzzle[] = [
  { id: 'p1', word: 'APPLE', missingIndex: 0, clue: 'A crunchy red fruit that grows on a tree.', choices: ['A', 'E', 'O', 'B'] },
  { id: 'p2', word: 'WATER', missingIndex: 2, clue: 'A clear drink that keeps people and plants healthy.', choices: ['T', 'P', 'K', 'D'] },
  { id: 'p3', word: 'BOOK', missingIndex: 0, clue: 'Something full of pages and stories to read.', choices: ['B', 'D', 'M', 'S'] },
  { id: 'p4', word: 'SUN', missingIndex: 1, clue: 'The bright warm star shining in the daytime sky.', choices: ['U', 'A', 'I', 'E'] },
  { id: 'p5', word: 'FISH', missingIndex: 0, clue: 'An animal with fins that swims in rivers and oceans.', choices: ['F', 'V', 'L', 'R'] },
  { id: 'p6', word: 'STAR', missingIndex: 2, clue: 'A bright shape you earn as a reward when you learn.', choices: ['A', 'O', 'E', 'U'] },
  { id: 'p7', word: 'LEAF', missingIndex: 3, clue: 'The flat green part growing on a tree branch.', choices: ['F', 'T', 'N', 'M'] },
  { id: 'p8', word: 'HOME', missingIndex: 1, clue: 'The cozy place where your family lives.', choices: ['O', 'A', 'U', 'I'] },
];
