import express from "express";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());
app.use("/api", eventRoutes);

app.get("/test", (req, res) => {
  res.send("Server is running");
});

export default app;
