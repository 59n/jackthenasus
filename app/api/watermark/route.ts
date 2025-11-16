import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

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

export async function POST(request: NextRequest) {
  try {
    const { imagePath, text = 'NQJACK' } = await request.json();
    
    if (!imagePath) {
      return NextResponse.json({ error: 'imagePath is required' }, { status: 400 });
    }

    // Security: only allow paths in public/uploads/
    if (!imagePath.startsWith('/uploads/') || imagePath.includes('..')) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 403 });
    }

    // Validate that imagePath is a file, not a directory
    if (imagePath.endsWith('/')) {
      return NextResponse.json({ error: 'imagePath must be a file, not a directory' }, { status: 400 });
    }

    // Validate that it's an image file
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = supportedExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));
    if (!hasValidExtension) {
      return NextResponse.json({ error: 'Only image files are supported (jpg, jpeg, png, webp, gif)' }, { status: 400 });
    }

    const fullPath = join(process.cwd(), 'public', imagePath);
    
    // Read the original image
    const imageBuffer = await readFile(fullPath);
    
    // Get image metadata to create appropriately sized watermark
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;

    // Create repeating watermark pattern
    const watermarkSvg = await createRepeatingWatermark(width, height, text);

    // Process image with watermark
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkSvg,
          gravity: 'center' as const
        }
      ])
      .toBuffer();

    // Write the watermarked image back
    await writeFile(fullPath, watermarkedImage);

    return NextResponse.json({ 
      success: true, 
      message: `Watermark "${text}" added to ${imagePath}` 
    });
  } catch (error) {
    console.error('Watermark error:', error);
    return NextResponse.json(
      { error: 'Failed to add watermark' },
      { status: 500 }
    );
  }
}
