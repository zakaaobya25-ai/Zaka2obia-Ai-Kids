export const IMAGES = {
  Zaka2obia: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265852425_1342785d.jpg',
  hero: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265976970_f27b3a28.png',
  catBasics: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265873347_7b2d7067.png',
  catGen: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265887257_e19e53cb.jpg',
  catPrompt: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265915235_576ab27e.png',
  catSafety: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265932066_1a663e5b.jpg',
  catFuture: 'https://d64gsuwffb70l.cloudfront.net/6a1cb2fbde81a3610fd00d6d_1780265947710_8b564ea5.jpg',
};

export type Lang = 'ar' | 'en';
type LS = { ar: string; en: string };

export const t = (l: Lang, s: LS) => s[l];

export const UI = {
  appName: { ar: 'ذكائوبيا كيدز', en: 'Zaka2obia Kids AI' },
  tagline: { ar: 'تعلم الذكاء الاصطناعي... والعب مع المستقبل!', en: 'Learn AI... and play with the future!' },
  home: { ar: 'الرئيسية', en: 'Home' },
  learn: { ar: 'تعلّم', en: 'Learn' },
  lab: { ar: 'المختبر', en: 'Lab' },
  badges: { ar: 'الإنجازات', en: 'Badges' },
  profile: { ar: 'حسابي', en: 'Profile' },
  startLearning: { ar: 'ابدأ التعلّم', en: 'Start Learning' },
  practiceLab: { ar: 'مختبر التجارب', en: 'Practice Lab' },
  level: { ar: 'المستوى', en: 'Level' },
  streak: { ar: 'سلسلة الأيام', en: 'Day Streak' },
  coins: { ar: 'العملات', en: 'Coins' },
  continueLearning: { ar: 'أكمل التعلّم', en: 'Continue Learning' },
  myStats: { ar: 'إحصائياتي', en: 'My Stats' },
  lessonsDone: { ar: 'دروس مكتملة', en: 'Lessons Done' },
  watch: { ar: 'شاهد الآن', en: 'Watch Now' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  markDone: { ar: 'إنهاء الدرس', en: 'Complete Lesson' },
  parentZone: { ar: 'لوحة الوالدين', en: 'Parent Dashboard' },
  backToKid: { ar: 'العودة للطفل', en: 'Back to Kid' },
};

export interface Lesson { id: string; title: LS; mins: number; }
export interface Category { id: string; title: LS; desc: LS; img: string; color: string; lessons: Lesson[]; }

export const CATEGORIES: Category[] = [
  {
    id: 'basics', img: IMAGES.catBasics, color: 'from-blue-500 to-indigo-600',
    title: { ar: 'أساسيات الذكاء الاصطناعي', en: 'AI Basics' },
    desc: { ar: 'تعرّف على الذكاء الاصطناعي', en: 'Discover what AI is' },
    lessons: [
      { id: 'b1', mins: 5, title: { ar: 'ما هو الذكاء الاصطناعي؟', en: 'What is AI?' } },
      { id: 'b2', mins: 6, title: { ar: 'أين نستخدم الذكاء الاصطناعي؟', en: 'Where do we use AI?' } },
      { id: 'b3', mins: 4, title: { ar: 'الذكاء الاصطناعي في حياتنا اليومية', en: 'AI in daily life' } },
    ],
  },
  {
    id: 'gen', img: IMAGES.catGen, color: 'from-fuchsia-500 to-purple-600',
    title: { ar: 'الذكاء الاصطناعي التوليدي', en: 'Generative AI' },
    desc: { ar: 'أنشئ الصور والقصص والموسيقى', en: 'Create images, stories & music' },
    lessons: [
      { id: 'g1', mins: 5, title: { ar: 'إنشاء الصور', en: 'Creating images' } },
      { id: 'g2', mins: 5, title: { ar: 'إنشاء القصص', en: 'Creating stories' } },
      { id: 'g3', mins: 4, title: { ar: 'إنشاء الموسيقى', en: 'Creating music' } },
    ],
  },
  {
    id: 'prompt', img: IMAGES.catPrompt, color: 'from-teal-500 to-cyan-600',
    title: { ar: 'هندسة الأوامر', en: 'Prompt Engineering' },
    desc: { ar: 'تعلّم كيف تتحدث مع الذكاء الاصطناعي', en: 'Learn to talk to AI' },
    lessons: [
      { id: 'p1', mins: 6, title: { ar: 'كيف تتحدث مع الذكاء الاصطناعي', en: 'How to talk to AI' } },
      { id: 'p2', mins: 5, title: { ar: 'كتابة أوامر جيدة', en: 'Writing good prompts' } },
      { id: 'p3', mins: 7, title: { ar: 'تحديات الأوامر', en: 'Prompt challenges' } },
    ],
  },
  {
    id: 'safety', img: IMAGES.catSafety, color: 'from-emerald-500 to-green-600',
    title: { ar: 'الأمان الرقمي', en: 'AI Safety' },
    desc: { ar: 'استخدم الذكاء الاصطناعي بأمان', en: 'Use AI safely' },
    lessons: [
      { id: 's1', mins: 5, title: { ar: 'الاستخدام الآمن', en: 'Safe AI usage' } },
      { id: 's2', mins: 5, title: { ar: 'الخصوصية على الإنترنت', en: 'Online privacy' } },
      { id: 's3', mins: 4, title: { ar: 'الذكاء الاصطناعي المسؤول', en: 'Responsible AI' } },
    ],
  },
  {
    id: 'future', img: IMAGES.catFuture, color: 'from-orange-500 to-pink-600',
    title: { ar: 'تقنيات المستقبل', en: 'Future Technologies' },
    desc: { ar: 'الروبوتات والمدن الذكية', en: 'Robots & smart cities' },
    lessons: [
      { id: 'f1', mins: 6, title: { ar: 'الروبوتات', en: 'Robots' } },
      { id: 'f2', mins: 5, title: { ar: 'السيارات ذاتية القيادة', en: 'Self-driving cars' } },
      { id: 'f3', mins: 6, title: { ar: 'المدن الذكية', en: 'Smart cities' } },
    ],
  },
];

export const LEVELS = [
  { lvl: 1, xp: 0, name: { ar: 'مستكشف الذكاء', en: 'AI Explorer' }, emoji: '🔭', color: 'bg-blue-500' },
  { lvl: 2, xp: 150, name: { ar: 'صانع الأوامر', en: 'Prompt Creator' }, emoji: '✨', color: 'bg-teal-500' },
  { lvl: 3, xp: 400, name: { ar: 'مخترع الذكاء', en: 'AI Inventor' }, emoji: '🤖', color: 'bg-purple-500' },
  { lvl: 4, xp: 800, name: { ar: 'باني المستقبل', en: 'Future Builder' }, emoji: '🚀', color: 'bg-fuchsia-500' },
  { lvl: 5, xp: 1500, name: { ar: 'بطل الذكاء', en: 'AI Master Kid' }, emoji: '👑', color: 'bg-amber-500' },
];

export interface Badge { id: string; name: LS; desc: LS; icon: string; }
export const BADGES: Badge[] = [
  { id: 'first_lesson', icon: '🎓', name: { ar: 'أول درس', en: 'First Lesson' }, desc: { ar: 'أكملت أول درس', en: 'Complete first lesson' } },
  { id: 'first_prompt', icon: '💬', name: { ar: 'أول أمر', en: 'First Prompt' }, desc: { ar: 'كتبت أول أمر', en: 'Write first prompt' } },
  { id: 'ai_artist', icon: '🎨', name: { ar: 'فنان الذكاء', en: 'AI Artist' }, desc: { ar: 'أنشأت صورة', en: 'Create an image' } },
  { id: 'story_creator', icon: '📖', name: { ar: 'كاتب القصص', en: 'Story Creator' }, desc: { ar: 'أنشأت قصة', en: 'Create a story' } },
  { id: 'prompt_master', icon: '🏆', name: { ar: 'سيد الأوامر', en: 'Prompt Master' }, desc: { ar: '5 نجوم في لعبة الأوامر', en: '5 stars in prompt game' } },
  { id: 'streak_7', icon: '🔥', name: { ar: 'سلسلة 7 أيام', en: '7-Day Streak' }, desc: { ar: '7 أيام متتالية', en: '7 days in a row' } },
  { id: 'streak_30', icon: '⚡', name: { ar: 'سلسلة 30 يوم', en: '30-Day Streak' }, desc: { ar: '30 يوم متتالية', en: '30 days in a row' } },
  { id: 'explorer', icon: '🔭', name: { ar: 'المستكشف', en: 'Explorer' }, desc: { ar: 'وصلت للمستوى 2', en: 'Reach level 2' } },
  { id: 'inventor', icon: '🧪', name: { ar: 'المخترع', en: 'Inventor' }, desc: { ar: 'وصلت للمستوى 3', en: 'Reach level 3' } },
  { id: 'challenger', icon: '🎯', name: { ar: 'المتحدي', en: 'Challenger' }, desc: { ar: 'أكملت تحديًا', en: 'Complete a challenge' } },
  { id: 'curious', icon: '❓', name: { ar: 'الفضولي', en: 'Curious Mind' }, desc: { ar: '10 أسئلة لذكاؤبيا', en: 'Ask Zaka2obia 10 questions' } },
  { id: 'graduate', icon: '🌟', name: { ar: 'الخريج', en: 'Graduate' }, desc: { ar: 'أكملت فئة كاملة', en: 'Finish a full category' } },
];

export interface Challenge { id: string; title: LS; desc: LS; icon: string; xp: number; coins: number; }
export const CHALLENGES: Challenge[] = [
  { id: 'c1', icon: '📚', xp: 25, coins: 10, title: { ar: 'اكتب قصة مع الذكاء', en: 'Create a story with AI' }, desc: { ar: 'اطلب من ذكاؤبيا قصة عن صديق روبوت', en: 'Ask Zaka2obia for a story about a robot friend' } },
  { id: 'c2', icon: '🦸', xp: 30, coins: 15, title: { ar: 'صمّم بطلًا خارقًا', en: 'Generate a superhero' }, desc: { ar: 'صف بطلك الخارق المفضّل', en: 'Describe your favorite superhero' } },
  { id: 'c3', icon: '🏙️', xp: 35, coins: 20, title: { ar: 'صمّم مدينة ذكية', en: 'Design a smart city' }, desc: { ar: 'تخيّل مدينة المستقبل', en: 'Imagine a city of the future' } },
  { id: 'c4', icon: '🧩', xp: 20, coins: 10, title: { ar: 'حل لغز الذكاء', en: 'Solve an AI puzzle' }, desc: { ar: 'العب لعبة بناء الأوامر', en: 'Play the prompt builder game' } },
];

export const IMG_STYLES = [
  { id: 'cartoon', label: { ar: 'كرتون', en: 'Cartoon' }, emoji: '🎬' },
  { id: 'fantasy', label: { ar: 'خيال', en: 'Fantasy' }, emoji: '🧙' },
  { id: 'superhero', label: { ar: 'بطل خارق', en: 'Superhero' }, emoji: '🦸' },
  { id: 'animals', label: { ar: 'حيوانات', en: 'Animals' }, emoji: '🦁' },
  { id: 'space', label: { ar: 'فضاء', en: 'Space' }, emoji: '🚀' },
  { id: 'nature', label: { ar: 'طبيعة', en: 'Nature' }, emoji: '🌳' },
];

export const PROMPT_BLOCKS = {
  ar: ['ارسم', 'قطة', 'لطيفة', 'في الفضاء', 'بألوان زاهية', 'تطير', 'مع نجوم', 'بأسلوب كرتوني'],
  en: ['Draw', 'a cute', 'cat', 'in space', 'bright colors', 'flying', 'with stars', 'cartoon style'],
};
