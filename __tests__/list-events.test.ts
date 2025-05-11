import { jest } from "@jest/globals";

const mockCollection = {
  where: jest.fn().mockReturnThis(),
  get: jest.fn(),
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

import request from "supertest";
import app from "../src/app";

const route = "/api/list-events";

const UTC_0830 = "2025-05-11T12:30:00.000Z"; // 8:30 eastern us
const UTC_1400 = "2025-05-11T18:00:00.000Z"; // 14:00 easter us

describe(`GET ${route}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists events if exists", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [
        doc({ datetime: UTC_0830, duration: 30 }),
        doc({ datetime: UTC_1400, duration: 50 }),
      ],
    });

    const res = await request(app).get(route).query({
      startDate: "2025-05-11T00:00:00",
      endDate: "2025-05-12T00:00:00",
    });

    expect(res.status).toBe(200);

    expect(res.body[0].startTime).toMatch(/T08:30/);
    expect(res.body[0].endTime).toMatch(/T09:00/);

    expect(res.body[1].startTime).toMatch(/T14:00/);
    expect(res.body[1].endTime).toMatch(/T14:50/);
  });

  it("returns empty array when no events", async () => {
    //@ts-ignore
    mockCollection.get.mockResolvedValueOnce({ docs: [] });

    const res = await request(app).get(route).query({
      startDate: "2025-05-15T00:00:00",
      endDate: "2025-05-16T00:00:00",
    });

    console.log(res.status);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 400 in case end >= start", async () => {
    const res = await request(app).get(route).query({
      startDate: "2025-05-11T00:00:00",
      endDate: "2025-05-11T00:00:00",
    });

    expect(res.status).toBe(400);
  });
});
