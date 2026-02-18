import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useEffect, useRef } from "react";
import { VIS_COLORS } from "../../skin/skinConstants";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playbackInfo } = useAudioPlayer();
  const animFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = VIS_COLORS[0];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (playbackInfo.isPlaying) {
        // Simple oscilloscope-like visualization
        const barCount = 19;
        const barWidth = 3;
        const gap = 1;

        for (let i = 0; i < barCount; i++) {
          const height =
            Math.sin(Date.now() / 200 + i * 0.5) * 0.4 +
            Math.sin(Date.now() / 300 + i * 0.8) * 0.3 +
            0.5;
          const barHeight = Math.floor(height * canvas.height);
          const colorIndex = Math.floor(
            (1 - height) * (VIS_COLORS.length - 1)
          );
          const x = i * (barWidth + gap);

          for (let y = 0; y < barHeight; y += 2) {
            const ci = Math.min(
              VIS_COLORS.length - 1,
              Math.floor(
                (y / canvas.height) * (VIS_COLORS.length - 2)
              ) + 2
            );
            ctx.fillStyle = VIS_COLORS[ci];
            ctx.fillRect(x, canvas.height - y - 1, barWidth, 1);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [playbackInfo.isPlaying]);

  return (
    <div id="visualizer">
      <canvas ref={canvasRef} width={76} height={16} />
    </div>
  );
}
