import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Hammer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CharCount } from "@/components/hb/AppShell";
import { Postmark } from "@/components/hb/Postmark";
import { RACK, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/make")({
  head: () => ({
    meta: [
      { title: "Maker Shelf — Outstagram" },
      { name: "description", content: "A shelf of things you made with your hands, each earning a craft stamp." },
      { property: "og:title", content: "Maker Shelf — Outstagram" },
      { property: "og:description", content: "Make something. Log it. Earn a stamp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Make,
});

const MEDIUMS = ["art", "writing", "music", "code", "craft", "baking", "linocut", "ink"];

function Make() {
  const { crafts, addCraft } = useStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const valid = title.trim().length > 1 && picked.length > 0 && notes.trim().length >= 8;

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-postcard"><Hammer className="size-7" /></span>
        <div className="flex-1"><h1 className="text-2xl font-extrabold text-ink">Maker Shelf</h1><p className="text-sm text-ink-muted">{crafts.length} things made by hand · one craft stamp each</p></div>
        <Button onClick={() => setOpen(true)} className="rounded-xl"><Plus /> <span className="hidden sm:inline">Add craft</span></Button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {crafts.map((c, i) => (
          <article key={c.id} className={cn("group animate-rise overflow-hidden rounded-2xl border border-sand bg-paper-raised shadow-paper", i === 0 && "md:col-span-2 md:row-span-2")} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="relative overflow-hidden">
              <img src={RACK[(i + 2) % RACK.length]?.img} alt={c.title} loading="lazy" className={cn("w-full object-cover transition-transform duration-500 group-hover:scale-105", i === 0 ? "aspect-square md:aspect-[4/3]" : "aspect-square")} />
              <Postmark place="Craft" date={c.date} tone="ink" className="absolute top-2 right-2 size-14 rounded-full bg-paper-raised/90" />
            </div>
            <div className="p-3">
              <h2 className="truncate font-semibold text-ink">{c.title}</h2>
              <div className="mt-1.5 flex flex-wrap gap-1">{c.mediums.map((m) => <span key={m} className="rounded-full bg-stamp-soft px-2 py-0.5 text-[11px] font-semibold text-stamp-ink">#{m}</span>)}</div>
              <p className="mt-2 line-clamp-2 font-hand text-lg leading-6 text-ink-muted">{c.notes}</p>
            </div>
          </article>
        ))}
        <button onClick={() => setOpen(true)} className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-sand text-ink-muted transition-colors hover:border-stamp hover:text-stamp-ink">
          <span className="text-center"><Plus className="mx-auto size-8" /><span className="mt-1 block text-sm font-semibold">Log something you made</span></span>
        </button>
      </div>
      <p className="text-center text-xs text-ink-muted">Stamps never depend on how many people appreciate your work.</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl border-sand bg-paper-raised">
          <DialogHeader><DialogTitle>Add a craft</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!valid) return; addCraft({ title: title.trim(), mediums: picked, notes: notes.trim() }); toast.success("Added to your shelf. Craft stamp earned."); setTitle(""); setPicked([]); setNotes(""); setOpen(false); }}>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What did you make?" className="bg-paper" />
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Medium</p>
              <div className="flex flex-wrap gap-1.5">{MEDIUMS.map((m) => <button type="button" key={m} onClick={() => setPicked((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m])} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", picked.includes(m) ? "border-stamp bg-stamp-soft text-stamp-ink" : "border-sand text-ink-muted")}>{m}</button>)}</div>
            </div>
            <div>
              <textarea value={notes} maxLength={140} rows={3} onChange={(e) => setNotes(e.target.value)} placeholder="A short note to future you (8–140)" className="w-full resize-none rounded-xl border border-sand bg-paper px-3 py-2 font-hand text-xl text-ink outline-none focus:border-stamp" />
              <div className="flex justify-end"><CharCount value={notes} /></div>
            </div>
            <Button type="submit" disabled={!valid} className="w-full rounded-xl">Add to shelf</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
