/** The colour roles, mirrored from src/app/globals.css for the design system page (a test keeps the two in step). */
export const COLOR = {
  page: "#fff8ea",
  surface: "#ffffff",
  ink: "#2f2a24",
  muted: "#6b6256",
  line: "#8f8068",
  hairline: "#e3d7bf",
  primary: "#3ec66b",
  lip: "#2a8f4e",
  reward: "#f5a623",
  rewardDeep: "#c97e0c",
  rewardSoft: "#fff1cf",
  sky: "#5aa9e6",
  flag: "#e2574b",
  danger: "#9c2a6b",
} as const;

export type Check = [what: string, fg: string, bg: string];

export interface ColorRole {
  role: string;
  hex: string;
  use: string;
  /** Pairs whose contrast is shown under the swatch. */
  checks: Check[];
}

export const COLOR_ROLES: ColorRole[] = [
  { role: "Background", hex: COLOR.page, use: "The warm page behind everything", checks: [] },
  { role: "Surface", hex: COLOR.surface, use: "Pressable rows, inputs, Titi's bubbles", checks: [] },
  { role: "Text", hex: COLOR.ink, use: "Everything you read first", checks: [["on the page", COLOR.ink, COLOR.page], ["on surface", COLOR.ink, COLOR.surface]] },
  { role: "Muted text", hex: COLOR.muted, use: "Labels, hints, the second line", checks: [["on the page", COLOR.muted, COLOR.page], ["on surface", COLOR.muted, COLOR.surface]] },
  { role: "Border", hex: COLOR.line, use: "The edge of inputs (3:1); hairlines divide sections", checks: [["on the page", COLOR.line, COLOR.page]] },
  { role: "Accent", hex: COLOR.primary, use: "Grass green, the one primary action on a screen", checks: [["text on it", COLOR.ink, COLOR.primary]] },
  { role: "Reward", hex: COLOR.reward, use: "Honey: fish treats, the streak, every progress bar", checks: [["text on it", COLOR.ink, COLOR.reward]] },
  { role: "Error", hex: COLOR.danger, use: "Errors and Remove, nothing else", checks: [["on the page", COLOR.danger, COLOR.page]] },
];

/** Painted or decorative colours: never text, never an action. */
export const DECOR = [
  { name: "Sky", hex: COLOR.sky, use: "Titi's bowl" },
  { name: "Flag", hex: COLOR.flag, use: "The finish flag on Titi's road" },
] as const;
