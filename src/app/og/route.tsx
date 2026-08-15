import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 10;

const uncutSansRegular = readFile(join(process.cwd(), 'public/fonts/uncut_sans_regular.woff'));
const portrait = readFile(join(process.cwd(), 'public/images/me.jpg'));

const AVATAR_SIZE = 148;
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

export async function GET(req: NextRequest) {
  const titleParam = normalizeTitle(req.nextUrl.searchParams.get('title'));
  const isDefault = !titleParam;

  const headline = isDefault ? 'John Eatmon' : titleParam;
  const subline = isDefault ? 'Software Engineer · Seattle, WA' : 'John Eatmon · eatmon.co';

  const [fontData, avatar] = await Promise.all([uncutSansRegular, avatarDataUrl()]);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 80,
        alignItems: 'flex-end',
        backgroundImage: 'linear-gradient(105deg, #000000 0%, #141414 55%, #2a2a2a 100%)',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          maxWidth: 1040,
        }}
      >
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
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              fontSize: isDefault ? 56 : 48,
              fontFamily: 'Uncut Sans',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1.12,
              maxWidth: 820,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontFamily: 'Uncut Sans',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: '#a1a1aa',
            }}
          >
            {subline}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Uncut Sans',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
