import { useCallback } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export default function Volume() {
  const { volume, setVolume } = useAudioPlayer();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(e.target.value));
    },
    [setVolume]
  );

  // The volume background sprite has 28 frames at 15px each (420px / 15)
  // We select the frame based on the current volume level
  const frame = Math.round(volume * 27);
  const backgroundY = frame * 15;

  return (
    <div id="volume" style={{ backgroundPositionY: `-${backgroundY}px` }}>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleChange}
        title={`Volume: ${Math.round(volume * 100)}%`}
      />
    </div>
  );
}
