# Watermark API Configuration

## Environment Variables

For the watermark API to work correctly on Netlify, add this to your Netlify environment variables:

```
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

Or if using a custom domain:

```
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

## Local Development

For local development, the API defaults to `http://localhost:3000` and no environment variable is needed.

## Usage

### Test Page

Visit `http://localhost:3000/watermark-tester` to test the watermark API with a simple UI.

### Direct API Calls

**JavaScript/Frontend:**
```typescript
import { watermarkImage } from '@/lib/watermark-client';

const result = await watermarkImage('/uploads/photo.jpg', 'NQJACK');
if (result.success) {
  console.log(result.message);
} else {
  console.error(result.error);
}
```

**cURL:**
```bash
curl -X POST https://your-site.netlify.app/api/watermark \
  -H "Content-Type: application/json" \
  -d '{"imagePath": "/uploads/photo.jpg", "text": "NQJACK"}'
```

**Fetch:**
```javascript
const response = await fetch('/api/watermark', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imagePath: '/uploads/photo.jpg',
    text: 'NQJACK'
  })
});

const data = await response.json();
console.log(data);
```

## Decap CMS Integration

You can integrate the watermark API with Decap CMS by adding a custom widget or webhook that calls the API after image upload.

Example webhook configuration (add to `public/admin/config.yml`):

```yaml
backend:
  name: git-gateway
  branch: main
  api_root: https://api.github.com
```

Then use a form submission hook or custom media library to call the watermark API when images are uploaded.

## Security Notes

- The API only accepts paths starting with `/uploads/` to prevent unauthorized file access
- Paths containing `..` are rejected to prevent directory traversal attacks
- The API should only run on your own server/domain
- Consider adding authentication if this becomes public
