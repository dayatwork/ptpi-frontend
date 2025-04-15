import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Video } from "lucide-react";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  ensureRoomsData,
  useSuspenseRooms,
} from "@/modules/admin/meeting/room.query";

export const Route = createFileRoute("/admin/livekit-rooms")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => ensureRoomsData(queryClient),
});

function RouteComponent() {
  const { data } = useSuspenseRooms();
  return (
    <AdminContainer
      header={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Livekit Rooms</h1>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="border border-dashed rounded-lg py-10 flex justify-center items-center">
          <p className="text-sm text-muted-foreground text-center">
            There is no active rooms
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-4 gap-4">
          {data.map((room) => (
            <li key={room.sid} className="border px-4 py-3 rounded-lg">
              <div className="flex gap-2 items-start justify-between">
                <h3 className="font-semibold mb-2 flex-1">{room.name}</h3>
                <Video className="size-5 text-red-600 animate-pulse" />
                {room.activeRecording ? (
                  <Video className="size-5 text-red-600 animate-ping" />
                ) : null}
              </div>
              <dl className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">SID</dt>
                  <span>:</span>
                  <dd>{room.sid}</dd>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">
                    Num of participants
                  </dt>
                  <span>:</span>
                  <dd>{room.numParticipants}</dd>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">
                    Num of publishers
                  </dt>
                  <span>:</span>
                  <dd>{room.numPublishers}</dd>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">
                    Max participants
                  </dt>
                  <span>:</span>
                  <dd>{room.maxParticipants || "-"}</dd>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">Empty Timeout</dt>
                  <span>:</span>
                  <dd>{room.emptyTimeout} s</dd>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <dt className="w-32 text-muted-foreground">
                    Departure Timeout
                  </dt>
                  <span>:</span>
                  <dd>{room.departureTimeout} s</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </AdminContainer>
  );
}
