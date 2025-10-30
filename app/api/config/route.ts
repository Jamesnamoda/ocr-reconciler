import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { openai_key, mp_token } = body;

    if (!openai_key && !mp_token) {
      return NextResponse.json(
        { error: "Al menos una clave es requerida" },
        { status: 400 }
      );
    }

    // Crear contenido del archivo .env.local
    let envContent = "";
    
    // Leer el .env.local existente si existe
    const envPath = path.join(process.cwd(), ".env.local");
    try {
      const existingContent = await fs.readFile(envPath, "utf-8");
      envContent = existingContent;
    } catch (err) {
      // Si no existe, empezamos desde cero
      envContent = "";
    }

    // Actualizar o agregar OPENAI_API_KEY
    if (openai_key) {
      if (envContent.includes("OPENAI_API_KEY=")) {
        envContent = envContent.replace(
          /OPENAI_API_KEY=.*/g,
          `OPENAI_API_KEY=${openai_key.trim()}`
        );
      } else {
        envContent += `\nOPENAI_API_KEY=${openai_key.trim()}`;
      }
    }

    // Actualizar o agregar MP_ACCESS_TOKEN
    if (mp_token) {
      if (envContent.includes("MP_ACCESS_TOKEN=")) {
        envContent = envContent.replace(
          /MP_ACCESS_TOKEN=.*/g,
          `MP_ACCESS_TOKEN=${mp_token.trim()}`
        );
      } else {
        envContent += `\nMP_ACCESS_TOKEN=${mp_token.trim()}`;
      }
    }

    // Escribir el archivo .env.local
    await fs.writeFile(envPath, envContent.trim() + "\n", "utf-8");

    return NextResponse.json({
      success: true,
      message: "Claves guardadas correctamente en .env.local",
    });
  } catch (err: any) {
    console.error("Error saving config:", err);
    return NextResponse.json(
      { error: err.message || "Error al guardar configuración" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    
    try {
      const envContent = await fs.readFile(envPath, "utf-8");
      
      // Extraer los valores
      const openaiMatch = envContent.match(/^OPENAI_API_KEY=(.*)$/m);
      const mpMatch = envContent.match(/^MP_ACCESS_TOKEN=(.*)$/m);
      
      return NextResponse.json({
        openai_key: openaiMatch ? openaiMatch[1] : null,
        mp_token: mpMatch ? mpMatch[1] : null,
      });
    } catch (err) {
      return NextResponse.json({
        openai_key: null,
        mp_token: null,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

