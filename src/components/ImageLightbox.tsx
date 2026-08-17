import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';
import { sound } from '../utils/sound';

export const ImageLightbox: React.FC = () => {
  const { lightboxImage, setLightboxImage } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, setLightboxImage]);

  if (!lightboxImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
      onClick={() => {
        sound.playClick();
        setLightboxImage(null);
      }}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-surface-container-lowest dark:bg-inverse-surface pixel-border p-4 md:p-6 pixel-shadow-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape stickers */}
        <div className="absolute -top-3.5 left-8 w-16 h-6 bg-primary-fixed border-2 border-pixel-outline rotate-[-3deg]"></div>
        <div className="absolute -top-3.5 right-8 w-16 h-6 bg-secondary-fixed border-2 border-pixel-outline rotate-[3deg]"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            setLightboxImage(null);
          }}
          className="absolute -top-4 -right-4 pixel-btn p-2 bg-primary text-on-primary hover:bg-error transition-colors z-20"
          title="关闭大图"
        >
          <X size={18} />
        </button>

        {/* Image Display */}
        <div className="w-full max-h-[70vh] overflow-hidden border-2 border-pixel-outline bg-black/10 flex items-center justify-center">
          <img
            src={lightboxImage.url}
            alt={lightboxImage.title || '照片大图'}
            className="max-h-[70vh] w-auto object-contain"
          />
        </div>

        {/* Caption */}
        {lightboxImage.title && (
          <div className="mt-4 text-center font-pixel text-sm md:text-base text-primary dark:text-primary-fixed font-bold">
            {lightboxImage.title}
          </div>
        )}
      </div>
    </div>
  );
};
