import { useCallback, useRef, useState } from "react";

interface WinampButtonProps {
  id?: string;
  className?: string;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  title?: string;
}

/**
 * A button that adds the "winamp-active" class while pressed.
 * This class is used by the skin CSS to show the pressed state sprite.
 */
export default function WinampButton({
  id,
  className,
  onClick,
  onMouseDown,
  onMouseUp,
  children,
  title,
}: WinampButtonProps) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setActive(true);
      onMouseDown?.(e as unknown as React.MouseEvent);

      const handlePointerUp = () => {
        setActive(false);
        document.removeEventListener("pointerup", handlePointerUp);
      };
      document.addEventListener("pointerup", handlePointerUp);
    },
    [onMouseDown]
  );

  const handleClick = useCallback(() => {
    onClick?.();
    onMouseUp?.({} as React.MouseEvent);
  }, [onClick, onMouseUp]);

  const classes = [className, active ? "winamp-active" : "", "clicked"]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      id={id}
      className={classes}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      title={title}
    >
      {children}
    </div>
  );
}
