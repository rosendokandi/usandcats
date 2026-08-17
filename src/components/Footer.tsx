import React from 'react';
import { useApp } from '../context/AppContext';
import { fireBigCelebration } from '../utils/confetti';
import { sound } from '../utils/sound';

export const Footer: React.FC = () => {
  const { settings, daysTogether } = useApp();

  const handleEasterEgg = () => {
    sound.playSuccess();
    fireBigCelebration();
  };

  return (
    <footer className="bg-surface-container dark:bg-inverse-surface w-full border-t-4 border-pixel-outline py-8 mt-auto z-10 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-margin-desktop max-w-7xl mx-auto gap-4">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">pets</span>
          <span className="font-pixel text-headline-md text-primary dark:text-primary-fixed text-lg font-bold">
            Us & Cats
          </span>
          <span className="text-xs font-pixel text-on-surface-variant dark:text-surface-dim ml-2 hidden sm:inline">
            // {settings.partner1} & {settings.partner2} (已相恋 {daysTogether} 天)
          </span>
        </div>

        {/* Center info */}
        <div className="font-pixel text-xs text-on-surface-variant dark:text-surface-dim text-center">
          © {new Date().getFullYear()} Us & Cats. 像素与爱，甜蜜满载。
        </div>

        {/* Action links & Easter egg */}
        <div className="flex items-center gap-5">
          <button 
            onClick={handleEasterEgg}
            className="font-pixel text-xs text-primary hover:text-primary-fixed-variant hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>🎉 触发庆祝彩蛋！</span>
          </button>
          <a 
            href="#top" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); sound.playClick(); }}
            className="font-pixel text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            ↑ 回到顶部
          </a>
        </div>
      </div>
    </footer>
  );
};
