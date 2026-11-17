import { Store } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useStore, PLACES_INFO } from "@/lib/store";

export const Route = createFileRoute("/places/")({
  head: () => ({
    meta: [
      { title: "Places — Outstagram" },
      { name: "description", content: "Local places near you and the quiet offers that come with a stamp." },
      { property: "og:title", content: "Places — Outstagram" },
      { property: "og:description", content: "Go somewhere. Show your stamp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Places,
});

function Places() {
  const { offers, stamps } = useStore();
  return (
    <div className="mx-auto max-w-xl">
      <header className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-postcard"><Store className="size-7" /></span><div><h1 className="text-2xl font-extrabold text-ink">Places nearby</h1><p className="text-sm text-ink-muted">Go somewhere. Show your stamp.</p></div></header>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {PLACES_INFO.map((p) => {
          const n = offers.filter((o) => o.place === p.name && o.status === "live").length;
          const has = stamps.some((s) => s.label === p.name);
          return (
            <li key={p.id}><Link to="/places/$id" params={{ id: p.id }} className="rounded-2xl border border-sand bg-paper-raised shadow-paper flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
              <span className="grid size-10 place-items-center rounded-xl bg-stamp-soft text-stamp-ink"><MapPin className="size-5" /></span>
              <div className="flex-1"><p className="font-semibold text-ink">{p.name}</p><p className="text-xs text-ink-muted">{has ? "You've been here" : "Not visited yet"}{n ? " · offer" : ""}</p></div>
            </Link></li>
          );
        })}
      </ul>
    </div>
  );
}
