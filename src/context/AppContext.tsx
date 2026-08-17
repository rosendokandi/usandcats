import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TabType, Milestone, Memory, LoveNote, UserSettings, RoomInfo, RealtimeToastMsg } from '../types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_MILESTONES, 
  DEFAULT_MEMORIES, 
  DEFAULT_LOVE_NOTES 
} from '../utils/defaultData';
import { sound } from '../utils/sound';
import { fireHeartShower } from '../utils/confetti';
import { 
  fetchCloudRoomData, 
  syncMilestoneToCloud, 
  syncMemoryToCloud, 
  syncLoveNoteToCloud, 
  deleteCloudItem 
} from '../utils/cloudSync';
import { supabase } from '../utils/supabase';

interface AppContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  daysTogether: number;
  timeTogetherDetails: { days: number; hours: number; minutes: number; seconds: number };
  
  // Room & Cloud Sync
  currentRoom: RoomInfo | null;
  setCurrentRoom: (room: RoomInfo | null) => void;
  exitRoom: () => void;
  isExitModalOpen: boolean;
  setIsExitModalOpen: (open: boolean) => void;
  isRoomModalOpen: boolean;
  setIsRoomModalOpen: (open: boolean) => void;
  realtimeToast: RealtimeToastMsg | null;
  setRealtimeToast: (msg: RealtimeToastMsg | null) => void;
  loadCloudDataForRoom: (roomId: string) => Promise<void>;

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
  // Determine initial tab: if URL contains gate or room invite, or no room saved, default to gate
  const [currentTab, setCurrentTabState] = useState<TabType>('gate');

  // Room state
  const [currentRoom, setCurrentRoomState] = useState<RoomInfo | null>(() => {
    const saved = localStorage.getItem('us_cats_room');
    return saved ? JSON.parse(saved) : null;
  });

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [realtimeToast, setRealtimeToast] = useState<RealtimeToastMsg | null>(null);

  // Settings
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

  // Save room state
  const setCurrentRoom = (room: RoomInfo | null) => {
    setCurrentRoomState(room);
    if (room) {
      localStorage.setItem('us_cats_room', JSON.stringify(room));
    } else {
      localStorage.removeItem('us_cats_room');
    }
  };

  // Safe Exit Room Function (Completely wipes out private room data)
  const exitRoom = useCallback(() => {
    setCurrentRoom(null);
    setMilestones(DEFAULT_MILESTONES);
    setMemories(DEFAULT_MEMORIES);
    setLoveNotes(DEFAULT_LOVE_NOTES);
    setSettings(DEFAULT_SETTINGS);

    localStorage.removeItem('us_cats_room');
    localStorage.removeItem('us_cats_milestones');
    localStorage.removeItem('us_cats_memories');
    localStorage.removeItem('us_cats_notes');
    localStorage.removeItem('us_cats_settings');

    setIsExitModalOpen(false);
    setIsSettingsOpen(false);
    setIsRoomModalOpen(false);
    
    setRealtimeToast({
      id: `${Date.now()}`,
      message: '已安全退出房间，所有私密数据已完全清空！🔒',
      type: 'join',
    });
  }, []);

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

  // LocalStorage Persist only if user is in a valid room
  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem('us_cats_settings', JSON.stringify(settings));
    }
  }, [settings, currentRoom]);

  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem('us_cats_milestones', JSON.stringify(milestones));
    }
  }, [milestones, currentRoom]);

  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem('us_cats_memories', JSON.stringify(memories));
    }
  }, [memories, currentRoom]);

  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem('us_cats_notes', JSON.stringify(loveNotes));
    }
  }, [loveNotes, currentRoom]);

  // Load cloud data for room
  const loadCloudDataForRoom = useCallback(async (roomId: string) => {
    const data = await fetchCloudRoomData(roomId);
    if (data) {
      if (data.milestones.length > 0) setMilestones(data.milestones);
      if (data.memories.length > 0) setMemories(data.memories);
      if (data.loveNotes.length > 0) setLoveNotes(data.loveNotes);
    }
  }, []);

  // Initial cloud sync if room exists
  useEffect(() => {
    if (currentRoom?.roomId) {
      loadCloudDataForRoom(currentRoom.roomId);
    }
  }, [currentRoom?.roomId, loadCloudDataForRoom]);

  // Supabase Realtime WebSocket Listener for current room
  useEffect(() => {
    if (!currentRoom?.roomId) return;

    const roomId = currentRoom.roomId.toUpperCase();
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'love_notes', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as any;
            const newNote: LoveNote = {
              id: newRow.id,
              author: newRow.author,
              content: newRow.content,
              date: newRow.date,
              mood: newRow.mood,
              moodIcon: newRow.mood_icon,
              bgColor: newRow.bg_color || 'pink',
              rotation: newRow.rotation || 0,
              likes: newRow.likes || 0,
              isPinned: newRow.is_pinned || false,
              imageUrl: newRow.image_url,
            };
            setLoveNotes(prev => {
              if (prev.some(n => n.id === newNote.id)) return prev;
              return [newNote, ...prev];
            });
            sound.playSuccess();
            fireHeartShower();
            setRealtimeToast({
              id: `${Date.now()}`,
              message: `${newRow.author} 刚刚在小情书留下一张新便签！💌`,
              type: 'note',
              sender: newRow.author
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memories', filter: `room_id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as any;
            const newMem: Memory = {
              id: newRow.id,
              title: newRow.title,
              description: newRow.description,
              date: newRow.date,
              imageUrl: newRow.image_url,
              category: newRow.category,
              aspectRatio: newRow.aspect_ratio || 'square',
              tapeColor: newRow.tape_color || 'pink',
              tapeRotation: newRow.tape_rotation || 0,
              likes: newRow.likes || 0,
            };
            setMemories(prev => {
              if (prev.some(m => m.id === newMem.id)) return prev;
              return [newMem, ...prev];
            });
            sound.playSuccess();
            setRealtimeToast({
              id: `${Date.now()}`,
              message: `相册刚刚添加了一张新的拍立得回忆！📸`,
              type: 'photo'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.roomId]);

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
      roomId: currentRoom?.roomId,
    };
    setMilestones(prev => [newM, ...prev]);
    sound.playSuccess();
    fireHeartShower();

    if (currentRoom?.roomId) {
      syncMilestoneToCloud(currentRoom.roomId, newM);
    }
  };

  const toggleLikeMilestone = (id: string) => {
    sound.playHeart();
    setMilestones(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        const updated = {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
        if (currentRoom?.roomId) {
          syncMilestoneToCloud(currentRoom.roomId, updated);
        }
        return updated;
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
      roomId: currentRoom?.roomId,
    };
    setMemories(prev => [newMem, ...prev]);
    sound.playSuccess();
    fireHeartShower();

    if (currentRoom?.roomId) {
      syncMemoryToCloud(currentRoom.roomId, newMem);
    }
  };

  const toggleLikeMemory = (id: string) => {
    sound.playHeart();
    setMemories(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        const updated = {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
        if (currentRoom?.roomId) {
          syncMemoryToCloud(currentRoom.roomId, updated);
        }
        return updated;
      }
      return item;
    }));
  };

  const deleteMemory = (id: string) => {
    sound.playClick();
    setMemories(prev => prev.filter(item => item.id !== id));
    if (currentRoom?.roomId) {
      deleteCloudItem('memories', id);
    }
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
      roomId: currentRoom?.roomId,
    };
    setLoveNotes(prev => [newNote, ...prev]);
    sound.playSuccess();
    fireHeartShower();

    if (currentRoom?.roomId) {
      syncLoveNoteToCloud(currentRoom.roomId, newNote);
    }
  };

  const toggleLikeLoveNote = (id: string) => {
    sound.playHeart();
    setLoveNotes(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.isLiked;
        const updated = {
          ...item,
          isLiked,
          likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
        };
        if (currentRoom?.roomId) {
          syncLoveNoteToCloud(currentRoom.roomId, updated);
        }
        return updated;
      }
      return item;
    }));
  };

  const togglePinLoveNote = (id: string) => {
    sound.playClick();
    setLoveNotes(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, isPinned: !item.isPinned };
        if (currentRoom?.roomId) {
          syncLoveNoteToCloud(currentRoom.roomId, updated);
        }
        return updated;
      }
      return item;
    }));
  };

  const deleteLoveNote = (id: string) => {
    sound.playClick();
    setLoveNotes(prev => prev.filter(item => item.id !== id));
    if (currentRoom?.roomId) {
      deleteCloudItem('love_notes', id);
    }
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
        currentRoom,
        setCurrentRoom,
        exitRoom,
        isExitModalOpen,
        setIsExitModalOpen,
        isRoomModalOpen,
        setIsRoomModalOpen,
        realtimeToast,
        setRealtimeToast,
        loadCloudDataForRoom,
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
