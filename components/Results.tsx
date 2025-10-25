"use client";
import type { UploadResponse } from "@/types";

interface ResultsProps {
  data: UploadResponse;
}

export default function Results({ data }: ResultsProps) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Texto OCR Extraído</h3>
        <div className="bg-gray-100 p-4 rounded border">
          <pre className="whitespace-pre-wrap text-sm">{data.ocrText}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Datos Estructurados</h3>
        <div className="bg-blue-50 p-4 rounded border">
          <pre className="text-sm">{JSON.stringify(data.parsed, null, 2)}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Coincidencias Encontradas</h3>
        {data.candidates.length === 0 ? (
          <p className="text-gray-500">No se encontraron coincidencias</p>
        ) : (
          <div className="space-y-3">
            {data.candidates.map((candidate, index) => (
              <div key={candidate.id} className="border rounded p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">#{index + 1}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    candidate.score >= 50 ? 'bg-green-100 text-green-800' :
                    candidate.score >= 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Score: {candidate.score}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>ID:</strong> {candidate.id}</div>
                  <div><strong>Estado:</strong> {candidate.status}</div>
                  <div><strong>Monto:</strong> {candidate.amount} {candidate.currency}</div>
                  <div><strong>Fecha:</strong> {new Date(candidate.date_created).toLocaleDateString()}</div>
                  {candidate.external_reference && (
                    <div className="col-span-2">
                      <strong>Referencia:</strong> {candidate.external_reference}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
