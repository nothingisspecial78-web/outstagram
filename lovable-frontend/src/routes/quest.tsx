import { createFileRoute, Link } from "@tanstack/react-router";
import { Clapperboard, Sparkles, ArrowRight } from "lucide-react";
import { QuestCard } from "@/components/hb/QuestCard";
import { RACK, useStore } from "@/lib/store";

export const Route = createFileRoute("/quest")({
  head: () => ({
    meta: [
      { title: "Daily Quest — Outstagram" },
      { name: "description", content: "Your one daily offline quest: walk, notice three things, reflect and earn a stamp." },
      { property: "og:title", content: "Daily Quest — Outstagram" },
      { property: "og:description", content: "One small quest. Then go outside." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Quest,
});


function Quest() {
  const { seen } = useStore();
  const left = RACK.length - seen;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <QuestCard />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/rack" className="group flex items-center gap-4 rounded-2xl border border-sand bg-paper-raised p-4 transition-transform hover:-translate-y-0.5">
          <span className="grid size-12 place-items-center rounded-xl bg-stamp-soft text-stamp"><Clapperboard className="size-6" /></span>
          <div className="flex-1"><p className="font-semibold text-ink">Today's moments</p><p className="text-sm text-ink-muted">{left > 0 ? `${left} left, then it ends` : "All seen. Go outside."}</p></div>
          <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-1" />
        </Link>
        <Link to="/coach" className="group flex items-center gap-4 rounded-2xl border border-sand bg-paper-raised p-4 transition-transform hover:-translate-y-0.5">
          <span className="grid size-12 place-items-center rounded-xl bg-gradient-hero text-primary-foreground"><Sparkles className="size-6" /></span>
          <div className="flex-1"><p className="font-semibold text-ink">Life coach</p><p className="text-sm text-ink-muted">One small offline experiment</p></div>
          <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
