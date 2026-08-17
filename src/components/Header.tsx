import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Settings, Heart, Radio, LogOut, Menu } from 'lucide-react';
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
    setIsExitModalOpen,
    setIsMobileDrawerOpen
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

  const handleOpenDrawer = () => {
    sound.playClick();
    setIsMobileDrawerOpen(true);
  };

  return (
    <header className="bg-surface/95 dark:bg-inverse-surface/95 border-b-4 border-pixel-outline pixel-shadow w-full sticky top-0 z-40 backdrop-blur-sm transition-colors select-none">
      <div className="flex justify-between items-center w-full px-3 sm:px-5 lg:px-8 max-w-7xl mx-auto h-16 sm:h-18 lg:h-20 gap-2">
        {/* Left: Brand Logo & Room Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap min-w-0">
          <button 
            onClick={() => navigate('/home')}
            className="font-pixel text-primary dark:text-primary-fixed flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg lg:text-2xl font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all shrink-0 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl lg:text-3xl text-primary dark:text-primary-fixed shrink-0">pets</span>
            <span className="tracking-wide whitespace-nowrap shrink-0">US & CATS</span>
          </button>

          {/* Room Badge */}
          {currentRoom && (
            <div className="flex items-center bg-tertiary-container pixel-border-sm font-pixel text-[10px] sm:text-xs text-tertiary shrink-0 whitespace-nowrap">
              <button
                onClick={() => navigate('/gate')}
                className="px-2 py-0.5 sm:py-1 flex items-center gap-1 hover:opacity-80 font-bold whitespace-nowrap shrink-0"
                title={`当前房间：${currentRoom.roomId}，点击返回门禁大厅`}
              >
                <Radio size={11} className="text-tertiary animate-spin shrink-0" />
                <span className="whitespace-nowrap shrink-0">{currentRoom.roomId}</span>
              </button>
              <button
                onClick={handleOpenExitModal}
                className="p-1 sm:px-1.5 text-error hover:bg-error hover:text-white border-l border-pixel-outline/30 transition-colors shrink-0"
                title="退出当前房间"
              >
                <LogOut size={11} className="shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Navigation Links (Desktop: >= 768px) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 shrink-0">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(item.path);
                }}
                className={`font-pixel text-xs lg:text-sm tracking-wider px-3 lg:px-4 py-1.5 transition-all pixel-border-sm whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-pixel-sm font-bold scale-105'
                    : 'bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-dim hover:bg-primary-container hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Mobile Hamburger Drawer Button + Desktop Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
          {/* Mobile Only: Quick Heart & Side-sliding Menu Button (< 768px) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={triggerHeartShower}
              title="发射爱心雨"
              className="pixel-btn-sm p-1.5 bg-surface hover:bg-primary-container text-primary transition-all group shrink-0"
            >
              <Heart size={15} className="fill-primary group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleOpenDrawer}
              className="pixel-btn-sm p-1.5 bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center gap-1 font-pixel text-xs shrink-0"
              title="展开侧滑菜单"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Desktop & Tablet: Full Action Tool Icons (>= 768px) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
            {/* Sound Toggle */}
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              title={settings.soundEnabled ? "静音 8-bit 音效" : "开启 8-bit 音效"}
              className={`pixel-btn-sm p-2 flex items-center justify-center transition-colors shrink-0 ${
                settings.soundEnabled 
                  ? 'bg-primary-container text-primary' 
                  : 'bg-surface-container text-outline'
              }`}
            >
              {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Heart Button */}
            <button
              onClick={triggerHeartShower}
              title="发射爱心雨"
              className="pixel-btn-sm p-2 bg-surface hover:bg-primary-container text-primary transition-all group shrink-0"
            >
              <Heart size={16} className="fill-primary group-hover:scale-110 transition-transform" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="空间个性化设置"
              className="pixel-btn-sm p-2 bg-surface hover:bg-primary-container text-on-surface-variant hover:text-primary transition-colors shrink-0"
            >
              <Settings size={16} />
            </button>

            {/* Couple Avatar */}
            <div 
              onClick={() => setIsSettingsOpen(true)}
              title="点击修改纪念日与头像"
              className="w-8 h-8 lg:w-9 lg:h-9 border-2 sm:border-3 border-pixel-outline overflow-hidden pixel-shadow-sm cursor-pointer hover:scale-105 transition-transform bg-primary-container shrink-0"
            >
              <img
                alt="情侣头像"
                className="w-full h-full object-cover"
                src={settings.avatarUrl}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar (< 768px) */}
      <div className="grid grid-cols-4 gap-1 md:hidden border-t-2 border-pixel-outline bg-surface-container dark:bg-surface-container-high p-1 px-1.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(item.path);
              }}
              className={`font-pixel text-[11px] py-1.5 px-0.5 transition-all text-center whitespace-nowrap truncate pixel-border-sm flex items-center justify-center ${
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-pixel-sm'
                  : 'bg-surface dark:bg-surface-container text-on-surface-variant hover:bg-primary-container'
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
