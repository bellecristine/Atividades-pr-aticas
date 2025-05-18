const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Simula o conteúdo de um evento S3 (exemplo: evento de upload)
const event = require('./s3-event.json');

// Configurações locais
const INPUT_BUCKET = './input';
const OUTPUT_BUCKET = './output';
const METADATA_FILE = './metadata.json';

async function handler(event) {
  const record = event.Records[0];
  const key = record.s3.object.key;

  // Lê imagem local simulando o S3
  const imagePath = path.join(INPUT_BUCKET, key);
  const imageBuffer = fs.readFileSync(imagePath);

  const metadata = await sharp(imageBuffer).metadata();

  // Redimensiona e salva versões
  const sizes = [200, 500, 1000];
  for (const size of sizes) {
    const resized = await sharp(imageBuffer).resize(size).toBuffer();
    fs.writeFileSync(`${OUTPUT_BUCKET}/${size}-${key}`, resized);
  }

  // Gera thumbnail se largura for maior que 1024px
  if (metadata.width > 1024) {
    const thumb = await sharp(imageBuffer).resize(150).toBuffer();
    fs.writeFileSync(`${OUTPUT_BUCKET}/thumb-${key}`, thumb);
  }

  // Armazena metadados em arquivo JSON simulando DynamoDB
  const metaDataObject = {
    imagemId: key,
    tipo: metadata.format,
    largura: metadata.width,
    altura: metadata.height,
    tamanho: imageBuffer.length,
    versoes: ['thumb', ...sizes.map(s => `${s}px`)]
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metaDataObject, null, 2));
  console.log("Processamento concluído ✅");
}

// Executa
handler(event);
