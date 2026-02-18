import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import WinampButton from "../../shared/WinampButton";
import { useWinampUI } from "@/providers/WinampUIProvider";

export default function ActionButtons() {
  const { togglePlayPause, skipPrevious, skipNext, pause, seekToTime } =
    useAudioPlayer();
  const { setBrowseMode } = useWinampUI();

  const handleStop = () => {
    pause();
    seekToTime(0);
  };

  const handleEject = () => {
    // Open service selector by switching to browse mode in playlist
    setBrowseMode("albums");
  };

  return (
    <>
      <div className="actions">
        <WinampButton id="previous" onClick={skipPrevious} title="Previous" />
        <WinampButton id="play" onClick={togglePlayPause} title="Play" />
        <WinampButton id="pause" onClick={pause} title="Pause" />
        <WinampButton id="stop" onClick={handleStop} title="Stop" />
        <WinampButton id="next" onClick={skipNext} title="Next" />
      </div>
      <WinampButton id="eject" onClick={handleEject} title="Open" />
    </>
  );
}
