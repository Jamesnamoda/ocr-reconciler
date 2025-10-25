FROM node:20-slim

# Tesseract deps
RUN apt-get update && apt-get install -y \
  tesseract-ocr \
  tesseract-ocr-eng \
  tesseract-ocr-spa \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# NO copiar .env* dentro de la imagen; usar variables en runtime
EXPOSE 3000
CMD ["npm", "start"]
