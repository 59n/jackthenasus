# Watermarking Setup

This project includes automatic watermarking for uploaded images with the "NQJACK" text repeated diagonally across the image.

## Usage

### Option 1: Batch Watermark All Existing Images
Watermark all images in `public/uploads/` at once:

```bash
npm run watermark
```

To use a custom watermark text:
```bash
npm run watermark "CUSTOM TEXT"
```

### Option 2: Auto-Watermark on Upload (Recommended)
Run the watcher to automatically watermark images as they're uploaded via the admin panel or file system:

```bash
npm run watermark:watch
```

This will:
- Monitor the `public/uploads/` directory for new files
- Automatically apply the watermark when images are added
- Work seamlessly with Decap CMS uploads
- Show timestamps of watermarked images

Run this in a separate terminal alongside your dev server:
```bash
# Terminal 1
npm run dev

# Terminal 2 (new)
npm run watermark:watch
```

### Option 3: API Endpoint
Watermark a single image via API:

```bash
curl -X POST http://localhost:3000/api/watermark \
  -H "Content-Type: application/json" \
  -d '{"imagePath": "/uploads/image.jpg", "text": "NQJACK"}'
```

## Watermark Customization

The watermark is applied with these characteristics:
- **Text**: "NQJACK" (default, customizable)
- **Pattern**: Diagonal repeating text across the entire image
- **Opacity**: 15% (subtle but visible)
- **Angle**: -45 degrees (diagonal)
- **Color**: Black text
- **Font**: Arial, bold, 28px

To change the default watermark text, edit the `WATERMARK_TEXT` constant in:
- `scripts/watermark-uploads.ts` (line 8)
- `scripts/watch-watermark.ts` (line 13)

Or pass custom text as a command-line argument:
```bash
npm run watermark "YOUR TEXT HERE"
```

## How It Works

1. **Sharp Library**: Uses the `sharp` image processing library to manipulate images
2. **SVG Watermark**: Generates an SVG pattern with repeated text
3. **Composite**: Overlays the watermark onto the original image
4. **In-Place Processing**: Replaces the original file with the watermarked version

## Integration with Decap CMS

The watermark system works automatically when:
- Files are uploaded through the Decap CMS admin panel at `/admin/`
- Files are added to `public/uploads/` via any other method
- Simply run `npm run watermark:watch` in a separate terminal

## Files

- `scripts/watermark-uploads.ts` - Batch watermark script
- `scripts/watch-watermark.ts` - File watcher for auto-watermarking
- `app/api/watermark/route.ts` - API endpoint for on-demand watermarking
- `package.json` - npm scripts configuration

## Security Note

- Watermarks are baked into the image file itself
- Users cannot remove the watermark by right-clicking and opening in a new tab
- The watermark is permanent and travels with the image
