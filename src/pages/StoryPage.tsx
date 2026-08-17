import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Heart, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

export const StoryPage: React.FC = () => {
  const { 
    milestones, 
    setIsAddMilestoneOpen, 
    toggleLikeMilestone, 
    setLightboxImage 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: '全部故事' },
    { key: 'meet', label: '初心相识' },
    { key: 'trip', label: '浪漫旅行' },
    { key: 'love', label: '甜蜜告白' },
    { key: 'cat', label: '萌宠日常' },
  ];

  const filteredMilestones = activeCategory === 'all'
    ? milestones
    : milestones.filter(m => m.category === activeCategory);

  return (
    <main className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-margin-desktop py-12 md:py-16 relative">
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-14 relative z-10">
        <span className="inline-block px-4 py-1 bg-primary-container text-on-primary-container font-pixel text-xs mb-3 pixel-border-sm shadow-pixel-sm">
          浪漫足迹
        </span>
        <h1 className="font-display font-black text-3xl md:text-5xl text-primary dark:text-primary-fixed tracking-tight">
          一起走过的每一步
        </h1>
        <p className="font-body text-sm md:text-base text-on-surface-variant dark:text-surface-dim mt-2 max-w-2xl mx-auto">
          从初遇的怦然心动，到未来的岁岁年年。记录我们共同写下的每一个温馨章节。
        </p>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(c.key);
                }}
                className={`pixel-btn-sm px-3.5 py-1.5 font-pixel text-xs transition-all ${
                  activeCategory === c.key
                    ? 'bg-primary text-on-primary font-bold shadow-pixel-sm'
                    : 'bg-surface dark:bg-inverse-surface text-on-surface-variant dark:text-surface-dim hover:bg-primary-container'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsAddMilestoneOpen(true);
            }}
            className="pixel-btn bg-primary text-on-primary font-pixel text-xs px-4 py-2 flex items-center gap-1.5 hover:bg-primary/90 ml-2"
          >
            <Plus size={16} />
            <span>添加故事里程碑</span>
          </button>
        </div>
      </div>

      {/* When Empty: Cute & Humorous Pixel Empty State */}
      {filteredMilestones.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border pixel-shadow-lg p-8 md:p-12 text-center max-w-lg mx-auto flex flex-col items-center my-8 animate-fadeIn">
          <div className="w-20 h-20 bg-primary-container pixel-border flex items-center justify-center mb-4 animate-bounce">
            <BookOpen size={36} className="text-primary" />
          </div>
          
          <h3 className="font-display font-black text-xl md:text-2xl text-primary dark:text-primary-fixed mb-2">
            🐱 哎呀，这里还空空如也！
          </h3>
          
          <p className="font-body text-xs md:text-sm text-on-surface-variant dark:text-surface-dim leading-relaxed mb-6 max-w-sm">
            难道你们第一天相遇就直接瞬移到现在了？快点击下方按钮，写下属于你们的第一个浪漫里程碑吧！✨
          </p>

          <button
            onClick={() => {
              sound.playClick();
              setIsAddMilestoneOpen(true);
            }}
            className="pixel-btn bg-primary text-on-primary font-pixel text-xs md:text-sm px-6 py-3.5 flex items-center gap-2 hover:bg-primary/90 font-bold"
          >
            <Plus size={16} />
            <span>+ 记录第一个甜蜜故事</span>
          </button>
        </div>
      ) : (
        /* Timeline Container */
        <div className="relative w-full py-6 sm:py-8">
          {/* Central Dashed/Pixel Line */}
          <div className="timeline-line hidden md:block"></div>
          {/* Mobile Line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-1 bg-pixel-outline md:hidden"></div>

          {/* Milestones List */}
          <div className="space-y-8 sm:space-y-12 md:space-y-16">
            {filteredMilestones.map((m, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={m.id}
                  className={`relative flex items-center w-full ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } group`}
                >
                  {/* Node Icon on Center Line */}
                  <div className="absolute left-[18px] md:left-1/2 transform -translate-x-1/2 w-9 h-9 md:w-12 md:h-12 bg-surface dark:bg-inverse-surface rounded-full border-3 md:border-4 border-pixel-outline flex items-center justify-center z-10 pixel-shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-base md:text-xl">
                      {m.icon || 'pets'}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="w-full pl-12 md:pl-0 md:w-5/12">
                    <div className="bg-surface-container-lowest dark:bg-inverse-surface p-4 sm:p-6 pixel-border pixel-shadow relative group-hover:-translate-y-1 transition-transform">
                      {/* Decorative Tape */}
                      <div className="absolute -top-3 right-3 sm:right-4 w-10 sm:w-12 h-4 sm:h-5 bg-tertiary-container border-2 border-pixel-outline rotate-[-3deg]"></div>

                      {/* Date */}
                      <div className="font-pixel text-xs text-primary dark:text-primary-fixed font-bold mb-1.5 flex items-center justify-between">
                        <span>{m.date}</span>
                        <button
                          onClick={() => toggleLikeMilestone(m.id)}
                          className="flex items-center gap-1 text-primary hover:scale-110 transition-transform"
                          title="喜欢这段回忆"
                        >
                          <Heart 
                            size={13} 
                            className={m.isLiked ? 'fill-primary text-primary' : 'text-outline'} 
                          />
                          <span className="text-[10px] sm:text-[11px] font-pixel">{m.likes}</span>
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-base sm:text-xl text-on-surface dark:text-inverse-on-surface mb-1.5 sm:mb-2">
                        {m.title}
                      </h3>

                      {/* Description */}
                      <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-surface-dim leading-relaxed">
                        {m.description}
                      </p>

                      {/* Photo if present */}
                      {m.imageUrl && (
                        <div className="mt-4">
                          <div 
                            onClick={() => {
                              sound.playClick();
                              setLightboxImage({ url: m.imageUrl!, title: m.title });
                            }}
                            className="w-28 h-28 sm:w-32 sm:h-32 bg-surface-container overflow-hidden pixel-border-sm cursor-pointer hover:scale-105 transition-transform group/img relative"
                          >
                            <img
                              src={m.imageUrl}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <Sparkles size={16} className="text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Anchor / CTA */}
          <div className="flex justify-center mt-14">
            <button
              onClick={() => {
                sound.playClick();
                setIsAddMilestoneOpen(true);
              }}
              className="pixel-btn px-6 py-3 bg-surface dark:bg-inverse-surface text-primary dark:text-primary-fixed font-pixel text-xs flex items-center gap-2 hover:bg-primary-container"
            >
              <span>未完待续... (点击添加新故事)</span>
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
