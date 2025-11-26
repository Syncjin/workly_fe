export function qs(params?: Record<string, unknown>) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    // Convert value to string, handling primitives and objects
    let strValue: string;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      strValue = String(v);
    } else {
      strValue = JSON.stringify(v);
    }
    q.append(k, strValue);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}