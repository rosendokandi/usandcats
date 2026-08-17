import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save, RotateCcw, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { sound } from '../utils/sound';

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDzz20depciI1E4xQB8bNanaiMnKCbIqQq0xtS6SNbKuQqXC7XWKF4T6PYZNMNnU8EwF1PkIiTGKocn8oQHlbNpy2-H-_0FNc4Vr2ZJQSjCTuevqZWfnzgojHHfsb4DhHYjy-xbRMZ8sCRTyy80x2mtYriAmAlGmAOprQX3ZKB2SEK4PjYIooKyircVD3GekH1U4i2cchQajazRmGD6uqCZsTP3JQknjmyVYviqYR0qDZv3nNg9Q1WD',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3MDexdD0Zgx66Nll3VybKtH-Ap4txXorRSmMZgpBBRcmzLqIsY8uq6Bziu6FOMmhvTSnLSl3RUReUQMVna1IpEead2potG5H_za7dv8_Q9_Xe1sO6IlsdlASvnT0n8CiNgXNBLgeoQvZ-vlDwWcgRYLMwV3CvM_QH8hp4Q1hO-nKyOg9q_8MMbA26-v6PLtadWlhhL2Igrz2bSD07RNMfUUinIbTinDx0T5HcwHZy3Vc7QbQDzIVf',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzsVyCRgaBZcB2p9-XHQyPNVNPSPjJ8ya3-OIuP61e0u78vs5csOmhXUGO3iDxU7_k164YyWD4tBAl8h_BrtKZbXjy9ebyTPNd7H3hNVHCPQBxVGbntH-S6d4LdSxGga4honNoF6NLdpsNONQIdWLn0pYO__u6WB34n1GG9FlXYlIaqtpTaooRuueEaA5F56Itbz6JZgJNHK0btE9YQqG4KxOdjv3URzWTYfNlYJsaFZXEi5kkYSNG',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkNiio0dd7DrQbmZ6iieLbMOP7Hhj6Mmefxn3PMyr57_Ey2ls_IfZRWBOap0V97zBlthouVOUOGgttQxw2Oer9V0I5Yv1wiFw8lgehSGneNXgLLFTiNUAot0NIcol5QA1294bpaDQXIA7Wt6jO6VR7SxODs-FzqNI-7kWIhnrTaG4Ijeexe9-TgVTcGGDghv5AX74d5fPbfZrK-pZOBqlu6ifEBIDX1oECeNl_28w-7OnVV88FQg_U',
];

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    sound.playSuccess();
    setIsSettingsOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        sound.playClick();
        setIsSettingsOpen(false);
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-surface dark:bg-inverse-surface pixel-border p-6 md:p-8 pixel-shadow-lg text-on-surface dark:text-inverse-on-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-primary-fixed border-2 border-pixel-outline rotate-[1deg]"></div>

        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsSettingsOpen(false);
          }}
          className="absolute -top-3 -right-3 pixel-btn-sm p-1.5 bg-primary text-on-primary hover:bg-error"
          title="关闭"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6 border-b-2 border-pixel-outline pb-3">
          <span className="material-symbols-outlined text-primary text-2xl">settings</span>
          <h2 className="font-pixel text-lg text-primary dark:text-primary-fixed font-bold uppercase">
            空间个性化设置
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-pixel text-xs">
          {/* Anniversary Date */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              在一起的纪念起始日
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Couple Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                伴侣 1 昵称
              </label>
              <input
                type="text"
                value={formData.partner1}
                onChange={(e) => setFormData({ ...formData, partner1: e.target.value })}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
                伴侣 2 昵称
              </label>
              <input
                type="text"
                value={formData.partner2}
                onChange={(e) => setFormData({ ...formData, partner2: e.target.value })}
                className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Cat Name */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-1 font-bold">
              猫咪名字
            </label>
            <input
              type="text"
              value={formData.catName}
              onChange={(e) => setFormData({ ...formData, catName: e.target.value })}
              className="w-full bg-surface-container dark:bg-surface-container-high border-2 border-pixel-outline p-2.5 font-pixel text-xs focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Avatar Preset Selection */}
          <div>
            <label className="block text-on-surface-variant dark:text-surface-dim uppercase mb-2 font-bold">
              选择情侣专属头像
            </label>
            <div className="flex gap-3 items-center">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, avatarUrl: url })}
                  className={`w-12 h-12 border-2 transition-transform overflow-hidden ${
                    formData.avatarUrl === url 
                      ? 'border-primary border-4 scale-110 shadow-pixel-sm' 
                      : 'border-pixel-outline hover:scale-105'
                  }`}
                >
                  <img src={url} alt="头像选项" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Toggles: Sound & Dark Mode */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, soundEnabled: !formData.soundEnabled })}
              className={`p-3 pixel-border-sm flex items-center justify-between transition-colors ${
                formData.soundEnabled ? 'bg-primary-container text-primary font-bold' : 'bg-surface-container'
              }`}
            >
              <span>8-Bit 音效</span>
              {formData.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, darkMode: !formData.darkMode })}
              className={`p-3 pixel-border-sm flex items-center justify-between transition-colors ${
                formData.darkMode ? 'bg-primary-container text-primary font-bold' : 'bg-surface-container'
              }`}
            >
              <span>深色像素主题</span>
              {formData.darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-pixel-outline">
            <button
              type="button"
              onClick={() => {
                if (confirm('确定要重置所有记忆数据恢复出厂设置吗？')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="pixel-btn-sm px-3 py-2 bg-surface text-error hover:bg-error-container flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>重置数据</span>
            </button>

            <button
              type="submit"
              className="pixel-btn px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-1.5 font-bold uppercase tracking-wider"
            >
              <Save size={16} />
              <span>保存配置</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
