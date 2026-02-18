import { DEFAULT_ARTWORK_URL } from "@/utils/constants/api";

/** Accepts a url with '{w}' and '{h}' and replaces them with the specified size */
export const getArtwork = (size: number | string, url?: string) => {
  if (!url) {
    return DEFAULT_ARTWORK_URL;
  }

  const urlWithSize = url.replace("{w}", `${size}`).replace("{h}", `${size}`);
  return urlWithSize;
};

export const setDocumentSongTitle = (song?: AppleMusicApi.Song) => {
  document.title = song
    ? `${song.attributes?.name ?? "Music"} – Winamp Classic`
    : "Winamp Classic";
};

export const formatPlaybackTime = (seconds: number) => {
  const dateObject = new Date();
  dateObject.setMinutes(0);
  dateObject.setSeconds(seconds);
  const formattedMinutes = dateObject.getMinutes().toString().padStart(2, "0");
  const formattedSeconds = dateObject.getSeconds().toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 *
 * [Client-side only] Returns the root URL of the app, depending on the environment
 */
export const getRootAppUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    return "http://127.0.0.1:3000";
  }

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_BASE_URL;

  return `https://${host}`;
};

/**
 * Extracts the song ID from queue options.
 * Handles various queue option formats (song, songs array, album, playlist).
 */
export const getSongIdFromQueueOptions = (
  queueOptions: MediaApi.QueueOptions,
  startPosition = 0
): string | undefined => {
  return (
    queueOptions.song?.id ??
    queueOptions.songs?.[startPosition]?.id ??
    queueOptions.album?.songs[startPosition]?.id ??
    queueOptions.playlist?.songs[startPosition]?.id
  );
};
