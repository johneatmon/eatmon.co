import { portraitIconPng } from '~/lib/icons';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const png = await portraitIconPng(size.width);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
