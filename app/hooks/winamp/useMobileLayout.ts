import { useCallback, useEffect, useState } from "react";

interface MobileLayoutState {
  isMobile: boolean;
  scale: number;
  windowWidth: number;
  windowHeight: number;
}

const WINAMP_WIDTH = 275;

export default function useMobileLayout(): MobileLayoutState {
  const [state, setState] = useState<MobileLayoutState>({
    isMobile: false,
    scale: 1,
    windowWidth: 0,
    windowHeight: 0,
  });

  const calculate = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 600;

    let scale = 1;
    if (isMobile) {
      // Scale to fit width with some padding
      scale = Math.min((w - 16) / WINAMP_WIDTH, 2);
    } else {
      // Desktop: scale up if window is large enough
      const desiredScale = Math.floor(w / (WINAMP_WIDTH + 40));
      scale = Math.max(1, Math.min(desiredScale, 3));
    }

    setState({ isMobile, scale, windowWidth: w, windowHeight: h });
  }, []);

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [calculate]);

  return state;
}
