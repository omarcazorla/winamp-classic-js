import usePlaybackPolling from "@/hooks/winamp/usePlaybackPolling";

export default function PlaybackPoller() {
  usePlaybackPolling(500);
  return null;
}
