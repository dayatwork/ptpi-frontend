import { z } from "zod";

export const validFormats = ["ONLINE", "OFFLINE", "HYBRID"] as const;
export type ValidFormat = (typeof validFormats)[number];

export const validStatuses = [
  "DRAFT",
  "SCHEDULED",
  "ONGOING",
  "DONE",
  "CANCELED",
] as const;
export type ValidStatus = (typeof validStatuses)[number];

export const createEventSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional(),
  format: z.enum(validFormats),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const editEventSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional(),
  format: z.enum(validFormats),
});

export type EditEventInput = z.infer<typeof editEventSchema>;
