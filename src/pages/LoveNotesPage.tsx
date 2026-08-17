import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Pin, Trash2, Image as ImageIcon } from 'lucide-react';
import { sound } from '../utils/sound';
import { LoveNote } from '../types';

const MOOD_OPTIONS = [
  { icon: 'favorite', label: '恋爱', iconName: 'favorite' },
  { icon: 'pets', label: '萌宠', iconName: 'cruelty_free' },
  { icon: 'photo_camera', label: '抓拍', iconName: 'photo_camera' },
  { icon: 'flight_takeoff', label: '旅行', iconName: 'flight_takeoff' },
  { icon: 'mood', label: '开心', iconName: 'mood' },
  { icon: 'auto_awesome', label: '闪耀', iconName: 'auto_awesome' },
];

const COLOR_OPTIONS: { key: LoveNote['bgColor']; label: string; bgClass: string }[] = [
  { key: 'pink', label: '甜蜜粉', bgClass: 'bg-primary-container text-on-primary-container' },
  { key: 'mint', label: '薄荷绿', bgClass: 'bg-tertiary-container text-on-tertiary-container' },
  { key: 'lavender', label: '薰衣草紫', bgClass: 'bg-secondary-container text-on-secondary-container' },
  { key: 'cream', label: '复古米白', bgClass: 'bg-surface-container-lowest text-on-surface' },
];

export const LoveNotesPage: React.FC = () => {
  const { 
    loveNotes, 
    addLoveNote, 
    toggleLikeLoveNote, 
    togglePinLoveNote, 
    deleteLoveNote, 
    settings,
    setLightboxImage
  } = useApp();

  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(settings.partner1);
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState<LoveNote['bgColor']>('pink');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showMoodMenu, setShowMoodMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addLoveNote({
      author,
      content: content.trim(),
      date: '刚刚',
      mood: selectedMood.label,
      moodIcon: selectedMood.iconName,
      bgColor: selectedColor,
      imageUrl: imageUrl.trim() || undefined,
      isPinned: false,
    });

    setContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  // Sort notes: pinned first
  const sortedNotes = [...loveNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-margin-desktop py-10 md:py-16 flex flex-col gap-12">
      {/* Hero Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center bg-primary-container text-on-primary-container font-pixel text-xs px-4 py-2 pixel-border-sm shadow-pixel-sm">
          <span className="material-symbols-outlined text-sm mr-1.5">edit_note</span>
          像素小情书与治愈留言板
        </div>
        <h1 className="font-display font-black text-3xl md:text-5xl text-primary dark:text-primary-fixed tracking-tight">
          留下满满的爱意
        </h1>
        <p className="font-body text-sm md:text-base text-on-surface-variant dark:text-surface-dim max-w-md mx-auto">
          写下一张便签，分享今日心情。这些微小的生活碎片拼凑成了我们的专属电子回忆录。
        </p>
      </section>

      {/* Input Box Area */}
      <section className="w-full max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-inverse-surface pixel-border pixel-shadow p-6 md:p-8 relative">
          {/* Decorative cat icon */}
          <div className="absolute -top-3 -right-3 w-12 h-12 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-4xl text-primary">pets</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 font-pixel text-xs">
            {/* Top Toolbar: Author & Note Color */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-pixel-outline pb-3">
              {/* Author Switch */}
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant dark:text-surface-dim uppercase font-bold">来自:</span>
                <div className="flex gap-1.5">
                  {[settings.partner1, settings.partner2, `${settings.catName} 🐾`].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAuthor(name);
                      }}
                      className={`pixel-btn-sm px-2.5 py-1 text-[11px] transition-all ${
                        author === name 
                          ? 'bg-primary text-on-primary font-bold shadow-pixel-sm' 
                          : 'bg-surface dark:bg-surface-container text-on-surface-variant hover:bg-primary-container'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Chooser */}
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant dark:text-surface-dim uppercase font-bold text-[10px]">便签底色:</span>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      sound.playClick();
                      setSelectedColor(c.key);
                    }}
                    className={`w-6 h-6 pixel-border-sm transition-transform ${
                      c.bgClass
                    } ${selectedColor === c.key ? 'scale-125 border-primary shadow-pixel-sm' : 'opacity-70 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            {/* Note Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-on-surface-variant dark:text-surface-dim uppercase font-bold" htmlFor="love-note">
                写下你的便签
              </label>
              <textarea
                id="love-note"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下一句想对TA说的情话、日常提醒或琐碎开心事..."
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline focus:border-primary focus:outline-none p-3.5 font-body text-sm text-on-surface dark:text-inverse-on-surface resize-none shadow-inner"
                required
              />
            </div>

            {/* Image attachment URL input */}
            {showImageInput && (
              <div className="animate-fadeIn">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="粘贴要附加的照片直链 URL..."
                  className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                {/* Mood Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoodMenu(!showMoodMenu)}
                    className="pixel-btn-sm p-2 bg-primary-container text-primary flex items-center gap-1 hover:bg-primary-fixed"
                    title="选择心情"
                  >
                    <span className="material-symbols-outlined text-base">{selectedMood.iconName}</span>
                    <span className="text-[11px] hidden sm:inline">{selectedMood.label}</span>
                  </button>

                  {showMoodMenu && (
                    <div className="absolute bottom-full mb-2 left-0 bg-surface dark:bg-inverse-surface pixel-border p-2 pixel-shadow z-20 flex gap-2">
                      {MOOD_OPTIONS.map((mood) => (
                        <button
                          key={mood.label}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedMood(mood);
                            setShowMoodMenu(false);
                          }}
                          className="p-1.5 hover:bg-primary-container pixel-border-sm text-primary"
                          title={mood.label}
                        >
                          <span className="material-symbols-outlined text-lg">{mood.iconName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo attachment toggle */}
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`pixel-btn-sm p-2 flex items-center gap-1 transition-colors ${
                    showImageInput ? 'bg-primary text-on-primary' : 'bg-primary-container text-primary hover:bg-primary-fixed'
                  }`}
                  title="附加照片"
                >
                  <ImageIcon size={16} />
                  <span className="text-[11px] hidden sm:inline">照片</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="pixel-btn bg-primary text-on-primary font-pixel text-xs px-5 py-2.5 flex items-center gap-2 hover:bg-primary/90 uppercase tracking-wider"
              >
                <span>发送情书</span>
                <Heart size={15} className="fill-on-primary" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {sortedNotes.map((note) => {
          const bgClass = note.bgColor === 'mint'
            ? 'bg-tertiary-container text-on-background'
            : note.bgColor === 'lavender'
            ? 'bg-secondary-container text-on-background'
            : note.bgColor === 'cream'
            ? 'bg-surface-container-lowest dark:bg-inverse-surface text-on-background dark:text-inverse-on-surface'
            : 'bg-primary-container text-on-background';

          return (
            <article
              key={note.id}
              style={{ transform: `rotate(${note.rotation}deg)` }}
              className={`${bgClass} pixel-border pixel-shadow p-6 sticky-note-header hover:rotate-0 transition-transform duration-200 flex flex-col justify-between min-h-[220px] relative group`}
            >
              {/* Pinned Badge */}
              {note.isPinned && (
                <div className="absolute top-2 right-2 text-primary font-pixel text-[10px] flex items-center gap-0.5 bg-surface/80 px-1.5 py-0.5 pixel-border-sm">
                  <Pin size={11} className="fill-primary" />
                  <span>已置顶</span>
                </div>
              )}

              {/* Note Content */}
              <div>
                <p className="font-body text-sm sm:text-base leading-relaxed font-bold mb-3">
                  {note.content}
                </p>

                {/* Attached Photo */}
                {note.imageUrl && (
                  <div 
                    onClick={() => {
                      sound.playClick();
                      setLightboxImage({ url: note.imageUrl!, title: note.content });
                    }}
                    className="w-full h-32 overflow-hidden pixel-border-sm mb-3 cursor-pointer hover:opacity-90"
                  >
                    <img src={note.imageUrl} alt="附加图片" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Note Footer */}
              <div className="mt-4 pt-3 border-t-2 border-pixel-outline flex items-center justify-between font-pixel text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary dark:text-primary-fixed">
                    {note.author}
                  </span>
                  <span className="text-outline text-[10px]">
                    • {note.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pin button */}
                  <button
                    onClick={() => togglePinLoveNote(note.id)}
                    title={note.isPinned ? "取消置顶" : "置顶此留言"}
                    className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Pin size={14} className={note.isPinned ? 'fill-primary text-primary' : ''} />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (confirm('确定要删除这条便签吗？')) {
                        deleteLoveNote(note.id);
                      }
                    }}
                    title="删除便签"
                    className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Like button */}
                  <button
                    onClick={() => toggleLikeLoveNote(note.id)}
                    className="flex items-center gap-1 hover:scale-110 active:scale-90 transition-transform text-primary"
                    title="点赞"
                  >
                    <Heart
                      size={16}
                      className={note.isLiked ? 'fill-primary text-primary' : 'text-outline'}
                    />
                    <span className="font-bold text-[11px]">{note.likes}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Decorative Bottom Mascot */}
      <div className="flex justify-center mt-4 opacity-40">
        <span className="material-symbols-outlined text-4xl text-pixel-outline">pets</span>
      </div>
    </main>
  );
};
