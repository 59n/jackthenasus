/**
 * Utility to call the watermark API endpoint
 * Works locally and on Netlify
 */

export async function watermarkImage(
  imagePath: string,
  text: string = 'NQJACK'
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get the base URL - works both locally and on production
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/watermark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imagePath,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to watermark image',
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
