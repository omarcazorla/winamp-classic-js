import { createContext, useCallback, useContext } from "react";

import { useSettings } from "@/hooks";

export interface MusicKitState {
  musicKit?: typeof MusicKit;
  isConfigured: boolean;
  hasDevToken: boolean;
  hasError: boolean;
}

export const MusicKitContext = createContext<MusicKitState | undefined>(
  undefined
);

export type MusicKitHook = MusicKitState & {
  music: MusicKit.MusicKitInstance;
  authorize: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => void;
};

export const useMusicKit = (): MusicKitHook => {
  const { setIsAppleAuthorized, isSpotifyAuthorized, setService } =
    useSettings();
  const context = useContext(MusicKitContext);

  if (!context) {
    throw new Error("useMusicKit must be used within MusicKitProvider");
  }

  const { isConfigured, hasDevToken, hasError } = context;

  const authorize = useCallback(async () => {
    const music = window.MusicKit?.getInstance();

    if (hasError) {
      console.error("Apple Music was unable to mount. Try reloading.");
      return;
    }

    if (music) {
      if (!music.isAuthorized) {
        await music.authorize();
      }

      if (music.isAuthorized) {
        setService("apple");
      }
    }
  }, [hasError, setService]);

  const signOut = useCallback(() => {
    const music = window.MusicKit?.getInstance();
    music?.unauthorize();
    setIsAppleAuthorized(false);

    // Change to Spotify if available.
    setService(isSpotifyAuthorized ? "spotify" : undefined);
  }, [isSpotifyAuthorized, setIsAppleAuthorized, setService]);

  return {
    isConfigured,
    hasDevToken,
    hasError,
    musicKit: window.MusicKit,
    music: window.MusicKit?.getInstance(),
    authorize,
    signIn: authorize,
    signOut,
  };
};
