import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Memory } from '../types';
import { X, Camera, ImagePlus } from 'lucide-react';
import { sound } from '../utils/sound';

const PRESET_SAMPLE_PHOTOS = [
  {
    title: '爱心猫咪咖啡拉花',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-nAS9TinbU3RDOYbZWO6_Ac4h1Zl1onP-ce2eI-vcWLDJDFcTKa7cVyZEPQp5xd3OgrSoOOZLvPW-cltyDwLHFbovApLjYLd52FTBUj_PkCV012qR64VoQQSt36ErK08YQK5benRuA3UGAeGur2bSELg5EBjst4ffbu_-ZOtFZj1kikWtEK4YjTpzYlljO7onKnRRpIuCfEyv0DccZaHqhsY2jrd1FDq2DlJSCMb73byqlKTd6dhV',
  },
  {
    title: '呼呼大睡的小猫 Mochi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApNbXTjKLlKPOgQgA9UQTEuPiUPTN-qXbvcwUBnCIWLxeVVOF9RG9mXdD_Ef6ncRk0hCV3ClcO_ptVdZaxnpKRL5byojSdEB8tySvM5qbGP1NWrQOVtQ7wRXDwRwWDdw-W4VfzSzDG6joCmB6ngq6sN2pLIkrUGXp2kKaaN_VBme-fJLY-pjQnOYYoKzSvh2jxfjWpwAxpud_395urJuLtAm8eIswKVkKShvQXdC8t0NWCFGAxdzC8',
  },
  {
    title: '公园林荫道并肩散步',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGpguA_1Dyp6Ab6KQNIr2HUcaY5qhoWekUg0nCND2FAb-me4lztrtJOFBRlXfJw_o8GBmJi9sX0q2hT5q6Z8q2Q7PTn6NUn7sINrHf0PFWxgXgNrk_Vq8HpUCxGv9lZlsDi7Z7D9Uznf8QhZ2wDE4R29SsG3tpo_MHyYMwl_2H3yIcq_p6CyL9TWe8M7z7nIFK508qiAQ_xKiIy2S8ELHdxC7cQFTl5UagbKmh5AUyCjbwUuqeD9BN',
  },
  {
    title: '暖洋洋的小雏菊花束',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJheWZVRrJ5QnUzZ6-0cf5nmA9jY1q9TI3ztIw7s46mNuXJOOP1y7-8cYmIINeSod88MaFMx2-gEVJVaWWsDXjaHLI08M-vbD4BBxJ-VuZkgFdlBZh4_ndF5M-H5A3aCxopA5IgevBCbopLhIwGwiigv4peFtGu4IA4bI-GqUA-6NNiwjnwierEnbXRa_5fBEsAYsvs-157zPAzKVIXOFJpkClIyem9cRiHiKABGBkmQ6MEUDcrvOf',
  },
];

export const AddMemoryModal: React.FC = () => {
  const { isAddMemoryOpen, setIsAddMemoryOpen, addMemory } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g, '.'));
  const [category, setCategory] = useState<Memory['category']>('daily');
  const [tapeColor, setTapeColor] = useState<Memory['tapeColor']>('pink');

  if (!isAddMemoryOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !imageUrl.trim()) return;

    const randomRot = Math.floor(Math.random() * 8) - 4;

    addMemory({
      title: title.trim() || '甜蜜瞬间',
      description: description.trim(),
      date,
      imageUrl: imageUrl.trim(),
      category,
      aspectRatio: 'square',
      tapeColor,
      tapeRotation: randomRot,
    });

    setTitle('');
    setDescription('');
    setIsAddMemoryOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        sound.playClick();
        setIsAddMemoryOpen(false);
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-surface dark:bg-inverse-surface pixel-border p-6 md:p-8 pixel-shadow-lg text-on-surface dark:text-inverse-on-surface max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary-fixed border-2 border-pixel-outline rotate-[1deg]"></div>

        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAddMemoryOpen(false);
          }}
          className="absolute -top-3 -right-3 pixel-btn-sm p-1.5 bg-primary text-on-primary hover:bg-error"
          title="关闭"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6 border-b-2 border-pixel-outline pb-3">
          <Camera className="text-primary" size={22} />
          <h2 className="font-pixel text-lg text-primary dark:text-primary-fixed font-bold uppercase">
            新增拍立得回忆
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-pixel text-xs">
          {/* Preset Photo Choice */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-2 font-bold">
              选择精选预设照片或粘贴图片链接
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_SAMPLE_PHOTOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(item.url)}
                  className={`aspect-square border-2 overflow-hidden transition-all ${
                    imageUrl === item.url 
                      ? 'border-primary border-4 scale-105 shadow-pixel-sm' 
                      : 'border-pixel-outline opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="或者粘贴任意自定义图片直链 URL..."
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2 font-pixel text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                回忆标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：周日咖啡馆"
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                拍摄日期
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Description / Caption */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              拍立得照片配文
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="写下一句关于这张照片的甜甜回忆..."
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary resize-none"
              required
            />
          </div>

          {/* Category & Tape color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                分类标签
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Memory['category'])}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              >
                <option value="daily">📷 琐碎日常</option>
                <option value="cafe">☕ 咖啡美食</option>
                <option value="cat">🐱 猫咪萌宠</option>
                <option value="trip">✈️ 旅行漫步</option>
                <option value="gift">🌼 心意礼物</option>
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                胶带贴纸颜色
              </label>
              <select
                value={tapeColor}
                onChange={(e) => setTapeColor(e.target.value as Memory['tapeColor'])}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              >
                <option value="pink">甜蜜马卡龙粉</option>
                <option value="mint">清爽薄荷抹茶绿</option>
                <option value="lavender">温柔薰衣草紫</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t-2 border-pixel-outline">
            <button
              type="button"
              onClick={() => setIsAddMemoryOpen(false)}
              className="pixel-btn-sm px-4 py-2 bg-surface text-on-surface-variant"
            >
              取消
            </button>
            <button
              type="submit"
              className="pixel-btn px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-1.5 font-bold uppercase tracking-wider"
            >
              <ImagePlus size={16} />
              <span>保存拍立得</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
