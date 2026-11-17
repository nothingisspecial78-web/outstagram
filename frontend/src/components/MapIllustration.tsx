import React from 'react';
import { MapPin } from 'lucide-react';

export interface LocationSpot {
  id: string;
  name: string;
  distance: string;
  hours: string;
  isOpen: boolean;
  coords: { x: number; y: number }; // Percentage 0 - 100
}

interface MapProps {
  spots: LocationSpot[];
  activeSpotId: string;
  onSelectSpot: (id: string) => void;
}

export const MapIllustration: React.FC<MapProps> = ({ spots, activeSpotId, onSelectSpot }) => {
  return (
    <div className="relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden bg-[#E5E7EB] border border-slate-200/80 shadow-inner select-none">
      {/* Stylized vector map canvas */}
      <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 400 240" preserveAspectRatio="none">
        {/* Background land */}
        <rect width="400" height="240" fill="#E8ECEF" />

        {/* Parks / Green areas */}
        <path d="M-20 40 Q40 10 90 60 T160 80 Q190 40 140 10 L-20 -20 Z" fill="#D1E7DD" />
        <path d="M260 160 Q320 120 380 180 T420 220 L280 260 Z" fill="#D1E7DD" />
        <path d="M310 30 Q370 20 410 70 L420 -20 L300 -20 Z" fill="#D1E7DD" />

        {/* Water River */}
        <path d="M0 190 Q120 180 180 140 T320 120 Q380 110 400 90 L400 130 Q370 150 310 160 T170 180 Q110 220 0 230 Z" fill="#BFDBFE" />

        {/* Roads & Highways */}
        {/* Major Avenue */}
        <path d="M-20 110 C80 110, 180 70, 420 160" stroke="#FFFFFF" strokeWidth="18" fill="none" />
        <path d="M-20 110 C80 110, 180 70, 420 160" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6 6" fill="none" />

        {/* Diagonal Cross Streets */}
        <path d="M70 -20 L160 260" stroke="#FFFFFF" strokeWidth="12" fill="none" />
        <path d="M280 -20 L230 260" stroke="#FFFFFF" strokeWidth="10" fill="none" />
        <path d="M190 20 L380 220" stroke="#FFFFFF" strokeWidth="8" fill="none" />
        <path d="M10 60 L240 240" stroke="#FFFFFF" strokeWidth="6" fill="none" />
        <path d="M180 -20 L40 160" stroke="#FFFFFF" strokeWidth="7" fill="none" />

        {/* City Blocks (Subtle gray building footprints) */}
        <rect x="25" y="130" width="35" height="40" rx="3" fill="#CBD5E1" opacity="0.6" />
        <rect x="180" y="80" width="40" height="30" rx="3" fill="#CBD5E1" opacity="0.6" />
        <rect x="110" y="25" width="45" height="30" rx="3" fill="#CBD5E1" opacity="0.5" />
        <rect x="280" y="45" width="40" height="50" rx="3" fill="#CBD5E1" opacity="0.6" />
        <rect x="250" y="180" width="50" height="25" rx="3" fill="#CBD5E1" opacity="0.5" />
      </svg>

      {/* Floating Badge: "2 open near you" */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/60 text-xs font-bold text-slate-800">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>2 open near you</span>
      </div>

      {/* User Current Location Dot (Blue GPS Beacon) */}
      <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="absolute -inset-2.5 rounded-full bg-sky-400 opacity-75 animate-ping" />
        <span className="relative flex size-4 rounded-full bg-sky-500 ring-4 ring-white shadow-md" />
      </div>

      {/* Map Pins for Spots */}
      {spots.map((spot) => {
        const isActive = spot.id === activeSpotId;
        return (
          <button
            key={spot.id}
            onClick={() => onSelectSpot(spot.id)}
            style={{ top: `${spot.coords.y}%`, left: `${spot.coords.x}%` }}
            className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-300 transform focus:outline-none ${
              isActive ? 'scale-125 z-20' : 'scale-100 hover:scale-110 z-10'
            }`}
            title={spot.name}
          >
            <div className="relative flex flex-col items-center">
              {/* Tooltip on Active */}
              {isActive && (
                <div className="mb-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold shadow-lg whitespace-nowrap animate-bounce">
                  {spot.name} • {spot.distance}
                </div>
              )}
              {/* Pin Icon */}
              <div
                className={`p-1.5 rounded-full shadow-lg border-2 border-white transition-colors ${
                  isActive ? 'bg-[#FF6B00] text-white shadow-[#FF6B00]/40' : 'bg-slate-800 text-white'
                }`}
              >
                <MapPin className="size-4 fill-current" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
