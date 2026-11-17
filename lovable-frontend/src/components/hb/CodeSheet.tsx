import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const DEMO_CODE = "482913";

export function FakeQR() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && !(x > a && x < a + 6 && y > b && y < b + 6 && !(x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5));
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true;
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false;
    return ((x * 7 + y * 13 + x * y) % 5) < 2;
  });
  return (
    <div className="grid size-40 grid-cols-[repeat(21,1fr)] rounded bg-paper-raised p-2 shadow-paper" aria-label="QR code">
      {cells.map((on, i) => <span key={i} className={on ? "bg-ink" : ""} />)}
    </div>
  );
}

export function CodeSheet({ open, onOpenChange, name }: { open: boolean; onOpenChange: (o: boolean) => void; name: string }) {
  const [secs, setSecs] = useState(300);
  useEffect(() => {
    if (!open) return; setSecs(300);
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [open]);
  const mm = String(Math.floor(secs / 60)).padStart(1, "0"), ss = String(secs % 60).padStart(2, "0");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-2xl border-sand bg-paper pb-10">
        <SheetHeader className="text-center">
          <SheetTitle className="text-center font-serif text-2xl">Together with {name}?</SheetTitle>
          <SheetDescription className="text-center">Have {name} enter this code on their Meet screen.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center gap-5 px-4">
          <div className="flex gap-2" aria-label={`Code ${DEMO_CODE}`}>
            {DEMO_CODE.split("").map((d, i) => <span key={i} className="grid h-14 w-11 place-items-center rounded-md border border-sand bg-paper-raised font-serif text-3xl font-semibold text-ink shadow-paper">{d}</span>)}
          </div>
          <FakeQR />
          <p className={`text-sm tabular-nums ${secs < 60 ? "text-stamp-ink" : "text-ink-muted"}`}>{secs > 0 ? `Expires in ${mm}:${ss}` : "Code expired — close and try again"}</p>
          <Button asChild variant="outline" className="bg-paper-raised"><Link to="/meet">I have their code instead</Link></Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
