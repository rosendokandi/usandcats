import { Milestone, Memory, LoveNote, UserSettings } from '../types';

export const DEFAULT_SETTINGS: UserSettings = {
  startDate: '',
  partner1: '',
  partner2: '',
  catName: 'Mochi',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzz20depciI1E4xQB8bNanaiMnKCbIqQq0xtS6SNbKuQqXC7XWKF4T6PYZNMNnU8EwF1PkIiTGKocn8oQHlbNpy2-H-_0FNc4Vr2ZJQSjCTuevqZWfnzgojHHfsb4DhHYjy-xbRMZ8sCRTyy80x2mtYriAmAlGmAOprQX3ZKB2SEK4PjYIooKyircVD3GekH1U4i2cchQajazRmGD6uqCZsTP3JQknjmyVYviqYR0qDZv3nNg9Q1WD',
  heroImage: '',
  soundEnabled: true,
  darkMode: false,
};

// Default cute pixel art placeholder for hero
export const DEFAULT_HERO_PLACEHOLDER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdZJGwxsR0WzHKqb5h1IHxvcFlXc7a9AhxuD2-xj2YTMpLosRW4uXcSw0CaHMVOjhJvp8AybpiIkuf1QhxUpoLvaj8BUh6F3I6NbX21b8B_gg2dlE1TVoiJWGVmx9yIQXBE6EL6OF1o5CNiqTdjz4PpMBMkvCV_bBPuW7l2xz_LVjMI8orTY8q9IQvfZgAePFa2N6GmWdcjJSIhsL0Smg74JihGPG9ih_9OvKBM7SbNgC1A-8kPgUtvLmAIrlNIf2luwSdk8aQrRQ';

export const PIXEL_CAT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz0fUDuf_tm8uMkdsxkpaj7vHqDCVkDd0Gfv1IW9IHcvToNt3GDdKqLLjMx5VliNBs9sXyxRO7z7tfyOXbjN7-JQCnOeEwGLRcIErHwHDbKZUNSqg__WhD5NmjrACgudzXpwmGOHhf5IUUyTIAnCXj6FMi_esD_zOcun3s0dF40GTfQdzaXqAE_hqDwV4r3Zj_lK0RP07rz9wQtAMA85a1Tf-tbdlkQw8C-nRpf647R5FLpAXmwKkb';

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
