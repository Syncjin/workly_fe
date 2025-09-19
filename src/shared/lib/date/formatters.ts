import { dayjs, DEFAULT_TZ } from "@/shared/lib/dayjs";

/** 오늘이면 HH:mm, 같은 해면 MM.DD, 아니면 YYYY.MM.DD */
export function formatDayOrTime(iso: string, tz: string = DEFAULT_TZ) {
  return formatDateCustom(iso, { tz, today: "HH:mm", sameYear: "MM.DD", other: "YYYY.MM.DD" });
}

/** YYYY.MM.DD */
export function formatYMD(iso: string, tz: string = DEFAULT_TZ, sep = ".") {
  if (!iso) return "";
  const d = dayjs.utc(iso).tz(tz);
  const fmt = `YYYY${sep}MM${sep}DD`;
  return d.format(fmt);
}

/** 프리셋 가능한 스마트 포맷터 */
export function formatDateCustom(iso: string, opts: { tz?: string; today: string; other: string; sameYear?: string }) {
  if (!iso) return "";
  const tz = opts.tz ?? DEFAULT_TZ;
  const d = dayjs.utc(iso).tz(tz);
  const now = dayjs().tz(tz);

  if (d.isSame(now, "day")) return d.format(opts.today);
  if (opts.sameYear && d.isSame(now, "year")) return d.format(opts.sameYear);
  return d.format(opts.other);
}

/** 필요 시 커스텀 프리셋을 함수로 생성 */
export function createDateFormatter(preset: { today: string; other: string; sameYear?: string; tz?: string }) {
  return (iso: string) => formatDateCustom(iso, preset);
}
