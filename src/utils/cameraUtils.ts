/**
 * Camera and Document Image Processing Utilities
 */

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type ImageFilterMode = 'enhanced' | 'color' | 'contrast';

/**
 * Gets list of available video input devices
 */
export const getVideoDevices = async (): Promise<CameraDevice[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === 'videoinput')
      .map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${index + 1}`,
      }));
  } catch (err) {
    console.warn('Error enumerating video devices:', err);
    return [];
  }
};

/**
 * Captures the current frame of an HTMLVideoElement into a base64 Data URL
 */
export const captureVideoFrame = (
  video: HTMLVideoElement,
  filter: ImageFilterMode = 'color'
): string => {
  const canvas = document.createElement('canvas');
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw base image
  ctx.drawImage(video, 0, 0, width, height);

  if (filter === 'enhanced') {
    // Document scanner enhancement: increase contrast and slight sharpness
    applyDocumentEnhancement(ctx, width, height);
  } else if (filter === 'contrast') {
    // High-contrast black and white for crisp text
    applyHighContrastBW(ctx, width, height);
  }

  return canvas.toDataURL('image/jpeg', 0.88);
};

/**
 * Applies document enhancement filter (sharp text, shadow removal)
 */
export const applyDocumentEnhancement = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Grayscale & dynamic range stretch
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Luminance
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Contrast stretching (S-curve)
    if (gray > 160) {
      gray = Math.min(255, gray * 1.15);
    } else if (gray < 90) {
      gray = Math.max(0, gray * 0.8);
    }

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);
};

/**
 * Applies crisp high-contrast black & white document filter
 */
export const applyHighContrastBW = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    const threshold = gray > 128 ? 255 : 0;
    data[i] = threshold;
    data[i + 1] = threshold;
    data[i + 2] = threshold;
  }

  ctx.putImageData(imgData, 0, 0);
};

/**
 * Converts a File object (from file picker or drag & drop) to a compressed Data URL
 */
export const processUploadedFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      // If it's a PDF or other file, read as data URL
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1600px to keep storage compact & fast
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
