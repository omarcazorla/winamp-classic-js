import { getCookie, setCookie } from "cookies-next";
import {
  useSettings,
  useInterval,
  useEffectOnce,
} from "@/hooks";
import { useState, useRef, useCallback, useEffect, createContext } from "react";
import * as SpotifyUtils from "@/utils/spotify";
import { SPOTIFY_TOKENS_COOKIE_NAME } from "@/utils/constants/api";

export interface SpotifySDKState {
  isPlayerConnected: boolean;
  isSdkReady: boolean;
  spotifyPlayer?: Spotify.Player;
  accessToken?: string;
  refreshToken?: string;
  deviceId?: string;
  hasError: boolean;
  errorMessage?: string;
}

export const SpotifySDKContext = createContext<SpotifySDKState | undefined>(
  undefined
);
interface Props {
  children: React.ReactNode;
}

export const SpotifySDKProvider = ({ children }: Props) => {
  const { setIsSpotifyAuthorized } = useSettings();
  const [deviceId, setDeviceId] = useState<string>();
  const spotifyPlayerRef = useRef<Spotify.Player | undefined>();
  const [isPlayerConnected, setIsPlayerConnected] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [storedAccessToken, storedRefreshToken, tokenLastRefreshedTimestamp] =
    getCookie(SPOTIFY_TOKENS_COOKIE_NAME)?.split(",") ?? [
      undefined,
      undefined,
      undefined,
    ];

  const [accessToken, setAccessToken] = useState<string | undefined>(
    storedAccessToken
  );

  /** Fetch access tokens and, if successful, then set up the playback sdk. */
  const handleConnectToSpotify = useCallback(async () => {
    setHasError(false);
    setErrorMessage(undefined);

    if (accessToken) {
      try {
        const player = new window.Spotify.Player({
          name: "Winamp Classic",
          getOAuthToken: async (cb) => {
            if (!accessToken) {
              console.error(
                "handleConnectToSpotify: Access token was not provided"
              );
              return;
            }

            cb(accessToken);
          },
        });

        player.addListener("ready", ({ device_id }: any) => {
          setDeviceId(device_id);
          setIsSpotifyAuthorized(true);
          setIsPlayerConnected(true);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error(`Spotify authentication error: ${message}`);
          setIsSpotifyAuthorized(false);
          setHasError(true);
        });

        /** This indicates that the user is using an unsupported account tier. */
        player.addListener("account_error", () => {
          setErrorMessage("Spotify requires a Premium account to play music on the web");
          setIsSpotifyAuthorized(false);
          setHasError(true);

          SpotifyUtils.logOutSpotify();
        });

        player.addListener("playback_error", ({ message }) => {
          console.error(message);
        });

        player.connect();

        spotifyPlayerRef.current = player;
      } catch (e) {
        console.error("Spotify player initialization error:", e);
        setHasError(true);
      }
    }
  }, [setIsSpotifyAuthorized, accessToken]);

  const handleRefreshTokens = useCallback(async () => {
    if (!storedRefreshToken) {
      console.error("No refresh token found");
      return;
    }

    const {
      accessToken: updatedAccessToken,
      refreshToken: updatedRefreshToken,
    } = await SpotifyUtils.getRefreshedSpotifyTokens(storedRefreshToken);

    if (updatedAccessToken && updatedRefreshToken) {
      const tokenRefreshTimestamp = Date.now().toString();
      setCookie(
        SPOTIFY_TOKENS_COOKIE_NAME,
        `${updatedAccessToken},${updatedRefreshToken},${tokenRefreshTimestamp}`
      );
    }
    setAccessToken(updatedAccessToken);
  }, [storedRefreshToken]);

  // Refresh the access token every 55 minutes.
  useInterval(handleRefreshTokens, 3300000, !accessToken);

  useEffect(() => {
    if (isSdkReady && typeof accessToken === "string" && !isPlayerConnected) {
      handleConnectToSpotify();
    }
  }, [handleConnectToSpotify, isSdkReady, accessToken, isPlayerConnected]);

  const handleMount = useCallback(async () => {
    const timestamp = Number(tokenLastRefreshedTimestamp);
    if (SpotifyUtils.checkShouldRefreshSpotifyTokens(timestamp)) {
      await handleRefreshTokens();
    }

    setIsSdkReady(true);
  }, [handleRefreshTokens, tokenLastRefreshedTimestamp]);

  useEffectOnce(() => {
    if (window.Spotify) {
      handleMount();
    } else {
      window.onSpotifyWebPlaybackSDKReady = handleMount;
    }
  });

  return (
    <SpotifySDKContext.Provider
      value={{
        spotifyPlayer: spotifyPlayerRef.current,
        accessToken,
        deviceId,
        isPlayerConnected,
        isSdkReady,
        hasError,
        errorMessage,
      }}
    >
      {children}
    </SpotifySDKContext.Provider>
  );
};
