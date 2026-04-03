"use client";

// === MOCK DATA ===
const providers = [
  {
    name: "Anthropic",
    models: [
      { model: "claude-opus-4-6", calls: 1240, tokens: "18.4M", cost: "$412.80", pct: 48.7 },
      { model: "claude-sonnet-4-6", calls: 5820, tokens: "22.1M", cost: "$198.60", pct: 23.4 },
      { model: "claude-haiku-4-5", calls: 3100, tokens: "5.2M", cost: "$13.00", pct: 1.5 },
    ],
    total: "$624.40",
    color: "bg-[#00D4FF]",
  },
  {
    name: "OpenAI",
    models: [
      { model: "gpt-4o", calls: 1890, tokens: "1.8M", cost: "$142.50", pct: 16.8 },
      { model: "gpt-4o-mini", calls: 620, tokens: "0.5M", cost: "$3.10", pct: 0.4 },
    ],
    total: "$145.60",
    color: "bg-emerald-400",
  },
  {
    name: "Google AI",
    models: [
      { model: "gemini-2.5-pro", calls: 177, tokens: "0.2M", cost: "$77.23", pct: 9.1 },
    ],
    total: "$77.23",
    color: "bg-violet-400",
  },
];

export function ProviderBreakdown() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Provider Breakdown</h2>
        <p className="text-sm text-muted-foreground">Cost distribution by provider and model</p>
      </div>

      {/* Cost bar */}
      <div className="px-6 py-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
          {providers.map((p) => {
            const totalPct = p.models.reduce((sum, m) => sum + m.pct, 0);
            return (
              <div
                key={p.name}
                className={`${p.color} transition-all`}
                style={{ width: `${totalPct}%` }}
                title={`${p.name}: ${p.total} (${totalPct.toFixed(1)}%)`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex gap-4">
          {providers.map((p) => (
            <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${p.color}`} />
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Model table */}
      <div className="px-6 pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/30">
              <th className="pb-2 font-medium">Provider / Model</th>
              <th className="pb-2 font-medium text-right">Calls</th>
              <th className="pb-2 font-medium text-right">Tokens</th>
              <th className="pb-2 font-medium text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <>
                {p.models.map((m, i) => (
                  <tr
                    key={m.model}
                    className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-2.5">
                      {i === 0 && (
                        <span className="text-xs font-medium text-muted-foreground mr-2">
                          {p.name}
                        </span>
                      )}
                      <span className="font-mono text-xs">{m.model}</span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {m.calls.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                      {m.tokens}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-medium">{m.cost}</td>
                  </tr>
                ))}
              </>
            ))}
            <tr className="font-semibold">
              <td className="pt-3">Total</td>
              <td className="pt-3 text-right tabular-nums">
                {providers
                  .reduce((sum, p) => sum + p.models.reduce((s, m) => s + m.calls, 0), 0)
                  .toLocaleString()}
              </td>
              <td className="pt-3 text-right tabular-nums text-muted-foreground">48.2M</td>
              <td className="pt-3 text-right tabular-nums text-primary">$847.23</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
