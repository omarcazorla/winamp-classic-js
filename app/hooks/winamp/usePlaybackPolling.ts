import { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

/**
 * Polls playback info at regular intervals to keep time display in sync.
 */
export default function usePlaybackPolling(intervalMs = 500) {
  const { playbackInfo, updatePlaybackInfo } = useAudioPlayer();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playbackInfo.isPlaying) {
      intervalRef.current = setInterval(updatePlaybackInfo, intervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playbackInfo.isPlaying, updatePlaybackInfo, intervalMs]);
}
