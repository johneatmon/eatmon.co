import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readdir, readFile, rm, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local' });

const ROOT = process.cwd();
const DEFAULT_MUSIC_DIR = join(ROOT, 'music');
const AUDIO_EXTENSIONS = new Set([
  '.wav',
  '.wave',
  '.aiff',
  '.aif',
  '.flac',
  '.m4a',
  '.aac',
  '.ogg',
  '.mp3',
]);

type WaveformJson = {
  sample_rate?: number;
  samples_per_pixel?: number;
  length?: number;
  data?: number[];
};

type TrackStatus = 'finished' | 'unfinished';

type UploadOptions = {
  title?: string;
  slug?: string;
  description: string | null;
  sortOrder: number;
  status: TrackStatus;
  published: boolean;
  keep: boolean;
};

function usage() {
  console.info(`Usage:
  pnpm music:upload
  pnpm music:upload -- --dir ./music
  pnpm music:upload -- --file ./music/sketch.wav [--title "Sketch"] [--slug sketch]
  pnpm music:upload -- --finished --keep

Defaults:
  Ingest every audio file in ./music
  Non-MP3 sources are converted with ffmpeg (libmp3lame -q:a 2)
  Successful uploads delete the source from ./music (use --keep to retain)

Requires: ffmpeg + audiowaveform on PATH, SUPABASE_URL + SUPABASE_SECRET_KEY in .env
`);
}

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i++;
  }
  return args;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function titleFromFilename(filePath: string) {
  return basename(filePath, extname(filePath)).replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function headers(secret: string, contentType?: string) {
  return {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

function runCommand(command: string, args: string[], label: string) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.error) {
    throw new Error(
      `${label} failed to start (${result.error.message}). Install it first (e.g. brew install ${command}).`,
    );
  }
  if (result.status !== 0) {
    throw new Error(`${label} exited ${result.status}: ${result.stderr || result.stdout}`);
  }
}

function runAudiowaveform(inputPath: string, outputPath: string) {
  runCommand(
    'audiowaveform',
    [
      '-i',
      inputPath,
      '-o',
      outputPath,
      '--output-format',
      'json',
      '--pixels-per-second',
      '50',
      '--bits',
      '8',
    ],
    'audiowaveform',
  );
}

function convertToMp3(inputPath: string, outputPath: string) {
  runCommand(
    'ffmpeg',
    ['-y', '-i', inputPath, '-codec:a', 'libmp3lame', '-q:a', '2', outputPath],
    'ffmpeg',
  );
}

function compactPeaks(data: number[], targetPoints = 320): number[] {
  if (data.length === 0) return [];

  const amplitudes: number[] = [];
  for (let i = 0; i < data.length; i += 2) {
    const min = data[i] ?? 0;
    const max = data[i + 1] ?? 0;
    amplitudes.push(Math.max(Math.abs(min), Math.abs(max)));
  }

  if (amplitudes.length <= targetPoints) {
    const peak = Math.max(...amplitudes, 1);
    return amplitudes.map((value) => Number((value / peak).toFixed(4)));
  }

  const bucket = amplitudes.length / targetPoints;
  const condensed: number[] = [];
  for (let i = 0; i < targetPoints; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.floor((i + 1) * bucket);
    let max = 0;
    for (let j = start; j < end; j++) max = Math.max(max, amplitudes[j] ?? 0);
    condensed.push(max);
  }

  const peak = Math.max(...condensed, 1);
  return condensed.map((value) => Number((value / peak).toFixed(4)));
}

function durationFromWaveform(wave: WaveformJson) {
  const sampleRate = wave.sample_rate;
  const spp = wave.samples_per_pixel;
  const length = wave.length;
  if (!sampleRate || !spp || !length) {
    throw new Error('audiowaveform JSON missing sample_rate / samples_per_pixel / length');
  }
  return Number(((length * spp) / sampleRate).toFixed(3));
}

function isInsideMusicDir(filePath: string, musicDir: string) {
  const rel = relative(musicDir, resolve(filePath));
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

async function listAudioFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && AUDIO_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => join(dir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

async function uploadObject(baseUrl: string, secret: string, objectPath: string, body: Buffer) {
  const response = await fetch(`${baseUrl}/storage/v1/object/music/${objectPath}`, {
    method: 'POST',
    headers: {
      ...headers(secret, 'audio/mpeg'),
      'x-upsert': 'true',
    },
    body: new Uint8Array(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Storage upload failed (${response.status}): ${text}`);
  }
}

async function upsertTrack(
  baseUrl: string,
  secret: string,
  track: {
    slug: string;
    title: string;
    description: string | null;
    duration_sec: number;
    peaks: number[];
    audio_path: string;
    sort_order: number;
    status: TrackStatus;
    published: boolean;
  },
) {
  const response = await fetch(`${baseUrl}/rest/v1/tracks?on_conflict=slug`, {
    method: 'POST',
    headers: {
      ...headers(secret, 'application/json'),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      ...track,
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Track upsert failed (${response.status}): ${text}`);
  }

  return (await response.json()) as unknown[];
}

async function ingestFile(
  sourcePath: string,
  supabaseUrl: string,
  secret: string,
  musicDir: string,
  options: UploadOptions,
) {
  const ext = extname(sourcePath).toLowerCase();
  if (!AUDIO_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported audio type: ${ext || '(none)'}`);
  }

  const title = options.title?.trim() || titleFromFilename(sourcePath);
  const slug = options.slug?.trim() ? slugify(options.slug) : slugify(title);
  if (!slug) throw new Error(`Could not derive a valid slug for ${sourcePath}`);

  const workDir = await mkdtemp(join(tmpdir(), 'eatmon-music-'));
  const convertedPath = join(workDir, `${slug}.mp3`);
  const wavePath = join(workDir, `${slug}.json`);
  let mp3Path = sourcePath;

  try {
    if (ext !== '.mp3') {
      console.info(`Converting ${basename(sourcePath)} → mp3…`);
      convertToMp3(sourcePath, convertedPath);
      mp3Path = convertedPath;
    }

    console.info(`Generating waveform for ${basename(mp3Path)}…`);
    runAudiowaveform(mp3Path, wavePath);
    const wave = JSON.parse(await readFile(wavePath, 'utf8')) as WaveformJson;
    if (!Array.isArray(wave.data)) throw new Error('audiowaveform JSON missing data[]');

    const peaks = compactPeaks(wave.data);
    const durationSec = durationFromWaveform(wave);
    const audioBuffer = await readFile(mp3Path);
    const digest = createHash('sha256').update(audioBuffer).digest('hex').slice(0, 12);
    const audioPath = `${slug}/audio-${digest}.mp3`;

    console.info(
      `Uploading ${audioPath} (${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB)…`,
    );
    await uploadObject(supabaseUrl, secret, audioPath, audioBuffer);

    console.info(`Upserting track "${title}" (${slug})…`);
    const rows = await upsertTrack(supabaseUrl, secret, {
      slug,
      title,
      description: options.description,
      duration_sec: durationSec,
      peaks,
      audio_path: audioPath,
      sort_order: options.sortOrder,
      status: options.status,
      published: options.published,
    });

    if (!options.keep && isInsideMusicDir(sourcePath, musicDir)) {
      await unlink(sourcePath);
      console.info(`Deleted ${relative(ROOT, sourcePath)}`);
    }

    console.info('Done.', {
      slug,
      durationSec,
      peaks: peaks.length,
      status: options.status,
      published: options.published,
      id:
        Array.isArray(rows) && rows[0] && typeof rows[0] === 'object' && 'id' in rows[0]
          ? (rows[0] as { id: string }).id
          : undefined,
    });
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    usage();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secret) {
    throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required');
  }

  const musicDir =
    typeof args.dir === 'string' && args.dir.trim() ? resolve(args.dir.trim()) : DEFAULT_MUSIC_DIR;

  const description =
    typeof args.description === 'string' && args.description.trim()
      ? args.description.trim()
      : null;
  const sortOrder =
    typeof args.sort === 'string' && args.sort.trim() ? Number.parseInt(args.sort, 10) : 0;
  if (!Number.isFinite(sortOrder)) throw new Error('Invalid --sort');

  let status: TrackStatus = 'unfinished';
  if (args.finished === true) status = 'finished';
  if (typeof args.status === 'string') {
    const normalized = args.status.trim().toLowerCase();
    if (normalized !== 'finished' && normalized !== 'unfinished') {
      throw new Error('--status must be finished or unfinished');
    }
    status = normalized;
  }

  const options: UploadOptions = {
    title: typeof args.title === 'string' ? args.title : undefined,
    slug: typeof args.slug === 'string' ? args.slug : undefined,
    description,
    sortOrder,
    status,
    published: args.draft !== true,
    keep: args.keep === true,
  };

  if (typeof args.file === 'string' && args.file.trim()) {
    await ingestFile(resolve(args.file.trim()), supabaseUrl, secret, musicDir, options);
    return;
  }

  const files = await listAudioFiles(musicDir);
  if (files.length === 0) {
    console.info(`No audio files found in ${relative(ROOT, musicDir) || musicDir}`);
    return;
  }

  console.info(
    `Ingesting ${files.length} file${files.length === 1 ? '' : 's'} from ${relative(ROOT, musicDir) || musicDir}…`,
  );

  const failures: { file: string; error: string }[] = [];
  for (const file of files) {
    try {
      console.info(`\n→ ${basename(file)}`);
      await ingestFile(file, supabaseUrl, secret, musicDir, {
        ...options,
        // Per-file title/slug only make sense for --file; batch uses filenames.
        title: undefined,
        slug: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed ${basename(file)}: ${message}`);
      failures.push({ file: basename(file), error: message });
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} file${failures.length === 1 ? '' : 's'} failed.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  usage();
  process.exit(1);
});
