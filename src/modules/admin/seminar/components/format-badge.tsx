import { Badge, type Variant } from "@/components/ui/badge";
import { ValidFormat } from "../seminar.validation";

const variant: Record<ValidFormat, Variant> = {
  HYBRID: "purple",
  ONLINE: "success",
  OFFLINE: "blue",
};

export function FormatBadge({ format }: { format: ValidFormat }) {
  return <Badge variant={variant[format]}>{format}</Badge>;
}
