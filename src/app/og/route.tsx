import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Avoid require.resolve — Next's bundler rewrites it to a numeric module id.
const soehneRoot = join(process.cwd(), 'node_modules/@johneatmon/soehne');

async function soehneBuchOtF() {
  const otfDir = join(soehneRoot, 'files/otf');
  const files = await readdir(otfDir);
  const buch = files.find((name) => /Buch\.otf$/u.test(name) && !/Kursiv/u.test(name));
  if (!buch) throw new Error('Söhne Buch OTF not found in @johneatmon/soehne');
  return readFile(join(otfDir, buch));
}

const soehneBuch = soehneBuchOtF();
const portrait = readFile(join(process.cwd(), 'public/images/me.jpg'));

const AVATAR_SIZE = 120;
const MAX_TITLE_LENGTH = 200;

async function avatarDataUrl() {
  const png = await sharp(await portrait)
    .rotate()
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'centre' })
    .grayscale()
    .png()
    .toBuffer();

  return `data:image/png;base64,${png.toString('base64')}`;
}

function normalizeTitle(value: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === 'John Eatmon') return null;
  if (trimmed.length <= MAX_TITLE_LENGTH) return trimmed;
  return `${trimmed.slice(0, MAX_TITLE_LENGTH - 1)}…`;
}

function headlineSize(isDefault: boolean, title: string) {
  if (isDefault) return 152;
  if (title.length > 100) return 68;
  if (title.length > 70) return 80;
  if (title.length > 40) return 96;
  return 112;
}

export async function GET(req: NextRequest) {
  const titleParam = normalizeTitle(req.nextUrl.searchParams.get('title'));
  const isDefault = !titleParam;

  const headline = isDefault ? 'John Eatmon' : titleParam;
  const subline = isDefault ? 'Software Engineer · Seattle, WA' : 'John Eatmon';
  const size = headlineSize(isDefault, headline);

  const [fontData, avatar] = await Promise.all([soehneBuch, avatarDataUrl()]);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: 'linear-gradient(145deg, #050505 0%, #121212 48%, #1f1f1f 100%)',
        color: '#f0eee8',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 56,
          right: 72,
          fontSize: 28,
          fontFamily: 'Soehne',
          letterSpacing: '-0.02em',
          color: '#8a8780',
        }}
      >
        eatmon.co
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, width: '100%' }}>
          {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse requires <img> */}
          <img
            src={avatar}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            alt=""
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: 9999,
              objectFit: 'cover',
              border: '2px solid #2a2a2a',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%' }}>
            <div
              style={{
                display: 'flex',
                fontSize: size,
                fontFamily: 'Soehne',
                fontWeight: 400,
                letterSpacing: '-0.05em',
                lineHeight: 1.02,
                width: '100%',
              }}
            >
              {headline}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 42,
                fontFamily: 'Soehne',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#b0aca4',
              }}
            >
              {subline}
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Soehne',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
