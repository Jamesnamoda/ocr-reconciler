"use client";
import { useState } from "react";
import Results from "./Results";
import type { UploadResponse } from "@/types";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<UploadResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErr(null);
    setResp(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) setErr(json.error || "Error");
      else setResp(json);
    } catch (error) {
      setErr("Error de conexión");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una imagen de transferencia
          </label>
          <input
            id="file"
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.webp,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button 
          disabled={!file || loading} 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Procesando..." : "Subir y conciliar"}
        </button>
      </form>

      {err && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{err}</p>
        </div>
      )}

      {resp && <Results data={resp} />}
    </div>
  );
}
