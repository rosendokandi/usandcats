import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabType, Milestone, Memory, LoveNote, UserSettings } from '../types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_MILESTONES, 
  DEFAULT_MEMORIES, 
  DEFAULT_LOVE_NOTES 
} from '../utils/defaultData';
import { sound } from '../utils/sound';
import { fireHeartShower } from '../utils/confetti';

interface AppContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  daysTogether: number;
  timeTogetherDetails: { days: number; hours: number; minutes: number; seconds: number };
  
  milestones: Milestone[];
  addMilestone: (m: Omit<Milestone, 'id' | 'likes'>) => void;
  toggleLikeMilestone: (id: string) => void;

  memories: Memory[];
  addMemory: (mem: Omit<Memory, 'id' | 'likes'>) => void;
  toggleLikeMemory: (id: string) => void;
  deleteMemory: (id: string) => void;

  loveNotes: LoveNote[];
  addLoveNote: (note: Omit<LoveNote, 'id' | 'likes' | 'rotation'>) => void;
  toggleLikeLoveNote: (id: string) => void;
  togglePinLoveNote: (id: string) => void;
  deleteLoveNote: (id: string) => void;

  // Modals
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAddMilestoneOpen: boolean;
  setIsAddMilestoneOpen: (open: boolean) => void;
  isAddMemoryOpen: boolean;
  setIsAddMemoryOpen: (open: boolean) => void;
  lightboxImage: { url: string; title?: string } | null;
  setLightboxImage: (img: { url: string; title?: string } | null) => void;

  triggerHeartShower: (e?: React.MouseEvent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTabState] = useState<TabType>('home');

  // Load / Save Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('us_cats_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('us_cats_milestones');
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
  });

  // Memories
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('us_cats_memories');
    return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
  });

  // Love Notes
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>(() => {
    const saved = localStorage.getItem('us_cats_notes');
    return saved ? JSON.parse(saved) : DEFAULT_LOVE_NOTES;
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title?: string } | null>(null);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Sync dark mode class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // LocalStorage Persist
  useEffect(() => {
    localStorage.setItem('us_cats_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('us_cats_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('us_cats_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('us_cats_notes', JSON.stringify(loveNotes));
  }, [loveNotes]);

  // Navigation tab change with sound
  const setCurrentTab = (tab: TabType) => {
    sound.playClick();
    setCurrentTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate days together
  const [timeDetails, setTimeDetails] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(settings.startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeDetails({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [settings.startDate]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Milestone Actions
  const addMilestone = (m: Omit<Milestone, 'id' | 'likes'>) => {
    const newM: Milestone = {
      ...m,
      id: `m-${Date.now()}`,
      likes: 1,
      isLiked: true,
    };
    setMilestones(prev => [newM, ...prev]);
    sound.playSuccess();
    fireHeartShower();
  };

  const toggleLikeMilestone = (id: string) => {
    sound.playHeart();
    setMilestones(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        return {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
      }
      return item;
    }));
  };

  // Memory Actions
  const addMemory = (mem: Omit<Memory, 'id' | 'likes'>) => {
    const newMem: Memory = {
      ...mem,
      id: `mem-${Date.now()}`,
      likes: 1,
      isLiked: true,
    };
    setMemories(prev => [newMem, ...prev]);
    sound.playSuccess();
    fireHeartShower();
  };

  const toggleLikeMemory = (id: string) => {
    sound.playHeart();
    setMemories(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        return {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
      }
      return item;
    }));
  };

  const deleteMemory = (id: string) => {
    sound.playClick();
    setMemories(prev => prev.filter(item => item.id !== id));
  };

  // Love Note Actions
  const addLoveNote = (note: Omit<LoveNote, 'id' | 'likes' | 'rotation'>) => {
    const randomRot = Number(((Math.random() * 6) - 3).toFixed(1));
    const newNote: LoveNote = {
      ...note,
      id: `note-${Date.now()}`,
      rotation: randomRot,
      likes: 1,
      isLiked: true,
    };
    setLoveNotes(prev => [newNote, ...prev]);
    sound.playSuccess();
    fireHeartShower();
  };

  const toggleLikeLoveNote = (id: string) => {
    sound.playHeart();
    setLoveNotes(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        return {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
      }
      return item;
    }));
  };

  const togglePinLoveNote = (id: string) => {
    sound.playClick();
    setLoveNotes(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isPinned: !item.isPinned };
      }
      return item;
    }));
  };

  const deleteLoveNote = (id: string) => {
    sound.playClick();
    setLoveNotes(prev => prev.filter(item => item.id !== id));
  };

  // Heart Shower Trigger
  const triggerHeartShower = (e?: React.MouseEvent) => {
    sound.playHeart();
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireHeartShower(x, y);
    } else {
      fireHeartShower(0.5, 0.4);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        settings,
        updateSettings,
        daysTogether: timeDetails.days,
        timeTogetherDetails: timeDetails,
        milestones,
        addMilestone,
        toggleLikeMilestone,
        memories,
        addMemory,
        toggleLikeMemory,
        deleteMemory,
        loveNotes,
        addLoveNote,
        toggleLikeLoveNote,
        togglePinLoveNote,
        deleteLoveNote,
        isSettingsOpen,
        setIsSettingsOpen,
        isAddMilestoneOpen,
        setIsAddMilestoneOpen,
        isAddMemoryOpen,
        setIsAddMemoryOpen,
        lightboxImage,
        setLightboxImage,
        triggerHeartShower,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
