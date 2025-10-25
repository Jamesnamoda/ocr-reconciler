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

// Validate required env vars at runtime
export function validateEnv() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required");
  }
  if (!env.MP_ACCESS_TOKEN) {
    throw new Error("MP_ACCESS_TOKEN is required");
  }
}
