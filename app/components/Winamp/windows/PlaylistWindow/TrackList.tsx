import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PLAYLIST_COLORS } from "../../skin/skinConstants";

interface Track {
  id: string;
  name: string;
  artistName?: string;
  duration?: number;
  url?: string;
}

interface TrackListProps {
  tracks: Track[];
  onTrackSelect: (index: number) => void;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackList({ tracks, onTrackSelect }: TrackListProps) {
  const { nowPlayingItem } = useAudioPlayer();

  return (
    <div
      className="playlist-tracks"
      style={{
        color: PLAYLIST_COLORS.normal,
        backgroundColor: PLAYLIST_COLORS.normalbg,
        fontFamily: `${PLAYLIST_COLORS.font}, Arial, sans-serif`,
      }}
    >
      {tracks.map((track, index) => {
        const isCurrent = nowPlayingItem?.name === track.name;
        return (
          <div
            key={track.id || index}
            className={`playlist-track ${isCurrent ? "current" : ""}`}
            onClick={() => onTrackSelect(index)}
            style={{
              color: isCurrent ? PLAYLIST_COLORS.current : PLAYLIST_COLORS.normal,
            }}
          >
            <span className="playlist-track-number">{index + 1}.</span>
            <span className="playlist-track-title">
              {track.artistName
                ? `${track.artistName} - ${track.name}`
                : track.name}
            </span>
            <span className="playlist-track-duration">
              {formatDuration(track.duration)}
            </span>
          </div>
        );
      })}
      {tracks.length === 0 && (
        <div
          className="playlist-track"
          style={{ color: PLAYLIST_COLORS.normal, opacity: 0.5 }}
        >
          No tracks loaded. Use the menu below to browse music.
        </div>
      )}
    </div>
  );
}
