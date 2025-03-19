import { Seminar } from "../seminar/seminar";

export type Event = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  startDate: string;
  endDate: string;
  location: string;
  format: "ONLINE" | "OFFLINE" | "HYBRID";
  status: "DRAFT" | "SCHEDULED" | "ONGOING" | "DONE" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  seminars: Seminar[];
};
