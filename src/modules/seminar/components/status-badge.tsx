import { Badge, type Variant } from "@/components/ui/badge";
import { ValidStatus } from "../seminar.validation";

const variant: Record<ValidStatus, Variant> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  ONGOING: "purple",
  DONE: "success",
  CANCELED: "destructive",
};

export function StatusBadge({ status }: { status: ValidStatus }) {
  return <Badge variant={variant[status]}>{status}</Badge>;
}
