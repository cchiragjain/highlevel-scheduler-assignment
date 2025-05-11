import { Request, Response } from "express";
import { DateTime } from "luxon";
import { db } from "../config/firebase";

/**
 * @route POST /api/events
 * @desc Create a new event
 * @body datetime (ISO string), duration (in minutes)
 * @returns 200 on success, 422 if overlapping event exists
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { datetime, duration } = req.body;

    const eventsDb = db.collection("events");

    // best to save all in utc and do conversions on runtime
    const requestedStartTime = DateTime.fromISO(datetime, { zone: "utc" });
    const requestedEndTime = requestedStartTime.plus({
      minutes: parseInt(duration),
    });

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
      // check overlap
      if (
        requestedStartTime < existingEnd &&
        requestedEndTime > existingStart
      ) {
        res.status(422).json({ message: "SLot is already booked" });
        return;
      }
    }

    // if reached here means can create
    await eventsDb.add({ datetime, duration });
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
