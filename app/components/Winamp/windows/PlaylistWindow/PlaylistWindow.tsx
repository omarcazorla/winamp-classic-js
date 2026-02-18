import { useWinampUI } from "@/providers/WinampUIProvider";
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
      style={{ width: "275px", height: "232px" }}
      onPointerDown={() => setFocusedWindow("playlist")}
    >
      {/* Header */}
      <div className="playlist-header draggable">
        <span className="playlist-header-title draggable">
          Winamp Playlist
        </span>
        <span
          className="playlist-header-close"
          onClick={() => toggleWindow("playlist")}
        >
          ✕
        </span>
      </div>

      {/* Body */}
      <div className="playlist-body">
        {isQueue ? (
          <TrackList tracks={[]} onTrackSelect={() => {}} />
        ) : (
          <BrowseMode />
        )}
      </div>

      {/* Footer */}
      <div className="playlist-footer">
        <div
          className={`playlist-btn ${browseMode === "queue" ? "active" : ""}`}
          onClick={() => setBrowseMode("queue")}
        >
          Queue
        </div>
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
