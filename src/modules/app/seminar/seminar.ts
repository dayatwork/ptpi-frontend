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

export type Participant = {
  id: string;
  status: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  seminarId: string;
  paymentStatus: string;
  registeredAt: Date;
  paidAt: Date | null;
  certificate: string | null;
};
