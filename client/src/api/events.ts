const API_URL = import.meta.env.VITE_API_URL;

export async function getFreeSlots(date: string, timezone: string) {
  const res = await fetch(
    `${API_URL}/api/free-slots?date=${date}&timezone=${timezone}`
  );
  if (!res.ok) throw new Error("Failed to get slots");
  return res.json();
}

export async function createEvent(datetime: string, duration: number) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datetime, duration }),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export const listEvents = async (startDate: string, endDate: string) => {
  const res = await fetch(
    `${API_URL}/api/list-events?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) throw new Error("Failed to list events for given dates");
  return res.json();
};
