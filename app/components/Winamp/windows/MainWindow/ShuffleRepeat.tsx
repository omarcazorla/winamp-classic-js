import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import WinampButton from "../../shared/WinampButton";

export default function ShuffleRepeat() {
  const { shuffleMode, repeatMode, setShuffleMode, setRepeatMode } =
    useAudioPlayer();

  const handleShuffle = () => {
    setShuffleMode(shuffleMode === "off" ? "songs" : "off");
  };

  const handleRepeat = () => {
    const modes = ["off", "all", "one"] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const shuffleClasses = shuffleMode !== "off" ? "selected" : "";
  const repeatClasses = repeatMode !== "off" ? "selected" : "";

  return (
    <div className="shuffle-repeat">
      <WinampButton
        id="shuffle"
        className={shuffleClasses}
        onClick={handleShuffle}
        title={`Shuffle: ${shuffleMode}`}
      />
      <WinampButton
        id="repeat"
        className={repeatClasses}
        onClick={handleRepeat}
        title={`Repeat: ${repeatMode}`}
      />
    </div>
  );
}
