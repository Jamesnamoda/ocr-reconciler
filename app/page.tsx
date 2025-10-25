import UploadForm from "@/components/UploadForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">OCR Reconciler</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Subí una captura o recibo de transferencia bancaria y automáticamente 
            buscaremos coincidencias en tus pagos de Mercado Pago usando IA.
          </p>
        </div>
        <UploadForm />
      </div>
    </main>
  );
}
