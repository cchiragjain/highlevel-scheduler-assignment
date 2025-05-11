import { Request, Response } from "express";
import { db } from "../config/firebase";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { datetime, duration } = req.body;

    const eventsDb = db.collection("events");

    // check if existing event exist or not for given datetime (iso)
    const existing = await eventsDb.where("datetime", "==", datetime).get();

    if (existing.empty === false) {
      return res.status(422).json({
        message: "Slot already booked",
      });
    }

    // add new event datetime acts like unique id
    await eventsDb.add({ datetime, duration });

    return res.status(200).json({
      message: "Event Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
