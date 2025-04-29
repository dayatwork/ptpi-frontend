import { z } from "zod";

export const CONSULTATION_SLOT_STATUS = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  NOT_AVAILABLE: "NOT_AVAILABLE",
  DONE: "DONE",
  NOT_PRESENT: "NOT_PRESENT",
  CANCELED: "CANCELED",
  ONGOING: "ONGOING",
} as const;
export const validSlotStatuses = Object.values(CONSULTATION_SLOT_STATUS);
export type ValidSlotStatus = (typeof validSlotStatuses)[number];

export const bookConsultationSchema = z.object({
  slotId: z.string(),
});

export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
