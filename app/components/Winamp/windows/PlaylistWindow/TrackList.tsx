import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

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

function formatDuration(ms?: number): string {
  if (!ms) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackList({ tracks, onTrackSelect }: TrackListProps) {
  const { nowPlayingItem } = useAudioPlayer();

  return (
    <div className="playlist-tracks">
      {tracks.map((track, index) => {
        const isCurrent = nowPlayingItem?.id === track.id;
        return (
          <div
            key={track.id || index}
            className={`playlist-track ${isCurrent ? "current" : ""}`}
            onClick={() => onTrackSelect(index)}
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
        <div className="playlist-status">
          No tracks loaded. Use the tabs below to browse music.
        </div>
      )}
    </div>
  );
}
