"use client";

import Image from "next/image";
import { youtubeThumb } from "../data/catalog";

type PlayerBarProps = {
  title: string;
  subtitle: string;
  youtubeId: string;
  playing: boolean;
  current: number;
  duration: number;
  volume: number;
  muted: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (volume: number) => void;
  onMute: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function IconPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2V6zM5 18l8.5-6L5 6v12z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function IconVolume({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

export default function PlayerBar({
  title,
  subtitle,
  youtubeId,
  playing,
  current,
  duration,
  volume,
  muted,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  onVolume,
  onMute,
}: PlayerBarProps) {
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="relative z-20 mx-auto w-full max-w-5xl px-3 pb-4 sm:px-4 sm:pb-6">
      <div className="glass rounded-3xl px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14">
            <Image
              src={youtubeThumb(youtubeId)}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm tracking-wide sm:text-base">
              {title}
            </p>
            <p className="truncate text-xs text-[var(--muted)] sm:text-sm">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Previous track"
              onClick={onPrev}
              className="rounded-full p-2 text-[var(--fg)]/80 transition hover:bg-white/10 hover:text-[var(--fg)]"
            >
              <IconPrev />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={onToggle}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--fg)] text-[#0c0a09] transition hover:scale-105 active:scale-95 sm:h-12 sm:w-12"
            >
              {playing ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={onNext}
              className="rounded-full p-2 text-[var(--fg)]/80 transition hover:bg-white/10 hover:text-[var(--fg)]"
            >
              <IconNext />
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={onMute}
              className="rounded-full p-2 text-[var(--muted)] transition hover:bg-white/10 hover:text-[var(--fg)]"
            >
              <IconVolume muted={muted} />
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(e) => onVolume(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 px-1">
          <span className="w-10 shrink-0 text-[10px] tabular-nums text-[var(--muted)]">
            {formatTime(current)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            aria-label="Seek"
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, var(--accent) ${progress}%, rgba(245,239,230,0.22) ${progress}%)`,
            }}
          />
          <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-[var(--muted)]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-[var(--muted)]">
        Audio plays through YouTube’s embedded player. Rights stay with the
        labels, composers and performers.
      </p>
    </div>
  );
}
