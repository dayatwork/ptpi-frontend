import { Badge, type Variant } from "@/components/ui/badge";
import { ValidStatus } from "../event.validation";

const variant: Record<ValidStatus, Variant> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  ONGOING: "purple",
  DONE: "success",
  CANCELED: "destructive",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ValidStatus;
  className?: string;
}) {
  return (
    <Badge variant={variant[status]} className={className}>
      {status}
    </Badge>
  );
}
