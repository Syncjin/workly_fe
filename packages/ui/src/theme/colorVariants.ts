export const buildVariantMap = <T>(
  groups: readonly (string|number)[],
  levels: readonly (string|number)[],
  fn: (g: string|number, l: string|number) => T
) => {
  const acc: Record<string, T> = {};
  for (const g of groups) for (const l of levels) acc[`${g}-${l}`] = fn(g, l);
  return acc;
};
