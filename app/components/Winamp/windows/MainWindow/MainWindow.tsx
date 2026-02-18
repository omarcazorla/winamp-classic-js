import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useWinampUI } from "@/providers/WinampUIProvider";
import TitleBar from "./TitleBar";
import Time from "./Time";
import Marquee from "./Marquee";
import ActionButtons from "./ActionButtons";
import Volume from "./Volume";
import Position from "./Position";
import ShuffleRepeat from "./ShuffleRepeat";
import MonoStereo from "./MonoStereo";
import EqPlToggle from "./EqPlToggle";
import Visualizer from "./Visualizer";

export default function MainWindow() {
  const { playbackInfo } = useAudioPlayer();
  const { focusedWindow, setFocusedWindow } = useWinampUI();

  const statusClass = playbackInfo.isPlaying
    ? "play"
    : playbackInfo.isPaused
      ? "pause"
      : "stop";

  const selected = focusedWindow === "main";
  const className = [
    "window",
    statusClass,
    selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id="main-window"
      className={className}
      onPointerDown={() => setFocusedWindow("main")}
    >
      <TitleBar />
      <div className="webamp-status">
        <div id="clutter-bar" />
        <div id="play-pause" />
        <div id="work-indicator" />
        <Time />
      </div>
      <Visualizer />
      <div className="media-info">
        <Marquee />
        <MonoStereo />
      </div>
      <Volume />
      <EqPlToggle />
      <Position />
      <ActionButtons />
      <ShuffleRepeat />
    </div>
  );
}
