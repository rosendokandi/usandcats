export type TabType = 'home' | 'story' | 'memories' | 'notes';

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'meet' | 'trip' | 'love' | 'cat' | 'celebrate';
  icon: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: 'all' | 'cafe' | 'cat' | 'trip' | 'gift' | 'daily';
  aspectRatio: 'square' | 'portrait' | 'landscape';
  likes: number;
  isLiked?: boolean;
  tapeColor?: 'pink' | 'mint' | 'lavender';
  tapeRotation?: number;
}

export interface LoveNote {
  id: string;
  author: string;
  content: string;
  date: string;
  mood: string;
  moodIcon: string;
  bgColor: 'pink' | 'mint' | 'lavender' | 'cream';
  rotation: number;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  imageUrl?: string;
}

export interface UserSettings {
  startDate: string;
  partner1: string;
  partner2: string;
  catName: string;
  avatarUrl: string;
  soundEnabled: boolean;
  darkMode: boolean;
}
