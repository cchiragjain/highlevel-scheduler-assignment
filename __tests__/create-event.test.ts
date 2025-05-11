import { jest } from "@jest/globals";
const mockCollection = {
  where: jest.fn().mockReturnThis(),
  get: jest.fn(),
  add: jest.fn(),
};

jest.mock("../src/config/firebase.ts", () => ({
  db: {
    collection: jest.fn(() => mockCollection),
  },
}));

// importing after so that the original app does not load
import request from "supertest";
import app from "../src/app";

describe("POST /api/events", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for invalid datetime", async () => {
    const res = await request(app).post("/api/events").send({
      datetime: "not-a-date",
      duration: 30,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(mockCollection.add).not.toHaveBeenCalled();
  });
});
