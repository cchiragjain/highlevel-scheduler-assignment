import { Request, Response } from "express";
import { DateTime } from "luxon";
import { z } from "zod";
import { END_HOUR, START_HOUR, TIMEZONE } from "../config/constants";
import { db } from "../config/firebase";

const createEventSchema = z.object({
  datetime: z.string().refine((v) => DateTime.fromISO(v).isValid, {
    message: "Invalid ISO date-time value",
  }),
  duration: z.number().int().positive(),
});

/**
 * @route POST /api/events
 * @desc Create a new event
 * @body datetime (ISO string), duration (in minutes)
 * @returns 200 on success, 400 on invalid input, 422 if overlapping event exists
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const parsed = createEventSchema.safeParse({
      datetime: req.body.datetime,
      duration: Number(req.body.duration),
    });

    if (parsed.success === false) {
      console.error(parsed.error.format());
      res.status(400).json({ message: parsed.error.format() });
      return;
    }

    const { datetime, duration } = parsed.data;

    const startLocalTime = DateTime.fromISO(datetime, { zone: TIMEZONE });
    const endLocalTime = startLocalTime.plus({ minutes: duration });

    // check if these times are inside our working hours window
    if (
      startLocalTime.hour < START_HOUR ||
      endLocalTime.hour > END_HOUR ||
      (endLocalTime.hour === END_HOUR && endLocalTime.minute > 0) // can end up getting time as 16:30 with duration of 45 mins (so will end outside our working hours)
    ) {
      // TODO: Check for correct status code here
      res.status(422).json({ message: "Outside working hours" });
      return;
    }

    const eventsDb = db.collection("events");

    // convert time to utc for checking in db
    const requestedStartTime = startLocalTime.toUTC();
    const requestedEndTime = endLocalTime.toUTC();

    // find all entries that we have already saved for that day using these datetime bounds
    const startOfDay = requestedStartTime.startOf("day").toISO();
    const endOfDay = requestedStartTime.endOf("day").toISO();

    const allEventsOfThatDay = await eventsDb
      .where("datetime", ">=", startOfDay)
      .where("datetime", "<=", endOfDay)
      .get();

    // check if the one we have requested overlaps with already saved or not
    for (const event of allEventsOfThatDay.docs) {
      const { datetime, duration } = event.data();
      const existingStart = DateTime.fromISO(datetime, { zone: "utc" });
      const existingEnd = existingStart.plus({ minutes: duration });

      // console.log({ existingStart, existingEnd });
      // check overlap [a, b) and [c, d) a < d and b > c
      if (
        requestedStartTime < existingEnd &&
        requestedEndTime > existingStart
      ) {
        // can be 409 Conflict as well
        res.status(422).json({ message: "SLot is already booked" });
        return;
      }
    }

    // if reached here means can create
    await eventsDb.add({ datetime: requestedStartTime.toISO(), duration });
    res.status(200).json({ message: "Created event" });
    return;

    /*
    // check if existing event exist or not for given datetime (iso)
    const existing = await eventsDb.where("datetime", "==", datetime).get();

    if (existing.empty === false) {
      // moved return below due to type error with @types/express refer: https://stackoverflow.com/questions/79089002/setting-up-express-with-typescript-no-overload-matches-this-call
      // no return will cause to be added again
      res.status(422).json({
        message: "Slot already booked",
      });
      return;
    }

    // add new event datetime acts like unique id
    await eventsDb.add({ datetime, duration });

    res.status(200).json({
      message: "Event Created Successfully",
    });
    return; */
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal server error",
    });
    return;
  }
};
