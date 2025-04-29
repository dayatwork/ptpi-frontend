export type ConsultationSchedule = {
  id: string;
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
  consultation: {
    id: string;
    exhibitor: {
      id: string;
      name: string;
      logo: string | null;
    };
  };
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
