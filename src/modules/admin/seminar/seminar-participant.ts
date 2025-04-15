export type SeminarParticipant = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  seminarId: string;
  status: string;
  paymentStatus: string;
  registeredAt: string;
  paidAt: string | null;
  certificate: string | null;
};
