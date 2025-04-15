import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MeetingRoom } from "@/modules/admin/meeting/components/meeting-room";
import { FormatBadge } from "@/modules/admin/seminar/components/format-badge";
import {
  SeminarActionDialog,
  useSeminarAction,
} from "@/modules/admin/seminar/components/seminar-action";
import { SeminarDetailsHeader } from "@/modules/admin/seminar/components/seminar-details-header";
import { SeminarParticipantsTable } from "@/modules/admin/seminar/components/seminar-participants-table";
import { StatusBadge } from "@/modules/admin/seminar/components/status-badge";
import { Seminar } from "@/modules/admin/seminar/seminar";
import {
  ensureSeminarData,
  useSuspenseSeminar,
} from "@/modules/admin/seminar/seminar.query";
import { useUserSession } from "@/modules/auth/auth.query";
import { rupiahFormatter } from "@/utils/currency";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  CheckCircle,
  DoorClosed,
  DoorOpen,
  FileText,
  Handshake,
  PenSquare,
  Play,
  Rocket,
  Trash2,
  Users2,
  X,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/seminars_/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureSeminarData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const { data: seminar } = useSuspenseSeminar({ id: Route.useParams().id });
  const { data: userSession } = useUserSession();
  const {
    state,
    deleteSeminar,
    editSeminar,
    cancelSeminar,
    endSeminar,
    startSeminar,
    setOpen,
  } = useSeminarAction();

  return (
    <>
      <SeminarActionDialog seminar={seminar} setOpen={setOpen} state={state} />
      <AdminContainer
        header={
          <SeminarDetailsHeader title={seminar.title} event={seminar.event} />
        }
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{seminar.title}</h1>
            <p className="text-muted-foreground">{seminar.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <dl className="flex gap-4 items-center">
              <div className="flex gap-1 items-center text-muted-foreground">
                <dt>Registration</dt>
                <span>:</span>
                <dd>
                  {seminar.isRegistrationOpen ? (
                    <Badge>OPEN</Badge>
                  ) : (
                    <Badge variant="secondary">CLOSED</Badge>
                  )}
                </dd>
              </div>
              <div className="flex gap-1 items-center text-muted-foreground">
                <dt>Status</dt>
                <span>:</span>
                <dd>
                  <StatusBadge status={seminar.status} />
                </dd>
              </div>
            </dl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Action</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={editSeminar}>
                  <PenSquare />
                  Edit Seminar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {seminar.isRegistrationOpen ? (
                  <DropdownMenuItem>
                    <DoorClosed />
                    Close Registration
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <DoorOpen />
                    Open Registration
                  </DropdownMenuItem>
                )}

                {seminar.status === "DRAFT" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Rocket />
                      Publish Seminar
                    </DropdownMenuItem>
                  </>
                )}
                {seminar.status === "SCHEDULED" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={startSeminar}>
                      <Play />
                      Start Seminar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={cancelSeminar}>
                      <X />
                      Cancel Seminar
                    </DropdownMenuItem>
                  </>
                )}
                {seminar.status === "ONGOING" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={endSeminar}>
                      <Check />
                      End Seminar
                    </DropdownMenuItem>
                  </>
                )}
                {seminar.status === "CANCELED" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-600/10 focus:text-red-600"
                      onClick={deleteSeminar}
                    >
                      <Trash2 className="text-red-600/70" />
                      Delete Seminar
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 flex gap-4 w-full items-start">
          <div className="max-w-3xl xl:max-w-5xl w-full">
            {userSession ? (
              <div className="aspect-video">
                {seminar.onlineRoomId ? (
                  <MeetingRoom
                    label="The seminar has started. Please enter the room."
                    roomName={seminar.onlineRoomId}
                    participantName={userSession.user.name}
                  />
                ) : (
                  <div className="bg-muted border rounded-md h aspect-video flex flex-col gap-2 justify-center items-center p-4">
                    {seminar.status === "DRAFT" && (
                      <>
                        <p className="text-center">
                          Seminar has not been published yet
                        </p>
                        <Button onClick={startSeminar}>
                          <Rocket />
                          Publish Seminar
                        </Button>
                      </>
                    )}
                    {seminar.status === "SCHEDULED" && (
                      <>
                        <p className="text-center">
                          The seminar has not started yet. Start a seminar to
                          create a room
                        </p>
                        <Button onClick={startSeminar}>
                          <Play />
                          Start Seminar
                        </Button>
                      </>
                    )}
                    {seminar.status === "DONE" && (
                      <>
                        <CheckCircle className="size-8 text-green-600" />
                        <p className="text-center">
                          The seminar has been completed
                        </p>
                      </>
                    )}
                    {seminar.status === "CANCELED" && (
                      <>
                        <XCircle className="size-8 text-red-600" />
                        <p className="text-center">
                          The seminar has been cancelled
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            {["DRAFT", "SCHEDULED", "ONGOING"].includes(seminar.status) && (
              <dl className="grid grid-cols-2 gap-4 mt-4">
                <div className="px-4 py-2 border rounded-md flex flex-col bg-muted">
                  <dt className="text-muted-foreground font-semibold">
                    Room ID
                  </dt>
                  <dd className="font-semibold text-xl">
                    {seminar.onlineRoomId || "-"}
                  </dd>
                </div>
                <div className="px-4 py-2 border rounded-md flex flex-col bg-muted">
                  <dt className="text-muted-foreground font-semibold">
                    Room Status
                  </dt>
                  <dd
                    className={cn(
                      "font-semibold text-xl",
                      seminar.isRoomOpen ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {seminar.isRoomOpen ? "OPEN" : "CLOSED"}
                  </dd>
                </div>
              </dl>
            )}
          </div>
          <Tabs defaultValue="details" className="flex-1">
            <TabsList className="border">
              <TabsTrigger value="details" className="px-4">
                <FileText />
                Details
              </TabsTrigger>
              <TabsTrigger value="participants" className="px-4">
                <Users2 />
                Participants
              </TabsTrigger>
              <TabsTrigger value="sponsorships" className="px-4">
                <Handshake />
                Sponsorships
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="bg-muted border p-4 rounded-lg">
                <SeminarDetails seminar={seminar} />
              </div>
            </TabsContent>
            <TabsContent value="participants">
              <div className="bg-muted border p-4 rounded-lg relative">
                <SeminarParticipantsTable seminarId={Route.useParams().id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminContainer>
    </>
  );
}

function SeminarDetails({ seminar }: { seminar: Seminar }) {
  return (
    <>
      <h2 className="font-semibold mb-6">Details</h2>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-muted-foreground">Title</dt>
          <dd className="text-sm font-semibold">{seminar.title}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Description</dt>
          <dd className="text-sm font-semibold">{seminar.description}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Pricing</dt>
          <dd>
            {seminar.price ? rupiahFormatter.format(seminar.price) : "FREE"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Format</dt>
          <dd className="-ml-0.5">{<FormatBadge format={seminar.format} />}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Location</dt>
          <dd className="text-sm font-semibold">{seminar.location}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Start at</dt>
          <dd className="text-sm font-semibold">
            {new Date(seminar.startDate).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">End at</dt>
          <dd className="text-sm font-semibold">
            {new Date(seminar.endDate).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd className="text-sm font-semibold -ml-0.5">
            <StatusBadge status={seminar.status} />
          </dd>
        </div>
      </dl>
    </>
  );
}
