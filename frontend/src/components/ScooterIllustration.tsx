import React from 'react';

export const ScooterIllustration: React.FC<{ className?: string }> = ({ className = "w-44 h-28" }) => {
  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground soft shadow */}
      <ellipse cx="100" cy="120" rx="80" ry="7" fill="#E2E8F0" />
      <ellipse cx="100" cy="120" rx="50" ry="4" fill="#CBD5E1" opacity="0.6" />

      {/* Rear delivery cargo box */}
      <rect x="26" y="38" width="46" height="38" rx="8" fill="#FF6B00" />
      <path d="M26 50 H72" stroke="white" strokeWidth="2.5" strokeOpacity="0.7" strokeDasharray="3 3" />
      {/* Box Outstagram logo badge */}
      <circle cx="49" cy="62" r="8" fill="#FFFFFF" fillOpacity="0.25" />
      <path d="M46 64 L49 57 L52 64 Z" fill="white" />

      {/* Scooter Chassis / Frame */}
      <path d="M38 90 Q62 66 112 76 L144 48 L154 50 L136 92 Z" fill="#1E293B" />
      <path d="M72 82 L108 82" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
      
      {/* Steering Handlebars */}
      <path d="M142 48 L158 24" stroke="#0F172A" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M150 22 H166" stroke="#FF6B00" strokeWidth="5" strokeLinecap="round" />
      <circle cx="166" cy="22" r="3.5" fill="#1E293B" />
      {/* Headlight */}
      <path d="M154 36 L164 34" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />

      {/* Courier Rider */}
      {/* Helmet & Head */}
      <circle cx="94" cy="28" r="13" fill="#FF6B00" />
      <path d="M84 28 H106" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M96 24 Q106 25 106 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
      {/* Courier Torso / Orange Uniform */}
      <path d="M92 41 Q86 62 98 78 L120 78 L114 66 L102 64 Q108 52 105 41 Z" fill="#EA580C" />
      {/* Arms driving to handlebars */}
      <path d="M102 46 L144 32" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" />
      <path d="M140 33 L152 26" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />

      {/* Wheels */}
      {/* Rear Wheel */}
      <g className="origin-[50px_98px]">
        <circle cx="50" cy="98" r="18" fill="#0F172A" />
        <circle cx="50" cy="98" r="11" fill="#E2E8F0" />
        <circle cx="50" cy="98" r="5" fill="#FF6B00" />
        <line x1="50" y1="87" x2="50" y2="109" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="39" y1="98" x2="61" y2="98" stroke="#94A3B8" strokeWidth="1.5" />
      </g>
      {/* Front Wheel */}
      <g className="origin-[152px_98px]">
        <circle cx="152" cy="98" r="18" fill="#0F172A" />
        <circle cx="152" cy="98" r="11" fill="#E2E8F0" />
        <circle cx="152" cy="98" r="5" fill="#FF6B00" />
        <line x1="152" y1="87" x2="152" y2="109" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="141" y1="98" x2="163" y2="98" stroke="#94A3B8" strokeWidth="1.5" />
      </g>
    </svg>
  );
};
