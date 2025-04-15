import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const seminarRoomSearchParams = z.object({
  from: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/app_/seminars_/$id_/room")({
  component: RouteComponent,
  validateSearch: zodValidator(seminarRoomSearchParams),
});

function RouteComponent() {
  const from = Route.useSearch().from || `/app/seminars`;

  return (
    <div className="p-6">
      <Link
        to={from}
        className={cn(buttonVariants({ variant: "secondary" }), "pl-3")}
      >
        <ArrowLeft />
        Back
      </Link>
    </div>
  );
}
