import { useWinampUI } from "@/providers/WinampUIProvider";
import WinampButton from "../../shared/WinampButton";

export default function EqPlToggle() {
  const { windowVisibility, toggleWindow } = useWinampUI();

  return (
    <div className="windows">
      <WinampButton
        id="equalizer-button"
        className={windowVisibility.equalizer ? "selected" : ""}
        onClick={() => toggleWindow("equalizer")}
        title="Toggle Equalizer"
      />
      <WinampButton
        id="playlist-button"
        className={windowVisibility.playlist ? "selected" : ""}
        onClick={() => toggleWindow("playlist")}
        title="Toggle Playlist"
      />
    </div>
  );
}
