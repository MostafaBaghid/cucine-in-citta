// Server Component: static chrome, no interactivity — stays out of the JS bundle.
export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-bold tracking-tight">Bestie Bite</span>
        {/* Voci decorative da mockup: nessuna destinazione reale, quindi
            niente <a href="#"> che annuncerebbe interattività inesistente. */}
        <nav className="flex items-center gap-8 text-sm text-muted-foreground">
          <span className="cursor-default select-none">Per ristoranti</span>
          <span className="cursor-default select-none">Accedi</span>
        </nav>
      </div>
    </header>
  );
}
