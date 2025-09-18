import dayjsBase from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjsBase.extend(utc);
dayjsBase.extend(timezone);
// dayjsBase.tz.setDefault("Asia/Seoul");

export const dayjs = dayjsBase;
export const DEFAULT_TZ = "Asia/Seoul";
