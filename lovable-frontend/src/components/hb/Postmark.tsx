import { cn } from "@/lib/utils";

export function Postmark({ place, date, className, tone = "stamp" }: { place: string; date: string; className?: string; tone?: "stamp" | "moss" | "ink" }) {
  const id = `arc-${place.replace(/\W/g, "")}-${tone}`;
  const color = tone === "moss" ? "text-moss" : tone === "ink" ? "text-ink" : "text-stamp";
  return (
    <div className={cn("pointer-events-none size-20 -rotate-[8deg] opacity-90", color, className)} aria-label={`Postmarked ${place}, ${date}`}>
      <svg viewBox="0 0 100 100" className="size-full">
        <defs><path id={id} d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" /></defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text fontSize="10" fontWeight="700" letterSpacing="2" fill="currentColor" fontFamily="Inter">
          <textPath href={`#${id}`} startOffset="2%">{place.toUpperCase().slice(0, 22)}</textPath>
        </text>
        <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="Inter">{date}</text>
      </svg>
    </div>
  );
}
