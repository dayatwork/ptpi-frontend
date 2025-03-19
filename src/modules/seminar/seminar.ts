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
  pricingType: "FREE" | "PAID";
  createdAt: string;
  updatedAt: string;
};
