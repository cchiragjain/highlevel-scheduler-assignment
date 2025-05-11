import { DateTime } from "luxon";
import {
  END_HOUR,
  SLOT_DURATION,
  START_HOUR,
  TIMEZONE,
} from "../config/constants";

export const buildSlotsForGivenDate = (date: string): DateTime[] => {
  // get start of the day for the timezone that we are using be deafult
  const startOfDayForCurrentTimeZone = DateTime.fromISO(date, {
    zone: TIMEZONE,
  }).startOf("day");

  // get the working hours
  const workStartTime = startOfDayForCurrentTimeZone.plus({
    hours: START_HOUR,
  });
  const workEndTime = startOfDayForCurrentTimeZone.plus({ hours: END_HOUR });

  const slots: DateTime[] = [];

  for (
    let i = workStartTime;
    i <= workEndTime;
    i = i.plus({ minutes: SLOT_DURATION })
  ) {
    // storing everything in utc but using timezone for local calculations
    slots.push(i.toUTC());
  }

  return slots;
};
