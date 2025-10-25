import type { ParsedTransfer } from "@/types";
import type { MPPayment } from "@/types";

function normalizeName(s?: string) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

export function scoreMatches(parsed: ParsedTransfer, payments: MPPayment[]) {
  const targetAmount = parsed.amount ?? 0;
  const targetRef = (parsed.reference || "").trim();
  const targetDate = parsed.date ? new Date(parsed.date) : null;
  const targetName = normalizeName(parsed.payer_name || "");

  const out = payments.map((p) => {
    let score = 0;

    // Monto
    if (targetAmount > 0) {
      const diff = Math.abs((p.transaction_amount ?? 0) - targetAmount);
      const tol = Math.max(1, targetAmount * 0.005); // ±0.5%
      if (diff === 0) score += 30;
      else if (diff <= tol) score += 20;
    }

    // Fecha (proximidad días)
    if (targetDate) {
      const pd = targetDate.getTime();
      const pp = new Date(p.date_created).getTime();
      const days = Math.abs(pd - pp) / (1000 * 60 * 60 * 24);
      if (days < 1) score += 20;
      else if (days < 3) score += 10;
    }

    // Referencia
    if (targetRef && p.external_reference) {
      if (p.external_reference.trim() === targetRef) score += 40;
      else if (p.external_reference.includes(targetRef)) score += 25;
    }

    // Nombre pagador
    const payerName = normalizeName(
      [p.payer?.first_name, p.payer?.last_name].filter(Boolean).join(" ")
    );
    if (targetName && payerName) {
      if (payerName === targetName) score += 10;
      else if (payerName.includes(targetName) || targetName.includes(payerName)) score += 6;
    }

    return { payment: p, score };
  });

  return out.sort((a, b) => b.score - a.score);
}
