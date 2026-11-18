export default function Chargement() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="h-12 w-full max-w-3xl animate-pulse rounded-full bg-dk/5" />
      <div className="mt-6 h-8 w-72 animate-pulse rounded-lg bg-dk/5" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[var(--radius-dk)] border border-dk/10">
              <div className="plan-grid aspect-[4/3] animate-pulse bg-dk/5" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-1/2 animate-pulse rounded bg-dk/10" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-dk/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="plan-grid hidden h-[70vh] animate-pulse rounded-[var(--radius-dk)] border border-dk/10 lg:block" />
      </div>
    </div>
  );
}
