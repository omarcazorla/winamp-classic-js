import { useWinampUI } from "@/providers/WinampUIProvider";
import { PLAYLIST_FRAME } from "../../skin/skinConstants";
import TrackList from "./TrackList";
import BrowseMode from "./BrowseMode";

export default function PlaylistWindow() {
  const {
    focusedWindow,
    setFocusedWindow,
    toggleWindow,
    browseMode,
    setBrowseMode,
  } = useWinampUI();

  const selected = focusedWindow === "playlist";
  const className = ["window", "draggable", selected ? "selected" : ""]
    .filter(Boolean)
    .join(" ");

  const isQueue = browseMode === "queue";

  const tabs = [
    { mode: "albums" as const, label: "Albums" },
    { mode: "artists" as const, label: "Artists" },
    { mode: "playlists" as const, label: "Playlist" },
    { mode: "search" as const, label: "Search" },
  ];

  return (
    <div
      id="playlist-window"
      className={className}
      style={{
        width: "275px",
        height: "232px",
        backgroundImage: `url(${PLAYLIST_FRAME})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      onPointerDown={() => setFocusedWindow("playlist")}
    >
      {/* Draggable title bar area */}
      <div className="playlist-titlebar draggable" />

      {/* Close button overlay */}
      <div
        className="playlist-close-hit"
        onClick={() => toggleWindow("playlist")}
      />

      {/* Content area over the black region */}
      <div className="playlist-body">
        {isQueue ? (
          <TrackList tracks={[]} onTrackSelect={() => {}} />
        ) : (
          <BrowseMode />
        )}
      </div>

      {/* Footer buttons positioned over frame's button area */}
      <div className="playlist-footer">
        {tabs.map(({ mode, label }) => (
          <div
            key={mode}
            className={`playlist-btn ${browseMode === mode ? "active" : ""}`}
            onClick={() => setBrowseMode(mode)}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
