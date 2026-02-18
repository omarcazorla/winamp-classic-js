import { APP_URL } from "@/utils/constants/api";

const SKIN_BASE = `${APP_URL}/winamp/skins/base`;

export const SKIN_SPRITES: Record<string, string> = {
  BALANCE: `${SKIN_BASE}/balance.png`,
  CBUTTONS: `${SKIN_BASE}/cbuttons.png`,
  EQMAIN: `${SKIN_BASE}/eqmain.png`,
  EQ_EX: `${SKIN_BASE}/eq_ex.png`,
  GEN: `${SKIN_BASE}/gen.png`,
  MAIN: `${SKIN_BASE}/main.png`,
  MONOSTER: `${SKIN_BASE}/monoster.png`,
  NUMBERS: `${SKIN_BASE}/numbers.png`,
  PLAYPAUS: `${SKIN_BASE}/playpaus.png`,
  PLEDIT: `${SKIN_BASE}/pledit.png`,
  POSBAR: `${SKIN_BASE}/posbar.png`,
  SHUFREP: `${SKIN_BASE}/shufrep.png`,
  TEXT: `${SKIN_BASE}/text.png`,
  TITLEBAR: `${SKIN_BASE}/titlebar.png`,
  VOLUME: `${SKIN_BASE}/volume.png`,
};

export const PLAYLIST_COLORS = {
  normal: "#00FF00",
  current: "#FFFFFF",
  normalbg: "#000000",
  selectedbg: "#0000FF",
  font: "Arial",
};

export const VIS_COLORS = [
  "rgb(0,0,0)",
  "rgb(24,33,41)",
  "rgb(239,49,16)",
  "rgb(206,41,16)",
  "rgb(214,90,0)",
  "rgb(214,102,0)",
  "rgb(214,115,0)",
  "rgb(198,123,8)",
  "rgb(222,165,24)",
  "rgb(214,181,33)",
  "rgb(189,222,41)",
  "rgb(148,222,33)",
  "rgb(41,206,16)",
  "rgb(50,190,16)",
  "rgb(57,181,16)",
  "rgb(49,156,8)",
  "rgb(41,148,0)",
  "rgb(24,132,8)",
  "rgb(255,255,255)",
  "rgb(214,214,222)",
  "rgb(181,189,189)",
  "rgb(160,170,175)",
  "rgb(148,156,165)",
  "rgb(150,150,150)",
];
