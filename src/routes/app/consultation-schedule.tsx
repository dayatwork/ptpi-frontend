import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlotStatusBadge } from "@/modules/app/consultation/components/slot-status-badge";
import {
  ensureConsultationSchedulesData,
  useSuspenseConsultationSchedules,
} from "@/modules/app/consultation/consultation.query";

export const Route = createFileRoute("/app/consultation-schedule")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    ensureConsultationSchedulesData(queryClient),
});

function RouteComponent() {
  const { data } = useSuspenseConsultationSchedules();
  return (
    <div className="container py-6 md:py-8 mx-auto">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Consultation Schedule
        </h1>
      </div>
      {data.length > 0 ? (
        <ul>
          {data.map((schedule) => (
            <li
              key={schedule.id}
              className="px-4 py-2.5 border bg-muted rounded-md flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <Avatar className="rounded-md">
                  <AvatarImage
                    src={schedule.consultation.exhibitor.logo ?? ""}
                    className="object-contain"
                  />
                  <AvatarFallback className="font-semibold rounded-md bg-background">
                    {schedule.consultation.exhibitor.name[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">
                  {schedule.consultation.exhibitor.name}
                </p>
              </div>
              <div className="flex gap-10 items-center">
                <div className="text-sm font-semibold">
                  <time dateTime={schedule.startTime}>
                    {new Date(schedule.startTime).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </time>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <span>
                      {new Date(schedule.startTime).toLocaleTimeString(
                        "en-US",
                        {
                          timeStyle: "short",
                        }
                      )}
                    </span>
                    <span>-</span>
                    <span>
                      {new Date(schedule.endTime).toLocaleTimeString("en-US", {
                        timeStyle: "short",
                      })}
                    </span>
                  </p>
                </div>
                <SlotStatusBadge status={schedule.status} />
                <Link
                  to="/app/consultation-schedule/$id/room"
                  params={{ id: schedule.id }}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "pr-2.5"
                  )}
                >
                  Go to room <ArrowRight />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-14 bg-muted border border-dashed flex flex-col gap-2 items-center justify-center px-4 rounded-lg">
          <CalendarDays
            className="text-muted-foreground size-8"
            strokeWidth={1}
          />
          <p className="text-sm text-muted-foreground text-center">
            You don't have consultation schedule
          </p>
        </div>
      )}
    </div>
  );
}
