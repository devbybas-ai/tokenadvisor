"use client";

const checks = [
  { name: "Per-Call Validation", status: "pass", detail: "12,847 / 12,847 verified" },
  { name: "Micro-Reconciliation", status: "pass", detail: "Last run: 3 min ago" },
  { name: "Daily Reconciliation", status: "pass", detail: "Apr 2 -- $0.00 discrepancy" },
  { name: "Monthly Reconciliation", status: "pending", detail: "March -- awaiting invoice" },
];

const statusConfig = {
  pass: {
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    label: "PASS",
  },
  fail: {
    dot: "bg-red-500",
    text: "text-red-400",
    label: "FAIL",
  },
  pending: {
    dot: "bg-amber-500",
    text: "text-amber-400",
    label: "PENDING",
  },
} as const;

export function ValidationStatus() {
  const allPassing = checks.every((c) => c.status === "pass" || c.status === "pending");

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Validation</h2>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              allPassing ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${allPassing ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {allPassing ? "HEALTHY" : "ALERT"}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Self-validation checkpoints</p>
      </div>

      <div className="px-6 py-4 space-y-4">
        {checks.map((check) => {
          const config = statusConfig[check.status as keyof typeof statusConfig];
          return (
            <div key={check.name} className="flex items-start gap-3">
              <div className="mt-1">
                <span className={`inline-block h-2 w-2 rounded-full ${config.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{check.name}</span>
                  <span className={`text-xs font-mono ${config.text}`}>{config.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{check.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accuracy indicator */}
      <div className="px-6 py-4 border-t border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Accuracy Score</span>
          <span className="text-2xl font-bold text-primary">100%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          0 discrepancies across 12,847 calls
        </p>
      </div>
    </div>
  );
}
