import React from 'react';

export const TruckIllustration: React.FC<{ className?: string }> = ({ className = "w-36 h-24" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Motion Speed Lines */}
      <div className="absolute -left-6 top-5 flex flex-col gap-2">
        <span className="w-8 h-1 rounded-full bg-[#FF6B00]/40 animate-speed [animation-delay:0ms]" />
        <span className="w-12 h-1 rounded-full bg-[#FF6B00]/60 animate-speed [animation-delay:150ms]" />
        <span className="w-6 h-1 rounded-full bg-[#FF6B00]/30 animate-speed [animation-delay:300ms]" />
      </div>

      <svg viewBox="0 0 160 90" className="w-full h-full animate-truck" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Shadow */}
        <ellipse cx="80" cy="85" rx="65" ry="5" fill="#E2E8F0" />

        {/* Cargo Box */}
        <rect x="10" y="16" width="90" height="52" rx="10" fill="#FF6B00" />
        {/* Accent lines on box */}
        <path d="M26 34 H66" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M26 46 H50" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.8" />
        {/* Outstagram package icon */}
        <circle cx="78" cy="46" r="9" fill="white" fillOpacity="0.2" />
        <path d="M75 48 L78 42 L81 48 Z" fill="white" />

        {/* Truck Cabin */}
        <path d="M100 32 H128 L148 52 V68 H100 V32 Z" fill="#1E293B" />
        {/* Window */}
        <path d="M108 38 H124 L138 52 H108 V38 Z" fill="#E2E8F0" />
        {/* Bumper */}
        <rect x="144" y="62" width="10" height="6" rx="2" fill="#94A3B8" />
        <circle cx="147" cy="58" r="3" fill="#FBBF24" />

        {/* Wheels */}
        {/* Rear Wheel */}
        <g>
          <circle cx="38" cy="70" r="14" fill="#0F172A" />
          <circle cx="38" cy="70" r="8" fill="#E2E8F0" />
          <circle cx="38" cy="70" r="4" fill="#FF6B00" />
        </g>
        {/* Front Wheel */}
        <g>
          <circle cx="124" cy="70" r="14" fill="#0F172A" />
          <circle cx="124" cy="70" r="8" fill="#E2E8F0" />
          <circle cx="124" cy="70" r="4" fill="#FF6B00" />
        </g>
      </svg>
    </div>
  );
};
