import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-green-600 text-green-50 hover:bg-green-600/80",
        warning:
          "border-transparent bg-orange-600 text-orange-50 hover:bg-orange-600/80",
        rose: "border-transparent bg-rose-600 text-rose-50 hover:bg-rose-600/80",
        purple:
          "border-transparent bg-purple-600 text-purple-50 hover:bg-purple-600/80",
        yellow:
          "border-transparent bg-yellow-600 text-yellow-50 hover:bg-yellow-600/80",
        blue: "border-transparent bg-blue-600 text-blue-50 hover:bg-blue-600/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export type Variant = VariantProps<typeof badgeVariants>["variant"];

export { Badge, badgeVariants };
