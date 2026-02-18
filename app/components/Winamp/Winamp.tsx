"use client";
import { memo, useCallback, useState } from "react";
import * as SpotifyUtils from "@/utils/spotify";
import {
  AudioPlayerProvider,
  SettingsProvider,
} from "@/hooks";
import useEffectOnce from "@/hooks/utils/useEffectOnce";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpotifySDKProvider } from "@/providers/SpotifySdkProvider";
import { MusicKitProvider } from "@/providers/MusicKitProvider";
import WinampUIProvider from "@/providers/WinampUIProvider";
import { useRouter } from "next/navigation";
import { GlobalStyles } from "./GlobalStyles";
import SkinStyles from "./skin/SkinStyles";
import WindowManager from "./windows/WindowManager";
import PlaybackPoller from "./PlaybackPoller";
import KeyboardShortcuts from "./KeyboardShortcuts";
import Script from "next/script";

import "@/styles/winamp/main-window.css";
import "@/styles/winamp/equalizer-window.css";
import "@/styles/winamp/playlist-window.css";

type Props = {
  appleAccessToken: string;
  spotifyCallbackCode?: string;
};

const Winamp = ({ appleAccessToken, spotifyCallbackCode }: Props) => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const handleCheckSpotifyCallback = useCallback(
    async (code: string) => {
      await SpotifyUtils.handleSpotifyCode(code);
      setIsLoading(false);
      router.replace("/");
    },
    [router]
  );

  useEffectOnce(() => {
    if (spotifyCallbackCode) {
      handleCheckSpotifyCallback(spotifyCallbackCode);
      return;
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SkinStyles />
      <SettingsProvider>
        <WinampUIProvider>
          <SpotifySDKProvider>
            <MusicKitProvider token={appleAccessToken}>
              <AudioPlayerProvider>
                <div id="winamp">
                  <WindowManager />
                  <PlaybackPoller />
                  <KeyboardShortcuts />
                </div>
              </AudioPlayerProvider>
            </MusicKitProvider>
          </SpotifySDKProvider>
        </WinampUIProvider>
      </SettingsProvider>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </QueryClientProvider>
  );
};

export default memo(Winamp);
