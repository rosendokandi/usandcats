import { Milestone, Memory, LoveNote, UserSettings } from '../types';

export const DEFAULT_SETTINGS: UserSettings = {
  startDate: '',
  partner1: '',
  partner2: '',
  catName: 'Mochi',
  avatarUrl: '/images/avatar-1.png',
  heroImage: '',
  soundEnabled: true,
  darkMode: false,
};

// Local pixel art placeholder for hero
export const DEFAULT_HERO_PLACEHOLDER = '/images/hero-key-house.png';

// Local pixel cat image
export const PIXEL_CAT_IMAGE = '/images/pixel-cat.png';

export const CAT_QUOTES = [
  "你是我最喜欢的人！✨",
  "喵呜！今天给我准备小鱼干了吗？🐟",
  "呼噜呼噜... 和你在一起的每一天都很甜！🐾",
  "今天也要记得多喝水、保持好心情哦！☕",
  "正在发射 100x 像素小爱心！❤️",
  "别忘了我们是世界上最好的拍档！🎮",
  "Mochi 最喜欢看你笑啦！🐱",
  "520% 的爱意正在加载中... 满格！💖"
];

// 100% User Generated - Starts completely empty for each couple room
export const DEFAULT_MILESTONES: Milestone[] = [];

// 100% User Generated - Starts completely empty for each couple room
export const DEFAULT_MEMORIES: Memory[] = [];

// 100% User Generated - Starts completely empty for each couple room
export const DEFAULT_LOVE_NOTES: LoveNote[] = [];
