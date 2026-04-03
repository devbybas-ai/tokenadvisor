import { z } from "zod/v4";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),

  // Google AI
  GOOGLE_AI_API_KEY: z.string().optional(),

  // App
  SITE_URL: z.url().optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = z.prettifyError(result.error);
    console.error("Environment validation failed:\n", formatted);
    throw new Error("Invalid environment variables. Check server logs.");
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
