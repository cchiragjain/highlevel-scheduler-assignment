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
const doc = (payload: any) => ({
  id: "doc-id",
  data: () => payload,
});

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
    // TODO: check if can find types
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

  it("rejects booking event if event already overlaps", async () => {
    //@ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [
        doc({
          datetime: "2025-05-11T12:30:00.000Z", // 8:30 in us/eastern firebase stores in uct
          duration: 30,
        }),
      ],
    });

    const res = await request(app).post(route).send({
      datetime: "2025-05-11T08:30:00",
      duration: 55,
    });

    expect(res.status).toBe(422);
  });

  it("rejects 08:00-08:40 booking because it overlaps 08:30-09:00", async () => {
    //@ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [
        doc({
          datetime: "2025-05-11T12:30:00.000Z", // dummy booking from 8:30 - 9
          duration: 30,
        }),
      ],
    });

    const res = await request(app).post(route).send({
      datetime: "2025-05-11T08:00:00",
      duration: 40,
    });

    expect(res.status).toBe(422);
  });

  it("rejects 13:30-14:10 booking because it overlaps 14:00-14:50", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [doc({ datetime: "2025-05-11T18:00:00.000Z", duration: 50 })],
    });

    const res = await request(app).post(route).send({
      datetime: "2025-05-11T13:30:00",
      duration: 40,
    });

    expect(res.status).toBe(422);
  });
});
