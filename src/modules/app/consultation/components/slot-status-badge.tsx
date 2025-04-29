import { Badge, type Variant } from "@/components/ui/badge";
import { ValidSlotStatus } from "../consultation.validation";

const variant: Record<ValidSlotStatus, Variant> = {
  AVAILABLE: "outline",
  NOT_AVAILABLE: "secondary",
  BOOKED: "blue",
  CANCELED: "destructive",
  DONE: "success",
  NOT_PRESENT: "warning",
  ONGOING: "purple",
};

export function SlotStatusBadge({ status }: { status: ValidSlotStatus }) {
  return <Badge variant={variant[status]}>{status}</Badge>;
}
