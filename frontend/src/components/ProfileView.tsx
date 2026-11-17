import React, { useState } from 'react';
import { Settings, Grid, MapPin, Hourglass, Plus, Footprints, Gift, Users, Hammer, Lock } from 'lucide-react';

interface HighlightItem {
  id: string;
  title: string;
  cover: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  { id: 'h1', title: 'Berlin', cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80' },
  { id: 'h2', title: 'Cafes', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80' },
  { id: 'h3', title: 'Meetups', cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop&q=80' },
  { id: 'h4', title: 'Linocuts', cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80' },
  { id: 'h5', title: 'Quests', cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&auto=format&fit=crop&q=80' },
];

const USER_POSTS = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
];

const USER_STAMPS = [
  { place: 'West Pier', date: 'NOV 12', kind: 'Place' },
  { place: 'With Priya', date: 'NOV 10', kind: 'Meetup' },
  { place: 'Notice 3 Things', date: 'NOV 09', kind: 'Quest' },
  { place: 'Old Greenhouse', date: 'NOV 07', kind: 'Place' },
  { place: 'Linocut Pier', date: 'NOV 03', kind: 'Craft' },
];

export const ProfileView: React.FC<{ onOpenSettings?: () => void }> = ({ onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState<'stamps' | 'activities' | 'rewards' | 'posts'>('stamps');

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-6 space-y-8 select-none">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        {/* Large Avatar with Gradient Story Ring */}
        <div className="size-28 sm:size-36 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-1 shrink-0 shadow-md">
          <div className="size-full rounded-full bg-white p-1">
            <div className="size-full rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-black text-2xl text-slate-700 shadow-inner">
              AN
            </div>
          </div>
        </div>

        {/* Info & Stats */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Username & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">abdullanothing7</h2>
            <button className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 transition-colors">
              Edit profile
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 transition-colors">
              View archive
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
              title="Settings"
            >
              <Settings className="size-5" />
            </button>
          </div>

          {/* Activities Stats Row (No Followers, No Following) */}
          <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
            <p>
              <span className="font-extrabold text-slate-900">18</span>{' '}
              <span className="text-slate-500">quests</span>
            </p>
            <p>
              <span className="font-extrabold text-slate-900">9</span>{' '}
              <span className="text-slate-500">meetups</span>
            </p>
            <p>
              <span className="font-extrabold text-slate-900">14</span>{' '}
              <span className="text-slate-500">postcards</span>
            </p>
            <p>
              <span className="font-extrabold text-slate-900">6</span>{' '}
              <span className="text-slate-500">crafts</span>
            </p>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#C8452D] text-xs font-bold border border-orange-200">
              <Hourglass className="size-3.5" />
              <span>12.5h Reclaimed</span>
            </div>
          </div>

          {/* Bio */}
          <div className="text-xs text-slate-800 space-y-1">
            <p className="font-bold">Abdulla</p>
            <p className="text-slate-500 font-medium">City Explorer & Analog Postcard Maker 🚲</p>
            <p>Post less. Go somewhere. Meet someone.</p>
            <a
              href="#"
              className="text-sky-600 font-semibold hover:underline block pt-0.5"
            >
              outstagram.app/abdulla
            </a>
          </div>
        </div>
      </div>

      {/* Story Highlights Row */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pt-2 px-1">
        {HIGHLIGHTS.map((hl) => (
          <div key={hl.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="size-16 sm:size-18 rounded-full border-2 border-slate-200 p-0.5 group-hover:border-slate-400 transition-colors">
              <img
                src={hl.cover}
                alt={hl.title}
                className="size-full rounded-full object-cover"
              />
            </div>
            <span className="text-[11px] font-bold text-slate-800">{hl.title}</span>
          </div>
        ))}

        {/* Add New Highlight */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="size-16 sm:size-18 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-slate-500 group-hover:text-slate-600 transition-all">
            <Plus className="size-6" />
          </div>
          <span className="text-[11px] font-bold text-slate-400">New</span>
        </div>
      </div>

      {/* Tabs Row (STAMPS, ACTIVITIES, REWARDS, MY POSTCARDS) */}
      <div className="border-t border-slate-200">
        <div className="flex justify-center gap-6 sm:gap-10 text-xs font-bold tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex items-center gap-1.5 py-3.5 border-t-2 -mt-[2px] transition-colors ${
              activeTab === 'stamps'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className="size-3.5 text-[#C8452D]" />
            <span>Stamps</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-1.5 py-3.5 border-t-2 -mt-[2px] transition-colors ${
              activeTab === 'activities'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Footprints className="size-3.5 text-[#4F6F52]" />
            <span>Activities</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-1.5 py-3.5 border-t-2 -mt-[2px] transition-colors ${
              activeTab === 'rewards'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Gift className="size-3.5 text-amber-600" />
            <span>Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-1.5 py-3.5 border-t-2 -mt-[2px] transition-colors ${
              activeTab === 'posts'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid className="size-3.5" />
            <span>My Postcards</span>
          </button>
        </div>

        {/* Tab 1: PASSPORT STAMPS */}
        {activeTab === 'stamps' && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-center gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-md">
              <Hourglass className="size-10 text-orange-400" />
              <div>
                <p className="text-4xl font-extrabold leading-none">12.5h</p>
                <p className="text-xs text-slate-300 mt-1">reclaimed from scrolling · 5 stamps collected</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {USER_STAMPS.map((s, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border-2 border-dashed border-amber-200 bg-[#FBF8F1] flex flex-col items-center justify-center text-center gap-2 transform hover:-translate-y-0.5 transition-transform shadow-sm"
                >
                  <div className="size-16 rounded-full border-2 border-[#C8452D] border-dashed flex flex-col items-center justify-center text-[#C8452D]">
                    <span className="text-[10px] font-black uppercase tracking-wider">{s.date}</span>
                    <span className="text-[8px] font-bold">OFFLINE</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-800">{s.place}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.kind} Stamp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: ACTIVITIES BREAKDOWN */}
        {activeTab === 'activities' && (
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="size-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Footprints className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">18</p>
                <p className="text-xs text-slate-500">Quests Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="size-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">9</p>
                <p className="text-xs text-slate-500">In-Person Meetups Attended</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="size-12 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                <MapPin className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">14</p>
                <p className="text-xs text-slate-500">Postcards Live-Stamped</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="size-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Hammer className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">6</p>
                <p className="text-xs text-slate-500">Crafts Hand-Made</p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 sm:col-span-2 pt-2">
              All records are private to you. No public comparison, no streaks, no algorithms.
            </p>
          </div>
        )}

        {/* Tab 3: OFFLINE REWARDS & PARTNER PERKS */}
        {activeTab === 'rewards' && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4">
              <div className="size-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs text-center">
                READY
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">Free Chai or Herbal Tea</p>
                <p className="text-xs text-slate-500">Riverside Artisan Cafe · Unlocked by your West Pier stamp</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700">
                Show at counter
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4">
              <div className="size-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xs text-center">
                <Lock className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">10% Off Vintage Atlases & Maps</p>
                <p className="text-xs text-slate-400">Remparts Books · Requires Remparts Books Place Stamp</p>
              </div>
              <span className="text-xs font-medium text-slate-400">Visit to unlock</span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4">
              <div className="size-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xs text-center">
                <Lock className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">Complimentary Day-Old Sourdough</p>
                <p className="text-xs text-slate-400">Corner Bakery · Available after 5:00 PM with any stamp</p>
              </div>
              <span className="text-xs font-medium text-slate-400">Visit to unlock</span>
            </div>
          </div>
        )}

        {/* Tab 4: MY POSTCARDS GRID */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            {USER_POSTS.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[3/2] overflow-hidden bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm"
              >
                <img
                  src={img}
                  alt="Postcard"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
