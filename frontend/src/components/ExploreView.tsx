import React, { useState } from 'react';
import { Search, Heart, MessageCircle, MapPin } from 'lucide-react';

interface ExplorePost {
  id: string;
  mediaUrl: string;
  likes: number;
  comments: number;
  location: string;
  category: string;
}

const EXPLORE_POSTS: ExplorePost[] = [
  {
    id: 'e1',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    likes: 3410,
    comments: 88,
    location: 'Berlin Mitte, Germany',
    category: 'Cafes',
  },
  {
    id: 'e2',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    likes: 5820,
    comments: 142,
    location: 'West Pier, Brighton',
    category: 'Travel',
  },
  {
    id: 'e3',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    likes: 2190,
    comments: 49,
    location: 'Linden Park',
    category: 'Nature',
  },
  {
    id: 'e4',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    likes: 1890,
    comments: 31,
    location: 'Remparts Books',
    category: 'Books',
  },
  {
    id: 'e5',
    mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    likes: 4210,
    comments: 95,
    location: 'Old Greenhouse',
    category: 'Architecture',
  },
  {
    id: 'e6',
    mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    likes: 8940,
    comments: 260,
    location: 'Harbor Steps',
    category: 'Music',
  },
  {
    id: 'e7',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    likes: 6710,
    comments: 119,
    location: 'Corner Bakery',
    category: 'Food',
  },
  {
    id: 'e8',
    mediaUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    likes: 3120,
    comments: 67,
    location: 'Night Market',
    category: 'Street',
  },
  {
    id: 'e9',
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    likes: 4900,
    comments: 84,
    location: 'Tram Stop 9',
    category: 'Travel',
  },
];

const CATEGORIES = ['All', 'Travel', 'Cafes', 'Nature', 'Street', 'Architecture', 'Books', 'Music'];

export const ExploreView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = EXPLORE_POSTS.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-2 space-y-4">
      {/* Search Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 flex items-center gap-2.5 h-11 px-4 rounded-2xl bg-slate-100 text-slate-400">
          <Search className="size-4 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city places, moments, tags..."
            className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCat === cat
                ? 'bg-[#FF6B00] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3-Column Explore Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-1">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden bg-slate-900 group cursor-pointer rounded-xl"
          >
            <img
              src={post.mediaUrl}
              alt={post.location}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Hover Overlay with Likes & Comments */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-3">
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <Heart className="size-4 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="size-4 fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-200 mt-1">
                <MapPin className="size-3 text-orange-400" />
                <span className="truncate max-w-[140px]">{post.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
