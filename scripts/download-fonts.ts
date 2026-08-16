import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';

type FontAsset = {
  name: string;
  format: 'woff' | 'woff2';
  url: string;
  sha256: string;
};

// Open-licensed mono only. Söhne ships via @johneatmon/soehne (GitHub Packages).
const fonts: FontAsset[] = [
  {
    name: 'server_mono',
    format: 'woff2',
    url: 'https://raw.githubusercontent.com/internet-development/www-server-mono/6bc61da4baac3add9091662f94505efab7196b6f/public/fonts/ServerMono-Regular.woff2',
    sha256: 'c74e05898f847685947256c1143343e5858f71225d1b7fcfdaabe02a6afd8df1',
  },
  {
    name: 'server_mono_oblique',
    format: 'woff2',
    url: 'https://raw.githubusercontent.com/internet-development/www-server-mono/6bc61da4baac3add9091662f94505efab7196b6f/public/fonts/ServerMono-RegularOblique.woff2',
    sha256: '657a8ee2d726dd1ba2f331c163ad21fdb58682736b23dc12566064d7b7262b32',
  },
];

function sha256(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function downloadFont(font: FontAsset) {
  await mkdir('./public/fonts', { recursive: true, mode: 0o755 });

  const path = `./public/fonts/${font.name}.${font.format}`;

  if (existsSync(path)) {
    const existing = await readFile(path);

    if (sha256(existing) === font.sha256)
      return console.info(`${font.name} already exists (hash ok)`);

    console.warn(`${font.name} exists but hash mismatch; re-downloading`);
  }

  const response = await fetch(font.url);

  if (!response.ok) throw new Error(`Failed to download ${font.name}: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const digest = sha256(buffer);

  if (digest !== font.sha256)
    throw new Error(`Hash mismatch for ${font.name}: expected ${font.sha256}, got ${digest}`);

  await writeFile(path, buffer, { mode: 0o644 });
  await chmod(path, 0o644);
  console.info(`Downloaded ${font.name}`);
}

async function main() {
  try {
    await Promise.all(fonts.map(downloadFont));
    console.info('Fonts downloaded successfully');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

void main();
