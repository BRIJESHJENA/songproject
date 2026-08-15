"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  artists,
  getArtist,
  getFirstTrackIndexForArtist,
  tracks,
  youtubeThumb,
} from "../data/catalog";
import {
  parsePlaylistId,
  PLAYLIST_STORAGE_KEY,
  playlistWatchUrl,
} from "../lib/playlist";
import ArtistStrip from "./ArtistStrip";
import Background from "./Background";
import PlayerBar from "./PlayerBar";
import PlaylistPanel from "./PlaylistPanel";
import YouTubePlayer, {
  type VideoMeta,
  type YouTubePlayerHandle,
} from "./YouTubePlayer";

export default function RadioApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistError, setPlaylistError] = useState("");
  const [playlistVideo, setPlaylistVideo] = useState<VideoMeta | null>(null);
  const [copied, setCopied] = useState(false);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const wantsPlayRef = useRef(true);

  const track = tracks[index];
  const artist = useMemo(
    () => getArtist(track.artistId) ?? artists[0],
    [track.artistId]
  );

  const playlistMode = Boolean(playlistId);

  const displayTitle = playlistMode
    ? playlistVideo?.title || "Loading playlist…"
    : track.title;
  const displaySubtitle = playlistMode
    ? playlistVideo?.author || "Your YouTube playlist"
    : `${artist.nameHi} · ${artist.name}${track.album ? ` · ${track.album}` : ""}`;
  const displayVideoId = playlistMode
    ? playlistVideo?.id || track.youtubeId
    : track.youtubeId;

  const backgroundLayer = useMemo(() => {
    if (playlistMode && playlistVideo?.id) {
      return {
        id: playlistVideo.id,
        src: youtubeThumb(playlistVideo.id, "sd"),
        accent: "#e8a45c",
      };
    }
    return {
      id: artist.id,
      src: artist.background,
      accent: artist.accent,
    };
  }, [artist, playlistMode, playlistVideo?.id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = window.localStorage.getItem(PLAYLIST_STORAGE_KEY);
    const id = parsePlaylistId(params.get("list") || stored || "");
    if (!id) return;
    setPlaylistId(id);
    setPlaylistInput(playlistWatchUrl(id));
  }, []);

  const playNow = useCallback(() => {
    wantsPlayRef.current = true;
    setNeedsGesture(false);
    setPlaying(true);
    playerRef.current?.play();
  }, []);

  useEffect(() => {
    const unlock = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "button[aria-label='Pause'], button[aria-label='Play'], input, textarea, label"
        )
      ) {
        return;
      }
      if (event instanceof KeyboardEvent) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key === "Tab" || event.key === "Escape") return;
      }
      playNow();
    };
    window.addEventListener("pointerdown", unlock, { capture: true, once: true });
    window.addEventListener("keydown", unlock, { capture: true, once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, [playNow]);

  const persistPlaylist = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) {
      window.localStorage.setItem(PLAYLIST_STORAGE_KEY, id);
      url.searchParams.set("list", id);
    } else {
      window.localStorage.removeItem(PLAYLIST_STORAGE_KEY);
      url.searchParams.delete("list");
    }
    window.history.replaceState({}, "", url);
  };

  const goTo = useCallback((nextIndex: number) => {
    const wrapped = (nextIndex + tracks.length) % tracks.length;
    const nextTrack = tracks[wrapped];
    setIndex(wrapped);
    setCurrent(0);
    setDuration(0);
    wantsPlayRef.current = true;
    setNeedsGesture(false);
    setPlaying(true);
    playerRef.current?.loadAndPlay(nextTrack.youtubeId);
  }, []);

  const onNext = useCallback(() => {
    if (playlistId) {
      wantsPlayRef.current = true;
      setPlaying(true);
      setCurrent(0);
      playerRef.current?.next();
      return;
    }
    goTo(index + 1);
  }, [goTo, index, playlistId]);

  const onPrev = useCallback(() => {
    if (playlistId) {
      wantsPlayRef.current = true;
      setPlaying(true);
      setCurrent(0);
      playerRef.current?.prev();
      return;
    }
    goTo(index - 1);
  }, [goTo, index, playlistId]);

  const onSelectArtist = useCallback(
    (artistId: string) => {
      if (playlistId) {
        setPlaylistId(null);
        setPlaylistVideo(null);
        persistPlaylist(null);
      }
      goTo(getFirstTrackIndexForArtist(artistId));
    },
    [goTo, playlistId]
  );

  const onToggle = useCallback(() => {
    if (playing) {
      wantsPlayRef.current = false;
      setNeedsGesture(false);
      setPlaying(false);
      playerRef.current?.pause();
      return;
    }
    playNow();
  }, [playNow, playing]);

  const onPlayingChange = useCallback((isPlaying: boolean) => {
    setPlaying(isPlaying);
    if (isPlaying) {
      setNeedsGesture(false);
      wantsPlayRef.current = true;
      return;
    }
    if (wantsPlayRef.current) setNeedsGesture(true);
  }, []);

  const onTime = useCallback((c: number, d: number) => {
    setCurrent(c);
    setDuration(d);
  }, []);

  const onEnded = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const playPlaylist = useCallback(() => {
    const id = parsePlaylistId(playlistInput);
    if (!id) {
      setPlaylistError("Paste a public or unlisted YouTube playlist link.");
      return;
    }
    setPlaylistError("");
    setPlaylistId(id);
    setPlaylistVideo(null);
    persistPlaylist(id);
    wantsPlayRef.current = true;
    setNeedsGesture(false);
    setPlaying(true);
    playerRef.current?.loadPlaylist(id);
  }, [playlistInput]);

  const copyPlaylistLink = useCallback(async () => {
    const id = playlistId || parsePlaylistId(playlistInput);
    if (!id) {
      setPlaylistError("Paste a playlist link first.");
      return;
    }
    const share = `${window.location.origin}/?list=${id}`;
    try {
      await navigator.clipboard.writeText(share);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setPlaylistError("Couldn’t copy the link.");
    }
  }, [playlistId, playlistInput]);

  const resetPlaylist = useCallback(() => {
    setPlaylistId(null);
    setPlaylistVideo(null);
    setPlaylistInput("");
    setPlaylistError("");
    persistPlaylist(null);
    goTo(0);
  }, [goTo]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Background layer={backgroundLayer} />
      <div className="vignette" />
      <div className="grain" />

      <YouTubePlayer
        ref={playerRef}
        videoId={track.youtubeId}
        playlistId={playlistId}
        playing={playing}
        volume={volume}
        muted={muted}
        onEnded={onEnded}
        onTime={onTime}
        onPlayingChange={onPlayingChange}
        onBlocked={setNeedsGesture}
        onVideoMeta={setPlaylistVideo}
      />

      <header className="relative z-40 flex items-center justify-between gap-3 px-4 pt-5 sm:px-8">
        <p className="font-display text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          कैसेट FM
        </p>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="on-air inline-block h-2 w-2 rounded-full bg-emerald-400" />
          <span className="uppercase tracking-[0.2em]">
            {playlistMode ? "Your tape" : "On air"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden font-display text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
            {playlistMode ? "playlist" : track.year}
          </p>
          <PlaylistPanel
            open={panelOpen}
            onToggle={() => setPanelOpen((o) => !o)}
            input={playlistInput}
            onInput={(value) => {
              setPlaylistInput(value);
              setPlaylistError("");
            }}
            error={playlistError}
            active={playlistMode}
            onPlay={playPlaylist}
            onCopy={copyPlaylistLink}
            onReset={resetPlaylist}
            copied={copied}
          />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-10 text-center sm:pt-6">
        <p className="fade-up mb-3 text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">
          {playlistMode ? "your playlist" : "open all hours"}
        </p>
        <h1 className="font-hindi fade-up text-6xl leading-none tracking-tight text-[var(--fg)] sm:text-8xl md:text-9xl">
          कैसेट
        </h1>
        <p className="font-display fade-up-delay mt-4 max-w-md text-sm tracking-[0.04em] text-[var(--muted)] sm:text-base">
          {playlistMode
            ? "playing your YouTube tape"
            : "songs that never left the tape — 2000s & 2010s Hindi radio"}
        </p>
        <p className="fade-up-delay mt-6 font-display text-lg tracking-wide text-[var(--fg)] sm:text-xl">
          {playlistMode ? (
            playlistVideo?.author || "YouTube"
          ) : (
            <>
              <span className="font-hindi mr-2 text-2xl">{artist.nameHi}</span>
              {artist.name}
            </>
          )}
        </p>

        {needsGesture && (
          <button
            type="button"
            onClick={playNow}
            className="fade-up-delay mt-8 rounded-full border border-white/20 bg-black/35 px-6 py-3 text-sm tracking-wide text-[var(--fg)] backdrop-blur transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/15"
          >
            Tap for sound
          </button>
        )}

        <div className="mt-10 w-full">
          <ArtistStrip
            artists={artists}
            activeId={playlistMode ? "" : artist.id}
            onSelect={onSelectArtist}
          />
        </div>
      </main>

      <PlayerBar
        title={displayTitle}
        subtitle={displaySubtitle}
        youtubeId={displayVideoId}
        playing={playing}
        current={current}
        duration={duration}
        volume={volume}
        muted={muted}
        onToggle={onToggle}
        onPrev={onPrev}
        onNext={onNext}
        onSeek={(seconds) => playerRef.current?.seekTo(seconds)}
        onVolume={(v) => {
          setVolume(v);
          if (v > 0) setMuted(false);
        }}
        onMute={() => setMuted((m) => !m)}
      />
    </div>
  );
}
