import React, { useState } from 'react';
import { X, MapPin, Smile } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: { caption: string; location: string; mediaUrl: string }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('West Pier, Berlin');
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  );

  if (!isOpen) return null;

  const handleShare = () => {
    if (!caption.trim()) return;
    onPostCreated({
      caption,
      location,
      mediaUrl: selectedImage,
    });
    setCaption('');
    onClose();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white hover:text-slate-300 transition-colors"
      >
        <X className="size-8" />
      </button>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[520px]">
        {/* Left Side: Media Preview */}
        <div className="w-full md:w-[58%] h-64 md:h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          <img
            src={selectedImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          {/* Quick photo picker overlay */}
          <div className="absolute bottom-3 inset-x-3 p-2 rounded-2xl bg-black/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {sampleImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`size-10 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-[#FF6B00] scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const random = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                setSelectedImage(random);
              }}
              className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold"
            >
              Shuffle
            </button>
          </div>
        </div>

        {/* Right Side: Details & Caption */}
        <div className="w-full md:w-[42%] flex flex-col justify-between p-5 border-l border-slate-100 bg-white">
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Create new Outstagram post</h3>
              <button
                onClick={handleShare}
                disabled={!caption.trim()}
                className={`text-xs font-bold transition-colors ${
                  caption.trim() ? 'text-[#FF6B00] hover:text-orange-600' : 'text-slate-300'
                }`}
              >
                Share
              </button>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                <div className="size-full rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-slate-800">
                  AB
                </div>
              </div>
              <span className="font-bold text-xs text-slate-900">abdullanothing7</span>
            </div>

            {/* Caption Textarea */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption... (e.g. Sat here until the sun went down. No phones, just real moments.)"
              rows={5}
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 border-none resize-none focus:outline-none"
            />

            {/* Location selector */}
            <div className="flex items-center gap-2 py-2.5 border-t border-slate-100 text-xs text-slate-600">
              <MapPin className="size-4 text-[#FF6B00]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="w-full bg-transparent font-medium text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Character counter & Emoji helper */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCaption((c) => c + ' ☀️✨')}
              className="text-slate-500 hover:text-slate-700"
            >
              <Smile className="size-4" />
            </button>
            <span className="text-[11px]">{caption.length}/2,200</span>
          </div>
        </div>
      </div>
    </div>
  );
};
