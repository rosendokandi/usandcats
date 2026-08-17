export type TabType = 'home' | 'story' | 'memories' | 'notes';

export interface RoomInfo {
  roomId: string; // e.g. "LOVE-520"
  passwordHash: string;
  partner1: string;
  partner2: string;
  catName: string;
  startDate: string;
  avatarUrl: string;
  createdAt?: string;
  isCloudOnline?: boolean;
}

export interface Milestone {
  id: string;
  roomId?: string;
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
  roomId?: string;
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
  roomId?: string;
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

export interface RealtimeToastMsg {
  id: string;
  message: string;
  type: 'note' | 'photo' | 'story' | 'heart' | 'join';
  sender?: string;
}
