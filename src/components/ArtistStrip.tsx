"use client";

import type { Artist } from "../data/catalog";

type ArtistStripProps = {
  artists: Artist[];
  activeId: string;
  onSelect: (artistId: string) => void;
};

export default function ArtistStrip({
  artists,
  activeId,
  onSelect,
}: ArtistStripProps) {
  return (
    <div className="fade-up-delay relative z-10 mx-auto w-full max-w-5xl px-4">
      <p className="mb-3 text-center text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
        Voices on the tape
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {artists.map((artist) => {
          const active = artist.id === activeId;
          return (
            <button
              key={artist.id}
              type="button"
              onClick={() => onSelect(artist.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--fg)]"
                  : "border-white/15 bg-black/25 text-[var(--muted)] hover:border-white/30 hover:text-[var(--fg)]"
              }`}
              style={
                active
                  ? { boxShadow: `0 0 0 1px ${artist.accent}55` }
                  : undefined
              }
            >
              <span className="font-hindi mr-1.5 text-base leading-none">
                {artist.nameHi}
              </span>
              <span className="font-display tracking-wide">{artist.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
