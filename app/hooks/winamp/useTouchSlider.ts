import { useCallback, useRef } from "react";

interface TouchSliderOptions {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

export default function useTouchSlider({
  min,
  max,
  value,
  onChange,
  orientation = "horizontal",
}: TouchSliderOptions) {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      const updateValue = (clientX: number, clientY: number) => {
        let ratio: number;
        if (orientation === "horizontal") {
          ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        } else {
          ratio =
            1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        }
        const newValue = min + ratio * (max - min);
        onChange(newValue);
      };

      const touch = e.touches[0];
      updateValue(touch.clientX, touch.clientY);

      const handleTouchMove = (moveEvent: TouchEvent) => {
        moveEvent.preventDefault();
        const t = moveEvent.touches[0];
        updateValue(t.clientX, t.clientY);
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [min, max, onChange, orientation]
  );

  return { elementRef, handleTouchStart };
}
