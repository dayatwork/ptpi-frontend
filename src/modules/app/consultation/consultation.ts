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
