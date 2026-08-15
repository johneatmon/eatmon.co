import { portraitIconPng } from '~/lib/icons';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  const png = await portraitIconPng(size.width);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
