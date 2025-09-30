import { createVar, keyframes, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, type ColorVariant } from "../../theme/colorTokens";
import { components } from "../../theme/layers.css";
export const btnBg = createVar();
export const btnFg = createVar();
export const btnBorder = createVar();
export const btnBgHover = createVar();
export const btnFgMuted = createVar();

const baseLayered = style({
  "@layer": {
    [components]: {
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Pretendard, sans-serif",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
      whiteSpace: "nowrap",
      position: "relative",
      backgroundColor: btnBg,
      color: btnFg,
      border: `1px solid ${btnBorder}`,
      // 공통 상태
      selectors: {
        "&:hover": { backgroundColor: btnBgHover },
        "&:disabled, &[data-loading]": {
          cursor: "not-allowed",
        },
        "&:focus": { outline: "none" },
        // "@media": {
        //   "(prefers-reduced-motion: reduce)": {
        //     transition: "none",
        //   },
        // },
      },
    },
  },
});

export const sizeVariants = styleVariants({
  sm: { padding: "8px 14px", fontSize: "14px", lineHeight: "20px" },
  md: { padding: "10px 16px", fontSize: "14px", lineHeight: "20px" },
  lg: { padding: "10px 18px", fontSize: "16px", lineHeight: "24px" },
  xl: { padding: "12px 20px", fontSize: "16px", lineHeight: "24px" },
});

export type ButtonVariant = "solid" | "light" | "border" | "ghost" | "link";
export type ButtonColor = ColorVariant;

export const buttonContent = style({
  columnGap: "8px",
});

export const iconSlot = style({
  "@layer": {
    [components]: {
      display: "flex",
      width: "2em",
      height: "2em",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  },
});

export const label = style({
  "@layer": {
    [components]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      columnGap: "8px",
    },
  },
});

export const replaceWrap = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
});

export const overlay = style({
  "@layer": {
    [components]: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    },
  },
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const spin1s = style({
  "@layer": {
    [components]: {
      display: "inline-block",
      animation: `${spin} 1s linear infinite`,
      "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
    },
  },
});

const TONES = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
type Tone = (typeof TONES)[number];

const toneStep = (level: Tone, delta: number): Tone => {
  const i = Math.max(0, Math.min(TONES.length - 1, TONES.indexOf(level) + delta));
  return TONES[i];
};

const textOn = (level: Tone) => (level >= 500 ? "#fff" : `var(--color-gray-900)`);

function mapSolid(group: string, level: Tone) {
  return {
    vars: {
      [btnBg]: `var(--color-${group}-${level})`,
      [btnBgHover]: `var(--color-${group}-${toneStep(level, +1)})`,
      [btnBorder]: "transparent",
      [btnFg]: textOn(level),
      [btnFgMuted]: `var(--color-${group}-${toneStep(level, -3)})`,
    },
    border: "none",
    selectors: {
      "&:focus-visible": {
        boxShadow: `
          0 0 0 4px var(--color-blue-50),
          0 1px 2px 0 rgba(10, 13, 18, 0.05)
        `,
      },
      "&:disabled, &[data-loading]": {
        vars: {
          [btnBg]: `var(--color-${group}-${toneStep(level, -3)})`,
          [btnBgHover]: `var(--color-${group}-${toneStep(level, -3)})`,
          [btnFg]: level >= 500 ? "rgba(255,255,255,0.7)" : `var(--color-gray-400)`,
        },
      },
    },
  } as const;
}

function mapLight(group: string, _level: Tone) {
  return {
    vars: {
      [btnBg]: `var(--color-${group}-50)`,
      [btnBgHover]: `var(--color-${group}-100)`,
      [btnBorder]: "transparent",
      [btnFg]: `var(--color-${group}-700)`,
      [btnFgMuted]: `var(--color-${group}-300)`,
    },
    border: "none",
    selectors: {
      "&:focus-visible": {
        boxShadow: `
          0 0 0 4px var(--color-blue-50),
          0 1px 2px 0 rgba(10, 13, 18, 0.05)
        `,
      },
      "&:disabled, &[data-loading]": {
        vars: {
          [btnBg]: `var(--color-${group}-25)`,
          [btnBgHover]: `var(--color-${group}-25)`,
          [btnFg]: `var(--color-${group}-300)`,
        },
      },
    },
  } as const;
}

function mapBorder(group: string, _level: Tone) {
  return {
    vars: {
      [btnBg]: "transparent",
      [btnBgHover]: `var(--color-${group}-50)`,
      [btnBorder]: `var(--color-${group}-300)`,
      [btnFg]: `var(--color-${group}-700)`,
      [btnFgMuted]: `var(--color-${group}-300)`,
    },
    selectors: {
      "&:not(:disabled):hover": { backgroundColor: `var(--color-${group}-50)` },
      "&:focus-visible": {
        boxShadow: `
          0 0 0 4px var(--color-gray-50),
          0 1px 2px 0 rgba(10, 13, 18, 0.05)
        `,
      },
      "&:disabled, &[data-loading]": {
        vars: {
          [btnBorder]: `var(--color-${group}-200)`,
          [btnFg]: `var(--color-${group}-300)`,
        },
      },
    },
  } as const;
}

function mapGhost(group: string, _level: Tone) {
  return {
    vars: {
      [btnBg]: "transparent",
      [btnBgHover]: `var(--color-${group}-50)`,
      [btnBorder]: "transparent",
      [btnFg]: `var(--color-${group}-700)`,
      [btnFgMuted]: `var(--color-gray-300)`,
    },
    border: "none",
    selectors: {
      "&:focus-visible": {
        boxShadow: `
          0 0 0 4px var(--color-gray-50),
          0 1px 2px 0 rgba(10, 13, 18, 0.05)
        `,
      },
    },
  } as const;
}

function mapLink(group: string, _level: Tone) {
  return {
    vars: {
      [btnBg]: "transparent",
      [btnBgHover]: "transparent",
      [btnBorder]: "transparent",
      [btnFg]: `var(--color-${group}-700)`,
      [btnFgMuted]: `var(--color-gray-300)`,
    },
    padding: 0,
    border: "none",
    selectors: {
      "&:hover": { color: `var(--color-${group}-700)` },
    },
  } as const;
}

function styleFor(variant: ButtonVariant, color: ButtonColor) {
  const [group, lvl] = color.split("-") as [string, string];
  const level = Number(lvl) as Tone;

  switch (variant) {
    case "solid":
      return mapSolid(group, level);
    case "light":
      return mapLight(group, level);
    case "border":
      return mapBorder(group, level);
    case "ghost":
      return mapGhost(group, level);
    case "link":
      return mapLink(group, level);
  }
}

const placeholder = style({});

export const buttonRecipe = recipe({
  base: [baseLayered],
  variants: {
    size: sizeVariants,
    variant: {
      solid: style({}),
      light: style({}),
      border: style({}),
      ghost: style({}),
      link: style({}),
    },
    color: Object.fromEntries(colorGroups.flatMap((group) => colorLevels.map((level) => [`${group}-${level}`, placeholder]))) as Record<ButtonColor, string>,
  },
  compoundVariants: (() => {
    const list: { variants: { variant: ButtonVariant; color: ButtonColor }; style: any }[] = [];
    (["solid", "light", "border", "ghost", "link"] as ButtonVariant[]).forEach((variant) => {
      colorGroups.forEach((group) => {
        colorLevels.forEach((level) => {
          const color = `${group}-${level}` as ButtonColor;
          list.push({
            variants: { variant, color },
            style: styleFor(variant, color),
          });
        });
      });
    });
    return list;
  })(),
  defaultVariants: {
    size: "md",
    variant: "solid",
    color: "brand-600",
  },
});
