import { useCallback, useState } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useSettings } from "@/hooks/utils/useSettings";
import { useSpotifySDK } from "@/hooks/spotify/useSpotifySDK";
import { useMusicKit } from "@/hooks/musicKit/useMusicKit";
import { useWinampUI } from "@/providers/WinampUIProvider";
import { PLAYLIST_COLORS } from "../../skin/skinConstants";
import TrackList from "./TrackList";

interface BrowseItem {
  id: string;
  name: string;
  artistName?: string;
  type: "album" | "artist" | "playlist";
  songs?: Array<{
    id: string;
    name: string;
    artistName?: string;
    duration?: number;
    url?: string;
  }>;
}

export default function BrowseMode() {
  const { browseMode } = useWinampUI();
  const { play } = useAudioPlayer();
  const { service, isAuthorized } = useSettings();
  const { signIn: spotifySignIn } = useSpotifySDK();
  const { authorize: appleAuthorize } = useMusicKit();

  const [browseItems, setBrowseItems] = useState<BrowseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BrowseItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackSelect = useCallback(
    async (index: number) => {
      if (!selectedItem?.songs) return;

      const songs: MediaApi.Song[] = selectedItem.songs.map((s, i) => ({
        id: s.id,
        name: s.name,
        artistName: s.artistName || "",
        url: s.url || s.id,
        albumName: selectedItem.name,
        duration: s.duration || 0,
        trackNumber: i + 1,
      }));

      await play({
        songs,
        startPosition: index,
      });
    },
    [selectedItem, play]
  );

  const handleItemSelect = useCallback((item: BrowseItem) => {
    setSelectedItem(item);
  }, []);

  if (!isAuthorized) {
    return (
      <div
        className="playlist-tracks"
        style={{
          color: PLAYLIST_COLORS.normal,
          backgroundColor: PLAYLIST_COLORS.normalbg,
          fontFamily: `${PLAYLIST_COLORS.font}, Arial, sans-serif`,
          padding: "8px",
          fontSize: "11px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          Sign in to browse your music:
        </div>
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={spotifySignIn}
        >
          Connect Spotify
        </div>
        <div
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            marginTop: "4px",
          }}
          onClick={appleAuthorize}
        >
          Connect Apple Music
        </div>
      </div>
    );
  }

  if (selectedItem?.songs) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: PLAYLIST_COLORS.current,
            backgroundColor: "#222",
            padding: "2px 4px",
            fontSize: "9px",
            cursor: "pointer",
          }}
          onClick={() => setSelectedItem(null)}
        >
          &lt; Back to {browseMode}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <TrackList
            tracks={selectedItem.songs}
            onTrackSelect={handleTrackSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="playlist-tracks"
      style={{
        color: PLAYLIST_COLORS.normal,
        backgroundColor: PLAYLIST_COLORS.normalbg,
        fontFamily: `${PLAYLIST_COLORS.font}, Arial, sans-serif`,
      }}
    >
      {loading && (
        <div className="playlist-track" style={{ opacity: 0.5 }}>
          Loading...
        </div>
      )}
      {!loading && browseItems.length === 0 && (
        <div className="playlist-track" style={{ opacity: 0.5 }}>
          Browse your {browseMode} from the menu below.
        </div>
      )}
      {browseItems.map((item, index) => (
        <div
          key={item.id}
          className="playlist-track"
          onClick={() => handleItemSelect(item)}
        >
          <span className="playlist-track-number">{index + 1}.</span>
          <span className="playlist-track-title">
            {item.artistName
              ? `${item.artistName} - ${item.name}`
              : item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
