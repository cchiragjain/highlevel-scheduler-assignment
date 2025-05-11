import cors from "cors";
import express from "express";
import { rateLimiter } from "./middleware/rate-limiter";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(rateLimiter);
app.use("/api", eventRoutes);

app.get("/test", (req, res) => {
  res.send("Server is running");
});

export default app;
