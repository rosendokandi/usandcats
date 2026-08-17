import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '确认退出当前房间？',
  message = '退出后将断开当前云端同步，清空本地展示数据并安全返回门禁大厅。下次需重新输入房间暗号与密码才能进入。',
  confirmText = '确认退出',
  cancelText = '取消 / 再想想',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        sound.playClick();
        onClose();
      }}
    >
      <div 
        className="relative w-full max-w-sm bg-surface dark:bg-inverse-surface pixel-border p-6 pixel-shadow-lg text-on-surface dark:text-inverse-on-surface animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-tertiary-container border border-pixel-outline rotate-[-2deg]"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute -top-3 -right-3 pixel-btn-sm p-1.5 bg-surface-container hover:bg-error hover:text-white"
        >
          <X size={14} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-2 mb-3 text-error">
          <AlertTriangle size={20} className="animate-bounce" />
          <h3 className="font-pixel text-sm font-bold">{title}</h3>
        </div>

        {/* Message */}
        <p className="font-body text-xs text-on-surface-variant dark:text-surface-dim leading-relaxed mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 font-pixel text-xs">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 pixel-btn-sm py-2.5 px-3 bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-center font-bold"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onConfirm();
            }}
            className="flex-1 pixel-btn-sm py-2.5 px-3 bg-error text-white hover:opacity-90 flex items-center justify-center gap-1.5 font-bold"
          >
            <LogOut size={13} />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
