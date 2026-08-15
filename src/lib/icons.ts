import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import 'server-only';

const portraitPath = join(process.cwd(), 'public/images/me.jpg');

/** Square PNG cropped from the centered portrait. */
export async function portraitIconPng(size: number) {
  const source = await readFile(portraitPath);

  return sharp(source)
    .rotate()
    .resize(size, size, {
      fit: 'cover',
      position: 'centre',
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
