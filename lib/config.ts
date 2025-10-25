import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  MP_ACCESS_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("OCR Reconciler"),
  MAX_UPLOAD_MB: z.string().default("10"),
});

export const env = EnvSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  MAX_UPLOAD_MB: process.env.MAX_UPLOAD_MB,
});

// Check if required env vars are available
export function checkEnvStatus() {
  const missing = [];
  if (!env.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
  if (!env.MP_ACCESS_TOKEN) missing.push("MP_ACCESS_TOKEN");
  
  return {
    isValid: missing.length === 0,
    missing,
    hasOpenAI: !!env.OPENAI_API_KEY,
    hasMercadoPago: !!env.MP_ACCESS_TOKEN,
  };
}

// Validate required env vars at runtime (for API calls)
export function validateEnv() {
  const status = checkEnvStatus();
  if (!status.isValid) {
    throw new Error(`Missing required environment variables: ${status.missing.join(", ")}`);
  }
}
