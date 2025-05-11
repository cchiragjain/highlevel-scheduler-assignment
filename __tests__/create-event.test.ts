import { jest } from "@jest/globals";
const mockCollection = {
  where: jest.fn().mockReturnThis(),
  get: jest.fn(),
  add: jest.fn(),
};

jest.mock("../src/config/firebase", () => ({
  db: {
    collection: jest.fn(() => mockCollection),
  },
}));

// importing after so that the original app does not load
import request from "supertest";
import app from "../src/app";

const route = "/api/events";

describe(`POST ${route}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for invalid datetime", async () => {
    const res = await request(app).post(route).send({
      datetime: "not-a-date",
      duration: 30,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(mockCollection.add).not.toHaveBeenCalled();
  });

  it("returns 400 when duration is negative", async () => {
    const res = await request(app).post(route).send({
      datetime: "2025-05-11T08:30:00",
      duration: -10,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  // in env for now start time is defined as 8
  it("rejects booking before work start time", async () => {
    const res = await request(app).post(route).send({
      datetime: "2025-05-11T07:30:00",
      duration: "60",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
  });

  // in env for now start time is defined as 8
  it("rejects booking after work end time", async () => {
    const res = await request(app).post(route).send({
      datetime: "2025-05-11T17:00:00",
      duration: "30",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
  });

  it("creates event when correct values are passed", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({ docs: [] });
    // @ts-ignore
    mockCollection.add.mockResolvedValueOnce({ id: "test-id" });

    const res = await request(app).post(route).send({
      datetime: "2025-05-11T08:30:00",
      duration: 30,
    });

    expect(res.status).toBe(200);
  });
});
