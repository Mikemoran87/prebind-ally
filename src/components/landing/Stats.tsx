const stats = [
  { value: "< 2 min", label: "Deal pack to structured output" },
  { value: "100%", label: "Binder alignment checked automatically" },
  { value: "5+", label: "Insurance product lines supported" },
  { value: "0", label: "Manual data re-entry required" },
];

export function Stats() {
  return (
    <section className="relative border-y border-border/50 bg-card/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-foreground lg:text-5xl">
                <span className="gradient-text">{stat.value}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
