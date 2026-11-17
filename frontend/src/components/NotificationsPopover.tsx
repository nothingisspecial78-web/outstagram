import React from 'react';
import { X } from 'lucide-react';

interface NotificationItem {
  id: string;
  avatar: string;
  name: string;
  action: string;
  time: string;
  thumbnail?: string;
  isFollow?: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    name: 'Mohamed Farhan',
    action: 'started following you.',
    time: '2h',
    isFollow: true,
  },
  {
    id: 'n2',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    name: 'rahimaneey',
    action: 'liked your postcard from West Pier.',
    time: '4h',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'n3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    name: 'thesanska...',
    action: 'commented: "This light 😍"',
    time: '1d',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'n4',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    name: 'Thamjeed',
    action: 'started following you.',
    time: '2d',
    isFollow: true,
  },
];

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 md:left-18 xl:left-60 z-50 w-full sm:w-96 bg-white border-r border-slate-200 shadow-2xl flex flex-col animate-slide-right select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-xl text-slate-900 tracking-tight">Notifications</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
          <X className="size-5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50 no-scrollbar">
        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">This Week</div>
        {NOTIFICATIONS.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors">
            <img
              src={item.avatar}
              alt={item.name}
              className="size-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-slate-900 leading-snug">
                <span className="font-extrabold">{item.name}</span>{' '}
                <span className="text-slate-600">{item.action}</span>
              </p>
              <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
            </div>

            {item.isFollow ? (
              <button className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs shrink-0">
                Follow
              </button>
            ) : item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt="Thumbnail"
                className="size-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
