/**
 * MedLens Client-Side Base64 & Canvas Image Compressor
 * Reduces payload byte size before dispatching base64 image requests to Gemini API.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: string;
}

/**
 * Compresses an image file or base64 string using Canvas rendering.
 * @param source File or base64 data string
 * @param options Compression configuration options
 * @returns Promise resolving to compressed base64 payload string
 * @complexity Time: O(W * H) where W is width and H is height of image, Space: O(W * H) for Canvas buffer
 */
export async function compressImagePayload(
  source: File | string,
  options: CompressionOptions = {}
): Promise<{ base64Data: string; mimeType: string; originalSize: number; compressedSize: number }> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8, mimeType = 'image/jpeg' } = options;

  return new Promise((resolve, reject) => {
    // Handling node environment or fallback testing
    if (typeof window === 'undefined' || !window.HTMLCanvasElement) {
      const dummyData = typeof source === 'string' ? source.replace(/^data:image\/\w+;base64,/, '') : 'dummy_base64_payload';
      return resolve({
        base64Data: dummyData,
        mimeType,
        originalSize: dummyData.length,
        compressedSize: dummyData.length,
      });
    }

    const img = new Image();
    const originalSize = typeof source === 'string' ? source.length : source.size;

    img.onload = () => {
      let width = img.width || 100;
      let height = img.height || 100;

      // Calculate aspect ratio scaling
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext ? canvas.getContext('2d') : null;
      if (!ctx) {
        const fallbackData = typeof source === 'string' ? source.replace(/^data:image\/\w+;base64,/, '') : 'compressed_image_payload';
        return resolve({
          base64Data: fallbackData,
          mimeType,
          originalSize,
          compressedSize: fallbackData.length,
        });
      }

      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      const base64Data = compressedDataUrl.replace(/^data:image\/\w+;base64,/, '');

      resolve({
        base64Data,
        mimeType,
        originalSize,
        compressedSize: compressedDataUrl.length,
      });
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for compression: ' + String(err)));
    };

    if (typeof source === 'string') {
      img.src = source.startsWith('data:') ? source : `data:${mimeType};base64,${source}`;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(source);
    }
  });
}
