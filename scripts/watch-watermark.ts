#!/usr/bin/env node

import sharp from 'sharp';
import { readFile, writeFile, access } from 'fs/promises';
import { watch } from 'fs';
import { join } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const WATERMARK_TEXT = 'NQJACK';
const WATERMARK_TIMEOUT = 2000; // Wait 2 seconds after file creation before watermarking
const processedFiles = new Set<string>();

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

async function watermarkFile(filePath: string) {
  try {
    // Check if file exists and is fully written
    await access(filePath);
    
    const fileName = filePath.split('/').pop() || '';
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    // Only process supported formats
    if (!SUPPORTED_FORMATS.includes(ext)) {
      return;
    }

    // Skip if already processed
    if (processedFiles.has(filePath)) {
      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] Watermarking: ${fileName}`);
    
    const imageBuffer = await readFile(filePath);
    
    // Get image metadata to create appropriately sized watermark
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;

    // Create repeating watermark pattern
    const watermarkSvg = await createRepeatingWatermark(width, height, WATERMARK_TEXT);

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
    
    processedFiles.add(filePath);
    console.log(`✓ Watermarked: ${fileName}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`✗ Error watermarking ${filePath}:`, error);
    }
  }
}

async function startWatcher() {
  try {
    console.log(`🔍 Watching ${UPLOADS_DIR} for new images...`);
    console.log(`📝 Using watermark text: "${WATERMARK_TEXT}"\n`);
    
    const watcher = watch(UPLOADS_DIR, { persistent: true }, (eventType: string, filename: string | null) => {
      if (filename && (eventType === 'add' || eventType === 'change')) {
        const filePath = join(UPLOADS_DIR, filename);
        
        // Wait a bit to ensure file is fully written
        setTimeout(() => {
          watermarkFile(filePath);
        }, WATERMARK_TIMEOUT);
      }
    });

    process.on('SIGINT', () => {
      console.log('\n👋 Watcher stopped');
      watcher.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting watcher:', error);
    process.exit(1);
  }
}

startWatcher();
