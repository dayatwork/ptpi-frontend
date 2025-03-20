import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormatBadge } from "@/modules/seminar/components/format-badge";
import { PricingTypeBadge } from "@/modules/seminar/components/pricing-type-badge";
import { SeminarParticipantsTable } from "@/modules/seminar/components/seminar-participants-table";
import { StatusBadge } from "@/modules/seminar/components/status-badge";
import { useSeminar } from "@/modules/seminar/seminar.query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Handshake, Monitor, Users2 } from "lucide-react";

export const Route = createFileRoute("/admin/events_/$id/seminars/$seminarId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();
  const { data: seminar } = useSeminar({ id: params.seminarId });

  return (
    <Dialog
      open
      onOpenChange={(opened) => {
        if (!opened) {
          navigate({ to: "/admin/events/$id", params });
        }
      }}
    >
      <DialogContent className="h-[95vh] min-w-[98vw] flex flex-col">
        <DialogHeader>
          <DialogTitle>{seminar.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {seminar.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex gap-4 w-full items-start">
          <div className="border rounded-lg px-6 py-4 w-[300px] bg-muted">
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
                <dd className="-ml-0.5">
                  {<PricingTypeBadge type={seminar.pricingType} />}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Format</dt>
                <dd className="-ml-0.5">
                  {<FormatBadge format={seminar.format} />}
                </dd>
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
          </div>
          <Tabs defaultValue="participants" className="flex-1">
            <TabsList className="border">
              <TabsTrigger value="participants" className="w-[200px]">
                <Users2 />
                Participants
              </TabsTrigger>
              <TabsTrigger value="sponsorships" className="w-[200px]">
                <Handshake />
                Sponsorships
              </TabsTrigger>
              <TabsTrigger value="room" className="w-[200px]">
                <Monitor />
                Room
              </TabsTrigger>
            </TabsList>
            <TabsContent value="participants">
              <div className="bg-muted border p-4 rounded-lg">
                <h2 className="font-semibold mb-6">Participants</h2>
                <SeminarParticipantsTable seminarId={params.seminarId} />
              </div>
            </TabsContent>
            <TabsContent value="room">Seminar Room</TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
