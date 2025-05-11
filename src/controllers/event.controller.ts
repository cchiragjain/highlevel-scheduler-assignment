import { Request, Response } from "express";
import { db } from "../config/firebase";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { datetime, duration } = req.body;

    const eventsDb = db.collection("events");

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
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal server error",
    });
    return;
  }
};
