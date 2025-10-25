"use client";

import { useState } from "react";

export default function ConfigPage() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [mpToken, setMpToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    // En una implementación real, esto se enviaría al servidor
    // Por ahora, solo mostramos un mensaje
    setMessage("Las claves se han guardado. Reinicia la aplicación para aplicar los cambios.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración de API</h1>
          
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

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Configuración
            </button>

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Nota Importante:</h3>
            <p className="text-sm text-yellow-700">
              En producción, estas claves deben configurarse como variables de entorno en Vercel 
              para mayor seguridad. Esta interfaz es solo para desarrollo y pruebas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
