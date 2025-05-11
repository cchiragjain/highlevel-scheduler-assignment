import { Router } from "express";
import { createEvent } from "../controllers/create-event.controller";
import { getFreeTimeSlots } from "../controllers/free-slots.controller";
import { listEvents } from "../controllers/list-events.controller";

const router = Router();

router.get("/list-events", listEvents);
router.get("/free-slots", getFreeTimeSlots);
router.post("/events", createEvent);

export default router;
