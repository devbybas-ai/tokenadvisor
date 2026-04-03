// === SEO CONFIGURATION ===

export const SITE_URL = process.env.SITE_URL || "https://tokenadvisor.builtbybas.com";

export const BUSINESS = {
  name: "TokenAdvisor",
  description:
    "Real-time AI token usage and cost tracking. Multi-provider support for Anthropic, OpenAI, Google AI, and more. Built by BuiltByBas.",
  owner: "BuiltByBas",
  ownerUrl: "https://builtbybas.com",
  email: "devbybas@gmail.com",
  founded: "2026",
};

export const SEO_KEYWORDS = {
  primary: [
    "AI token tracking",
    "token cost calculator",
    "AI API cost monitoring",
    "TokenAdvisor",
    "BuiltByBas",
  ],
  services: [
    "Anthropic API cost tracking",
    "OpenAI API cost tracking",
    "Google AI cost tracking",
    "real-time token monitoring",
    "AI usage reconciliation",
    "multi-provider AI cost dashboard",
  ],
  technical: [
    "token usage analytics",
    "API cost validation",
    "billing reconciliation",
    "per-call cost tracking",
  ],
};

export function getAllKeywords(): string[] {
  return [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.services, ...SEO_KEYWORDS.technical];
}
