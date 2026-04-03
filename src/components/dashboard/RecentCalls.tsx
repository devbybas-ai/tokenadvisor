"use client";

// === MOCK DATA ===
const recentCalls = [
  {
    id: "1",
    time: "2:34:12 PM",
    project: "ABHS",
    provider: "Anthropic",
    model: "claude-sonnet-4-6",
    inputTokens: 1847,
    outputTokens: 523,
    cost: 0.0142,
    status: "pass" as const,
  },
  {
    id: "2",
    time: "2:33:58 PM",
    project: "BuiltByBas",
    provider: "Anthropic",
    model: "claude-opus-4-6",
    inputTokens: 4210,
    outputTokens: 1892,
    cost: 0.1284,
    status: "pass" as const,
  },
  {
    id: "3",
    time: "2:33:41 PM",
    project: "ABHS",
    provider: "Anthropic",
    model: "claude-sonnet-4-6",
    inputTokens: 982,
    outputTokens: 341,
    cost: 0.0079,
    status: "pass" as const,
  },
  {
    id: "4",
    time: "2:33:22 PM",
    project: "Figaro",
    provider: "OpenAI",
    model: "gpt-4o",
    inputTokens: 3100,
    outputTokens: 890,
    cost: 0.0312,
    status: "pass" as const,
  },
  {
    id: "5",
    time: "2:33:01 PM",
    project: "ABHS",
    provider: "Anthropic",
    model: "claude-haiku-4-5",
    inputTokens: 620,
    outputTokens: 180,
    cost: 0.0008,
    status: "pass" as const,
  },
  {
    id: "6",
    time: "2:32:44 PM",
    project: "BuiltByBas",
    provider: "Google AI",
    model: "gemini-2.5-pro",
    inputTokens: 2450,
    outputTokens: 1100,
    cost: 0.0478,
    status: "pass" as const,
  },
  {
    id: "7",
    time: "2:32:18 PM",
    project: "Dispensory",
    provider: "Anthropic",
    model: "claude-sonnet-4-6",
    inputTokens: 1560,
    outputTokens: 670,
    cost: 0.0134,
    status: "pass" as const,
  },
  {
    id: "8",
    time: "2:31:55 PM",
    project: "ABHS",
    provider: "Anthropic",
    model: "claude-opus-4-6",
    inputTokens: 5200,
    outputTokens: 2100,
    cost: 0.1545,
    status: "pass" as const,
  },
];

const projectColors: Record<string, string> = {
  ABHS: "bg-amber-500/20 text-amber-300",
  BuiltByBas: "bg-cyan-500/20 text-cyan-300",
  Figaro: "bg-violet-500/20 text-violet-300",
  Dispensory: "bg-emerald-500/20 text-emerald-300",
};

const providerColors: Record<string, string> = {
  Anthropic: "text-[#00D4FF]",
  OpenAI: "text-emerald-400",
  "Google AI": "text-violet-400",
};

export function RecentCalls() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent API Calls</h2>
            <p className="text-sm text-muted-foreground">Live feed of tracked requests</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Streaming
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/30">
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Provider / Model</th>
              <th className="px-6 py-3 font-medium text-right">Input</th>
              <th className="px-6 py-3 font-medium text-right">Output</th>
              <th className="px-6 py-3 font-medium text-right">Cost</th>
              <th className="px-6 py-3 font-medium text-center">Valid</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr
                key={call.id}
                className="border-b border-border/10 hover:bg-secondary/20 transition-colors"
              >
                <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{call.time}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      projectColors[call.project] ?? "bg-secondary text-foreground"
                    }`}
                  >
                    {call.project}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs ${providerColors[call.provider] ?? ""}`}>
                    {call.provider}
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {call.model}
                  </span>
                </td>
                <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">
                  {call.inputTokens.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">
                  {call.outputTokens.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right tabular-nums font-medium">
                  ${call.cost.toFixed(4)}
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg
                      className="h-3 w-3 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Running total footer */}
      <div className="px-6 py-4 border-t border-border/50 bg-primary/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Running Total</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary tracking-tight">$847.23</span>
            <span className="text-xs text-muted-foreground">this month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
