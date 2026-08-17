import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Heart, Trash2, Maximize2, Camera } from 'lucide-react';
import { sound } from '../utils/sound';

export const MemoriesPage: React.FC = () => {
  const { 
    memories, 
    setIsAddMemoryOpen, 
    toggleLikeMemory, 
    deleteMemory, 
    setLightboxImage 
  } = useApp();

  const [activeTag, setActiveTag] = useState<string>('all');

  const tags = [
    { key: 'all', label: '全部照片' },
    { key: 'cafe', label: '☕ 咖啡与美食' },
    { key: 'cat', label: '🐱 猫咪日常' },
    { key: 'trip', label: '✈️ 旅行漫步' },
    { key: 'gift', label: '🌼 心意礼物' },
    { key: 'daily', label: '📷 琐碎日常' },
  ];

  const filteredMemories = activeTag === 'all'
    ? memories
    : memories.filter(m => m.category === activeTag);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-margin-desktop py-10 md:py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-container text-on-secondary-container font-pixel text-xs mb-3 pixel-border-sm">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            相册归档
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-primary dark:text-primary-fixed flex items-center gap-3">
            甜蜜瞬间
            <span className="material-symbols-outlined text-3xl md:text-4xl text-primary-fixed-dim translate-y-0.5">
              cruelty_free
            </span>
          </h1>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAddMemoryOpen(true);
          }}
          className="pixel-btn bg-primary text-on-primary px-5 py-3 font-pixel text-xs md:text-sm flex items-center gap-2 self-start hover:bg-primary/90"
        >
          <Camera size={16} />
          <span>添加新回忆</span>
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tags.map((tag) => (
          <button
            key={tag.key}
            onClick={() => {
              sound.playClick();
              setActiveTag(tag.key);
            }}
            className={`pixel-btn-sm px-3.5 py-1.5 font-pixel text-xs transition-all ${
              activeTag === tag.key
                ? 'bg-primary text-on-primary font-bold shadow-pixel-sm'
                : 'bg-surface-container-lowest dark:bg-inverse-surface text-on-surface-variant dark:text-surface-dim hover:bg-primary-container'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Empty State when 0 photos */}
      {filteredMemories.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border pixel-shadow-lg p-8 md:p-12 text-center max-w-lg mx-auto flex flex-col items-center my-8 animate-fadeIn">
          <div className="w-20 h-20 bg-tertiary-container pixel-border flex items-center justify-center mb-4 animate-pulse">
            <Camera size={36} className="text-tertiary" />
          </div>
          
          <h3 className="font-display font-black text-xl md:text-2xl text-primary dark:text-primary-fixed mb-2">
            📸 胶卷还是崭新的！
          </h3>
          
          <p className="font-body text-xs md:text-sm text-on-surface-variant dark:text-surface-dim leading-relaxed mb-6 max-w-sm">
            相册比刚洗过的盘子还干净呢~ 快去拍一张甜蜜合照或者猫咪偷懒丑照贴在这里吧！🐾
          </p>

          <button
            onClick={() => {
              sound.playClick();
              setIsAddMemoryOpen(true);
            }}
            className="pixel-btn bg-primary text-on-primary font-pixel text-xs md:text-sm px-6 py-3.5 flex items-center gap-2 hover:bg-primary/90 font-bold"
          >
            <Plus size={16} />
            <span>+ 贴上第一张拍立得</span>
          </button>
        </div>
      ) : (
        /* Polaroid Masonry Grid */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 pb-12">
          {filteredMemories.map((mem) => {
            const tapeColorClass = mem.tapeColor === 'mint' 
              ? 'tape-mint' 
              : mem.tapeColor === 'lavender' 
              ? 'tape-lavender' 
              : 'tape';

            return (
              <article
                key={mem.id}
                className="polaroid-card relative bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-4 pb-5 break-inside-avoid group"
              >
                {/* Polaroid Tape Sticker */}
                <div 
                  className={`${tapeColorClass} absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-6 z-10`}
                  style={{ transform: `translateX(-50%) rotate(${mem.tapeRotation || 0}deg)` }}
                ></div>

                {/* Photo Frame with Aspect Ratio */}
                <div 
                  onClick={() => {
                    sound.playClick();
                    setLightboxImage({ url: mem.imageUrl, title: mem.description });
                  }}
                  className={`w-full bg-surface-container overflow-hidden pixel-border-sm mb-3.5 cursor-pointer relative ${
                    mem.aspectRatio === 'portrait' ? 'aspect-[3/4]' : mem.aspectRatio === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={mem.imageUrl}
                    alt={mem.title || mem.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface/90 text-primary p-2 pixel-border-sm">
                      <Maximize2 size={16} />
                    </span>
                  </div>
                </div>

                {/* Caption & Likes */}
                <div className="flex items-start justify-between gap-3">
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-surface-dim font-semibold leading-snug">
                    {mem.description}
                  </p>
                  <button
                    onClick={() => toggleLikeMemory(mem.id)}
                    className="p-1 hover:scale-110 active:scale-95 transition-transform shrink-0"
                    title="点赞"
                  >
                    <Heart
                      size={20}
                      className={mem.isLiked ? 'fill-primary text-primary' : 'text-outline hover:text-primary'}
                    />
                  </button>
                </div>

                {/* Footer info: Date & Delete button */}
                <div className="mt-3.5 pt-2 border-t border-pixel-outline/30 flex items-center justify-between">
                  <span className="text-[11px] font-pixel text-on-surface-variant dark:text-surface-dim bg-surface-container dark:bg-surface-container-high px-2 py-0.5 pixel-border-sm">
                    {mem.date}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-pixel text-primary font-bold">
                      ❤️ {mem.likes}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('确定要删除这张拍立得相片吗？')) {
                          deleteMemory(mem.id);
                        }
                      }}
                      className="text-outline hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100"
                      title="删除相片"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Add More Prompt Area Card */}
          <article
            onClick={() => {
              sound.playClick();
              setIsAddMemoryOpen(true);
            }}
            className="polaroid-card bg-primary-container/80 dark:bg-primary/20 p-8 flex flex-col items-center justify-center text-center min-h-[260px] hover:bg-primary-container transition-colors cursor-pointer group break-inside-avoid pixel-border"
          >
            <div className="w-14 h-14 bg-surface dark:bg-inverse-surface flex items-center justify-center mb-3 group-hover:-translate-y-2 transition-transform pixel-border">
              <Plus size={24} className="text-primary dark:text-primary-fixed" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-primary dark:text-primary-fixed">
              更多美好待记录
            </h3>
            <p className="font-body text-xs text-on-surface-variant dark:text-surface-dim mt-1.5 max-w-[200px]">
              点击此处或右上角按钮，为我们的甜蜜相册添上一抹色彩。
            </p>
          </article>
        </div>
      )}
    </main>
  );
};
