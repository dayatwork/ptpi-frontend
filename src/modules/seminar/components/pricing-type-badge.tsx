import { Badge, type Variant } from "@/components/ui/badge";
import { ValidPricingType } from "../seminar.validation";

const variant: Record<ValidPricingType, Variant> = {
  FREE: "outline",
  PAID: "warning",
};

export function PricingTypeBadge({ type }: { type: ValidPricingType }) {
  return <Badge variant={variant[type]}>{type}</Badge>;
}
