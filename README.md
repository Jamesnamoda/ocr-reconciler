# OCR Reconciler

Una aplicación full-stack construida con Next.js que permite subir imágenes de transferencias bancarias, extraer texto mediante OCR (Tesseract), parsear la información con GPT, y buscar coincidencias en Mercado Pago.

## Características

- **OCR**: Extracción de texto de imágenes usando Tesseract.js
- **IA**: Parseo estructurado de datos con OpenAI GPT
- **Integración**: Búsqueda automática en Mercado Pago API
- **Validación de Depósitos**: Filtra y valida solo transferencias de dinero contra tickets
- **Scoring**: Algoritmo de coincidencias con puntuación inteligente
- **Docker**: Containerización completa para deployment

## Stack Tecnológico

- **Frontend/Backend**: Next.js 14+ (App Router) con TypeScript
- **OCR**: tesseract.js + sharp para procesamiento de imágenes
- **IA**: OpenAI GPT-4o-mini para parseo de texto
- **API**: Mercado Pago REST API
- **Validación**: Zod para esquemas de datos
- **Deployment**: Docker + docker-compose

## Configuración Inicial

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y completa las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus claves reales.

**Obtener MP_ACCESS_TOKEN:**
1. Ve a https://www.mercadopago.com.ar/developers
2. Inicia sesión con tu cuenta de Mercado Pago
3. Ve a "Tus integraciones" > Crea/selecciona una aplicación
4. Ve a "Credenciales" y copia el Access Token:
   - **Pruebas**: `TEST-xxxx...` (Sandbox)
   - **Producción**: `APP_USR-xxxx...` (Real)

```env
OPENAI_API_KEY=tu_clave_openai_aqui
MP_ACCESS_TOKEN=APP_USR-tu_token_aqui
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

1. **Subir Imagen**: Selecciona una imagen de transferencia/comprobante
2. **Procesamiento**: La app ejecuta OCR y parseo con GPT automáticamente
3. **Validación**: Se buscan coincidencias en Mercado Pago filtrando solo transferencias de dinero (`money_transfer`) dentro de ±3 días
4. **Resultados**: Se muestran las coincidencias ordenadas por score

**Nota**: La app valida depósitos de la cuenta de Mercado Pago asociada al `MP_ACCESS_TOKEN` configurado.

## Deployment con Docker

### Desarrollo

```bash
docker compose up --build
```

### Producción

```bash
# Configurar variables de entorno
export OPENAI_API_KEY="tu_clave"
export MP_ACCESS_TOKEN="tu_token"

# Ejecutar
docker compose up -d
```

## Estructura del Proyecto

```
├─ app/
│  ├─ page.tsx                 # Página principal
│  ├─ layout.tsx               # Layout de la app
│  ├─ globals.css              # Estilos globales
│  └─ api/
│     ├─ health/route.ts       # Health check
│     ├─ upload/route.ts       # Endpoint principal de procesamiento
│     └─ mp-webhook/route.ts   # Webhook de Mercado Pago
├─ components/
│  ├─ UploadForm.tsx           # Formulario de subida
│  └─ Results.tsx              # Visualización de resultados
├─ lib/
│  ├─ config.ts                # Configuración y validación de env vars
│  ├─ ocr.ts                   # Funciones de OCR con Tesseract
│  ├─ gpt.ts                   # Integración con OpenAI
│  ├─ mercadopago.ts           # API de Mercado Pago
│  └─ matching.ts              # Algoritmo de scoring
├─ types/
│  └─ index.ts                 # Definiciones de TypeScript
└─ public/
    └─ logo.svg                # Logo de la aplicación
```

## API Endpoints

### POST /api/upload

Procesa una imagen y devuelve coincidencias:

**Request**: `multipart/form-data` con campo `file`

**Response**:
```json
{
  "ocrText": "texto extraído...",
  "parsed": {
    "amount": 15000.50,
    "currency": "ARS",
    "date": "2024-01-15",
    "payer_name": "Juan Pérez",
    "reference": "REF123",
    "notes": "Transferencia",
    "taxpayer_id": "20123456789"
  },
  "candidates": [
    {
      "id": 123456789,
      "status": "approved",
      "date_created": "2024-01-15T10:30:00Z",
      "amount": 15000.50,
      "currency": "ARS",
      "score": 95,
      "external_reference": "REF123"
    }
  ]
}
```

### GET /api/health

Health check endpoint.

### POST /api/mp-webhook

Webhook stub para Mercado Pago (implementación futura).

## Algoritmo de Scoring

El sistema calcula coincidencias basándose en:

- **Monto** (30 puntos): Coincidencia exacta o ±0.5%
- **Referencia** (40 puntos): Coincidencia exacta o parcial
- **Fecha** (20 puntos): Misma fecha o ±3 días
- **Nombre** (10 puntos): Coincidencia de nombre del pagador

## Limitaciones y Consideraciones

- **Tamaño máximo**: 10MB por archivo
- **Formatos**: PNG, JPG, JPEG, WebP, PDF
- **Idiomas OCR**: Español + Inglés
- **Ventana de búsqueda**: ±3 días desde la fecha detectada
- **Límite MP**: 50 resultados por búsqueda
- **Tipo de operación**: Solo se validan transferencias de dinero (`money_transfer`), excluyendo otros tipos de pagos

## Seguridad

- Variables de entorno nunca commiteadas
- Validación de tipos con Zod
- Límites de tamaño de archivo
- Sanitización de inputs

## Próximas Mejoras

- [ ] OAuth con Mercado Pago para acceso a terceros
- [ ] Webhooks reales de Mercado Pago
- [ ] Historial de reconciliaciones
- [ ] Exportación de reportes
- [ ] Soporte para múltiples monedas
- [ ] Dashboard de estadísticas

## Troubleshooting

### Error de OCR
- Verifica que la imagen sea clara y legible
- Asegúrate de que Tesseract esté instalado correctamente

### Error de OpenAI
- Verifica tu API key en `.env.local`
- Confirma que tienes créditos disponibles

### Error de Mercado Pago
- Verifica tu access token en `.env.local`
- Confirma que estás usando el ambiente correcto (sandbox/prod)
- Asegúrate de que el token tenga permisos de lectura (`read`)
- Si usas Sandbox (TEST-), verifica que tengas transacciones de prueba para testear

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
