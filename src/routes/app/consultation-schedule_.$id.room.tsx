import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultationRoom } from "@/modules/app/consultation/components/consultation-room";
import { SlotStatusBadge } from "@/modules/app/consultation/components/slot-status-badge";
import { ensureConsultationSchedulesData } from "@/modules/app/consultation/consultation.query";
import { CONSULTATION_SLOT_STATUS } from "@/modules/app/consultation/consultation.validation";
import { useUserSession } from "@/modules/auth/auth.query";

export const Route = createFileRoute("/app/consultation-schedule_/$id/room")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const schedules = await ensureConsultationSchedulesData(queryClient);
    const schedule = schedules.find((schedule) => schedule.id === params.id);
    if (!schedule) {
      throw redirect({ to: "/app/consultation-schedule" });
    }
    if (
      schedule.status !== CONSULTATION_SLOT_STATUS.BOOKED &&
      schedule.status !== CONSULTATION_SLOT_STATUS.ONGOING
    ) {
      throw redirect({ to: "/app/consultation-schedule" });
    }
    return { schedule };
  },
});

function RouteComponent() {
  const { data } = useUserSession();
  const { schedule } = Route.useLoaderData();
  return (
    <div className="container py-6 md:py-8 mx-auto">
      <Link
        to="/app/consultation-schedule"
        className={cn(buttonVariants({ variant: "secondary" }), "mb-2")}
      >
        <ArrowLeft />
        Back to schedule list
      </Link>
      <div className="max-w-7xl flex items-start gap-6">
        <div className="flex-1">
          {schedule.status === "ONGOING" && (
            <ConsultationRoom
              participantName={data?.user.name ?? ""}
              roomName={schedule.id}
              label="Join consultation room"
            />
          )}
          {schedule.status === "BOOKED" && (
            <div className="aspect-video flex justify-center items-center bg-muted border rounded-lg">
              <p className="text-sm text-muted-foreground">
                The consultation room is not yet open{" "}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-3 w-[200px]">
          <div className="px-4 py-2.5 border rounded-lg bg-muted">
            <dt className="text-sm text-muted-foreground mb-1">Exhibitor</dt>
            <dd className="font-semibold">
              {schedule.consultation.exhibitor.name}
            </dd>
          </div>
          <div className="px-4 py-2.5 border rounded-lg bg-muted">
            <dt className="text-sm text-muted-foreground mb-1">Schedule</dt>
            <dd className="font-semibold">
              <time>
                {new Date(schedule.startTime).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </time>
              <p>
                {new Date(schedule.startTime).toLocaleTimeString("en-US", {
                  timeStyle: "short",
                })}{" "}
                -{" "}
                {new Date(schedule.endTime).toLocaleTimeString("en-US", {
                  timeStyle: "short",
                })}
              </p>
            </dd>
          </div>
          <div className="px-4 pt-2.5 pb-3.5 border rounded-lg bg-muted">
            <dt className="text-sm text-muted-foreground mb-1">Status</dt>
            <dd>
              <SlotStatusBadge status={schedule.status} />
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
