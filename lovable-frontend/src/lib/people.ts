export type Person = { handle: string; name: string; avatar: string };
const av = (n: number) => `https://i.pravatar.cc/150?img=${n}`;
export const ME: Person = { handle: "sam.okafor", name: "Sam Okafor", avatar: av(12) };
export const PEOPLE: Person[] = [
  { handle: "maya.walks", name: "Maya Lin", avatar: av(5) },
  { handle: "jonas.reads", name: "Jonas Berg", avatar: av(11) },
  { handle: "priya.outside", name: "Priya Nair", avatar: av(9) },
  { handle: "theo.pier", name: "Theo Grant", avatar: av(13) },
  { handle: "ana.bakes", name: "Ana Souza", avatar: av(16) },
  { handle: "ravi.sketches", name: "Ravi Menon", avatar: av(15) },
  { handle: "lena.hikes", name: "Lena Vogt", avatar: av(20) },
  { handle: "omar.cycles", name: "Omar Haddad", avatar: av(33) },
];
export const SUGGESTED: Person[] = [
  { handle: "mohamed.farhan", name: "Mohamed Farhan", avatar: av(52) },
  { handle: "ibrahim.badsha", name: "Ibrahim Badsha", avatar: av(53) },
  { handle: "thamjeed", name: "Thamjeed", avatar: av(54) },
  { handle: "shahim.chemban", name: "Shahim Chemban", avatar: av(57) },
  { handle: "adil.sinan", name: "Adil Sinan", avatar: av(59) },
];

export type Profile = Person & { bio: string; location: string; hours: number; code: string; stamps: { kind: "place" | "meetup" | "quest" | "craft"; label: string; date: string }[] };
const BIOS = ["Walks first, coffee second.", "Reads on benches. Returns books late.", "Always outside, usually in a park.", "Pier at sunset, every Friday.", "Bakes too much. Shares it all.", "Sketches strangers' dogs (with permission).", "Hikes, then naps.", "Two wheels, no headphones."];
const LOCS = ["West Pier", "Remparts Books", "Linden Park", "Harbor Steps", "Corner Bakery", "Old Greenhouse", "Hill Lookout", "Riverside Cafe"];
export const ALL_PEOPLE: Person[] = [...PEOPLE, ...SUGGESTED];
export function profileFor(handle: string): Profile | undefined {
  const i = ALL_PEOPLE.findIndex((p) => p.handle === handle);
  const p = ALL_PEOPLE[i];
  if (!p) return undefined;
  const loc = LOCS[i % LOCS.length]!;
  return {
    ...p, bio: BIOS[i % BIOS.length]!, location: loc, hours: 6 + ((i * 7) % 30) + 0.5,
    code: String(100000 + ((i + 1) * 137911) % 900000),
    stamps: [
      { kind: "place", label: loc, date: "NOV 14" },
      { kind: "meetup", label: `with ${ALL_PEOPLE[(i + 1) % ALL_PEOPLE.length]!.name.split(" ")[0]}`, date: "NOV 11" },
      { kind: "quest", label: "Notice 3 things", date: "NOV 08" },
      ...(i % 2 ? [{ kind: "craft" as const, label: "Linocut", date: "NOV 02" }] : []),
    ],
  };
}
export function searchPeople(q: string): Person[] {
  const s = q.trim().toLowerCase();
  if (!s) return ALL_PEOPLE;
  return ALL_PEOPLE.filter((p) => `${p.handle} ${p.name}`.toLowerCase().includes(s) || profileFor(p.handle)!.code.includes(s));
}
