import { Request, Response } from "express";
import { DateTime } from "luxon";
import { z } from "zod";
import { SLOT_DURATION, TIMEZONE } from "../config/constants";
import { db } from "../config/firebase";
import { buildSlotsForGivenDate } from "../utils/create-slots";

const getFreeSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  timezone: z.string().optional().default(TIMEZONE), // defaults to one provided in env
});

/**
 * @route GET /api/free-slots
 * @desc Returns list of free time slots for the given date
 * @query date=yyyy-mm-dd (required)
 *        timezone
 * @returns
 */
export const getFreeTimeSlots = async (req: Request, res: Response) => {
  try {
    const parsed = getFreeSlotSchema.safeParse(req.query);
    if (parsed.success === false) {
      console.error(parsed.error.format());
      res.status(400).json({ message: parsed.error.format() });
      return;
    }

    const { date, timezone } = parsed.data;

    const allSlotsInUtc = buildSlotsForGivenDate(date);

    console.log(allSlotsInUtc);

    if (allSlotsInUtc.length === 0) {
      res.status(500).json({ message: "mis configured slot calculation" });
      return;
    }

    const dayStart = allSlotsInUtc[0].startOf("day").toISO();
    const dayEnd = allSlotsInUtc[0].endOf("day").toISO();

    const eventsDb = db.collection("events");

    const allEventsOfThatDay = await eventsDb
      .where("datetime", ">=", dayStart)
      .where("datetime", "<=", dayEnd)
      .get();

    const bookedTimeSlots: {
      start: DateTime;
      end: DateTime;
    }[] = [];

    // get booked time slots for that day
    for (const event of allEventsOfThatDay.docs) {
      const { datetime, duration } = event.data();

      bookedTimeSlots.push({
        start: DateTime.fromISO(datetime, { zone: "utc" }),
        end: DateTime.fromISO(datetime, { zone: "utc" }).plus({
          minutes: duration,
        }),
      });
    }

    // filter out these booked time slots from all slots
    // even if slot duration is 30 default it will filter out things like 14:00 - 14:50
    const freeSlotsInUtc = allSlotsInUtc.filter((slotStart) => {
      const slotEnd = slotStart.plus({ minutes: SLOT_DURATION });
      return !bookedTimeSlots.some(
        ({ start, end }) => slotStart < end && start < slotEnd
      );
    });

    // convert back these free slots to the timezone provided by user
    const result = freeSlotsInUtc.map((freeSlot) =>
      freeSlot.setZone(timezone).toISO()
    );
    res.status(200).json({
      slots: result,
      timezone,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
    return;
  }
};
