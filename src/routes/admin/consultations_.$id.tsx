import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ConsultationActionDialog,
  useConsultationAction,
} from "@/modules/admin/consultation/components/consultation-action";
import { ConsultationDetailsHeader } from "@/modules/admin/consultation/components/consultation-details-header";
import { SlotStatusBadge } from "@/modules/admin/consultation/components/slot-status-badge";
import {
  ensureConsultationData,
  useSuspenseConsultation,
} from "@/modules/admin/consultation/consultation.query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MoreHorizontal, Video } from "lucide-react";

export const Route = createFileRoute("/admin/consultations_/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureConsultationData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const { data: consultation } = useSuspenseConsultation({
    id: Route.useParams().id,
  });
  const {
    createSlot,
    setOpen,
    state,
    bookSlot,
    markSlotAsAvailable,
    markSlotAsDone,
    markSlotAsNotAvailable,
    markSlotAsNotPresent,
    removeSlotParticipant,
  } = useConsultationAction();
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
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-md">
              <AvatarImage
                src={consultation.exhibitor.logo ?? ""}
                className="object-contain"
              />
              <AvatarFallback className="text-lg font-semibold rounded-md">
                {consultation.exhibitor.name[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-semibold">
              {consultation.exhibitor.name}
            </h1>
          </div>
          {consultation.slots.length === 0 && (
            <Button onClick={createSlot}>Create Consultation Slot</Button>
          )}
        </div>
        <h2 className="font-semibold mb-2 text-sm">Event Info</h2>
        <div className="px-4 py-3 border rounded-lg bg-muted/40 mb-4">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <dt className="w-28 text-muted-foreground">Title</dt>
              <dd>{consultation.event.title}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="w-28 text-muted-foreground">Description</dt>
              <dd>{consultation.event.description}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="w-28 text-muted-foreground">Date & Time</dt>
              <dd>
                {new Date(consultation.event.startDate).toLocaleString(
                  "en-US",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                    hourCycle: "h24",
                  }
                )}{" "}
                -{" "}
                {new Date(consultation.event.endDate).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hourCycle: "h24",
                })}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="font-semibold text-sm">Consultation Slots</h2>
          <div className="border rounded-md mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] pl-4">#</TableHead>
                  <TableHead className="w-44">Start Time</TableHead>
                  <TableHead className="w-44">End Time</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="w-44">Room</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultation.slots.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No slots available
                    </TableCell>
                  </TableRow>
                )}
                {consultation.slots.map((slot, i) => (
                  <TableRow key={slot.id}>
                    <TableCell className="pl-4">{i + 1}</TableCell>
                    <TableCell>
                      {new Date(slot.startTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        hourCycle: "h24",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(slot.endTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        hourCycle: "h24",
                      })}
                    </TableCell>
                    <TableCell>{slot.participantName || "-"}</TableCell>
                    <TableCell>
                      {(slot.status === "BOOKED" ||
                        slot.status === "ONGOING") && (
                        <Link
                          to="/admin/consultations/$id/room/$slotId"
                          params={{ id: consultation.id, slotId: slot.id }}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "h-8"
                          )}
                        >
                          Go to room <Video />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <SlotStatusBadge status={slot.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!!slot.participantId}
                            onClick={() => bookSlot(slot)}
                          >
                            Book
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!slot.participantId}
                            onClick={() => {
                              removeSlotParticipant(slot);
                            }}
                          >
                            Remove Participant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={slot.status !== "AVAILABLE"}
                            onClick={() => markSlotAsNotAvailable(slot)}
                          >
                            Mark as not available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={slot.status !== "NOT_AVAILABLE"}
                            onClick={() => markSlotAsAvailable(slot)}
                          >
                            Mark as available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={
                              slot.status !== "BOOKED" &&
                              slot.status !== "NOT_PRESENT"
                            }
                            onClick={() => markSlotAsDone(slot)}
                          >
                            Mark as done
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={
                              slot.status !== "BOOKED" && slot.status !== "DONE"
                            }
                            onClick={() => markSlotAsNotPresent(slot)}
                          >
                            Mark as not present
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={!!slot.participantId}>
                            Delete Slot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminContainer>
    </>
  );
}
