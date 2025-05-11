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

const route = "/api/free-slots";
const DATE = "2025-05-11";
const TIMEZONE = "Asia/Kolkata";
const UTC_0830 = "2025-05-11T12:30:00.000Z"; // 08:30 Eastern us
const UTC_1400 = "2025-05-11T18:00:00.000Z"; // 14:00 Eastern us

describe(`GET ${route}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 19 slots for an empty day with deafult timezone", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({ docs: [] });

    const res = await request(app).get(route).query({ date: DATE });

    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body.slots.length).toBe(19);
    expect(res.body.slots[0]).toMatch(/T08:00/);
    expect(res.body.slots.at(-1)).toMatch(/T17:00/);
  });

  it("returns 19 slots for an empty day with other timezone", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({ docs: [] });

    const res = await request(app)
      .get(route)
      .query({ date: DATE, timezone: TIMEZONE });

    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.slots.length).toBe(19);
    expect(res.body.slots[0]).toMatch(/T17:30/); // adjusting for ist    expect(res.body.slots.at(-1)).toMatch(/T02:30/);
  });

  it("excludes 08:30 if there's an existing booking at that time", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [
        doc({
          datetime: UTC_0830,
          duration: 30,
        }),
      ],
    });

    const res = await request(app).get(route).query({ date: DATE });

    expect(res.status).toBe(200);
    expect(res.body.slots.length).toBe(18);
    expect(res.body.slots).not.toContain(expect.stringMatching(/08:30/));
  });

  it("excludes 14:00 and 14:30 if 14:00-14:50 booking exists", async () => {
    // @ts-ignore
    mockCollection.get.mockResolvedValueOnce({
      docs: [
        doc({ datetime: UTC_0830, duration: 30 }),
        doc({ datetime: UTC_1400, duration: 50 }),
      ],
    });

    const res = await request(app).get(route).query({ date: DATE });

    expect(res.status).toBe(200);

    console.log(res.body.slots);

    expect(res.body.slots.length).toBe(16); // 19 slots if blocking 3 then there should be 16 left
    expect(res.body.slots).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/14:00/),
        expect.stringMatching(/08:30/),
        expect.stringMatching(/14:30/),
      ])
    );
  });

  it("returns 400 for invalid date format", async () => {
    const res = await request(app).get(route).query({ date: "2025/05/11" });

    expect(res.status).toBe(400);
  });
});
