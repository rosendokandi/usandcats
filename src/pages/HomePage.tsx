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
    <main className="flex-grow flex flex-col items-center justify-center px-3 sm:px-4 md:px-margin-desktop py-6 sm:py-10 md:py-16 w-full max-w-5xl mx-auto gap-6 sm:gap-8 md:gap-12">
      {/* Hero Image Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-4 sm:p-6 md:p-8 pixel-shadow flex flex-col items-center group">
        {/* Tape corners */}
        <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-primary-fixed border-3 sm:border-4 border-pixel-outline z-10"></div>
        <div className="absolute -bottom-2.5 -right-2.5 sm:-bottom-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-primary-fixed border-3 sm:border-4 border-pixel-outline z-10"></div>

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
          className="w-full aspect-[4/3] bg-surface-container overflow-hidden stepped-border mb-4 sm:mb-6 relative cursor-pointer group-hover:scale-[1.01] transition-transform flex items-center justify-center"
        >
          <img
            className="w-full h-full object-cover"
            alt="情侣主图"
            src={displayHero}
          />
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-surface/95 text-primary px-3 py-1.5 font-pixel text-[11px] sm:text-xs pixel-border-sm flex items-center gap-1.5 font-bold shadow-pixel-sm">
              <Camera size={13} />
              <span>{settings.heroImage ? '查看大图 ✨' : '点击设置上传情侣合照 📸'}</span>
            </span>
          </div>
        </div>

        {/* Title & Couple Names */}
        <div className="font-display font-black text-xl sm:text-3xl md:text-4xl text-primary dark:text-primary-fixed text-center tracking-tight">
          我们的故事旅程
        </div>
        <div className="font-pixel text-xs sm:text-sm text-on-surface-variant dark:text-surface-dim mt-1.5 sm:mt-2 flex items-center gap-1.5 flex-wrap justify-center text-center">
          <span>{settings.partner1 || '我'}</span>
          <span className="text-primary font-bold">♥</span>
          <span>{settings.partner2 || 'TA'}</span>
          <span className="ml-1 text-primary">与小猫 {settings.catName || 'Mochi'} 🐾</span>
        </div>
      </div>

      {/* Animated Counter */}
      <div 
        onClick={() => {
          if (!settings.startDate) {
            setIsSettingsOpen(true);
          } else {
            triggerHeartShower();
          }
        }}
        className="cursor-pointer bg-primary-container dark:bg-primary/20 px-4 py-3 sm:px-6 sm:py-4 pixel-border pixel-shadow flex flex-col sm:flex-row items-center gap-2 sm:gap-6 hover:scale-105 transition-transform text-center"
        title={!settings.startDate ? "点击设置恋爱起始纪念日" : "发射爱心雨"}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl animate-pulse">favorite</span>
          <span className="font-pixel text-xs sm:text-sm text-on-primary-container dark:text-primary-fixed tracking-wide font-bold">
            {settings.startDate ? "我们已经相恋了" : "我们的小屋已开启"}
          </span>
        </div>
        
        <div className="flex items-baseline gap-1.5 flex-wrap justify-center">
          <span className="font-pixel font-bold text-2xl sm:text-3xl text-primary dark:text-primary-fixed">
            {animatedDays}
          </span>
          <span className="font-pixel text-xs text-on-primary-container dark:text-primary-fixed font-bold">天</span>
          
          {settings.startDate ? (
            <span className="font-pixel text-[10px] sm:text-[11px] text-on-primary-container/80 dark:text-primary-fixed/80 ml-1.5">
              ({timeTogetherDetails.hours}时 {timeTogetherDetails.minutes}分 {timeTogetherDetails.seconds}秒)
            </span>
          ) : (
            <span className="font-pixel text-[11px] text-primary ml-1.5 underline">
              (点击设置纪念日)
            </span>
          )}
        </div>
      </div>

      {/* Interactive Pixel Cat with speech bubble */}
      <InteractiveCat />

      {/* CTA Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl">
        <button
          onClick={() => handleNav('/memories')}
          className="pixel-btn bg-primary text-on-primary font-pixel text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-2 hover:bg-primary/90 font-bold"
        >
          <span>甜蜜相册 ({memories.length})</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={() => handleNav('/story')}
          className="pixel-btn bg-surface dark:bg-inverse-surface text-primary dark:text-primary-fixed font-pixel text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-2 hover:bg-primary-container font-bold"
        >
          <BookOpen size={15} />
          <span>浪漫故事 ({milestones.length})</span>
        </button>

        <button
          onClick={() => handleNav('/notes')}
          className="pixel-btn bg-tertiary-container text-tertiary font-pixel text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-2 hover:opacity-90 font-bold"
        >
          <MessageSquareHeart size={15} />
          <span>小情书 ({loveNotes.length})</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-xl">
        <div 
          onClick={() => handleNav('/story')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-2.5 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-lg sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {milestones.length}
          </div>
          <div className="text-[9px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-0.5 sm:mt-1 font-bold">
            故事里程碑
          </div>
        </div>

        <div 
          onClick={() => handleNav('/memories')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-2.5 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-lg sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {memories.length}
          </div>
          <div className="text-[9px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-0.5 sm:mt-1 font-bold">
            拍立得相片
          </div>
        </div>

        <div 
          onClick={() => handleNav('/notes')}
          className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-2.5 sm:p-4 text-center pixel-shadow-sm cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="text-lg sm:text-2xl font-bold font-pixel text-primary dark:text-primary-fixed">
            {loveNotes.length}
          </div>
          <div className="text-[9px] sm:text-xs font-pixel text-on-surface-variant dark:text-surface-dim uppercase mt-0.5 sm:mt-1 font-bold">
            小情书留言
          </div>
        </div>
      </div>
    </main>
  );
};
