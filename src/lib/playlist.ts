const PLAYLIST_ID = /(?:^|[^A-Za-z0-9_-])((?:PL|RD|UU|OL|FL)[\w-]{10,})(?:$|[^A-Za-z0-9_-])/;

export function parsePlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^(?:PL|RD|UU|OL|FL)[\w-]{10,}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const list = url.searchParams.get("list");
    if (list) return list;
  } catch {
    /* not a URL */
  }

  const match = trimmed.match(PLAYLIST_ID) ?? trimmed.match(/[?&]list=([\w-]+)/);
  return match?.[1] ?? null;
}

export function playlistWatchUrl(id: string) {
  return `https://www.youtube.com/playlist?list=${id}`;
}

export const PLAYLIST_STORAGE_KEY = "kaset-playlist";
