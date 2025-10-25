import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCR Reconciler",
  description: "Upload transfer receipts and reconcile with Mercado Pago payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
