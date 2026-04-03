# Token Cost Tracking System — Design Document

**Author:** BuiltByBas  
**Date:** April 2, 2026  
**Status:** Conceptual Design  
**Version:** 1.0

---

## 1. Executive Summary

This document outlines the design for an infallible, real-time token usage and cost tracking system built for the Anthropic API. The system captures every API call, calculates costs in real time across multiple models (Haiku, Sonnet, Opus), validates its own accuracy continuously, and reconciles against Anthropic's actual billing to ensure zero discrepancies.

This is not a bolt-on feature. Accuracy, validation, and logging are core to the architecture from day one — not afterthoughts added later in development.

---

## 2. Core Principles

Every architectural and implementation decision must satisfy these four pillars:

- **Stability** — The system must operate reliably under sustained load without data loss, dropped logs, or calculation drift.
- **Accuracy** — Token counts and cost calculations must be exact. There is no acceptable margin of error. The system's cumulative total must match Anthropic's monthly invoice.
- **Security** — API keys, usage data, and cost information must be handled with the same rigor as financial data.
- **Performance** — Tracking and validation must not introduce meaningful latency to API calls. The system must update in real time without degrading the applications it monitors.

---

## 3. System Architecture

The system is composed of four interdependent layers. Each layer is purpose-built and must function correctly for the system to meet its accuracy guarantees.

### 3.1 Layer 1 — API Integration Layer

**Purpose:** Capture every single API call to Anthropic with full metadata.

**Responsibilities:**

- Intercept or wrap every outbound API request to Anthropic's `/v1/messages` endpoint.
- Extract token usage data from every API response (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`).
- Record the model identifier, model version, and timestamp for each call.
- Log the raw response metadata immediately — before any processing occurs.
- Handle streaming responses by aggregating token counts from the final usage event.

**Key Requirement:** No API call may pass through without being captured. If the logging mechanism fails, the call itself should be flagged, not silently ignored.

### 3.2 Layer 2 — Cost Calculation Engine

**Purpose:** Apply accurate, model-specific pricing to every captured call in real time.

**Responsibilities:**

- Maintain a pricing table with per-model, per-token-type rates (input, output, cache read, cache write).
- Calculate cost immediately upon receiving token data from Layer 1 — not on a schedule, not in a batch.
- Handle model-specific pricing differences (e.g., Haiku vs. Sonnet vs. Opus).
- Support dynamic pricing updates when Anthropic changes rates, without breaking calculations for previously logged calls.
- Account for edge cases including cached tokens, system-injected tokens, and batch API pricing differences.

**Pricing Data Management:**

- Pricing should be stored in a versioned configuration that records effective dates.
- Historical calls retain the pricing that was active at the time of the call.
- A mechanism must exist to refresh pricing data from Anthropic's published rates.
- If pricing data is stale or unavailable, the system must flag this condition — never silently use outdated rates.

### 3.3 Layer 3 — Validation & Reconciliation Engine

**Purpose:** Continuously verify that the system's calculations match reality. Track the tracker.

**Responsibilities:**

- **Per-Call Validation:** After every API call, compare the locally calculated cost against the token usage metadata returned in Anthropic's response. Flag any mismatch immediately.
- **Continuous Reconciliation:** Periodically pull data from Anthropic's Usage and Cost API endpoint and compare it against internal logs. Identify divergences in real time — not at end of month.
- **Discrepancy Logging:** Every mismatch must be logged with full context: the API call payload, the response metadata, the locally calculated cost, the Anthropic-reported cost, the model, the timestamp, and the pricing table version used.
- **Self-Validation:** The validation layer itself must be monitored. If reconciliation stops running or encounters errors, the system must alert immediately.

**Validation Checkpoints:**

| Checkpoint | Trigger | Comparison |
|---|---|---|
| Per-Call Check | Every API response | Local cost vs. response metadata |
| Micro-Reconciliation | Every 15 minutes | Internal log totals vs. Anthropic Usage API |
| Daily Reconciliation | Once per day | Full daily totals comparison |
| Monthly Reconciliation | End of billing cycle | System total vs. Anthropic invoice |

### 3.4 Layer 4 — Dashboard & Display

**Purpose:** Surface all data in real time with full transparency.

**Responsibilities:**

- Display real-time token count (input, output, cached) as API calls occur.
- Display real-time cumulative cost, updating the moment each call completes.
- Break down usage and cost by model, by project, and by time period.
- Show validation status: whether the system is currently reconciled or if discrepancies exist.
- Surface alerts and discrepancy details when validation fails.
- Display per-file and per-request token counts during development (similar to VS Code token counter extensions).

**Dashboard Views:**

- **Live View** — Real-time token and cost counter updating per call.
- **Model Breakdown** — Cost and usage segmented by Haiku, Sonnet, Opus, and any future models.
- **Project Breakdown** — Cost and usage segmented by project (PickyTraveler, BuiltByBas, etc.).
- **Validation Status** — Green/red indicator showing reconciliation health, with drill-down into any flagged discrepancies.
- **Historical View** — Daily, weekly, monthly usage and cost trends.

---

## 4. Real-Time Tracking Requirements

The system must meet the following real-time requirements without exception:

1. Token counts are extracted directly from each API response the moment it arrives — not by polling Anthropic's usage endpoint on a timer.
2. Cost is calculated immediately using the active pricing table for the model used in that call.
3. The dashboard updates the moment cost data is calculated — no batching, no scheduled refreshes.
4. When the model changes between calls (e.g., switching from Haiku to Opus), the cost calculation adjusts instantly to reflect the new model's pricing.
5. Every API call is logged with full metadata: timestamp, model, model version, input tokens, output tokens, cache tokens, calculated cost, and validation result.

---

## 5. Edge Cases & Traps

These are known risks that the system must handle explicitly. Ignoring any of them compromises accuracy.

### 5.1 Pricing Changes

Anthropic may update model pricing at any time. The system must detect when its local pricing table is outdated and refresh it. Historical calls must retain the pricing that was active at the time they were made — retroactive repricing must not corrupt the log.

### 5.2 Cached Tokens

Anthropic's prompt caching system means some input tokens may be billed at reduced rates (cache read) or generate additional charges (cache creation). The system must distinguish between standard input tokens, cache read tokens, and cache creation tokens and apply the correct rate to each.

### 5.3 System-Injected Tokens

Anthropic may add tokens automatically for system optimizations. These are reflected in token counts but are not billed. The system must account for this discrepancy — the token count may not directly equal the billed amount.

### 5.4 Model Version Changes

If a model is updated (e.g., a new Sonnet version), pricing or tokenization behavior may change. The system must track which model version was used for each call and apply the correct pricing accordingly.

### 5.5 Streaming Responses

When using streaming, token usage data arrives in the final event, not incrementally. The system must handle this correctly and not attempt to calculate cost from partial streaming data.

### 5.6 Batch API Pricing

Anthropic's Batch API offers reduced pricing (typically 50% off). If the system monitors batch calls, it must apply batch-specific rates rather than standard rates.

### 5.7 Rate Limiting and Failed Calls

Calls that are rate-limited or fail should not be counted toward token usage or cost. The system must distinguish between successful and unsuccessful calls.

---

## 6. Implementation Strategy

### 6.1 Recommended Architecture: Standalone Service

The system should be built as a standalone microservice that sits between the application and the Anthropic API. This approach was selected because:

- Any project (PickyTraveler, BuiltByBas, future projects) can route calls through it without modification to their internal code.
- It centralizes all tracking, validation, and reconciliation in one place.
- It is language- and framework-agnostic — any application that can make HTTP requests can use it.
- It provides a single source of truth for usage and cost across all projects.

### 6.2 Alternative: NPM Package

A lighter-weight option would be an installable NPM package that wraps the Anthropic client SDK. This would be appropriate if:

- All projects are Node.js / Next.js based.
- A centralized service introduces unwanted infrastructure complexity.
- The priority is minimal deployment overhead.

**Tradeoff:** The NPM package approach distributes the tracking logic across projects, making centralized reconciliation more complex.

### 6.3 Hybrid Approach

Use an NPM package in each project to capture and log data, with all logs feeding into a centralized service for reconciliation and dashboard display. This combines the lightweight integration of a package with the centralized validation of a service.

---

## 7. Competitive Landscape & Differentiation

### 7.1 Existing Solutions Reviewed

| Tool | What It Does | Limitation |
|---|---|---|
| **Anthropic Console** | Built-in usage dashboard with model/date/key filtering | Not real-time per-call; no self-validation; no cross-project aggregation |
| **LangSmith** | LLM observability with token and cost tracking | Adds a dependency layer; cost tracking is estimated, not validated against billing |
| **Langfuse** | Open-source LLM observability with cost tracking | Requires manual pricing configuration; no automated reconciliation against invoices |
| **ccusage** | Claude Code usage analysis by date/session/model | Post-hoc analysis tool; not real-time; no validation framework |
| **Tokscale** | CLI tool for multi-tool token tracking | Aggregates across tools but relies on third-party pricing databases; no per-call validation |
| **VS Code Token Counter Extensions** | Display file-level token counts in status bar | Static file analysis only; no API call tracking or cost calculation |
| **Claude Token Monitor (VS Code)** | Real-time Claude token usage in VS Code | Tied to VS Code; no cross-project tracking or reconciliation |

### 7.2 Where This System Is Different

- **Real-time per-call tracking** — not polling, not post-hoc analysis.
- **Built-in validation framework** — the system verifies its own accuracy continuously.
- **Reconciliation against actual billing** — the monthly invoice is the ground truth, and the system is designed to match it exactly.
- **Cross-project centralized tracking** — one system covers every project.
- **No third-party pricing dependencies** — pricing is managed internally with version control and staleness detection.
- **Intentional architecture** — accuracy and validation are core to the design, not features added after launch.

---

## 8. Success Criteria

The system is considered successful when all of the following are true:

1. The system's cumulative cost total matches Anthropic's monthly invoice exactly.
2. Every API call across all connected projects is logged with full metadata.
3. All token counts reconcile with Anthropic's Usage and Cost API with zero discrepancies.
4. Validation alerts fire immediately when a discrepancy is detected — not hours or days later.
5. The dashboard displays accurate, real-time token and cost data as calls occur.
6. The system handles all documented edge cases (cached tokens, system tokens, pricing changes, model versioning, streaming, batch API, failed calls) without manual intervention.

---

## 9. Next Steps

1. **Define database schema** — Design the data model for call logs, pricing tables, validation records, and reconciliation reports.
2. **Design API integration points** — Map out exactly how the service intercepts or wraps Anthropic API calls.
3. **Build the validation logic** — Implement per-call checks, micro-reconciliation, daily reconciliation, and monthly reconciliation.
4. **Build the dashboard** — Design and implement the real-time display layer.
5. **Test against live API** — Run the system against real Anthropic API calls and validate against the console's usage data.
6. **Monthly reconciliation test** — Compare the system's total against an actual Anthropic invoice to confirm accuracy.

---

*Built with intention. No shortcuts. No technical debt. BuiltByBas.*
