import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { Volume2, VolumeX, Settings, Heart, Radio, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    settings, 
    updateSettings, 
    setIsSettingsOpen, 
    triggerHeartShower,
    currentRoom,
    setIsRoomModalOpen
  } = useApp();

  const navItems: { key: TabType; label: string }[] = [
    { key: 'home', label: '首页' },
    { key: 'story', label: '我们的故事' },
    { key: 'memories', label: '甜蜜瞬间' },
    { key: 'notes', label: '小情书' },
  ];

  return (
    <header className="bg-surface/95 dark:bg-inverse-surface/95 border-b-4 border-pixel-outline pixel-shadow w-full sticky top-0 z-40 backdrop-blur-sm transition-colors">
      <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop py-3.5 max-w-7xl mx-auto h-20">
        {/* Brand Logo & Room Badge */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('home')}
            className="font-pixel text-headline-md text-primary dark:text-primary-fixed flex items-center gap-2 text-lg md:text-2xl font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all text-left"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl text-primary dark:text-primary-fixed">pets</span>
            <span className="tracking-wide">US & CATS</span>
          </button>

          {/* Room Online Indicator Badge */}
          <button
            onClick={() => setIsRoomModalOpen(true)}
            className={`font-pixel text-[11px] px-2.5 py-1 pixel-border-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRoom 
                ? 'bg-tertiary-container text-tertiary font-bold animate-pulse hover:scale-105' 
                : 'bg-surface-container text-outline hover:bg-primary-container hover:text-primary'
            }`}
            title={currentRoom ? `已连接房间：${currentRoom.roomId}，点击管理` : "当前为本地单机模式，点击创建/加入情侣房间"}
          >
            {currentRoom ? (
              <>
                <Radio size={12} className="text-tertiary animate-spin" />
                <span className="hidden sm:inline">房间:</span>
                <span>{currentRoom.roomId}</span>
              </>
            ) : (
              <>
                <Home size={12} />
                <span>情侣房间</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentTab(item.key)}
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
        <div className="flex items-center gap-2 md:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            title={settings.soundEnabled ? "静音 8-bit 音效" : "开启 8-bit 音效"}
            className={`pixel-btn-sm p-2 flex items-center justify-center transition-colors ${
              settings.soundEnabled 
                ? 'bg-primary-container text-primary' 
                : 'bg-surface-container text-outline'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Heart Button */}
          <button
            onClick={triggerHeartShower}
            title="发射爱心雨"
            className="pixel-btn-sm p-2 bg-surface hover:bg-primary-container text-primary transition-all group"
          >
            <Heart size={18} className="fill-primary group-hover:scale-110 transition-transform" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="空间个性化设置"
            className="pixel-btn-sm p-2 bg-surface hover:bg-primary-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <Settings size={18} />
          </button>

          {/* Couple Avatar */}
          <div 
            onClick={() => setIsSettingsOpen(true)}
            title="点击修改纪念日与头像"
            className="w-9 h-9 md:w-10 md:h-10 border-4 border-pixel-outline overflow-hidden pixel-shadow-sm ml-0.5 cursor-pointer hover:scale-105 transition-transform bg-primary-container"
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
      <div className="flex md:hidden border-t-2 border-pixel-outline bg-surface-container dark:bg-surface-container-high px-2 py-1.5 justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentTab(item.key)}
              className={`font-pixel text-[12px] px-2.5 py-1 transition-all ${
                isActive
                  ? 'bg-primary text-on-primary font-bold pixel-border-sm'
                  : 'text-on-surface-variant'
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
