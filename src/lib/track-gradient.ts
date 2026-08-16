/**
 * Deterministic mesh gradient from a track slug.
 * Aimed at the soft 4-color look of https://meshgradient.in/ —
 * large overlapping ellipses, uneven coverage, vivid but blended.
 */

export type TrackGradient = {
  backgroundImage: string;
  accent: string;
};

function hashSlug(slug: string): number {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32 — enough variety without pulling a dependency. */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function oklch(l: number, c: number, h: number, a = 1) {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
}

export function trackGradient(slug: string): TrackGradient {
  const random = rng(hashSlug(slug));

  // Four hues: a close pair + two distant accents (Meshy-style palette).
  const h0 = random() * 360;
  const h1 = (h0 + 18 + random() * 36) % 360;
  const h2 = (h0 + 110 + random() * 70) % 360;
  const h3 = (h0 + 200 + random() * 80) % 360;
  const hues = [h0, h1, h2, h3];

  // Corner-anchored blooms with uneven coverage (one color usually dominates).
  const anchors = [
    { x: 0 + random() * 28, y: 0 + random() * 28 },
    { x: 72 + random() * 28, y: 0 + random() * 32 },
    { x: 68 + random() * 32, y: 68 + random() * 32 },
    { x: 0 + random() * 32, y: 70 + random() * 30 },
  ];

  const layers = anchors.map((anchor, index) => {
    const hue = hues[index] ?? h0;
    // Coverage bias: first two colors take more area.
    const coverage = index < 2 ? 0.92 + random() * 0.35 : 0.62 + random() * 0.28;
    const rx = Math.round(coverage * (85 + random() * 55));
    const ry = Math.round(coverage * (75 + random() * 55));
    const lightness = 0.58 + random() * 0.28;
    const chroma = 0.14 + random() * 0.12;
    const stop = 48 + Math.round(random() * 18);

    return `radial-gradient(${rx}% ${ry}% at ${anchor.x.toFixed(1)}% ${anchor.y.toFixed(1)}%, ${oklch(lightness, chroma, hue)}, transparent ${stop}%)`;
  });

  // Soft center wash so gaps never fall to flat black.
  const washA = oklch(0.42 + random() * 0.12, 0.08 + random() * 0.06, h2, 0.95);
  const washB = oklch(0.28 + random() * 0.1, 0.06 + random() * 0.05, h0, 1);
  const angle = Math.round(random() * 360);
  layers.push(`linear-gradient(${angle}deg, ${washA}, ${washB})`);

  // Accent for playhead / play button — lightest, punchiest of the close pair.
  const accent = oklch(0.78 + random() * 0.08, 0.16 + random() * 0.08, h1);

  return {
    backgroundImage: layers.join(', '),
    accent,
  };
}
