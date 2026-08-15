"use client";

import { useEffect, useId, useRef, useState } from "react";

type PlaylistPanelProps = {
  open: boolean;
  onToggle: () => void;
  input: string;
  onInput: (value: string) => void;
  error?: string;
  active: boolean;
  onPlay: () => void;
  onCopy: () => void;
  onReset: () => void;
  copied: boolean;
};

export default function PlaylistPanel({
  open,
  onToggle,
  input,
  onInput,
  error,
  active,
  onPlay,
  onCopy,
  onReset,
  copied,
}: PlaylistPanelProps) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        onClick={onToggle}
        className={`rounded-full border p-2.5 transition ${
          open || active
            ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--fg)]"
            : "border-white/15 bg-black/25 text-[var(--muted)] hover:border-white/30 hover:text-[var(--fg)]"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 14.9 2h-5.8a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L1.8 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L1.92 14.16a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.4.31.64.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54c.05.24.26.42.5.42h5.8c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96c.24.09.51 0 .64-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
        </svg>
      </button>

      {open && (
        <div className="glass absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-4 text-left shadow-2xl">
          <h2 className="font-display text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Your playlist
          </h2>
          <label htmlFor={fieldId} className="mt-3 block text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            YouTube Music playlist link
          </label>
          <input
            ref={inputRef}
            id={fieldId}
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onPlay();
            }}
            placeholder="youtube.com/playlist?list=…"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-[var(--fg)] outline-none placeholder:text-white/30 focus:border-[var(--accent)]"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
            The playlist must be public or unlisted — private ones won’t play.
          </p>
          {error ? (
            <p className="mt-2 text-[11px] text-red-300">{error}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPlay}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#0c0a09] transition hover:brightness-110"
            >
              Play it
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-[var(--fg)] transition hover:border-white/30"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-[var(--fg)] transition hover:border-white/30"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
