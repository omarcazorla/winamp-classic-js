import { useCallback, useState } from "react";
import { useWinampUI } from "@/providers/WinampUIProvider";
import WinampButton from "../../shared/WinampButton";
import EqBand from "./EqBand";
import EqGraph from "./EqGraph";

const BANDS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export default function EqualizerWindow() {
  const { focusedWindow, setFocusedWindow, toggleWindow } = useWinampUI();
  const selected = focusedWindow === "equalizer";

  const [eqOn, setEqOn] = useState(true);
  const [preamp, setPreamp] = useState(50);
  const [bandValues, setBandValues] = useState<Record<number, number>>(
    Object.fromEntries(BANDS.map((b) => [b, 50]))
  );

  const handleBandChange = useCallback((band: number, value: number) => {
    setBandValues((prev) => ({ ...prev, [band]: value }));
  }, []);

  const className = [
    "window",
    "draggable",
    selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const allBandValues = [preamp, ...BANDS.map((b) => bandValues[b])];

  return (
    <div
      id="equalizer-window"
      className={className}
      onPointerDown={() => setFocusedWindow("equalizer")}
    >
      <div className="equalizer-top title-bar draggable">
        <div id="eq-buttons" className="clicked">
          <WinampButton id="equalizer-shade" title="Shade Mode" />
          <WinampButton
            id="equalizer-close"
            onClick={() => toggleWindow("equalizer")}
            title="Close Equalizer"
          />
        </div>
      </div>
      <div
        id="on"
        className={eqOn ? "selected" : ""}
        onClick={() => setEqOn(!eqOn)}
      />
      <div id="auto" />
      <EqGraph bandValues={allBandValues} />
      <div id="presets" />
      <div id="preamp-line" />
      <div className="eq-sliders">
        <EqBand id="preamp" value={preamp} onChange={setPreamp} />
        {BANDS.map((hz) => (
          <EqBand
            key={hz}
            id={String(hz)}
            value={bandValues[hz]}
            onChange={(val) => handleBandChange(hz, val)}
          />
        ))}
      </div>
    </div>
  );
}
