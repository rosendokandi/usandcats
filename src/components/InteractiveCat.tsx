import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PIXEL_CAT_IMAGE, CAT_QUOTES } from '../utils/defaultData';
import { sound } from '../utils/sound';
import { fireHeartShower } from '../utils/confetti';

export const InteractiveCat: React.FC = () => {
  const { settings } = useApp();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleCatClick = (e: React.MouseEvent) => {
    sound.playMeow();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);

    // Increment quote
    setQuoteIndex((prev) => (prev + 1) % CAT_QUOTES.length);
    setPetCount((prev) => prev + 1);

    // Heart shower from cat
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    fireHeartShower(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 select-none">
      {/* Speech Bubble */}
      <div 
        onClick={handleCatClick}
        className="cursor-pointer bg-surface-container-lowest dark:bg-inverse-surface pixel-border px-5 py-3 font-pixel text-xs md:text-sm text-on-surface dark:text-inverse-on-surface pixel-shadow mb-4 relative max-w-xs md:max-w-md text-center hover:scale-105 transition-transform"
      >
        <span>{CAT_QUOTES[quoteIndex]}</span>
        
        {/* Pixel tail */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-t-[14px] border-t-pixel-outline border-r-[12px] border-r-transparent"></div>
        <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-surface-container-lowest dark:border-t-inverse-surface border-r-[8px] border-r-transparent z-10"></div>
      </div>

      {/* Cat Avatar with interaction */}
      <div className="relative group cursor-pointer" onClick={handleCatClick}>
        <div 
          className={`w-24 h-24 md:w-28 md:h-28 transition-transform duration-200 ${
            isBouncing ? 'scale-125 -translate-y-2' : 'animate-cat-purr group-hover:scale-110'
          }`}
        >
          <img
            src={PIXEL_CAT_IMAGE}
            alt={settings.catName}
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        {/* Pet count badge */}
        {petCount > 0 && (
          <div className="absolute -top-1 -right-2 bg-primary text-on-primary font-pixel text-[10px] px-1.5 py-0.5 pixel-border-sm animate-bounce">
            ❤️ 抚摸 x{petCount}
          </div>
        )}
      </div>

      <div className="font-pixel text-[11px] text-on-surface-variant dark:text-surface-dim mt-1">
        点击小猫 <span className="font-bold text-primary dark:text-primary-fixed">{settings.catName}</span> 抚摸并听它说话！🐾
      </div>
    </div>
  );
};
