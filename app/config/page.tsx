"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfigPage() {
  const router = useRouter();
  const [openaiKey, setOpenaiKey] = useState("");
  const [mpToken, setMpToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Cargar claves guardadas al inicio
  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = async () => {
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      if (data.openai_key) setOpenaiKey(data.openai_key);
      if (data.mp_token) setMpToken(data.mp_token);
    } catch (err) {
      console.error("Error loading config:", err);
    }
  };

  const handleSave = async () => {
    if (!openaiKey.trim() && !mpToken.trim()) {
      setMessage("Por favor, ingresa al menos una clave.");
      return;
    }

    setIsSaving(true);
    try {
      // Guardar en el servidor
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openai_key: openaiKey.trim(),
          mp_token: mpToken.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Claves guardadas correctamente en .env.local");
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err: any) {
      setMessage("❌ Error al guardar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Configuración de API</h1>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ← Volver
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Obtén tu clave en <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 hover:underline">platform.openai.com</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MercadoPago Access Token
              </label>
              <input
                type="password"
                value={mpToken}
                onChange={(e) => setMpToken(e.target.value)}
                placeholder="APP_USR-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Obtén tu token en <a href="https://www.mercadopago.com.ar/developers/panel/credentials" target="_blank" className="text-blue-600 hover:underline">developers.mercadopago.com</a>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Guardando..." : "Guardar Configuración"}
              </button>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded ${
                message.includes("✅") 
                  ? "bg-green-100 border border-green-400 text-green-700" 
                  : message.includes("❌")
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-yellow-100 border border-yellow-400 text-yellow-700"
              }`}>
                {message}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">ℹ️ Nota Importante:</h3>
            <p className="text-sm text-blue-700 mb-2">
              Las claves se guardan en el archivo <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> del servidor.
            </p>
            <p className="text-sm text-blue-700">
              Después de guardar, <strong>reinicia el servidor de desarrollo</strong> (Ctrl+C y vuelve a ejecutar <code className="bg-gray-100 px-1 py-0.5 rounded">npm run dev</code>) 
              para que los cambios surtan efecto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
