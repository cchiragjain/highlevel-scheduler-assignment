export const formatISOToHourMinute = (isoString: string): string => {
  const timePart = isoString.split("T")[1]; // e.g., "16:30:00.000-04:00"
  const [hourStr, minuteStr] = timePart.split(":");

  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12, 13 to 1, etc.

  return `${hours}:${minutes} ${ampm}`;
};

export const formatISOToDate = (isoString: string) => {
  const date = new Date(isoString);

  // Array of month names to get "May"
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatted = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  return formatted;
};
