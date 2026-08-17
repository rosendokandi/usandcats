import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEFAULT_HERO_PLACEHOLDER } from '../utils/defaultData';
import { InteractiveCat } from '../components/InteractiveCat';
import { ArrowRight, BookOpen, MessageSquareHeart, Camera } from 'lucide-react';
import { sound } from '../utils/sound';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    daysTogether, 
    timeTogetherDetails, 
    memories, 
    milestones, 
    loveNotes,
    settings,
    triggerHeartShower,
    setIsSettingsOpen,
    setLightboxImage
  } = useApp();

  const [animatedDays, setAnimatedDays] = useState(0);

  // Counter roll-up animation
  useEffect(() => {
    let current = 0;
    const target = daysTogether;
    if (target <= 0) {
      setAnimatedDays(0);
      return;
    }
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedDays(target);
        clearInterval(timer);
      } else {
        setAnimatedDays(current);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [daysTogether]);

  const handleNav = (path: string) => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const displayHero = settings.heroImage || DEFAULT_HERO_PLACEHOLDER;

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-margin-desktop py-10 md:py-16 w-full max-w-5xl mx-auto gap-8 md:gap-12">
      {/* Hero Image Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-6 md:p-8 pixel-shadow flex flex-col items-center group">
        {/* Tape corners */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-fixed border-4 border-pixel-outline z-10"></div>
        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-primary-fixed border-4 border-pixel-outline z-10"></div>

        {/* Hero Photo with Chunky Stepped Border */}
        <div 
          onClick={() => {
            sound.playClick();
            if (settings.heroImage) {
              setLightboxImage({ url: settings.heroImage, title: '我们的故事旅程' });
            } else {
              setIsSettingsOpen(true);
            }
          }}
          className="w-full aspect-[4/3] bg-surface-container overflow-hidden stepped-border mb-6 relative cursor-pointer group-hover:scale-[1.01] transition-transform flex items-center justify-center"
        >
          <img
            className="w-full h-full object-cover"
            alt="情侣主图"
            src={displayHero}
          />
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-surface/95 text-primary px-3.5 py-2 font-pixel text-xs pixel-border-sm flex items-center gap-1.5 font-bold shadow-pixel-sm">
              <Camera size={14} />
              <span>{settings.heroImage ? '查看大图 ✨' : '点击设置上传情侣合照 📸'}</span>
            </span>
          </div>
        </div>

        {/* Title & Couple Names */}
        <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary dark:text-primary-fixed text-center tracking-tight">
          我们的故事旅程
        </div>
        <div className="font-pixel text-xs md:text-sm text-on-surface-variant dark:text-surface-dim mt-2 flex items-center gap-2">
          <span>{settings.partner1 || '我'}</span>
          <span className="text-primary font-bold">♥</span>
          <span>{settings.partner2 || 'TA'}</span>
          <span className="ml-1 text-primary">与小猫 {settings.catName || 'Mochi'} 🐾</span>
        </div>
      </div>

      {/* Animated Counter */}
      <div 
        onClick={triggerHeartShower}
        className="cursor-pointer bg-primary-container dark:bg-primary/20 px-6 py-4 pixel-border pixel-shadow flex flex-col sm:flex-row items-center gap-3 sm:gap-6 hover:scale-105 transition-transform"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl animate-pulse">favorite</span>
          <span className="font-pixel text-xs md:text-sm text-on-primary-container dark:text-primary-fixed tracking-wide font-bold">
            我们已经相恋了
          </span>
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <span className="font-pixel font-bold text-2xl md:text-3xl text-primary dark:text-primary-fixed">
            {animatedDays}
          </span>
          <span className="font-pixel text-xs text-on-primary-container dark:text-primary-fixed font-bold">天</span>
          
          <span className="font-pixel text-[11px] text-on-primary-container/80 dark:text-primary-fixed/80 ml-2 hidden sm:inline">
            ({timeTogetherDetails.hours}小时 {timeTogetherDetails.minutes}分 {timeTogetherDetails.seconds}秒)
          </span>
        </div>
      </div>

      {/* Interactive Pixel Cat with speech bubble */}
      <InteractiveCat />

      {/* CTA Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <button
          onClick={() => handleNav('/memories')}
          className="pixel-btn bg-primary text-on-primary font-pixel text-xs md:text-sm px-6 py-3.5 flex items-center gap-2.5 hover:bg-primary/90 font-bold"
        >
          <span>甜蜜相册 ({memories.length})</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => handleNav('/story')}
          className="pixel-btn bg-surface dark:bg-inverse-surface text-primary dark:text-primary-fixed font-pixel text-xs md:text-sm px-6 py-3.5 flex items-center gap-2.5 hover:bg-primary-container font-bold"
        >
          <BookOpen size={16} />
          <span>浪漫故事 ({milestones.length})</span>
        </button>

        <button
          onClick={() => handleNav('/notes')}
          className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs md:text-sm px-6 py-3.5 flex items-center gap-2.5 hover:opacity-90 font-bold"
        >
          <MessageSquareHeart size={16} />
          <span>小情书 ({loveNotes.length})</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl mt-4">
        <div 
          onClick={() => handleNav('/story')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-3 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-xl sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {milestones.length}
          </div>
          <div className="text-[10px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-1 font-bold">
            故事里程碑
          </div>
        </div>

        <div 
          onClick={() => handleNav('/memories')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-3 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-xl sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {memories.length}
          </div>
          <div className="text-[10px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-1 font-bold">
            拍立得相片
          </div>
        </div>

        <div 
          onClick={() => handleNav('/notes')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-3 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-xl sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {loveNotes.length}
          </div>
          <div className="text-[10px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-1 font-bold">
            小情书留言
          </div>
        </div>
      </div>
    </main>
  );
};
