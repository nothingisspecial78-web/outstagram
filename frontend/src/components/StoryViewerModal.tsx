import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play } from 'lucide-react';

export interface StoryItem {
  id: string;
  username: string;
  avatar: string;
  media: string;
  caption: string;
  time: string;
}

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
    setLiked(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, stories.length, onClose]);

  if (!isOpen || !stories[currentIndex]) return null;

  const story = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md select-none animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-50 p-2 text-white/80 hover:text-white transition-colors"
      >
        <X className="size-7" />
      </button>

      {/* Prev Story */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 size-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all hidden md:flex"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Story Card Container */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between">
        {/* Story Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 rounded-full"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={story.avatar}
              alt={story.username}
              className="size-8 rounded-full border border-white/80 object-cover"
            />
            <span className="font-bold text-xs tracking-tight">{story.username}</span>
            <span className="text-[11px] text-white/60">{story.time}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
        </div>

        {/* Story Media */}
        <div
          className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 3) {
              handlePrev();
            } else {
              handleNext();
            }
          }}
        >
          <img
            src={story.media}
            alt={story.caption}
            className="w-full h-full object-cover"
          />

          {/* Caption Overlay */}
          {story.caption && (
            <div className="absolute bottom-20 inset-x-4 z-20 text-center">
              <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold shadow-lg inline-block">
                {story.caption}
              </span>
            </div>
          )}
        </div>

        {/* Next Story button on desktop */}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 size-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all hidden md:flex"
          >
            <ChevronRight className="size-6" />
          </button>
        )}

        {/* Story Bottom Reply & Like Bar */}
        <div className="absolute bottom-4 inset-x-4 z-30 flex items-center gap-3">
          <div className="flex-1 flex items-center h-10 px-4 rounded-full border border-white/50 bg-black/40 backdrop-blur-md">
            <input
              type="text"
              placeholder={`Reply to ${story.username}...`}
              className="w-full bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 transition-transform active:scale-125 ${
              liked ? 'text-rose-500 fill-rose-500' : 'text-white'
            }`}
          >
            <Heart className={`size-6 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button className="p-2 text-white hover:text-white/80">
            <Send className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
