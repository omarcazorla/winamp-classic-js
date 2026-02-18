import { useEffect } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

/**
 * Keyboard shortcuts for Winamp-style controls:
 * Space = Play/Pause
 * Z = Previous
 * X = Play
 * C = Pause
 * V = Stop
 * B = Next
 * Left/Right Arrow = Seek -5s/+5s
 * Up/Down Arrow = Volume +/- 5%
 */
export default function useKeyboardShortcuts() {
  const {
    togglePlayPause,
    skipPrevious,
    skipNext,
    pause,
    seekToTime,
    setVolume,
    volume,
    playbackInfo,
  } = useAudioPlayer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "z":
          skipPrevious();
          break;
        case "x":
          togglePlayPause();
          break;
        case "c":
          pause();
          break;
        case "v":
          pause();
          seekToTime(0);
          break;
        case "b":
          skipNext();
          break;
        case "arrowleft":
          e.preventDefault();
          seekToTime(Math.max(0, playbackInfo.currentTime - 5));
          break;
        case "arrowright":
          e.preventDefault();
          seekToTime(
            Math.min(playbackInfo.duration, playbackInfo.currentTime + 5)
          );
          break;
        case "arrowup":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlayPause,
    skipPrevious,
    skipNext,
    pause,
    seekToTime,
    setVolume,
    volume,
    playbackInfo,
  ]);
}
