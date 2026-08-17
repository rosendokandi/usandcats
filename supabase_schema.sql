-- ==============================================================================
-- Us & Cats 数据库一键初始化 SQL (可在 Supabase 的 SQL Editor 中点击 Run 执行)
-- ==============================================================================

-- 1. 创建情侣专属房间表
CREATE TABLE IF NOT EXISTS public.rooms (
  id VARCHAR(32) PRIMARY KEY,
  password_hash TEXT NOT NULL,
  partner1 TEXT NOT NULL,
  partner2 TEXT NOT NULL,
  cat_name TEXT DEFAULT 'Mochi',
  start_date TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建故事时间轴表
CREATE TABLE IF NOT EXISTS public.milestones (
  id TEXT PRIMARY KEY,
  room_id VARCHAR(32) REFERENCES public.rooms(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'love',
  icon TEXT DEFAULT 'favorite',
  image_url TEXT,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建甜蜜相册表
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  room_id VARCHAR(32) REFERENCES public.rooms(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'daily',
  aspect_ratio TEXT DEFAULT 'square',
  tape_color TEXT DEFAULT 'pink',
  tape_rotation FLOAT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建小情书便签表
CREATE TABLE IF NOT EXISTS public.love_notes (
  id TEXT PRIMARY KEY,
  room_id VARCHAR(32) REFERENCES public.rooms(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  mood TEXT,
  mood_icon TEXT,
  bg_color TEXT DEFAULT 'pink',
  rotation FLOAT DEFAULT 0,
  likes INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 开启 Supabase Realtime 实时双向广播通道
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.love_notes;

-- 6. 配置行级安全策略 (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all milestones" ON public.milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all love_notes" ON public.love_notes FOR ALL USING (true) WITH CHECK (true);
