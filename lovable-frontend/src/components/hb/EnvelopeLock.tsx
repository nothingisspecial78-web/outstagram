export function WaxSeal({ className = "size-16" }: { className?: string }) {
  return (
    <div className={`wax grid place-items-center rounded-full ${className}`} aria-hidden>
      <span className="font-serif text-2xl font-bold italic text-paper-raised/90">H</span>
    </div>
  );
}

export function EnvelopeLock({ name }: { name: string }) {
  return (
    <div className="relative mx-auto w-full max-w-md" role="status">
      <div className="relative h-36 overflow-hidden rounded-md border border-sand bg-line shadow-postcard">
        <div className="absolute inset-x-0 top-0 h-20 bg-paper-raised [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-sand/60 [clip-path:polygon(0_100%,50%_15%,100%_100%)]" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2"><WaxSeal /></div>
      </div>
      <p className="mt-3 text-center font-serif text-lg font-semibold text-ink">You've said a lot. Say the rest in person.</p>
      <p className="text-center text-sm text-ink-muted">Meet {name} and swap codes to unlock 20 more messages.</p>
    </div>
  );
}
