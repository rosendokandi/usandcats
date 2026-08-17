import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Home, Key, Copy, Check, Sparkles, DoorOpen, LogOut } from 'lucide-react';
import { sound } from '../utils/sound';
import { hashPasscode, createCloudRoom, joinCloudRoom } from '../utils/cloudSync';
import { fireBigCelebration } from '../utils/confetti';

const MOCHI_KEY_HERO = '/images/hero-key-house.png';

export const RoomModal: React.FC = () => {
  const {
    isRoomModalOpen,
    setIsRoomModalOpen,
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
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isRoomModalOpen) return null;

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!createPassword || createPassword.length < 4) {
      setErrorMessage('请设置至少 4 位数专属私密密码');
      return;
    }

    setIsLoading(true);
    // Generate random room code like LOVE-789
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
      // Fallback in case of database table not created yet or network
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
      setIsRoomModalOpen(false);
    } else {
      setErrorMessage(res.error || '加入房间失败，请检查暗号和密码');
    }
  };

  const handleCopyInvite = () => {
    sound.playClick();
    const text = `亲爱的，快来我们的像素秘密小屋！\n🔗 房间暗号：${createdRoomCode}\n🔑 访问密码：${createPassword}\n网页地址：${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLeaveRoom = () => {
    if (confirm('确定要退出当前云端房间，切回本地单机模式吗？')) {
      setCurrentRoom(null);
      sound.playClick();
      setIsRoomModalOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => {
        sound.playClick();
        setIsRoomModalOpen(false);
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-surface dark:bg-inverse-surface pixel-border p-6 md:p-8 pixel-shadow-lg text-on-surface dark:text-inverse-on-surface my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape stickers */}
        <div className="absolute -top-3.5 left-8 w-20 h-6 bg-tertiary-container border-2 border-pixel-outline rotate-[-3deg]"></div>
        <div className="absolute -top-3.5 right-12 w-20 h-6 bg-primary-fixed border-2 border-pixel-outline rotate-[3deg]"></div>

        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsRoomModalOpen(false);
          }}
          className="absolute -top-4 -right-4 pixel-btn p-2 bg-primary text-on-primary hover:bg-error"
          title="关闭"
        >
          <X size={16} />
        </button>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-28 h-28 mb-3 relative pixel-border pixel-shadow bg-surface-container-highest p-1.5">
            <img
              src={MOCHI_KEY_HERO}
              alt="Mochi with Key"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-pixel-outline dark:text-primary-fixed mb-1">
            情侣专属秘密小屋
          </h2>
          <p className="font-body text-xs md:text-sm text-on-surface-variant dark:text-surface-dim max-w-md">
            一人创建，双人同步。输入专属暗号与密码，开启只属于你们的私密浪漫世界。
          </p>

          {currentRoom && (
            <div className="mt-3 bg-primary-container px-3 py-1 pixel-border-sm font-pixel text-xs text-primary flex items-center gap-2">
              <span>🏠 当前在线房间：<b>{currentRoom.roomId}</b></span>
              <button 
                onClick={handleLeaveRoom}
                className="text-error hover:underline flex items-center gap-0.5 ml-2 font-bold"
              >
                <LogOut size={12} />
                <span>退出房间</span>
              </button>
            </div>
          )}
        </div>

        {/* Dual Tab Switch */}
        <div className="flex w-full mb-[-4px] z-10 relative gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('create');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 px-4 pixel-border font-pixel text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'bg-primary-container text-primary font-bold shadow-none translate-y-1'
                : 'bg-surface-container text-on-surface-variant hover:bg-primary-container/50'
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
                ? 'bg-primary-container text-primary font-bold shadow-none translate-y-1'
                : 'bg-surface-container text-on-surface-variant hover:bg-primary-container/50'
            }`}
          >
            <Key size={16} />
            <span>输入暗号回家</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="pixel-border pixel-shadow-lg bg-primary-container/40 dark:bg-surface-container p-6 md:p-8 relative z-0">
          {errorMessage && (
            <div className="mb-4 bg-error-container text-error font-pixel text-xs p-3 pixel-border-sm">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Tab 1: Create Room */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateRoom} className="space-y-4 font-pixel text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  自定义专属私密密码（6位）
                </label>
                <input
                  type="password"
                  maxLength={12}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-pixel text-center text-sm tracking-[0.5em] focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs md:text-sm py-3.5 px-6 flex items-center justify-center gap-2 w-full mt-4 hover:opacity-90 font-bold"
              >
                <Sparkles size={16} />
                <span>{isLoading ? '正在生成小屋...' : '✨ 立即生成专属房间暗号'}</span>
              </button>

              {/* Generated Room Ticket */}
              {createdRoomCode && (
                <div className="mt-6 pt-6 border-t-4 border-dashed border-pixel-outline animate-fadeIn">
                  <div className="bg-surface pixel-border p-5 flex flex-col items-center text-center relative">
                    <div className="absolute -top-3 left-4 w-16 h-5 bg-secondary-container border border-pixel-outline rotate-[-3deg]"></div>
                    
                    <p className="font-body text-xs text-on-surface-variant mb-1">你们的专属房间暗号已生成</p>
                    <p className="font-pixel text-3xl font-black text-primary tracking-widest my-2">
                      {createdRoomCode}
                    </p>
                    <p className="font-body text-[11px] text-outline mb-4">
                      密码：{createPassword}（已自动绑定进入房间）
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyInvite}
                      className="pixel-btn bg-secondary-container text-secondary py-2.5 px-5 font-pixel text-xs flex items-center justify-center gap-2 w-full hover:opacity-90 font-bold"
                    >
                      {copied ? <Check size={16} className="text-tertiary" /> : <Copy size={16} />}
                      <span>{copied ? '已复制邀请信息，快去发给 TA 吧！' : '📋 一键复制邀请发给 TA'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Tab 2: Join Room */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinRoom} className="space-y-4 font-pixel text-xs">
              <div>
                <label className="block text-pixel-outline dark:text-surface-dim font-bold mb-1">
                  房间暗号 (Room Code)
                </label>
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  placeholder="例如：LOVE-520"
                  className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-pixel text-center text-base uppercase tracking-widest focus:outline-none focus:border-primary"
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
                  className="w-full bg-surface border-2 border-pixel-outline p-2.5 font-pixel text-center text-base tracking-[0.5em] focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs md:text-sm py-3.5 px-6 flex items-center justify-center gap-2 w-full mt-4 hover:opacity-90 font-bold"
              >
                <DoorOpen size={18} />
                <span>{isLoading ? '正在开门...' : '🚪 开门进入我们的空间'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Bottom Offline link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsRoomModalOpen(false);
            }}
            className="font-body text-xs text-on-surface-variant dark:text-surface-dim hover:text-primary underline"
          >
            先以单机模式随意看看（无需房间）
          </button>
        </div>
      </div>
    </div>
  );
};
