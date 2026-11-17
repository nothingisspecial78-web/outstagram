export function Scooter({ className = "w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden>
      <ellipse cx="100" cy="122" rx="78" ry="5" className="fill-ink/10" />
      {/* box */}
      <rect x="28" y="40" width="44" height="36" rx="6" className="fill-stamp" />
      <path d="M28 52h44" className="stroke-paper-raised/60" strokeWidth="2" />
      {/* body */}
      <path d="M40 92 Q60 70 110 78 L140 50 L150 52 L132 94 Z" className="fill-ink" />
      <path d="M140 50 L156 28" className="stroke-ink" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 26 h14" className="stroke-ink" strokeWidth="5" strokeLinecap="round" />
      {/* rider */}
      <circle cx="92" cy="30" r="11" className="fill-stamp" />
      <path d="M84 30 h18" className="stroke-ink" strokeWidth="3" />
      <path d="M90 42 Q86 60 96 76 L118 76 L112 66 L100 64 Q104 54 102 44 Z" className="fill-stamp-ink" />
      <path d="M100 48 L140 34" className="stroke-stamp-ink" strokeWidth="5" strokeLinecap="round" />
      {/* wheels */}
      {[50, 150].map((cx) => (
        <g key={cx} className="origin-center">
          <circle cx={cx} cy="100" r="17" className="fill-ink" />
          <circle cx={cx} cy="100" r="7" className="fill-paper-raised" />
        </g>
      ))}
    </svg>
  );
}

export function Truck({ className = "w-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 90" className={className} aria-hidden>
      <rect x="6" y="14" width="92" height="52" rx="8" className="fill-stamp" />
      <path d="M22 32h40M22 44h28" className="stroke-paper-raised" strokeWidth="5" strokeLinecap="round" />
      <path d="M98 30 h28 l20 20 v16 h-48 Z" className="fill-ink" />
      <path d="M106 36 h16 l12 12 h-28 Z" className="fill-paper-raised/80" />
      {[34, 124].map((cx) => (
        <g key={cx}><circle cx={cx} cy="70" r="12" className="fill-ink" /><circle cx={cx} cy="70" r="5" className="fill-paper-raised" /></g>
      ))}
    </svg>
  );
}
