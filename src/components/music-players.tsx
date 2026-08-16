'use client';

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { ReactionResult, Track } from '~/lib/music';
import { trackGradient } from '~/lib/track-gradient';
import { cn } from '~/lib/utils';

const HEARTS_STORAGE_KEY = 'eatmon:music-hearts';
const UPVOTE_STORAGE_KEY = 'eatmon:music-upvote';
const VOLUME_STORAGE_KEY = 'eatmon:music-volume';
const PLAY_SESSION_PREFIX = 'played:music:';
const DEFAULT_VOLUME = 0.8;
const TRACK_PLAYS = process.env.NODE_ENV === 'production';

type MusicLibraryProps = {
  finished: Track[];
  unfinished: Track[];
};

type ReactionMode = 'heart' | 'upvote';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function readHeartedSlugs(): Set<string> {
  try {
    const raw = window.localStorage.getItem(HEARTS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((entry): entry is string => typeof entry === 'string'));
  } catch {
    return new Set();
  }
}

function writeHeartedSlugs(slugs: Set<string>) {
  try {
    window.localStorage.setItem(HEARTS_STORAGE_KEY, JSON.stringify([...slugs]));
  } catch {
    // Best-effort client guard.
  }
}

function readUpvoteSlug(): string | null {
  try {
    const raw = window.localStorage.getItem(UPVOTE_STORAGE_KEY);
    return typeof raw === 'string' && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function writeUpvoteSlug(slug: string | null) {
  try {
    if (slug) window.localStorage.setItem(UPVOTE_STORAGE_KEY, slug);
    else window.localStorage.removeItem(UPVOTE_STORAGE_KEY);
  } catch {
    // Best-effort client guard.
  }
}

function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: number[],
  progress: number,
  accent: string,
  ink: string,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0 || peaks.length === 0) return;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // Baseline sits low so the lower band reads as a reflection, not a mirror.
  const baseline = height * 0.68;
  // Aim for ~2.5px bars + gap so bars read thicker without re-ingesting peaks.
  const gap = width > 640 ? 2 : 1.5;
  const targetBars = Math.max(48, Math.min(peaks.length, Math.floor(width / (gap + 2.5))));
  const step = width / targetBars;
  const barWidth = Math.max(1.5, step - gap);
  const progressX = progress * width;
  const bucket = peaks.length / targetBars;

  for (let i = 0; i < targetBars; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.floor((i + 1) * bucket);
    let amp = 0;
    for (let j = start; j < end; j++) amp = Math.max(amp, peaks[j] ?? 0);
    amp = Math.max(0.05, amp);

    const x = i * step;
    const played = x + barWidth <= progressX;
    const topHeight = amp * baseline * 0.94;
    const reflectionHeight = amp * (height - baseline) * 0.88;

    ctx.fillStyle = played ? accent : ink;

    // Unplayed bars need enough alpha to read on the light canvas too.
    ctx.globalAlpha = played ? 1 : 0.55;
    ctx.fillRect(x, baseline - topHeight, barWidth, topHeight);

    ctx.globalAlpha = played ? 0.48 : 0.32;
    ctx.fillRect(x, baseline + 1, barWidth, reflectionHeight);
  }

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = ink;
  ctx.fillRect(0, baseline, width, 1);
  ctx.globalAlpha = 1;
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      {playing ? (
        <>
          <rect x="7.5" y="5.5" width="3.5" height="13" rx="0.4" />
          <rect x="13" y="5.5" width="3.5" height="13" rx="0.4" />
        </>
      ) : (
        <path d="M8.6 5.4v13.2a.5.5 0 0 0 .77.42l10.1-6.6a.5.5 0 0 0 0-.84L9.37 4.98a.5.5 0 0 0-.77.42Z" />
      )}
    </svg>
  );
}

function HeartGlyph({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-3.5 stroke-current stroke-[1.6]', filled ? 'fill-current' : 'fill-none')}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.2S3.8 15.4 3.8 9.6a4.4 4.4 0 0 1 8.2-2.2 4.4 4.4 0 0 1 8.2 2.2c0 5.8-8.2 10.6-8.2 10.6Z" />
    </svg>
  );
}

function UpvoteGlyph({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-3.5 stroke-current stroke-[1.7]', filled ? 'fill-current' : 'fill-none')}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V7" />
      <path d="m7 11 5-5 5 5" />
    </svg>
  );
}

function PlaysGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-current">
      <path d="M8.6 5.4v13.2a.5.5 0 0 0 .77.42l10.1-6.6a.5.5 0 0 0 0-.84L9.37 4.98a.5.5 0 0 0-.77.42Z" />
    </svg>
  );
}

function VolumeGlyph({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3.5 fill-none stroke-current stroke-[1.6]"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" />
      {muted ? (
        <>
          <path d="m16.5 9.5 4 5" />
          <path d="m20.5 9.5-4 5" />
        </>
      ) : (
        <>
          <path d="M15.8 9.4a3.6 3.6 0 0 1 0 5.2" />
          <path d="M18.4 7.2a7 7 0 0 1 0 9.6" />
        </>
      )}
    </svg>
  );
}

function NowPlayingDock({
  track,
  playing,
  currentTime,
  duration,
  volume,
  muted,
  onToggle,
  onSeekRatio,
  onVolumeChange,
  onToggleMute,
}: {
  track: Track;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  onToggle: () => void;
  onSeekRatio: (ratio: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
}) {
  const gradient = trackGradient(track.slug);
  const progress = duration > 0 ? currentTime / duration : 0;
  const scrubberRef = useRef<HTMLDivElement | null>(null);

  const seekFromClientX = (clientX: number) => {
    const el = scrubberRef.current;
    if (!el || duration <= 0) return;
    const rect = el.getBoundingClientRect();
    onSeekRatio(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-50 border-t border-(--border) bg-[color-mix(in_oklab,var(--background)_72%,transparent)] shadow-[0_-12px_40px_color-mix(in_oklab,black_35%,transparent)] backdrop-blur-xl backdrop-saturate-150"
      aria-label="Now playing"
    >
      <div
        ref={scrubberRef}
        role="slider"
        tabIndex={0}
        aria-label={`${track.title} timeline`}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        className="group relative h-3 w-full cursor-pointer touch-none"
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekFromClientX(event.clientX);
        }}
        onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          seekFromClientX(event.clientX);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            onSeekRatio(Math.min(1, progress + 5 / Math.max(duration, 1)));
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            onSeekRatio(Math.max(0, progress - 5 / Math.max(duration, 1)));
          }
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)]" />
        <div
          className="absolute top-1/2 left-0 h-px -translate-y-1/2"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: gradient.accent,
          }}
        />
        <div
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            left: `${progress * 100}%`,
            backgroundColor: gradient.accent,
          }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-5 py-3 sm:gap-5 sm:px-8">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-200',
            playing
              ? 'border-transparent text-black'
              : 'border-(--border) text-(--foreground) hover:border-[color-mix(in_oklab,var(--foreground)_45%,transparent)]',
          )}
          style={playing ? { backgroundColor: gradient.accent } : undefined}
        >
          <PlayGlyph playing={playing} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm tracking-[-0.015em]">{track.title}</p>
          <p className="mt-0.5 font-mono text-[11px] text-(--muted) tabular-nums">
            {formatTime(currentTime)}
            <span className="mx-1.5 text-[color-mix(in_oklab,var(--muted)_55%,transparent)]">
              /
            </span>
            {formatTime(duration)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="link-fade text-(--muted) hover:text-(--foreground)"
          >
            <VolumeGlyph muted={muted} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.currentTarget.value))}
            aria-label="Volume"
            className="volume-slider hidden w-20 sm:block"
            style={{ '--volume': `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
          />
        </div>
      </div>
    </section>
  );
}

function TrackRow({
  track,
  active,
  playing,
  currentTime,
  duration,
  onToggle,
  onSeekRatio,
  reaction,
  reacted,
  voteCount,
  playCount,
  previousUpvoteSlug,
  onReact,
}: {
  track: Track;
  active: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onSeekRatio: (ratio: number) => void;
  reaction: ReactionMode;
  reacted: boolean;
  voteCount: number;
  playCount: number;
  previousUpvoteSlug: string | null;
  onReact: (result: ReactionResult) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reacting, setReacting] = useState(false);
  const labelId = useId();
  const gradient = trackGradient(track.slug);
  const progress = active && duration > 0 ? currentTime / duration : 0;
  const displayDuration = active && duration > 0 ? duration : track.durationSec;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paint = () => {
      const styles = getComputedStyle(document.documentElement);
      // Prefer muted so unplayed bars stay visible on both canvases; fall back to ink.
      const ink =
        styles.getPropertyValue('--muted').trim() ||
        styles.getPropertyValue('--foreground').trim() ||
        '#8a8780';
      drawWaveform(canvas, track.peaks, progress, gradient.accent, ink);
    };

    paint();
    window.addEventListener('resize', paint);

    // next-themes toggles class on <html>; repaint when light/dark switches.
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    });

    return () => {
      window.removeEventListener('resize', paint);
      observer.disconnect();
    };
  }, [progress, track.peaks, gradient.accent]);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas || displayDuration <= 0) return;
      const rect = canvas.getBoundingClientRect();
      onSeekRatio(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
    },
    [displayDuration, onSeekRatio],
  );

  const onWavePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromClientX(event.clientX);
  };

  const onWavePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    seekFromClientX(event.clientX);
  };

  const onWaveKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onSeekRatio(Math.min(1, progress + 5 / Math.max(displayDuration, 1)));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onSeekRatio(Math.max(0, progress - 5 / Math.max(displayDuration, 1)));
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onToggle();
    }
  };

  const castReaction = async () => {
    if (reacting) return;
    if (reaction === 'heart' && reacted) return;
    if (reaction === 'upvote' && reacted) return;

    setReacting(true);
    try {
      const response = await fetch('/api/music/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: track.slug,
          previousSlug: reaction === 'upvote' ? previousUpvoteSlug : null,
        }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as Partial<ReactionResult>;
      if (typeof data.slug !== 'string' || typeof data.voteCount !== 'number') return;
      onReact({
        slug: data.slug,
        voteCount: data.voteCount,
        previousSlug: typeof data.previousSlug === 'string' ? data.previousSlug : null,
        previousVoteCount:
          typeof data.previousVoteCount === 'number' ? data.previousVoteCount : null,
      });
    } finally {
      setReacting(false);
    }
  };

  return (
    <article className="flex gap-4 border-b border-(--border) py-6 sm:gap-6">
      {/* Desktop: artwork left of the whole row (pre-change layout). */}
      <div
        aria-hidden="true"
        className="hidden aspect-square w-38 shrink-0 self-start border border-(--border) sm:block"
        style={{ backgroundImage: gradient.backgroundImage }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={active && playing}
            aria-label={active && playing ? `Pause ${track.title}` : `Play ${track.title}`}
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-200',
              active && playing
                ? 'border-transparent text-black'
                : 'border-(--border) text-(--foreground) hover:border-[color-mix(in_oklab,var(--foreground)_45%,transparent)]',
            )}
            style={active && playing ? { backgroundColor: gradient.accent } : undefined}
          >
            <PlayGlyph playing={active && playing} />
          </button>

          <div className="min-w-0 flex-1">
            <h3 id={labelId} className="truncate tracking-[-0.015em]">
              {track.title}
            </h3>
            {track.description ? (
              <p className="mt-0.5 truncate text-sm text-(--muted)">{track.description}</p>
            ) : null}
          </div>

          <span className="shrink-0 font-mono text-[11px] text-(--muted) tabular-nums">
            {formatTime(displayDuration)}
          </span>
        </div>

        {/* Mobile: artwork beside the waveform. Desktop: full-width waveform only. */}
        <div className="mt-4 flex items-center gap-4 sm:mt-5">
          <div
            aria-hidden="true"
            className="aspect-square size-14 shrink-0 border border-(--border) sm:hidden"
            style={{ backgroundImage: gradient.backgroundImage }}
          />

          <canvas
            ref={canvasRef}
            role="slider"
            tabIndex={0}
            aria-label={`${track.title} waveform`}
            aria-valuemin={0}
            aria-valuemax={Math.round(displayDuration)}
            aria-valuenow={Math.round(active ? currentTime : 0)}
            aria-valuetext={`${formatTime(active ? currentTime : 0)} of ${formatTime(displayDuration)}`}
            className="h-14 min-w-0 flex-1 cursor-pointer touch-none sm:h-16"
            onPointerDown={onWavePointerDown}
            onPointerMove={onWavePointerMove}
            onKeyDown={onWaveKeyDown}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => void castReaction()}
            disabled={(reaction === 'heart' && reacted) || reacting}
            aria-pressed={reacted}
            aria-label={
              reaction === 'heart'
                ? reacted
                  ? `Hearted ${track.title}`
                  : `Heart ${track.title}`
                : reacted
                  ? `Upvoted ${track.title}`
                  : `Upvote ${track.title} to finish`
            }
            title={reaction === 'heart' ? 'Heart' : 'Upvote'}
            className={cn(
              'link-fade flex items-center gap-2 font-mono text-[11px] tabular-nums',
              reacted ? 'text-(--foreground)' : 'text-(--muted) hover:text-(--foreground)',
              reacting && 'opacity-60',
              reaction === 'heart' && reacted && 'cursor-default',
            )}
          >
            {reaction === 'heart' ? (
              <HeartGlyph filled={reacted} />
            ) : (
              <UpvoteGlyph filled={reacted} />
            )}
            {voteCount}
          </button>

          <span
            className="flex items-center gap-2 font-mono text-[11px] text-(--muted) tabular-nums"
            title="Plays"
          >
            <PlaysGlyph />
            {playCount.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}

export function MusicLibrary({ finished, unfinished }: MusicLibraryProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedIdRef = useRef<string | null>(null);
  const activeSlugRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [heartedSlugs, setHeartedSlugs] = useState<Set<string>>(new Set());
  const [upvoteSlug, setUpvoteSlug] = useState<string | null>(null);
  const [dockReady, setDockReady] = useState(false);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries([...finished, ...unfinished].map((track) => [track.slug, track.voteCount])),
  );
  const [playCounts, setPlayCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries([...finished, ...unfinished].map((track) => [track.slug, track.playCount])),
  );
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);

  const catalog = [...unfinished, ...finished];
  const activeTrack = catalog.find((track) => track.id === activeId) ?? null;

  useEffect(() => {
    setDockReady(true);
    setHeartedSlugs(readHeartedSlugs());
    setUpvoteSlug(readUpvoteSlug());
    const stored = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0 && stored <= 1) setVolume(stored);
  }, []);

  useEffect(() => {
    setVoteCounts((prev) => {
      const next = { ...prev };
      for (const track of [...finished, ...unfinished]) {
        if (!(track.slug in next)) next[track.slug] = track.voteCount;
      }
      return next;
    });
    setPlayCounts((prev) => {
      const next = { ...prev };
      for (const track of [...finished, ...unfinished]) {
        if (!(track.slug in next)) next[track.slug] = track.playCount;
      }
      return next;
    });
  }, [finished, unfinished]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const loadTrack = useCallback((track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (loadedIdRef.current === track.id) return;
    audio.src = track.audioUrl;
    audio.load();
    loadedIdRef.current = track.id;
    setCurrentTime(0);
    setDuration(track.durationSec);
  }, []);

  const playTrack = useCallback(
    async (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      setActiveId(track.id);
      activeSlugRef.current = track.slug;
      loadTrack(track);

      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    },
    [loadTrack],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggleTrack = useCallback(
    (track: Track) => {
      if (activeId === track.id && playing) {
        pause();
        return;
      }
      void playTrack(track);
    },
    [activeId, pause, playTrack, playing],
  );

  const seekRatio = useCallback(
    (ratio: number, track?: Track) => {
      const audio = audioRef.current;
      const target = track ?? activeTrack;
      if (!audio || !target) return;

      const ensure = async () => {
        setActiveId(target.id);
        activeSlugRef.current = target.slug;
        loadTrack(target);

        const total =
          Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : target.durationSec;
        if (total <= 0) return;

        audio.currentTime = Math.min(total, Math.max(0, ratio * total));
        setCurrentTime(audio.currentTime);

        if (audio.paused) {
          try {
            await audio.play();
            setPlaying(true);
          } catch {
            setPlaying(false);
          }
        }
      };

      void ensure();
    },
    [activeTrack, loadTrack],
  );

  const recordPlay = useCallback((slug: string) => {
    if (!TRACK_PLAYS) return;

    try {
      const key = `${PLAY_SESSION_PREFIX}${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // sessionStorage may be unavailable; still attempt a single increment.
    }

    setPlayCounts((prev) => ({
      ...prev,
      [slug]: (prev[slug] ?? 0) + 1,
    }));

    void fetch('/api/music/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    });
  }, []);

  const onVolumeChange = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    setVolume(next);
    setMuted(next === 0);
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(next));
    } catch {
      // Volume preference is best-effort.
    }
  }, []);

  const onToggleMute = useCallback(() => {
    setMuted((prev) => {
      if (prev && volume === 0) setVolume(DEFAULT_VOLUME);
      return !prev;
    });
  }, [volume]);

  const onHeart = useCallback((result: ReactionResult) => {
    setHeartedSlugs((prev) => {
      const next = new Set(prev);
      next.add(result.slug);
      writeHeartedSlugs(next);
      return next;
    });
    setVoteCounts((prev) => ({ ...prev, [result.slug]: result.voteCount }));
  }, []);

  const onUpvote = useCallback((result: ReactionResult) => {
    setUpvoteSlug(result.slug);
    writeUpvoteSlug(result.slug);
    setVoteCounts((prev) => {
      const next = { ...prev, [result.slug]: result.voteCount };
      if (result.previousSlug && typeof result.previousVoteCount === 'number') {
        next[result.previousSlug] = result.previousVoteCount;
      }
      return next;
    });
  }, []);

  return (
    <>
      <div className={cn('flex flex-col gap-20', activeTrack && 'pb-24')}>
        {unfinished.length > 0 ? (
          <section aria-labelledby="music-unfinished">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2
                id="music-unfinished"
                className="text-[11px] tracking-widest text-(--muted) uppercase"
              >
                Unfinished
              </h2>
              <span className="text-[11px] tracking-[0.08em] text-(--muted) uppercase">
                {unfinished.length} sketch{unfinished.length === 1 ? '' : 'es'}
              </span>
            </div>
            <p className="text-sm">
              Random projects from my hard drive. Clicking the upvote button signals to me which one
              I should finish first.
            </p>
            {unfinished.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                active={activeId === track.id}
                playing={playing}
                currentTime={currentTime}
                duration={duration}
                onToggle={() => toggleTrack(track)}
                onSeekRatio={(ratio) => seekRatio(ratio, track)}
                reaction="upvote"
                reacted={upvoteSlug === track.slug}
                voteCount={voteCounts[track.slug] ?? track.voteCount}
                playCount={playCounts[track.slug] ?? track.playCount}
                previousUpvoteSlug={upvoteSlug}
                onReact={onUpvote}
              />
            ))}
          </section>
        ) : null}

        {finished.length > 0 ? (
          <section aria-labelledby="music-finished">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h2
                id="music-finished"
                className="text-[11px] tracking-widest text-(--muted) uppercase"
              >
                Finished
              </h2>
              <span className="text-[11px] tracking-[0.08em] text-(--muted) uppercase">
                {finished.length} track{finished.length === 1 ? '' : 's'}
              </span>
            </div>
            {finished.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                active={activeId === track.id}
                playing={playing}
                currentTime={currentTime}
                duration={duration}
                onToggle={() => toggleTrack(track)}
                onSeekRatio={(ratio) => seekRatio(ratio, track)}
                reaction="heart"
                reacted={heartedSlugs.has(track.slug)}
                voteCount={voteCounts[track.slug] ?? track.voteCount}
                playCount={playCounts[track.slug] ?? track.playCount}
                previousUpvoteSlug={null}
                onReact={onHeart}
              />
            ))}
          </section>
        ) : null}
      </div>

      {/* biome-ignore lint/a11y/useMediaCaption: original instrumentals; no captions to provide */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => {
          event.currentTarget.volume = muted ? 0 : volume;
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          if (activeSlugRef.current) recordPlay(activeSlugRef.current);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />

      {dockReady && activeTrack
        ? createPortal(
            <NowPlayingDock
              track={activeTrack}
              playing={playing}
              currentTime={currentTime}
              duration={duration > 0 ? duration : activeTrack.durationSec}
              volume={volume}
              muted={muted}
              onToggle={() => toggleTrack(activeTrack)}
              onSeekRatio={(ratio) => seekRatio(ratio, activeTrack)}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />,
            document.body,
          )
        : null}
    </>
  );
}
