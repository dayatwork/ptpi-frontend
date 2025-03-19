import { createFileRoute } from "@tanstack/react-router";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { EventsHeader } from "@/modules/event/components/events-header";
import { EventsTable } from "@/modules/event/components/events-table";
import { ensureEventsData } from "@/modules/event/event.query";

export const Route = createFileRoute("/admin/events")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => ensureEventsData(queryClient),
});

function RouteComponent() {
  return (
    <AdminContainer header={<EventsHeader />}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Events</h1>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min mt-4 overflow-hidden calc(100vw-16rem)">
        <EventsTable />
      </div>
    </AdminContainer>
  );
}
