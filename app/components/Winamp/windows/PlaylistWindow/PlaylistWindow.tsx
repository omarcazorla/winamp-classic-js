import { useWinampUI } from "@/providers/WinampUIProvider";
import WinampButton from "../../shared/WinampButton";
import TrackList from "./TrackList";
import BrowseMode from "./BrowseMode";
import { PLAYLIST_COLORS } from "../../skin/skinConstants";

export default function PlaylistWindow() {
  const {
    focusedWindow,
    setFocusedWindow,
    toggleWindow,
    browseMode,
    setBrowseMode,
  } = useWinampUI();

  const selected = focusedWindow === "playlist";
  const className = [
    "window",
    "draggable",
    selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isQueue = browseMode === "queue";

  return (
    <div
      id="playlist-window"
      className={className}
      style={{
        width: "275px",
        height: "232px",
        color: PLAYLIST_COLORS.normal,
        backgroundColor: PLAYLIST_COLORS.normalbg,
        fontFamily: `${PLAYLIST_COLORS.font}, Arial, sans-serif`,
      }}
      onPointerDown={() => setFocusedWindow("playlist")}
    >
      {/* Top section */}
      <div className="playlist-top draggable">
        <div className="playlist-top-left draggable" />
        <div className="playlist-top-left-fill draggable" />
        <div className="playlist-top-title draggable" />
        <div className="playlist-top-right-fill draggable" />
        <div className="playlist-top-right draggable">
          <WinampButton id="playlist-shade-button" title="Shade" />
          <WinampButton
            id="playlist-close-button"
            onClick={() => toggleWindow("playlist")}
            title="Close Playlist"
          />
        </div>
      </div>

      {/* Middle section */}
      <div className="playlist-middle draggable">
        <div className="playlist-middle-left draggable" />
        <div className="playlist-middle-center">
          {isQueue ? (
            <TrackList tracks={[]} onTrackSelect={() => {}} />
          ) : (
            <BrowseMode />
          )}
        </div>
        <div className="playlist-middle-right draggable" />
      </div>

      {/* Bottom section with navigation menus */}
      <div className="playlist-bottom draggable">
        <div className="playlist-bottom-left draggable">
          {/* Use the bottom left area for browse mode tabs */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "2px",
              fontSize: "8px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {(
              [
                ["queue", "Queue"],
                ["albums", "Albums"],
                ["artists", "Artists"],
                ["playlists", "PL"],
                ["search", "Search"],
              ] as const
            ).map(([mode, label]) => (
              <div
                key={mode}
                onClick={() => setBrowseMode(mode)}
                style={{
                  cursor: "pointer",
                  padding: "1px 3px",
                  color:
                    browseMode === mode
                      ? PLAYLIST_COLORS.current
                      : PLAYLIST_COLORS.normal,
                  textDecoration:
                    browseMode === mode ? "underline" : "none",
                  fontSize: "7px",
                  fontWeight: browseMode === mode ? "bold" : "normal",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="playlist-bottom-center draggable" />
        <div className="playlist-bottom-right draggable">
          <div id="playlist-resize-target" />
        </div>
      </div>
    </div>
  );
}
