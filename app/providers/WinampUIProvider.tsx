import { createContext, useCallback, useContext, useState } from "react";

export type WindowId = "main" | "equalizer" | "playlist";

interface WinampUIState {
  windowVisibility: Record<WindowId, boolean>;
  focusedWindow: WindowId;
  browseMode: "queue" | "albums" | "artists" | "playlists" | "search";
  searchQuery: string;
}

interface WinampUIActions {
  toggleWindow: (id: WindowId) => void;
  setFocusedWindow: (id: WindowId) => void;
  setBrowseMode: (
    mode: "queue" | "albums" | "artists" | "playlists" | "search"
  ) => void;
  setSearchQuery: (query: string) => void;
}

type WinampUIContextType = WinampUIState & WinampUIActions;

const WinampUIContext = createContext<WinampUIContextType>(
  {} as WinampUIContextType
);

export const useWinampUI = () => useContext(WinampUIContext);

interface Props {
  children: React.ReactNode;
}

const WinampUIProvider = ({ children }: Props) => {
  const [state, setState] = useState<WinampUIState>({
    windowVisibility: {
      main: true,
      equalizer: true,
      playlist: true,
    },
    focusedWindow: "main",
    browseMode: "queue",
    searchQuery: "",
  });

  const toggleWindow = useCallback((id: WindowId) => {
    setState((prev) => ({
      ...prev,
      windowVisibility: {
        ...prev.windowVisibility,
        [id]: !prev.windowVisibility[id],
      },
    }));
  }, []);

  const setFocusedWindow = useCallback((id: WindowId) => {
    setState((prev) => ({ ...prev, focusedWindow: id }));
  }, []);

  const setBrowseMode = useCallback(
    (mode: WinampUIState["browseMode"]) => {
      setState((prev) => ({ ...prev, browseMode: mode }));
    },
    []
  );

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  return (
    <WinampUIContext.Provider
      value={{
        ...state,
        toggleWindow,
        setFocusedWindow,
        setBrowseMode,
        setSearchQuery,
      }}
    >
      {children}
    </WinampUIContext.Provider>
  );
};

export default WinampUIProvider;
