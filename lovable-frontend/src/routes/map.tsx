import { MapPinned } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, PLACES_INFO } from "@/lib/store";
import mapImg from "@/assets/city-map.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map of moments — Outstagram" },
      { name: "description", content: "Your own places, pinned. Private, nothing counted." },
      { property: "og:title", content: "Map of moments — Outstagram" },
      { property: "og:description", content: "Only your pins. Nobody else sees this map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { stamps } = useStore();
  const mine = PLACES_INFO.filter((p) => stamps.some((s) => s.kind === "place" && s.label === p.name)).concat(PLACES_INFO.slice(0, 2)).filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i);
  const [sel, setSel] = useState(mine[0]?.id);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-postcard"><MapPinned className="size-7" /></span><div><h1 className="text-2xl font-extrabold text-ink">Map of moments</h1><p className="text-sm text-ink-muted">Only your pins. Nobody else sees this map.</p></div></header>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-sand shadow-postcard">
        <img src={mapImg} alt="Map of your city" className="absolute inset-0 size-full object-cover" />
        {mine.map((p) => (
          <button key={p.id} onClick={() => setSel(p.id)} style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={p.name}
            className={cn("absolute -translate-x-1/2 -translate-y-full transition-transform", sel === p.id && "scale-125")}>
            <span className="block size-6 rounded-full rounded-br-none rotate-45 border-2 border-paper-raised bg-stamp shadow-postcard" />
          </button>
        ))}
      </div>
      <ul className="rounded-2xl border border-sand bg-paper-raised shadow-paper divide-y divide-line">
        {mine.map((p) => (
          <li key={p.id}><Link to="/places/$id" params={{ id: p.id }} onMouseEnter={() => setSel(p.id)} className={cn("flex items-center justify-between p-4 hover:bg-line", sel === p.id && "bg-stamp-soft")}>
            <span className="font-semibold text-ink">{p.name}</span><span className="text-xs text-ink-muted">Open place →</span></Link></li>
        ))}
      </ul>
    </div>
  );
}
