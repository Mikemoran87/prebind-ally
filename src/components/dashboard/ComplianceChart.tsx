import { TrendingUp } from "lucide-react";

const chartData = [
  { day: "Mon", compliant: 45, flagged: 5 },
  { day: "Tue", compliant: 52, flagged: 8 },
  { day: "Wed", compliant: 48, flagged: 3 },
  { day: "Thu", compliant: 61, flagged: 6 },
  { day: "Fri", compliant: 55, flagged: 4 },
  { day: "Sat", compliant: 32, flagged: 2 },
  { day: "Sun", compliant: 28, flagged: 1 },
];

const maxValue = Math.max(...chartData.map((d) => d.compliant + d.flagged));

export function ComplianceChart() {
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Weekly Compliance
          </h3>
          <p className="text-sm text-muted-foreground">
            Deal processing trends this week
          </p>
        </div>
        <div className="flex items-center gap-2 text-success">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <div className="flex h-full items-end justify-between gap-3">
          {chartData.map((data) => {
            const compliantHeight = (data.compliant / maxValue) * 100;
            const flaggedHeight = (data.flagged / maxValue) * 100;
            return (
              <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-col items-center" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary to-cyan-400 transition-all duration-500"
                    style={{ height: `${compliantHeight}%` }}
                  />
                  <div
                    className="absolute w-full max-w-[40px] rounded-t-lg bg-warning/50 transition-all duration-500"
                    style={{ 
                      height: `${flaggedHeight}%`,
                      bottom: `${compliantHeight}%`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-cyan-400" />
          <span className="text-sm text-muted-foreground">Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <span className="text-sm text-muted-foreground">Flagged</span>
        </div>
      </div>
    </div>
  );
}
