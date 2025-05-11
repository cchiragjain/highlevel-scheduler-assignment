import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

// refer: https://www.npmjs.com/package/express-rate-limit
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false, // drop X-RateLimit-* headers
  message: (req: Request, res: Response) =>
    `Too many requests from ${req.ip}. Please try again later.`,
});
