import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Gift, Lock, Camera, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Postmark } from "@/components/hb/Postmark";
import { useStore, PLACES_INFO } from "@/lib/store";

export const Route = createFileRoute("/places/$id")({
  loader: ({ params }) => { const p = PLACES_INFO.find((x) => x.id === params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Place"} — Outstagram` },
      { name: "description", content: `Visit ${loaderData?.name ?? "this place"} and see quiet local offers.` },
      { property: "og:title", content: `${loaderData?.name ?? "Place"} — Outstagram` },
      { property: "og:description", content: "Offers here need a stamp. No ads in the rack." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => <p className="p-8 text-center text-ink-muted">That place isn't on the map.</p>,
  component: Place,
});

function Place() {
  const p = Route.useLoaderData();
  const { offers, stamps } = useStore();
  const has = stamps.some((s) => s.label === p.name);
  const list = offers.filter((o) => o.place === p.name && o.status === "live");
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link to="/places" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink"><ArrowLeft className="size-4" /> Places</Link>
      <header className="rounded-2xl border border-sand bg-paper-raised shadow-paper relative overflow-hidden p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-stamp-ink">Place</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink">{p.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">{has ? "You have a stamp from here." : "Take a live postcard here to earn its stamp."}</p>
        {has && <Postmark place={p.name} date="NOV 12" className="absolute -right-2 -top-2" />}
      </header>
      <section className="rounded-2xl border border-sand bg-paper-raised shadow-paper p-5">
        <h2 className="flex items-center gap-2 font-semibold text-ink"><Gift className="size-5 text-stamp" /> Quiet offers</h2>
        {list.length === 0 ? <p className="mt-2 text-sm text-ink-muted">No offers here right now. The place is still worth it.</p> : list.map((o) => (
          <div key={o.id} className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-sand bg-paper p-4">
            <p className="font-hand text-2xl text-ink">{o.text}</p>
            <Button size="sm" disabled={!has} onClick={() => toast.success("Show this screen at the counter")}>{has ? "Claim" : <><Lock /> Need stamp</>}</Button>
          </div>
        ))}
        <p className="mt-3 text-xs text-ink-muted">Offers never appear in your rack and aren't based on your data.</p>
      </section>
      {!has && <Button asChild className="w-full"><Link to="/capture"><Camera /> I'm here — take a postcard</Link></Button>}
    </div>
  );
}
