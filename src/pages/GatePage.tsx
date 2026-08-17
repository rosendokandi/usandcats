import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Key, Copy, Check, Sparkles, DoorOpen, ArrowRight, Radio } from 'lucide-react';
import { sound } from '../utils/sound';
import { hashPasscode, createCloudRoom, joinCloudRoom } from '../utils/cloudSync';
import { fireBigCelebration } from '../utils/confetti';

const MOCHI_KEY_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdZJGwxsR0WzHKqb5h1IHxvcFlXc7a9AhxuD2-xj2YTMpLosRW4uXcSw0CaHMVOjhJvp8AybpiIkuf1QhxUpoLvaj8BUh6F3I6NbX21b8B_gg2dlE1TVoiJWGVmx9yIQXBE6EL6OF1o5CNiqTdjz4PpMBMkvCV_bBPuW7l2xz_LVjMI8orTY8q9IQvfZgAePFa2N6GmWdcjJSIhsL0Smg74JihGPG9ih_9OvKBM7SbNgC1A-8kPgUtvLmAIrlNIf2luwSdk8aQrRQ';

export const GatePage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId: urlRoomId } = useParams<{ roomId?: string }>();

  const {
    currentRoom,
    setCurrentRoom,
    settings,
    updateSettings,
    loadCloudDataForRoom
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  
  // Create Room State
  const [partner1, setPartner1] = useState(settings.partner1 || 'Alex');
  const [partner2, setPartner2] = useState(settings.partner2 || 'Jamie');
  const [anniversary, setAnniversary] = useState(settings.startDate || '2023-05-20');
  const [catName, setCatName] = useState(settings.catName || 'Mochi');
  const [createPassword, setCreatePassword] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  
  // Join Room State
  const [joinRoomCode, setJoinRoomCode] = useState(urlRoomId ? urlRoomId.toUpperCase() : '');
  const [joinPassword, setJoinPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // If visiting /room/:roomId directly, switch to join tab
  useEffect(() => {
    if (urlRoomId) {
      setJoinRoomCode(urlRoomId.toUpperCase());
      setActiveTab('join');
    }
  }, [urlRoomId]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!createPassword || createPassword.length < 4) {
      setErrorMessage('请设置至少 4 位数专属私密密码');
      return;
    }

    setIsLoading(true);
    // Generate room code like LOVE-789
    const randomCode = `LOVE-${Math.floor(100 + Math.random() * 900)}`;
    const passHash = hashPasscode(createPassword);

    const roomInfo = {
      roomId: randomCode,
      passwordHash: passHash,
      partner1: partner1.trim(),
      partner2: partner2.trim(),
      catName: catName.trim(),
      startDate: anniversary,
      avatarUrl: settings.avatarUrl,
      isCloudOnline: true,
    };

    const res = await createCloudRoom(roomInfo);
    setIsLoading(false);

    if (res.success) {
      sound.playSuccess();
      fireBigCelebration();
      setCreatedRoomCode(randomCode);
      setCurrentRoom(roomInfo);
      updateSettings({
        partner1: roomInfo.partner1,
        partner2: roomInfo.partner2,
        startDate: roomInfo.startDate,
        catName: roomInfo.catName,
      });
      loadCloudDataForRoom(randomCode);
    } else {
      // Fallback
      setCreatedRoomCode(randomCode);
      setCurrentRoom(roomInfo);
      sound.playSuccess();
      fireBigCelebration();
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!joinRoomCode.trim()) {
      setErrorMessage('请输入房间暗号');
      return;
    }

    setIsLoading(true);
    const res = await joinCloudRoom(joinRoomCode.trim(), joinPassword);
    setIsLoading(false);

    if (res.success && res.room) {
      sound.playSuccess();
      fireBigCelebration();
      setCurrentRoom(res.room);
      updateSettings({
        partner1: res.room.partner1,
        partner2: res.room.partner2,
        startDate: res.room.startDate,
        catName: res.room.catName,
        avatarUrl: res.room.avatarUrl,
      });
      loadCloudDataForRoom(res.room.roomId);
      // Navigate to /home
      setTimeout(() => {
        navigate('/home');
      }, 400);
    } else {
      setErrorMessage(res.error || '加入房间失败，请检查暗号和密码');
    }
  };

  const handleCopyInvite = () => {
    sound.playClick();
    const inviteUrl = `${window.location.origin}/room/${createdRoomCode}`;
    const text = `亲爱的，快来我们的像素秘密小屋！\n🔗 房间暗号：${createdRoomCode}\n🔑 访问密码：${createPassword}\n直达链接：${inviteUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-surface text-on-surface">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-7xl mx-auto h-20 pt-4 z-50">
        <div 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-primary text-3xl">pets</span>
          <span className="font-pixel text-xl md:text-2xl text-primary font-bold tracking-tight">
            US & CATS
          </span>
        </div>

        {currentRoom && (
          <button
            onClick={() => {
              sound.playClick();
              navigate('/home');
            }}
            className="pixel-btn-sm px-3 py-1.5 bg-tertiary-container text-tertiary font-pixel text-xs flex items-center gap-1 font-bold"
          >
            <Radio size={14} className="animate-spin" />
            <span>进入小家 ({currentRoom.roomId})</span>
            <ArrowRight size={14} />
          </button>
        )}
      </header>

      {/* Main Gate Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-margin-desktop py-8 md:py-12 max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <section className="w-full max-w-2xl flex flex-col items-center text-center mb-8 relative">
          <div className="tape-mint absolute -top-3 right-6 w-20 h-6 rotate-3 z-10"></div>
          
          {/* 8-Bit Hero Image */}
          <div className="w-36 h-36 md:w-44 md:h-44 mb-5 relative pixel-border pixel-shadow bg-surface-container-highest p-2">
            <img
              src={MOCHI_KEY_HERO}
              alt="Mochi holding golden key"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-pixel-outline dark:text-primary-fixed mb-3 tracking-tight">
            情侣专属秘密小屋
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant dark:text-surface-dim max-w-lg leading-relaxed">
            一人创建，双人同步。输入专属暗号与密码，开启只属于你们两个人的私密浪漫世界。
          </p>
        </section>

        {/* Dual Tab Card */}
        <section className="w-full max-w-xl relative">
          {/* Tabs Header */}
          <div className="flex w-full mb-[-4px] z-10 relative px-2 gap-3" role="tablist">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('create');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 pixel-border font-pixel text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'create'
                  ? 'bg-primary-container text-primary font-bold shadow-none translate-y-1 z-20'
                  : 'bg-surface-container text-on-surface-variant hover:bg-primary-container/60 z-10'
              }`}
            >
              <Home size={16} />
              <span>创建我们的空间</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('join');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 pixel-border font-pixel text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'join'
                  ? 'bg-primary-container text-primary font-bold shadow-none translate-y-1 z-20'
                  : 'bg-surface-container text-on-surface-variant hover:bg-primary-container/60 z-10'
              }`}
            >
              <Key size={16} />
              <span>输入暗号回家</span>
            </button>
          </div>

          {/* Card Body */}
          <div className="pixel-border pixel-shadow-lg bg-primary-container/50 dark:bg-surface-container p-6 md:p-8 relative z-0">
            {errorMessage && (
              <div className="mb-4 bg-error-container text-error font-pixel text-xs p-3 pixel-border-sm">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Tab 1: Create Room */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-4 font-pixel text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                      伴侣 1 昵称
                    </label>
                    <input
                      type="text"
                      value={partner1}
                      onChange={(e) => setPartner1(e.target.value)}
                      placeholder="例如：Alex"
                      className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-body text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                      伴侣 2 昵称
                    </label>
                    <input
                      type="text"
                      value={partner2}
                      onChange={(e) => setPartner2(e.target.value)}
                      placeholder="例如：Jamie"
                      className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-body text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                      恋爱起始纪念日
                    </label>
                    <input
                      type="date"
                      value={anniversary}
                      onChange={(e) => setAnniversary(e.target.value)}
                      className="w-full bg-surface border-2 border-pixel-outline p-2 font-pixel text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                      猫咪/宠物名字
                    </label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="例如：Mochi"
                      className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-body text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                    自定义 6 位专属私密密码
                  </label>
                  <input
                    type="password"
                    maxLength={12}
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-surface border-2 border-pixel-outline p-3 font-pixel text-center text-base tracking-[0.5em] focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs md:text-sm py-4 px-6 flex items-center justify-center gap-2 w-full mt-4 hover:opacity-90 font-bold"
                >
                  <Sparkles size={16} />
                  <span>{isLoading ? '正在生成小屋...' : '✨ 立即生成专属房间暗号'}</span>
                </button>

                {/* Generated Room Ticket */}
                {createdRoomCode && (
                  <div className="mt-6 pt-6 border-t-4 border-dashed border-pixel-outline animate-fadeIn">
                    <div className="bg-surface pixel-border p-6 flex flex-col items-center text-center relative">
                      <div className="tape absolute -top-3 left-4 w-20 h-6 rotate-[-3deg]"></div>
                      
                      <p className="font-body text-xs text-on-surface-variant mb-1">你们的专属房间暗号已就绪</p>
                      <p className="font-pixel text-3xl md:text-4xl font-black text-primary tracking-widest my-2">
                        {createdRoomCode}
                      </p>
                      <p className="font-body text-xs text-outline mb-4">
                        密码：{createPassword}（随时用暗号与密码回家）
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                          type="button"
                          onClick={handleCopyInvite}
                          className="flex-1 pixel-btn bg-secondary-container text-secondary py-3 px-4 font-pixel text-xs flex items-center justify-center gap-1.5 hover:opacity-90 font-bold"
                        >
                          {copied ? <Check size={16} className="text-tertiary" /> : <Copy size={16} />}
                          <span>{copied ? '已复制邀请链接！' : '📋 复制链接发给 TA'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            navigate('/home');
                          }}
                          className="flex-1 pixel-btn bg-primary text-on-primary py-3 px-4 font-pixel text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 font-bold"
                        >
                          <span>立即进入小家</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* Tab 2: Join Room */}
            {activeTab === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-5 font-pixel text-xs">
                <div>
                  <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                    房间暗号 (Room Code)
                  </label>
                  <input
                    type="text"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                    placeholder="例如：LOVE-520"
                    className="w-full bg-surface border-2 border-pixel-outline p-3 font-pixel text-center text-lg uppercase tracking-widest focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                    私密密码 (Passcode)
                  </label>
                  <input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-surface border-2 border-pixel-outline p-3 font-pixel text-center text-lg tracking-[0.5em] focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs md:text-sm py-4 px-6 flex items-center justify-center gap-2 w-full mt-4 hover:opacity-90 font-bold"
                >
                  <DoorOpen size={18} />
                  <span>{isLoading ? '正在开门...' : '🚪 开门进入我们的空间'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              navigate('/home');
            }}
            className="font-body text-xs md:text-sm text-on-surface-variant dark:text-surface-dim hover:text-primary underline decoration-2 underline-offset-4"
          >
            先以单机模式随意看看（无需房间）→
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 font-pixel text-xs text-outline border-t border-pixel-outline/20">
        © {new Date().getFullYear()} Us & Cats. 像素与爱，甜蜜满载。
      </footer>
    </div>
  );
};
