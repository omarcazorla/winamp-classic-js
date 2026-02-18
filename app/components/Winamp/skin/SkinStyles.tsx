/**
 * SkinStyles - Injects dynamic CSS that maps Winamp skin sprite sheets
 * to DOM elements via background-image and background-position.
 *
 * Adapted from webamp's Skin.tsx + skinSelectors.ts approach,
 * but using sprite sheets served as static PNGs instead of extracted data URIs.
 */
import { SKIN_SPRITES } from "./skinConstants";

const CSS_PREFIX = "#winamp";

/**
 * Maps sprite sheet name → CSS selector → sprite coordinates.
 * For sprite sheets, we use background-image with background-position.
 */
function generateSpriteCSS(): string {
  const rules: string[] = [];
  const s = SKIN_SPRITES;

  const rule = (selector: string, sheet: string, x = 0, y = 0) => {
    rules.push(
      `${CSS_PREFIX} ${selector} { background-image: url(${sheet}); background-position: -${x}px -${y}px; background-repeat: no-repeat; }`
    );
  };

  const ruleRaw = (selector: string, css: string) => {
    rules.push(`${CSS_PREFIX} ${selector} { ${css} }`);
  };

  // === MAIN WINDOW ===
  rule("#main-window", s.MAIN);
  rule("#title-bar", s.TITLEBAR, 27, 15);
  rule(".selected #title-bar", s.TITLEBAR, 27, 0);

  // Title bar buttons
  rule(".selected #title-bar #option.clicked", s.TITLEBAR, 0, 0);
  rule(".selected #title-bar #option:active, .selected #title-bar #option.selected", s.TITLEBAR, 0, 9);
  rule(".selected #title-bar #minimize.clicked", s.TITLEBAR, 9, 0);
  rule(".selected #title-bar #minimize.winamp-active", s.TITLEBAR, 9, 9);
  rule(".selected #title-bar #shade.clicked", s.TITLEBAR, 0, 18);
  rule(".selected #title-bar #shade.winamp-active", s.TITLEBAR, 9, 18);
  rule(".selected #title-bar #close.clicked", s.TITLEBAR, 18, 0);
  rule(".selected #title-bar #close.winamp-active", s.TITLEBAR, 18, 9);

  // Clutter bar
  rule("#clutter-bar", s.TITLEBAR, 304, 0);

  // Play/Pause/Stop indicators
  rule(".play #play-pause", s.PLAYPAUS, 0, 0);
  rule(".pause #play-pause", s.PLAYPAUS, 9, 0);
  rule(".stop #play-pause", s.PLAYPAUS, 18, 0);
  rule("#work-indicator", s.PLAYPAUS, 36, 0);
  rule("#work-indicator.selected", s.PLAYPAUS, 39, 0);

  // Time digits (NUMBERS.BMP)
  for (let i = 0; i <= 9; i++) {
    rule(`.digit-${i}`, s.NUMBERS, i * 9, 0);
  }
  rule("#time #minus-sign", s.NUMBERS, 9, 6);
  rule("#time.countdown #minus-sign", s.NUMBERS, 20, 6);

  // Marquee text (TEXT.BMP) - character sprites
  const fontLookup: Record<string, [number, number]> = {
    a: [0, 0], b: [0, 1], c: [0, 2], d: [0, 3], e: [0, 4],
    f: [0, 5], g: [0, 6], h: [0, 7], i: [0, 8], j: [0, 9],
    k: [0, 10], l: [0, 11], m: [0, 12], n: [0, 13], o: [0, 14],
    p: [0, 15], q: [0, 16], r: [0, 17], s: [0, 18], t: [0, 19],
    u: [0, 20], v: [0, 21], w: [0, 22], x: [0, 23], y: [0, 24],
    z: [0, 25], '"': [0, 26], "@": [0, 27], " ": [0, 30],
    "0": [1, 0], "1": [1, 1], "2": [1, 2], "3": [1, 3], "4": [1, 4],
    "5": [1, 5], "6": [1, 6], "7": [1, 7], "8": [1, 8], "9": [1, 9],
    ".": [1, 11], ":": [1, 12], "(": [1, 13], ")": [1, 14],
    "-": [1, 15], "'": [1, 16], "!": [1, 17], _: [1, 18],
    "+": [1, 19], "/": [1, 21], "[": [1, 22], "]": [1, 23],
    "&": [1, 25], "%": [1, 26], ",": [1, 27], "=": [1, 28],
    "#": [1, 30], "?": [2, 3], "*": [2, 4],
  };
  for (const [char, [row, col]] of Object.entries(fontLookup)) {
    const code = char.charCodeAt(0);
    rule(`.character-${code}`, s.TEXT, col * 5, row * 6);
  }

  // MonoStereo (MONOSTER.BMP)
  rule(".media-info #stereo, .stop .media-info #stereo.selected", s.MONOSTER, 0, 12);
  rule(".media-info #stereo.selected", s.MONOSTER, 0, 0);
  rule(".media-info #mono, .stop .media-info #mono.selected", s.MONOSTER, 29, 12);
  rule(".media-info #mono.selected", s.MONOSTER, 29, 0);

  // Volume (VOLUME.BMP)
  rule("#volume", s.VOLUME, 0, 0);
  const volumeThumb = `background-image: url(${s.VOLUME}); background-position: -15px -422px; background-repeat: no-repeat;`;
  ruleRaw("#volume input::-webkit-slider-thumb", volumeThumb);
  ruleRaw("#volume input::-moz-range-thumb", volumeThumb);
  const volumeThumbActive = `background-image: url(${s.VOLUME}); background-position: 0px -422px; background-repeat: no-repeat;`;
  ruleRaw("#volume input:active::-webkit-slider-thumb", volumeThumbActive);
  ruleRaw("#volume input:active::-moz-range-thumb", volumeThumbActive);

  // Balance (BALANCE.BMP)
  rule("#balance", s.BALANCE, 9, 0);
  const balThumb = `background-image: url(${s.BALANCE}); background-position: -15px -422px; background-repeat: no-repeat;`;
  ruleRaw("#balance::-webkit-slider-thumb", balThumb);
  ruleRaw("#balance::-moz-range-thumb", balThumb);

  // Position (POSBAR.BMP)
  rule("#position", s.POSBAR, 0, 0);
  const posThumb = `background-image: url(${s.POSBAR}); background-position: -248px 0px; background-repeat: no-repeat;`;
  ruleRaw("#position::-webkit-slider-thumb", posThumb);
  ruleRaw("#position::-moz-range-thumb", posThumb);
  const posThumbActive = `background-image: url(${s.POSBAR}); background-position: -278px 0px; background-repeat: no-repeat;`;
  ruleRaw("#position:active::-webkit-slider-thumb", posThumbActive);
  ruleRaw("#position:active::-moz-range-thumb", posThumbActive);

  // Action Buttons (CBUTTONS.BMP)
  rule(".actions #previous", s.CBUTTONS, 0, 0);
  rule(".actions #previous.winamp-active", s.CBUTTONS, 0, 18);
  rule(".actions #play", s.CBUTTONS, 23, 0);
  rule(".actions #play.winamp-active", s.CBUTTONS, 23, 18);
  rule(".actions #pause", s.CBUTTONS, 46, 0);
  rule(".actions #pause.winamp-active", s.CBUTTONS, 46, 18);
  rule(".actions #stop", s.CBUTTONS, 69, 0);
  rule(".actions #stop.winamp-active", s.CBUTTONS, 69, 18);
  rule(".actions #next", s.CBUTTONS, 92, 0);
  rule(".actions #next.winamp-active", s.CBUTTONS, 92, 18);
  rule("#eject", s.CBUTTONS, 114, 0);
  rule("#eject.winamp-active", s.CBUTTONS, 114, 16);

  // Shuffle/Repeat (SHUFREP.BMP)
  rule("#shuffle", s.SHUFREP, 28, 0);
  rule("#shuffle.winamp-active", s.SHUFREP, 28, 15);
  rule("#shuffle.selected", s.SHUFREP, 28, 30);
  rule("#shuffle.selected.winamp-active", s.SHUFREP, 28, 45);
  rule("#repeat", s.SHUFREP, 0, 0);
  rule("#repeat.winamp-active", s.SHUFREP, 0, 15);
  rule("#repeat.selected", s.SHUFREP, 0, 30);
  rule("#repeat.selected.winamp-active", s.SHUFREP, 0, 45);

  // EQ/PL toggle buttons (SHUFREP.BMP)
  rule("#equalizer-button", s.SHUFREP, 0, 61);
  rule("#equalizer-button.selected", s.SHUFREP, 0, 73);
  rule("#equalizer-button.winamp-active", s.SHUFREP, 46, 61);
  rule("#playlist-button", s.SHUFREP, 23, 61);
  rule("#playlist-button.selected", s.SHUFREP, 23, 73);
  rule("#playlist-button.winamp-active", s.SHUFREP, 69, 61);

  // === EQUALIZER WINDOW ===
  rule("#equalizer-window:not(.shade)", s.EQMAIN, 0, 0);
  rule(".equalizer-top", s.EQMAIN, 0, 149);
  rule(".selected .equalizer-top", s.EQMAIN, 0, 134);
  rule(".band", s.EQMAIN, 13, 164);
  rule(".band .slider-handle", s.EQMAIN, 0, 164);
  rule(".band.winamp-active .slider-handle", s.EQMAIN, 0, 176);
  rule("#on", s.EQMAIN, 10, 119);
  rule("#on.winamp-active", s.EQMAIN, 128, 119);
  rule("#on.selected", s.EQMAIN, 69, 119);
  rule("#on.selected.winamp-active", s.EQMAIN, 187, 119);
  rule("#auto", s.EQMAIN, 36, 119);
  rule("#auto.winamp-active", s.EQMAIN, 154, 119);
  rule("#auto.selected", s.EQMAIN, 95, 119);
  rule("#auto.selected.winamp-active", s.EQMAIN, 213, 119);
  rule("#eqGraph", s.EQMAIN, 0, 294);
  rule("#presets", s.EQMAIN, 224, 164);
  rule("#presets.winamp-active", s.EQMAIN, 224, 176);
  rule("#preamp-line", s.EQMAIN, 0, 314);
  rule("#equalizer-window.selected #eq-buttons.clicked #equalizer-close", s.EQMAIN, 0, 116);
  rule("#equalizer-window.selected #eq-buttons.clicked #equalizer-close.winamp-active", s.EQMAIN, 0, 125);

  // EQ shade (EQ_EX.BMP)
  rule("#equalizer-window.shade", s.EQ_EX, 0, 15);
  rule("#equalizer-window.shade.selected", s.EQ_EX, 0, 0);

  return rules.join("\n");
}

const skinCSS = generateSpriteCSS();

export default function SkinStyles() {
  return <style id="winamp-skin" dangerouslySetInnerHTML={{ __html: skinCSS }} />;
}
