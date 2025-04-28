import { z } from "zod";

export const CONSULTATION_SLOT_STATUS = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  NOT_AVAILABLE: "NOT_AVAILABLE",
  DONE: "DONE",
  NOT_PRESENT: "NOT_PRESENT",
  CANCELED: "CANCELED",
} as const;
export const validSlotStatuses = Object.values(CONSULTATION_SLOT_STATUS);
export type ValidSlotStatus = (typeof validSlotStatuses)[number];

export const createConsultationSchema = z.object({
  eventId: z.string(),
  exhibitorId: z.string(),
  maxSlot: z.coerce.number().int().positive().optional(),
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;

export const createConsultationSlotSchema = z.object({
  consultationId: z.string(),
  slots: z.array(
    z.object({ startTime: z.coerce.date(), endTime: z.coerce.date() })
  ),
});

export type CreateConsultationSlotInput = z.infer<
  typeof createConsultationSlotSchema
>;

export const bookConsultationSchema = z.object({
  consultationId: z.string(),
  participantId: z.string(),
  slotId: z.string(),
});

export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;
