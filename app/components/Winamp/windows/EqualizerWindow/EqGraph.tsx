import { useEffect, useRef } from "react";
import { VIS_COLORS } from "../../skin/skinConstants";

interface EqGraphProps {
  bandValues: number[];
}

export default function EqGraph({ bandValues }: EqGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the frequency response curve
    ctx.strokeStyle = VIS_COLORS[12]; // Green
    ctx.lineWidth = 1;
    ctx.beginPath();

    const points = bandValues.length;
    for (let i = 0; i < points; i++) {
      const x = (i / (points - 1)) * canvas.width;
      const y = canvas.height - (bandValues[i] / 100) * canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }, [bandValues]);

  return (
    <div id="eqGraph">
      <canvas ref={canvasRef} width={113} height={19} />
    </div>
  );
}
