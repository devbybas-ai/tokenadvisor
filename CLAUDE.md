# TokenAdvisor -- Project Instructions

## Project Overview

Real-time AI token usage and cost tracking system. Multi-provider (Anthropic, OpenAI, Google, etc.). Captures every API call, calculates costs, self-validates, reconciles against billing.

- **Owner:** Bas Rosario / BuiltByBas
- **Type:** BuiltByBas product (internal tool)
- **Domain:** tokenadvisor.builtbybas.com
- **Design Spec:** `tmp/Token-Cost-Tracking-System-Design.md`

## Tech Stack (LOCKED)

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Framework | Next.js 16 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Database | PostgreSQL (self-hosted) |
| ORM | Drizzle |
| Auth | Auth.js v5 |
| Testing | Vitest + happy-dom |
| Package Mgr | pnpm |
| Linting | ESLint + Prettier |
| AI SDKs | Anthropic, OpenAI, Google AI |
| Charts | Recharts |
| Validation | Zod v4 |
| Scheduling | node-cron |

**Stack is LOCKED.** Changing any layer requires documented justification in HANDOFF.md and Bas's explicit approval.

## Architecture

Four interdependent layers:
1. **API Integration Layer** -- Captures every API call with full metadata
2. **Cost Calculation Engine** -- Applies model-specific pricing in real time
3. **Validation & Reconciliation Engine** -- Self-validates continuously
4. **Dashboard & Display** -- Real-time transparency

## Brand

- **Aesthetic:** BuiltByBas standard -- dark mode, glassmorphism, electric cyan (#00D4FF)
- **Typography:** Inter (or framework default)

## Standards Applied

- BuiltByBas Dev Studio Bible (`.claude/BuiltByBasProjectSetup.md`)
- Eight Pillars govern every decision
- Security > Performance > Convenience
- Accessibility > Aesthetics
- Data Privacy > Feature Completeness

## Session Protocol

### Start
1. Read HANDOFF.md, AUDIT.md, ProjectHealth.md
2. Run `pnpm test` to confirm baseline
3. State understanding and plan

### During
- Follow Eight Pillars on every line
- Log issues in AUDIT.md immediately
- Test before and after changes

### End
1. Update HANDOFF.md, AUDIT.md, ProjectHealth.md
2. Run full quality gates: `pnpm type-check && pnpm lint && pnpm test && pnpm build`
3. Recommend next steps

## Quality Gates

All must pass before shipping:
```bash
pnpm type-check   # 0 TypeScript errors
pnpm lint          # 0 errors
pnpm test          # All passing
pnpm build         # Production build succeeds
```

## Prohibited Actions

- Never use `any` type or `@ts-ignore` without documented justification
- Never pass raw request body to database
- Never expose API keys to client bundles
- Never commit .env or secrets
- Never force-push to shared branches
- Never skip auth checks on protected routes
- Never log PII
- Never use eval(), exec(), or new Function() with input
- Never ship without passing quality gates

## Fallback Priority Chain

1. Live database/API query
2. Cached/ISR response
3. Fallback data files
4. "Content coming soon" -- NEVER a crash

## Key Files

- `src/lib/env.ts` -- Environment variable validation (Zod)
- `src/db/` -- Database schema and connection
- `src/lib/` -- Shared utilities, business logic
- `src/app/` -- Next.js App Router pages and API routes
