import { Router } from "express";
import { createEvent } from "../controllers/event.controller";
import { getFreeTimeSlots } from "../controllers/free-slots.controller";

const router = Router();

router.get("/free-slots", getFreeTimeSlots);
router.post("/events", createEvent);

export default router;
