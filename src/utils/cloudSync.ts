import { supabase } from './supabase';
import { RoomInfo, Milestone, Memory, LoveNote, UserSettings } from '../types';

// Simple hash for room passcode (for light client-side matching)
export const hashPasscode = (passcode: string): string => {
  let hash = 0;
  for (let i = 0; i < passcode.length; i++) {
    const char = passcode.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash)}`;
};

export const createCloudRoom = async (info: RoomInfo): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('rooms')
      .upsert({
        id: info.roomId.toUpperCase().trim(),
        password_hash: info.passwordHash,
        partner1: info.partner1,
        partner2: info.partner2,
        cat_name: info.catName,
        start_date: info.startDate,
        avatar_url: info.avatarUrl,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase create room warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
};

export const joinCloudRoom = async (
  roomId: string,
  passcode: string
): Promise<{ success: boolean; room?: RoomInfo; error?: string }> => {
  try {
    const upperRoomId = roomId.toUpperCase().trim();
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', upperRoomId)
      .single();

    if (error || !data) {
      return { success: false, error: '未找到该房间暗号，请核对后再试' };
    }

    const hashedInput = hashPasscode(passcode);
    if (data.password_hash !== hashedInput && data.password_hash !== passcode) {
      return { success: false, error: '房间密码不正确，请重新输入' };
    }

    const room: RoomInfo = {
      roomId: data.id,
      passwordHash: data.password_hash,
      partner1: data.partner1,
      partner2: data.partner2,
      catName: data.cat_name,
      startDate: data.start_date,
      avatarUrl: data.avatar_url,
      isCloudOnline: true,
    };

    return { success: true, room };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '连接错误';
    return { success: false, error: message };
  }
};

export const fetchCloudRoomData = async (roomId: string) => {
  const upperRoomId = roomId.toUpperCase().trim();

  try {
    const [milestonesRes, memoriesRes, notesRes] = await Promise.all([
      supabase.from('milestones').select('*').eq('room_id', upperRoomId).order('created_at', { ascending: false }),
      supabase.from('memories').select('*').eq('room_id', upperRoomId).order('created_at', { ascending: false }),
      supabase.from('love_notes').select('*').eq('room_id', upperRoomId).order('created_at', { ascending: false }),
    ]);

    const milestones: Milestone[] = (milestonesRes.data || []).map((row: any) => ({
      id: row.id,
      roomId: row.room_id,
      date: row.date,
      title: row.title,
      description: row.description,
      category: row.category,
      icon: row.icon,
      imageUrl: row.image_url,
      likes: row.likes || 0,
    }));

    const memories: Memory[] = (memoriesRes.data || []).map((row: any) => ({
      id: row.id,
      roomId: row.room_id,
      title: row.title,
      description: row.description,
      date: row.date,
      imageUrl: row.image_url,
      category: row.category,
      aspectRatio: row.aspect_ratio || 'square',
      tapeColor: row.tape_color || 'pink',
      tapeRotation: row.tape_rotation || 0,
      likes: row.likes || 0,
    }));

    const loveNotes: LoveNote[] = (notesRes.data || []).map((row: any) => ({
      id: row.id,
      roomId: row.room_id,
      author: row.author,
      content: row.content,
      date: row.date,
      mood: row.mood,
      moodIcon: row.mood_icon,
      bgColor: row.bg_color || 'pink',
      rotation: row.rotation || 0,
      likes: row.likes || 0,
      isPinned: row.is_pinned || false,
      imageUrl: row.image_url,
    }));

    return { milestones, memories, loveNotes };
  } catch (err) {
    console.warn('Failed to fetch cloud room data:', err);
    return null;
  }
};

export const syncMilestoneToCloud = async (roomId: string, m: Milestone) => {
  try {
    await supabase.from('milestones').upsert({
      id: m.id,
      room_id: roomId.toUpperCase(),
      date: m.date,
      title: m.title,
      description: m.description,
      category: m.category,
      icon: m.icon,
      image_url: m.imageUrl || null,
      likes: m.likes || 0,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Sync milestone error', e);
  }
};

export const syncMemoryToCloud = async (roomId: string, mem: Memory) => {
  try {
    await supabase.from('memories').upsert({
      id: mem.id,
      room_id: roomId.toUpperCase(),
      title: mem.title,
      description: mem.description,
      date: mem.date,
      image_url: mem.imageUrl,
      category: mem.category,
      aspect_ratio: mem.aspectRatio,
      tape_color: mem.tapeColor,
      tape_rotation: mem.tapeRotation,
      likes: mem.likes || 0,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Sync memory error', e);
  }
};

export const syncLoveNoteToCloud = async (roomId: string, note: LoveNote) => {
  try {
    await supabase.from('love_notes').upsert({
      id: note.id,
      room_id: roomId.toUpperCase(),
      author: note.author,
      content: note.content,
      date: note.date,
      mood: note.mood,
      mood_icon: note.moodIcon,
      bg_color: note.bgColor,
      rotation: note.rotation,
      likes: note.likes || 0,
      is_pinned: note.isPinned || false,
      image_url: note.imageUrl || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Sync love note error', e);
  }
};

export const deleteCloudItem = async (table: 'milestones' | 'memories' | 'love_notes', id: string) => {
  try {
    await supabase.from(table).delete().eq('id', id);
  } catch (e) {
    console.warn('Delete cloud item error', e);
  }
};

export const updateCloudRoomSettings = async (roomId: string, settings: Partial<UserSettings>) => {
  try {
    const upperRoomId = roomId.toUpperCase().trim();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (settings.partner1 !== undefined) updatePayload.partner1 = settings.partner1;
    if (settings.partner2 !== undefined) updatePayload.partner2 = settings.partner2;
    if (settings.startDate !== undefined) updatePayload.start_date = settings.startDate;
    if (settings.catName !== undefined) updatePayload.cat_name = settings.catName;
    if (settings.avatarUrl !== undefined) updatePayload.avatar_url = settings.avatarUrl;

    await supabase
      .from('rooms')
      .update(updatePayload)
      .eq('id', upperRoomId);
  } catch (err) {
    console.warn('Update cloud room settings error:', err);
  }
};

