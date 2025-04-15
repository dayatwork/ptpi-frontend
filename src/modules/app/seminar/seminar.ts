export type Seminar = {
  id: string;
  eventId: string | null;
  title: string;
  description: string;
  thumbnail: string | null;
  startDate: string;
  endDate: string;
  location: string;
  format: "ONLINE" | "OFFLINE" | "HYBRID";
  status: "DRAFT" | "SCHEDULED" | "ONGOING" | "DONE" | "CANCELED";
  price: number;
  isRegistrationOpen: boolean;
  onlineRoomId: string | null;
  isRoomOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SeminarParticipation = {
  seminarId: string;
  status: string;
  registeredAt: string;
};
