import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// === ENUMS ===

export const providerEnum = pgEnum("provider", [
  "anthropic",
  "openai",
  "google",
]);

export const validationStatusEnum = pgEnum("validation_status", [
  "pass",
  "fail",
  "pending",
  "skipped",
]);

export const reconciliationTypeEnum = pgEnum("reconciliation_type", [
  "micro",
  "daily",
  "monthly",
]);

// === PROJECTS ===

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// === PRICING ===

export const pricingVersions = pgTable("pricing_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: providerEnum("provider").notNull(),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull(),
  effectiveTo: timestamp("effective_to", { withTimezone: true }),
  source: text("source").notNull().default("manual"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pricingRates = pgTable("pricing_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  versionId: uuid("version_id")
    .notNull()
    .references(() => pricingVersions.id),
  provider: providerEnum("provider").notNull(),
  model: text("model").notNull(),
  inputPricePerMToken: numeric("input_price_per_m_token", {
    precision: 12,
    scale: 6,
  }).notNull(),
  outputPricePerMToken: numeric("output_price_per_m_token", {
    precision: 12,
    scale: 6,
  }).notNull(),
  cacheReadPricePerMToken: numeric("cache_read_price_per_m_token", {
    precision: 12,
    scale: 6,
  }),
  cacheWritePricePerMToken: numeric("cache_write_price_per_m_token", {
    precision: 12,
    scale: 6,
  }),
  batchInputPricePerMToken: numeric("batch_input_price_per_m_token", {
    precision: 12,
    scale: 6,
  }),
  batchOutputPricePerMToken: numeric("batch_output_price_per_m_token", {
    precision: 12,
    scale: 6,
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// === API CALL LOGS ===

export const apiCalls = pgTable("api_calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id),
  provider: providerEnum("provider").notNull(),
  model: text("model").notNull(),
  modelVersion: text("model_version"),

  // Token counts from provider response
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  cacheCreationTokens: integer("cache_creation_tokens").notNull().default(0),
  cacheReadTokens: integer("cache_read_tokens").notNull().default(0),

  // Calculated cost (in USD)
  calculatedCost: numeric("calculated_cost", {
    precision: 12,
    scale: 8,
  }).notNull(),

  // Pricing version used for this calculation
  pricingVersionId: uuid("pricing_version_id").references(() => pricingVersions.id),

  // Validation
  validationStatus: validationStatusEnum("validation_status")
    .notNull()
    .default("pending"),
  validationDetails: jsonb("validation_details"),

  // Request metadata
  requestTimestamp: timestamp("request_timestamp", { withTimezone: true }).notNull(),
  responseTimeMs: integer("response_time_ms"),
  streaming: boolean("streaming").notNull().default(false),
  batchApi: boolean("batch_api").notNull().default(false),
  success: boolean("success").notNull().default(true),
  errorMessage: text("error_message"),

  // Raw response metadata (for audit trail)
  rawUsageMetadata: jsonb("raw_usage_metadata"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// === VALIDATION & RECONCILIATION ===

export const reconciliationRecords = pgTable("reconciliation_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: reconciliationTypeEnum("type").notNull(),
  provider: providerEnum("provider"),

  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),

  // Our totals
  internalTotalCost: numeric("internal_total_cost", {
    precision: 12,
    scale: 8,
  }).notNull(),
  internalTotalTokens: integer("internal_total_tokens").notNull(),

  // Provider-reported totals
  providerTotalCost: numeric("provider_total_cost", {
    precision: 12,
    scale: 8,
  }),
  providerTotalTokens: integer("provider_total_tokens"),

  // Discrepancy
  costDiscrepancy: numeric("cost_discrepancy", {
    precision: 12,
    scale: 8,
  }),
  tokenDiscrepancy: integer("token_discrepancy"),
  reconciled: boolean("reconciled").notNull().default(false),

  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
