import request from "supertest";
import app from "../src/app";

describe("Ping", () => {
  it("/test returns 200", async () => {
    const result = await request(app).get("/test");
    expect(result.status).toBe(200);
  });
});
