"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  loadVideoById: (videoId: string) => void;
  loadPlaylist: (args: {
    list: string;
    listType?: string;
    index?: number;
  }) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  getVideoData: () => { title?: string; video_id?: string; author?: string };
  destroy: () => void;
  getIframe?: () => HTMLIFrameElement;
};

const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: Record<string, unknown>
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type VideoMeta = {
  id: string;
  title: string;
  author: string;
};

export type YouTubePlayerHandle = {
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
  loadAndPlay: (id: string) => void;
  loadPlaylist: (id: string) => void;
  next: () => void;
  prev: () => void;
};

type YouTubePlayerProps = {
  videoId: string;
  playlistId?: string | null;
  playing: boolean;
  volume: number;
  muted: boolean;
  onEnded?: () => void;
  onTime?: (current: number, duration: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  onBlocked?: (blocked: boolean) => void;
  onVideoMeta?: (meta: VideoMeta) => void;
};

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (window.YT?.Player) resolve();
  });

  return apiPromise;
}

function allowAutoplay(player: YTPlayer | null, host: HTMLDivElement | null) {
  const iframe = player?.getIframe?.() ?? host?.querySelector("iframe");
  iframe?.setAttribute("allow", "autoplay; encrypted-media; fullscreen");
  iframe?.setAttribute("allowfullscreen", "true");
  // Keep keyboard focus in the app UI (playlist paste, controls).
  iframe?.setAttribute("tabindex", "-1");
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  function YouTubePlayer(
    {
      videoId,
      playlistId,
      playing,
      volume,
      muted,
      onEnded,
      onTime,
      onPlayingChange,
      onBlocked,
      onVideoMeta,
    },
    ref
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const [ready, setReady] = useState(false);
    const playingRef = useRef(playing);
    const mutedRef = useRef(muted);
    const onEndedRef = useRef(onEnded);
    const onPlayingChangeRef = useRef(onPlayingChange);
    const onBlockedRef = useRef(onBlocked);
    const onVideoMetaRef = useRef(onVideoMeta);
    const lastIdRef = useRef<string | null>(null);
    const playlistModeRef = useRef(Boolean(playlistId));
    const lastPlaylistRef = useRef<string | null>(playlistId ?? null);
    const ignorePauseUntilRef = useRef(0);
    const volumeRef = useRef(volume);
    const unlockedRef = useRef(false);

    useEffect(() => {
      playingRef.current = playing;
      if (!ready || !playerRef.current) return;
      if (playing) {
        ignorePauseUntilRef.current = Date.now() + 1500;
        playerRef.current.playVideo();
      } else {
        ignorePauseUntilRef.current = 0;
        playerRef.current.pauseVideo();
      }
    }, [playing, ready]);
    useEffect(() => {
      mutedRef.current = muted;
    }, [muted]);
    useEffect(() => {
      volumeRef.current = volume;
    }, [volume]);
    useEffect(() => {
      onEndedRef.current = onEnded;
    }, [onEnded]);
    useEffect(() => {
      onPlayingChangeRef.current = onPlayingChange;
    }, [onPlayingChange]);
    useEffect(() => {
      onBlockedRef.current = onBlocked;
    }, [onBlocked]);
    useEffect(() => {
      onVideoMetaRef.current = onVideoMeta;
    }, [onVideoMeta]);

    const emitMeta = () => {
      try {
        const data = playerRef.current?.getVideoData();
        if (!data?.video_id) return;
        lastIdRef.current = data.video_id;
        onVideoMetaRef.current?.({
          id: data.video_id,
          title: data.title || "Unknown track",
          author: data.author || "YouTube",
        });
      } catch {
        /* player mid-load */
      }
    };

    const startPlaylist = (id: string) => {
      const player = playerRef.current;
      if (!player) return;
      playlistModeRef.current = true;
      lastIdRef.current = null;
      ignorePauseUntilRef.current = Date.now() + 2000;
      player.loadPlaylist({ list: id, listType: "playlist", index: 0 });
      if (unlockedRef.current && !mutedRef.current) player.unMute();
      player.playVideo();
    };

    const startPlayback = (fromUserGesture: boolean) => {
      const player = playerRef.current;
      if (!player) return;
      ignorePauseUntilRef.current = Date.now() + 2000;
      player.setVolume(volumeRef.current);
      if (fromUserGesture) {
        unlockedRef.current = true;
        if (!mutedRef.current) player.unMute();
        player.playVideo();
        return;
      }
      if (unlockedRef.current && !mutedRef.current) {
        player.unMute();
        player.playVideo();
        return;
      }
      player.mute();
      player.playVideo();
    };

    useImperativeHandle(ref, () => ({
      seekTo(seconds: number) {
        playerRef.current?.seekTo(seconds, true);
      },
      play() {
        playingRef.current = true;
        startPlayback(true);
      },
      pause() {
        playingRef.current = false;
        ignorePauseUntilRef.current = 0;
        playerRef.current?.pauseVideo();
      },
      loadAndPlay(id: string) {
        playingRef.current = true;
        playlistModeRef.current = false;
        lastPlaylistRef.current = null;
        lastIdRef.current = id;
        ignorePauseUntilRef.current = Date.now() + 2000;
        if (!mutedRef.current) playerRef.current?.unMute();
        playerRef.current?.loadVideoById(id);
        playerRef.current?.playVideo();
      },
      loadPlaylist(id: string) {
        playingRef.current = true;
        lastPlaylistRef.current = id;
        startPlaylist(id);
      },
      next() {
        playingRef.current = true;
        ignorePauseUntilRef.current = Date.now() + 2000;
        if (playlistModeRef.current) playerRef.current?.nextVideo();
      },
      prev() {
        playingRef.current = true;
        ignorePauseUntilRef.current = Date.now() + 2000;
        if (playlistModeRef.current) playerRef.current?.previousVideo();
      },
    }));

    useEffect(() => {
      let cancelled = false;

      loadYouTubeApi().then(() => {
        if (cancelled || !hostRef.current || !window.YT || playerRef.current)
          return;

        playerRef.current = new window.YT.Player(hostRef.current, {
          width: "320",
          height: "180",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              allowAutoplay(playerRef.current, hostRef.current);
              setReady(true);
              if (!playlistId) {
                lastIdRef.current = videoId;
                if (playingRef.current) startPlayback(false);
              }
            },
            onStateChange: (event: { data: number }) => {
              const player = playerRef.current;
              if (event.data === ENDED) {
                if (playlistModeRef.current) {
                  player?.nextVideo();
                  return;
                }
                onEndedRef.current?.();
              }
              if (event.data === PLAYING) {
                if (!playingRef.current) {
                  player?.pauseVideo();
                  return;
                }
                emitMeta();
                onBlockedRef.current?.(false);
                onPlayingChangeRef.current?.(true);
                if (!mutedRef.current) {
                  player?.unMute();
                  window.setTimeout(() => {
                    if (!playingRef.current) return;
                    if (!mutedRef.current && player?.isMuted?.()) {
                      onBlockedRef.current?.(true);
                    } else {
                      unlockedRef.current = true;
                    }
                  }, 250);
                }
              }
              if (event.data === PAUSED) {
                if (!playingRef.current) {
                  onPlayingChangeRef.current?.(false);
                  return;
                }
                if (Date.now() < ignorePauseUntilRef.current) {
                  player?.playVideo();
                  return;
                }
                onPlayingChangeRef.current?.(false);
              }
            },
          },
        });
      });

      return () => {
        cancelled = true;
        playerRef.current?.destroy();
        playerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
    }, []);

    useEffect(() => {
      if (!ready || !playerRef.current) return;
      if (playlistId) {
        if (lastPlaylistRef.current === playlistId) return;
        lastPlaylistRef.current = playlistId;
        startPlaylist(playlistId);
        return;
      }
      lastPlaylistRef.current = null;
      playlistModeRef.current = false;
      if (lastIdRef.current === videoId) return;
      lastIdRef.current = videoId;
      ignorePauseUntilRef.current = Date.now() + 2000;
      playerRef.current.loadVideoById(videoId);
      if (playingRef.current) startPlayback(false);
    }, [videoId, playlistId, ready]);

    useEffect(() => {
      if (!ready || !playerRef.current) return;
      playerRef.current.setVolume(volume);
    }, [volume, ready]);

    useEffect(() => {
      if (!ready || !playerRef.current) return;
      if (muted) {
        playerRef.current.mute();
        return;
      }
      if (unlockedRef.current) playerRef.current.unMute();
    }, [muted, ready]);

    useEffect(() => {
      if (!ready) return;
      const id = window.setInterval(() => {
        const player = playerRef.current;
        if (!player) return;
        try {
          onTime?.(player.getCurrentTime() || 0, player.getDuration() || 0);
        } catch {
          /* ignore */
        }
      }, 400);
      return () => window.clearInterval(id);
    }, [ready, onTime]);

    return (
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[180px] w-[320px] overflow-hidden opacity-[0.01]">
        <div ref={hostRef} className="h-full w-full" />
      </div>
    );
  }
);

export default YouTubePlayer;
