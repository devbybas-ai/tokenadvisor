"use client";

import { CostOverview } from "./CostOverview";
import { ProviderBreakdown } from "./ProviderBreakdown";
import { RecentCalls } from "./RecentCalls";
import { ValidationStatus } from "./ValidationStatus";

export function DashboardShell() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-1 2 1.5"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                Token<span className="text-primary">Advisor</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </div>
              <span className="text-xs text-muted-foreground">
                Built by{" "}
                <a
                  href="https://builtbybas.com"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BuiltByBas
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Cost Overview Cards */}
        <CostOverview />

        {/* Middle Row: Provider Breakdown + Validation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProviderBreakdown />
          </div>
          <div>
            <ValidationStatus />
          </div>
        </div>

        {/* Recent API Calls */}
        <div className="mt-8">
          <RecentCalls />
        </div>
      </main>
    </div>
  );
}
