import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useSettings } from "@/hooks/utils/useSettings";
import { useSpotifySDK } from "@/hooks/spotify/useSpotifySDK";
import { useMusicKit } from "@/hooks/musicKit/useMusicKit";
import { useWinampUI } from "@/providers/WinampUIProvider";
import {
  useFetchAlbums,
  useFetchAlbum,
  useFetchArtists,
  useFetchArtistAlbums,
  useFetchPlaylists,
  useFetchPlaylist,
  useFetchSearchResults,
} from "@/hooks/utils/useDataFetcher";
import TrackList from "./TrackList";

type NavItem =
  | { type: "album"; id: string; name: string }
  | { type: "artist"; id: string; name: string }
  | { type: "playlist"; id: string; name: string };

export default function BrowseMode() {
  const { browseMode, searchQuery, setSearchQuery } = useWinampUI();
  const { play } = useAudioPlayer();
  const { isAuthorized } = useSettings();
  const { signIn: spotifySignIn } = useSpotifySDK();
  const { authorize: appleAuthorize } = useMusicKit();

  const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<NavItem | null>(null);

  // Reset navigation when browse mode changes
  useEffect(() => {
    setSelectedItem(null);
    setSelectedSubItem(null);
  }, [browseMode]);

  const handleBack = useCallback(() => {
    if (selectedSubItem) {
      setSelectedSubItem(null);
    } else {
      setSelectedItem(null);
    }
  }, [selectedSubItem]);

  if (!isAuthorized) {
    return (
      <div className="playlist-auth">
        <div style={{ marginBottom: "8px" }}>
          Sign in to browse your music:
        </div>
        <div className="playlist-auth-link" onClick={spotifySignIn}>
          Connect Spotify
        </div>
        <div className="playlist-auth-link" onClick={appleAuthorize}>
          Connect Apple Music
        </div>
      </div>
    );
  }

  // Drill-down views
  const drillItem = selectedSubItem ?? selectedItem;

  if (drillItem?.type === "album") {
    return (
      <AlbumDetail
        id={drillItem.id}
        name={drillItem.name}
        onBack={handleBack}
        onPlay={play}
      />
    );
  }

  if (drillItem?.type === "playlist") {
    return (
      <PlaylistDetail
        id={drillItem.id}
        name={drillItem.name}
        onBack={handleBack}
        onPlay={play}
      />
    );
  }

  if (selectedItem?.type === "artist") {
    return (
      <ArtistDetail
        id={selectedItem.id}
        name={selectedItem.name}
        onBack={handleBack}
        onSelectAlbum={(id, name) =>
          setSelectedSubItem({ type: "album", id, name })
        }
      />
    );
  }

  // Top-level lists
  switch (browseMode) {
    case "albums":
      return (
        <AlbumsList
          onSelect={(id, name) => setSelectedItem({ type: "album", id, name })}
        />
      );
    case "artists":
      return (
        <ArtistsList
          onSelect={(id, name) =>
            setSelectedItem({ type: "artist", id, name })
          }
        />
      );
    case "playlists":
      return (
        <PlaylistsList
          onSelect={(id, name) =>
            setSelectedItem({ type: "playlist", id, name })
          }
        />
      );
    case "search":
      return (
        <SearchView
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSelectAlbum={(id, name) =>
            setSelectedItem({ type: "album", id, name })
          }
          onSelectArtist={(id, name) =>
            setSelectedItem({ type: "artist", id, name })
          }
          onSelectPlaylist={(id, name) =>
            setSelectedItem({ type: "playlist", id, name })
          }
          onPlaySong={play}
        />
      );
    default:
      return null;
  }
}

// --- Albums List ---

function AlbumsList({
  onSelect,
}: {
  onSelect: (id: string, name: string) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchAlbums({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const albums = data?.pages.flatMap((p) => p?.data ?? []) ?? [];

  if (isLoading) return <div className="playlist-status">Loading albums...</div>;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ height: "100%", overflowY: "auto" }}
    >
      {albums.map((album) => (
        <div
          key={album.id}
          className="playlist-browse-item"
          onClick={() => onSelect(album.id, album.name)}
        >
          {album.artistName ? `${album.artistName} - ` : ""}
          {album.name}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="playlist-status">Loading more...</div>
      )}
      {albums.length === 0 && !isLoading && (
        <div className="playlist-status">No albums found.</div>
      )}
    </div>
  );
}

// --- Album Detail ---

function AlbumDetail({
  id,
  name,
  onBack,
  onPlay,
}: {
  id: string;
  name: string;
  onBack: () => void;
  onPlay: (opts: MediaApi.QueueOptions) => Promise<void>;
}) {
  const { data: album, isLoading } = useFetchAlbum({ id });

  const handleTrackSelect = useCallback(
    async (index: number) => {
      if (!album) return;
      await onPlay({ album, startPosition: index });
    },
    [album, onPlay]
  );

  if (isLoading) return <div className="playlist-status">Loading...</div>;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="playlist-back-btn" onClick={onBack}>
        &larr; {name}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <TrackList
          tracks={album?.songs ?? []}
          onTrackSelect={handleTrackSelect}
        />
      </div>
    </div>
  );
}

// --- Artists List ---

function ArtistsList({
  onSelect,
}: {
  onSelect: (id: string, name: string) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchArtists({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const artists = data?.pages.flatMap((p) => p?.data ?? []) ?? [];

  if (isLoading)
    return <div className="playlist-status">Loading artists...</div>;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ height: "100%", overflowY: "auto" }}
    >
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="playlist-browse-item"
          onClick={() => onSelect(artist.id, artist.name)}
        >
          {artist.name}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="playlist-status">Loading more...</div>
      )}
      {artists.length === 0 && !isLoading && (
        <div className="playlist-status">No artists found.</div>
      )}
    </div>
  );
}

// --- Artist Detail (shows albums) ---

function ArtistDetail({
  id,
  name,
  onBack,
  onSelectAlbum,
}: {
  id: string;
  name: string;
  onBack: () => void;
  onSelectAlbum: (id: string, name: string) => void;
}) {
  const { data: albums, isLoading } = useFetchArtistAlbums({ id });

  if (isLoading) return <div className="playlist-status">Loading...</div>;

  const albumList = albums ?? [];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="playlist-back-btn" onClick={onBack}>
        &larr; {name}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {albumList.map((album) => (
          <div
            key={album.id}
            className="playlist-browse-item"
            onClick={() => onSelectAlbum(album.id, album.name)}
          >
            {album.name}
          </div>
        ))}
        {albumList.length === 0 && (
          <div className="playlist-status">No albums found.</div>
        )}
      </div>
    </div>
  );
}

// --- Playlists List ---

function PlaylistsList({
  onSelect,
}: {
  onSelect: (id: string, name: string) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchPlaylists({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const playlists = data?.pages.flatMap((p) => p?.data ?? []) ?? [];

  if (isLoading)
    return <div className="playlist-status">Loading playlists...</div>;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ height: "100%", overflowY: "auto" }}
    >
      {playlists.map((pl) => (
        <div
          key={pl.id}
          className="playlist-browse-item"
          onClick={() => onSelect(pl.id, pl.name)}
        >
          {pl.name}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="playlist-status">Loading more...</div>
      )}
      {playlists.length === 0 && !isLoading && (
        <div className="playlist-status">No playlists found.</div>
      )}
    </div>
  );
}

// --- Playlist Detail ---

function PlaylistDetail({
  id,
  name,
  onBack,
  onPlay,
}: {
  id: string;
  name: string;
  onBack: () => void;
  onPlay: (opts: MediaApi.QueueOptions) => Promise<void>;
}) {
  const { data: playlist, isLoading } = useFetchPlaylist({ id });

  const handleTrackSelect = useCallback(
    async (index: number) => {
      if (!playlist) return;
      await onPlay({ playlist, startPosition: index });
    },
    [playlist, onPlay]
  );

  if (isLoading) return <div className="playlist-status">Loading...</div>;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="playlist-back-btn" onClick={onBack}>
        &larr; {name}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <TrackList
          tracks={playlist?.songs ?? []}
          onTrackSelect={handleTrackSelect}
        />
      </div>
    </div>
  );
}

// --- Search View ---

function SearchView({
  query,
  onQueryChange,
  onSelectAlbum,
  onSelectArtist,
  onSelectPlaylist,
  onPlaySong,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onSelectAlbum: (id: string, name: string) => void;
  onSelectArtist: (id: string, name: string) => void;
  onSelectPlaylist: (id: string, name: string) => void;
  onPlaySong: (opts: MediaApi.QueueOptions) => Promise<void>;
}) {
  const { data: results, isLoading } = useFetchSearchResults({
    query,
    lazy: !query,
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        className="playlist-search-input"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        autoFocus
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {isLoading && query && (
          <div className="playlist-status">Searching...</div>
        )}
        {!query && (
          <div className="playlist-status">Type to search your library.</div>
        )}
        {results && (
          <>
            {results.songs.length > 0 && (
              <>
                <div className="playlist-search-section">Songs</div>
                {results.songs.map((song) => (
                  <div
                    key={song.id}
                    className="playlist-browse-item"
                    onClick={() => onPlaySong({ song })}
                  >
                    {song.artistName ? `${song.artistName} - ` : ""}
                    {song.name}
                  </div>
                ))}
              </>
            )}
            {results.albums.length > 0 && (
              <>
                <div className="playlist-search-section">Albums</div>
                {results.albums.map((album) => (
                  <div
                    key={album.id}
                    className="playlist-browse-item"
                    onClick={() => onSelectAlbum(album.id, album.name)}
                  >
                    {album.artistName ? `${album.artistName} - ` : ""}
                    {album.name}
                  </div>
                ))}
              </>
            )}
            {results.artists.length > 0 && (
              <>
                <div className="playlist-search-section">Artists</div>
                {results.artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="playlist-browse-item"
                    onClick={() => onSelectArtist(artist.id, artist.name)}
                  >
                    {artist.name}
                  </div>
                ))}
              </>
            )}
            {results.playlists.length > 0 && (
              <>
                <div className="playlist-search-section">Playlists</div>
                {results.playlists.map((pl) => (
                  <div
                    key={pl.id}
                    className="playlist-browse-item"
                    onClick={() => onSelectPlaylist(pl.id, pl.name)}
                  >
                    {pl.name}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
