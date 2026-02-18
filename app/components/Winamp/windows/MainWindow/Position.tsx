import { useCallback } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export default function Position() {
  const { playbackInfo, seekToTime } = useAudioPlayer();
  const { currentTime, duration } = playbackInfo;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      seekToTime(parseFloat(e.target.value));
    },
    [seekToTime]
  );

  return (
    <input
      id="position"
      type="range"
      min="0"
      max={duration || 1}
      step="0.1"
      value={currentTime}
      onChange={handleChange}
      title="Seek"
    />
  );
}
