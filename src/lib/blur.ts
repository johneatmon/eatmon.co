import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import 'server-only';

async function toBlurDataURL(buffer: Buffer) {
  const image = sharp(buffer).resize(8, 8, { fit: 'inside' });
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // Tiny SVG placeholder approximating the image average color
  const pixels = data.length / 4;
  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  r = Math.round(r / pixels);
  g = Math.round(g / pixels);
  b = Math.round(b / pixels);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${info.width} ${info.height}"><filter id="b"><feGaussianBlur stdDeviation="1"/></filter><rect width="100%" height="100%" fill="rgb(${r},${g},${b})" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function getBlurDataURL(src: string) {
  try {
    if (src.startsWith('http')) {
      const response = await fetch(src);
      if (!response.ok) return undefined;
      const buffer = Buffer.from(await response.arrayBuffer());
      return toBlurDataURL(buffer);
    }

    const file = await fs.readFile(path.join(process.cwd(), 'public', src));
    return toBlurDataURL(file);
  } catch {
    return undefined;
  }
}
