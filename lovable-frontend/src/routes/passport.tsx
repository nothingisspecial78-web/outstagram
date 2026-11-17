import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, MessageCircle, UserPlus, Check } from "lucide-react";
import { useState } from "react";
import { Settings, Grid3x3, Stamp as StampIcon, Hourglass, Link2, Plus, Footprints, Gift, Users, Hammer, Lock } from "lucide-react";
import { toast } from "sonner";
import { Postmark } from "@/components/hb/Postmark";
import { Avatar } from "@/components/hb/AppShell";
import { RACK, useStore, type Stamp } from "@/lib/store";
import { ME, profileFor } from "@/lib/people";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Passport — Outstagram" },
      { name: "description", content: "Your posts, moments and passport stamps from places, meetups, quests and crafts." },
      { property: "og:title", content: "Passport — Outstagram" },
      { property: "og:description", content: "Stamps you can only earn offline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { user?: string } => (typeof s["user"] === "string" ? { user: s["user"] } : {}),
  component: Profile,
});

function MemberProfile({ handle }: { handle: string }) {
  const p = profileFor(handle);
  const { startChat, addFriendName, friends } = useStore();
  const nav = useNavigate();
  if (!p) return <div className="py-20 text-center"><h1 className="font-serif text-2xl font-semibold text-ink">Member not found</h1><Link to="/passport" className="mt-3 inline-block text-link underline">Back to your passport</Link></div>;
  const first = p.name.split(" ")[0]!;
  const isFriend = friends.includes(first);
  return (
    <div className="mx-auto max-w-[760px]">
      <Link to="/passport" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"><ArrowLeft className="size-4" />Your passport</Link>
      <header className="flex gap-5 rounded-2xl border border-sand bg-paper-raised p-5 shadow-paper sm:gap-10 sm:p-8">
        <Avatar src={p.avatar} size="size-20 sm:size-32" ring="story" className="shrink-0 self-start" />
        <div className="min-w-0 flex-1 space-y-3">
          <div><h1 className="text-xl text-ink">{p.handle}</h1><p className="font-semibold text-ink">{p.name}</p></div>
          <p className="text-sm text-ink">{p.bio}</p>
          <p className="flex items-center gap-1 text-sm text-ink-muted"><MapPin className="size-4" />{p.location} · Friend code <b className="tabular-nums text-ink">{p.code}</b></p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-3 py-1 text-sm text-moss"><Hourglass className="size-4" /><b>{p.hours}h</b> reclaimed</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => { const id = startChat(p.name); nav({ to: "/chats/$id", params: { id } }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-stamp px-4 py-2 text-sm font-semibold text-primary-foreground"><MessageCircle className="size-4" />Message</button>
            <button disabled={isFriend} onClick={() => { addFriendName(first); toast.success(`${first} added as a friend`); }} className="inline-flex items-center gap-1.5 rounded-lg bg-line px-4 py-2 text-sm font-semibold text-ink hover:bg-sand disabled:opacity-70">{isFriend ? <><Check className="size-4" />Friends</> : <><UserPlus className="size-4" />Add Friend</>}</button>
          </div>
        </div>
      </header>
      <h2 className="mt-8 mb-4 font-serif text-xl font-semibold text-ink">{first}'s stamps</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {p.stamps.map((s, i) => <div key={i} className="grid place-items-center rounded-2xl border border-sand bg-paper-raised p-4"><Postmark place={s.label} date={s.date} tone={tone(s.kind)} className={i % 2 ? "rotate-6" : ""} /><p className="mt-2 text-xs capitalize text-ink-muted">{s.kind}</p></div>)}
      </div>
    </div>
  );
}

const tone = (k: Stamp["kind"]) => (k === "quest" ? "moss" : k === "craft" ? "ink" : "stamp") as "moss" | "ink" | "stamp";
const TABS = [
  { id: "stamps", label: "Stamps", icon: StampIcon },
  { id: "activities", label: "Activities", icon: Footprints },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "posts", label: "My Postcards", icon: Grid3x3 },
] as const;
const VOUCHERS = [
  { place: "Riverside Cafe", text: "Free chai", need: "Riverside Cafe stamp" },
  { place: "Remparts Books", text: "10% off an atlas", need: "Remparts Books stamp" },
  { place: "Corner Bakery", text: "Day-old loaf after 5pm", need: "Corner Bakery stamp" },
];
const HIGHLIGHTS = [["Pier", 3], ["Books", 2], ["Bakes", 0], ["Walks", 1]] as const;

function Profile() {
  const { user } = Route.useSearch();
  if (user && user !== ME.handle) return <MemberProfile handle={user} />;
  return <MyProfile />;
}

function MyProfile() {
  const { stamps, hours, session } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("stamps");
  const handle = ME.handle;
  const count = (k: Stamp["kind"]) => stamps.filter((s) => s.kind === k).length;
  const stats = [[String(17 + count("quest")), "quests"], [String(8 + count("meetup")), "meetups"], [String(12 + count("place")), "postcards"], [String(5 + count("craft")), "crafts"]] as const;

  return (
    <div className="mx-auto max-w-[935px]">
      <header className="flex gap-5 px-1 sm:gap-16 sm:px-8">
        <Avatar src={ME.avatar} size="size-20 sm:size-36" ring="story" className="shrink-0 self-start" />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="mr-2 text-xl text-ink">{handle}</h1>
            <button onClick={() => toast("Profile editor is in Settings")} className="rounded-lg bg-line px-4 py-1.5 text-sm font-semibold text-ink hover:bg-sand">Edit profile</button>
            <button onClick={() => toast("Archive is private to you")} className="hidden rounded-lg bg-line px-4 py-1.5 text-sm font-semibold text-ink hover:bg-sand sm:block">View archive</button>
            <Link to="/settings" aria-label="Settings" className="p-1 text-ink"><Settings className="size-6" /></Link>
          </div>
          <ul className="flex gap-4 text-sm sm:gap-8 sm:text-base">
            {stats.map(([n, l]) => <li key={l} className="text-center sm:text-left"><b className="block text-ink sm:inline">{n}</b> <span className="text-ink-muted">{l}</span></li>)}
          </ul>
          <div className="hidden sm:block"><Bio name={session?.name ?? ME.name} hours={hours} /></div>
        </div>
      </header>
      <div className="mt-4 px-1 sm:hidden"><Bio name={session?.name ?? ME.name} hours={hours} /></div>

      <div className="no-scrollbar mt-8 flex gap-6 overflow-x-auto px-1 sm:px-8">
        {HIGHLIGHTS.map(([l, i]) => (
          <button key={l} onClick={() => toast(`${l} highlight`)} className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="rounded-full border border-sand p-1"><img src={RACK[i]?.img} alt="" className="size-16 rounded-full object-cover sm:size-20" /></span>
            <span className="text-xs font-semibold text-ink">{l}</span>
          </button>
        ))}
        <button className="flex shrink-0 flex-col items-center gap-1.5"><span className="grid size-[74px] place-items-center rounded-full border border-sand sm:size-[90px]"><Plus className="size-8 text-ink-muted" /></span><span className="text-xs font-semibold text-ink">New</span></button>
      </div>

      <nav className="mt-8 flex justify-center gap-10 border-t border-sand sm:gap-14">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("-mt-px flex items-center gap-1.5 border-t py-4 text-xs font-semibold tracking-widest uppercase", tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-muted")}>
            <t.icon className="size-4" /><span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </nav>

      {tab === "posts" && (
        <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3">
          {RACK.slice(0, 6).map((c, i) => (
            <figure key={i} className={cn("rounded-sm border border-sand bg-paper-raised p-2 shadow-paper", i % 2 ? "rotate-1" : "-rotate-1")}>
              <img src={c.img} alt={c.place} loading="lazy" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="mt-1.5 font-hand text-lg leading-5 text-ink">{c.place}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {tab === "activities" && (
        <div className="grid gap-3 py-6 sm:grid-cols-2">
          {([[Footprints, "Quests completed", stats[0][0], "moss"], [Users, "Meetups in person", stats[1][0], "stamp"], [StampIcon, "Postcards stamped", stats[2][0], "stamp"], [Hammer, "Crafts logged", stats[3][0], "ink"]] as const).map(([I, l, n, t]) => (
            <div key={l} className="flex items-center gap-4 rounded-2xl border border-sand bg-paper-raised p-5 shadow-paper">
              <span className={cn("grid size-12 place-items-center rounded-full", t === "moss" ? "bg-moss/15 text-moss" : t === "ink" ? "bg-line text-ink" : "bg-stamp-soft text-stamp-ink")}><I className="size-6" /></span>
              <div><p className="font-serif text-3xl font-semibold text-ink">{n}</p><p className="text-sm text-ink-muted">{l}</p></div>
            </div>
          ))}
          <p className="text-center text-xs text-ink-muted sm:col-span-2">Just for you. No streaks, no rankings, nobody else sees this.</p>
        </div>
      )}
      {tab === "rewards" && (
        <div className="space-y-3 py-6">
          {VOUCHERS.map((v) => {
            const has = stamps.some((s) => s.label === v.place);
            return (
              <div key={v.place} className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-sand bg-paper-raised p-4">
                <Postmark place={v.place} date={has ? "READY" : "LOCKED"} tone={has ? "moss" : "ink"} className={cn("size-16", !has && "opacity-40")} />
                <div className="flex-1"><p className="font-hand text-2xl text-ink">{v.text}</p><p className="text-xs text-ink-muted">{v.place} · needs a {v.need}</p></div>
                {has ? <button onClick={() => toast.success("Show this at the counter")} className="rounded-xl bg-moss px-4 py-2 text-sm font-bold text-paper-raised">Redeem</button> : <span className="flex items-center gap-1 text-xs text-ink-muted"><Lock className="size-3.5" /> Visit to unlock</span>}
              </div>
            );
          })}
        </div>
      )}
      {tab === "stamps" && (
        <div className="py-6">
          <div className="mb-6 flex items-center justify-center gap-4 rounded-2xl bg-ink p-6 text-paper-raised"><Hourglass className="size-10 text-stamp-glow" /><div><p className="font-serif text-5xl font-semibold leading-none">{hours}h</p><p className="text-sm opacity-75">reclaimed · {stamps.length} stamps in your passport</p></div></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stamps.map((s, i) => (
              <div key={s.id} className="paper-card animate-rise flex flex-col items-center p-4" style={{ animationDelay: `${i * 40}ms` }}>
                <Postmark place={s.label} date={s.date} tone={tone(s.kind)} className={i % 2 ? "rotate-6" : ""} />
                <span className="mt-2 text-[11px] font-bold tracking-widest text-ink-muted uppercase">{s.kind} stamp</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Bio({ name, hours }: { name: string; hours: number }) {
  return (
    <div className="space-y-1.5 text-sm">
      <p className="font-semibold text-ink">{name}</p>
      <p className="text-ink">Walking more, scrolling less. Collecting stamps, not likes. 📍 Riverside</p>
      <a className="flex items-center gap-1 font-semibold text-link" href="#"><Link2 className="size-3.5" />outstagram.app/sam</a>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-stamp px-2.5 py-1 text-xs font-bold text-primary-foreground"><Hourglass className="size-3" />{hours}h reclaimed</span>
        {["City explorer", "Pier regular", "Book swapper"].map((t) => <span key={t} className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-ink">{t}</span>)}
      </div>
    </div>
  );
}
