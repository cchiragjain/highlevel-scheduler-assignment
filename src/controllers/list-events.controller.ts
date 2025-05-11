import { Request, Response } from "express";
import { DateTime } from "luxon";
import { z } from "zod";
import { TIMEZONE } from "../config/constants";
import { db } from "../config/firebase";

const listEventsSchema = z.object({
  startDate: z
    .string()
    .refine(
      (v) => DateTime.fromISO(v).isValid,
      "Invalid ISO date-time value for start"
    ),
  endDate: z
    .string()
    .refine(
      (v) => DateTime.fromISO(v).isValid,
      "Invalid ISO date-time value for end"
    ),
});

/**
 * @route GET /api/list-events
 * @desc Returns list of all events for given date range
 * @query startDate=yyyy-mm-dd (required)
 *        endDate=yyyy-mm-dd (required)
 * @returns list of all events
 */
export const listEvents = async (req: Request, res: Response) => {
  try {
    const parsed = listEventsSchema.safeParse(req.query);
    if (parsed.success === false) {
      console.error(parsed.error.format());
      res.status(400).json({
        message: parsed.error.format(),
      });
      return;
    }

    const { startDate, endDate } = parsed.data;

    // check if logically valid dates
    const startLocalTime = DateTime.fromISO(startDate, { zone: TIMEZONE });
    const endLocalTime = DateTime.fromISO(endDate, { zone: TIMEZONE });
    if (startLocalTime >= endLocalTime) {
      res.status(400).json({ message: "startdate must be before enddata" });
      return;
    }

    // convert to utc and get all events from db
    const startInUtc = startLocalTime.toUTC().toISO();
    const endInUtc = endLocalTime.toUTC().toISO();

    const eventsDb = db.collection("events");

    const allEventsInBetween = await eventsDb
      .where("datetime", ">=", startInUtc)
      .where("datetime", "<=", endInUtc)
      .get();

    const allEvents = allEventsInBetween.docs.map((event) => {
      const { datetime, duration } = event.data();

      // calculate end time may help out while creating ui
      const startTime = DateTime.fromISO(datetime, { zone: "utc" }).setZone(
        TIMEZONE
      );
      const endTime = startTime.plus({ minutes: duration });

      return {
        startTime: startTime.toISO(),
        endTime: endTime.toISO(),
        duration,
      };
    });

    res.status(200).json(allEvents);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal server error",
    });
    return;
  }
};
