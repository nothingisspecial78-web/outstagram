import React from 'react';
import { X, User, Bell, Lock, Shield, Eye, Smartphone, HelpCircle, LogOut } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const items = [
    { icon: User, label: 'Edit profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Lock, label: 'Account privacy' },
    { icon: Eye, label: 'Close Friends' },
    { icon: Shield, label: 'Security & login' },
    { icon: Smartphone, label: 'Demo Mode & Device sync' },
    { icon: HelpCircle, label: 'Help & support' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
          <h3 className="font-extrabold text-base text-slate-900">Settings</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="size-5" />
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
          {items.map((it, idx) => (
            <button
              key={idx}
              onClick={onClose}
              className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <it.icon className="size-4.5 text-slate-500" />
              <span>{it.label}</span>
            </button>
          ))}

          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left font-bold"
          >
            <LogOut className="size-4.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
