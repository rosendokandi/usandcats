import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X } from 'lucide-react';

export const RealtimeToast: React.FC = () => {
  const { realtimeToast, setRealtimeToast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (realtimeToast) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setRealtimeToast(null), 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [realtimeToast, setRealtimeToast]);

  if (!realtimeToast || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 animate-bounce">
      <div className="pixel-border pixel-shadow-lg bg-surface dark:bg-inverse-surface p-4 flex items-center gap-3 max-w-sm relative">
        {/* Tail for bubble */}
        <div className="absolute -bottom-[8px] right-8 w-4 h-4 bg-surface dark:bg-inverse-surface pixel-border border-t-0 border-l-0 transform rotate-45 hidden md:block"></div>
        
        <div className="w-3 h-3 bg-tertiary rounded-none pixel-border animate-pulse flex-shrink-0"></div>
        
        <div className="flex-1 font-body text-xs md:text-sm text-pixel-outline dark:text-inverse-on-surface flex items-center gap-1.5 font-bold">
          <Sparkles size={16} className="text-primary animate-spin" />
          <span>{realtimeToast.message}</span>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            setRealtimeToast(null);
          }}
          className="text-outline hover:text-primary p-0.5"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
