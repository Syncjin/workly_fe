import { style } from "@vanilla-extract/css";

export const colorGroups = ["gray", "brand", "error", "warning", "success", "blue-gray", "blue-light", "blue", "purple", "pink", "rose", "orange"] as const;

export const colorLevels = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type ColorGroup = (typeof colorGroups)[number];
export type ColorLevel = (typeof colorLevels)[number];
export type ColorVariant = `${ColorGroup}-${ColorLevel}`;

export function createColorVariantStyles(colorGroups: readonly string[], colorLevels: readonly (string | number)[], styleFn: (group: string, level: string | number) => Parameters<typeof style>[0]) {
  const result: Record<string, string> = {};
  colorGroups.forEach((group) => {
    colorLevels.forEach((level) => {
      const key = `${group}-${level}`;
      result[key] = style(styleFn(group, level));
    });
  });
  return result;
}
