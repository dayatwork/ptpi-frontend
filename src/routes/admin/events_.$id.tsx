import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  CalendarDays,
  Handshake,
  HouseIcon,
  MapPin,
  Settings,
  TableOfContents,
} from "lucide-react";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetailActivities } from "@/modules/admin/event/components/event-detail-activities";
import { EventDetailHeader } from "@/modules/admin/event/components/event-detail-header";
import { EventDetailOverview } from "@/modules/admin/event/components/event-detail-overview";
import { FormatBadge } from "@/modules/admin/event/components/format-badge";
import { StatusBadge } from "@/modules/admin/event/components/status-badge";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";

export const Route = createFileRoute("/admin/events_/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  return (
    <>
      <Outlet />
      <AdminContainer header={<EventDetailHeader title={data.title} />}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="space-y-1 w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{data.title}</h1>
              <StatusBadge
                status={data.status}
                className="px-4 py-1 text-base"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {data.description}
            </p>
            <dl className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <dt>
                  <CalendarDays className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  <time dateTime={data.startDate}>
                    {new Date(data.startDate).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: false,
                    })}
                  </time>{" "}
                  -{" "}
                  <time dateTime={data.endDate}>
                    {new Date(data.endDate).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: false,
                    })}
                  </time>
                </dd>
              </div>
              <div className="flex gap-2 items-center">
                <dt>
                  <Settings className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  <FormatBadge format={data.format} />
                </dd>
              </div>
              <div className="flex gap-2 items-center">
                <dt>
                  <MapPin className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  {data.location}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <Tabs defaultValue="activities">
          <ScrollArea>
            <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-full justify-start">
              <TabsTrigger
                value="overview"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <HouseIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <TableOfContents
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Activities
              </TabsTrigger>

              <TabsTrigger
                value="sponsorships"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Handshake
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Sponsorships
                <Badge className="ms-1.5">2</Badge>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="overview">
            <EventDetailOverview event={data} />
          </TabsContent>
          <TabsContent value="activities">
            <EventDetailActivities event={data} />
          </TabsContent>

          <TabsContent value="sponsorships">
            <p className="text-muted-foreground pt-1 text-center text-xs">
              Content for Tab 4
            </p>
          </TabsContent>
        </Tabs>
      </AdminContainer>
    </>
  );
}
