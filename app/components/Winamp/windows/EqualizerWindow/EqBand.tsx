import { useCallback, useState } from "react";

interface EqBandProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
}

export default function EqBand({ id, value, onChange }: EqBandProps) {
  const [active, setActive] = useState(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setActive(true);
      const startY = e.clientY;
      const startValue = value;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaY = startY - moveEvent.clientY;
        const newValue = Math.max(0, Math.min(100, startValue + deltaY));
        onChange(newValue);
      };

      const handlePointerUp = () => {
        setActive(false);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [value, onChange]
  );

  // Position the handle based on value (0-100)
  // Band slider area is about 52px tall, handle is 11px
  const handleTop = Math.round((1 - value / 100) * 52);

  return (
    <div
      className={`band band-${id} ${active ? "winamp-active" : ""}`}
      onPointerDown={handlePointerDown}
    >
      <div
        className="slider-handle"
        style={{ top: `${handleTop}px` }}
      />
    </div>
  );
}
