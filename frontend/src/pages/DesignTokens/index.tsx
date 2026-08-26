const swatches = [
  ["Ink", "--ink"],
  ["Saffron", "--saffron"],
  ["Chili", "--chili"],
  ["Curry leaf", "--curry-leaf"],
  ["Cream", "--cream"],
  ["Cream dim", "--cream-dim"],
];

export const DesignTokens = () => (
  <main className="min-h-screen bg-[var(--cream)] p-8 text-[var(--ink)] md:p-16">
    <div className="mx-auto max-w-4xl">
      <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--chili)]">
        Phase 0 / Foundation
      </p>
      <h1 className="font-display text-5xl">Zaika design tokens</h1>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Palette</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map(([label, token]) => (
            <div
              key={token}
              className="flex min-h-28 flex-col justify-between rounded border border-[var(--cream-dim)] p-3"
              style={{ backgroundColor: `var(${token})` }}
            >
              <span className="font-body text-sm">{label}</span>
              <code className="text-xs">{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--cream-dim)] pt-8">
        <h2 className="font-display text-2xl">Type scale</h2>
        <p className="mt-4 font-display text-5xl">Fraunces display</p>
        <p className="mt-3 text-lg">Work Sans body and interface text</p>
        <p className="mt-3 text-sm text-[var(--curry-leaf)]">
          The shared tokens are ready for the next phase.
        </p>
      </section>
    </div>
  </main>
);
