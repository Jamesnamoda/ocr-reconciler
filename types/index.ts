export type UploadResponse = {
  ocrText: string;
  parsed: {
    amount: number | null;
    currency: string | null;
    date: string | null;
    payer_name: string | null;
    reference: string | null;
    notes: string | null;
    taxpayer_id?: string | null;
  };
  candidates: Array<{ 
    id: number; 
    status: string; 
    date_created: string; 
    amount: number; 
    currency: string; 
    score: number; 
    external_reference?: string 
  }>;
};

export type ParsedTransfer = {
  amount: number | null;
  currency: "ARS" | "USD" | string | null;
  date: string | null;          // YYYY-MM-DD
  payer_name: string | null;
  reference: string | null;
  notes: string | null;
  taxpayer_id?: string | null;  // CUIT/CUIL si aparece
};

export type MPPayment = {
  id: number;
  status: string;
  date_created: string;
  transaction_amount: number;
  currency_id: string;
  payer?: { email?: string; first_name?: string; last_name?: string };
  external_reference?: string;
};
