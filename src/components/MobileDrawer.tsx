import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Home, 
  BookOpen, 
  Camera, 
  MessageSquareHeart, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Heart, 
  Settings, 
  LogOut, 
  Radio, 
  Copy, 
  Check 
} from 'lucide-react';
import { sound } from '../utils/sound';

export const MobileDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    settings,
    updateSettings,
    setIsSettingsOpen,
    triggerHeartShower,
    currentRoom,
    setIsExitModalOpen,
    daysTogether
  } = useApp();

  const [copied, setCopied] = React.useState(false);

  if (!isMobileDrawerOpen) return null;

  const navItems = [
    { path: '/home', label: '首页', icon: Home },
    { path: '/story', label: '我们的故事', icon: BookOpen },
    { path: '/memories', label: '甜蜜瞬间', icon: Camera },
    { path: '/notes', label: '小情书', icon: MessageSquareHeart },
  ];

  const currentPath = location.pathname === '/' ? '/home' : location.pathname;

  const handleNav = (path: string) => {
    sound.playClick();
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const handleCopyInvite = () => {
    if (!currentRoom) return;
    sound.playClick();
    const inviteUrl = `${window.location.origin}/room/${currentRoom.roomId}`;
    const text = `亲爱的，快来我们的像素秘密小屋！\n🔗 房间暗号：${currentRoom.roomId}\n直达链接：${inviteUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex justify-end animate-fadeIn"
      onClick={() => {
        sound.playClick();
        setIsMobileDrawerOpen(false);
      }}
    >
      <div 
        className="relative w-72 sm:w-80 h-full max-h-[100dvh] bg-surface dark:bg-inverse-surface border-l-4 border-pixel-outline pixel-shadow-lg text-on-surface dark:text-inverse-on-surface p-5 pb-10 flex flex-col justify-between overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Header Decoration */}
        <div className="tape absolute -top-2 left-6 w-20 h-5 rotate-[-2deg]"></div>

        {/* Top Content */}
        <div>
          {/* Top Bar with Title & Close */}
          <div className="flex items-center justify-between border-b-2 border-pixel-outline pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">pets</span>
              <span className="font-pixel text-base font-bold text-primary dark:text-primary-fixed">
                空间快捷菜单
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileDrawerOpen(false);
              }}
              className="pixel-btn-sm p-1.5 bg-surface-container hover:bg-error hover:text-white transition-colors"
              title="关闭菜单"
            >
              <X size={15} />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-surface-container dark:bg-surface-container-high pixel-border-sm p-3.5 mb-5 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-12 h-12 border-2 border-pixel-outline overflow-hidden pixel-shadow-sm cursor-pointer hover:scale-105 transition-transform bg-primary-container shrink-0"
              >
                <img
                  alt="情侣头像"
                  className="w-full h-full object-cover"
                  src={settings.avatarUrl}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-pixel text-xs font-bold truncate text-primary dark:text-primary-fixed">
                  {settings.partner1 || '我'} ♥ {settings.partner2 || 'TA'}
                </div>
                <div className="font-pixel text-[10px] text-on-surface-variant dark:text-surface-dim mt-0.5">
                  已相恋 <b className="text-primary">{daysTogether}</b> 天
                </div>
              </div>
            </div>

            {/* Room Code Info */}
            {currentRoom && (
              <div className="mt-1 pt-2 border-t border-pixel-outline/30 flex items-center justify-between font-pixel text-[11px]">
                <span className="flex items-center gap-1 text-tertiary font-bold">
                  <Radio size={12} className="animate-spin" />
                  {currentRoom.roomId}
                </span>
                <button
                  onClick={handleCopyInvite}
                  className="text-secondary hover:underline flex items-center gap-1 font-bold text-[10px]"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copied ? '已复制' : '复制链接'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5 mb-5">
            <div className="font-pixel text-[10px] text-on-surface-variant dark:text-surface-dim uppercase font-bold px-1 mb-1">
              页面导航
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full pixel-btn-sm py-2 px-3 font-pixel text-xs flex items-center gap-2.5 transition-all text-left ${
                    isActive
                      ? 'bg-primary text-on-primary font-bold shadow-pixel-sm translate-x-1'
                      : 'bg-surface dark:bg-surface-container text-on-surface-variant hover:bg-primary-container'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Tools */}
          <div className="space-y-2">
            <div className="font-pixel text-[10px] text-on-surface-variant dark:text-surface-dim uppercase font-bold px-1 mb-1">
              快捷操作
            </div>

            {/* Sound & Dark Mode Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`pixel-btn-sm p-2 font-pixel text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                  settings.soundEnabled
                    ? 'bg-primary-container text-primary font-bold'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{settings.soundEnabled ? '音效: 开' : '音效: 关'}</span>
              </button>

              <button
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`pixel-btn-sm p-2 font-pixel text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                  settings.darkMode
                    ? 'bg-primary-container text-primary font-bold'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {settings.darkMode ? <Moon size={14} /> : <Sun size={14} />}
                <span>{settings.darkMode ? '深色模式' : '浅色模式'}</span>
              </button>
            </div>

            {/* Heart Shower Button */}
            <button
              onClick={() => {
                triggerHeartShower();
                sound.playHeart();
              }}
              className="w-full pixel-btn-sm py-2 px-3 bg-secondary-container text-secondary font-pixel text-[11px] flex items-center justify-center gap-1.5 font-bold hover:opacity-90"
            >
              <Heart size={14} className="fill-secondary" />
              <span>发射浪漫爱心雨 ✨</span>
            </button>

            {/* Space Settings Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileDrawerOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full pixel-btn-sm py-2 px-3 bg-surface-container text-on-surface-variant font-pixel text-[11px] flex items-center justify-center gap-1.5 hover:bg-surface-container-high font-bold"
            >
              <Settings size={14} />
              <span>空间个性化设置</span>
            </button>
          </div>
        </div>

        {/* Bottom Exit Button & Footer */}
        <div className="mt-6 pt-4 border-t-2 border-pixel-outline space-y-3">
          {currentRoom && (
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileDrawerOpen(false);
                setIsExitModalOpen(true);
              }}
              className="w-full pixel-btn-sm py-2 px-3 bg-error text-white font-pixel text-xs flex items-center justify-center gap-1.5 font-bold hover:opacity-90"
            >
              <LogOut size={14} />
              <span>退出当前房间</span>
            </button>
          )}

          <div className="text-center font-pixel text-[10px] text-outline">
            US & CATS · 像素情侣空间
          </div>
        </div>
      </div>
    </div>
  );
};
