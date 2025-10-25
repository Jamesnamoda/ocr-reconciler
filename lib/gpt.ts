import OpenAI from "openai";
import { env } from "./config";
import type { ParsedTransfer } from "@/types";

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required");
    }
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
}

export async function parseWithGPT(ocrText: string): Promise<ParsedTransfer> {
  const openaiClient = getClient();
  
  const system = `Eres un extractor estricto. Devuelve SOLO JSON válido.
Campos: amount(number), currency(string), date(YYYY-MM-DD o null), payer_name, reference, notes, taxpayer_id.
Si falta algo, usa null. Normaliza números (12.345,00 → 12345.00). Detecta ARS/USD.`;

  const user = `Texto OCR:
<<<
${ocrText}
>>>`;

  const res = await openaiClient.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" as const },
  });

  const content = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as ParsedTransfer;
}
