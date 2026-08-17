import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Milestone } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

const PRESET_ICONS: { key: Milestone['category']; icon: string; label: string }[] = [
  { key: 'love', icon: 'favorite', label: '甜蜜告白' },
  { key: 'meet', icon: 'pets', label: '初心相遇' },
  { key: 'trip', icon: 'flight_takeoff', label: '浪漫旅行' },
  { key: 'cat', icon: 'cruelty_free', label: '萌宠故事' },
  { key: 'celebrate', icon: 'cake', label: '重要纪念' },
];

export const AddMilestoneModal: React.FC = () => {
  const { isAddMilestoneOpen, setIsAddMilestoneOpen, addMilestone } = useApp();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g, '.'));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Milestone['category']>('love');
  const [imageUrl, setImageUrl] = useState('');

  if (!isAddMilestoneOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const iconItem = PRESET_ICONS.find(i => i.key === category);

    addMilestone({
      date,
      title: title.trim(),
      description: description.trim(),
      category,
      icon: iconItem ? iconItem.icon : 'favorite',
      imageUrl: imageUrl.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setImageUrl('');
    setIsAddMilestoneOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        sound.playClick();
        setIsAddMilestoneOpen(false);
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-surface dark:bg-inverse-surface pixel-border p-6 md:p-8 pixel-shadow-lg text-on-surface dark:text-inverse-on-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-tertiary-container border-2 border-pixel-outline rotate-[-1deg]"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAddMilestoneOpen(false);
          }}
          className="absolute -top-3 -right-3 pixel-btn-sm p-1.5 bg-primary text-on-primary hover:bg-error"
          title="关闭"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6 border-b-2 border-pixel-outline pb-3">
          <Sparkles className="text-primary" size={22} />
          <h2 className="font-pixel text-lg text-primary dark:text-primary-fixed font-bold uppercase">
            新增故事里程碑
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-pixel text-xs">
          {/* Date & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                纪念日期
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2024.05.20"
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                故事类型
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Milestone['category'])}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              >
                {PRESET_ICONS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              里程碑标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：我们的第一次海边日出"
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Story Description */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              浪漫故事与回忆
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="写下这天发生的那些心动瞬间与难忘点滴..."
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary resize-none"
              required
            />
          </div>

          {/* Optional Photo URL */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              附加照片 URL（选填）
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t-2 border-pixel-outline">
            <button
              type="button"
              onClick={() => setIsAddMilestoneOpen(false)}
              className="pixel-btn-sm px-4 py-2 bg-surface text-on-surface-variant"
            >
              取消
            </button>
            <button
              type="submit"
              className="pixel-btn px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-1.5 font-bold uppercase tracking-wider"
            >
              <Plus size={16} />
              <span>保存里程碑</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
