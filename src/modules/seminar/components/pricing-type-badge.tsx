import { Badge, type Variant } from "@/components/ui/badge";
import { ValidPricingType } from "../seminar.validation";

const variant: Record<ValidPricingType, Variant> = {
  FREE: "outline",
  PAID: "warning",
};

export function PricingTypeBadge({ format }: { format: ValidPricingType }) {
  return <Badge variant={variant[format]}>{format}</Badge>;
}
