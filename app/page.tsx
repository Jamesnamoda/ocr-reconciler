import UploadForm from "@/components/UploadForm";
import { checkEnvStatus } from "@/lib/config";
import Link from "next/link";

export default function Page() {
  const envStatus = checkEnvStatus();

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

        {/* Status de configuración */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado de Configuración</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${envStatus.hasOpenAI ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">OpenAI API</span>
                <span className={`text-sm ${envStatus.hasOpenAI ? 'text-green-600' : 'text-red-600'}`}>
                  {envStatus.hasOpenAI ? 'Configurado' : 'No configurado'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${envStatus.hasMercadoPago ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">MercadoPago API</span>
                <span className={`text-sm ${envStatus.hasMercadoPago ? 'text-green-600' : 'text-red-600'}`}>
                  {envStatus.hasMercadoPago ? 'Configurado' : 'No configurado'}
                </span>
              </div>
            </div>

            {!envStatus.isValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Configuración incompleta
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p className="mb-2">Faltan las siguientes variables de entorno:</p>
                      <ul className="list-disc list-inside mb-3">
                        {envStatus.missing.map((missing) => (
                          <li key={missing}>{missing}</li>
                        ))}
                      </ul>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                        <p className="font-medium text-blue-800 mb-1">Configurar en Vercel:</p>
                        <p className="text-blue-700">
                          1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables<br/>
                          2. Agrega <code className="bg-blue-100 px-1 rounded">OPENAI_API_KEY</code> y <code className="bg-blue-100 px-1 rounded">MP_ACCESS_TOKEN</code><br/>
                          3. Haz Redeploy
                        </p>
                      </div>

                      <Link href="/config" className="font-medium text-yellow-800 hover:text-yellow-900 underline">
                        Ver página de configuración →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <UploadForm />
      </div>
    </main>
  );
}
