import { useWinampUI } from "@/providers/WinampUIProvider";
import useMobileLayout from "@/hooks/winamp/useMobileLayout";
import MainWindow from "./MainWindow/MainWindow";
import EqualizerWindow from "./EqualizerWindow/EqualizerWindow";
import PlaylistWindow from "./PlaylistWindow/PlaylistWindow";

export default function WindowManager() {
  const { windowVisibility } = useWinampUI();
  const { scale } = useMobileLayout();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        alignItems: "flex-start",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
      }}
    >
      {windowVisibility.main && <MainWindow />}
      {windowVisibility.equalizer && <EqualizerWindow />}
      {windowVisibility.playlist && <PlaylistWindow />}
    </div>
  );
}
