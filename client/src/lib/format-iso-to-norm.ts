import { DateTime } from "luxon";

export const formatISOToHourMinute = (isoString: string): string => {
  return DateTime.fromISO(isoString, { setZone: true }).toFormat("h:mm a");
};

export const formatISOToDate = (isoString: string) => {
  const dt = DateTime.fromISO(isoString, { setZone: true });
  return dt.toFormat("MMMM d, yyyy");
};
