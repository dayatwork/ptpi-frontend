import { Institution } from "../institution/institution";

export type Consultation = {
  id: string;
  eventId: string;
  exhibitorId: string;
  exhibitor: Institution;
  maxSlot: number | null;
};

export type ConsultationSlot = {
  id: string;
  consultationId: string;
  participantId: string | null;
  participantName: string | null;
  startTime: string;
  endTime: string;
  status:
    | "AVAILABLE"
    | "NOT_AVAILABLE"
    | "BOOKED"
    | "ONGOING"
    | "DONE"
    | "NOT_PRESENT"
    | "CANCELED";
};
