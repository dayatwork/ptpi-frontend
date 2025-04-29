import { useSession } from "@/auth/auth-client";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ConsultationActionDialog,
  useConsultationAction,
} from "@/modules/admin/consultation/components/consultation-action";
import { ConsultationDetailsHeader } from "@/modules/admin/consultation/components/consultation-details-header";
import { ConsultationRoomAdmin } from "@/modules/admin/consultation/components/consultation-room-admin";
import { SlotStatusBadge } from "@/modules/admin/consultation/components/slot-status-badge";
import {
  ensureConsultationData,
  useSuspenseConsultation,
} from "@/modules/admin/consultation/consultation.query";
import { CONSULTATION_SLOT_STATUS } from "@/modules/admin/consultation/consultation.validation";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, PhoneOff } from "lucide-react";

export const Route = createFileRoute("/admin/consultations_/$id_/room/$slotId")(
  {
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) =>
      ensureConsultationData({ id: params.id }, queryClient),
  }
);

function RouteComponent() {
  const { data: session } = useSession();
  const params = Route.useParams();
  const { data: consultation } = useSuspenseConsultation({
    id: params.id,
  });
  const { start, state, setOpen, end } = useConsultationAction();
  const slot = consultation.slots.find((slot) => slot.id === params.slotId);

  if (!slot) return <Navigate to="/admin/consultations/$id" params={params} />;

  return (
    <>
      <ConsultationActionDialog
        consultation={consultation}
        setOpen={setOpen}
        state={state}
      />
      <AdminContainer
        header={
          <ConsultationDetailsHeader
            title={consultation.exhibitor.name}
            event={consultation.event}
          />
        }
      >
        <Link
          to="/admin/consultations/$id"
          params={params}
          className={cn(buttonVariants({ variant: "secondary" }), "mb-2")}
        >
          <ArrowLeft />
          Back to consultation list
        </Link>

        <div className="max-w-7xl flex items-start gap-6">
          <div className="flex-1">
            {slot.status === CONSULTATION_SLOT_STATUS.ONGOING && (
              <ConsultationRoomAdmin
                participantName={session?.user.name ?? ""}
                roomName={params.slotId}
                label="Join consultation room"
              />
            )}
            {slot.status === CONSULTATION_SLOT_STATUS.BOOKED && (
              <div className="aspect-video flex justify-center items-center bg-muted border rounded-lg">
                <Button onClick={() => start(slot)}>Start Consultation</Button>
              </div>
            )}
            {slot.status === CONSULTATION_SLOT_STATUS.DONE && (
              <div className="aspect-video flex flex-col gap-2 justify-center items-center bg-muted border rounded-lg">
                <PhoneOff className="text-green-600 size-8" />
                <p>Consultation is over</p>
              </div>
            )}
          </div>
          <div className="space-y-3 w-[200px]">
            <div className="px-4 py-2.5 border rounded-lg bg-muted">
              <dt className="text-sm text-muted-foreground mb-1">Exhibitor</dt>
              <dd className="font-semibold">{consultation.exhibitor.name}</dd>
            </div>
            <div className="px-4 py-2.5 border rounded-lg bg-muted">
              <dt className="text-sm text-muted-foreground mb-1">Schedule</dt>
              <dd className="font-semibold">
                <time>
                  {new Date(slot.startTime).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </time>
                <p>
                  {new Date(slot.startTime).toLocaleTimeString("en-US", {
                    timeStyle: "short",
                  })}{" "}
                  -{" "}
                  {new Date(slot.endTime).toLocaleTimeString("en-US", {
                    timeStyle: "short",
                  })}
                </p>
              </dd>
            </div>
            <div className="px-4 py-2.5 border rounded-lg bg-muted">
              <dt className="text-sm text-muted-foreground mb-1">
                Registered Participant
              </dt>
              <dd className="font-semibold">{slot.participantName}</dd>
            </div>
            <div className="px-4 pt-2.5 pb-3.5 border rounded-lg bg-muted">
              <dt className="text-sm text-muted-foreground mb-1">Status</dt>
              <dd>
                <SlotStatusBadge status={slot.status} />
              </dd>
            </div>
            {slot.status === CONSULTATION_SLOT_STATUS.ONGOING && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => end(slot)}
              >
                <PhoneOff />
                End Consultation
              </Button>
            )}
          </div>
        </div>
      </AdminContainer>
    </>
  );
}
