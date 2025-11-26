export const colorGroups = ["gray", "brand", "error", "warning", "success", "blue-gray", "blue-light", "blue", "purple", "pink", "rose", "orange"] as const;
export const colorLevels = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type ColorGroup = (typeof colorGroups)[number];
export type ColorLevel = (typeof colorLevels)[number];
export type ColorVariant = `${ColorGroup}-${ColorLevel}`;
