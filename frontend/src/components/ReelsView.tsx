import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music, Volume2, VolumeX } from 'lucide-react';

export interface ReelItem {
  id: string;
  author: string;
  authorAvatar: string;
  caption: string;
  audioName: string;
  mediaUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

const REELS_DATA: ReelItem[] = [
  {
    id: 'r1',
    author: 'rahimaneey',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    caption: 'Sunset bike ride through the old canals 🚲 Sunset glow never misses #outstagram #explore',
    audioName: 'Original audio - rahimaneey · Sunset Grooves',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    likesCount: 12450,
    commentsCount: 382,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'r2',
    author: 'sham.leoo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    caption: 'Printing today’s linocut postcards by hand 🎨 Every print has its own quirks #handmade #craft',
    audioName: 'Original audio - sham.leoo · Vinyl Beats',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    likesCount: 8930,
    commentsCount: 194,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'r3',
    author: 'thesanska...',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    caption: 'Discovered this hidden courtyard cafe with no Wi-Fi. Just good espresso and notebooks ☕',
    audioName: 'Original audio - lofi city rain',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    likesCount: 15600,
    commentsCount: 512,
    isLiked: false,
    isSaved: false,
  },
];

export const ReelsView: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>(REELS_DATA);
  const [isMuted, setIsMuted] = useState(true);

  const toggleLike = (id: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
  };

  const toggleSave = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  return (
    <div className="w-full max-w-[420px] mx-auto py-4 space-y-6 flex flex-col items-center">
      {reels.map((reel) => (
        <div
          key={reel.id}
          className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 shadow-xl flex flex-col justify-between"
        >
          {/* Background Media */}
          <img
            src={reel.mediaUrl}
            alt={reel.caption}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Overlay Header */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <span className="text-white text-base font-black tracking-tight flex items-center gap-2">
              <span>Reels</span>
              <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>

          {/* Right Action Icons Column */}
          <div className="absolute right-3 bottom-8 z-20 flex flex-col items-center gap-5">
            {/* Like */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleLike(reel.id)}
                className={`p-2.5 rounded-full bg-black/35 backdrop-blur-md transition-all active:scale-125 ${
                  reel.isLiked ? 'text-rose-500' : 'text-white'
                }`}
              >
                <Heart className={`size-6 ${reel.isLiked ? 'fill-rose-500' : ''}`} />
              </button>
              <span className="text-white text-xs font-bold shadow-xs">
                {reel.likesCount >= 1000 ? `${(reel.likesCount / 1000).toFixed(1)}k` : reel.likesCount}
              </span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-1">
              <button className="p-2.5 rounded-full bg-black/35 backdrop-blur-md text-white hover:bg-black/50">
                <MessageCircle className="size-6" />
              </button>
              <span className="text-white text-xs font-bold shadow-xs">{reel.commentsCount}</span>
            </div>

            {/* Share */}
            <button className="p-2.5 rounded-full bg-black/35 backdrop-blur-md text-white hover:bg-black/50">
              <Send className="size-6" />
            </button>

            {/* Save */}
            <button
              onClick={() => toggleSave(reel.id)}
              className={`p-2.5 rounded-full bg-black/35 backdrop-blur-md transition-colors ${
                reel.isSaved ? 'text-amber-400' : 'text-white'
              }`}
            >
              <Bookmark className={`size-6 ${reel.isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            {/* More Options */}
            <button className="p-2.5 rounded-full bg-black/35 backdrop-blur-md text-white">
              <MoreHorizontal className="size-6" />
            </button>

            {/* Spinning Audio Vinyl Disc */}
            <div className="relative mt-2 size-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center animate-spin [animation-duration:5s] shadow-md">
              <div className="size-3 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500" />
            </div>
          </div>

          {/* Bottom Left Details & Caption */}
          <div className="relative z-10 p-4 pr-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white space-y-2">
            {/* Creator Row */}
            <div className="flex items-center gap-2.5">
              <img
                src={reel.authorAvatar}
                alt={reel.author}
                className="size-8 rounded-full border border-white/80 object-cover"
              />
              <span className="font-extrabold text-xs tracking-tight">{reel.author}</span>
              <button className="px-2.5 py-0.5 rounded-lg border border-white/60 text-[10px] font-bold text-white hover:bg-white/20 transition-colors">
                Follow
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/95 leading-relaxed line-clamp-2">{reel.caption}</p>

            {/* Audio Ticker */}
            <div className="flex items-center gap-2 text-[11px] text-white/80 pt-0.5">
              <Music className="size-3.5 shrink-0" />
              <span className="truncate">{reel.audioName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
