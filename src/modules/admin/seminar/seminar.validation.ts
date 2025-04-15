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

export const createSeminarSchema = z
  .object({
    title: z.string().min(1, "Required"),
    eventId: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().optional(),
    format: z.enum(validFormats),
    price: z.coerce.number().min(0),
  })
  .refine((arg) => new Date(arg.endDate) > new Date(arg.startDate), {
    message: "End Date must be after Start Date",
    path: ["endDate"],
  });

export type CreateSeminarInput = z.infer<typeof createSeminarSchema>;

export const editSeminarSchema = z
  .object({
    id: z.string(),
    title: z.string().nonempty(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().optional(),
    format: z.enum(validFormats),
    price: z.coerce.number().min(0),
  })
  .refine((arg) => new Date(arg.endDate) > new Date(arg.startDate), {
    message: "End Date must be after Start Date",
    path: ["endDate"],
  });

export type EditSeminarInput = z.infer<typeof editSeminarSchema>;
