import { NextRequest, NextResponse } from "next/server";
import { env, validateEnv } from "@/lib/config";
import { runOCR } from "@/lib/ocr";
import { parseWithGPT } from "@/lib/gpt";
import { searchPayments } from "@/lib/mercadopago";
import { scoreMatches } from "@/lib/matching";

export const runtime = "nodejs"; // necesitamos Node para Tesseract

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    validateEnv();

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

    // Límite de tamaño
    const maxBytes = Number(env.MAX_UPLOAD_MB) * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `File too large. Max ${env.MAX_UPLOAD_MB}MB` }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1) OCR
    const ocrText = await runOCR(buffer);

    // 2) GPT parsing
    const parsed = await parseWithGPT(ocrText);

    // 3) Construir ventana de fechas (si no hay fecha, usar hoy ± 3 días)
    const now = new Date();
    const target = parsed.date ? new Date(parsed.date) : now;
    const begin = new Date(target.getTime() - 3 * 24 * 60 * 60 * 1000);
    const end = new Date(target.getTime() + 3 * 24 * 60 * 60 * 1000);

    const beginISO = begin.toISOString();
    const endISO = end.toISOString();

    // 4) MP search
    const results = await searchPayments({
      begin_date: beginISO,
      end_date: endISO,
      amount: parsed.amount ?? undefined,
      limit: 50,
    });

    // 5) Score
    const ranked = scoreMatches(parsed, results).map(({ payment, score }) => ({
      id: payment.id,
      status: payment.status,
      date_created: payment.date_created,
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      external_reference: payment.external_reference,
      score,
    }));

    return NextResponse.json({
      ocrText,
      parsed,
      candidates: ranked.slice(0, 10),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
