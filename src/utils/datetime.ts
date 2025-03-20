import {
  startOfDay,
  setHours,
  setMinutes,
  differenceInCalendarDays,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";

// Define supported timezones (for type safety)
const timezones = {
  "Asia/Jakarta": "Asia/Jakarta",
  "America/New_York": "America/New_York",
  "Europe/London": "Europe/London",
  "Asia/Tokyo": "Asia/Tokyo",
} as const;

type Timezone = keyof typeof timezones; // Restrict timezone values

export const getDefaultDate = (
  hours: number,
  minutes: number,
  timezone: Timezone = "Asia/Jakarta"
) => {
  const now = new Date();
  const localDate = setMinutes(setHours(startOfDay(now), hours), minutes); // Set specific time
  return fromZonedTime(localDate, timezones[timezone]); // Convert to UTC
};

export const getTotalDays = ({
  startDate,
  endDate,
}: {
  startDate: string | Date;
  endDate: string | Date;
}) => {
  return differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
};

export const isDateInRange = ({
  date,
  from,
  to,
}: {
  date: Date | string;
  from: Date | string;
  to: Date | string;
}) => {
  return new Date(date) >= new Date(from) && new Date(date) <= new Date(to);
};
