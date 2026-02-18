import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useEffect, useRef, useState } from "react";

export default function Marquee() {
  const { nowPlayingItem } = useAudioPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number>();

  const text = nowPlayingItem
    ? `${nowPlayingItem.name} - ${nowPlayingItem.artistName}  ***  `
    : "Winamp Classic";

  useEffect(() => {
    setOffset(0);
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      // Scroll at ~30px per second
      const newOffset = (elapsed * 0.03) % (text.length * 5);
      setOffset(newOffset);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (nowPlayingItem) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, nowPlayingItem]);

  // For now, use simple HTML text scrolling. Phase 5 will add character sprites.
  return (
    <div id="marquee" ref={containerRef}>
      <div
        ref={textRef}
        style={{
          position: "absolute",
          whiteSpace: "nowrap",
          transform: `translateX(-${offset}px)`,
          color: "#00FF00",
          fontSize: "8px",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0px",
          textTransform: "uppercase",
          lineHeight: "6px",
        }}
      >
        {text}
        {nowPlayingItem && text}
      </div>
    </div>
  );
}
