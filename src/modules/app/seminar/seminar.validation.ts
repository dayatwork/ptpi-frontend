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
