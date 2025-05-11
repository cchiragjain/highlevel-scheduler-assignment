// all default values taken from shared excel
export const TIMEZONE = process.env.TIMEZONE ?? "US/Eastern";
export const START_HOUR = Number(process.env.START_HOUR ?? 8); // 8am
export const END_HOUR = Number(process.env.END_HOUR ?? 17); // 5pm
export const SLOT_DURATION = Number(process.env.SLOT_DURATION ?? 30); // minutes
