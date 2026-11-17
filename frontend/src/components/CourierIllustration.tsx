import React from 'react';

export const CourierIllustration: React.FC<{ className?: string }> = ({ className = "w-48 h-56" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDFC4" />
            <stop offset="100%" stopColor="#F4A261" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="100" cy="110" r="75" fill="#FFEDD5" fillOpacity="0.4" />

        {/* Cap Visor */}
        <path d="M50 48 C50 48, 80 34, 136 40 C146 41, 150 48, 140 54 C110 60, 68 58, 50 48 Z" fill="#C2410C" />
        
        {/* Cap Dome */}
        <path d="M56 46 C56 16, 128 14, 134 44 Z" fill="url(#capGrad)" />
        <circle cx="95" cy="22" r="3.5" fill="#FED7AA" />

        {/* Ears */}
        <circle cx="62" cy="74" r="10" fill="url(#skinGrad)" />
        <circle cx="132" cy="74" r="10" fill="url(#skinGrad)" />

        {/* Head / Face */}
        <path d="M66 50 C66 45, 128 45, 128 50 C130 84, 124 104, 97 104 C70 104, 64 84, 66 50 Z" fill="url(#skinGrad)" />

        {/* Cheeks blush */}
        <circle cx="76" cy="80" r="6" fill="#F87171" fillOpacity="0.3" />
        <circle cx="118" cy="80" r="6" fill="#F87171" fillOpacity="0.3" />

        {/* Eyes (Happy anime/friendly curved eyes) */}
        <path d="M78 68 Q84 63 90 68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M104 68 Q110 63 116 68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M89 82 Q97 91 105 82" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Neck */}
        <rect x="88" y="98" width="18" height="15" rx="4" fill="#E76F51" />

        {/* Jacket Body */}
        <path d="M54 112 C45 118, 42 165, 42 175 L152 175 C152 165, 149 118, 140 112 C126 106, 68 106, 54 112 Z" fill="url(#jacketGrad)" />
        {/* Inner Shirt Collar */}
        <path d="M88 112 L97 128 L106 112 Z" fill="#FFFFFF" />
        <path d="M97 128 V175" stroke="#9A3412" strokeWidth="2" strokeDasharray="3 3" />

        {/* Left Arm holding package */}
        <path d="M48 120 Q32 150 68 162" stroke="url(#jacketGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="68" cy="160" r="10" fill="url(#skinGrad)" />

        {/* Right Arm waving */}
        <path d="M142 120 Q162 105 168 85" stroke="url(#jacketGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
        <circle cx="170" cy="80" r="10" fill="url(#skinGrad)" />

        {/* Cardboard Delivery Parcel Box */}
        <g transform="translate(68, 134) rotate(-6)">
          <rect x="0" y="0" width="65" height="52" rx="6" fill="url(#boxGrad)" stroke="#78350F" strokeWidth="1.5" />
          {/* Packaging Tape */}
          <path d="M0 24 H65" stroke="#FEF3C7" strokeWidth="6" strokeOpacity="0.75" />
          <path d="M32 0 V52" stroke="#FEF3C7" strokeWidth="6" strokeOpacity="0.75" />
          {/* Outstagram Stamp Label */}
          <rect x="8" y="6" width="18" height="12" rx="2" fill="white" fillOpacity="0.9" />
          <line x1="11" y1="9" x2="23" y2="9" stroke="#FF6B00" strokeWidth="1.5" />
          <line x1="11" y1="13" x2="19" y2="13" stroke="#FF6B00" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
