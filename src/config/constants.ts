export const TIMEZONE = process.env.TIMEZONE ?? "US/Eastern";
export const START_HOUR = Number(process.env.START_HOUR ?? 8); // 08:00
export const END_HOUR = Number(process.env.END_HOUR ?? 17); // 17:00
export const SLOT_DURATION = Number(process.env.SLOT_DURATION ?? 30); // minutes

// taken from shared excel
