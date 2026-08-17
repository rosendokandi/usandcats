import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Settings, Heart, Radio, LogOut } from 'lucide-react';
import { sound } from '../utils/sound';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    settings, 
    updateSettings, 
    setIsSettingsOpen, 
    triggerHeartShower,
    currentRoom,
    setIsExitModalOpen
  } = useApp();

  const navItems = [
    { path: '/home', label: '首页' },
    { path: '/story', label: '我们的故事' },
    { path: '/memories', label: '甜蜜瞬间' },
    { path: '/notes', label: '小情书' },
  ];

  const currentPath = location.pathname === '/' ? '/home' : location.pathname;

  const handleOpenExitModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setIsExitModalOpen(true);
  };

  return (
    <header className="bg-surface/95 dark:bg-inverse-surface/95 border-b-4 border-pixel-outline pixel-shadow w-full sticky top-0 z-40 backdrop-blur-sm transition-colors">
      <div className="flex justify-between items-center w-full px-2.5 sm:px-4 md:px-margin-desktop py-2 sm:py-3 max-w-7xl mx-auto h-14 sm:h-16 md:h-20">
        {/* Brand Logo & Room Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <button 
            onClick={() => navigate('/home')}
            className="font-pixel text-primary dark:text-primary-fixed flex items-center gap-1 sm:gap-2 text-sm sm:text-lg md:text-2xl font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-lg sm:text-2xl md:text-3xl text-primary dark:text-primary-fixed">pets</span>
            <span className="tracking-wide whitespace-nowrap">US & CATS</span>
          </button>

          {/* Room Badge with Pixel Exit Trigger */}
          {currentRoom && (
            <div className="flex items-center bg-tertiary-container pixel-border-sm font-pixel text-[10px] sm:text-[11px] text-tertiary shrink-0">
              <button
                onClick={() => navigate('/gate')}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 hover:opacity-80 font-bold whitespace-nowrap"
                title={`当前房间：${currentRoom.roomId}，点击返回门禁大厅`}
              >
                <Radio size={11} className="text-tertiary animate-spin" />
                <span className="whitespace-nowrap">{currentRoom.roomId}</span>
              </button>
              <button
                onClick={handleOpenExitModal}
                className="p-1 text-error hover:bg-error hover:text-white border-l border-pixel-outline/30 transition-colors"
                title="退出当前房间"
              >
                <LogOut size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(item.path);
                }}
                className={`font-pixel text-[13px] tracking-wider px-3.5 py-1.5 transition-all pixel-border-sm ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-pixel-sm font-bold scale-105'
                    : 'bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-dim hover:bg-primary-container dark:hover:bg-primary/30 hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Trailing Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            title={settings.soundEnabled ? "静音 8-bit 音效" : "开启 8-bit 音效"}
            className={`pixel-btn-sm p-1.5 sm:p-2 flex items-center justify-center transition-colors ${
              settings.soundEnabled 
                ? 'bg-primary-container text-primary' 
                : 'bg-surface-container text-outline'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Heart Button */}
          <button
            onClick={triggerHeartShower}
            title="发射爱心雨"
            className="pixel-btn-sm p-1.5 sm:p-2 bg-surface hover:bg-primary-container text-primary transition-all group"
          >
            <Heart size={15} className="fill-primary group-hover:scale-110 transition-transform" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="空间个性化设置"
            className="pixel-btn-sm p-1.5 sm:p-2 bg-surface hover:bg-primary-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <Settings size={15} />
          </button>

          {/* Couple Avatar */}
          <div 
            onClick={() => setIsSettingsOpen(true)}
            title="点击修改纪念日与头像"
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 border-2 sm:border-3 border-pixel-outline overflow-hidden pixel-shadow-sm cursor-pointer hover:scale-105 transition-transform bg-primary-container shrink-0"
          >
            <img
              alt="情侣头像"
              className="w-full h-full object-cover"
              src={settings.avatarUrl}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="grid grid-cols-4 gap-1 md:hidden border-t-2 border-pixel-outline bg-surface-container dark:bg-surface-container-high p-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(item.path);
              }}
              className={`font-pixel text-[11px] py-1.5 px-1 transition-all text-center truncate ${
                isActive
                  ? 'bg-primary text-on-primary font-bold pixel-border-sm shadow-pixel-sm'
                  : 'text-on-surface-variant hover:bg-surface'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
