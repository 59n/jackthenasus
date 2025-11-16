'use client';

import { useState } from 'react';
import { watermarkImage } from '@/lib/watermark-client';

export default function WatermarkTester() {
  const [imagePath, setImagePath] = useState('/uploads/');
  const [watermarkText, setWatermarkText] = useState('NQJACK');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleWatermark = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const response = await watermarkImage(imagePath, watermarkText);
    setResult(response);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🎨 Image Watermark API Tester</h1>
      
      <form onSubmit={handleWatermark}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="imagePath" style={{ display: 'block', marginBottom: '5px' }}>
            Image Path (must start with /uploads/):
          </label>
          <input
            id="imagePath"
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="/uploads/image.jpg"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="watermarkText" style={{ display: 'block', marginBottom: '5px' }}>
            Watermark Text:
          </label>
          <input
            id="watermarkText"
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="NQJACK"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Watermarking...' : 'Apply Watermark'}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${result.success ? '#4caf50' : '#f44336'}`,
            borderRadius: '4px',
            color: result.success ? '#2e7d32' : '#c62828',
          }}
        >
          <strong>{result.success ? '✓ Success!' : '✗ Error'}</strong>
          <p>{result.message || result.error}</p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>📚 API Documentation</h3>
        <p>
          <strong>Endpoint:</strong> <code>POST /api/watermark</code>
        </p>
        <p>
          <strong>Request Body:</strong>
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "imagePath": "/uploads/202508261486_j4oqcEeY.png",
  "text": "NQJACK"
}`}
        </pre>
        <p>
          <strong>Important:</strong> The imagePath must be a complete file path (not just a directory) with a supported image extension (.jpg, .jpeg, .png, .webp, or .gif).
        </p>
        <p>
          <strong>Response:</strong>
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "success": true,
  "message": "Watermark 'NQJACK' added to /uploads/202508261486_j4oqcEeY.png"
}`}
        </pre>
        <p>
          <strong>Using from JavaScript/Frontend:</strong>
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`import { watermarkImage } from '@/lib/watermark-client';

await watermarkImage('/uploads/photo.jpg', 'NQJACK');`}
        </pre>
        <p>
          <strong>Using cURL:</strong>
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`curl -X POST https://yoursite.com/api/watermark \\
  -H "Content-Type: application/json" \\
  -d '{"imagePath": "/uploads/202508261486_j4oqcEeY.png", "text": "NQJACK"}'`}
        </pre>
      </div>
    </div>
  );
}
