import { env } from "./config";
import type { MPPayment } from "@/types";

export async function searchPayments(params: {
  begin_date: string; // ISO
  end_date: string;   // ISO
  amount?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams({
    range: "date_created",
    begin_date: params.begin_date,
    end_date: params.end_date,
    limit: String(params.limit ?? 30),
  });

  // Nota: filtrar por monto exacto lo hacemos luego en app (o arma otros filtros si aplica)
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/search?${qs.toString()}`,
    { headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MercadoPago search failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const results: MPPayment[] = json.results || [];
  return results;
}
