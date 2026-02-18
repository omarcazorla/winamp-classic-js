import { useCallback, useContext, useEffect, useRef } from "react";

import * as SpotifyUtils from "@/utils/spotify";

import { useSettings } from "..";
import { API_URL } from "@/utils/constants/api";
import {
  SpotifySDKContext,
  SpotifySDKState,
} from "@/providers/SpotifySdkProvider";

export type SpotifySDKHook = SpotifySDKState & {
  signIn: () => void;
  signOut: () => void;
};

export type SpotifySDKHookProps = {
  onAuthorizationChanged?: (isAuthorized: boolean) => void;
};

export const useSpotifySDK = ({
  onAuthorizationChanged,
}: SpotifySDKHookProps = {}): SpotifySDKHook => {
  const {
    isSpotifyAuthorized,
    setIsSpotifyAuthorized,
    isAppleAuthorized,
    setService,
  } = useSettings();
  const state = useContext(SpotifySDKContext);

  if (!state) {
    throw new Error("useSpotifySDK must be used within SpotifySDKProvider");
  }

  const authorizationChangedRef = useRef(onAuthorizationChanged);

  useEffect(() => {
    authorizationChangedRef.current = onAuthorizationChanged;
  }, [onAuthorizationChanged]);

  useEffect(() => {
    authorizationChangedRef.current?.(isSpotifyAuthorized);
  }, [isSpotifyAuthorized]);

  /**
   * Open the Spotify OAuth login page. Once authenticated, the user will be
   * redirected back to the app.
   */
  const signIn = useCallback(async () => {
    if (!isSpotifyAuthorized) {
      const res = await fetch(`${API_URL}/spotify/login`);
      const spotifyLoginUrl = (await res.json()).message;
      window.open(spotifyLoginUrl, "_self");
    } else if (!state.isPlayerConnected) {
      console.warn("Spotify was unable to mount on this browser");
    } else {
      setService("spotify");
    }
  }, [isSpotifyAuthorized, setService, state.isPlayerConnected]);

  const signOut = useCallback(async () => {
    state.spotifyPlayer?.disconnect();
    setIsSpotifyAuthorized(false);

    await SpotifyUtils.logOutSpotify();

    if (isAppleAuthorized) {
      setService("apple");
    } else {
      setService(undefined);
    }
  }, [
    isAppleAuthorized,
    setIsSpotifyAuthorized,
    setService,
    state.spotifyPlayer,
  ]);

  return {
    ...state,
    signIn,
    signOut,
  };
};
