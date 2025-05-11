export const DEFAULT_TIMEZONE =
  process.env.DEFAULT_TIMEZONE || "America/Los_Angeles";
export const START_HOUR = Number(process.env.START_HOUR ?? 10); // 10 am
export const END_HOUR = Number(process.env.END_HOUR ?? 17); // 5 pm
export const SLOT_DURATION = Number(process.env.SLOT_DURATION ?? 30); // in minutes
