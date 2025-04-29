import { ValidSlotStatus } from "../consultation/consultation.validation";
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
  activities: string[];
  createdAt: string;
  updatedAt: string;
};

export type ConsultationWithSlot = {
  id: string;
  exhibitor: {
    id: string;
    name: string;
    logo: string | null;
  };
  slots: {
    id: string;
    startTime: string;
    endTime: string;
    status: ValidSlotStatus;
  }[];
};

export type EventDetail = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  startDate: string;
  endDate: string;
  location: string;
  format: "ONLINE" | "OFFLINE" | "HYBRID";
  status: "DRAFT" | "SCHEDULED" | "ONGOING" | "DONE" | "CANCELED";
  seminars: Seminar[];
  consultations: ConsultationWithSlot[];
  createdAt: string;
  updatedAt: string;
};
