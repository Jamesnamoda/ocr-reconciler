import Tesseract from "tesseract.js";
import sharp from "sharp";

export async function runOCR(buffer: Buffer) {
  // Normaliza la imagen a PNG en escala de grises para mejorar OCR
  const normalized = await sharp(buffer)
    .png()
    .grayscale()
    .normalize()
    .toBuffer();

  const { data } = await Tesseract.recognize(normalized, "spa+eng", {
    logger: m => console.log(m)
  });

  return (data.text || "").trim();
}
