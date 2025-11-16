#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const WATERMARK_TEXT = process.argv[2] || 'NQJACK';

async function createRepeatingWatermark(width: number, height: number, text: string): Promise<Buffer> {
  // Create a larger SVG to tile the watermark pattern
  const tileSize = 200;
  const tilesX = Math.ceil(width / tileSize) + 2;
  const tilesY = Math.ceil(height / tileSize) + 2;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Create repeating pattern
  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const posX = x * tileSize + 20;
      const posY = y * tileSize + 50;
      
      svg += `
        <g opacity="0.15" transform="rotate(-45 ${posX} ${posY})">
          <text x="${posX}" y="${posY}" font-size="28" fill="black" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${text}</text>
        </g>
      `;
    }
  }
  
  svg += `</svg>`;
  
  return Buffer.from(svg);
}

async function addWatermarkToImage(filePath: string, text: string) {
  try {
    console.log(`Processing: ${filePath}`);
    
    const imageBuffer = await readFile(filePath);
    
    // Get image metadata to create appropriately sized watermark
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;
    
    // Create repeating watermark pattern
    const watermarkSvg = await createRepeatingWatermark(width, height, text);

    // Add watermark to image
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkSvg,
          gravity: 'center' as const
        }
      ])
      .toBuffer();

    // Write back to file
    await writeFile(filePath, watermarkedImage);
    console.log(`✓ Watermarked: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
  }
}

async function watermarkAllImages(text: string) {
  try {
    console.log(`Scanning ${UPLOADS_DIR} for images...`);
    console.log(`Using watermark text: "${text}"\n`);
    
    const files = await readdir(UPLOADS_DIR);
    
    const imageFiles = files.filter(file => 
      SUPPORTED_FORMATS.includes(file.toLowerCase().substring(file.lastIndexOf('.')))
    );

    if (imageFiles.length === 0) {
      console.log('No image files found in uploads folder.');
      return;
    }

    console.log(`Found ${imageFiles.length} image(s) to watermark.\n`);
    
    for (const file of imageFiles) {
      await addWatermarkToImage(join(UPLOADS_DIR, file), text);
    }
    
    console.log(`\n✓ All images watermarked successfully with "${text}"!`);
  } catch (error) {
    console.error('Error scanning uploads directory:', error);
  }
}

watermarkAllImages(WATERMARK_TEXT);
